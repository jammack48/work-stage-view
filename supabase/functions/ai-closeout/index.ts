import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a voice assistant for a trades/field-service app. You interpret short spoken answers from tradespeople during job close-out.

You receive a JSON object with:
- "step": the current step in the close-out flow (status, jobsheet, time, parts, photos, compliance)
- "question": the question that was just asked to the user
- "transcript": what the user said (speech-to-text, may be messy)
- "job": basic job context (name, address, materials)

You MUST respond with valid JSON only. No markdown, no extra text. The JSON format:
{
  "speak": "Short reply to say aloud (1 sentence max, casual/mate tone)",
  "actions": [{"type": "action_type", "value": "optional_value"}],
  "advance": true/false
}

Action types per step:

**status step:**
- {"type": "set_status", "value": "finished"} or {"value": "coming_back"}
- Interpret: "yes/yep/done/finished/all done" → finished. "no/nah/coming back/not yet" → coming_back

**jobsheet step:**
- {"type": "set_jobsheet", "value": "the text to put in the field"}
- Just use whatever they said as the job description. Clean it up slightly but keep their words.
- If they say something short like "installed hot water" that's fine, use it.

**time step:**
- {"type": "set_hours", "value": 6}
- Extract the number. "about 6" → 6, "half a day" → 4, "couple hours" → 2, "3 and a half" → 3.5

**parts step:**
- {"type": "confirm_parts"} — they said yes to the suggested parts
- {"type": "add_part", "value": "part name"}
- {"type": "remove_part", "value": "part name"}
- "yep/yes/that's it/all good" → confirm_parts + advance
- "also used a widget" → add_part

**photos step:**
- {"type": "skip_photos"} or {"type": "wait_photos"}
- "no/nah/skip" → skip_photos + advance
- "yes/yeah/one sec" → wait_photos, advance=false, speak="Tap the camera button when ready"

**compliance step:**
- {"type": "set_compliance", "value": false} or {"value": true}
- {"type": "set_cert_number", "value": "COC-123"}
- "no/nah/none" → set_compliance false + advance
- "yes" → set_compliance true, advance=false

CRITICAL RULES:
- Keep "speak" under 15 words. This is read aloud via TTS.
- Always return valid JSON, nothing else.
- Be very generous interpreting yes/no. "yep", "yeah", "nah", "nope", "skip", "done" all count.
- If the transcript is unclear, ask a short clarification (advance=false).
- For the jobsheet step, any description they give should be accepted and advance=true.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { step, question, transcript, job } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const userMessage = JSON.stringify({ step, question, transcript, job });

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userMessage },
          ],
        }),
      }
    );

    if (!response.ok) {
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ speak: "Sorry, something went wrong. Try again.", actions: [], advance: false }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Parse the AI response — it should be JSON
    let parsed;
    try {
      // Strip markdown code fences if present
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response as JSON:", content);
      parsed = { speak: "Sorry, didn't catch that. Could you say it again?", actions: [], advance: false };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-closeout error:", e);
    return new Response(
      JSON.stringify({ speak: "Something went wrong. Try again.", actions: [], advance: false }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
