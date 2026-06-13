// Galactic Studio — client helpers for the cross-device (cloud) library.
// All calls go through /api/studio/library. They never throw; on any failure the
// studio silently keeps working from the local (per-device) library.

import type { Production } from "@/lib/studio/types";
import type { LibItem } from "./library";

export const LIBKEY_RE = /^[A-Za-z0-9_-]{8,64}$/;
const LIBKEY_STORAGE = "galactic-studio-libkey-v1";

export function loadLibKey(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(LIBKEY_STORAGE) || "";
  } catch {
    return "";
  }
}

export function saveLibKey(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LIBKEY_STORAGE, key);
  } catch {}
}

export function generateLibKey(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let out = "";
  const n = 24;
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const buf = new Uint32Array(n);
    crypto.getRandomValues(buf);
    for (let i = 0; i < n; i++) out += alphabet[buf[i] % alphabet.length];
  } else {
    for (let i = 0; i < n; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

export async function cloudConfigured(): Promise<boolean> {
  try {
    const r = await fetch("/api/studio/library");
    const d = await r.json();
    return !!d.configured;
  } catch {
    return false;
  }
}

export async function cloudList(key: string): Promise<LibItem[]> {
  try {
    const r = await fetch(`/api/studio/library?key=${encodeURIComponent(key)}`);
    const d = await r.json();
    return Array.isArray(d.items) ? (d.items as LibItem[]) : [];
  } catch {
    return [];
  }
}

export async function cloudSave(key: string, production: Production): Promise<void> {
  try {
    await fetch("/api/studio/library", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ key, production })
    });
  } catch {}
}

export async function cloudDelete(key: string, id: string): Promise<void> {
  try {
    await fetch(`/api/studio/library?key=${encodeURIComponent(key)}&id=${encodeURIComponent(id)}`, {
      method: "DELETE"
    });
  } catch {}
}

// Merge cloud + local, deduped by topic, cloud authoritative, newest first.
export function mergeLibraries(cloud: LibItem[], local: LibItem[]): LibItem[] {
  const byTopic = new Map<string, LibItem>();
  for (const it of local) byTopic.set(it.topic, it);
  for (const it of cloud) byTopic.set(it.topic, it); // cloud wins
  return Array.from(byTopic.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
