// Galactic Studio — the live production agent.
//
// With an ANTHROPIC_API_KEY present, this runs the real pipeline: Claude
// researches the topic with web search (RAG over live, reputable sources),
// grounds the script in the curated craft corpus, writes both 16:9 cuts, and
// fact-checks every claim with citations. Any failure degrades gracefully to the
// offline engine so the studio always returns a usable production.

import Anthropic from "@anthropic-ai/sdk";
import { DEMO_MODE, MODEL, anthropic } from "@/lib/anthropic";
import { CORPUS, PLATFORMS, retrieve } from "./knowledge";
import { buildDemoProduction } from "./demo";
import { extractClaims, scoreFactCheck } from "./factcheck";
import type { Citation, Cut, FactCheckItem, Motif, Production, Scene, Verdict } from "./types";

const MOTIFS: Motif[] = ["orbit", "starfield", "bars", "grid", "spark", "path", "quote"];

const deliverTool: Anthropic.Tool = {
  name: "deliver_production",
  description:
    "Deliver the finished, fact-checked video production package. Call this exactly once, after you have researched the topic with web search and grounded the script. Provide BOTH cuts: the YouTube long-form (16:9) and the LinkedIn short (16:9).",
  input_schema: {
    type: "object",
    required: ["angle", "audience", "thesis", "grounding_brief", "sources", "cuts", "fact_check", "thumbnail", "publish_checklist"],
    properties: {
      angle: { type: "string", description: "The specific creative angle for this video." },
      audience: { type: "string", description: "Who this is for, specifically." },
      thesis: { type: "string", description: "The single core argument in one sentence." },
      grounding_brief: {
        type: "string",
        description: "2–3 sentences on what the script was grounded in (which live sources + craft principles)."
      },
      sources: {
        type: "array",
        description: "The live web sources used. Reputable/primary preferred.",
        items: {
          type: "object",
          required: ["id", "title", "source"],
          properties: {
            id: { type: "string", description: "Stable id like S1, S2 — referenced by scenes and fact-check items." },
            title: { type: "string" },
            source: { type: "string", description: "Publisher / outlet." },
            url: { type: "string" }
          }
        }
      },
      cuts: {
        type: "array",
        description: "Exactly two cuts: youtube (long-form, ~6 min) then linkedin (short, ~50s). Both 16:9.",
        items: {
          type: "object",
          required: ["platform", "title", "hook", "scenes", "post_copy", "tags", "hashtags"],
          properties: {
            platform: { type: "string", enum: ["youtube", "linkedin"] },
            title: { type: "string" },
            hook: { type: "string", description: "The first spoken line — must stop the scroll in the first 3 seconds." },
            scenes: {
              type: "array",
              items: {
                type: "object",
                required: ["role", "seconds", "voiceover", "onScreen", "visual", "motif"],
                properties: {
                  role: { type: "string", description: "Hook, Promise, Stakes, Step 1, Proof, Payoff, CTA, etc." },
                  seconds: { type: "number" },
                  voiceover: { type: "string", description: "Exactly what the narrator says. Write for the ear." },
                  onScreen: { type: "string", description: "3–6 word kinetic caption." },
                  visual: { type: "string", description: "Art-direction note for the faceless visual." },
                  motif: { type: "string", enum: MOTIFS },
                  citations: { type: "array", items: { type: "string" }, description: "Source ids this beat leans on." }
                }
              }
            },
            post_copy: { type: "string", description: "The caption/description to paste when publishing." },
            tags: { type: "array", items: { type: "string" } },
            hashtags: { type: "array", items: { type: "string" } },
            chapters: {
              type: "array",
              items: {
                type: "object",
                required: ["atSec", "label"],
                properties: { atSec: { type: "number" }, label: { type: "string" } }
              }
            }
          }
        }
      },
      fact_check: {
        type: "array",
        description: "One entry per checkable claim across BOTH scripts. Nothing 'verified' without a citation.",
        items: {
          type: "object",
          required: ["claim", "verdict", "confidence", "evidence", "citations"],
          properties: {
            claim: { type: "string" },
            verdict: { type: "string", enum: ["verified", "needs-review", "corrected", "opinion"] },
            confidence: { type: "number" },
            evidence: { type: "string" },
            citations: { type: "array", items: { type: "string" } },
            correction: { type: "string" }
          }
        }
      },
      thumbnail: {
        type: "object",
        required: ["headline", "subtext", "palette", "art"],
        properties: {
          headline: { type: "string" },
          subtext: { type: "string" },
          palette: { type: "string" },
          art: { type: "string" }
        }
      },
      publish_checklist: { type: "array", items: { type: "string" } }
    }
  }
};

