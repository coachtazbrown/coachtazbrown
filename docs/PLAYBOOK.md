# The $1M Retail Agent Co. Playbook

Strategy document for the agency, not for the codebase. Living doc — edit as you learn.

---

## 1. The bet

There are roughly **250,000 US Shopify merchants doing $500K–$10M GMV**. They have moved past "Shopify + Klaviyo + Gorgias" but cannot afford an enterprise stack, an in-house engineering team, or a full retainer agency. Every one of them has the same four problems:

1. The site converts at 2–3% and they don't know why.
2. They overspend on Meta and Google ads because they fired their freelancer.
3. They are drowning in support tickets, returns, and WISMO.
4. They cannot keep up with content (descriptions, reviews, posts, local SEO).

We sell **eight named AI agents** that each solve one of those problems. Productized. Fixed-price. Cancel anytime. ROI-guaranteed.

---

## 2. The math to $1M ARR

| Shape | Customers | ARPA / mo | ARR | Notes |
|---|---|---|---|---|
| A | 150 | $583 | $1.05M | Starter-heavy. Self-serve dominant. |
| **B (target)** | **120** | **$800** | **$1.15M** | Growth-heavy. 1 closer can hit this in 18 mo. |
| C | 75 | $1,167 | $1.05M | Scale-heavy. Higher touch, slower ramp. |
| D | 30 | $2,778 | $1.0M | Multi-location chains. Long sales cycle, fat ACV. |

Plus **services revenue**: ~$2,500 setup × 120 = **$300K one-time** in year 1.

**Total Y1 target: ~$1.4M revenue, ~$1.1M ARR exiting Y1.**

---

## 3. Who to sell to (ICP rankings)

| Rank | Segment | Why | Channel |
|---|---|---|---|
| 1 | **Shopify specialty retail $1M–$5M GMV** | API maturity, App Store distribution, broadest TAM | Shopify App Store + outbound via Storeleads |
| 2 | **Independent jewelers, opticians, furniture** | High AOV, high margin, will pay $2K+/mo | Trade shows: JCK, Vision Expo, Las Vegas Market |
| 3 | **Cannabis dispensaries** | High WTP, compliance-driven, underserved | MJBizCon, dispensary-only Slack groups |
| 4 | **Multi-location independents** (2–15 stores) | Big ACV per logo via franchise/co-op deals | Direct to franchisor / buying co-ops |
| 5 | **DTC brands $1M–$20M on Shopify Plus** | Fired their last agency, hungry | Klaviyo Partner network, eTail, Shoptalk |
| 6 | **Regional grocers, liquor, convenience** | Low AI penetration | Lightspeed / NCR Aloha resellers |

**Wedge ICP-1**: Shopify specialty retail, $1M–$5M GMV. Pick one micro-vertical inside it (e.g., independent jewelers) and dominate before expanding.

---

## 4. The product wedge: eight named agents

| Agent | Role | Replaces | Wedge metric | Starts at |
|---|---|---|---|---|
| **Maya** | Storefront Concierge | Live chat + a sales associate | +12% conversion | $497/mo |
| **Rex** | Re-order & Demand | Inventory analyst | −30% stockouts | $497/mo |
| **Nova** | Ad Spend | Media buyer ($1.5–4K/mo) | −25% CAC | $997/mo |
| **Echo** | Reviews & Reputation | Yotpo + VA | +40 reviews/mo | $497/mo |
| **Sage** | Listings & SEO | Copywriter + SEO agency | +22% organic clicks | $497/mo |
| **Pip** | Customer Service | Gorgias agent | 70% one-touch | $997/mo |
| **Vox** | Voice Receptionist | Answering service | 94% after-hours answered | $297/mo |
| **Atlas** | Local SEO / GBP | Local SEO agency | Top-3 map pack | $497/mo |

Each agent has: one integration to start, one wedge metric, one named persona, one fixed price, one 30-day refund.

---

## 5. Pricing

| Plan | $/mo | Includes |
|---|---|---|
| Starter | $497 | 2 agents, 1 store, self-serve |
| **Growth** (target) | **$997** | 5 agents, 3 stores, monthly tuning + ROI report |
| Scale | $2,497 | All 8 agents, unlimited stores, shared Slack, QBR |

Plus **$2,500 setup** (waived annual), **$200/mo per extra location**, **2 weeks free trial on Maya only**.

---

## 6. The 0→$1M roadmap (24 months)

