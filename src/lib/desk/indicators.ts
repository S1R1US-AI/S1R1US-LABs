import type { Candle, HeatBucket, LiqBand, Stance } from "./types";

export function rsiWilder(closes: number[], period = 14): number | null {
  const series = rsiSeries(closes, period);
  for (let i = series.length - 1; i >= 0; i--) {
    if (series[i] != null) return series[i];
  }
  return null;
}

export function rsiMean(closes: number[], period = 14): number | null {
  const vals = rsiSeries(closes, period).filter((n): n is number => n != null);
  if (!vals.length) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

export function rsiSeries(closes: number[], period = 14): (number | null)[] {
  const out: (number | null)[] = Array(closes.length).fill(null);
  if (closes.length < period + 1) return out;
  let gain = 0;
  let loss = 0;
  for (let i = 1; i <= period; i++) {
    const d = closes[i]! - closes[i - 1]!;
    if (d >= 0) gain += d;
    else loss -= d;
  }
  let avgGain = gain / period;
  let avgLoss = loss / period;
  const rs0 = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
  out[period] = rs0;
  for (let i = period + 1; i < closes.length; i++) {
    const d = closes[i]! - closes[i - 1]!;
    avgGain = (avgGain * (period - 1) + Math.max(d, 0)) / period;
    avgLoss = (avgLoss * (period - 1) + Math.max(-d, 0)) / period;
    out[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
  }
  return out;
}

export function macdLast(closes: number[], fast = 12, slow = 26, signal = 9): {
  macd: number;
  signal: number;
  hist: number;
} | null {
  if (closes.length < slow + signal) return null;
  const eFast = ema(closes, fast);
  const eSlow = ema(closes, slow);
  const line: number[] = [];
  for (let i = 0; i < closes.length; i++) {
    const a = eFast[i];
    const b = eSlow[i];
    if (a == null || b == null) continue;
    line.push(a - b);
  }
  if (line.length < signal) return null;
  const sig = ema(line, signal);
  for (let i = sig.length - 1; i >= 0; i--) {
    if (sig[i] != null && line[i] != null) {
      const macd = line[i]!;
      const s = sig[i]!;
      return { macd, signal: s, hist: macd - s };
    }
  }
  return null;
}

export function macdHistSeries(closes: number[], fast = 12, slow = 26, signal = 9): (number | null)[] {
  const out: (number | null)[] = Array(closes.length).fill(null);
  const eFast = ema(closes, fast);
  const eSlow = ema(closes, slow);
  const idx: number[] = [];
  const line: number[] = [];
  for (let i = 0; i < closes.length; i++) {
    const a = eFast[i];
    const b = eSlow[i];
    if (a == null || b == null) continue;
    idx.push(i);
    line.push(a - b);
  }
  const sig = ema(line, signal);
  for (let j = 0; j < idx.length; j++) {
    if (sig[j] != null) out[idx[j]!] = line[j]! - sig[j]!;
  }
  return out;
}

export function ema(values: number[], period: number): (number | null)[] {
  const out: (number | null)[] = Array(values.length).fill(null);
  if (values.length < period) return out;
  const k = 2 / (period + 1);
  let prev = 0;
  for (let i = 0; i < period; i++) prev += values[i]!;
  prev /= period;
  out[period - 1] = prev;
  for (let i = period; i < values.length; i++) {
    prev = values[i]! * k + prev * (1 - k);
    out[i] = prev;
  }
  return out;
}

export function bollinger(
  values: number[],
  period = 20,
  k = 2,
): { upper: (number | null)[]; lower: (number | null)[] } {
  const upper: (number | null)[] = Array(values.length).fill(null);
  const lower: (number | null)[] = Array(values.length).fill(null);
  if (values.length < period) return { upper, lower };
  for (let i = period - 1; i < values.length; i++) {
    const slice = values.slice(i - period + 1, i + 1);
    const mean = slice.reduce((a, b) => a + b, 0) / period;
    const variance = slice.reduce((a, b) => a + (b - mean) ** 2, 0) / period;
    const sd = Math.sqrt(variance);
    upper[i] = mean + k * sd;
    lower[i] = mean - k * sd;
  }
  return { upper, lower };
}

export function smaLast(values: number[], period: number): number | null {
  if (values.length < period) return null;
  let s = 0;
  for (let i = values.length - period; i < values.length; i++) s += values[i]!;
  return s / period;
}

export function emaLast(values: number[], period: number): number | null {
  const s = ema(values, period);
  for (let i = s.length - 1; i >= 0; i--) if (s[i] != null) return s[i];
  return null;
}

export function atrLast(candles: Candle[], period = 14): number | null {
  const ordered = [...candles].sort((a, b) => a.t - b.t);
  if (ordered.length < period + 1) return null;
  const tr: number[] = [];
  for (let i = 1; i < ordered.length; i++) {
    const h = ordered[i]!.high;
    const l = ordered[i]!.low;
    const pc = ordered[i - 1]!.close;
    tr.push(Math.max(h - l, Math.abs(h - pc), Math.abs(l - pc)));
  }
  return smaLast(tr, period);
}

export function bbPercentB(closes: number[], period = 20, k = 2): number | null {
  if (closes.length < period) return null;
  const bb = bollinger(closes, period, k);
  const i = closes.length - 1;
  const u = bb.upper[i];
  const l = bb.lower[i];
  const c = closes[i];
  if (u == null || l == null || c == null || u <= l) return null;
  return (c - l) / (u - l);
}

export function volumeRatio(candles: Candle[], period = 20): number | null {
  const ordered = [...candles].sort((a, b) => a.t - b.t);
  if (ordered.length < period) return null;
  const vols = ordered.map((c) => c.volume);
  const avg = smaLast(vols, period);
  const last = vols[vols.length - 1];
  if (avg == null || avg <= 0 || last == null) return null;
  return last / avg;
}

/** Mean of completed 24-hour volume windows from hourly Coinbase candles. */
export function volumeAvg24h(candles: Candle[], windows = 20): number | null {
  const ordered = [...candles].sort((a, b) => a.t - b.t);
  if (ordered.length < 24) return null;
  const daily: number[] = [];
  for (let i = 23; i < ordered.length; i += 24) {
    let sum = 0;
    for (let j = i - 23; j <= i; j++) sum += ordered[j]!.volume;
    if (sum > 0) daily.push(sum);
  }
  if (!daily.length) return null;
  const take = daily.slice(-windows);
  return take.reduce((a, b) => a + b, 0) / take.length;
}

export type OverlayBar = {
  t: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ema12: number | null;
  ema26: number | null;
  bbUpper: number | null;
  bbLower: number | null;
  rsi: number | null;
  macdHist: number | null;
  macd50Hist: number | null;
  macd200Hist: number | null;
  ema50: number | null;
  ema200: number | null;
  up: boolean;
};

export function overlayBars(candles: Candle[]): OverlayBar[] {
  const ordered = [...candles].sort((a, b) => a.t - b.t);
  const closes = ordered.map((c) => c.close);
  const e12 = ema(closes, 12);
  const e26 = ema(closes, 26);
  const e50 = ema(closes, 50);
  const e200 = ema(closes, 200);
  const bb = bollinger(closes, 20, 2);
  const rsi = rsiSeries(closes, 14);
  const hist = macdHistSeries(closes, 12, 26, 9);
  const hist50 = macdHistSeries(closes, 50, 100, 9);
  const hist200 = macdHistSeries(closes, 50, 200, 9);
  return ordered.map((c, i) => ({
    t: c.t,
    open: c.open,
    high: c.high,
    low: c.low,
    close: c.close,
    volume: c.volume,
    ema12: e12[i] ?? null,
    ema26: e26[i] ?? null,
    ema50: e50[i] ?? null,
    ema200: e200[i] ?? null,
    bbUpper: bb.upper[i] ?? null,
    bbLower: bb.lower[i] ?? null,
    rsi: rsi[i] ?? null,
    macdHist: hist[i] ?? null,
    macd50Hist: hist50[i] ?? null,
    macd200Hist: hist200[i] ?? null,
    up: c.close >= c.open,
  }));
}

export function candlesToClosesOldestFirst(candles: Candle[]): number[] {
  return [...candles].sort((a, b) => a.t - b.t).map((c) => c.close);
}

export function depthHeatmap(
  bids: [number, number][],
  asks: [number, number][],
  buckets = 18,
): HeatBucket[] {
  if (!bids.length || !asks.length) return [];
  const mid = (bids[0]![0] + asks[0]![0]) / 2;
  const span = mid * 0.012;
  const lo = mid - span;
  const hi = mid + span;
  const step = (hi - lo) / buckets;
  const out: HeatBucket[] = Array.from({ length: buckets }, (_, i) => ({
    price: lo + (i + 0.5) * step,
    bidUsd: 0,
    askUsd: 0,
  }));
  const add = (px: number, sz: number, side: "bid" | "ask") => {
    const i = Math.min(buckets - 1, Math.max(0, Math.floor((px - lo) / step)));
    const usd = px * sz;
    if (side === "bid") out[i]!.bidUsd += usd;
    else out[i]!.askUsd += usd;
  };
  for (const [px, sz] of bids) add(px, sz, "bid");
  for (const [px, sz] of asks) add(px, sz, "ask");
  return out;
}

const LEVS = [10, 25, 50, 75, 100];

export function liqHeatmap(opts: {
  last: number | null;
  oiUsd: number | null;
  ls: number | null;
  liquidations: { price: number; side: "long" | "short"; usd: number }[];
  book: HeatBucket[];
  buckets?: number;
}): LiqBand[] {
  const last = opts.last;
  if (last == null || last <= 0) return [];
  const buckets = opts.buckets ?? 16;
  const span = last * 0.08;
  const lo = last - span;
  const hi = last + span;
  const step = (hi - lo) / buckets;
  const out: LiqBand[] = Array.from({ length: buckets }, (_, i) => ({
    price: lo + (i + 0.5) * step,
    longUsd: 0,
    shortUsd: 0,
  }));
  const slot = (px: number) => Math.min(buckets - 1, Math.max(0, Math.floor((px - lo) / step)));

  const oi = opts.oiUsd ?? 0;
  const ls = opts.ls ?? 1;
  const longShare = ls / (1 + ls);
  const shortShare = 1 / (1 + ls);
  const perLev = 1 / LEVS.length;
  for (const lev of LEVS) {
    const longPx = last * (1 - 1 / lev);
    const shortPx = last * (1 + 1 / lev);
    const w = (oi * perLev) / Math.max(lev / 10, 1);
    out[slot(longPx)]!.longUsd += w * longShare;
    out[slot(shortPx)]!.shortUsd += w * shortShare;
  }

  for (const hit of opts.liquidations) {
    if (hit.price < lo || hit.price > hi) continue;
    if (hit.side === "long") out[slot(hit.price)]!.longUsd += hit.usd;
    else out[slot(hit.price)]!.shortUsd += hit.usd;
  }

  for (const b of opts.book) {
    const i = slot(b.price);
    out[i]!.longUsd += b.bidUsd * 0.15;
    out[i]!.shortUsd += b.askUsd * 0.15;
  }

  return out;
}

/** Keep ~13d of Coinbase hours so MACD-50 / MACD-200 have enough bars for every visitor. */
export function mergeHourly(prev: Candle[], next: Candle[]): Candle[] {
  const by = new Map<number, Candle>();
  for (const c of prev) {
    if (c.t > 0 && Number.isFinite(c.close)) by.set(c.t, c);
  }
  for (const c of next) {
    if (c.t > 0 && Number.isFinite(c.close)) by.set(c.t, c);
  }
  return [...by.values()].sort((a, b) => a.t - b.t).slice(-320);
}

export function clipForNav(nav: number, stance: Stance): number {
  const pct = stance === "BUY" ? 0.02 : stance === "ACCUMULATE" ? 0.01 : 0;
  if (pct <= 0) return 0;
  return Math.max(1, Math.round(nav * pct));
}
