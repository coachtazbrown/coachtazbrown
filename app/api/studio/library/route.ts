import { NextResponse } from "next/server";
import { z } from "zod";
import { rpc, supabaseConfig } from "@/lib/studio/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KEY_RE = /^[A-Za-z0-9_-]{8,64}$/;

type Row = {
  id: string;
  topic: string;
  demo: boolean;
  production: unknown;
  created_at: string;
  updated_at: string;
};

function toItem(r: Row) {
  return {
    id: r.id,
    topic: r.topic,
    demo: r.demo,
    createdAt: r.created_at,
    production: r.production
  };
}

// GET /api/studio/library            -> { configured }            (capability check)
// GET /api/studio/library?key=...    -> { configured, items }     (list a library)
export async function GET(req: Request) {
  const { configured } = supabaseConfig();
  if (!configured) return NextResponse.json({ configured: false, items: [] });
  const key = new URL(req.url).searchParams.get("key") || "";
  if (!KEY_RE.test(key)) return NextResponse.json({ configured: true, items: [] });
  try {
    const rows = (await rpc<Row[]>("lib_list", { p_key: key })) || [];
    return NextResponse.json({ configured: true, items: rows.map(toItem) });
  } catch (err) {
    console.error("[studio/library] list", err);
    return NextResponse.json({ configured: true, items: [], error: "list_failed" });
  }
}

// POST { key, production } -> { configured, item }
export async function POST(req: Request) {
  const { configured } = supabaseConfig();
  if (!configured) return NextResponse.json({ configured: false });
  const body = await req.json().catch(() => null);
  const parsed = z
    .object({ key: z.string().regex(KEY_RE), production: z.record(z.any()) })
    .safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  const p = parsed.data.production as Record<string, unknown>;
  try {
    const row = await rpc<Row>("lib_upsert", {
      p_key: parsed.data.key,
      p_topic: String(p.topic || "untitled"),
      p_demo: Boolean(p.demo),
      p_production: p
    });
    return NextResponse.json({ configured: true, item: row ? toItem(row) : null });
  } catch (err) {
    console.error("[studio/library] upsert", err);
    return NextResponse.json({ error: "upsert_failed" });
  }
}

// DELETE ?key=...&id=...
export async function DELETE(req: Request) {
  const { configured } = supabaseConfig();
  if (!configured) return NextResponse.json({ configured: false });
  const url = new URL(req.url);
  const key = url.searchParams.get("key") || "";
  const id = url.searchParams.get("id") || "";
  if (!KEY_RE.test(key) || !id) return NextResponse.json({ error: "invalid" }, { status: 400 });
  try {
    await rpc("lib_delete", { p_key: key, p_id: id });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[studio/library] delete", err);
    return NextResponse.json({ error: "delete_failed" });
  }
}