| Quarter | Customers | ARR | Key moves |
|---|---|---|---|
| Q1 | 5 design partners (free + comp swag) | $0 | Build Maya, ship to 5 jewelers. Capture every conversation for evals. |
| Q2 | 15 paying | $180K | Launch Echo + Sage. List Maya on Shopify App Store. |
| Q3 | 35 | $420K | Hire 1 closer. Launch Nova + Pip. First case studies. |
| Q4 | 60 | $720K | Conference: JCK + Shoptalk. Land 2 multi-location deals. |
| Y2 Q1 | 85 | $1.0M | Launch Vox + Atlas. Run first paid Meta campaign. |
| Y2 Q2 | 120 | $1.4M | Hire CS lead. Run partner referral program. Pass $1M ARR comfortably. |

---

## 7. Distribution channels (where the $1M comes from)

1. **Shopify App Store** — Maya listed free (with paid managed upgrade). Average free-to-paid 8% at our price. Target: 250 installs/mo by Y2.
2. **Outbound** — 200 Storeleads-filtered emails/day with a 60-second Loom showing Maya installed on the prospect's actual store. Target: 1.2% reply, 12% reply→demo, 28% demo→close = ~3 deals per 1,000 emails.
3. **Partner channel** — 20% revshare with Shopify Plus agencies, Klaviyo Master partners, 3PLs.
4. **Trade shows** — JCK (jewelers), Vision Expo (optical), MJBizCon (cannabis), Shoptalk, eTail. One booth + a Loom-on-arrival giveaway.
5. **Content** — weekly "Retail Agent Benchmark" report (CVR, CAC, support volume by category). SEO + PR engine.

---

## 8. Defensibility — why this isn't a GPT wrapper

- **Retail-specific evals**: brand-voice adherence, recommendation quality, returns-policy compliance, hallucination rate. Every prompt change runs through the harness before shipping.
- **Integration library**: Shopify, Square, Lightspeed, Klaviyo, Gorgias, Meta Ads, Google Ads, Google Business, Yelp, Twilio. Each is a multi-month moat for a competitor.
- **Vertical playbooks**: Maya for a jeweler is configured differently than Maya for a pet brand. The playbook is the product.
- **Cross-store benchmarks**: "stores like yours convert at X% — you're at Y%." Data network effect.
- **Brand**: each agent is a named character with a fixed role. Way stickier than a settings page called "AI Assistant".

---

## 9. The first 30 sales emails (template)

Subject: `Maya at {{merchant.brand}}`

Body:

> Hey {{first_name}},
>
> Spent 20 min on {{merchant.url}} last night and recorded a Loom of Maya — our concierge AI — handling three of the questions a customer would actually ask on your site: a product rec under $X, a WISMO on a fake order, and your return policy.
>
> Loom (90s): {{loom_url}}
>
> If she's worse than what you've got, I'll buy you lunch. If she's better, we install her on your store in a week for $497/mo. Cancel anytime.
>
> — {{founder_name}}

The Loom is the asset. Building the script that auto-generates per-merchant Looms is the **single highest-ROI thing to build after the platform itself**.

---

## 10. Risks to track

- **Prompt regression** — fix with the eval harness, not vibes.
- **Customer thinks "AI" not "employee"** — defeat with names. Maya, not "the AI assistant."
- **Integration churn** — Shopify API changes will break things. Budget 1 engineer-day/week for plumbing.
- **OpenAI / Shopify Magic / Klaviyo bundling AI for free** — defend with verticality, brand, and the human-in-the-loop guarantee.
- **Hallucination liability** — guardrails enforce "never invent a product/price/promo." Tool calls are mandatory for any factual claim.

---

## 11. Who I sell this agency to (exit options)

When Retail Agent Co. is doing $5–15M ARR with 600+ logos, the natural buyers are:

| Acquirer type | Examples | Why |
|---|---|---|
| **Retail SaaS rollups** | Klaviyo, Gorgias, Shopify | Wants vertical AI to defend against horizontal AI |
| **Agency holdcos** | Tinuiti, Wpromote, Power Digital, JellyFish | Sells our agents as part of their managed services |
| **Vertical PE** | Mainsail, Vista, Battery | Bolt-on for a retail SaaS portfolio |
| **PSP / commerce infra** | Stripe, Square, Lightspeed, Block | Want managed AI as an upsell to their payment book |
| **3PL / fulfillment** | ShipBob, Stord, Flexport | Add managed AI to their merchant suite |

Comparable deals: **Hawke Media** (acquired by Cherrytree, ~$60M), **Common Thread Collective**, **Power Digital** (PE-backed at $1B+). A productized agency at $5M ARR with 70% gross margin and a clean Shopify integration moat is a $30–80M outcome.

---

## 12. Operating cadence

- **Weekly**: ship one prompt or integration. Run evals. Send one outbound batch.
- **Monthly**: ROI reports go out to every tenant. New benchmark report published.
- **Quarterly**: ICP review (are we still selling to jewelers? expand?), pricing review, churn post-mortem.
- **Yearly**: new agent launch. Eight today, ten next year.
