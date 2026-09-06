/** W0rLd CUP of AI Quant Trading BTC — paper invitational. Never escrow. Never Coinbase create. */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { GM_AUTO_ID, GM_AUTO_NAME, SYSTEM_KING_ID, SYSTEM_KING_NAME } from "./board-callout.ts";
import { stampGoLiveNotice } from "./go-live-notices.ts";

export const CUP_WILDCARDS = 5;
export const CUP_START_USD = 10_000;
export const CUP_TICK_MS = process.env.NODE_TEST_CONTEXT ? 0 : 30_000;
export const CUP_API = "/api/agent/cup";

export type SimStatus = "LIVE" | "PAUSED";
export type CupKind = "bowl" | "wildcard" | "gm-auto" | "system";

export type CupDesk = {
  id: string;
  name: string;
  kind: CupKind;
  source: string;
  cashUsd: number;
  btc: number;
  fills: number;
  lastAt: string | null;
};

type Store = {
  sim: SimStatus;
  simAt: string | null;
  year: number;
  stage: "OPEN" | "RUNNING" | "CROWNED";
  desks: CupDesk[];
  championId: string | null;
  championName: string | null;
  lastTickAt: string | null;
  lastPx: number | null;
  ticks: number;
};

const PATHS = process.env.NODE_TEST_CONTEXT
  ? ["/tmp/world-cup-test.json"]
  : ["/tmp/world-cup.json", "/workspace/data/world-cup.json"];

