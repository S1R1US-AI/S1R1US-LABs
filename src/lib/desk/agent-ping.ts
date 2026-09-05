import { writeFileSync, readFileSync, mkdirSync } from "node:fs";

export const AGENT_PING_PATH = "/api/agent/ping";

export type AgentPingFlag =
  | "NONE"
  | "PING"
  | "BUSY"
  | "REJECT";

export type AgentDayFlags = {
  dayEt: string;
  pings: number;
  rejects: number;
  lastAt: string | null;
  lastOk: boolean;
  live: false;
  status: "proof-of-concept";
  flags: AgentPingFlag[];
  note: string;
};

type Store = {
  dayEt: string;
  pings: number;
  rejects: number;
  lastAt: string | null;
  lastOk: boolean;
};

const PATHS = ["/tmp/agent-pings.json", "/workspace/data/agent-pings.json"];
const memHour = new Map<string, { n: number; at: number }>();

export function dayEt(d = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

function empty(day: string): Store {
  return { dayEt: day, pings: 0, rejects: 0, lastAt: null, lastOk: false };
}

function load(): Store {
  const today = dayEt();
  for (const p of PATHS) {
    try {
      const raw = JSON.parse(readFileSync(p, "utf8")) as Store;
      if (raw?.dayEt === today) return raw;
    } catch {
      /* missing */
    }
  }
  return empty(today);
}

function save(s: Store) {
  const body = JSON.stringify(s);
  for (const p of PATHS) {
    try {
      if (p.startsWith("/workspace/data")) mkdirSync("/workspace/data", { recursive: true });
      writeFileSync(p, body);
    } catch {
      /* preview / serverless */
    }
  }
}

export function flagsFrom(s: Store): AgentDayFlags {
  const flags: AgentPingFlag[] = [];
  if (s.rejects > 0) flags.push("REJECT");
  if (s.pings >= 50) flags.push("BUSY");
  else if (s.pings > 0) flags.push("PING");
  if (!flags.length) flags.push("NONE");
  const note =
    s.pings === 0 && s.rejects === 0
      ? "No agent connection tests today (ET). Site is proof of concept — not LIVE."
      : `${s.pings} ping(s), ${s.rejects} write-reject(s) today ET. Last ${s.lastAt ?? "—"}. LIVE=false. No trades.`;
  return {
    dayEt: s.dayEt,
    pings: s.pings,
    rejects: s.rejects,
    lastAt: s.lastAt,
    lastOk: s.lastOk,
    live: false,
    status: "proof-of-concept",
    flags,
    note,
  };
}

export function peekAgentFlags(): AgentDayFlags {
  return flagsFrom(load());
}

function allowCount(bucket: string): boolean {
  const now = Date.now();
  const row = memHour.get(bucket);
  if (!row || now - row.at > 60 * 60_000) {
    memHour.set(bucket, { n: 1, at: now });
    return true;
  }
  if (row.n >= 40) return false;
  row.n += 1;
  return true;
}

export function recordAgentPing(ok: boolean, bucket = "public"): AgentDayFlags {
  const s = load();
  const counted = allowCount(bucket);
  if (counted) {
    if (ok) {
      s.pings += 1;
      s.lastOk = true;
    } else {
      s.rejects += 1;
      s.lastOk = false;
    }
    s.lastAt = new Date().toISOString();
    save(s);
  }
  return flagsFrom(s);
}
