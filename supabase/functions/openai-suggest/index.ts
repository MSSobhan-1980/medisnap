
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Log the incoming request headers for debugging
  console.log("Headers:", Object.fromEntries(req.headers.entries()));

  try {
    // Make auth header optional for this function - API key is enough
    const apiKey = req.headers.get("apikey") || req.headers.get("authorization")?.split(" ")?.[1];
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing API key" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { text } = await req.json();

    // Check if API key exists before making request
    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiKey) {
      console.error("OpenAI API key is not configured");
      return new Response(JSON.stringify({ error: "OpenAI API key is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Sending request to OpenAI");
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openaiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that extracts and clarifies prescription or medication instructions from OCR-scanned text for user to verify and input into a medication scheduler. Structure your output as JSON with keys: medication_name, dosage, frequency, start_date, instructions.",
            },
            { role: "user", content: `Extract all medication info from this prescription text for the scheduler:\n\n${text}` },
          ],
          temperature: 0.2,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("OpenAI API error:", response.status, errorData);
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const raw = data?.choices?.[0]?.message?.content || "";

      let extracted;
      try {
        const match = raw.match(/\{[\s\S]*\}/);
        extracted = match ? JSON.parse(match[0]) : { raw };
      } catch {
        extracted = { raw };
      }

      console.log("AI analysis completed successfully");
      return new Response(JSON.stringify({ result: extracted }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (aiError) {
      console.error("OpenAI API processing error:", aiError);
      return new Response(JSON.stringify({ 
        error: "Failed to process text with OpenAI", 
        details: aiError.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error in openai-suggest function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
