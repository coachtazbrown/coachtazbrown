# Galactic Studio by Taz

**Give it a topic. Get two finished, fact-checked, faceless videos.**

Galactic Studio turns one line — *"compound interest"* — into a faceless **YouTube long-form** video and a **16:9 LinkedIn short**: researched live, grounded on clean data with RAG, fact-checked claim by claim, and rendered in the browser with kinetic captions and voiceover. Script, captions (.srt), post copy, tags, a thumbnail concept, and the rendered video all come out ready to ship.

It's built on one principle most AI video tools skip: **you should be able to stand behind everything you publish.** No specific — number, date, name, quote — ships marked "verified" without a citation.

The whole thing is one Next.js 14 codebase. It runs locally in two commands.

---

## What it does

1. **You give a topic.** One line. That's the entire input.
2. **It researches live.** Web search pulls current, reputable sources and captures every citation.
3. **It grounds on clean data.** RAG retrieval over a curated craft corpus (`lib/studio/knowledge.ts`) shapes structure, hooks, and pacing — not guesswork.
4. **It writes both cuts.** A ~6-minute YouTube teaching video and a ~50-second 16:9 LinkedIn short, written for the ear, scene by scene.
5. **It fact-checks everything.** Every claim is graded (`verified` / `needs-review` / `corrected` / `opinion`) with a citation. Unsourced specifics are flagged, never smoothed over.
6. **It renders the video.** A real canvas engine plays the faceless video — galaxy visuals, per-scene motifs, kinetic typography, burned-in captions, spoken voiceover — and **exports to a downloadable `.webm`**, entirely client-side.

> **16:9 for both cuts** is by design (Taz's spec). Vertical (9:16) is a one-field change — `lib/studio/knowledge.ts → PLATFORMS` and the renderer already key off `aspect`.

---

## Run it locally

```bash
npm install
cp .env.example .env.local        # optional — the Studio runs a full offline engine without a key
npm run dev                       # http://localhost:3000
```

Pages worth visiting:

| Path | What it is |
|---|---|
| `/` | The pitch — one topic in, two videos out |
| `/studio` | **The Studio** — type a topic, watch the pipeline, get both videos |
| `/training` | Training & coaching by Taz — self-paced, group, and 1:1 |

### The generation engine

`POST /api/studio/generate` accepts `{ topic }` and returns `{ production }` — the full package: both 16:9 cuts (scenes, voiceover, on-screen captions, post copy, tags, chapters), the RAG grounding with sources, the fact-check with per-claim verdicts and citations, a thumbnail concept, and a publish checklist. The shape is defined in `lib/studio/types.ts`.

**No API key required.** Leave `ANTHROPIC_API_KEY` empty (or set `AGENTS_DEMO_MODE=true`) and the Studio runs its **honest offline engine** (`lib/studio/demo.ts`): a complete, genuinely useful production grounded in the corpus, with every checkable specific flagged for live verification. It never fakes a source. With a real key, the live agent (`lib/studio/agent.ts`) researches with web search and verifies each claim against live sources.

Engine map:

- `lib/studio/types.ts` — the `Production` contract every layer reads from
- `lib/studio/knowledge.ts` — the clean-data corpus + a real keyword retriever + platform specs
- `lib/studio/factcheck.ts` — claim extraction and grading (runs over the *finished* script)
- `lib/studio/demo.ts` — the offline production engine
- `lib/studio/agent.ts` — the live agent: Claude + web search → structured production
- `components/studio/VideoPlayer.tsx` — the canvas video renderer + `.webm` export
- `components/studio/StudioConsole.tsx` — the topic console, pipeline view, and asset downloads

---

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** with a custom bone/ink/accent palette + a space palette in the renderer
- **Anthropic SDK** (`@anthropic-ai/sdk`) — Claude with tool use + server-side web search
- **Zod** for API input validation
- **Canvas + MediaRecorder + Web Audio / Web Speech** — the faceless video renderer, voiceover, and export, all client-side. No paid render API. The **studio voice** (ElevenLabs via `/api/voice/speak`) re-paces each scene to the real narration and is muxed into the exported `.webm`; with no key it falls back to the browser voice.

---

## Deploy

```bash
vercel deploy        # or: vercel.com/new → import the repo → Deploy
```

The marketing/training pages are fully static; the Studio is one dynamic API route. It deploys and runs with **zero env vars** (offline generation engine + the baked-in Supabase library both work out of the box).

### Environment variables (all optional)

Set these in **Vercel → Project → Settings → Environment Variables**, then **redeploy** — env vars only apply to *new* builds, so adding a key without redeploying changes nothing (a common gotcha).

| Variable | What it unlocks | Without it |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | Live web research + per-claim fact-checking during generation | Offline engine (still grounded, still fact-checked from the corpus) |
| `ELEVENLABS_API_KEY` | **Studio voice** — real ElevenLabs narration muxed into the export | Falls back to the browser voice |
| `ELEVENLABS_VOICE_ID` | Override the default voice | Default `CMlaXsNkOUgEvTGpIezg` (must exist in the key's account) |
| `SUPABASE_URL` / `SUPABASE_ANON_KEY` | Point cross-device sync at your own Supabase project | Uses the baked-in project |
| `AGENTS_MODEL`, `AGENTS_DEMO_MODE` | Model override / force the offline engine | Defaults |

> **Studio voice not working after deploy?** It needs `ELEVENLABS_API_KEY` set **on the server** (local `.env.local` is never uploaded — it's gitignored), and the chosen voice ID must be present in that ElevenLabs account. Add the key, redeploy, and confirm the voice exists in the account.

---

## What to build next (in priority order)

1. **Cloud render to MP4** — render the canvas server-side (e.g. headless + ffmpeg) for a universally-compatible MP4. The studio voice is already muxed into the client-side `.webm` export today.
2. **Vector corpus** — move `lib/studio/knowledge.ts` into a vector store for richer retrieval as the corpus grows.
3. **Direct publishing** — push finished cuts to the YouTube and LinkedIn APIs from the Studio.
4. **Team workspaces** — shared libraries, brand kits, and approval flows on top of the production model.
5. **Direct publishing** — push finished cuts straight to the YouTube and LinkedIn APIs.

Already shipped: a UI **voice picker** (incl. custom ElevenLabs IDs), MP4-preferred export, full-production JSON export, a **local production library**, and **cross-device sync** (Supabase, capability-key — no login).

### Cross-device library (Supabase)

Every production is saved locally. To sync across devices, open **☁ Sync across devices** in the library, set a secret **sync key** (a passphrase), and use the same key elsewhere. The model is capability-based — no accounts:

- The `studio_library` table has **RLS on with no direct policies**; it can't be read or written directly.
- All access goes through `SECURITY DEFINER` RPCs (`lib_list` / `lib_upsert` / `lib_delete`) scoped by the key. Knowing the key is the capability, so keep it private.
- The publishable/anon key is safe to ship (it's designed to be public). A working project is baked in; override with `SUPABASE_URL` + `SUPABASE_ANON_KEY` for your own.

---

> This repo also contains an earlier project — **Taz Brown Strategies**, a red-teaming practice and its AI partner "Nia" (`/method`, `/pricing`, `/dashboard`, `/workspace`, `lib/redteam-*`). It still builds and runs; Galactic Studio is the current product.
