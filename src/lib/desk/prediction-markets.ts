import type { PredictionKind, PredictionMarket, PredictionVenue } from "./types";

export type { PredictionKind, PredictionMarket, PredictionVenue };

const POLY_HOST = "https://gamma-api.polymarket.com";
const KALSHI_HOST = "https://api.elections.kalshi.com/trade-api/v2";
const FETCH_MS = 2800;
const MAX_BYTES = 220_000;

type PolyMarket = {
  question?: string;
  groupItemTitle?: string;
  slug?: string;
  closed?: boolean | string;
  active?: boolean | string;
  outcomePrices?: string | string[];
  outcomes?: string | string[];
  volumeNum?: number;
  volume?: number | string;
  endDate?: string;
  endDateIso?: string;
};

type PolyEvent = {
  title?: string;
  slug?: string;
  closed?: boolean | string;
  active?: boolean | string;
  volume?: number | string;
  volume24hr?: number;
  markets?: PolyMarket[] | string;
};

type KalshiMarket = {
  ticker?: string;
  event_ticker?: string;
  title?: string;
  yes_sub_title?: string;
  no_sub_title?: string;
  status?: string;
  last_price_dollars?: string;
  yes_bid_dollars?: string;
  yes_ask_dollars?: string;
  volume_fp?: string;
  volume_24h_fp?: string;
  close_time?: string;
  floor_strike?: number;
};

function asBool(v: unknown) {
  return v === true || v === "true";
}

function asList<T>(v: T[] | string | undefined): T[] {
  if (Array.isArray(v)) return v;
  if (typeof v === "string") {
    try {
      const j = JSON.parse(v) as unknown;
      return Array.isArray(j) ? (j as T[]) : [];
    } catch {
      return [];
    }
  }
  return [];
}

function num(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim()) {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function yesFromPrices(raw: unknown): number | null {
  const prices = asList<string>(raw as string[] | string | undefined).map((p) => Number(p));
  const yes = prices[0];
  if (yes == null || !Number.isFinite(yes)) return null;
  return Math.round(Math.min(1, Math.max(0, yes)) * 1000) / 10;
}

function midYes(bid: string | undefined, ask: string | undefined, last: string | undefined): number | null {
  const b = num(bid);
  const a = num(ask);
  const l = num(last);
  const p = l ?? (b != null && a != null ? (b + a) / 2 : a ?? b);
  if (p == null) return null;
  return Math.round(Math.min(1, Math.max(0, p)) * 1000) / 10;
}

function nyParts(at = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).formatToParts(at);
  const year = parts.find((p) => p.type === "year")?.value ?? "2026";
  const month = parts.find((p) => p.type === "month")?.value ?? "September";
  const day = parts.find((p) => p.type === "day")?.value ?? "06";
  return { year, month, day, monthLc: month.toLowerCase() };
}

export function classifyBtcTitle(title: string): PredictionKind {
  const t = title.toLowerCase();
  if (/all.?time high|\bath\b|yearly high|year high|hit in 2026|before 2027|by december|by march|by june|by september 30|by dec/.test(t)) {
    return "ath";
  }
  if (/monthly|this month|in september|in october|in november|in december|how high will btc get|hit in september|hit in october/.test(t)) {
    return "monthly";
  }
  return "other";
}

export function parsePolyEvent(ev: PolyEvent, kindHint?: PredictionKind): PredictionMarket[] {
  if (asBool(ev.closed)) return [];
  const slug = (ev.slug ?? "").trim();
  const eventTitle = (ev.title ?? slug).trim();
  const kind = kindHint ?? classifyBtcTitle(eventTitle);
  const url = slug ? `https://polymarket.com/event/${slug}` : "https://polymarket.com";
  const markets = asList<PolyMarket>(ev.markets);
  const rows: PredictionMarket[] = [];
  for (const m of markets) {
    if (asBool(m.closed)) continue;
    const yesPct = yesFromPrices(m.outcomePrices);
    if (yesPct == null) continue;
    if (yesPct <= 0.2 || yesPct >= 99.8) continue;
    const strike = (m.groupItemTitle ?? "").trim() || null;
    const question = (m.question ?? eventTitle).trim();
    const title = strike && !question.toLowerCase().includes(strike.toLowerCase()) ? `${question} · ${strike}` : question;
    rows.push({
      id: `poly:${slug || eventTitle}:${m.slug || strike || title}`,
      venue: "Polymarket",
      kind,
      title,
      strike,
      yesPct,
      volumeUsd: num(m.volumeNum) ?? num(m.volume),
      end: m.endDateIso || m.endDate || "",
      url,
    });
  }
  return rows;
}

