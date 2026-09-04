import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BTC_TONE = "text-medium";
export const USD_TONE = "text-high";

/** RSI below tape average = red; above average = green. */
export function rsiTone(rsi: number | null | undefined, avg?: number | null): string {
  if (rsi == null) return "rsi-flat";
  const mid = avg ?? 50;
  if (rsi < mid) return "rsi-below";
  if (rsi > mid) return "rsi-above";
  return "rsi-flat";
}

export function rsiHex(rsi: number | null | undefined, avg?: number | null): string | undefined {
  const tone = rsiTone(rsi, avg);
  if (tone === "rsi-below") return "#ff1f1f";
  if (tone === "rsi-above") return "#3dff1a";
  return undefined;
}

/** Kimchi Upbit vs Coinbase: premium up = green, discount down = red. */
export function kimchiTone(pct: number | null | undefined): string {
  if (pct == null) return "rsi-flat";
  if (pct >= 0) return "rsi-above";
  return "rsi-below";
}

export function kimchiHex(pct: number | null | undefined): string | undefined {
  if (pct == null) return undefined;
  if (pct >= 0) return "#3dff1a";
  return "#ff1f1f";
}

/** Alternative.me: Fear / Extreme Fear = red, Greed / Extreme Greed = green. */
export function fgTone(value: number | null | undefined, label?: string | null): string {
  const l = (label ?? "").toLowerCase();
  if (l.includes("fear") || (value != null && value < 50)) return "text-sell";
  if (l.includes("greed") || (value != null && value > 50)) return "text-high";
  return "text-muted";
}

/**
 * Size → blue: smallest = ice, largest = navy.
 * Uses log so ETF vs El Salvador still separate; gamma so mids aren't washed out.
 */
export function barBlue(value: number, max: number, min?: number): string {
  const a = Math.abs(value);
  let t = 0;
  if (min != null && min > 0 && max > min) {
    const lo = Math.log(min);
    const hi = Math.log(max);
    t = hi > lo ? (Math.log(Math.max(a, min)) - lo) / (hi - lo) : 1;
  } else if (max > 0) {
    t = a / max;
  }
  t = Math.min(1, Math.max(0, t));
  t = t ** 0.55;
  const l = [210, 241, 252];
  const d = [0, 16, 56];
  const r = Math.round(l[0] + (d[0] - l[0]) * t);
  const g = Math.round(l[1] + (d[1] - l[1]) * t);
  const b = Math.round(l[2] + (d[2] - l[2]) * t);
  const h = (n: number) => n.toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}
