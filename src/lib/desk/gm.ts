import { rsiMean, rsiSeries, rsiWilder } from "./indicators";
import { heliosCall, runBots } from "./signal";
import { PROFIT_BTC_EXPLORER, PROFIT_BTC_RECEIVE } from "./treasury";
import type { Candle, DeskSnapshot, HeliosCall, Stance } from "./types";

export const GM_NAME = "G0DZ1LLa M0D3";
export const GM_CASH_MIN = 1_000;
export const GM_CASH_MAX = 100_000;
export const GM_CASH_STEP = 1_000;
export const GM_RISK_MIN = 1;
export const GM_RISK_MAX = 5;
export const GM_TF_MIN = 1;
export const GM_TF_MAX = 24;
export const GM_PROFIT_BTC = PROFIT_BTC_RECEIVE;
export const GM_PROFIT_EXPLORER = PROFIT_BTC_EXPLORER;
export const GM_FUND_USDC = "0x551163f5d4c0361155d16131459afa5c936a60ad";
export const GM_FUND_EXPLORER = `https://basescan.org/address/${GM_FUND_USDC}`;

export type GmPilot = "AUTO" | "MANUAL";
export type GmView = "practice" | "live";
export type GmStance = Stance | "HEDGE" | "SHORT";
export type GmVarId =
  | "dca"
  | "buyGrid"
  | "flush"
  | "dayTrader"
  | "neutralGrid"
  | "fundingArb"
  | "naked";

export type GmVars = Record<GmVarId, boolean>;

export const GM_VAR_META: {
  id: GmVarId;
  label: string;
  hint: string;
  sellSleeve: boolean;
}[] = [
  { id: "dca", label: "Aggressive DCA", hint: "More frequent spot buys when RSI < avg and vol > Coinbase avg.", sellSleeve: false },
  { id: "buyGrid", label: "Buy-only grid", hint: "Buy dips in a range. Does not sell coins.", sellSleeve: false },
  { id: "flush", label: "Flush buy", hint: "Buy after a sell-wall / liquidation wash — not during it.", sellSleeve: false },
  { id: "dayTrader", label: "Classic day-trader", hint: "RSI 30/70 on the candle you pick (1h–24h). Sells into strength on the GM sleeve only.", sellSleeve: true },
  { id: "neutralGrid", label: "Neutral grid", hint: "Buy and sell inside a range on the GM sleeve only.", sellSleeve: true },
  { id: "fundingArb", label: "Funding arb", hint: "Keep spot BTC, short perp equal size. Isolated sleeve.", sellSleeve: false },
  { id: "naked", label: "Naked long / short", hint: "Levered directional. Tiny isolated sleeve. Risk 4–5.", sellSleeve: true },
];

export const DEFAULT_GM_VARS: GmVars = {
  dca: true,
  buyGrid: true,
  flush: true,
  dayTrader: false,
  neutralGrid: false,
  fundingArb: false,
  naked: false,
};

export type GmDayTf = {
  hours: number;
  bars: number;
  rsi: number | null;
  rsiAvg: number | null;
  rsi1h: number | null;
  period: number;
  now: "BUY" | "TRIM" | "WAIT";
  vs1h: string;
  sim: {
    buys: number;
    sells: number;
    nav: number;
    hold: number;
    deltaPct: number;
    buys1h: number;
    sells1h: number;
    nav1h: number;
    vs1hPct: number;
  };
};

export type GmTrigger = { id: GmVarId | "bot7"; label: string; why: string };

export type GmCall = {
  stance: GmStance;
  conviction: HeliosCall["conviction"];
  clipUsd: number;
  reason: string;
  vsBot7: { stance: Stance; conviction: HeliosCall["conviction"]; clipUsd: number };
  vars: GmVars;
  effects: { id: GmVarId; on: boolean; effect: string }[];
  triggers: GmTrigger[];
  sellSleeve: boolean;
  autoDayTrader: boolean;
  dayTf: GmDayTf;
};

export function clampGmTf(n: number) {
  return Math.min(GM_TF_MAX, Math.max(GM_TF_MIN, Math.round(n)));
}

function unixSec(t: number) {
  return t > 1e12 ? Math.floor(t / 1000) : t;
}

