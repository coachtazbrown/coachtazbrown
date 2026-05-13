import Anthropic from "@anthropic-ai/sdk";
import { searchProducts, getProduct, STORE } from "@/lib/store-catalog";
import { findOrder } from "@/lib/orders";
import { MAYA_DEFAULT_CONFIG, type MayaConfig } from "@/lib/maya-config";

export type ChatMessage = { role: "user" | "assistant"; content: string };

const MODEL = process.env.MAYA_MODEL || "claude-sonnet-4-6";
const DEMO_MODE = process.env.MAYA_DEMO_MODE === "true" || !process.env.ANTHROPIC_API_KEY;

const TOOLS: Anthropic.Tool[] = [
  {
    name: "search_products",
    description:
      "Search the live store catalog. Use this every time you make a product recommendation — never invent a product, price, or stock count. Returns up to 6 matches.",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Free-text query, e.g. 'pearl studs' or 'gold ring under 500'." },
        category: {
          type: "string",
          enum: ["rings", "necklaces", "earrings", "bracelets", "gift-cards"]
        },
        max_price: { type: "number" },
        min_price: { type: "number" },
        occasion: {
          type: "string",
          description: "engagement | anniversary | birthday | mothers-day | graduation | wedding | groomsmen"
        },
        in_stock_only: { type: "boolean" }
      }
    }
  },
  {
    name: "get_product",
    description: "Fetch the full record for a product handle returned from search_products.",
    input_schema: {
      type: "object",
      required: ["handle"],
      properties: { handle: { type: "string" } }
    }
  },
  {
    name: "lookup_order",
    description:
      "Look up an order by number AND email. Maya MUST ask for both before calling this tool. Never share order details without both.",
    input_schema: {
      type: "object",
      required: ["order_number", "email"],
      properties: {
        order_number: { type: "string" },
        email: { type: "string" }
      }
    }
  },
  {
    name: "get_store_policy",
    description: "Return the store's hours, return policy, shipping policy, or warranty.",
    input_schema: {
      type: "object",
      required: ["topic"],
      properties: {
        topic: { type: "string", enum: ["hours", "returns", "shipping", "warranty", "contact"] }
      }
    }
  },
  {
    name: "request_human_handoff",
    description:
      "Escalate to a human in the store's Slack handoff channel. Use when the customer is upset, when there's a defective item, or when your confidence in the answer is low.",
    input_schema: {
      type: "object",
      required: ["reason", "summary"],
      properties: {
        reason: {
          type: "string",
          enum: ["upset_customer", "defective_item", "low_confidence", "custom_request"]
        },
        summary: { type: "string", description: "1-2 sentences of context for the human." }
      }
    }
  }
];

function systemPrompt(cfg: MayaConfig) {
  return [
    `You are Maya, the AI Storefront Concierge for ${cfg.storeName}.`,
    `Brand voice: ${cfg.brandVoice}`,
    "",
    "Hard guardrails — these are NOT negotiable:",
    ...cfg.guardrails.map((g, i) => `${i + 1}. ${g}`),
    "",
    "Style:",
    "- Keep replies under 4 sentences unless the customer asked for detail.",
    "- When recommending products, name them, give the price, and mention if stock is low.",
    "- Never use bullet lists of more than 3 items.",
    "- Never apologize more than once per conversation.",
    "",
    `Store facts: hours ${STORE.hours}; phone ${STORE.phone}.`,
    "If you don't have a tool result to back up a claim, ask a clarifying question instead of guessing."
  ].join("\n");
}

