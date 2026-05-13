import { NextResponse } from "next/server";
import { z } from "zod";
import { triageTicket } from "@/lib/pip-agent";
import { getTicket } from "@/lib/pip-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Schema = z.object({ ticketId: z.string().min(1).max(64) });

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  const ticket = getTicket(parsed.data.ticketId);
  if (!ticket) return NextResponse.json({ error: "not_found" }, { status: 404 });

  try {
    const triage = await triageTicket(ticket);
    return NextResponse.json({ ticketId: ticket.id, triage });
  } catch (err) {
    console.error("[pip] error", err);
    return NextResponse.json({ error: "agent_error" }, { status: 500 });
  }
}
