
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
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.status}`);
    }
    
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));

    // Prepare Gemini API request with improved prompt
    const geminiPayload = {
      contents: [{
        parts: [
          {
            text: `You are a medical prescription OCR assistant. Analyze this prescription image and extract all medication information. 

Return ONLY a valid JSON array in this exact format (no additional text, explanations, or markdown):
[
  {
    "medication_name": "exact medication name from prescription",
    "generic_name": "generic name if mentioned, otherwise empty string",
    "dosage": "dosage with units (e.g., 10mg, 5ml)",
    "dosing_pattern": "pattern like 1+0+1 for morning+noon+evening, or frequency description",
    "frequency": "how often to take (e.g., twice daily, once daily)",
    "instructions": "any special instructions like 'take with food'",
    "timing": "before_food, with_food, after_food, or empty string if not specified"
  }
]

Important:
- Extract only medications, not other text
- If you can't read something clearly, use empty string ""
- Ensure valid JSON format
- Include all medications found on the prescription`
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

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', geminiResponse.status, errorText);
      throw new Error(`Gemini API error: ${geminiResponse.status} - ${errorText}`);
    }

    const geminiData = await geminiResponse.json();
    console.log('Gemini response:', JSON.stringify(geminiData, null, 2));

    if (!geminiData.candidates || !geminiData.candidates[0]) {
      throw new Error('No response from Gemini API');
    }

    const extractedText = geminiData.candidates[0].content.parts[0].text;
    
    // Try to parse JSON from the response
    let extractedMedications = [];
    try {
      // Clean the response text and extract JSON
      const cleanedText = extractedText.trim();
      
      // Try to find JSON array in the response
      const jsonMatch = cleanedText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        extractedMedications = JSON.parse(jsonMatch[0]);
      } else if (cleanedText.startsWith('[') && cleanedText.endsWith(']')) {
        extractedMedications = JSON.parse(cleanedText);
      } else {
        // If no valid JSON found, create a basic structure
        console.log('No valid JSON found in response, creating fallback');
        extractedMedications = [{
          medication_name: "Could not parse prescription clearly",
          generic_name: "",
          dosage: "",
          dosing_pattern: "",
          frequency: "",
          instructions: "Please review the extracted text and enter manually",
          timing: ""
        }];
      }
    } catch (parseError) {
      console.error('Error parsing extracted medications:', parseError);
      console.log('Raw extracted text:', extractedText);
      
      // Fallback: create a basic structure from the text
      extractedMedications = [{
        medication_name: "Parsing error - please review manually",
        generic_name: "",
        dosage: "",
        dosing_pattern: "",
        frequency: "",
        instructions: extractedText.substring(0, 500), // Truncate long text
        timing: ""
      }];
    }

    // Validate extracted medications format
    if (!Array.isArray(extractedMedications)) {
      extractedMedications = [extractedMedications];
    }

    // Ensure each medication has required fields
    extractedMedications = extractedMedications.map(med => ({
      medication_name: med.medication_name || "",
      generic_name: med.generic_name || "",
      dosage: med.dosage || "",
      dosing_pattern: med.dosing_pattern || "",
      frequency: med.frequency || "",
      instructions: med.instructions || "",
      timing: med.timing || ""
    }));

    console.log('Final extracted medications:', extractedMedications);

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
      console.error('Database update error:', updateError);
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
      const body = await req.clone().json();
      const { scanId } = body;
      
      if (scanId) {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        await supabase
          .from('prescription_scans')
          .update({ 
            processing_status: 'failed',
            ocr_text: error.message 
          })
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