function runTool(name: string, input: Record<string, unknown>): unknown {
  switch (name) {
    case "search_products": {
      const results = searchProducts({
        query: input.query as string | undefined,
        category: input.category as never,
        maxPrice: input.max_price as number | undefined,
        minPrice: input.min_price as number | undefined,
        occasion: input.occasion as string | undefined,
        inStockOnly: input.in_stock_only as boolean | undefined
      });
      return {
        results: results.map((p) => ({
          handle: p.handle,
          title: p.title,
          price: p.price,
          compare_at_price: p.compareAtPrice,
          metal: p.metal,
          stone: p.stone,
          in_stock: p.inStock,
          stock_on_hand: p.stockOnHand,
          short: p.description
        }))
      };
    }
    case "get_product": {
      const p = getProduct(String(input.handle));
      if (!p) return { error: "not_found" };
      return p;
    }
    case "lookup_order": {
      const o = findOrder({
        number: String(input.order_number || ""),
        email: String(input.email || "")
      });
      if (!o) {
        return {
          error: "no_match",
          hint: "Don't tell the customer the order exists or doesn't — ask them to double-check the number and the email used at checkout."
        };
      }
      return o;
    }
    case "get_store_policy": {
      const t = String(input.topic);
      if (t === "hours") return { hours: STORE.hours };
      if (t === "returns") return { returns: STORE.returnPolicy };
      if (t === "shipping") return { shipping: STORE.shippingPolicy };
      if (t === "warranty") return { warranty: STORE.warranty };
      if (t === "contact") return { phone: STORE.phone, hours: STORE.hours };
      return { error: "unknown_topic" };
    }
    case "request_human_handoff": {
      return {
        ok: true,
        message:
          "A human teammate has been pinged in Slack. Tell the customer someone will follow up within business hours."
      };
    }
    default:
      return { error: "unknown_tool" };
  }
}

function demoReply(messages: ChatMessage[]): string {
  const last = messages.filter((m) => m.role === "user").pop()?.content?.toLowerCase() ?? "";
  if (last.includes("engagement") || last.includes("ring")) {
    return "For under $2,000 I'd start with the Lila Solitaire in 14k yellow gold — $1,480, 6 in stock. It's our most-loved engagement piece. Want me to set one aside in her size?";
  }
  if (last.includes("order") || last.includes("1001") || last.includes("where")) {
    return "Happy to check — can you share the order number and the email used at checkout?";
  }
  if (last.includes("return")) {
    return "30 days on unworn pieces in original packaging, free return shipping in the US. Engraved or custom pieces are final sale. Want me to start a return for you?";
  }
  if (last.includes("gift")) {
    return "Two go-tos under $250: the June Pearl Studs ($220) and the Drift Cable Bracelet ($410 — slightly over, but worth a look). Tell me a bit about who it's for?";
  }
  return "I'm Maya at Marlow & Hart — happy to help. Want to find a piece, check an order, or ask about a policy?";
}

export async function runMaya(
  history: ChatMessage[],
  config: MayaConfig = MAYA_DEFAULT_CONFIG
): Promise<{ reply: string; toolCalls: { name: string; input: unknown }[] }> {
  if (DEMO_MODE) {
    return { reply: demoReply(history), toolCalls: [] };
  }

  const client = new Anthropic();
  const sys = systemPrompt(config);

  const messages: Anthropic.MessageParam[] = history.map((m) => ({
    role: m.role,
    content: m.content
  }));

  const toolCalls: { name: string; input: unknown }[] = [];

  for (let step = 0; step < 5; step++) {
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: sys,
      tools: TOOLS,
      messages
    });

    if (res.stop_reason === "tool_use") {
      const toolUseBlocks = res.content.filter(
        (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
      );
      messages.push({ role: "assistant", content: res.content });
      const toolResults: Anthropic.ToolResultBlockParam[] = toolUseBlocks.map((tu) => {
        toolCalls.push({ name: tu.name, input: tu.input });
        const result = runTool(tu.name, tu.input as Record<string, unknown>);
        return {
          type: "tool_result",
          tool_use_id: tu.id,
          content: JSON.stringify(result)
        };
      });
      messages.push({ role: "user", content: toolResults });
      continue;
    }

    const text = res.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    return { reply: text || "Sorry — I'm not sure how to help with that yet.", toolCalls };
  }

  return {
    reply:
      "Let me get a human on this one — I want to make sure you get the right answer. We'll follow up within business hours.",
    toolCalls
  };
}
