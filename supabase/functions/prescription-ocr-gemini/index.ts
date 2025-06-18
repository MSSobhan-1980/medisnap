
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { imageUrl, userId, scanId } = await req.json();

    console.log('Processing prescription OCR for scan:', scanId);

    // Update status to processing
    await supabase
      .from('prescription_scans')
      .update({ processing_status: 'processing' })
      .eq('id', scanId);

    // Fetch image and convert to base64
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));

    // Prepare Gemini API request
    const geminiPayload = {
      contents: [{
        parts: [
          {
            text: `Analyze this prescription image and extract all medication information. Return the data in this exact JSON format:
            [
              {
                "medication_name": "exact name from prescription",
                "generic_name": "generic name if available",
                "dosage": "dosage with units",
                "dosing_pattern": "pattern like 1+0+1 (morning+noon+evening)",
                "frequency": "frequency description",
                "instructions": "any special instructions",
                "timing": "before_food/with_food/after_food if mentioned"
              }
            ]
            
            Be very accurate with medication names and dosages. If you can't read something clearly, note it as "unclear". Focus only on medications, not other text.`
          },
          {
            inline_data: {
              mime_type: "image/jpeg",
              data: base64Image
            }
          }
        ]
      }],
      generationConfig: {
        temperature: 0.1,
        topK: 32,
        topP: 1,
        maxOutputTokens: 2048,
      }
    };

    // Call Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(geminiPayload),
      }
    );

    const geminiData = await geminiResponse.json();
    console.log('Gemini response:', geminiData);

    if (!geminiData.candidates || !geminiData.candidates[0]) {
      throw new Error('No response from Gemini API');
    }

    const extractedText = geminiData.candidates[0].content.parts[0].text;
    
    // Try to parse JSON from the response
    let extractedMedications = [];
    try {
      // Extract JSON from the text response
      const jsonMatch = extractedText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        extractedMedications = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error('Error parsing extracted medications:', parseError);
      // Fallback: create a basic structure from the text
      extractedMedications = [{
        medication_name: "Error parsing prescription",
        generic_name: "",
        dosage: "",
        dosing_pattern: "",
        frequency: "",
        instructions: extractedText,
        timing: ""
      }];
    }

    // Update the prescription scan with results
    const { error: updateError } = await supabase
      .from('prescription_scans')
      .update({
        ocr_text: extractedText,
        ai_analysis: geminiData,
        extracted_medications: extractedMedications,
        processing_status: 'completed'
      })
      .eq('id', scanId);

    if (updateError) {
      throw updateError;
    }

    console.log('OCR processing completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        extractedText,
        extractedMedications,
        scanId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in prescription OCR:', error);

    // Try to update status to failed if we have the scanId
    try {
      const { scanId } = await req.json();
      if (scanId) {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        await supabase
          .from('prescription_scans')
          .update({ processing_status: 'failed' })
          .eq('id', scanId);
      }
    } catch (updateError) {
      console.error('Error updating scan status to failed:', updateError);
    }

    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
