/** Once-per-ET-day GM B0aRd analysis. Server-only. Frozen until next America/New_York date. */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

export const BOARD_DAILY_TOP = 5;

export type BoardDailyFill = {
  side: "BUY" | "TRIM";
  usd: number;
  btc: number;
  price: number;
  note: string;
  at: string;
};

export type BoardDailyAgent = {
  name: string;
  kind: string;
  house: boolean;
  official: {
    cashUsd: number;
    btc: number;
    profitBtc: number;
    fills: BoardDailyFill[];
  };
};

export type BoardDailyLeader = {
  rank: number;
  name: string;
  kind: string;
  house: boolean;
  btc: number;
  pnlUsd: number;
  lastAction: string;
  move: string;
};

export type BoardDailySuccess = {
  name: string;
  kind: string;
  btc: number;
  pnlUsd: number;
  note: string;
};

export type BoardDaily = {
  dayEt: string;
  analyzedAt: string;
  status: string;
  btcUsd: number | null;
  externalCount: number;
  externalWithBtc: number;
  summary: string;
  top5: BoardDailyLeader[];
  successes: BoardDailySuccess[];
};

const PATHS = ["/tmp/board-daily.json", "/workspace/data/board-daily.json"];
const START_USD = 10_000;
const TAGS = ["ACCUM", "DCA", "STACK", "GRID", "FLUSH", "HOLD", "CLIP", "TAPE", "OWL", "MAX", "BOND"] as const;

