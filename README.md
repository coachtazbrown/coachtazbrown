# Taz Brown Strategies

A red-teaming practice for founders and leadership teams — and the AI partner that runs it.

We don't hand clients a strategy to nod at. We stress-test the one they already have: the unexamined assumption, the plan everyone agreed with too fast, the bet that's irreversible. We red-team it **before reality does**, while it's still cheap to change.

This repo is the practice's site and its working **Red Teaming Partner** — an AI business partner that coaches Taz on exactly which adversarial move to run on a client's decision, how to facilitate it without becoming the consultant, and how each exercise ladders into a retained engagement.

The whole thing is one Next.js 14 codebase. It runs locally in two commands.

---

## The practice in one paragraph

Most strategy failures aren't bad logic — they're sound logic on one assumption nobody was paid to attack. Taz Brown Strategies installs the adversarial thinking that finds it, drawing on the full canon from the Devil's Advocate (1587) to modern business red teaming (Hoffman, 2017+). Engagements climb a four-rung value ladder — **Land → Diagnose → Cadence → Install & Partner** — each rung engineered so the client asks for the next. Wins compound into referrals, not invoices. The full go-to-market is in [`docs/PLAYBOOK.md`](docs/PLAYBOOK.md).

---

## Run it locally

```bash
npm install
cp .env.example .env.local        # optional — the Partner runs in demo mode without a key
npm run dev                       # http://localhost:3000
```

Pages worth visiting:

| Path | What it is |
|---|---|
| `/` | The pitch — the practice, the Partner, the canon |
| `/method` | The whole canon, earliest to latest: red teaming, coaching, thinking models |
| `/pricing` | The four-rung value ladder as priced engagements |
| `/dashboard` | The practice's book of business — clients by ladder rung |
| `/workspace` | **The Red Teaming Partner** — the live, tool-using AI partner |

### The Red Teaming Partner, the working agent

`POST /api/chat/redteam` accepts `{ messages: [{role, content}] }` and replies with `{ reply, toolCalls }`. It uses Claude (`claude-sonnet-4-6` by default) with tool use:

- `recommend_technique` — best-fit moves from the curated lineage for a client situation
- `build_premortem` — a ready-to-run premortem facilitation script for a specific decision
- `stress_test_plan` — a Key Assumptions Check structure against a plan
- `draft_engagement` — where the account sits on the value ladder and how to convert

**No API key required to demo.** Leave `ANTHROPIC_API_KEY` empty (or set `AGENTS_DEMO_MODE=true`) and the Partner runs a fallback that still reasons over the real method — believable and genuinely useful, not canned fluff. With a real key it behaves like the production agent: calls tools, names every technique and its origin, and always ends at the next paid step.

The method itself lives in `lib/redteam-knowledge.ts` — the red-teaming, coaching, and thinking lineages, ordered earliest → latest.

---

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** with a custom bone/ink/accent palette
- **Anthropic SDK** (`@anthropic-ai/sdk`) — Claude with tool use
- **Zod** for API input validation
- No DB. The method and the client book are seeded in `lib/`. In production, swap `lib/practice.ts` for a CRM query and `lib/redteam-knowledge.ts` for a retrievable corpus — the call signatures already look like data-access functions.

---

## Deploy

```bash
vercel deploy
# set env: ANTHROPIC_API_KEY, AGENTS_MODEL (optional), AGENTS_DEMO_MODE (optional)
```

The marketing pages are fully static; the Partner is one dynamic API route.

---

## What to build next (in priority order)

1. **Retrievable method corpus** — move `lib/redteam-knowledge.ts` into a vector store so the Partner cites primary sources verbatim.
2. **Client CRM** — replace `lib/practice.ts` with a real pipeline; track each client's ladder rung and next move.
3. **Engagement artifacts** — generate the assumption table / premortem action list as exportable, owned, dated deliverables.
4. **Calibration ledger** — log every forecast a client makes in a session, resolve it on date, score it across cycles (the Cadence rung only pays off if it compounds).
5. **Referral engine** — turn cleared client wins into case studies and warm intros, closing the loop from Install & Partner back to new Land clients.

See `docs/PLAYBOOK.md` for the full roadmap.
