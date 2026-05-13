import Anthropic from "@anthropic-ai/sdk";
import { searchProducts, getProduct, STORE } from "@/lib/store-catalog";
import { findOrder } from "@/lib/orders";
import { MAYA_DEFAULT_CONFIG, type MayaConfig } from "@/lib/maya-config";
import { DEMO_MODE, MODEL, anthropic } from "@/lib/anthropic";
import {
  searchPreviewCatalog,
  getPreviewProduct,
  type PreviewCatalog
} from "@/lib/preview-store";

export type ChatMessage = { role: "user" | "assistant"; content: string };

// Each Maya deployment binds to a different storefront. The tools are
// injectable so the same agent can run against the seeded jewelry catalog
// (the canned demo) OR a freshly-scraped Shopify catalog from a prospect's
// real store (the /preview/<id> flow). For the preview case `lookupOrder`
// is null, because we never have the prospect's order book.

export type MayaSearchResult = {
  handle: string;
  title: string;
  price: number;
  compare_at_price: number | null;
  metal?: string | null;
  stone?: string | null;
  in_stock: boolean;
  stock_on_hand: number;
  short: string;
};

export type MayaTools = {
  searchProducts: (opts: {
    query?: string;
    category?: string;
    maxPrice?: number;
    minPrice?: number;
    occasion?: string;
    inStockOnly?: boolean;
  }) => MayaSearchResult[];
  getProduct: (handle: string) => unknown;
  lookupOrder: ((opts: { number?: string; email?: string }) => unknown) | null;
  getStorePolicy: (topic: string) => unknown;
  storeFacts: { name: string; hours: string; phone: string };
};

const DEFAULT_TOOLS: MayaTools = {
  searchProducts: (opts) =>
    searchProducts({
      query: opts.query,
      category: opts.category as never,
      maxPrice: opts.maxPrice,
      minPrice: opts.minPrice,
      occasion: opts.occasion,
      inStockOnly: opts.inStockOnly
    }).map((p) => ({
      handle: p.handle,
      title: p.title,
      price: p.price,
      compare_at_price: p.compareAtPrice,
      metal: p.metal,
      stone: p.stone,
      in_stock: p.inStock,
      stock_on_hand: p.stockOnHand,
      short: p.description
    })),
  getProduct: (handle) => getProduct(handle) ?? { error: "not_found" },
  lookupOrder: (opts) => {
    const o = findOrder({ number: opts.number, email: opts.email });
    if (!o) {
      return {
        error: "no_match",
        hint: "Don't tell the customer the order exists or doesn't — ask them to double-check the number and the email used at checkout."
      };
    }
    return o;
  },
  getStorePolicy: (topic) => {
    if (topic === "hours") return { hours: STORE.hours };
    if (topic === "returns") return { returns: STORE.returnPolicy };
    if (topic === "shipping") return { shipping: STORE.shippingPolicy };
    if (topic === "warranty") return { warranty: STORE.warranty };
    if (topic === "contact") return { phone: STORE.phone, hours: STORE.hours };
    return { error: "unknown_topic" };
  },
  storeFacts: { name: STORE.name, hours: STORE.hours, phone: STORE.phone }
};

function buildToolList(tools: MayaTools): Anthropic.Tool[] {
  const base: Anthropic.Tool[] = [
    {
      name: "search_products",
      description:
        "Search the live store catalog. Use this every time you make a product recommendation — never invent a product, price, or stock count. Returns up to 6 matches.",
      input_schema: {
        type: "object",
        properties: {
          query: { type: "string" },
          category: { type: "string" },
          max_price: { type: "number" },
          min_price: { type: "number" },
          occasion: { type: "string" },
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
          summary: { type: "string" }
        }
      }
    }
  ];
  if (tools.lookupOrder) {
    base.push({
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
    });
  }
  return base;
}

function systemPrompt(cfg: MayaConfig, tools: MayaTools, preview?: { isPreview: boolean }) {
  const lines = [
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
    `Store facts: ${tools.storeFacts.hours ? `hours ${tools.storeFacts.hours}; ` : ""}${tools.storeFacts.phone ? `phone ${tools.storeFacts.phone}.` : ""}`,
    "If you don't have a tool result to back up a claim, ask a clarifying question instead of guessing."
  ];
  if (preview?.isPreview) {
    lines.push(
      "",
      "Preview mode: this is a sales demo running on a real merchant's public catalog. You cannot look up orders, take payments, or commit the merchant to anything. If asked for an order status, sizing, or promo code, say you're a preview built by Retail Agent Co. and offer to hand off to a teammate."
    );
  }
  return lines.join("\n");
}

