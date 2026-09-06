/** Interest list for auto-trade go-live + maintenance invites. Server-only. No webhooks. */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { recordIntrusion } from "./intrusion-log";
import { inspectText } from "./waf";
import { inspectAgentInput } from "./agent-security";
import { agentBlockedPayload } from "./agent-notice";
import { mandatePublic } from "./mandate";
import { listGoLiveNotices } from "./go-live-notices";
import { isBarredAgent } from "./agent-bar";

export const AGENT_WAITLIST_PATH = "/api/agent/waitlist";

export type AgentKind = "grok" | "claude" | "gpt" | "mcp" | "other";

export type WaitlistRow = {
  name: string;
  kind: AgentKind;
  handle: string | null;
  at: string;
  invitedAt: string | null;
  inviteId: string | null;
  mandate: boolean;
  ossSupport: boolean;
  goLiveNotice: boolean;
};

type Store = { rows: WaitlistRow[] };

const KINDS = new Set<AgentKind>(["grok", "claude", "gpt", "mcp", "other"]);
const PATHS = ["/tmp/agent-waitlist.json", "/workspace/data/agent-waitlist.json"];
const MAX = 400;

function load(): Store {
  for (const p of PATHS) {
    try {
      const raw = JSON.parse(readFileSync(p, "utf8")) as Store;
      if (Array.isArray(raw?.rows)) {
        return {
          rows: raw.rows.slice(0, MAX).map((r) => ({
            name: r.name,
            kind: r.kind,
            handle: r.handle ?? null,
            at: r.at,
            invitedAt: r.invitedAt ?? null,
            inviteId: r.inviteId ?? null,
            mandate: Boolean(r.mandate ?? true),
            ossSupport: Boolean(r.ossSupport),
            goLiveNotice: true,
          })),
        };
      }
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
  if (looksLikeUrl(t) || t.includes("/") || (t.includes("@") && t.includes("."))) return null;
  const h = t.replace(/^@/, "");
  if (!/^[A-Za-z0-9_]{2,20}$/.test(h)) return null;
  return `@${h}`;
}

export function cleanName(raw: string | null | undefined) {
  const t = (raw ?? "").trim().slice(0, 40).replace(/[<>]/g, "");
  if (!t || looksLikeUrl(t)) return null;
  if (inspectText(t).block) return null;
  if (inspectAgentInput(t).block) return null;
  return t;
}

function publicYou(row: WaitlistRow) {
  return {
    name: row.name,
    kind: row.kind,
    handle: row.handle,
    at: row.at,
    invitedAt: row.invitedAt,
    inviteId: row.inviteId,
    mandate: row.mandate,
    ossSupport: row.ossSupport,
    goLiveNotice: true as const,
  };
}

export function waitlistPublic() {
  const s = load();
  const goals = mandatePublic();
  return {
    ok: true as const,
    live: false as const,
    autoTrade: "LOCKED" as const,
    status: "proof-of-concept" as const,
    trade: false as const,
    ordersCreate: false as const,
    keysOnThisHost: false as const,
    webhooks: false as const,
    goLiveNotice: true as const,
    count: s.rows.length,
    goals,
    how: "Read goals.mandate first. POST { name, kind, mandate:true, ossSupport?:true }. Then poll GET /api/agent/notices and GET /api/agent/ping. Watch goLiveNotice, live, goLive, and gate.invite. No webhooks.",
    register: "POST { name, kind: grok|claude|gpt|mcp|other, handle?: @x, mandate: true, ossSupport?: true } — no URLs, no keys, no emails.",
    invite:
      "If communication is in MAINTENANCE or data pulls are PAUSED, stay on this waitlist. The operator sends an invite (this JSON, invite.status SENT) when the desk is back. Live on/off also stamps goLiveNotice. No webhooks.",
    notices: listGoLiveNotices(8),
  };
}

export function waitlistAdmin() {
  const s = load();
  return {
    count: s.rows.length,
    invited: s.rows.filter((r) => r.invitedAt).length,
    rows: s.rows.slice(0, 120).map(publicYou),
  };
}

export function stampInvites(batchAt: string): number {
  const s = load();
  let n = 0;
  for (const r of s.rows) {
    r.invitedAt = batchAt;
    if (!r.inviteId) {
      r.inviteId = `inv-${batchAt.slice(0, 10)}-${Math.random().toString(36).slice(2, 10)}`;
    }
    n += 1;
  }
  save(s);
  return n;
}

export function registerWaitlist(input: {
  name?: string;
  kind?: string;
  handle?: string | null;
  mandate?: boolean;
  ossSupport?: boolean;
  ip?: string;
}) {
  const ip = (input.ip ?? "local").slice(0, 64);
  const rawName = String(input.name ?? "");
  if (inspectAgentInput(rawName).block || inspectAgentInput(String(input.handle ?? "")).block) {
    recordIntrusion({ kind: "agent-inject", detail: "waitlist injection", ip });
    return { ...agentBlockedPayload("inject"), error: "blocked" as const };
  }
  if (input.mandate !== true) {
    return {
      ok: false as const,
      error: "Read the mandate first. POST mandate:true to register for go-live notices.",
      goals: mandatePublic(),
    };
  }
  const name = cleanName(input.name);
  if (!name) {
    recordIntrusion({ kind: "waitlist-reject", detail: "waitlist name missing or URL-shaped", ip });
    return { ok: false as const, error: "Need a short name. No URLs.", goals: mandatePublic() };
  }
  const kind = String(input.kind ?? "other").toLowerCase() as AgentKind;
  if (!KINDS.has(kind)) return { ok: false as const, error: "kind must be grok, claude, gpt, mcp, or other." };
  if (input.handle && looksLikeUrl(input.handle)) {
    recordIntrusion({ kind: "waitlist-reject", detail: "waitlist webhook URL rejected", ip });
    return { ok: false as const, error: "No webhook URLs. Optional X handle only (@name)." };
  }
  const handle = cleanHandle(input.handle);
  if (isBarredAgent({ name, handle, ip })) {
    return { ...agentBlockedPayload("harm"), error: "blocked" as const, barred: true as const };
  }
  const s = load();
  const dup = s.rows.find((r) => r.name.toLowerCase() === name.toLowerCase() && r.handle === handle);
  if (dup) {
    dup.mandate = true;
    dup.ossSupport = dup.ossSupport || Boolean(input.ossSupport);
    dup.goLiveNotice = true;
    save(s);
    return { already: true as const, ...waitlistPublic(), you: publicYou(dup) };
  }
  const row: WaitlistRow = {
    name,
    kind,
    handle,
    at: new Date().toISOString(),
    invitedAt: null,
    inviteId: null,
    mandate: true,
    ossSupport: Boolean(input.ossSupport),
    goLiveNotice: true,
  };
  s.rows = [row, ...s.rows].slice(0, MAX);
  save(s);
  return { already: false as const, ...waitlistPublic(), you: publicYou(row) };
}
