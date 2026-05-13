import { DEMO_MODE, MODEL, anthropic, extractText } from "@/lib/anthropic";
import { findOrder } from "@/lib/orders";
import { STORE } from "@/lib/store-catalog";
import type { Ticket } from "@/lib/pip-data";

export type PipTriage = {
  category: "wismo" | "return" | "exchange" | "defective" | "address_change" | "cancel" | "sizing" | "custom_request" | "lost_in_transit" | "other";
  urgency: "low" | "normal" | "high";
  action: "auto_resolve" | "draft_reply" | "escalate_to_human";
  confidence: number;
  draftReply: string;
  reasoning: string;
};

const SYSTEM = `You are Pip, the AI Customer Service agent for Marlow & Hart — a small-batch jewelry brand in Providence, RI.
Your job: triage a support ticket into a category, urgency, action, and a drafted reply.

Brand voice for Marlow & Hart: warm, specific, never robotic. Speak as "we." Sign every reply "— Pip @ Marlow & Hart." Address customers by first name when known.

Policies you must follow:
- Returns: 30 days on unworn pieces, original packaging, free return shipping in the US. Engraved or custom pieces are FINAL SALE.
- Resizing: free within 60 days.
- Address changes: allowed if the order hasn't shipped yet.
- Cancellations: allowed only if status is "processing", NOT once shipped.
- Defective items: always escalate_to_human — never promise a refund or replacement yourself.
- Custom / engraving / language requests outside the standard menu: escalate_to_human.

Actions and how to choose them:
- auto_resolve: the customer's request maps to a policy you can execute end-to-end (WISMO with a valid order, address change pre-shipment, return label for an unworn piece, generic sizing FAQ). Confidence ≥ 0.85.
- draft_reply: the request needs a written reply but the operator should approve before sending (exchanges, lost-in-transit claims, complicated sizing, anything with money attached). Confidence 0.6–0.85.
- escalate_to_human: defective items, custom asks, anything you'd guess on, or anything where a wrong move costs the brand. Confidence below 0.6 OR the request is out of your policy menu.

Order context (when an order number + email are present) will be provided in the ticket facts. Never share order details if the email on the ticket doesn't match the order. Never invent tracking numbers.

Return STRICT JSON only, no markdown:
{
  "category": "wismo" | "return" | "exchange" | "defective" | "address_change" | "cancel" | "sizing" | "custom_request" | "lost_in_transit" | "other",
  "urgency": "low" | "normal" | "high",
  "action": "auto_resolve" | "draft_reply" | "escalate_to_human",
  "confidence": 0..1,
  "draftReply": "string — the actual reply, addressed to the customer",
  "reasoning": "one short sentence telling the operator why this action"
}`;

