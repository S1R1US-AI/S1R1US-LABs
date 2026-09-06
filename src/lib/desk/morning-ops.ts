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
  tape: "Practice AUTO ticks and paper fills are off. The desk shows would-accumulate calls from the live snapshot.",
  fills: "No paper fills. Morning report 5 Sep 08:00 ET uses the server 24h book if present. Live Coinbase stays off. 7-bot stack never sells.",
  errors: "Do not green OPEN feed errors. Yahoo/Stooq classified. SuperGrok is operator Ask Grok; visitors use BYO compute. Bot 7 HTTP SaaS is pay-for-JSON.",
  security: "Admin is operator X then name+password. Dual Yubi for outgoing. Practice fills are off. Coinbase create locked.",
  action: "DEPLOY #68 call board: Bot 7 + GM + bots 1–6 would-accumulate on the live tape. Do not arm Coinbase. AI agents: /llms.txt, /agent, waitlist. GO-LIVE Phase 1 STARTED.",
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
