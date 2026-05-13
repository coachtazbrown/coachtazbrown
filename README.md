# Retail Agent Co.

A productized AI-agent agency for Shopify specialty retailers doing **$1M–$5M GMV**. This repo contains:

- A marketing site that sells eight named AI agents
- A live, demo-able **Storefront Concierge** ("Maya") powered by Claude with tool use
- An operator dashboard for the agency to manage its tenants
- Seed data for a fictional Shopify jewelry brand (**Marlow & Hart**) so you can demo Maya without touching a real store

The whole app is one Next.js 14 codebase. It runs locally in two commands and deploys to Vercel in three.

---

## The business in one paragraph

Eight AI agents — each named, each priced, each replacing a real line item on a retailer's P&L — sold as a managed service to Shopify specialty retailers. Three tiers (`$497 / $997 / $2,497`) plus a $2,500 setup fee. **~120 customers on Growth × 12 months ≈ $1.15M ARR**, reachable in 18–24 months with two founders, a Shopify App Store listing, and a Storeleads outbound motion.

The whole strategy is laid out in [`docs/PLAYBOOK.md`](docs/PLAYBOOK.md).

---

## Run it locally

```bash
npm install
cp .env.example .env.local        # optional — Maya runs in demo mode without a key
npm run dev                       # http://localhost:3000
```

Pages worth visiting:

| Path | What it is |
|---|---|
| `/` | Marketing landing — the pitch |
| `/agents` | All eight agents, productized |
| `/agents/maya` | Per-agent detail page (template for the other seven) |
| `/pricing` | Three tiers, ROI guarantee |
| `/demo` | **Live demo storefront** — Marlow & Hart with the Maya widget embedded |
| `/dashboard` | Operator's view: tenants, ARR-to-goal progress, per-store metrics |
| `/dashboard/agents/maya` | Maya's per-tenant configuration + live preview |

### Maya, the working agent

`POST /api/chat/maya` accepts `{ messages: [{role, content}] }` and replies with `{ reply, toolCalls }`. The agent uses Claude (`claude-sonnet-4-6` by default) with tool use across:

- `search_products` — searches the seeded jewelry catalog
- `get_product` — fetches a single product
- `lookup_order` — requires both order number AND email (guardrailed)
- `get_store_policy` — hours, returns, shipping, warranty
- `request_human_handoff` — escalation hook

**No API key required for sales demos.** Set `MAYA_DEMO_MODE=true` (or just leave `ANTHROPIC_API_KEY` empty) and Maya returns scripted-but-believable replies that hit the same demo conversation flows.

With a real key set, Maya behaves like the production agent: it calls tools, responds with grounded recommendations, and refuses to invent prices or stock.

---

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** with a custom bone/ink/accent palette
- **Anthropic SDK** (`@anthropic-ai/sdk`) — Claude with tool use
- **Zod** for API input validation
- No DB. All catalog / order / tenant data is seeded in `lib/`. When you go to production, swap each `lib/*.ts` for a Supabase query — the call signatures already look like data-access functions.

---

## Deploy

```bash
# Vercel
vercel deploy
# set env: ANTHROPIC_API_KEY, MAYA_MODEL (optional), MAYA_DEMO_MODE (optional)
```

The repo is Vercel-clean: 17 routes prebuilt, one dynamic API route. The marketing pages are fully static.

---

## What to build next (in priority order)

1. **Shopify OAuth + App Store listing** — replace `lib/store-catalog.ts` with the merchant's live Shopify GraphQL.
2. **Supabase tenancy** — `tenants`, `agent_configs`, `conversations`, `tool_calls`, `evals` tables.
3. **Stripe billing** — three plans wired to feature flags per agent.
4. **Evals harness** — replay every conversation against a fixed rubric (brand voice, recommendation quality, guardrail violations) before any prompt change ships.
5. **The other seven agents** — same shape as Maya: a tool-using agent, a config UI, a wedge metric.

See `docs/PLAYBOOK.md` for the full $1M roadmap.
