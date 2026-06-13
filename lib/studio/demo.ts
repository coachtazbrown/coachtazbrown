// Galactic Studio — offline production engine.
//
// Builds a complete, genuinely useful Production with no API key, grounded in
// the curated corpus. It writes a real teaching script (structure, hooks,
// captions, both 16:9 cuts, thumbnail, publish checklist) and runs the honest
// fact-check pass. Connect an ANTHROPIC_API_KEY and live mode adds web research
// + per-claim verification on top of this same shape.

import {
  CORPUS,
  HOOK_FORMULAS,
  PLATFORMS,
  TITLE_FORMULAS,
  chunksAsCitations,
  retrieve
} from "./knowledge";
import { gradeClaimsOffline, extractClaims, scoreFactCheck, summarize } from "./factcheck";
import type { Cut, Production, Scene } from "./types";

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Deterministic pick so the same topic always yields the same production.
function pick<T>(arr: T[], seed: string): T {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return arr[h % arr.length];
}

// Normalize an arbitrary topic into a noun phrase that reads well when injected
// mid-sentence by the offline templates. (Live mode writes bespoke scripts and
// doesn't need this.) Strips command/question framing and lowercases the lead,
// preserving acronyms.
function cleanTopic(raw: string): string {
  let t = raw.trim().replace(/[.?!]+$/, "");
  // Strip leading "make me a faceless video about …" style command framing.
  t = t.replace(
    /^(please\s+)?(make|create|build|do|generate|produce)\s+(me\s+)?(a|an|some)?\s*(faceless\s+)?(videos?|shorts?)?\s*(about|on|for|explaining|covering|of)?\s*/i,
    ""
  );
  // Strip leading interrogatives / how-to framing.
  t = t.replace(
    /^(how to|how do i|how does|how can i|how|why do|why does|why is|why are|why|what is|what are|what|the way to|ways? to|tips? (for|on)|a guide to|guide to|learn(ing)?|understand(ing)?|getting good at|mastering|master)\s+/i,
    ""
  );
  t = t.replace(/\b(actually|really)\b/gi, "").replace(/\s+/g, " ").trim();
  // Lowercase the lead so it reads mid-sentence — but never mangle an acronym.
  if (t && !/^[A-Z0-9]{2,}\b/.test(t)) t = t.charAt(0).toLowerCase() + t.slice(1);
  return t;
}

// The three teachable moves. Generic skill-acquisition principles, framed to the
// topic — defensible craft guidance (graded as method/opinion), not invented stats.
function moves(topic: string): { name: string; teach: string; proof: string; caption: string }[] {
  return [
    {
      name: `Start from the one outcome that matters`,
      teach: `Before touching ${topic}, name the single result you actually want. Most people drown in tactics because they never defined the finish line. Write it as one sentence you could say out loud.`,
      proof: `When the outcome is explicit, every later decision about ${topic} becomes a simple yes-or-no: does this move me toward that sentence, or not?`,
      caption: `Define the one outcome`
    },
    {
      name: `Shrink the rep until you can't fail`,
      teach: `Take the smallest version of ${topic} you can practice today and do it badly on purpose. Skill comes from volume of feedback, not from waiting until you feel ready. The small rep is the engine.`,
      proof: `A beginner who does ${topic} for ten messy minutes daily will pass the person who studies it for a month and never starts. Reps compound; reading doesn't.`,
      caption: `Shrink the rep`
    },
    {
      name: `Close the loop with one honest signal`,
      teach: `After each attempt at ${topic}, capture one specific signal of what worked and what didn't — not a vibe, a note. That single line of feedback is what turns repetition into improvement instead of just repetition.`,
      proof: `The difference between people who plateau at ${topic} and people who keep climbing is almost never talent — it's whether they review the tape.`,
      caption: `Review the signal`
    }
  ];
}

