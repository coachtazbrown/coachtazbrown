// Galactic Studio — the clean-data corpus.
//
// "Always operate from clean data" means the studio never free-associates about
// how to make a video. It retrieves from a curated, source-tagged corpus of
// video-craft knowledge and grounds every structural decision in it. This file
// is that corpus plus a small, real retriever (keyword TF scoring with light
// stemming) so retrieval works identically with or without an API key.

import type { Citation } from "./types";

export interface KnowledgeChunk {
  id: string;
  title: string;
  source: string; // attributable origin of the principle
  tags: string[];
  text: string;
}

// ── The corpus ────────────────────────────────────────────────────────────────
// Each chunk is a durable, defensible principle of faceless video that does not
// rot — retention mechanics, scripting structure, platform behavior. Topic facts
// are NOT stored here; those are fetched live and fact-checked per production.
export const CORPUS: KnowledgeChunk[] = [
  {
    id: "hook-3s",
    title: "The first three seconds decide the video",
    source: "Retention analytics — platform creator research",
    tags: ["hook", "retention", "open", "youtube", "shorts", "attention"],
    text: "Most viewers who leave a video leave in the first 3–5 seconds. The opening line must state the payoff or the tension immediately — no logo, no 'hey guys', no slow build. Lead with the most surprising, useful, or contrarian sentence in the entire script. If the hook can be cut without losing meaning, it is not a hook."
  },
  {
    id: "open-loops",
    title: "Open loops sustain watch time",
    source: "Narrative tension research (Zeigarnik effect)",
    tags: ["retention", "structure", "curiosity", "loop"],
    text: "Unresolved questions hold attention: the brain remembers and pulls toward incomplete tasks. Open a loop early ('the third one is the mistake almost everyone makes') and resolve it late. Stack a new small loop every 20–30 seconds so there is always a reason to keep watching."
  },
  {
    id: "value-density",
    title: "Value density beats length",
    source: "Watch-time vs. length analysis",
    tags: ["retention", "pacing", "editing", "script"],
    text: "Audiences reward information-per-second, not duration. Cut every sentence that does not advance the point. A faceless video should change visual or idea roughly every 3–6 seconds. Long-form earns its length only by stacking distinct, useful beats — never by padding."
  },
  {
    id: "structure-phs",
    title: "Hook → Promise → Steps → Proof → Payoff → CTA",
    source: "Educational video scripting framework",
    tags: ["structure", "script", "teaching", "framework", "training"],
    text: "A reliable teaching structure: Hook (stop the scroll), Promise (what they'll be able to do), Steps (the method, numbered), Proof (evidence or example per step), Payoff (the transformation), CTA (one clear next action). Numbered steps raise completion because viewers self-locate in the list."
  },
  {
    id: "short-structure",
    title: "Short-form is one loop, one idea",
    source: "Short-form retention patterns",
    tags: ["shorts", "linkedin", "structure", "short", "pacing"],
    text: "A short under 60 seconds carries exactly one idea: hook in the first second, deliver the single insight, end on a snap conclusion or question. No intro, no recap. The last line should be quotable on its own. Cramming a long-form outline into a short kills it."
  },
  {
    id: "spoken-grammar",
    title: "Write for the ear, not the eye",
    source: "Voiceover scriptwriting craft",
    tags: ["script", "voiceover", "narration", "style"],
    text: "Narration uses short sentences, active voice, concrete nouns, and second person ('you'). Read every line aloud; if you run out of breath it is too long. Contractions and one-beat sentences create rhythm. Avoid clauses that only parse on a page — the ear cannot rewind."
  },
  {
    id: "linkedin-behavior",
    title: "LinkedIn rewards insight that makes the viewer look smart",
    source: "LinkedIn distribution behavior",
    tags: ["linkedin", "distribution", "professional", "caption"],
    text: "On LinkedIn, native video and a strong text caption work together: most feeds autoplay muted, so the first on-screen words and bold captions carry the hook. Lead the post copy with a one-line claim a professional would want to repost. Square or 16:9 both autoplay; captions are non-negotiable because of muted playback."
  },
  {
    id: "youtube-ctr",
    title: "Title and thumbnail are a single unit",
    source: "YouTube click-through research",
    tags: ["youtube", "thumbnail", "title", "ctr", "packaging"],
    text: "On YouTube the title and thumbnail are judged together and must not repeat each other — they should combine into one compelling promise with a curiosity gap. Thumbnails use 3–4 huge words, one focal subject, and high contrast so they read at phone size. The title front-loads the keyword and the benefit."
  },
  {
    id: "captions-accessibility",
    title: "Burned-in captions are a retention tool, not just access",
    source: "Caption uplift studies",
    tags: ["captions", "accessibility", "retention", "subtitles", "shorts"],
    text: "Animated word-by-word captions lift watch time materially because most mobile viewing is muted and captions create a reading rhythm that holds the eye. Keep 3–5 words on screen at once, high contrast, safe-area aware. Provide an SRT for the platform's own captioning as well."
  },
  {
    id: "faceless-visuals",
    title: "Faceless video earns trust through clarity, not a face",
    source: "Faceless channel production patterns",
    tags: ["faceless", "visuals", "broll", "motion", "design"],
    text: "Without a presenter, the visuals carry credibility: clean kinetic typography, one consistent motif system, restrained motion, and a coherent palette. Every claim should have a matching on-screen visual (a number, a chart, a diagram, a keyword) so the eye confirms what the ear hears. Consistency reads as authority."
  },
  {
    id: "cta-single",
    title: "One CTA, stated once, at the end",
    source: "Conversion behavior on video CTAs",
    tags: ["cta", "conversion", "ending", "training", "coaching"],
    text: "Multiple asks split action and reduce all of them. Choose one next step (subscribe, comment a keyword, book a call, grab the free guide) and state it plainly at the moment of peak value — right after the payoff, before the video ends."
  },
  {
    id: "sourcing-claims",
    title: "Every factual claim needs a primary or reputable source",
    source: "Editorial fact-check standards",
    tags: ["factcheck", "sources", "trust", "accuracy", "rag"],
    text: "Numbers, dates, names, quotes, and causal claims must trace to a primary or reputable secondary source. Prefer the original study or filing over a blog summarizing it. Distinguish fact ('revenue grew 40% in 2023') from interpretation ('this proves the strategy worked'). Flag anything you cannot source rather than smoothing it over."
  },
  {
    id: "hallucination-guard",
    title: "Unverifiable specifics are the failure mode to hunt",
    source: "LLM content reliability practice",
    tags: ["factcheck", "accuracy", "rag", "trust", "hallucination"],
    text: "The dangerous errors are confident, specific, and wrong: invented statistics, misattributed quotes, fake studies, wrong dates. The fix is to ground each specific in retrieved text and to downgrade any claim that retrieval cannot support to 'needs review' with an explicit note — never present an ungrounded specific as settled."
  },
  {
    id: "teaching-coaching",
    title: "Teaching transfers a skill; coaching transfers a decision",
    source: "Instructional design vs. coaching practice",
    tags: ["training", "coaching", "education", "audience", "offer"],
    text: "A training video gives a repeatable method the viewer can execute alone. A coaching offer sells the judgment to apply it to their specific situation. End teaching content by naming the one judgment call the method cannot make for them — that gap is the honest bridge to a coaching offer."
  }
];