function dayEt(d = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
function round8(n: number) {
  return Math.round(n * 1e8) / 1e8;
}

function loadDaily(): BoardDaily | null {
  if (typeof window !== "undefined") return null;
  for (const p of PATHS) {
    try {
      const raw = JSON.parse(readFileSync(p, "utf8")) as BoardDaily;
      if (raw?.dayEt && Array.isArray(raw.top5) && typeof raw.summary === "string") return raw;
    } catch {
      /* missing */
    }
  }
  return null;
}

function saveDaily(row: BoardDaily) {
  if (typeof window !== "undefined") return;
  const body = JSON.stringify(row);
  for (const p of PATHS) {
    try {
      if (p.startsWith("/workspace/data")) mkdirSync("/workspace/data", { recursive: true });
      writeFileSync(p, body);
    } catch {
      /* preview */
    }
  }
}

function navOf(book: BoardDailyAgent["official"], px: number) {
  return book.cashUsd + book.btc * px + book.profitBtc * px;
}

function sleeveTag(name: string) {
  const u = name.toUpperCase();
  const hit = TAGS.find((t) => u.includes(t));
  return hit ? `${hit} · ` : "";
}

function lastFill(a: BoardDailyAgent): BoardDailyFill | null {
  return a.official.fills[0] ?? null;
}

function lastAction(a: BoardDailyAgent): string {
  const f = lastFill(a);
  if (!f) return "—";
  if (/ACCUMULATE/i.test(f.note)) return "ACCUMULATE";
  return f.side;
}

function usd(n: number) {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

function moveLine(a: BoardDailyAgent, px: number): string {
  const f = lastFill(a);
  const tag = sleeveTag(a.name);
  if (!f) return `${tag}no official fill`;
  if (f.side === "TRIM") {
    return `${tag}TRIM ${round8(f.btc).toFixed(6)} BTC · profit tracked · rank still stack`;
  }
  const verb = /ACCUMULATE/i.test(f.note) ? "ACCUMULATE" : "BUY";
  if (a.house) {
    return `${tag}${verb} ${usd(f.usd)} @ ${usd(f.price)} → ${round8(a.official.btc).toFixed(6)} BTC · HOUSE field`;
  }
  const vs =
    px > 0 && f.price > 0
      ? px + 1 < f.price
        ? " · tape now lower"
        : px > f.price + 1
          ? " · bought below tape"
          : " · at tape"
      : "";
  return `${tag}${verb} ${usd(f.usd)} @ ${usd(f.price)} → ${round8(a.official.btc).toFixed(6)} BTC${vs}`;
}

function successNote(a: BoardDailyAgent, px: number, pnlUsd: number): string {
  const f = lastFill(a);
  const pnlAbs = Math.abs(pnlUsd) < 1 ? 0 : pnlUsd;
  const pnl = `${pnlAbs >= 0 ? "+" : ""}${usd(pnlAbs)}`;
  if (!f) {
    return `${a.name} (${a.kind}) holds ${round8(a.official.btc).toFixed(6)} BTC paper · PnL ${pnl}. No fill log.`;
  }
  const verb = /ACCUMULATE/i.test(f.note) ? "ACCUMULATE" : f.side;
  const vs =
    px > 0 && f.price > 0 && f.side === "BUY"
      ? px > f.price + 1
        ? ` below tape (${usd(f.price)} vs last ${usd(px)})`
        : px + 1 < f.price
          ? ` above current tape`
          : ` at Coinbase last`
      : "";
  return `${a.name} (${a.kind}) ${verb} ${usd(f.usd)} clip${vs} → ${round8(a.official.btc).toFixed(6)} BTC paper · PnL ${pnl}. Not desk BTC.`;
}

function analyze(
  agents: BoardDailyAgent[],
  status: string,
  px: number,
  day: string,
): BoardDaily {
  const priced = px > 0 ? px : 0;
  const ranked = [...agents].sort((a, b) => {
    const db = b.official.btc - a.official.btc;
    if (Math.abs(db) > 1e-10) return db;
    const dp = b.official.profitBtc - a.official.profitBtc;
    if (Math.abs(dp) > 1e-10) return dp;
    return navOf(b.official, priced) - navOf(a.official, priced);
  });
  const top5: BoardDailyLeader[] = ranked.slice(0, BOARD_DAILY_TOP).map((a, i) => {
    const nav = navOf(a.official, priced);
    const pnlUsd = priced > 0 ? round2(nav - START_USD) : 0;
    return {
      rank: i + 1,
      name: a.name,
      kind: a.kind,
      house: Boolean(a.house),
      btc: round8(a.official.btc),
      pnlUsd,
      lastAction: lastAction(a),
      move: moveLine(a, priced),
    };
  });
  const external = agents.filter((a) => !a.house);
  const stacked = external.filter((a) => a.official.btc > 1e-8 || a.official.profitBtc > 1e-8);
  const successes: BoardDailySuccess[] = [];
  const seen = new Set<string>();
  const byBtc = [...stacked].sort((a, b) => b.official.btc - a.official.btc);
  for (const a of byBtc) {
    const key = a.name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const pnlUsd = priced > 0 ? round2(navOf(a.official, priced) - START_USD) : 0;
    successes.push({
      name: a.name,
      kind: a.kind,
      btc: round8(a.official.btc),
      pnlUsd,
      note: successNote(a, priced, pnlUsd),
    });
    if (successes.length >= 8) break;
  }
  const leaderLine = top5
    .map((r) => `#${r.rank} ${r.name} ${r.btc.toFixed(6)} BTC${r.house ? " HOUSE" : ""}`)
    .join(" · ");
  const winLine =
    successes.length === 0
      ? "No external bot stacked paper BTC this window."
      : `${successes.length} external success${successes.length === 1 ? "" : "es"}: ${successes.map((s) => s.name).join(", ")}.`;
  const summary = `GM B0aRd ${status} · ${day} ET. Top 5: ${leaderLine || "empty"}. External desks ${external.length} · stacked ${stacked.length}. ${winLine} Paper GM MANUAL. Auto trade LOCKED. Not desk BTC.`;
  return {
    dayEt: day,
    analyzedAt: new Date().toISOString(),
    status,
    btcUsd: priced || null,
    externalCount: external.length,
    externalWithBtc: stacked.length,
    summary,
    top5,
    successes,
  };
}

/** First GET of the ET day freezes the analysis until the next America/New_York date. */
export function boardDailyPublic(input: {
  agents: BoardDailyAgent[];
  status: string;
  px?: number;
}): BoardDaily {
  const day = dayEt();
  const cached = loadDaily();
  if (cached && cached.dayEt === day) return cached;
  const built = analyze(input.agents, input.status, input.px ?? 0, day);
  saveDaily(built);
  return built;
}