function runTool(name: string, input: Record<string, unknown>, tools: MayaTools): unknown {
  switch (name) {
    case "search_products": {
      const results = tools.searchProducts({
        query: input.query as string | undefined,
        category: input.category as string | undefined,
        maxPrice: input.max_price as number | undefined,
        minPrice: input.min_price as number | undefined,
        occasion: input.occasion as string | undefined,
        inStockOnly: input.in_stock_only as boolean | undefined
      });
      return { results };
    }
    case "get_product":
      return tools.getProduct(String(input.handle));
    case "lookup_order":
      if (!tools.lookupOrder)
        return {
          error: "preview_mode",
          hint: "Tell the customer this is a preview without order data; offer human handoff."
        };
      return tools.lookupOrder({
        number: String(input.order_number || ""),
        email: String(input.email || "")
      });
    case "get_store_policy":
      return tools.getStorePolicy(String(input.topic));
    case "request_human_handoff":
      return {
        ok: true,
        message:
          "A human teammate has been pinged. Tell the customer someone will follow up within business hours."
      };
    default:
      return { error: "unknown_tool" };
  }
}

function demoReply(messages: ChatMessage[], tools: MayaTools): string {
  const last = messages.filter((m) => m.role === "user").pop()?.content?.toLowerCase() ?? "";
  if (last.includes("order") || last.includes("wismo") || last.includes("where is")) {
    if (!tools.lookupOrder)
      return `Happy to check — but this is a preview of Maya built by Retail Agent Co., so I don't have access to the real order book on ${tools.storeFacts.name}. Want a teammate to follow up after the demo?`;
    return "Happy to check — can you share the order number and the email used at checkout?";
  }
  if (last.includes("return") || last.includes("refund")) {
    return "On the real store I'd quote the return policy verbatim. In preview, the short answer is yes — Maya pulls policy text from the live storefront so she never paraphrases or invents.";
  }
  if (last.includes("gift") || last.includes("under")) {
    const m = last.match(/\$?\s?(\d{2,4})/);
    const max = m ? parseInt(m[1], 10) : 250;
    const matches = tools.searchProducts({ maxPrice: max, inStockOnly: true });
    if (matches.length) {
      const top = matches.slice(0, 2);
      return `Two under $${max} I'd start with: ${top.map((p) => `${p.title} ($${p.price})`).join(" and ")}. Want me to tell you why?`;
    }
  }
  const general = tools.searchProducts({ query: last.split(/[ ,.!?]+/)[0] || "" });
  if (general.length) {
    const p = general[0];
    return `${p.title} comes to mind — $${p.price}${p.in_stock ? "" : " (out of stock right now)"}. Want me to keep going or narrow by occasion?`;
  }
  return `I'm Maya at ${tools.storeFacts.name} — happy to help. Want to find a piece, check an order, or ask about a policy?`;
}

export async function runMaya(
  history: ChatMessage[],
  config: MayaConfig = MAYA_DEFAULT_CONFIG,
  tools: MayaTools = DEFAULT_TOOLS,
  options: { isPreview?: boolean } = {}
): Promise<{ reply: string; toolCalls: { name: string; input: unknown }[] }> {
  if (DEMO_MODE) {
    return { reply: demoReply(history, tools), toolCalls: [] };
  }

  const client = anthropic();
  const sys = systemPrompt(config, tools, { isPreview: !!options.isPreview });
  const toolList = buildToolList(tools);

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
      tools: toolList,
      messages
    });

    if (res.stop_reason === "tool_use") {
      const toolUseBlocks = res.content.filter(
        (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
      );
      messages.push({ role: "assistant", content: res.content });
      const toolResults: Anthropic.ToolResultBlockParam[] = toolUseBlocks.map((tu) => {
        toolCalls.push({ name: tu.name, input: tu.input });
        const result = runTool(tu.name, tu.input as Record<string, unknown>, tools);
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

export function buildPreviewTools(catalog: PreviewCatalog): MayaTools {
  return {
    searchProducts: (opts) =>
      searchPreviewCatalog(catalog, opts).map((p) => ({
        handle: p.handle,
        title: p.title,
        price: p.price,
        compare_at_price: p.compareAtPrice,
        in_stock: p.inStock,
        stock_on_hand: p.stockOnHand,
        short: p.description.slice(0, 240)
      })),
    getProduct: (handle) => getPreviewProduct(catalog, handle) ?? { error: "not_found" },
    lookupOrder: null,
    getStorePolicy: (topic) => ({
      preview_note: `In preview mode, I don't have access to ${catalog.storeName}'s real ${topic} policy. On a live install, Maya pulls this from the merchant's CMS or theme.`
    }),
    storeFacts: {
      name: catalog.storeName,
      hours: "",
      phone: ""
    }
  };
}
