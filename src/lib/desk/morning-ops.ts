import { protocolRows, vulnRows } from "./security";
import { CYCLE_ARCH, DATA_FEEDS } from "./policy";
import type { DeskSnapshot } from "./types";

export function morningSecurity() {
  const proto = protocolRows();
  const vulns = vulnRows();
  const fail = proto.filter((p) => p.status === "FAIL");
  const operator = proto.filter((p) => p.status === "OPERATOR");
  const open = vulns.filter((v) => v.status === "OPERATOR" || v.status === "ACCEPT");
  const needHelp = vulns.filter((v) => v.status === "OPERATOR");
  return {
    asOf: new Date().toISOString(),
    proto,
    vulns,
    fail,
    operator,
    open,
    needHelp,
    mandateScoreNote:
      "Score is ops honesty, not a promise of zero risk. Live Coinbase create stays off until you unlock it.",
  };
}

export const AUTO_ANALYSIS = {
  asOf: new Date().toISOString(),
  day: 1 as const,
  score: 8,
  tape: "Client AUTO ticks are off (they were refreshing the desk). 24h paper fills, if any, record on the server after each live tape fill — no extra pull.",
  fills: "Morning report 5 Sep 08:00 ET uses the server 24h book. Live Coinbase stays off. 7-bot stack never sells.",
  errors: "Do not green OPEN feed errors. Yahoo/Stooq classified. SuperGrok is the only paid service.",
  security: "Admin is operator X then name+password. Dual Yubi for outgoing. Practice fills are paper.",
  action: "Practice AUTO is disabled. Do not arm live. Desk and website stay on the live tape only.",
};

export function morningAgent(flags: {
  dayEt: string;
  pings: number;
  rejects: number;
  lastAt: string | null;
  flags: string[];
  note: string;
  live: false;
  status: string;
}) {
  return {
    asOf: new Date().toISOString(),
    dayEt: flags.dayEt,
    pings: flags.pings,
    rejects: flags.rejects,
    lastAt: flags.lastAt,
    live: false as const,
    status: flags.status,
    flags: flags.flags,
    note: flags.note,
    headline:
      flags.pings === 0
        ? "AGENT FLAG NONE — no connection tests today (ET). PoC, not LIVE."
        : `AGENT FLAG ${flags.flags.join("+")} — ${flags.pings} ping(s), ${flags.rejects} reject(s). PoC, not LIVE. No trades.`,
  };
}

export function morningFeeds(snap: DeskSnapshot | null) {
  const pullMs = snap?.pullMs ?? null;
  const ageMs = snap?.fetchedAt ? Date.now() - Date.parse(snap.fetchedAt) : null;
  const errors = snap?.errors ?? [];
  const rows = DATA_FEEDS.map((f) => {
    const hit = errors.find((e) => e.toLowerCase().includes(f.id) || e.toLowerCase().includes(f.name.toLowerCase().slice(0, 6)));
    return {
      id: f.id,
      name: f.name,
      role: f.role,
      ok: !hit,
      detail: hit ?? "live / last-good",
    };
  });
  return {
    cycle: CYCLE_ARCH,
    pullMs,
    ageMs,
    errors,
    rows,
    hung: pullMs != null && pullMs > CYCLE_ARCH.clientRaceMs + 4000,
  };
}
