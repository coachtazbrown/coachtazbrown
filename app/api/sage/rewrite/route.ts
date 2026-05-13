import { NextResponse } from "next/server";
import { z } from "zod";
import { rewriteListing } from "@/lib/sage-agent";
import { getListing } from "@/lib/sage-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Schema = z.object({ handle: z.string().min(1).max(64) });

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  const listing = getListing(parsed.data.handle);
  if (!listing) return NextResponse.json({ error: "not_found" }, { status: 404 });

  try {
    const rewrite = await rewriteListing(listing);
    return NextResponse.json({ handle: listing.handle, rewrite });
  } catch (err) {
    console.error("[sage] error", err);
    return NextResponse.json({ error: "agent_error" }, { status: 500 });
  }
}