// ── Platform specs ──────────────────────────────────────────────────────────
// Honoring Taz's spec: both cuts ship 16:9.
export const PLATFORMS = {
  youtube: {
    platform: "youtube" as const,
    label: "YouTube — long-form (16:9)",
    aspect: "16:9" as const,
    targetSeconds: 360, // ~6 min teaching cut
    sceneCount: [7, 9] as const,
    titleMax: 70,
    notes: "Front-load keyword + benefit. Title and thumbnail must not repeat."
  },
  linkedin: {
    platform: "linkedin" as const,
    label: "LinkedIn — short (16:9)",
    aspect: "16:9" as const,
    targetSeconds: 50, // punchy single-loop short, 16:9 per spec
    sceneCount: [4, 5] as const,
    titleMax: 90,
    notes: "Autoplays muted — first on-screen words and the caption carry the hook."
  }
};

// Proven title formulas (structural templates, not topic facts).
export const TITLE_FORMULAS = [
  (t: string) => `The ${t} mistake almost everyone makes (and the 60-second fix)`,
  (t: string) => `${cap(t)}, explained in a way that finally sticks`,
  (t: string) => `How to actually get good at ${t} — the method, not the platitudes`,
  (t: string) => `${cap(t)}: what the pros do that nobody tells you`,
  (t: string) => `Stop doing ${t} the slow way. Do this instead.`,
  (t: string) => `The 3 things about ${t} I wish I'd known years ago`
];

// Hook formulas — the first spoken line.
export const HOOK_FORMULAS = [
  (t: string) => `Most advice about ${t} is wrong — here's what actually works.`,
  (t: string) => `If ${t} feels harder than it should, you're probably missing this one thing.`,
  (t: string) => `There's a faster way to get good at ${t}, and almost nobody teaches it.`,
  (t: string) => `Everyone overcomplicates ${t}. It really comes down to three moves.`,
  (t: string) => `The difference between people who struggle with ${t} and people who don't is one habit.`
];

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ── Retrieval ───────────────────────────────────────────────────────────────
// A small but honest keyword retriever: tokenize, light stem, score by tag and
// body term frequency with an inverse-frequency-ish boost for rarer terms.
const STOP = new Set(
  "a an and the to of for in on with how why what is are be do does your you my our it this that these those make making create video videos".split(
    " "
  )
);

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .map((w) => w.replace(/(ing|ed|es|s)$/i, ""))
    .filter((w) => w.length > 2 && !STOP.has(w));
}

// Document frequency for inverse weighting.
const DF: Record<string, number> = {};
for (const c of CORPUS) {
  const seen = new Set(tokenize(c.title + " " + c.tags.join(" ") + " " + c.text));
  for (const t of seen) DF[t] = (DF[t] || 0) + 1;
}

export function retrieve(query: string, k = 5): KnowledgeChunk[] {
  const q = tokenize(query);
  if (q.length === 0) return CORPUS.slice(0, k);
  const scored = CORPUS.map((c) => {
    const tagTokens = new Set(c.tags.flatMap((t) => tokenize(t)));
    const body = tokenize(c.text + " " + c.title);
    let score = 0;
    for (const term of q) {
      const idf = Math.log((CORPUS.length + 1) / ((DF[term] || 0) + 1)) + 1;
      if (tagTokens.has(term)) score += 2.5 * idf; // a tag hit is a strong signal
      const tf = body.filter((b) => b === term).length;
      score += tf * idf;
    }
    return { c, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((s) => s.c);
}

// Turn retrieved chunks into Citations so the corpus shows up alongside live
// web sources with the same provenance treatment.
export function chunksAsCitations(chunks: KnowledgeChunk[]): Citation[] {
  return chunks.map((c, i) => ({
    id: `C${i + 1}`,
    title: c.title,
    source: c.source,
    kind: "corpus" as const,
    note: "Curated clean-data corpus"
  }));
}
