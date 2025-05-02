
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.2.1";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { imageBase64 } = await req.json();
    
    // Check if API key exists before creating client
    const apiKey = Deno.env.get("GOOGLE_AI_API_KEY");
    if (!apiKey) {
      console.error("Google AI API key is not configured");
      return new Response(JSON.stringify({ error: "Google AI API key is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Initialize Google Generative AI with API key
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Extract detailed information from this prescription or medication label. 
    Pay special attention to dosing schedules using these patterns:
    - (1+0+0) means morning dose only
    - (0+1+0) means afternoon dose only
    - (0+0+1) means evening dose only
    - (1+1+0) means morning and afternoon doses
    - (1+1+1) means doses three times a day

    Return a JSON array of medications with these fields for each medication:
    - medication_name: The name of the medication (required)
    - generic_name: The generic name if available
    - dosage: The dosage strength (e.g., 10mg, 500mg)
    - dosing_pattern: The pattern as seen (e.g., "1+0+0", "1+1+1")
    - timing: When to take relative to food (before_food, with_food, or after_food)
    - instructions: Any special instructions
    - start_date: When to start (if specified)
    - end_date: When to stop (if specified)

    Format your response ONLY as valid JSON wrapped in code blocks, like this:
    \`\`\`json
    [
      {
        "medication_name": "Example Med",
        "generic_name": "Generic Name",
        "dosage": "10mg",
        "dosing_pattern": "1+0+0",
        "timing": "after_food",
        "instructions": "Take with water"
      }
    ]
    \`\`\`
    Include ALL medications visible in the prescription.`;
    
    console.log("Sending request to Google Generative AI");
    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [
          { text: prompt },
          { inlineData: { 
            mimeType: "image/jpeg", 
            data: imageBase64 
          }}
        ]}],
      });

      const extractedText = result.response.text() || "";
      console.log("Text extracted successfully");
      return new Response(JSON.stringify({ text: extractedText, raw: extractedText }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (aiError) {
      console.error("AI processing error:", aiError);
      return new Response(JSON.stringify({ 
        error: "Failed to process image with AI", 
        details: aiError.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error in prescription-ocr function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
