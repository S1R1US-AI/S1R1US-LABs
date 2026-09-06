/**
 * Auto-response: block → log → score IP → tighten rate limits → virtual-patch.
 * Inspired by Wordfence firewall + CrowdSec scenarios + PCI 6.2.4 WAF.
 */
import { LAUNCH_LIVE_TRADES } from "@/lib/launch/build";
import { noteStrike, isLoopback, type BanRow } from "./ban-list";
import { recordWafHit, type WafVerdict } from "./waf";
import { recordIntrusion, type IntrusionKind } from "./intrusion-log";

export type DefendAction = {
  id: string;
  at: string;
  kind: "block" | "ban" | "tighten" | "lock-live" | "virtual-patch" | "intel";
  detail: string;
  ip?: string;
};

const ACTIONS: DefendAction[] = [];
const MAX = 120;
let attackUntil = 0;
let lastLiveNote = 0;
const LOG_PATH = "/tmp/desk-defend.json";

function push(kind: DefendAction["kind"], detail: string, ip?: string) {
  const row: DefendAction = {
    id: `${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 6)}`,
    at: new Date().toISOString(),
    kind,
    detail: detail.slice(0, 200),
    ip,
  };
  const last = ACTIONS[0];
  if (last && last.kind === kind && last.detail === row.detail && last.ip === ip && Date.now() - Date.parse(last.at) < 15_000) {
    last.at = row.at;
    persist();
    return last;
  }
  ACTIONS.unshift(row);
  if (ACTIONS.length > MAX) ACTIONS.length = MAX;
  persist();
  return row;
}

function persist() {
  if (typeof window !== "undefined") return;
  void import("node:fs")
    .then((fs) => {
      try {
        fs.writeFileSync(LOG_PATH, JSON.stringify({ at: new Date().toISOString(), attackUntil, actions: ACTIONS.slice(0, 80) }));
      } catch {
        /* preview */
      }
    })
    .catch(() => undefined);
}

export function underAttack() {
  return Date.now() < attackUntil;
}

export function markAttack(ms = 15 * 60_000) {
  const next = Date.now() + ms;
  if (next > attackUntil) {
    attackUntil = next;
    push("tighten", `Rate limits tightened for ${Math.round(ms / 60_000)} min (CrowdSec-style burst).`);
  }
}

export function handleWafBlock(verdict: WafVerdict, ip: string, ua: string) {
  recordWafHit(verdict, ip, ua);
  const top = verdict.matches[0];
  const family = top?.rule.family ?? "protocol";
  const kind: IntrusionKind = family === "scanner" || family === "cms-probe" ? "scanner" : "waf-block";
  recordIntrusion({
    kind,
    ip,
    ua,
    detail: `${family} ${verdict.matches.map((m) => m.rule.id).join("+")} ${verdict.path}`.slice(0, 180),
  });
  push(
    "block",
    `WAF ${verdict.anomaly}≥${verdict.threshold} ${verdict.matches.map((m) => m.rule.id).join(",")} ${verdict.path}`,
    ip,
  );
  const weight = Math.max(...verdict.matches.map((m) => m.rule.score), 5);
  const ban = noteStrike(ip, weight, `waf ${family}`);
  if (ban) onBan(ban);
  if (verdict.matches.some((m) => m.rule.sev === "CRITICAL")) markAttack();
}

export function handleAuthAbuse(ip: string, kind: "auth-fail" | "auth-throttle" | "secret-paste") {
  const weight = kind === "secret-paste" ? 4 : kind === "auth-throttle" ? 3 : 2;
  const ban = noteStrike(ip, weight, kind);
  if (ban) onBan(ban);
  if (kind === "auth-throttle" || kind === "secret-paste") markAttack(10 * 60_000);
}

export function handleScanner(ip: string, ua: string, path: string) {
  recordIntrusion({ kind: "scanner", ip, ua, detail: `probe ${path.slice(0, 80)}` });
  const ban = noteStrike(ip, 3, `scanner ${path.slice(0, 40)}`);
  if (ban) onBan(ban);
}

function onBan(ban: BanRow) {
  if (isLoopback(ban.ip)) return;
  recordIntrusion({
    kind: "ip-ban",
    ip: ban.ip,
    detail: `banned ${Math.round((ban.until - Date.now()) / 60_000)}m · ${ban.reason} · strikes ${ban.strikes}`,
  });
  push("ban", `IP banned until ${new Date(ban.until).toISOString()} · ${ban.reason}`, ban.ip);
}

export function confirmLiveLocked(why: string) {
  const now = Date.now();
  if (now - lastLiveNote < 10 * 60_000) return !LAUNCH_LIVE_TRADES;
  lastLiveNote = now;
  if (!LAUNCH_LIVE_TRADES) {
    push("lock-live", `Live Coinbase create stays locked. ${why}`);
    return true;
  }
  push("lock-live", `LAUNCH_LIVE_TRADES is ON — hunter must fail. ${why}`);
  return false;
}

export function applyIntelPatches(hits: { cveID: string; product: string; action: string }[]) {
  if (!hits.length) return [];
  const applied: string[] = [];
  for (const h of hits) {
    const p = h.product.toLowerCase();
    if (p.includes("vite")) {
      push("virtual-patch", `${h.cveID} Vite: WAF 961100 blocks @fs / raw+import (CVE-2025-31125 class).`);
      applied.push(h.cveID);
    } else if (p.includes("starlette") || p.includes("http")) {
      push("virtual-patch", `${h.cveID}: TRACE/TRACK/CONNECT denied; CRLF smuggling rule 921110 armed.`);
      applied.push(h.cveID);
    } else if (/node|react|openssl|linux|nginx|postgres/.test(p)) {
      push("intel", `${h.cveID} ${h.product}: operator patch. ${h.action.slice(0, 80)}`);
      applied.push(h.cveID);
    }
  }
  confirmLiveLocked("KEV refresh");
  return applied;
}

export function listActions() {
  return {
    underAttack: underAttack(),
    until: attackUntil || null,
    rows: ACTIONS.slice(0, 60),
    liveLocked: !LAUNCH_LIVE_TRADES,
  };
}

export function ingestActions(raw: unknown) {
  if (!raw || typeof raw !== "object") return;
  const rows = (raw as { actions?: unknown }).actions;
  const until = (raw as { attackUntil?: unknown }).attackUntil;
  if (typeof until === "number" && until > attackUntil) attackUntil = until;
  if (!Array.isArray(rows)) return;
  const seen = new Set(ACTIONS.map((a) => a.id));
  for (const item of rows) {
    if (!item || typeof item !== "object") continue;
    const a = item as Partial<DefendAction>;
    if (!a.id || !a.at || !a.kind) continue;
    if (seen.has(a.id)) continue;
    seen.add(a.id);
    ACTIONS.push({
      id: String(a.id).slice(0, 40),
      at: String(a.at).slice(0, 40),
      kind: a.kind,
      detail: String(a.detail ?? "").slice(0, 200),
      ip: a.ip ? String(a.ip).slice(0, 64) : undefined,
    });
  }
  ACTIONS.sort((a, b) => Date.parse(b.at) - Date.parse(a.at));
}
