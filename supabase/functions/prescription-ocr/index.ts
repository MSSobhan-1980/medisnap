
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.2.1";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const genAI = new GoogleGenerativeAI(Deno.env.get("GOOGLE_AI_API_KEY"));

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Basic authentication check
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { imageBase64 } = await req.json();
    
    // Verify API key is available
    if (!Deno.env.get("GOOGLE_AI_API_KEY")) {
      console.error("Google AI API key is not configured");
      return new Response(JSON.stringify({ error: "Google AI API key is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use Gemini 1.5 Flash model for text extraction and structured data
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prepare structured prompt for extraction
    const prompt = `Extract detailed information from this prescription or medication label. 
    Return a JSON array of medications with these fields for each medication:
    - medication_name: The name of the medication (required)
    - dosage: The dosage strength (e.g., 10mg, 500mg)
    - frequency: How often to take it (e.g., once daily, twice daily, as needed)
    - timing: When to take it relative to food (before_food, with_food, or after_food)
    - instructions: Any special instructions
    - start_date: When to start (if specified)
    - end_date: When to stop (if specified)

    Format your response ONLY as valid JSON wrapped in code blocks, like this:
    \`\`\`json
    [
      {
        "medication_name": "Example Med",
        "dosage": "10mg",
        "frequency": "once daily",
        "timing": "after_food",
        "instructions": "Take with water"
      }
    ]
    \`\`\`
    Include ALL medications visible in the prescription.`;
    
    console.log("Sending request to Google Generative AI");
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
  } catch (error) {
    console.error("Error in prescription-ocr function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
