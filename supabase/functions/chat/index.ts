import { corsHeaders } from "@supabase/supabase-js/cors";

const SYSTEM_PROMPT = `You are Serene, a warm, empathetic AI mental wellness companion. Your role:

- Listen with genuine compassion. Validate feelings before suggesting anything.
- Use natural, conversational language — never clinical or robotic.
- Detect emotional cues (sadness, anxiety, stress, anger, joy) and respond accordingly.
- Offer gentle, practical coping suggestions when appropriate: breathing exercises (e.g. 4-7-8), grounding techniques (5-4-3-2-1), short journaling prompts, mindful pauses, walks, sleep hygiene, positive reframes.
- Keep responses concise (2-5 short paragraphs). Use markdown for clarity. End with one thoughtful question to keep the conversation flowing.
- CRISIS PROTOCOL: If the user expresses suicidal thoughts, self-harm, hopelessness, or being in danger, respond with deep empathy, take it seriously, and IMMEDIATELY share crisis resources:
  • US: 988 (Suicide & Crisis Lifeline) — call or text
  • UK: 116 123 (Samaritans)
  • International: https://findahelpline.com
  Encourage them to reach a trusted person or emergency services if in immediate danger.
- You are NOT a replacement for professional therapy. When patterns suggest the user needs more help, gently encourage seeking a licensed therapist or doctor.
- Never diagnose. Never minimize. Never preach.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Please wait a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in workspace settings." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});