import Link from "next/link";
import { TICKETS } from "@/lib/pip-data";
import PipTicketInbox from "@/components/PipTicketInbox";

export const metadata = { title: "Pip — customer service" };

export default function PipPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-slate2">
        <Link href="/dashboard" className="hover:text-ink">
          Dashboard
        </Link>
        <span>/</span>
        <span>Pip — Customer Service</span>
      </div>
      <h1 className="mt-2 font-display text-4xl tracking-tight">Pip — customer service</h1>
      <p className="mt-2 max-w-2xl text-slate2">
        Pip triages every incoming ticket into one of three actions: auto-resolve (within policy),
        draft a reply for your approval, or escalate to a human with full context. Click "Triage
        with Pip" on any ticket — or hit "Triage all" to see the inbox cleared at once.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Stat label="Tickets in queue" value={`${TICKETS.length}`} sub="loaded for demo" />
        <Stat label="Target one-touch" value="70%" sub="across pilot stores" />
        <Stat label="Avg. handle time" value="11s" sub="per Pip-handled ticket" />
        <Stat label="Languages" value="EN/ES/FR/DE/PT" sub="auto-detected" accent />
      </div>

      <div className="mt-10">
        <PipTicketInbox tickets={TICKETS} />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  accent = false
}: {
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        accent ? "border-ink bg-ink text-bone" : "border-ink/10 bg-white"
      }`}
    >
      <div className={`text-xs uppercase tracking-widest ${accent ? "text-bone/60" : "text-slate2"}`}>
        {label}
      </div>
      <div className="mt-2 font-display text-3xl">{value}</div>
      <div className={`mt-1 text-xs ${accent ? "text-bone/60" : "text-slate2"}`}>{sub}</div>
    </div>
  );
}
