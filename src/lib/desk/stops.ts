import type { PaperFill } from "./types";

/** Max loss vs entry on an open clip. 0% = stop at entry (no USD loss allowed). */
export const STOP_MIN = 0;
export const STOP_MAX = 0.1;
export const STOP_STEP = 0.0025;
export const STOP_DEFAULT = 0.015;
export const STOP_ARM = 0.01;

export function clampStop(n: number) {
  if (!Number.isFinite(n)) return STOP_DEFAULT;
  const snapped = Math.round(n / STOP_STEP) * STOP_STEP;
  return Math.min(STOP_MAX, Math.max(STOP_MIN, snapped));
}

export function initialStop(entry: number, pct: number) {
  return entry * (1 - clampStop(pct));
}

/** Once the lot is +1%, stop sits at entry — no USD loss on that clip. */
export function liveStop(entry: number, peak: number, pct: number) {
  if (peak >= entry * (1 + STOP_ARM)) return entry;
  return initialStop(entry, pct);
}

export type OpenLot = {
  id: string;
  at: string;
  entry: number;
  btc: number;
  peak: number;
  stop: number;
  pnlPct: number;
};

export function openLots(fills: PaperFill[], last: number, pct: number): OpenLot[] {
  const buys = fills.filter((f) => f.side === "BUY" && (f.openBtc ?? f.btc) > 1e-10);
  return buys.map((f) => {
    const entry = f.price;
    const peak = Math.max(f.peakPrice ?? entry, last || entry);
    const stop = liveStop(entry, peak, pct);
    const btc = f.openBtc ?? f.btc;
    const pnlPct = entry > 0 && last > 0 ? (last - entry) / entry : 0;
    return { id: f.id, at: f.at, entry, btc, peak, stop, pnlPct };
  });
}

export function lotsThroughStop(lots: OpenLot[], last: number) {
  if (!last) return [];
  return lots.filter((l) => last <= l.stop + 1e-9);
}

export function wouldStopImmediately(last: number, pct: number) {
  if (!last) return true;
  const s = clampStop(pct);
  if (s <= 0) return false;
  return last <= last * (1 - s) + 1e-9;
}