function systemPrompt(topic: string): string {
  const corpus = CORPUS.map((c) => `- ${c.title} (${c.source}): ${c.text}`).join("\n");
  return [
    "You are the production engine of Galactic Studio by Taz — an automated studio that turns a single topic into faceless, fact-checked videos for YouTube and LinkedIn.",
    "",
    "YOUR JOB for this run:",
    `1. RESEARCH the topic "${topic}" using web search. Gather current, reputable, ideally primary sources. Capture them as numbered sources (S1, S2, …).`,
    "2. GROUND the script in those sources AND in the craft corpus below. Do not assert any number, date, name, quote, or causal claim that you did not find in a source.",
    "3. WRITE two cuts, both 16:9: a YouTube long-form teaching video (~6 minutes) and a LinkedIn short (~50 seconds, single idea, autoplay-muted-safe).",
    "4. FACT-CHECK every checkable claim across both scripts. Mark 'verified' ONLY with a citation; mark unsourced specifics 'needs-review'; mark interpretation 'opinion'; if you corrected a claim, mark 'corrected' and give the correction.",
    "5. Deliver everything via the deliver_production tool. Call it exactly once.",
    "",
    "CRAFT CORPUS — ground every structural decision in these principles:",
    corpus,
    "",
    "PLATFORM SPECS (honor exactly — both 16:9 per the studio's spec):",
    `- YouTube: ${PLATFORMS.youtube.label}, ~${PLATFORMS.youtube.targetSeconds}s, ${PLATFORMS.youtube.sceneCount[0]}–${PLATFORMS.youtube.sceneCount[1]} scenes. ${PLATFORMS.youtube.notes}`,
    `- LinkedIn: ${PLATFORMS.linkedin.label}, ~${PLATFORMS.linkedin.targetSeconds}s, ${PLATFORMS.linkedin.sceneCount[0]}–${PLATFORMS.linkedin.sceneCount[1]} scenes. ${PLATFORMS.linkedin.notes}`,
    "",
    "STYLE: Write narration for the ear — short active sentences, second person, concrete nouns. Open loops early, resolve late. One CTA only. End teaching content by naming the one judgment call the method can't make for the viewer — the honest bridge to coaching at Galactic Studio.",
    "Each scene's onScreen caption is 3–6 words. Choose a motif per scene from: orbit, starfield, bars, grid, spark, path, quote.",
    "Be rigorous about accuracy: a confident wrong specific is the worst failure. When unsure, flag it."
  ].join("\n");
}

function asMotif(s: unknown): Motif {
  return MOTIFS.includes(s as Motif) ? (s as Motif) : "starfield";
}

function normalizeCut(raw: any, fallbackTopic: string): Cut {
  const platform = raw?.platform === "linkedin" ? "linkedin" : "youtube";
  const spec = PLATFORMS[platform];
  const scenes: Scene[] = Array.isArray(raw?.scenes)
    ? raw.scenes.map((s: any, i: number) => ({
        id: i + 1,
        role: String(s?.role ?? `Scene ${i + 1}`),
        seconds: Math.max(3, Math.round(Number(s?.seconds) || 10)),
        voiceover: String(s?.voiceover ?? ""),
        onScreen: String(s?.onScreen ?? ""),
        visual: String(s?.visual ?? ""),
        motif: asMotif(s?.motif),
        citations: Array.isArray(s?.citations) ? s.citations.map(String) : undefined
      }))
    : [];
  return {
    platform,
    label: spec.label,
    aspect: spec.aspect,
    targetSeconds: scenes.reduce((a, s) => a + s.seconds, 0),
    title: String(raw?.title ?? `${fallbackTopic}`).slice(0, spec.titleMax),
    hook: String(raw?.hook ?? scenes[0]?.voiceover ?? ""),
    scenes,
    postCopy: String(raw?.post_copy ?? ""),
    tags: Array.isArray(raw?.tags) ? raw.tags.map(String) : [],
    hashtags: Array.isArray(raw?.hashtags) ? raw.hashtags.map(String) : [],
    chapters: Array.isArray(raw?.chapters)
      ? raw.chapters.map((c: any) => ({ atSec: Number(c?.atSec) || 0, label: String(c?.label ?? "") }))
      : undefined
  };
}