export function parseKalshiMarkets(series: string, kind: PredictionKind, markets: KalshiMarket[]): PredictionMarket[] {
  const seriesLc = series.toLowerCase();
  const rows: PredictionMarket[] = [];
  for (const m of markets) {
    if (m.status && m.status !== "active" && m.status !== "open") continue;
    const yesPct = midYes(m.yes_bid_dollars, m.yes_ask_dollars, m.last_price_dollars);
    if (yesPct == null) continue;
    if (yesPct <= 0.2 || yesPct >= 99.8) continue;
    const strike = (m.yes_sub_title ?? "").trim() || null;
    const title = (m.title ?? strike ?? m.ticker ?? series).trim();
    const event = (m.event_ticker ?? "").toLowerCase();
    const ticker = (m.ticker ?? "").toLowerCase();
    const url = event
      ? `https://kalshi.com/markets/${seriesLc}/${event}`
      : `https://kalshi.com/markets/${seriesLc}`;
    rows.push({
      id: `kalshi:${ticker || title}`,
      venue: "Kalshi",
      kind,
      title,
      strike,
      yesPct,
      volumeUsd: num(m.volume_fp) ?? num(m.volume_24h_fp),
      end: m.close_time ?? "",
      url,
    });
  }
  return rows;
}

function pickTop(rows: PredictionMarket[], n: number) {
  return [...rows]
    .sort((a, b) => (b.volumeUsd ?? 0) - (a.volumeUsd ?? 0) || (b.yesPct ?? 0) - (a.yesPct ?? 0))
    .slice(0, n);
}