function youtubeCut(topic: string): Cut {
  const spec = PLATFORMS.youtube;
  const m = moves(topic);
  const hook = pick(HOOK_FORMULAS, topic)(topic);
  const title = pick(TITLE_FORMULAS, topic + "yt")(topic).slice(0, spec.titleMax);

  const scenes: Scene[] = [
    {
      id: 1,
      role: "Hook",
      seconds: 12,
      voiceover: `${hook} Stay with me, because by the end you'll have a method you can run today.`,
      onScreen: `${cap(topic)}`,
      visual: "Cold open on the title word igniting in a starfield; no intro card.",
      motif: "spark"
    },
    {
      id: 2,
      role: "Promise",
      seconds: 22,
      voiceover: `Here's the promise. In the next few minutes you'll learn three moves that make ${topic} dramatically easier — the same three that separate people who get good fast from people who stay stuck. And the third one is the part almost everyone skips.`,
      onScreen: `Three moves`,
      visual: "Three orbiting rings appear, the third one dimmed — the open loop.",
      motif: "orbit"
    },
    {
      id: 3,
      role: "Stakes",
      seconds: 28,
      voiceover: `First, why this matters. Most people approach ${topic} by collecting more information — more tutorials, more tips, more tabs open. But information isn't the bottleneck. The bottleneck is a method you can repeat. Without one, effort leaks everywhere and progress feels random.`,
      onScreen: `Method beats more info`,
      visual: "A cluttered grid of tabs collapses into a single clean path.",
      motif: "path"
    },
    {
      id: 4,
      role: "Step 1",
      seconds: 40,
      voiceover: `Move one: ${m[0].name}. ${m[0].teach} ${m[0].proof}`,
      onScreen: m[0].caption,
      visual: "Big numeral 1; a single target locks in among noise.",
      motif: "grid"
    },
    {
      id: 5,
      role: "Step 2",
      seconds: 42,
      voiceover: `Move two: ${m[1].name}. ${m[1].teach} ${m[1].proof}`,
      onScreen: m[1].caption,
      visual: "Numeral 2; a large block shrinks to a tiny, doable square that repeats.",
      motif: "bars"
    },
    {
      id: 6,
      role: "Step 3",
      seconds: 44,
      voiceover: `Move three — the one people skip: ${m[2].name}. ${m[2].teach} ${m[2].proof} That's the loop closing — the thing I flagged at the start.`,
      onScreen: m[2].caption,
      visual: "Numeral 3; the dimmed third ring lights up — loop resolved.",
      motif: "orbit"
    },
    {
      id: 7,
      role: "Payoff",
      seconds: 30,
      voiceover: `Put them together and you have a flywheel for ${topic}: one clear outcome, small daily reps, one honest signal after each. Do that for two weeks and you won't recognize where you started. It's not talent — it's the loop.`,
      onScreen: `The flywheel`,
      visual: "The three rings spin together into one accelerating system.",
      motif: "orbit"
    },
    {
      id: 8,
      role: "CTA",
      seconds: 22,
      voiceover: `If you want help applying this to your exact situation — that's the one judgment call a video can't make for you — that's what coaching at Galactic Studio is for. Grab the free starter guide in the description, and tell me in the comments which of the three moves you're starting with.`,
      onScreen: `Start move one today`,
      visual: "Galactic Studio mark; single CTA card, one action.",
      motif: "quote"
    }
  ];

  return {
    platform: "youtube",
    label: spec.label,
    aspect: spec.aspect,
    targetSeconds: scenes.reduce((a, s) => a + s.seconds, 0),
    title,
    hook,
    scenes,
    postCopy: [
      `${title}`,
      ``,
      `Three moves that make ${topic} dramatically easier:`,
      `1. ${moves(topic)[0].name}`,
      `2. ${moves(topic)[1].name}`,
      `3. ${moves(topic)[2].name} — the one most people skip`,
      ``,
      `Free starter guide + coaching: Galactic Studio by Taz.`,
      ``,
      `Chapters:`,
      `0:00 The mistake most people make`,
      `0:34 The 3-move method`,
      `4:40 Putting it together`,
      `5:30 Your next step`
    ].join("\n"),
    tags: [topic, `${topic} for beginners`, `learn ${topic}`, `${topic} tips`, "how to", "tutorial", "skill building", "Galactic Studio"],
    hashtags: [`#${topic.replace(/\s+/g, "")}`, "#learning", "#skills", "#howto"],
    chapters: [
      { atSec: 0, label: "The mistake most people make" },
      { atSec: 62, label: "Move 1 — define the outcome" },
      { atSec: 102, label: "Move 2 — shrink the rep" },
      { atSec: 144, label: "Move 3 — review the signal" },
      { atSec: 280, label: "Putting it together" },
      { atSec: 330, label: "Your next step" }
    ]
  };
}

