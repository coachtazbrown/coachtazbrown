// Galactic Studio — server-side Supabase access for the cross-device library.
//
// Capability-key model: the studio_library table has RLS on and NO direct
// policies. All access goes through SECURITY DEFINER RPCs scoped by a secret
// library key. The anon/publishable key below is safe to ship (it's designed to
// be public, and the table can't be read or written without a valid library key
// via those RPCs). Override via env for your own project.

const DEFAULT_URL = "https://xspzffybhhzlcofbxglh.supabase.co";
// Legacy anon JWT (role=anon) — most compatible for direct PostgREST RPC calls.
const DEFAULT_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzcHpmZnliaGh6bGNvZmJ4Z2xoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNTgwMzQsImV4cCI6MjA5NjkzNDAzNH0.dDqA2yRy5XnkiZfJEFsm6CkiHsURuO18PXCBJjJsonw";

export function supabaseConfig() {
  const url = process.env.SUPABASE_URL || DEFAULT_URL;
  const key =
    process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || DEFAULT_ANON;
  return { url, key, configured: Boolean(url && key) };
}

export async function rpc<T>(fn: string, body: Record<string, unknown>): Promise<T | null> {
  const { url, key } = supabaseConfig();
  const res = await fetch(`${url}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "content-type": "application/json"
    },
    body: JSON.stringify(body),
    cache: "no-store"
  });
  if (!res.ok) {
    throw new Error(`supabase rpc ${fn} ${res.status}: ${await res.text().catch(() => "")}`);
  }
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : null;
}
