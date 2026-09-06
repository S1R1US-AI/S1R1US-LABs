import { protocolRows, vulnRows } from "./security";
import { cachedHunter } from "./hunter";
import { intrusionSummary } from "./intrusion-log";
import { CYCLE_ARCH, DATA_FEEDS } from "./policy";
import type { DeskSnapshot } from "./types";

export function morningSecurity() {
  const proto = protocolRows();
  const vulns = vulnRows();
  const fail = proto.filter((p) => p.status === "FAIL");
  const operator = proto.filter((p) => p.status === "OPERATOR");
  const open = vulns.filter((v) => v.status === "OPERATOR" || v.status === "ACCEPT");
  const needHelp = vulns.filter((v) => v.status === "OPERATOR");
  const hunter = cachedHunter();
  const intrusions = intrusionSummary();
  const headline =
    hunter.open === 0 && fail.length === 0
      ? `SECURITY ANALYSIS — hunter ${hunter.pass} PASS · ${hunter.operator} OPERATOR · ${intrusions.last24h} blocks / 24h`
      : `SECURITY ANALYSIS — hunter OPEN ${hunter.open} · FAIL ${fail.length} · ${intrusions.last24h} blocks / 24h`;
  const kinds = Object.entries(intrusions.byKind)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([k, n]) => `${k} ${n}`)
    .join(" · ");
  return {
    asOf: new Date().toISOString(),
    headline,
    proto,
    vulns,
    fail,
    operator,
    open,
    needHelp,
    hunter,
    intrusions,
    kinds,
    effectiveness: hunter.effectiveness,
    patchQueue: hunter.patchQueue.slice(0, 4),
    mandateScoreNote:
      "Security analysis: Electrovolt-style web work packages + Hacktron-style hunter (PoC || GTFO). Firewall is app-layer. Live Coinbase create stays off. Score is ops honesty, not a promise of zero risk.",
  };
}

export const AUTO_ANALYSIS = {
  asOf: new Date().toISOString(),
  day: 1 as const,
  score: 8,
  tape: "Practice AUTO ticks and paper fills are off. The desk shows would-accumulate calls from the live snapshot.",
  fills: "No paper fills. Morning report 5 Sep 08:00 ET uses the server 24h book if present. Live Coinbase stays off. 7-bot stack never sells.",
  errors: "Do not green OPEN feed errors. Yahoo/Stooq classified. SuperGrok is operator Ask Grok; visitors use BYO compute. Bot 7 HTTP SaaS is pay-for-JSON.",
  security: "Admin Security tab: CRS-PL1 WAF + CISA KEV/OSV + CrowdSec bans + OWASP Agentic ASI01–10 / LLM Top 10 2026 on MCP/A2A + Hunter + external AI gate + data-pull pause (ops.status PAUSED/MAINTENANCE on ping; blocked agents get doNotReturn). Dual Yubi on outgoing. Optional YubiKey admin-panel lock (default OFF, Yubico FIDO2 UV-required + OTP with YubiCloud HMAC). Coinbase create locked.",
  action: "DEPLOY #68: Bot 7 + GM + bots 1–6 would-accumulate. W1S3 0WL$ Forum LIVE. R0B0T$ ACT1VAT3 (/r0b0ts). Morning report library: last 14 days, 3 shown, PDF in browser (Admin → Console). FAQ #morning-report #admin-panel. Sitemap index live. Do not arm Coinbase. Auto trade LOCKED.",
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
  communication?: "OPEN" | "MAINTENANCE";
  gate?: { communication?: string; maintenance?: boolean; invite?: { status?: string; message?: string } };
}) {
  const maint = flags.communication === "MAINTENANCE" || flags.gate?.maintenance === true;
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
    communication: maint ? ("MAINTENANCE" as const) : ("OPEN" as const),
    invite: flags.gate?.invite?.status ?? (maint ? "PENDING" : "NONE"),
    headline: maint
      ? "AGENT GATE MAINTENANCE — Bot 7 / MCP / A2A closed. Ping + waitlist stay. Invite pending when the gate opens."
      : flags.pings === 0
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