function dedupe(rows: PredictionMarket[]) {
  const seen = new Set<string>();
  return rows.filter((r) => {
    const k = `${r.venue}|${r.title.toLowerCase()}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

async function getJson<T>(url: string): Promise<T> {
  const { guardedFetch } = await import("./net-guard");
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), FETCH_MS);
  try {
    const res = await guardedFetch(url, {
      signal: ctrl.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "S1R1US-Lab/1.0 (bitcoin accumulator research; education tape)",
      },
    });
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    const buf = await res.arrayBuffer();
    const slice = buf.byteLength > MAX_BYTES ? buf.slice(0, MAX_BYTES) : buf;
    return JSON.parse(new TextDecoder().decode(slice)) as T;
  } finally {
    clearTimeout(t);
  }
}

async function polyEvent(slug: string, kind: PredictionKind): Promise<PredictionMarket[]> {
  const data = await getJson<PolyEvent[] | { events?: PolyEvent[] }>(
    `${POLY_HOST}/events?slug=${encodeURIComponent(slug)}&closed=false&limit=1`,
  );
  const rows = Array.isArray(data) ? data : data.events ?? [];
  return rows.flatMap((ev) => parsePolyEvent(ev, kind));
}

async function polyBitcoinTag(): Promise<PredictionMarket[]> {
  const data = await getJson<PolyEvent[] | { events?: PolyEvent[] }>(
    `${POLY_HOST}/events?active=true&closed=false&limit=10&order=volume24hr&ascending=false&tag_slug=bitcoin`,
  );
  const rows = Array.isArray(data) ? data : data.events ?? [];
  return rows.flatMap((ev) => parsePolyEvent(ev));
}

async function kalshiSeries(series: string, kind: PredictionKind, limit = 12): Promise<PredictionMarket[]> {
  const data = await getJson<{ markets?: KalshiMarket[] }>(
    `${KALSHI_HOST}/markets?status=open&series_ticker=${encodeURIComponent(series)}&limit=${limit}`,
  );
  return parseKalshiMarkets(series, kind, data.markets ?? []);
}

export async function fetchPredictionMarkets(): Promise<PredictionMarket[]> {
  const { year, monthLc } = nyParts();
  const monthlySlug = `what-price-will-bitcoin-hit-in-${monthLc}-${year}`;
  const settled = await Promise.allSettled([
    polyEvent("bitcoin-all-time-high-by", "ath"),
    polyEvent(monthlySlug, "monthly"),
    polyEvent("what-price-will-bitcoin-hit-before-2027", "ath"),
    polyBitcoinTag(),
    kalshiSeries("KXBTCMAXY", "ath", 8),
    kalshiSeries("KXBTCMAXMON", "monthly", 10),
    kalshiSeries("KXBTCD", "other", 8),
  ]);
  const rows: PredictionMarket[] = [];
  for (const r of settled) {
    if (r.status === "fulfilled") rows.push(...r.value);
  }
  const ath = pickTop(
    rows.filter((x) => x.kind === "ath"),
    5,
  );
  const monthly = pickTop(
    rows.filter((x) => x.kind === "monthly"),
    6,
  );
  const other = pickTop(
    rows.filter((x) => x.kind === "other"),
    5,
  );
  return dedupe([...ath, ...monthly, ...other]).slice(0, 16);
}

export const PRED_KIND_LABEL: Record<PredictionKind, string> = {
  ath: "All-time high",
  monthly: "Monthly high",
  other: "Other BTC",
};

export function parseStrikeUsd(strike: string | null, title = ""): number | null {
  const t = `${strike ?? ""} ${title}`.replace(/,/g, "");
  const k = t.match(/(\d+(?:\.\d+)?)\s*k\b/i);
  if (k) {
    const n = Number(k[1]) * 1000;
    return n >= 1000 && n <= 5_000_000 ? n : null;
  }
  const m = t.match(/\$?\s*(\d{4,7}(?:\.\d+)?)/);
  if (!m) return null;
  const n = Number(m[1]);
  return n >= 1000 && n <= 5_000_000 ? n : null;
}

export type PredVenueBook = {
  venue: PredictionVenue;
  n: number;
  impliedMonthly: number | null;
  monthlyYesPlus5: number | null;
  dailyYesNearSpot: number | null;
  athYes: number | null;
  headline: string;
  bullets: string[];
};

export type PredAnalyst = {
  stance: "ACCUMULATE" | "WAIT" | "HOLD";
  summary: string;
  discount: boolean;
  fomo: boolean;
  overlayPass: boolean;
  checkLabel: string;
  polymarket: PredVenueBook;
  kalshi: PredVenueBook;
};

function volWtdYes(rows: PredictionMarket[]): number | null {
  let w = 0;
  let acc = 0;
  for (const r of rows) {
    if (r.yesPct == null) continue;
    const v = Math.max(1, r.volumeUsd ?? 1);
    acc += r.yesPct * v;
    w += v;
  }
  return w > 0 ? Math.round((acc / w) * 10) / 10 : null;
}

function impliedMonthly(rows: PredictionMarket[]): number | null {
  const pts = rows
    .map((r) => {
      const strikeUsd = parseStrikeUsd(r.strike, r.title);
      if (strikeUsd == null || r.yesPct == null) return null;
      return { strikeUsd, yesPct: r.yesPct };
    })
    .filter((x): x is { strikeUsd: number; yesPct: number } => x != null)
    .sort((a, b) => a.strikeUsd - b.strikeUsd);
  if (!pts.length) return null;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i]!;
    const b = pts[i + 1]!;
    if ((a.yesPct >= 50 && b.yesPct <= 50) || (a.yesPct <= 50 && b.yesPct >= 50)) {
      const den = b.yesPct - a.yesPct;
      if (den === 0) return a.strikeUsd;
      const t = (50 - a.yesPct) / den;
      return Math.round(a.strikeUsd + t * (b.strikeUsd - a.strikeUsd));
    }
  }
  const closest = [...pts].sort((a, b) => Math.abs(a.yesPct - 50) - Math.abs(b.yesPct - 50))[0];
  return closest?.strikeUsd ?? null;
}

function yesAtTarget(rows: PredictionMarket[], target: number): number | null {
  let best: { dist: number; yes: number } | null = null;
  for (const r of rows) {
    const s = parseStrikeUsd(r.strike, r.title);
    if (s == null || r.yesPct == null) continue;
    const dist = Math.abs(s - target);
    if (!best || dist < best.dist) best = { dist, yes: r.yesPct };
  }
  return best && best.dist / target <= 0.12 ? best.yes : null;
}

function usdK(n: number | null): string {
  if (n == null || !Number.isFinite(n)) return "n/a";
  if (n >= 1000) return `$${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return `$${n.toFixed(0)}`;
}

function venueBook(rows: PredictionMarket[], venue: PredictionVenue, spot: number | null): PredVenueBook {
  const mine = rows.filter((r) => r.venue === venue);
  const monthly = mine.filter((r) => r.kind === "monthly");
  const other = mine.filter((r) => r.kind === "other");
  const ath = mine.filter((r) => r.kind === "ath");
  const implied = impliedMonthly(monthly);
  const plus5 = spot != null && spot > 0 ? yesAtTarget(monthly.length ? monthly : mine, spot * 1.05) : null;
  const daily = spot != null && spot > 0 ? yesAtTarget(other.length ? other : mine, spot) : null;
  const athYes = volWtdYes(ath);
  const bullets: string[] = [];
  if (implied != null) bullets.push(`Implied monthly high ${usdK(implied)} (50% strike).`);
  if (plus5 != null) bullets.push(`Yes at ~spot+5% ${plus5.toFixed(1)}%.`);
  if (daily != null) bullets.push(`Near-spot daily Yes ${daily.toFixed(1)}%.`);
  if (athYes != null) bullets.push(`ATH / year-high Yes ${athYes.toFixed(1)}% (volume-weighted).`);
  const top = [...mine].sort((a, b) => (b.volumeUsd ?? 0) - (a.volumeUsd ?? 0)).slice(0, 3);
  for (const r of top) {
    bullets.push(`${r.strike ?? r.title} · Yes ${r.yesPct ?? "—"}%.`);
  }
  if (!mine.length) bullets.push("No live contracts this cycle.");
  const headline = !mine.length
    ? `${venue} quiet — no BTC contracts this pull.`
    : implied != null
      ? `${venue} prices a ${usdK(implied)} monthly high` + (plus5 != null ? ` · +5% Yes ${plus5.toFixed(0)}%` : "") + "."
      : `${venue} ${mine.length} BTC contract(s) · ATH Yes ${athYes != null ? `${athYes.toFixed(0)}%` : "n/a"}.`;
  return {
    venue,
    n: mine.length,
    impliedMonthly: implied,
    monthlyYesPlus5: plus5,
    dailyYesNearSpot: daily,
    athYes,
    headline,
    bullets: bullets.slice(0, 6),
  };
}

export function predAnalyst(rows: PredictionMarket[] | undefined, spot: number | null): PredAnalyst {
  const list = rows ?? [];
  const polymarket = venueBook(list, "Polymarket", spot);
  const kalshi = venueBook(list, "Kalshi", spot);
  const plus5 = [polymarket.monthlyYesPlus5, kalshi.monthlyYesPlus5].filter((n): n is number => n != null);
  const daily = [polymarket.dailyYesNearSpot, kalshi.dailyYesNearSpot].filter((n): n is number => n != null);
  const ath = [polymarket.athYes, kalshi.athYes].filter((n): n is number => n != null);
  const avgPlus5 = plus5.length ? plus5.reduce((s, n) => s + n, 0) / plus5.length : null;
  const avgDaily = daily.length ? daily.reduce((s, n) => s + n, 0) / daily.length : null;
  const avgAth = ath.length ? ath.reduce((s, n) => s + n, 0) / ath.length : null;
  const fomo = (avgDaily != null && avgDaily >= 70) || (avgPlus5 != null && avgPlus5 >= 75);
  const discount =
    !fomo &&
    ((avgPlus5 != null && avgPlus5 <= 35) ||
      (avgDaily != null && avgDaily <= 28) ||
      (avgAth != null && avgAth <= 18 && (avgPlus5 == null || avgPlus5 <= 45)));
  const stance: PredAnalyst["stance"] = fomo ? "WAIT" : discount ? "ACCUMULATE" : "HOLD";
  const overlayPass = !fomo;
  const checkLabel = fomo
    ? "Prediction markets not crowded (near-term Yes FOMO)"
    : "Prediction markets not crowded (near-term Yes)";
  const summary = !list.length
    ? "7-B0T pred sub-analyst: no Polymarket/Kalshi tape this cycle — HOLD overlay, do not invent a buy."
    : fomo
      ? `7-B0T pred sub-analyst WAIT: crowd is long BTC into highs (near-spot Yes ${avgDaily != null ? `${avgDaily.toFixed(0)}%` : "n/a"}, +5% Yes ${avgPlus5 != null ? `${avgPlus5.toFixed(0)}%` : "n/a"}). Do not chase. Never sell.`
      : discount
        ? `7-B0T pred sub-analyst ACCUMULATE overlay: crowd is cheap on the path ( +5% Yes ${avgPlus5 != null ? `${avgPlus5.toFixed(0)}%` : "n/a"}, daily ${avgDaily != null ? `${avgDaily.toFixed(0)}%` : "n/a"}, ATH ${avgAth != null ? `${avgAth.toFixed(0)}%` : "n/a"}). Overlay only — still needs two orthogonal lanes. Never sell.`
        : `7-B0T pred sub-analyst HOLD: no strong fear or FOMO ( +5% Yes ${avgPlus5 != null ? `${avgPlus5.toFixed(0)}%` : "n/a"}, daily ${avgDaily != null ? `${avgDaily.toFixed(0)}%` : "n/a"}). Labels, not a 1–6 vote. Never sell.`;
  return { stance, summary, discount, fomo, overlayPass, checkLabel, polymarket, kalshi };
}
