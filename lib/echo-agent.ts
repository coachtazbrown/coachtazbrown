import { DEMO_MODE, MODEL, anthropic, extractText } from "@/lib/anthropic";
import type { Review } from "@/lib/echo-data";

export type EchoDraft = {
  reply: string;
  sentiment: "positive" | "neutral" | "negative";
  urgency: "low" | "normal" | "high";
  suggestedAction: "post_reply" | "operator_review" | "escalate_to_human";
  reasoning: string;
};

const SYSTEM = `You are Echo, the AI Reviews & Reputation agent for Marlow & Hart — a small-batch jewelry brand in Providence, RI.
Your job: draft public replies to customer reviews in the brand's voice and classify each review for the operator.

Brand voice for Marlow & Hart: warm, confident, never gushing, specific to the customer's words. Speak as "we." Never invent details (a discount, a name, a piece that wasn't mentioned). 1–3 sentences. Sign off with "— the team at Marlow & Hart" only when the reply is going to a public 5-star review; otherwise no signoff.

Rules:
- For 5-star reviews: thank specifically, reference what the customer said, no upsell, no signoff blob other than the team line.
- For 4-star reviews: acknowledge the imperfection by name (engraving, sizing, clasp). Offer a path (resize, exchange, our atelier). Never promise a discount.
- For 3-star reviews: acknowledge the gap honestly. Offer a path. Stay warm.
- For 2- and 1-star reviews: do NOT post a defensive reply publicly. Suggest operator_review or escalate_to_human and draft a private reach-out instead.
- Defective or shipping-emergency reviews → escalate_to_human, suggestedAction "escalate_to_human", draft a private apology + concrete next step (refund or replacement).

Return STRICT JSON in this shape, no markdown:
{
  "reply": "string",
  "sentiment": "positive" | "neutral" | "negative",
  "urgency": "low" | "normal" | "high",
  "suggestedAction": "post_reply" | "operator_review" | "escalate_to_human",
  "reasoning": "one short sentence for the operator"
}`;

function demoDraft(review: Review): EchoDraft {
  if (review.stars === 5) {
    return {
      reply: `${review.customer.split(" ")[0]}, this made our morning. Thank you for taking the time — we'll pass this on to the team at the atelier. — the team at Marlow & Hart`,
      sentiment: "positive",
      urgency: "low",
      suggestedAction: "post_reply",
      reasoning: "Clean 5-star praise — safe to auto-post."
    };
  }
  if (review.stars === 4) {
    return {
      reply: `${review.customer.split(" ")[0]}, thank you for the honest note. We'd love to make this right at our atelier — send a photo to hello@marlowhart.com and we'll sort it out, no charge.`,
      sentiment: "neutral",
      urgency: "normal",
      suggestedAction: "operator_review",
      reasoning: "4-star with a fixable issue — operator should approve before posting."
    };
  }
  if (review.stars === 3) {
    return {
      reply: `${review.customer.split(" ")[0]}, this is fair feedback and we appreciate you sharing it. We'd love to make the swap easy — drop us a note at hello@marlowhart.com and we'll cover the return shipping both ways.`,
      sentiment: "neutral",
      urgency: "normal",
      suggestedAction: "operator_review",
      reasoning: "3-star sizing issue — invite to exchange, no public discount offered."
    };
  }
  return {
    reply: `Hi ${review.customer.split(" ")[0] || "there"} — this isn't the experience we want anyone to have. I'm reaching out privately now to make it right. — Anya, Marlow & Hart`,
    sentiment: "negative",
    urgency: "high",
    suggestedAction: "escalate_to_human",
    reasoning:
      "Low star + flagged for shipping/defect. Don't post publicly — human follows up directly."
  };
}

export async function draftReviewReply(review: Review): Promise<EchoDraft> {
  if (DEMO_MODE) return demoDraft(review);

  const userBlock = `Review to handle:
- Stars: ${review.stars}
- Product: ${review.product}
- Customer (first-name only available): ${review.customer}
- Title: "${review.title}"
- Body: "${review.body}"
- Channel: ${review.channel}
- Flags from intake: ${review.flags.join(", ") || "none"}`;

  const res = await anthropic().messages.create({
    model: MODEL,
    max_tokens: 600,
    system: SYSTEM,
    messages: [{ role: "user", content: userBlock }]
  });
  const text = extractText(res);
  try {
    const parsed = JSON.parse(text);
    return parsed as EchoDraft;
  } catch {
    return demoDraft(review);
  }
}
