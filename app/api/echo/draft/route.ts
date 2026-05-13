import { NextResponse } from "next/server";
import { z } from "zod";
import { draftReviewReply } from "@/lib/echo-agent";
import { REVIEWS } from "@/lib/echo-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Schema = z.object({ reviewId: z.string().min(1).max(64) });

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
  const review = REVIEWS.find((r) => r.id === parsed.data.reviewId);
  if (!review) return NextResponse.json({ error: "not_found" }, { status: 404 });

  try {
    const draft = await draftReviewReply(review);
    return NextResponse.json({ reviewId: review.id, draft });
  } catch (err) {
    console.error("[echo] error", err);
    return NextResponse.json({ error: "agent_error" }, { status: 500 });
  }
}
