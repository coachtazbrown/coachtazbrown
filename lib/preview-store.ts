// Public Shopify storefronts expose a /products.json endpoint that returns the
// full active catalog without authentication. This module fetches it, maps the
// response into our internal Product shape, and caches the result on disk so
// that a generated preview URL keeps working after the form submission.
//
// In production on Vercel serverless this should be swapped for Upstash KV or
// Vercel KV — disk writes don't survive across invocations. For local dev,
// .previews/ on disk is fine and matches the no-DB MVP philosophy.

import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export type PreviewProduct = {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  category: string;
  price: number;
  compareAtPrice: number | null;
  inStock: boolean;
  stockOnHand: number;
  description: string;
  tags: string[];
  imageUrl: string | null;
};

export type PreviewCatalog = {
  id: string;
  shopifyUrl: string;
  storeDomain: string;
  storeName: string;
  fetchedAt: string;
  products: PreviewProduct[];
  productCount: number;
};

const PREVIEW_DIR = path.join(process.cwd(), ".previews");
const TTL_DAYS = 7;
const MAX_PRODUCTS = 60;
const FETCH_TIMEOUT_MS = 10_000;

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<\/(?:p|div|li|br)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function normalizeUrl(raw: string): { origin: string; host: string } {
  const trimmed = raw.trim();
  const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const u = new URL(withProto);
  if (!/^https?:$/.test(u.protocol)) throw new Error("invalid_protocol");
  return { origin: `${u.protocol}//${u.host}`, host: u.host };
}

async function fetchWithTimeout(url: string, ms: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    // Many Shopify Plus stores block obviously-bot user agents at the edge,
    // so we present as a current Chrome on macOS. The /products.json endpoint
    // is public so this is consistent with how a browser would request it.
    return await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "application/json, text/html;q=0.9, */*;q=0.5",
        "Accept-Language": "en-US,en;q=0.9"
      }
    });
  } finally {
    clearTimeout(timer);
  }
}

type ShopifyProductJson = {
  id: number;
  title: string;
  handle: string;
  vendor: string;
  product_type: string;
  body_html: string;
  tags: string[] | string;
  variants: {
    id: number;
    price: string;
    compare_at_price: string | null;
    available: boolean;
    inventory_quantity?: number;
  }[];
  images: { src: string }[];
};

function mapProduct(p: ShopifyProductJson): PreviewProduct {
  const tags = Array.isArray(p.tags)
    ? p.tags.map((t) => String(t).trim()).filter(Boolean)
    : String(p.tags || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
  const prices = (p.variants || []).map((v) => parseFloat(v.price)).filter((n) => !isNaN(n));
  const price = prices.length ? Math.min(...prices) : 0;
  const compareAtPrices = (p.variants || [])
    .map((v) => (v.compare_at_price ? parseFloat(v.compare_at_price) : NaN))
    .filter((n) => !isNaN(n) && n > 0);
  const compareAtPrice = compareAtPrices.length ? Math.max(...compareAtPrices) : null;
  const inStock = (p.variants || []).some((v) => v.available);
  const stockOnHand = (p.variants || []).reduce(
    (s, v) => s + (typeof v.inventory_quantity === "number" ? v.inventory_quantity : 0),
    0
  );
  const imageUrl = p.images?.[0]?.src ?? null;
  const description = stripHtml(p.body_html || "").slice(0, 600);
  return {
    id: String(p.id),
    handle: p.handle,
    title: p.title,
    vendor: p.vendor || "",
    category: (p.product_type || tags[0] || "other").toLowerCase().slice(0, 40),
    price,
    compareAtPrice,
    inStock,
    stockOnHand,
    description,
    tags,
    imageUrl
  };
}

export async function scrapeShopify(shopifyUrl: string): Promise<PreviewCatalog> {
  const { origin, host } = normalizeUrl(shopifyUrl);

  // Two requests in parallel: the catalog itself and the homepage HTML for a
  // store title. Either failure is non-fatal for the title; the catalog is.
  const [productsRes, homeRes] = await Promise.all([
    fetchWithTimeout(`${origin}/products.json?limit=${MAX_PRODUCTS}`, FETCH_TIMEOUT_MS),
    fetchWithTimeout(origin, FETCH_TIMEOUT_MS).catch(() => null)
  ]);

  if (!productsRes.ok) {
    throw new Error(`not_shopify_or_unreachable:${productsRes.status}`);
  }
  const ct = productsRes.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    throw new Error("not_shopify_response");
  }
  const body = (await productsRes.json()) as { products?: ShopifyProductJson[] };
  if (!body || !Array.isArray(body.products)) {
    throw new Error("not_shopify_response");
  }
  const products = body.products.slice(0, MAX_PRODUCTS).map(mapProduct).filter((p) => p.title);
  if (!products.length) throw new Error("empty_catalog");

  let storeName = host;
  if (homeRes && homeRes.ok) {
    try {
      const html = await homeRes.text();
      const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (m) {
        const title = m[1].split(/[|–—-]/)[0].trim();
        if (title.length >= 2 && title.length <= 80) storeName = title;
      }
    } catch {
      // ignore
    }
  }

  const id = crypto.randomBytes(8).toString("hex");
  return {
    id,
    shopifyUrl: origin,
    storeDomain: host,
    storeName,
    fetchedAt: new Date().toISOString(),
    products,
    productCount: products.length
  };
}

export async function savePreview(catalog: PreviewCatalog): Promise<void> {
  await fs.mkdir(PREVIEW_DIR, { recursive: true });
  await fs.writeFile(
    path.join(PREVIEW_DIR, `${catalog.id}.json`),
    JSON.stringify(catalog, null, 2),
    "utf8"
  );
}

export async function loadPreview(id: string): Promise<PreviewCatalog | null> {
  if (!/^[a-f0-9]{8,32}$/.test(id)) return null;
  try {
    const buf = await fs.readFile(path.join(PREVIEW_DIR, `${id}.json`), "utf8");
    const catalog = JSON.parse(buf) as PreviewCatalog;
    const fetchedAt = new Date(catalog.fetchedAt).getTime();
    if (Date.now() - fetchedAt > TTL_DAYS * 24 * 60 * 60 * 1000) return null;
    return catalog;
  } catch {
    return null;
  }
}

export function searchPreviewCatalog(
  catalog: PreviewCatalog,
  opts: {
    query?: string;
    category?: string;
    maxPrice?: number;
    minPrice?: number;
    inStockOnly?: boolean;
  }
): PreviewProduct[] {
  const q = (opts.query || "").toLowerCase().trim();
  return catalog.products
    .filter((p) => {
      if (opts.category && !p.category.includes(opts.category.toLowerCase())) return false;
      if (opts.maxPrice != null && p.price > opts.maxPrice) return false;
      if (opts.minPrice != null && p.price < opts.minPrice) return false;
      if (opts.inStockOnly && !p.inStock) return false;
      if (q) {
        const blob = [p.title, p.description, p.category, p.vendor, ...p.tags]
          .join(" ")
          .toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    })
    .slice(0, 6);
}

export function getPreviewProduct(
  catalog: PreviewCatalog,
  handle: string
): PreviewProduct | undefined {
  return catalog.products.find((p) => p.handle === handle || p.id === handle);
}