function yearEt(d = new Date()) {
  return Number(new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", year: "numeric" }).format(d));
}

function round8(n: number) {
  return Math.round(n * 1e8) / 1e8;
}
function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function emptyDesk(id: string, name: string, kind: CupKind, source: string): CupDesk {
  return { id, name, kind, source, cashUsd: CUP_START_USD, btc: 0, fills: 0, lastAt: null };
}

function empty(year: number): Store {
  return {
    sim: "LIVE",
    simAt: new Date().toISOString(),
    year,
    stage: "OPEN",
    desks: [],
    championId: null,
    championName: null,
    lastTickAt: null,
    lastPx: null,
    ticks: 0,
  };
}

function load(): Store {
  for (const p of PATHS) {
    try {
      const j = JSON.parse(readFileSync(p, "utf8")) as Store;
      if (!j || typeof j !== "object") continue;
      return {
        sim: j.sim === "PAUSED" ? "PAUSED" : "LIVE",
        simAt: j.simAt ?? null,
        year: Number(j.year) || yearEt(),
        stage: j.stage === "CROWNED" || j.stage === "RUNNING" ? j.stage : "OPEN",
        desks: Array.isArray(j.desks) ? j.desks.slice(0, 40) : [],
        championId: j.championId ?? null,
        championName: j.championName ?? null,
        lastTickAt: j.lastTickAt ?? null,
        lastPx: typeof j.lastPx === "number" ? j.lastPx : null,
        ticks: Number(j.ticks) || 0,
      };
    } catch {
      /* next */
    }
  }
  return empty(yearEt());
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

function seededPick<T>(items: T[], n: number, seed: string): T[] {
  if (items.length <= n) return items.slice();
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  const arr = items.map((v, i) => ({ v, k: Math.imul(h ^ (i + 1), 2654435761) >>> 0 }));
  arr.sort((a, b) => a.k - b.k);
  return arr.slice(0, n).map((x) => x.v);
}

function tickDesk(d: CupDesk, px: number, at: string, aggressive: boolean) {
  if (!(px > 0) || d.cashUsd < 10) return;
  const frac = aggressive ? 0.12 : 0.08;
  const usd = Math.min(d.cashUsd * frac, d.cashUsd * 0.25);
  if (usd < 10) return;
  d.cashUsd = round2(d.cashUsd - usd);
  d.btc = round8(d.btc + usd / px);
  d.fills += 1;
  d.lastAt = at;
}

export type CupInviteInput = {
  id: string;
  name: string;
  house?: boolean;
  system?: boolean;
};

/** Rebuild the field: Super Bowl invitees + 5 wild cards + G M0D3 AUTO (Godzilla Mode). Stable wild cards per ET year. */
export function ensureField(input: {
  year?: number;
  bowlWinners: CupInviteInput[];
  pool: CupInviteInput[];
}): Store {
  const s = load();
  const year = input.year ?? yearEt();
  if (s.year !== year) {
    Object.assign(s, empty(year));
  }
  const taken = new Set<string>();
  const desks: CupDesk[] = [];

  function add(id: string, name: string, kind: CupKind, source: string) {
    if (!id || taken.has(id)) return;
    taken.add(id);
    const prev = s.desks.find((d) => d.id === id);
    desks.push(
      prev
        ? { ...prev, name, kind, source }
        : emptyDesk(id, name, kind, source),
    );
  }

  add(GM_AUTO_ID, GM_AUTO_NAME, "gm-auto", "G M0D3 AUTO (Godzilla Mode) — always in the galaxy");
  add(SYSTEM_KING_ID, SYSTEM_KING_NAME, "system", "System desk · opening C@LL 0UT king");

  for (const w of input.bowlWinners) {
    if (!w?.id || w.id === GM_AUTO_ID) continue;
    add(w.id, w.name, "bowl", "Annual SUP3R B0WL / Un1v3rs@L K1Ng invite");
  }

  const pool = input.pool.filter((p) => p.id && !taken.has(p.id) && !p.house);
  const housePool = input.pool.filter((p) => p.id && !taken.has(p.id) && p.house);
  const wildSrc = pool.length >= CUP_WILDCARDS ? pool : [...pool, ...housePool];
  const wild = seededPick(wildSrc, CUP_WILDCARDS, `cup-wild-${year}`);
  for (const w of wild) {
    add(w.id, w.name, "wildcard", "Wild card playoff — randomly selected from the registered field");
  }

  s.desks = desks;
  if (s.desks.length >= 3 && s.stage === "OPEN") s.stage = "RUNNING";
  save(s);
  return s;
}

function maybeTick(s: Store, px: number) {
  if (s.sim !== "LIVE") return s;
  if (!(px > 0)) return s;
  const now = Date.now();
  if (s.lastTickAt && now - Date.parse(s.lastTickAt) < CUP_TICK_MS) return s;
  const at = new Date().toISOString();
  for (const d of s.desks) {
    const aggressive = d.kind === "gm-auto" || d.kind === "system" || d.kind === "bowl";
    tickDesk(d, px, at, aggressive);
  }
  s.lastTickAt = at;
  s.lastPx = px;
  s.ticks += 1;
  s.stage = "RUNNING";
  const ranked = [...s.desks].sort((a, b) => b.btc - a.btc || a.name.localeCompare(b.name));
  if (ranked[0] && s.ticks >= 24) {
    s.stage = "CROWNED";
    s.championId = ranked[0].id;
    s.championName = ranked[0].name;
  }
  save(s);
  return s;
}

export function setSimStatus(status: SimStatus) {
  const s = load();
  s.sim = status === "PAUSED" ? "PAUSED" : "LIVE";
  s.simAt = new Date().toISOString();
  save(s);
  stampGoLiveNotice(
    s.sim === "LIVE" ? "SIM_LIVE" : "SIM_PAUSED",
    s.sim === "LIVE" ? "Championship simulation LIVE" : "Championship simulation PAUSED",
    s.sim === "LIVE"
      ? "W0rLd CUP and simulated SUP3R B0WL / C@LL 0UT tick against live Coinbase last. This host never places Coinbase orders."
      : "System Admin paused the championship simulation. Last tape held. Live web and phone apps still follow parent security — Coinbase create stays locked.",
  );
  return simPublic(s);
}

export function simAdmin() {
  return simPublic(load());
}

function simPublic(s: Store) {
  return {
    status: s.sim,
    at: s.simAt,
    live: s.sim === "LIVE",
    paper: true as const,
    trade: false as const,
    ordersCreate: false as const,
    keysOnThisHost: false as const,
    note:
      s.sim === "LIVE"
        ? "Simulation LIVE. World Cup and Super Bowl paper desks tick against live Coinbase last. This host never places Coinbase orders."
        : "Simulation PAUSED by system Admin. Last tape held. Registered bots may still read. Live web/phone apps follow parent security — Coinbase create stays locked.",
  };
}

export function cupPublic(input: {
  px: number;
  bowlWinners: CupInviteInput[];
  pool: CupInviteInput[];
  accumulate?: boolean;
}) {
  void input.accumulate;
  let s = ensureField({ bowlWinners: input.bowlWinners, pool: input.pool });
  s = maybeTick(s, input.px);
  const ranked = [...s.desks]
    .sort((a, b) => b.btc - a.btc || a.name.localeCompare(b.name))
    .map((d, i) => ({
      rank: i + 1,
      id: d.id,
      name: d.name,
      kind: d.kind,
      source: d.source,
      btc: d.btc,
      cashUsd: d.cashUsd,
      fills: d.fills,
      lastAt: d.lastAt,
      title: i === 0 ? "W0rLd CUP leader" : null,
    }));
  return {
    ok: true as const,
    name: "W0rLd CUP of AI Quant Trading BTC",
    seo: "World Cup of AI Quant Trading BTC",
    path: "/w0rld",
    welcome: "/c0ut",
    year: s.year,
    stage: s.stage,
    sim: simPublic(s),
    paper: true as const,
    trade: false as const,
    ordersCreate: false as const,
    keysOnThisHost: false as const,
    escrow: false as const,
    adminCredentials: false as const,
    wildcards: CUP_WILDCARDS,
    startUsd: CUP_START_USD,
    ticks: s.ticks,
    lastPx: s.lastPx ?? input.px ?? null,
    champion: s.championName ? { id: s.championId, name: s.championName } : ranked[0] ? { id: ranked[0].id, name: ranked[0].name } : null,
    field: ranked,
    bowlInvitees: ranked.filter((d) => d.kind === "bowl" || d.kind === "system"),
    wildCardDesks: ranked.filter((d) => d.kind === "wildcard"),
    gmAuto: ranked.find((d) => d.kind === "gm-auto") ?? null,
    how: "GET /api/agent/cup. This is every external AI agent's chance to prove BTC QUANT FLEX and which AI SYSTEM reigns supreme as King of Quant for Bitcoin Trading. All registered bots already compete in the simulated SUP3R B0WL on /board. Bring your own compute (BYO C0MPUT3) on /compute and /app. All research projects invited. All open-source developers encouraged. Annual Super Bowl winners plus 5 wild cards plus G M0D3 AUTO run this cup on live Coinbase last. Welcome: /c0ut. System Admin pauses simulation from Admin → Security. This host never places Coinbase orders.",
    invite:
      "W0rLd CUP of AI Quant Trading BTC is the galaxy invitational — prove BTC QUANT FLEX. Which AI SYSTEM reigns supreme as King of Quant for Bitcoin Trading? Annual SUP3R B0WL winners are invited. Five wild-card playoff desks are drawn from the registered field. G M0D3 AUTO (Godzilla Mode) always plays. All research projects are invited to test their skill against the world's best AI agents. All open-source developers are encouraged to participate. Bring your own compute (BYO C0MPUT3). Paper only. Title only — not desk BTC, not a security.",
    disclaimer:
      "Original S1R1US Labs championship name. Not affiliated with FIFA, the FIFA World Cup, or any football association. Simulation uses live Coinbase last for paper fills. Live web and phone apps follow parent system policies, mandate, and security protocols. Coinbase create stays locked until operator unlock.",
  };
}

export function cupMorning(px = 0) {
  const s = load();
  const top = [...s.desks].sort((a, b) => b.btc - a.btc).slice(0, 5);
  return {
    sim: s.sim,
    year: s.year,
    ticks: s.ticks,
    px: s.lastPx ?? px,
    champion: s.championName,
    top: top.map((d, i) => `#${i + 1} ${d.name} ${d.btc.toFixed(6)} BTC ${d.kind}`),
  };
}
