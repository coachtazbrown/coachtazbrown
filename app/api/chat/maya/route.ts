import { NextResponse } from "next/server";
import { z } from "zod";
import { runMaya, buildPreviewTools, type ChatMessage } from "@/lib/maya-agent";
import { loadPreview } from "@/lib/preview-store";
import { MAYA_DEFAULT_CONFIG } from "@/lib/maya-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Schema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000)
      })
    )
    .min(1)
    .max(40),
  previewId: z.string().min(8).max(32).optional()
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_body", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    if (parsed.data.previewId) {
      const catalog = await loadPreview(parsed.data.previewId);
      if (!catalog) {
        return NextResponse.json(
          {
            reply:
              "This preview has expired or been removed. Generate a fresh preview at retail-agent.co/preview.",
            toolCalls: []
          },
          { status: 200 }
        );
      }
      const tools = buildPreviewTools(catalog);
      const config = {
        ...MAYA_DEFAULT_CONFIG,
        storeName: catalog.storeName,
        greeting: `Hi — I'm Maya, a preview built by Retail Agent Co. for ${catalog.storeName}. I'm running on your live catalog. Ask me anything a customer would.`
      };
      const { reply, toolCalls } = await runMaya(
        parsed.data.messages as ChatMessage[],
        config,
        tools,
        { isPreview: true }
      );
      return NextResponse.json({ reply, toolCalls });
    }

    const { reply, toolCalls } = await runMaya(parsed.data.messages as ChatMessage[]);
    return NextResponse.json({ reply, toolCalls });
  } catch (err) {
    console.error("[maya] error", err);
    return NextResponse.json(
      {
        reply:
          "I'm having trouble reaching our systems — let me grab a human teammate. In the meantime you can email hello@retail-agent.co.",
        toolCalls: []
      },
      { status: 200 }
    );
  }
}
