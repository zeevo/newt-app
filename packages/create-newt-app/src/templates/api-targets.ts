import type { Package, Script, Selection } from "./types";

export const API = "apps/api";
export const WEB = "apps/web";

export const hasApi = (s: Selection) => s.mode !== "bare";
export const isBare = (s: Selection) => s.mode === "bare";

// Keyed off the `module` field rather than spelled out per entry, so a new
// apps/api dep cannot forget the guard and break bare mode.
export function skipWithoutApi<T extends Package | Script>(entries: T[]): T[] {
  return entries.map((entry) => (entry.module === API ? { ...entry, when: hasApi } : entry));
}
