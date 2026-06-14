import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Schema = z.object({
  text: z.string().min(1).max(3000),
  // Optional ElevenLabs voice id chosen in the UI. Must be available to the
  // account behind ELEVENLABS_API_KEY or the call falls back to the browser voice.
  voiceId: z
    .string()
    .regex(/^[A-Za-z0-9]{1,40}$/)
    .optional()
});

// Pinned default voice. It must exist in the ElevenLabs account whose key is in
// ELEVENLABS_API_KEY so it resolves; if it doesn't, the call fails and the client
// falls back to the browser voice. ELEVENLABS_VOICE_ID still overrides this.
const DEFAULT_VOICE_ID = "CMlaXsNkOUgEvTGpIezg";
const DEFAULT_MODEL_ID = "eleven_multilingual_v2";

// Strip the bits that read badly aloud (markdown bold, arrows, bullets).
function forSpeech(text: string): string {
  return text
    .replace(/\*\*/g, "")
    .replace(/→/g, ". ")
    .replace(/^[-•]\s*/gm, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 3000);
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const key = process.env.ELEVENLABS_API_KEY;
  // No key → tell the client to speak with the browser voice. Never an error:
  // voice should degrade gracefully exactly like the agent's demo mode.
  if (!key) {
    return NextResponse.json({ fallback: true, reason: "no_key" });
  }

  const voiceId = parsed.data.voiceId || process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID;
  const modelId = process.env.ELEVENLABS_MODEL_ID || DEFAULT_MODEL_ID;

  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": key,
          "content-type": "application/json",
          accept: "audio/mpeg"
        },
        body: JSON.stringify({
          text: forSpeech(parsed.data.text),
          model_id: modelId,
          voice_settings: { stability: 0.4, similarity_boost: 0.85, style: 0.35 }
        })
      }
    );

    if (!res.ok || !res.body) {
      console.error("[voice] elevenlabs", res.status, await res.text().catch(() => ""));
      return NextResponse.json({ fallback: true, reason: "provider_error", status: res.status });
    }

    const audio = await res.arrayBuffer();
    return new Response(audio, {
      status: 200,
      headers: {
        "content-type": "audio/mpeg",
        "cache-control": "no-store"
      }
    });
  } catch (err) {
    console.error("[voice] error", err);
    return NextResponse.json({ fallback: true, reason: "exception" });
  }
}
