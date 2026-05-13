import { NextResponse } from "next/server";
import { z } from "zod";
import { runMaya, type ChatMessage } from "@/lib/maya-agent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Schema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000)
      })
    )
    .min(1)
    .max(40)
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_body", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const { reply, toolCalls } = await runMaya(parsed.data.messages as ChatMessage[]);
    return NextResponse.json({ reply, toolCalls });
  } catch (err) {
    console.error("[maya] error", err);
    return NextResponse.json(
      {
        reply:
          "I'm having trouble reaching our systems — let me grab a human teammate. In the meantime you can email hello@marlowhart.com.",
        toolCalls: []
      },
      { status: 200 }
    );
  }
}
