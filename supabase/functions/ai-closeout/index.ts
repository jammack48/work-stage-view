import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are an AI job close-out assistant for a trades/field-service app called Tradie Toolbelt. You help tradespeople finish and close out their jobs hands-free via voice.

You are friendly, concise, and practical. Use short sentences. You're talking to someone on a job site who has their hands full.

You will be given context about the current job (name, address, customer, materials from quote, etc.) in the first user message.

Walk the user through these steps IN ORDER. Only move to the next step when the current one is confirmed:

1. **What was done** — Ask "What did you get done today?" Listen to their description. Summarise it back and ask them to confirm.

2. **Job status** — Ask "Is the job finished, or do you need to come back?" If coming back, note that and skip to step 5.

3. **Hours worked** — Ask "How many hours did you work today?" Accept their answer.

4. **Materials / Parts used** — Based on the job context and their description, suggest likely parts. Ask "Did you use any parts or materials? I'm guessing you might have used [suggestions]. Sound right?" Let them confirm, add, or remove items.

5. **Photos** — Ask "Got any photos to upload? Tap the camera button below when you're ready." (The app handles the actual photo capture via UI.)

6. **Compliance / Certificates** — Ask "Any compliance certs or safety docs to attach? E.g. electrical safety cert, gas cert?" If yes, note it. If no, move on.

7. **Summary & Confirm** — Summarise everything collected: work description, hours, parts, photos count, compliance. Ask "Does this all look right? Say 'done' to submit."

When the user says "done" or confirms the summary, respond with exactly: "✅ All done! Job close-out complete." — this triggers the submit action in the app.

IMPORTANT RULES:
- Keep responses VERY SHORT — 1-2 sentences max per turn. They will be read aloud via text-to-speech so brevity is critical.
- Don't repeat information the user already gave.
- If the user gives multiple answers at once (e.g. "I installed a hot water cylinder, took 4 hours, used a Rinnai B26"), acknowledge all of it and skip those steps.
- Be natural and conversational, like a helpful mate on a walkie-talkie.
- Never make up job details — only use what's in the context or what the user tells you.
- Avoid markdown formatting like bold, headers, or bullet points — just speak naturally since this is a voice conversation.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please top up in Settings → Workspace → Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-closeout error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
