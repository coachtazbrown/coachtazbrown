import { NextResponse } from "next/server";
import { z } from "zod";
import { produceVideo } from "@/lib/studio/agent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Live research + dual-cut generation can take a while; give it room.
export const maxDuration = 300;

const Schema = z.object({
  topic: z.string().min(2).max(300)
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
    const production = await produceVideo(parsed.data.topic);
    return NextResponse.json({ production });
  } catch (err) {
    console.error("[studio/generate] error", err);
    return NextResponse.json(
      { error: "generation_failed", message: "The studio hit a snag. Give me the topic again." },
      { status: 500 }
    );
  }
}
