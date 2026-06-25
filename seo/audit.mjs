#!/usr/bin/env node
/**
 * Multi-site SEO auditor.
 *
 * Crawls the public pages declared in seo/sites.config.json, parses each one,
 * and scores it against an on-page SEO checklist (title, meta description,
 * canonical, Open Graph, Twitter card, JSON-LD, headings, image alt text,
 * indexability, robots.txt + sitemap.xml). Writes a dated Markdown report and a
 * machine-readable latest.json, prints a summary, and (in CI) appends a job
 * summary.
 *
 * Zero dependencies — pure Node (global fetch, regex parsing) so it runs in CI
 * with no install step. This sandbox blocks outbound network; the GitHub Action
 * is where it actually reaches the live sites.
 *
 * Usage:
 *   node seo/audit.mjs            # audit, write report (never fails the run)
 *   node seo/audit.mjs --strict   # exit non-zero if any page is below minScore
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const STRICT = process.argv.includes("--strict");
const UA = "Mozilla/5.0 (compatible; TazSEOAudit/1.0; +https://github.com/coachtazbrown/coachtazbrown)";
const TIMEOUT_MS = 20000;

const CONFIG_PATH = process.env.SEO_CONFIG || join(HERE, "sites.config.json");
const config = JSON.parse(readFileSync(CONFIG_PATH, "utf8"));
const minScore = config.thresholds?.minScore ?? 70;

/** Each check earns up to `weight`; `pass` may be a 0..1 ratio for partial credit. */
function check(label, pass, weight, detail = "") {
  const ratio = typeof pass === "number" ? Math.max(0, Math.min(1, pass)) : pass ? 1 : 0;
  return { label, weight, earned: +(ratio * weight).toFixed(2), ok: ratio >= 1, detail };
}

async function get(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { headers: { "user-agent": UA }, redirect: "follow", signal: ctrl.signal });
    const body = res.ok ? await res.text() : "";
    return { ok: res.ok, status: res.status, body, finalUrl: res.url };
  } catch (err) {
    return { ok: false, status: 0, body: "", error: String(err?.message || err) };
  } finally {
    clearTimeout(t);
  }
}

