
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY");
const VISION_API_ENDPOINT = "https://vision.googleapis.com/v1/images:annotate?key=" + GOOGLE_API_KEY;

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
    
    // Prepare payload for Google Cloud Vision OCR
    const payload = {
      requests: [
        {
          image: { content: imageBase64 },
          features: [{ type: "TEXT_DETECTION", maxResults: 1 }]
        }
      ]
    };

    console.log("Sending request to Google Vision API");
    const googleRes = await fetch(VISION_API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!googleRes.ok) {
      const errorData = await googleRes.text();
      console.error("Google Vision API error:", googleRes.status, errorData);
      throw new Error(`Vision API error: ${googleRes.status}`);
    }

    const googleJson = await googleRes.json();
    const extractedText =
      googleJson?.responses?.[0]?.fullTextAnnotation?.text || "";

    console.log("OCR Text extracted successfully");
    return new Response(JSON.stringify({ text: extractedText }), {
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