export function foldCandles(hourly: Candle[], hours: number): Candle[] {
  const h = clampGmTf(hours);
  const ordered = [...hourly].sort((a, b) => a.t - b.t);
  if (h <= 1) return ordered;
  const span = h * 3600;
  const map = new Map<number, Candle>();
  for (const c of ordered) {
    const key = Math.floor(unixSec(c.t) / span) * span;
    const prev = map.get(key);
    if (!prev) {
      map.set(key, { t: key, open: c.open, high: c.high, low: c.low, close: c.close, volume: c.volume });
    } else {
      prev.high = Math.max(prev.high, c.high);
      prev.low = Math.min(prev.low, c.low);
      prev.close = c.close;
      prev.volume += c.volume;
    }
  }
  return [...map.values()].sort((a, b) => a.t - b.t);
}

function rsiPeriod(bars: number) {
  if (bars >= 16) return 14;
  if (bars >= 9) return 7;
  return Math.max(4, bars - 2);
}

function simRsi30_70(closes: number[], startUsd: number) {
  const period = rsiPeriod(closes.length);
  const series = rsiSeries(closes, period);
  let cash = startUsd;
  let btc = 0;
  let buys = 0;
  let sells = 0;
  for (let i = 0; i < closes.length; i++) {
    const r = series[i];
    const px = closes[i];
    if (r == null || px == null || px <= 0) continue;
    if (r < 30 && cash > 1) {
      const usd = cash * 0.25;
      cash -= usd;
      btc += usd / px;
      buys += 1;
    } else if (r > 70 && btc > 0) {
      const qty = btc * 0.25;
      cash += qty * px;
      btc -= qty;
      sells += 1;
    }
  }
  const last = closes[closes.length - 1] ?? 0;
  const nav = cash + btc * last;
  const first = closes.find((n) => n > 0) ?? last;
  const hold = first > 0 ? startUsd * (last / first) : startUsd;
  return { buys, sells, nav, hold };
}

export function dayTraderTf(snap: DeskSnapshot, hours: number, startUsd: number): GmDayTf {
  const h = clampGmTf(hours);
  const hourly = foldCandles(snap.candles ?? [], 1);
  const bars = foldCandles(hourly, h);
  const closes = bars.map((c) => c.close);
  const closes1h = hourly.map((c) => c.close);
  const period = rsiPeriod(closes.length);
  const rsi = rsiWilder(closes, period);
  const rsiAvg = rsiMean(closes, period);
  const rsi1h = rsiWilder(closes1h, rsiPeriod(closes1h.length));
  const now: GmDayTf["now"] = rsi != null && rsi < 30 ? "BUY" : rsi != null && rsi > 70 ? "TRIM" : "WAIT";
  const sim = simRsi30_70(closes, startUsd);
  const sim1h = simRsi30_70(closes1h, startUsd);
  const vs1h =
    rsi == null || rsi1h == null
      ? "RSI n/a vs 1h"
      : `${rsi >= rsi1h ? "+" : ""}${(rsi - rsi1h).toFixed(1)} vs 1h RSI`;
  return {
    hours: h,
    bars: bars.length,
    rsi,
    rsiAvg,
    rsi1h,
    period,
    now,
    vs1h,
    sim: {
      buys: sim.buys,
      sells: sim.sells,
      nav: sim.nav,
      hold: sim.hold,
      deltaPct: sim.hold > 0 ? ((sim.nav - sim.hold) / sim.hold) * 100 : 0,
      buys1h: sim1h.buys,
      sells1h: sim1h.sells,
      nav1h: sim1h.nav,
      vs1hPct: sim1h.nav > 0 ? ((sim.nav - sim1h.nav) / sim1h.nav) * 100 : 0,
    },
  };
}

export function clampGmCash(n: number) {
  const x = Math.round(n / GM_CASH_STEP) * GM_CASH_STEP;
  return Math.min(GM_CASH_MAX, Math.max(GM_CASH_MIN, x));
}

export function clampGmRisk(n: number) {
  return Math.min(GM_RISK_MAX, Math.max(GM_RISK_MIN, Math.round(n)));
}

export function riskFraction(level: number) {
  return clampGmRisk(level) * 0.2;
}

export function autoVars(snap: DeskSnapshot, risk: number, adminLive: boolean, dayRsi: number | null): GmVars {
  const rsi = snap.rsi14;
  const funding = snap.positioning.fundingRate;
  const sell = snap.positioning.sellWallUsd;
  const buy = snap.positioning.buyWallUsd;
  const range = rsi != null && rsi >= 35 && rsi <= 65;
  const washed = (sell != null && buy != null && sell > buy * 1.5) || (rsi != null && rsi < 35);
  const day = adminLive && dayRsi != null && (dayRsi < 30 || dayRsi > 70);
  return {
    dca: true,
    buyGrid: range,
    flush: washed,
    dayTrader: day,
    neutralGrid: false,
    fundingArb: risk >= 3 && funding != null && funding > 0.0005,
    naked: false,
  };
}

