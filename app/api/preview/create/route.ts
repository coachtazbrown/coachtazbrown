import { NextResponse } from "next/server";
import { z } from "zod";
import { scrapeShopify, savePreview } from "@/lib/preview-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Coarse in-memory rate limit per IP (10 previews / 10 min). Per-instance only;
// good enough to keep accidental loops from hammering a single Shopify store.
const RATE: Map<string, { count: number; resetAt: number }> = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 10;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const cur = RATE.get(ip);
  if (!cur || cur.resetAt < now) {
    RATE.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  cur.count += 1;
  return cur.count > LIMIT;
}

const Schema = z.object({
  shopifyUrl: z.string().min(4).max(300)
});

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

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

  try {
    const catalog = await scrapeShopify(parsed.data.shopifyUrl);
    await savePreview(catalog);
    return NextResponse.json({
      id: catalog.id,
      storeName: catalog.storeName,
      storeDomain: catalog.storeDomain,
      productCount: catalog.productCount,
      url: `/preview/${catalog.id}`
    });
  } catch (err) {
    const code = err instanceof Error ? err.message : "unknown";
    let reason = "We couldn't read that store's public catalog.";
    if (code.startsWith("not_shopify"))
      reason =
        "That URL doesn't look like a public Shopify store. We need /products.json to be reachable.";
    else if (code === "empty_catalog")
      reason = "We reached the store but it has no public products.";
    else if (code === "invalid_protocol") reason = "URL must start with http:// or https://.";
    return NextResponse.json({ error: code, reason }, { status: 400 });
  }
}
