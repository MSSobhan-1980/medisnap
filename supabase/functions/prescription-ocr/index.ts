
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY");
const GEMINI_ENDPOINT = "https://vision.googleapis.com/v1/images:annotate?key=" + GOOGLE_API_KEY;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();
    // Prepare payload for Google Cloud Vision OCR (or via Gemini 2.0 Flash, here directly Vision API)
    const payload = {
      requests: [
        {
          image: { content: imageBase64 },
          features: [{ type: "TEXT_DETECTION", maxResults: 1 }]
        }
      ]
    };

    const googleRes = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const googleJson = await googleRes.json();
    const extractedText =
      googleJson?.responses?.[0]?.fullTextAnnotation?.text || "";

    return new Response(JSON.stringify({ text: extractedText }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