export function gmCall(
  snap: DeskSnapshot,
  navUsd: number,
  opts: {
    pilot: GmPilot;
    risk: number;
    manual: GmVars;
    adminLive: boolean;
    dayHours: number;
  },
): GmCall {
  const briefs = runBots(snap);
  const bot7 = heliosCall(snap, briefs, navUsd);
  const rsi = snap.rsi14;
  const rsiAvg = snap.rsiAvg;
  const vol = snap.btc.volume24h;
  const volAvg = snap.btc.volumeAvg24h;
  const funding = snap.positioning.fundingRate;
  const dayTf = dayTraderTf(snap, opts.dayHours, navUsd || 10_000);
  const dayRsi = dayTf.rsi;
  const picked = opts.pilot === "AUTO" ? autoVars(snap, opts.risk, opts.adminLive, dayRsi) : { ...opts.manual };
  if (opts.pilot === "MANUAL") {
    if (picked.naked && opts.risk < 4) picked.naked = false;
  }
  if (opts.pilot === "AUTO" && !opts.adminLive) {
    picked.dayTrader = false;
    picked.neutralGrid = false;
    picked.naked = false;
  }
  picked.naked = picked.naked && opts.risk >= 4 && (opts.adminLive || opts.pilot === "MANUAL");
  if (opts.pilot === "AUTO") picked.naked = false;

  const frac = riskFraction(opts.risk);
  const effects: GmCall["effects"] = GM_VAR_META.map((m) => {
    const on = picked[m.id];
    let effect = "idle";
    if (!on) effect = "off";
    else if (m.id === "dca") effect = rsi != null && rsiAvg != null && rsi < rsiAvg ? "add BUY" : "stand by (RSI not discounted)";
    else if (m.id === "buyGrid") effect = "buy dips in range";
    else if (m.id === "flush") effect = "buy after wash";
    else if (m.id === "dayTrader") {
      effect =
        dayRsi != null && dayRsi > 70
          ? `SELL sleeve · ${dayTf.hours}h RSI ${dayRsi.toFixed(1)}`
          : dayRsi != null && dayRsi < 30
            ? `BUY oversold · ${dayTf.hours}h RSI ${dayRsi.toFixed(1)}`
            : `wait RSI 30/70 on ${dayTf.hours}h (${dayRsi != null ? dayRsi.toFixed(1) : "n/a"})`;
    }
    else if (m.id === "neutralGrid") effect = "buy and sell inside range (sleeve)";
    else if (m.id === "fundingArb") effect = funding != null && funding > 0.0005 ? "HEDGE — shorts collect funding" : "funding not rich";
    else if (m.id === "naked") effect = rsi != null && rsi > 70 ? "SHORT sleeve" : "LONG sleeve";
    return { id: m.id, on, effect };
  });

  let stance: GmStance = bot7.stance;
  let reason = `GM reads 7-B0T ${bot7.conviction} ${bot7.stance}.`;
  const volBid = vol != null && volAvg != null && vol > volAvg;
  const rsiBid = rsi != null && rsiAvg != null && rsi < rsiAvg;

  if (picked.dca && (rsiBid || volBid) && (bot7.stance === "HOLD" || bot7.stance === "WAIT" || bot7.stance === "ACCUMULATE")) {
    stance = rsi != null && rsi < 35 ? "BUY" : "ACCUMULATE";
    reason = "Aggressive DCA: tape cheaper than average — add to the sleeve.";
  }
  if (picked.flush && rsi != null && rsi < 32) {
    stance = "BUY";
    reason = "Flush buy: wash is done. Aggressive add.";
  }
  if (picked.buyGrid && rsi != null && rsi >= 35 && rsi <= 55 && stance === "HOLD") {
    stance = "ACCUMULATE";
    reason = "Buy-only grid: range dip.";
  }
  if (picked.dayTrader && dayRsi != null && dayRsi > 70) {
    stance = "TRIM";
    reason = `Day-trader ${dayTf.hours}h candle: RSI ${dayRsi.toFixed(1)} > 70 — profit BTC to ${GM_PROFIT_BTC}. Sleeve only.`;
  }
  if (picked.dayTrader && dayRsi != null && dayRsi < 30) {
    stance = "BUY";
    reason = `Day-trader ${dayTf.hours}h candle: RSI ${dayRsi.toFixed(1)} < 30 — buy oversold on the sleeve.`;
  }
  if (picked.neutralGrid && rsi != null && rsi > 62) {
    stance = "TRIM";
    reason = "Neutral grid: upper band — sleeve sell. Stack stays.";
  }
  if (picked.fundingArb && funding != null && funding > 0.0005) {
    stance = "HEDGE";
    reason = "Funding arb: keep spot BTC, short perp equal size. Isolated. Not a dump of the stack.";
  }
  if (picked.naked && opts.risk >= 4 && opts.adminLive) {
    stance = dayRsi != null && dayRsi > 70 ? "SHORT" : "BUY";
    reason = stance === "SHORT" ? "Naked short on the tiny GM sleeve only. 7-bot stack untouched." : "Naked long on the tiny GM sleeve.";
  } else if (picked.naked && opts.risk >= 4 && !opts.adminLive) {
    if (dayRsi != null && dayRsi > 70) {
      stance = "HOLD";
      reason = "Naked short is Live-admin only. Practice stays long-only on the sleeve.";
    }
  }

  const sellSleeve = stance === "TRIM" || stance === "SHORT";
  const conviction: HeliosCall["conviction"] =
    stance === "BUY" || stance === "ACCUMULATE" || stance === "HEDGE" ? (opts.risk >= 4 ? "HIGH" : opts.risk >= 2 ? "MEDIUM" : "LOW") : "LOW";
  const base = stance === "BUY" ? 0.04 : stance === "ACCUMULATE" ? 0.02 : stance === "TRIM" || stance === "SHORT" ? 0.03 : stance === "HEDGE" ? 0.02 : 0;
  const clipUsd = Math.round(Math.max(0, navUsd * frac * base));

  const triggers: GmTrigger[] = [];
  const buy = stance === "BUY" || stance === "ACCUMULATE";
  const sell = stance === "TRIM" || stance === "SHORT";
  if (buy && picked.dca && (rsiBid || volBid)) {
    triggers.push({ id: "dca", label: "Aggressive DCA", why: rsiBid ? "RSI under average" : "vol > Coinbase avg" });
  }
  if (buy && picked.flush && rsi != null && rsi < 32) {
    triggers.push({ id: "flush", label: "Flush buy", why: `RSI ${rsi.toFixed(1)} after wash` });
  }
  if (buy && picked.buyGrid && rsi != null && rsi >= 35 && rsi <= 55) {
    triggers.push({ id: "buyGrid", label: "Buy-only grid", why: `range dip RSI ${rsi.toFixed(1)}` });
  }
  if (buy && picked.dayTrader && dayRsi != null && dayRsi < 30) {
    triggers.push({
      id: "dayTrader",
      label: `Day-trader ${dayTf.hours}h`,
      why: `RSI ${dayRsi.toFixed(1)} < 30`,
    });
  }
  if (buy && picked.naked) {
    triggers.push({ id: "naked", label: "Naked long", why: "isolated sleeve long" });
  }
  if (sell && picked.dayTrader && dayRsi != null && dayRsi > 70) {
    triggers.push({
      id: "dayTrader",
      label: `Day-trader ${dayTf.hours}h`,
      why: `RSI ${dayRsi.toFixed(1)} > 70 → profit BTC`,
    });
  }
  if (sell && picked.neutralGrid) {
    triggers.push({ id: "neutralGrid", label: "Neutral grid", why: "upper band sleeve sell" });
  }
  if (sell && picked.naked && stance === "SHORT") {
    triggers.push({ id: "naked", label: "Naked short", why: "isolated sleeve only" });
  }
  if (stance === "HEDGE" && picked.fundingArb) {
    triggers.push({ id: "fundingArb", label: "Funding arb", why: "keep spot, short perp" });
  }
  if (!triggers.length) {
    triggers.push({
      id: "bot7",
      label: "7-B0T",
      why: `${bot7.conviction} ${bot7.stance}`,
    });
  }

  return {
    stance,
    conviction,
    clipUsd,
    reason,
    vsBot7: { stance: bot7.stance, conviction: bot7.conviction, clipUsd: bot7.clipUsd },
    vars: picked,
    effects,
    triggers,
    sellSleeve,
    autoDayTrader: Boolean(picked.dayTrader && opts.pilot === "AUTO" && opts.adminLive),
    dayTf,
  };
}
