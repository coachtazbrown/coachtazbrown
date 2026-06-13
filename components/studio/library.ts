// Galactic Studio — the local production library.
//
// Every generated production is saved to localStorage so a creator builds a body
// of work, not one-offs. Re-opening a saved production is instant and works
// offline (no regeneration). Capped so storage stays bounded.

import type { Production } from "@/lib/studio/types";

const KEY = "galactic-studio-library-v1";
const CAP = 20;

export interface LibItem {
  id: string;
  topic: string;
  createdAt: string;
  demo: boolean;
  production: Production;
}

export function loadLibrary(): LibItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const items = raw ? (JSON.parse(raw) as LibItem[]) : [];
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

export function saveLibrary(items: LibItem[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items.slice(0, CAP)));
  } catch {
    // storage full or unavailable — non-fatal; the studio still works in-session.
  }
}

export function newId(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  } catch {}
  return `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function addToLibrary(production: Production): LibItem[] {
  const item: LibItem = {
    id: newId(),
    topic: production.topic,
    createdAt: production.createdAt,
    demo: production.demo,
    production
  };
  const next = [item, ...loadLibrary().filter((i) => i.topic !== production.topic)].slice(0, CAP);
  saveLibrary(next);
  return next;
}

export function removeFromLibrary(id: string): LibItem[] {
  const next = loadLibrary().filter((i) => i.id !== id);
  saveLibrary(next);
  return next;
}
