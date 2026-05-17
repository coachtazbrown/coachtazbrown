import { NextResponse } from "next/server";
import { z } from "zod";
import { runRedTeamPartner, type ChatMessage } from "@/lib/redteam-agent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Schema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(6000)
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
    return NextResponse.json(
      { error: "invalid_body", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const { reply, toolCalls } = await runRedTeamPartner(parsed.data.messages as ChatMessage[]);
    return NextResponse.json({ reply, toolCalls });
  } catch (err) {
    console.error("[redteam] error", err);
    return NextResponse.json(
      {
        reply:
          "Lost the thread for a second, partner — give me the client and the decision again and I'll get straight to the move.",
        toolCalls: []
      },
      { status: 200 }
    );
  }
}
