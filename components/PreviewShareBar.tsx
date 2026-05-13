"use client";

import { useState } from "react";

export default function PreviewShareBar({ previewUrl }: { previewUrl: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      const full =
        typeof window !== "undefined" ? `${window.location.origin}${previewUrl}` : previewUrl;
      await navigator.clipboard.writeText(full);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <button
      onClick={copy}
      className="rounded-full border border-ink/20 bg-white px-3 py-1.5 text-xs hover:border-ink"
    >
      {copied ? "Copied ✓" : "Copy share link"}
    </button>
  );
}
