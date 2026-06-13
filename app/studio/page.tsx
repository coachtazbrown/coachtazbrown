import type { Metadata } from "next";
import StudioConsole from "@/components/studio/StudioConsole";
import { CORPUS_SIZE } from "@/lib/studio/demo";

export const metadata: Metadata = {
  title: "The Studio — Galactic Studio by Taz",
  description:
    "Give it a topic. Get a fact-checked, RAG-grounded faceless video for YouTube and a 16:9 short for LinkedIn — script, scenes, captions, voiceover, and packaging included."
};

export default function StudioPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-3 py-1 text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" /> The Studio · grounded in a
          {" "}{CORPUS_SIZE}-chunk clean-data corpus
        </div>
        <h1 className="mt-4 font-display text-4xl tracking-tight md:text-6xl">
          One topic in. <span className="italic text-accent">Two videos</span> out.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate2">
          Type the topic. Galactic Studio researches it, grounds the script on clean data with
          RAG, fact-checks every claim with citations, and renders a faceless YouTube long-form and
          a 16:9 LinkedIn short — captions, voiceover, thumbnail, and publish copy ready to ship.
        </p>
      </div>

      <StudioConsole />
    </div>
  );
}