function demo(ticket: Ticket): PipTriage {
  switch (ticket.id) {
    case "tk_001":
      return {
        category: "wismo",
        urgency: "normal",
        action: "auto_resolve",
        confidence: 0.94,
        draftReply: `Hi Alex — order 1001 shipped FedEx (tracking 788912340012), expected by ${"May 15"}. You'll get a notice the moment it ships. Anything else I can grab? — Pip @ Marlow & Hart`,
        reasoning: "Valid order + matching email; one-touch WISMO."
      };
    case "tk_002":
      return {
        category: "exchange",
        urgency: "normal",
        action: "draft_reply",
        confidence: 0.78,
        draftReply: `Hi Alex — sorry the posts don't work for your mom. The silver June studs are $120 (the gold pair was $220), so we can ship the silver pair, return-label the gold ones, and refund the difference. Want me to send the return label now? — Pip @ Marlow & Hart`,
        reasoning: "Exchange with a price differential — let the operator approve before shipping."
      };
    case "tk_003":
      return {
        category: "defective",
        urgency: "high",
        action: "escalate_to_human",
        confidence: 0.32,
        draftReply: `Hi Jordan — this is the last thing you should be dealing with right before a proposal. I'm pulling in someone from our atelier right now and they'll be in touch within the hour. Hold tight. — Pip @ Marlow & Hart`,
        reasoning: "Defective stone + time-sensitive proposal. Hand off to a human immediately."
      };
    case "tk_004":
      return {
        category: "address_change",
        urgency: "normal",
        action: "auto_resolve",
        confidence: 0.88,
        draftReply: `Hi Sam — updated order 1003 to 88 Federal Street, Providence RI 02903. You'll see the change on your shipping email when it goes out. — Pip @ Marlow & Hart`,
        reasoning: "Order is still pre-ship; matched email; within policy."
      };
    case "tk_005":
      return {
        category: "custom_request",
        urgency: "low",
        action: "escalate_to_human",
        confidence: 0.4,
        draftReply: `Hi Wei — Mandarin engravings aren't in our standard menu, but our atelier handles them by hand on a case-by-case basis. I'm looping in our master engraver now; they'll confirm whether 诚 will work on the Hart cushion top. — Pip @ Marlow & Hart`,
        reasoning: "Custom engraving outside the standard 3-character Latin menu — atelier decision."
      };
    case "tk_006":
      return {
        category: "lost_in_transit",
        urgency: "high",
        action: "draft_reply",
        confidence: 0.7,
        draftReply: `Hi Alex — I'm so sorry. I've opened a missing-package claim with USPS for order 1002. We typically wait 48 hours from "delivered" status (packages occasionally reappear next-day), and if it hasn't surfaced by Thursday we'll ship a replacement free. Want me to overnight the replacement preemptively? — Pip @ Marlow & Hart`,
        reasoning: "Lost-package claim. Reply is on-policy but money's involved — operator approves."
      };
    case "tk_007":
      return {
        category: "sizing",
        urgency: "low",
        action: "draft_reply",
        confidence: 0.74,
        draftReply: `Hi Priya — our bands run true to size, so a 6.5 in most brands will fit you in our 6.5. The Lila has a 1.8mm band, so if you're between sizes we'd suggest sizing up. Resizing within 60 days is on us if anything's off. — Pip @ Marlow & Hart`,
        reasoning: "Sizing question — answer is solid but worth one human eyeball before sending."
      };
    case "tk_008":
      return {
        category: "cancel",
        urgency: "normal",
        action: "escalate_to_human",
        confidence: 0.5,
        draftReply: `Hi Sam — order 1003 has already been delivered, so I can't cancel it on my end. I'm looping a teammate to help — likely we'll arrange a return on 1003 and a fresh order for the white gold version with the same delivery timing. — Pip @ Marlow & Hart`,
        reasoning: "Order is delivered, not processing — cancel policy doesn't apply. Hand to human."
      };
    default:
      return {
        category: "other",
        urgency: "normal",
        action: "draft_reply",
        confidence: 0.5,
        draftReply: `Hi ${ticket.customerName.split(" ")[0] || "there"} — got your note, looking into it now. — Pip @ Marlow & Hart`,
        reasoning: "Demo fallback."
      };
  }
}

export async function triageTicket(ticket: Ticket): Promise<PipTriage> {
  if (DEMO_MODE) return demo(ticket);

  const order =
    ticket.orderNumber && ticket.customerEmail
      ? findOrder({ number: ticket.orderNumber, email: ticket.customerEmail })
      : null;

  const facts = {
    ticket: {
      subject: ticket.subject,
      body: ticket.body,
      customerName: ticket.customerName,
      channel: ticket.channel,
      receivedAt: ticket.receivedAt,
      claimedOrderNumber: ticket.orderNumber,
      claimedEmail: ticket.customerEmail
    },
    matchedOrder: order ?? null,
    storePolicy: {
      returns: STORE.returnPolicy,
      shipping: STORE.shippingPolicy,
      warranty: STORE.warranty,
      hours: STORE.hours
    }
  };

  const res = await anthropic().messages.create({
    model: MODEL,
    max_tokens: 1000,
    system: SYSTEM,
    messages: [
      {
        role: "user",
        content: `Triage this ticket. Facts:\n${JSON.stringify(facts, null, 2)}\n\nReturn JSON only.`
      }
    ]
  });
  const text = extractText(res);
  try {
    return JSON.parse(text) as PipTriage;
  } catch {
    return demo(ticket);
  }
}
