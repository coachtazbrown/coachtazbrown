"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SAMPLES = ["allbirds.com", "kith.com", "bombas.com", "untuckit.com"];

export default function PreviewForm() {
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function submit(target: string) {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/preview/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ shopifyUrl: target })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.reason || "Couldn't build a preview for that URL.");
        setSubmitting(false);
        return;
      }
      router.push(data.url);
    } catch {
      setError("Network error — try again.");
      setSubmitting(false);
    }
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (url.trim()) submit(url.trim());
        }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <input
          type="text"
          inputMode="url"
          placeholder="yourstore.com  (e.g. allbirds.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={submitting}
          autoFocus
          className="flex-1 rounded-full border border-ink/20 bg-white px-5 py-3 text-base outline-none focus:border-ink disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={submitting || !url.trim()}
          className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-bone hover:bg-accent disabled:opacity-40"
        >
          {submitting ? "Building preview…" : "See Maya on your store →"}
        </button>
      </form>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate2">
        <span>or try one:</span>
        {SAMPLES.map((s) => (
          <button
            key={s}
            onClick={() => {
              setUrl(s);
              submit(s);
            }}
            disabled={submitting}
            className="rounded-full border border-ink/20 bg-bone px-2.5 py-1 hover:border-ink disabled:opacity-40"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
