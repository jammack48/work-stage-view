import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { jobTitle, client, address, rawNotes } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          rawNotes
            ? {
                role: "system",
                content:
                  "You clean up raw speech-to-text notes from Australian tradespeople into professional job sheet notes. Keep the original meaning, fix grammar, improve clarity, and keep it concise (3-6 sentences). Use plain text only. Do not include pricing. Do not include client names or addresses unless they are essential technical context.",
              }
            : {
                role: "system",
                content:
                  'You are a job completion notes writer for Australian tradespeople. Given a job title, write practical completion notes describing what was done on site (3-5 sentences). Write as if the tradesperson is logging their work. Example style: "Arrived on site. Spoke with customer regarding requirements. Completed installation as per scope. Tested and commissioned, confirmed operational. Cleaned up site." Use plain trade language. Do not include pricing. Do not use markdown formatting — write plain text only. Do not include the client name or address.',
              },
          rawNotes
            ? {
                role: "user",
                content: `Clean up these dictated job notes for \"${jobTitle}\": ${rawNotes}`,
              }
            : {
                role: "user",
                content: `Write a job scope description for: "${jobTitle}"${client ? ` for client ${client}` : ""}${address ? ` at ${address}` : ""}.`,
              },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const description = data.choices?.[0]?.message?.content?.trim() || "Could not generate description.";

    return new Response(JSON.stringify({ description }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