function assemble(input: any, topic: string, model: string): Production {
  const sources: Citation[] = Array.isArray(input?.sources)
    ? input.sources.map((s: any, i: number) => ({
        id: String(s?.id ?? `S${i + 1}`),
        title: String(s?.title ?? "Source"),
        source: String(s?.source ?? "web"),
        url: s?.url ? String(s.url) : undefined,
        kind: "web" as const
      }))
    : [];

  const cuts = (Array.isArray(input?.cuts) ? input.cuts : []).map((c: any) => normalizeCut(c, topic));
  if (cuts.length === 0) throw new Error("no cuts produced");

  const items: FactCheckItem[] = Array.isArray(input?.fact_check)
    ? input.fact_check.map((f: any) => ({
        claim: String(f?.claim ?? ""),
        verdict: (["verified", "needs-review", "corrected", "opinion"].includes(f?.verdict)
          ? f.verdict
          : "needs-review") as Verdict,
        confidence: Math.min(1, Math.max(0, Number(f?.confidence) || 0.5)),
        evidence: String(f?.evidence ?? ""),
        citations: Array.isArray(f?.citations) ? f.citations.map(String) : [],
        correction: f?.correction ? String(f.correction) : undefined
      }))
    : [];

  const chunks = retrieve(topic, 5);

  return {
    topic,
    angle: String(input?.angle ?? ""),
    audience: String(input?.audience ?? ""),
    thesis: String(input?.thesis ?? ""),
    createdAt: new Date().toISOString(),
    model,
    demo: false,
    grounding: {
      brief: String(input?.grounding_brief ?? ""),
      sources,
      retrieved: chunks.map((c) => ({ title: c.title, snippet: c.text.slice(0, 180) + "…" }))
    },
    factCheck: {
      score: scoreFactCheck(items),
      summary:
        items.length === 0
          ? "No hard factual claims were asserted."
          : `${items.length} claims checked against live sources. ${items.filter((i) => i.verdict === "verified").length} verified with citations, ${items.filter((i) => i.verdict === "needs-review").length} flagged for review.`,
      items
    },
    cuts,
    thumbnail: {
      headline: String(input?.thumbnail?.headline ?? topic),
      subtext: String(input?.thumbnail?.subtext ?? ""),
      palette: String(input?.thumbnail?.palette ?? "Deep space indigo + electric lime on near-black."),
      art: String(input?.thumbnail?.art ?? "")
    },
    publishChecklist: Array.isArray(input?.publish_checklist)
      ? input.publish_checklist.map(String)
      : []
  };
}

export async function produceVideo(rawTopic: string): Promise<Production> {
  const topic = rawTopic.trim();
  if (DEMO_MODE) return buildDemoProduction(topic, "offline-engine");

  try {
    const client = anthropic();
    const messages: Anthropic.MessageParam[] = [
      { role: "user", content: `Produce the full Galactic Studio package for this topic: "${topic}". Research it with web search first, then deliver both 16:9 cuts.` }
    ];

    const tools: any[] = [
      { type: "web_search_20250305", name: "web_search", max_uses: 6 },
      deliverTool
    ];

    for (let step = 0; step < 8; step++) {
      const res = await client.messages.create({
        model: MODEL,
        max_tokens: 8000,
        system: systemPrompt(topic),
        tools,
        messages
      });

      const deliver = res.content.find(
        (b): b is Anthropic.ToolUseBlock => b.type === "tool_use" && b.name === "deliver_production"
      );
      if (deliver) return assemble(deliver.input, topic, MODEL);

      if (res.stop_reason === "tool_use") {
        // Server tools (web_search) are executed by the API; just continue the loop.
        messages.push({ role: "assistant", content: res.content });
        const localToolUses = res.content.filter(
          (b): b is Anthropic.ToolUseBlock => b.type === "tool_use" && b.name !== "web_search"
        );
        if (localToolUses.length > 0) {
          messages.push({
            role: "user",
            content: localToolUses.map((tu) => ({
              type: "tool_result" as const,
              tool_use_id: tu.id,
              content: "Received. Now call deliver_production with the full package."
            }))
          });
        }
        continue;
      }

      // Model stopped without delivering — nudge once, then bail to demo.
      messages.push({ role: "assistant", content: res.content });
      messages.push({
        role: "user",
        content: "Now call deliver_production with both 16:9 cuts and the fact-check."
      });
    }
    return buildDemoProduction(topic, MODEL);
  } catch (err) {
    console.error("[studio] live production failed, using offline engine", err);
    return buildDemoProduction(topic, "offline-engine");
  }
}

// Re-export so the API can run the safety-net claim extractor if needed.
export { extractClaims };
