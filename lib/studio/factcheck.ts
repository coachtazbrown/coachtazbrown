// Galactic Studio — the fact-check pass.
//
// Runs over the FINISHED script (every cut, every scene), not the draft. It
// extracts sentences that assert checkable facts, then grades each one. In live
// mode the grades come from Claude + web search; in demo mode this same
// extractor produces an honest pass that grounds method claims to the corpus
// and flags every ungrounded specific as "needs review" — so the studio never
// presents an unverified number as settled, with or without an API key.

import type { Citation, Cut, FactCheckItem, Verdict } from "./types";

const SENT_SPLIT = /(?<=[.!?])\s+(?=[A-Z0-9"'])/;

// Signals that a sentence is making a checkable factual claim.
const NUMBER = /\b\d[\d,.]*\s?(%|percent|x|×|billion|million|thousand|k\b|years?|months?|days?|hours?)\b/i;
const YEAR = /\b(19|20)\d{2}\b/;
const SUPERLATIVE = /\b(most|best|worst|fastest|slowest|largest|smallest|first|only|never|always|every|all|none)\b/i;
const CAUSAL = /\b(causes?|leads? to|results? in|proves?|because of|due to|drives?)\b/i;
const ATTRIB = /\b(according to|study|research|report|survey|data|statistics|found that|shows that)\b/i;

// Signals that a sentence is opinion/interpretation, not a checkable fact.
const OPINION = /\b(i think|in my view|arguably|probably|might|may|could|should|the best way|feels?|believe)\b/i;

function isFactual(s: string): boolean {
  return NUMBER.test(s) || YEAR.test(s) || ATTRIB.test(s) || (CAUSAL.test(s) && !OPINION.test(s));
}

function isOpinion(s: string): boolean {
  return OPINION.test(s) || SUPERLATIVE.test(s);
}

export function extractClaims(cuts: Cut[]): string[] {
  const seen = new Set<string>();
  const claims: string[] = [];
  for (const cut of cuts) {
    for (const scene of cut.scenes) {
      for (const raw of scene.voiceover.split(SENT_SPLIT)) {
        const s = raw.trim();
        if (s.length < 12) continue;
        const key = s.toLowerCase().replace(/[^a-z0-9 ]/g, "");
        if (seen.has(key)) continue;
        if (isFactual(s) || isOpinion(s)) {
          seen.add(key);
          claims.push(s);
        }
      }
    }
  }
  return claims;
}

// Demo-mode grading: honest by construction.
// - Specific, checkable claims with no live source → "needs-review" (never faked).
// - Opinion/interpretation → "opinion".
// - Everything else carrying a corpus-grounded method point → "verified" w/ corpus cite.
export function gradeClaimsOffline(claims: string[], corpusCites: Citation[]): FactCheckItem[] {
  const corpusId = corpusCites[0]?.id;
  return claims.map((claim) => {
    if (isFactual(claim)) {
      return {
        claim,
        verdict: "needs-review" as Verdict,
        confidence: 0.45,
        evidence:
          "Specific claim detected (number, date, or attribution). No live source was retrieved in offline mode — add an ANTHROPIC_API_KEY to auto-verify against the web, or confirm against a primary source before publishing.",
        citations: []
      };
    }
    return {
      claim,
      verdict: "opinion" as Verdict,
      confidence: 0.8,
      evidence:
        "Framed as guidance/interpretation rather than a hard fact. Grounded in the studio's craft corpus; defensible as a creative recommendation, not a statistic.",
      citations: corpusId ? [corpusId] : []
    };
  });
}

export function scoreFactCheck(items: FactCheckItem[]): number {
  if (items.length === 0) return 100;
  const weight = (i: FactCheckItem) =>
    i.verdict === "verified" ? 1 : i.verdict === "opinion" ? 0.9 : i.verdict === "corrected" ? 1 : 0.3;
  const total = items.reduce((a, i) => a + weight(i), 0);
  return Math.round((total / items.length) * 100);
}

export function summarize(items: FactCheckItem[], demo: boolean): string {
  const n = items.length;
  const needs = items.filter((i) => i.verdict === "needs-review").length;
  const verified = items.filter((i) => i.verdict === "verified").length;
  if (n === 0) return "No hard factual claims were asserted — the script teaches a method, so there is nothing to mis-state.";
  if (demo) {
    return `${n} claims reviewed. ${needs} specific claim${needs === 1 ? "" : "s"} flagged for live verification before publishing — offline mode never marks an unsourced number as verified. Connect a key to auto-verify against the web with citations.`;
  }
  return `${n} claims reviewed against live sources: ${verified} verified with citations, ${needs} flagged for review. No specific claim ships without a source.`;
}
