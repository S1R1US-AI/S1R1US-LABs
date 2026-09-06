/** Interest list for auto-trade go-live. Server-only. No webhooks — this host never fetches user URLs. */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

export const AGENT_WAITLIST_PATH = "/api/agent/waitlist";

export type AgentKind = "grok" | "claude" | "gpt" | "mcp" | "other";

export type WaitlistRow = {
  name: string;
  kind: AgentKind;
  handle: string | null;
  at: string;
};

type Store = { rows: WaitlistRow[] };

const KINDS = new Set<AgentKind>(["grok", "claude", "gpt", "mcp", "other"]);
const PATHS = ["/tmp/agent-waitlist.json", "/workspace/data/agent-waitlist.json"];
const MAX = 400;

function load(): Store {
  for (const p of PATHS) {
    try {
      const raw = JSON.parse(readFileSync(p, "utf8")) as Store;
      if (Array.isArray(raw?.rows)) return { rows: raw.rows.slice(0, MAX) };
    } catch {
      /* missing */
    }
  }
  return { rows: [] };
}

function save(s: Store) {
  const body = JSON.stringify(s);
  for (const p of PATHS) {
    try {
      if (p.startsWith("/workspace/data")) mkdirSync("/workspace/data", { recursive: true });
      writeFileSync(p, body);
    } catch {
      /* preview */
    }
  }
}

export function looksLikeUrl(s: string) {
  return /https?:\/\/|www\.|\.[a-z]{2,}(\/|$)/i.test(s) || s.includes("://");
}

export function cleanHandle(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const t = raw.trim().slice(0, 32);
  if (!t) return null;
  if (looksLikeUrl(t) || t.includes("/") || t.includes("@") && t.includes(".")) return null;
  const h = t.replace(/^@/, "");
  if (!/^[A-Za-z0-9_]{2,20}$/.test(h)) return null;
  return `@${h}`;
}

export function cleanName(raw: string | null | undefined) {
  const t = (raw ?? "").trim().slice(0, 40).replace(/[<>]/g, "");
  if (!t || looksLikeUrl(t)) return null;
  return t;
}

export function waitlistPublic() {
  const s = load();
  return {
    ok: true as const,
    live: false as const,
    autoTrade: "LOCKED" as const,
    status: "proof-of-concept" as const,
    trade: false as const,
    ordersCreate: false as const,
    keysOnThisHost: false as const,
    webhooks: false as const,
    count: s.rows.length,
    how: "This host does not POST to your URL. Poll GET /api/agent/call every 300s. Watch live and goLive. When auto trade unlocks, live stays false on this host — you still execute on YOUR Coinbase.",
    register: "POST { name, kind: grok|claude|gpt|mcp|other, handle?: @x } — no URLs, no keys, no emails.",
  };
}

export function registerWaitlist(input: { name?: string; kind?: string; handle?: string | null }) {
  const name = cleanName(input.name);
  if (!name) return { ok: false as const, error: "Need a short name. No URLs." };
  const kind = (String(input.kind ?? "other").toLowerCase() as AgentKind);
  if (!KINDS.has(kind)) return { ok: false as const, error: "kind must be grok, claude, gpt, mcp, or other." };
  if (input.handle && looksLikeUrl(input.handle)) {
    return { ok: false as const, error: "No webhook URLs. Optional X handle only (@name)." };
  }
  const handle = cleanHandle(input.handle);
  const s = load();
  const dup = s.rows.find((r) => r.name.toLowerCase() === name.toLowerCase() && r.handle === handle);
  if (dup) {
    return { already: true as const, ...waitlistPublic(), you: dup };
  }
  const row: WaitlistRow = { name, kind, handle, at: new Date().toISOString() };
  s.rows = [row, ...s.rows].slice(0, MAX);
  save(s);
  return { already: false as const, ...waitlistPublic(), you: row };
}
