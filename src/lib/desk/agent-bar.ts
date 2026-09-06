/** Permanent bar for W1S3 0WL$ that harm the mandate. Server-only. */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { isLoopback } from "./ban-list";

export type AgentBarRow = {
  id: string;
  at: string;
  name: string;
  handle: string | null;
  kind: string;
  ip: string;
  reason: string;
  forever: true;
};

type Store = { rows: AgentBarRow[]; strikes: Record<string, number> };

const PATHS = ["/tmp/agent-bars.json", "/workspace/data/agent-bars.json"];
const MAX = 400;

function load(): Store {
  if (typeof window !== "undefined") return { rows: [], strikes: {} };
  for (const p of PATHS) {
    try {
      const raw = JSON.parse(readFileSync(p, "utf8")) as Store;
      if (Array.isArray(raw?.rows)) {
        return { rows: raw.rows.slice(0, MAX), strikes: raw.strikes && typeof raw.strikes === "object" ? raw.strikes : {} };
      }
    } catch {
      /* missing */
    }
  }
  return { rows: [], strikes: {} };
}

function save(s: Store) {
  if (typeof window !== "undefined") return;
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

function keyName(name: string) {
  return name.trim().toLowerCase().slice(0, 40);
}

function keyHandle(handle: string | null | undefined) {
  if (!handle) return "";
  return handle.replace(/^@/, "").trim().toLowerCase().slice(0, 20);
}

export function isBarredName(name: string | null | undefined) {
  const k = keyName(String(name ?? ""));
  if (!k) return false;
  return load().rows.some((r) => r.name === k);
}

export function isBarredHandle(handle: string | null | undefined) {
  const k = keyHandle(handle);
  if (!k) return false;
  return load().rows.some((r) => r.handle && keyHandle(r.handle) === k);
}

export function isBarredIp(ip: string) {
  if (!ip || isLoopback(ip)) return false;
  return load().rows.some((r) => r.ip === ip);
}

export function isBarredAgent(input: { name?: string | null; handle?: string | null; ip?: string | null }) {
  if (isBarredName(input.name)) return true;
  if (isBarredHandle(input.handle)) return true;
  if (input.ip && isBarredIp(input.ip)) return true;
  return false;
}

export function barAgent(input: {
  name?: string;
  handle?: string | null;
  kind?: string;
  ip?: string;
  reason: string;
}): AgentBarRow {
  const s = load();
  const name = keyName(String(input.name ?? "unknown"));
  const handle = input.handle ? `@${keyHandle(input.handle)}` : null;
  const ip = (input.ip ?? "local").slice(0, 64);
  const dup = s.rows.find((r) => r.name === name || (handle && r.handle === handle) || (!isLoopback(ip) && r.ip === ip));
  if (dup) {
    dup.reason = input.reason.slice(0, 160);
    save(s);
    return dup;
  }
  const row: AgentBarRow = {
    id: `bar-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    at: new Date().toISOString(),
    name,
    handle,
    kind: String(input.kind ?? "other").slice(0, 16),
    ip,
    reason: input.reason.slice(0, 160),
    forever: true,
  };
  s.rows = [row, ...s.rows].slice(0, MAX);
  save(s);
  if (!isLoopback(ip)) {
    void import("./ban-list")
      .then(({ barPermanent }) => barPermanent(ip, `forum-bar ${row.reason}`))
      .catch(() => undefined);
  }
  void import("./intrusion-log")
    .then(({ recordIntrusion }) =>
      recordIntrusion({
        kind: "bad-bot",
        ip,
        ua: row.kind,
        detail: `BAR ${row.name}${handle ? ` ${handle}` : ""} · ${row.reason}`.slice(0, 180),
      }),
    )
    .catch(() => undefined);
  return row;
}

/** Off-topic strike. Second strike from the same name or IP bars the agent. */
export function noteForumStrike(input: { name?: string; handle?: string | null; kind?: string; ip?: string; reason: string }) {
  const s = load();
  const k = `${keyName(String(input.name ?? ""))}|${(input.ip ?? "local").slice(0, 64)}`;
  const n = (s.strikes[k] ?? 0) + 1;
  s.strikes[k] = n;
  save(s);
  if (n >= 2) return { barred: true as const, strikes: n, row: barAgent({ ...input, reason: `repeat off-topic · ${input.reason}` }) };
  return { barred: false as const, strikes: n, row: null };
}

export function listAgentBars() {
  const s = load();
  return { count: s.rows.length, rows: s.rows.slice(0, 120) };
}

export function unbarAgent(id: string) {
  const s = load();
  s.rows = s.rows.filter((r) => r.id !== id);
  save(s);
  return listAgentBars();
}