// --- tiny HTML helpers (regex-based, good enough for static <head> SEO tags) ---
const headOf = (html) => (html.match(/<head[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? html);
const meta = (html, attr, value) => {
  const re = new RegExp(`<meta[^>]+${attr}=["']${value}["'][^>]*>`, "i");
  const tag = html.match(re)?.[0];
  return tag ? tag.match(/content=["']([\s\S]*?)["']/i)?.[1]?.trim() ?? "" : null;
};
const linkRel = (html, rel) => {
  const tag = html.match(new RegExp(`<link[^>]+rel=["']${rel}["'][^>]*>`, "i"))?.[0];
  return tag ? tag.match(/href=["']([\s\S]*?)["']/i)?.[1]?.trim() ?? "" : null;
};
const textLen = (html) =>
  html
    .replace(/<head[\s\S]*?<\/head>/i, " ")
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean).length;

function auditPage(url, page) {
  const { ok, status, body, error } = page;
  if (!ok) {
    return { url, status, error, score: 0, checks: [], reachable: false };
  }
  const head = headOf(body);
  const title = head.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? null;
  const desc = meta(head, "name", "description");
  const canonical = linkRel(head, "canonical");
  const robots = (meta(head, "name", "robots") || "").toLowerCase();
  const viewport = meta(head, "name", "viewport");
  const lang = body.match(/<html[^>]+lang=["']([^"']+)["']/i)?.[1] ?? null;
  const ogTitle = meta(head, "property", "og:title");
  const ogDesc = meta(head, "property", "og:description");
  const ogImage = meta(head, "property", "og:image");
  const ogUrl = meta(head, "property", "og:url");
  const ogType = meta(head, "property", "og:type");
  const twCard = meta(head, "name", "twitter:card");
  const jsonLd = /<script[^>]+type=["']application\/ld\+json["']/i.test(body);
  const h1Count = (body.match(/<h1[\s>]/gi) || []).length;
  const imgs = body.match(/<img\b[^>]*>/gi) || [];
  const imgsWithAlt = imgs.filter((t) => /\salt=["'][^"']*["']/i.test(t)).length;
  const words = textLen(body);

  const checks = [
    check("HTTP 200", status === 200, 6, `status ${status}`),
    check("Title tag", !!title, 8, title ? `"${title}"` : "missing"),
    check("Title length 10–60", title ? (title.length >= 10 && title.length <= 60 ? 1 : 0.4) : 0, 4, title ? `${title.length} chars` : ""),
    check("Meta description", !!desc, 8, desc ? `${desc.length} chars` : "missing"),
    check("Description length 50–160", desc ? (desc.length >= 50 && desc.length <= 160 ? 1 : 0.4) : 0, 4, ""),
    check("Canonical URL", !!canonical, 8, canonical || "missing"),
    check("Indexable (not noindex)", !robots.includes("noindex"), 8, robots || "no robots meta"),
    check("Viewport meta", !!viewport, 4),
    check("html lang", !!lang, 4, lang || "missing"),
    check("og:title", !!ogTitle, 4),
    check("og:description", !!ogDesc, 4),
    check("og:image", !!ogImage, 6, ogImage ? "present" : "missing"),
    check("og:url", !!ogUrl, 3),
    check("og:type", !!ogType, 2),
    check("twitter:card", !!twCard, 4),
    check("JSON-LD structured data", jsonLd, 8),
    check("Exactly one <h1>", h1Count === 1, 6, `${h1Count} found`),
    check("Image alt coverage", imgs.length ? imgsWithAlt / imgs.length : 1, 5, `${imgsWithAlt}/${imgs.length}`),
    check("Substantive content (≥250 words)", words >= 250 ? 1 : words / 250, 4, `${words} words`)
  ];

  const totalWeight = checks.reduce((s, c) => s + c.weight, 0);
  const earned = checks.reduce((s, c) => s + c.earned, 0);
  const score = Math.round((earned / totalWeight) * 100);
  return { url, status, score, checks, reachable: true };
}

async function auditSite(site) {
  const base = site.baseUrl.replace(/\/+$/, "");
  const pages = [];
  for (const p of site.pages) {
    const url = `${base}${p === "/" ? "" : p}`;
    pages.push(auditPage(url, await get(url)));
  }
  // Site-level signals.
  const robotsTxt = await get(`${base}/robots.txt`);
  const sitemapXml = await get(`${base}/sitemap.xml`);
  const robotsHasSitemap = robotsTxt.ok && /sitemap\s*:/i.test(robotsTxt.body);
  const siteChecks = [
    check("robots.txt present", robotsTxt.ok, 1, robotsTxt.ok ? "" : `status ${robotsTxt.status}`),
    check("robots.txt references sitemap", robotsHasSitemap, 1),
    check("sitemap.xml present", sitemapXml.ok, 1, sitemapXml.ok ? "" : `status ${sitemapXml.status}`)
  ];
  const reachablePages = pages.filter((p) => p.reachable);
  const avg = reachablePages.length
    ? Math.round(reachablePages.reduce((s, p) => s + p.score, 0) / reachablePages.length)
    : 0;
  return { name: site.name, baseUrl: base, pages, siteChecks, avgScore: avg };
}

function fmtChecks(checks) {
  return checks
    .map((c) => `  ${c.earned >= c.weight ? "✅" : c.earned > 0 ? "🟡" : "❌"} ${c.label}${c.detail ? ` — ${c.detail}` : ""}`)
    .join("\n");
}

function toMarkdown(results, date) {
  const lines = [`# SEO Audit — ${date}`, "", `Threshold: pages should score **≥ ${minScore}**.`, ""];
  lines.push("| Site | Page | Score | Reachable |", "| --- | --- | --- | --- |");
  for (const site of results) {
    for (const p of site.pages) {
      lines.push(`| ${site.name} | ${p.url.replace(/^https?:\/\//, "")} | ${p.reachable ? p.score : "—"} | ${p.reachable ? "yes" : "**no**"} |`);
    }
  }
  lines.push("");
  for (const site of results) {
    lines.push(`## ${site.name}`, "", `Base: ${site.baseUrl} · average score: **${site.avgScore}**`, "");
    lines.push("Site-level:");
    lines.push(fmtChecks(site.siteChecks), "");
    for (const p of site.pages) {
      lines.push(`### ${p.url}`, "");
      if (!p.reachable) {
        lines.push(`> ⚠️ Unreachable — status ${p.status}${p.error ? ` (${p.error})` : ""}`, "");
        continue;
      }
      lines.push(`Score: **${p.score}/100**${p.score < minScore ? " — ⚠️ below threshold" : ""}`, "");
      lines.push(fmtChecks(p.checks), "");
    }
  }
  return lines.join("\n");
}

(async () => {
  const date = new Date().toISOString().slice(0, 10);
  const results = [];
  for (const site of config.sites) {
    process.stdout.write(`Auditing ${site.name} (${site.baseUrl}) …\n`);
    results.push(await auditSite(site));
  }

  const reportsDir = join(HERE, "reports");
  mkdirSync(reportsDir, { recursive: true });
  const md = toMarkdown(results, date);
  writeFileSync(join(reportsDir, `seo-report-${date}.md`), md);
  writeFileSync(join(reportsDir, "latest.json"), JSON.stringify({ date, minScore, results }, null, 2));

  // Console summary.
  console.log("\n──────── SEO Audit Summary ────────");
  let failures = 0;
  for (const site of results) {
    console.log(`\n${site.name}  (avg ${site.avgScore})`);
    for (const p of site.pages) {
      if (!p.reachable) {
        console.log(`  ✖ ${p.url} — unreachable (${p.status || p.error})`);
        failures++;
        continue;
      }
      const flag = p.score < minScore ? "⚠️ " : "   ";
      console.log(`  ${flag}${String(p.score).padStart(3)}  ${p.url}`);
      if (p.score < minScore) failures++;
    }
  }
  console.log(`\nReport: seo/reports/seo-report-${date}.md`);

  if (process.env.GITHUB_STEP_SUMMARY) {
    const summary = [
      "## SEO Audit",
      "",
      "| Site | Page | Score |",
      "| --- | --- | --- |",
      ...results.flatMap((s) =>
        s.pages.map((p) => `| ${s.name} | ${p.url.replace(/^https?:\/\//, "")} | ${p.reachable ? p.score : "unreachable"} |`)
      )
    ].join("\n");
    writeFileSync(process.env.GITHUB_STEP_SUMMARY, summary + "\n", { flag: "a" });
  }

  if (STRICT && failures > 0) {
    console.error(`\n${failures} page(s) below threshold or unreachable — failing (strict mode).`);
    process.exit(1);
  }
})();
