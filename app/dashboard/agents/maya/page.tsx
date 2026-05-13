import Link from "next/link";
import MayaChat from "@/components/MayaChat";
import { MAYA_DEFAULT_CONFIG } from "@/lib/maya-config";

export const metadata = { title: "Maya — config & preview" };

export default function MayaConfigPage() {
  const cfg = MAYA_DEFAULT_CONFIG;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-slate2">
        <Link href="/dashboard" className="hover:text-ink">
          Dashboard
        </Link>
        <span>/</span>
        <span>Maya — Storefront Concierge</span>
      </div>
      <h1 className="mt-2 font-display text-4xl tracking-tight">Maya configuration</h1>
      <p className="mt-2 max-w-2xl text-slate2">
        Edit Maya's voice, guardrails, and suggested replies for this tenant. The preview on the
        right talks to the same chat API as the live storefront widget.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-5">
          <Field label="Store name" value={cfg.storeName} />
          <Field label="Greeting" value={cfg.greeting} multiline />
          <Field label="Brand voice" value={cfg.brandVoice} multiline />
          <div className="rounded-2xl border border-ink/10 bg-white p-5">
            <div className="text-xs uppercase tracking-widest text-slate2">Guardrails</div>
            <ol className="mt-3 space-y-2 text-sm">
              {cfg.guardrails.map((g, i) => (
                <li key={i} className="flex gap-2">
                  <span className="font-mono text-slate2">{i + 1}.</span>
                  <span>{g}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-2xl border border-ink/10 bg-white p-5">
            <div className="text-xs uppercase tracking-widest text-slate2">Suggested replies</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {cfg.suggestedReplies.map((r) => (
                <span
                  key={r}
                  className="rounded-full border border-ink/15 bg-bone px-3 py-1 text-xs"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-ink/10 bg-white p-5">
            <div className="text-xs uppercase tracking-widest text-slate2">Connected tools</div>
            <ul className="mt-3 grid gap-2 text-sm md:grid-cols-2">
              <li>· search_products (Shopify catalog)</li>
              <li>· get_product (Shopify catalog)</li>
              <li>· lookup_order (Shopify Orders API)</li>
              <li>· get_store_policy (CMS)</li>
              <li>· request_human_handoff (Slack {cfg.handoffSlackChannel})</li>
            </ul>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="sticky top-24">
            <div className="mb-3 text-sm font-semibold">Live preview</div>
            <MayaChat embedded />
            <div className="mt-3 text-xs text-slate2">
              Preview hits the same /api/chat/maya endpoint your storefront uses.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, multiline = false }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5">
      <div className="text-xs uppercase tracking-widest text-slate2">{label}</div>
      {multiline ? (
        <p className="mt-2 text-sm leading-relaxed text-ink/90">{value}</p>
      ) : (
        <div className="mt-2 font-semibold">{value}</div>
      )}
    </div>
  );
}
