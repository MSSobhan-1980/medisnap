
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
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.error('OPENAI_API_KEY not configured');
      throw new Error('OPENAI_API_KEY not configured');
    }

    console.log('OpenAI API Key found, processing request...');

    const requestBody = await req.json();
    const { imageUrl, userId, scanId } = requestBody;

    console.log('Processing prescription OCR request:', { userId, scanId });

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create a scan record if scanId is not provided
    let actualScanId = scanId;
    if (!actualScanId) {
      const { data: scanData, error: scanError } = await supabase
        .from('prescription_scans')
        .insert({
          user_id: userId,
          image_url: imageUrl,
          processing_status: 'processing'
        })
        .select()
        .single();

      if (scanError) {
        console.error('Error creating scan record:', scanError);
        throw new Error('Failed to create scan record');
      }
      
      actualScanId = scanData.id;
    } else {
      // Update existing scan to processing
      await supabase
        .from('prescription_scans')
        .update({ processing_status: 'processing' })
        .eq('id', actualScanId);
    }

    // Extract base64 content from data URL
    let base64Image;
    if (imageUrl.startsWith('data:image/')) {
      base64Image = imageUrl.split(',')[1];
    } else {
      // If it's a URL, fetch the image and convert to base64
      console.log('Fetching image from URL:', imageUrl);
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image: ${imageResponse.status}`);
      }
      
      const imageBuffer = await imageResponse.arrayBuffer();
      base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));
    }

    // Prepare OpenAI API request with GPT-4o
    const openaiPayload = {
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
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
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 2048,
      temperature: 0.1
    };

    // Call OpenAI API
    console.log('Calling OpenAI API with GPT-4o...');
    const openaiResponse = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(openaiPayload),
      }
    );

    const openaiData = await openaiResponse.json();
    console.log('OpenAI response status:', openaiResponse.status);

    if (!openaiResponse.ok) {
      console.error('OpenAI API error:', openaiData);
      throw new Error(`OpenAI API error: ${openaiData.error?.message || 'Unknown error'}`);
    }

    if (!openaiData.choices || !openaiData.choices[0]) {
      throw new Error('No response from OpenAI API');
    }

    const extractedText = openaiData.choices[0].message.content;
    console.log('Extracted text length:', extractedText.length);
    
    // Try to parse JSON from the response
    let extractedMedications = [];
    try {
      // Extract JSON from the text response
      const jsonMatch = extractedText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        extractedMedications = JSON.parse(jsonMatch[0]);
        console.log('Parsed medications:', extractedMedications.length);
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
        ai_analysis: openaiData,
        extracted_medications: extractedMedications,
        processing_status: 'completed'
      })
      .eq('id', actualScanId);

    if (updateError) {
      console.error('Error updating scan record:', updateError);
      throw updateError;
    }

    console.log('OCR processing completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        extractedText,
        extractedMedications,
        scanId: actualScanId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in prescription OCR:', error);

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