function linkedinCut(topic: string): Cut {
  const spec = PLATFORMS.linkedin;
  const m = moves(topic);
  const hook = `Nobody gets good at ${topic} by reading more about it.`;

  const scenes: Scene[] = [
    {
      id: 1,
      role: "Hook",
      seconds: 6,
      voiceover: `${hook}`,
      onScreen: `Stop reading. Start reps.`,
      visual: "Hard cut, big text, muted-autoplay-safe — the line lands in second one.",
      motif: "spark"
    },
    {
      id: 2,
      role: "Turn",
      seconds: 10,
      voiceover: `You get good by doing the smallest version of it, today, badly — then reviewing what happened.`,
      onScreen: `Small rep + review`,
      visual: "A huge block shrinks to a tiny repeating square.",
      motif: "bars"
    },
    {
      id: 3,
      role: "Insight",
      seconds: 14,
      voiceover: `Define one outcome. Shrink the rep until you can't fail it. Then capture one honest signal of what worked. That loop is the whole game.`,
      onScreen: `Outcome → Rep → Signal`,
      visual: "Three points draw into a fast loop.",
      motif: "orbit"
    },
    {
      id: 4,
      role: "Proof",
      seconds: 12,
      voiceover: `The people who plateau aren't less talented. They just never review the tape. ${cap(topic)} rewards the loop, not the hours.`,
      onScreen: `Review the tape`,
      visual: "Two lines diverge — one flat, one climbing.",
      motif: "path"
    },
    {
      id: 5,
      role: "CTA",
      seconds: 8,
      voiceover: `Which move are you missing — the outcome, the rep, or the signal? Tell me below.`,
      onScreen: `Which one are you missing?`,
      visual: "Question card; Galactic Studio mark.",
      motif: "quote"
    }
  ];

  return {
    platform: "linkedin",
    label: spec.label,
    aspect: spec.aspect,
    targetSeconds: scenes.reduce((a, s) => a + s.seconds, 0),
    title: `The 3-move loop for getting good at ${topic}`,
    hook,
    scenes,
    postCopy: [
      `Nobody gets good at ${topic} by reading more about it.`,
      ``,
      `The loop that actually works:`,
      `→ Define one outcome`,
      `→ Shrink the rep until you can't fail`,
      `→ Capture one honest signal, then go again`,
      ``,
      `The people who plateau aren't less talented — they just never review the tape.`,
      ``,
      `Which move are you missing? 👇`
    ].join("\n"),
    tags: [topic, "professional development", "skills", "learning"],
    hashtags: ["#learning", "#professionaldevelopment", "#skills", `#${topic.replace(/\s+/g, "")}`]
  };
}

export function buildDemoProduction(rawTopic: string, model: string): Production {
  const topic = cleanTopic(rawTopic) || "a new skill";
  const chunks = retrieve(topic + " script structure hook retention faceless", 6);
  const corpusCites = chunksAsCitations(chunks);

  const cuts = [youtubeCut(topic), linkedinCut(topic)];
  const claims = extractClaims(cuts);
  const items = gradeClaimsOffline(claims, corpusCites);

  return {
    topic,
    angle: `A no-fluff, method-first teaching angle: three repeatable moves anyone can run today, ending on the one judgment call that bridges to coaching.`,
    audience: `Motivated beginners and intermediates who are tired of tip-collecting and want a repeatable method for ${topic}.`,
    thesis: `You don't get good at ${topic} by consuming more — you get good by running a tight loop: one outcome, small reps, one honest signal.`,
    createdAt: new Date().toISOString(),
    model,
    demo: true,
    grounding: {
      brief: `Script structure, hook design, pacing, captions, and the dual 16:9 packaging were grounded in ${chunks.length} chunks of the studio's curated craft corpus. Topic-specific facts are intentionally NOT asserted in offline mode — the fact-check pass flags every checkable specific for live verification so nothing unsourced ships as settled.`,
      sources: corpusCites,
      retrieved: chunks.map((c) => ({ title: c.title, snippet: c.text.slice(0, 180) + "…" }))
    },
    factCheck: {
      score: scoreFactCheck(items),
      summary: summarize(items, true),
      items
    },
    cuts,
    thumbnail: {
      headline: `${cap(topic)}: 3 MOVES`,
      subtext: `The one most people skip`,
      palette: "Deep space indigo + electric lime accent on near-black; one bright focal glyph.",
      art: `A single luminous orbit ring over a starfield, the third node glowing brighter than the rest; three huge words, phone-legible, high contrast.`
    },
    publishChecklist: [
      "Confirm every claim flagged 'needs review' against a primary source before upload.",
      "Burn in animated captions (3–5 words on screen) and attach the .srt for platform captioning.",
      "Export the YouTube cut at 1920×1080; keep the LinkedIn cut 16:9 per spec (swap to 9:16 in one click if you want vertical).",
      "Title + thumbnail must combine into one promise — don't let them repeat each other.",
      "Lead the LinkedIn caption with the one-line claim; it carries the muted autoplay.",
      "One CTA only, stated once after the payoff."
    ]
  };
}

// Exposed so the corpus count can be shown in the UI without importing internals.
export const CORPUS_SIZE = CORPUS.length;
