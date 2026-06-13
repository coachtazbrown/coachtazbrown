// Galactic Studio by Taz — the production data model.
// Every generated video is a `Production`: one topic in, a fully grounded,
// fact-checked, multi-platform package out. The UI, the renderer, and the
// downloadable assets all read from this single contract.

export type Platform = "youtube" | "linkedin";

// Both cuts ship 16:9 by Taz's spec. Vertical (9:16) is a one-field change —
// the renderer and pipeline already key off `aspect`.
export type Aspect = "16:9" | "9:16" | "1:1";

export interface Citation {
  id: string; // e.g. "S1" — referenced by fact-check items and scenes
  title: string;
  source: string; // publisher / outlet / corpus name
  url?: string;
  kind: "web" | "corpus"; // live source vs. curated clean-data corpus
  note?: string;
}

// Each output sentence that asserts a fact gets graded. Nothing ships
// "verified" without a citation — that's the spine of the clean-data promise.
export type Verdict = "verified" | "needs-review" | "corrected" | "opinion";

export interface FactCheckItem {
  claim: string;
  verdict: Verdict;
  confidence: number; // 0..1
  evidence: string; // what the verdict rests on
  citations: string[]; // Citation ids
  correction?: string; // present when verdict === "corrected"
}

// A single beat of the faceless video. The renderer animates `motif`,
// reveals `onScreen` as kinetic captions, and narrates `voiceover`.
export type Motif =
  | "orbit" // rotating rings — for systems, cycles, frameworks
  | "starfield" // drifting stars — for openings, scale, vision
  | "bars" // animated bars — for data, growth, comparison
  | "grid" // building grid — for steps, structure, checklists
  | "spark" // pulse/burst — for the hook and the payoff
  | "path" // a line drawing forward — for process, journeys
  | "quote"; // emphasis card — for the thesis / a strong line

export interface Scene {
  id: number;
  role: string; // "Hook", "Stakes", "Point 1", "Proof", "Payoff", "CTA"
  seconds: number;
  voiceover: string; // exactly what the narrator says
  onScreen: string; // the short kinetic caption (3–6 words)
  visual: string; // human-readable b-roll / art direction note
  motif: Motif;
  citations?: string[]; // Citation ids this beat leans on
}

export interface Cut {
  platform: Platform;
  label: string; // "YouTube — long-form (16:9)"
  aspect: Aspect;
  targetSeconds: number;
  title: string;
  hook: string; // the first spoken line, engineered to stop the scroll
  scenes: Scene[];
  postCopy: string; // the caption/description to paste when publishing
  tags: string[];
  hashtags: string[];
  chapters?: { atSec: number; label: string }[];
}

export interface ThumbnailConcept {
  headline: string; // 2–4 huge words
  subtext: string;
  palette: string;
  art: string; // what the frame shows
}

export interface Production {
  topic: string;
  angle: string;
  audience: string;
  thesis: string;
  createdAt: string;
  model: string;
  demo: boolean;

  // RAG layer — what the script was grounded in, shown to the user so the
  // chain from claim → source is always inspectable.
  grounding: {
    brief: string;
    sources: Citation[];
    retrieved: { title: string; snippet: string }[];
  };

  // Fact-check layer — runs over the finished script, not the draft.
  factCheck: {
    score: number; // 0..100, share of factual claims that are cited/verified
    summary: string;
    items: FactCheckItem[];
  };

  cuts: Cut[]; // [youtube long-form, linkedin short] — both 16:9
  thumbnail: ThumbnailConcept;
  publishChecklist: string[];
}
