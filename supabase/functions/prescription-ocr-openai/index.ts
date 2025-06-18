
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
    // Get OpenAI API Key
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.error('OPENAI_API_KEY not found in environment');
      return new Response(
        JSON.stringify({ 
          error: 'OpenAI API key not configured',
          success: false 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Processing OCR request...');

    // Parse request body
    const { imageData, userId } = await req.json();
    
    if (!imageData || !userId) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: imageData or userId',
          success: false 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Extract base64 data from data URL
    let base64Image = imageData;
    if (imageData.startsWith('data:image/')) {
      base64Image = imageData.split(',')[1];
    }

    console.log('Calling OpenAI API...');

    // Call OpenAI Vision API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this prescription image and extract all medication information. Return ONLY a valid JSON array in this exact format:
[
  {
    "medication_name": "exact name from prescription",
    "generic_name": "generic name if available or empty string",
    "dosage": "dosage with units",
    "dosing_pattern": "pattern like 1+0+1 or frequency description",
    "frequency": "once daily, twice daily, etc",
    "instructions": "special instructions or empty string",
    "timing": "before_food/with_food/after_food or empty string"
  }
]

Important: Return ONLY the JSON array, no other text. If you can't read something clearly, use empty string for that field.`
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
        max_tokens: 1500,
        temperature: 0.1
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('OpenAI API Error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const openaiData = await openaiResponse.json();
    const extractedText = openaiData.choices[0]?.message?.content;

    if (!extractedText) {
      throw new Error('No response from OpenAI API');
    }

    console.log('Raw OpenAI response:', extractedText);

    // Parse the JSON response
    let extractedMedications = [];
    try {
      // Clean the response and try to parse JSON
      const cleanedText = extractedText.trim();
      const jsonMatch = cleanedText.match(/\[[\s\S]*\]/);
      
      if (jsonMatch) {
        extractedMedications = JSON.parse(jsonMatch[0]);
      } else {
        // Try parsing the entire response
        extractedMedications = JSON.parse(cleanedText);
      }
      
      console.log('Parsed medications:', extractedMedications);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      // Fallback: create a basic structure
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

    // Create scan record
    const { data: scanData, error: scanError } = await supabase
      .from('prescription_scans')
      .insert({
        user_id: userId,
        image_url: imageData,
        ocr_text: extractedText,
        ai_analysis: openaiData,
        extracted_medications: extractedMedications,
        processing_status: 'completed'
      })
      .select()
      .single();

    if (scanError) {
      console.error('Error creating scan record:', scanError);
      // Continue without failing the entire request
    }

    console.log('OCR processing completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        extractedText,
        extractedMedications,
        scanId: scanData?.id || null
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
