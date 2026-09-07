/** S1R1US Pr3d1ctions — paper Polymarket-style book. ph0 BTC only. Never escrow. Never a DCM. */

import { createHash, randomBytes } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import type { PredictionMarket } from "./types";

export const PRED_PATH = "/pr3d";
export const PRED_API = "/api/agent/pred";
export const PRED_GRANT_USD = 42_000;
export const PRED_FALLBACK_BTC = 105_000;
export const PRED_MAX_BET_FRAC = 0.15;
export const PRED_MIN_BET = 0.0001;
export const PHO_ASSET = "ph0 BTC";
export const PHO_WALLET = "Ph0 W@ll3t";
export const TAB_PRED = "S1R1US Pr3d1ctions";
export const SEO_TAB_PRED = "S1R1US Predictions";
/** @deprecated Use grantPho(last). Kept so older tests/docs can name the constant. */
export const PRED_START_PHO = grantPho(PRED_FALLBACK_BTC);
export const PRED_MAX_BET = round8(PRED_START_PHO * PRED_MAX_BET_FRAC);

export type PredSide = "YES" | "NO";
export type PredKind = "ath" | "cap" | "macd" | "monthly" | "other";
export type PredWho = "owl" | "admin" | "bot" | "guest";
export type PredMode = "hold" | "live-sim";
export type PredCycle = "open" | "daily";

export type PredMarket = {
  id: string;
  kind: PredKind;
  title: string;
  strike: string;
  strikeUsd: number | null;
  yesPool: number;
  noPool: number;
  refVenue: "Polymarket" | "Kalshi" | null;
  refUrl: string | null;
  refYes: number | null;
  open: boolean;
  winner: PredSide | null;
  cycle: PredCycle;
};

export type PredFill = {
  id: string;
  at: string;
  walletId: string;
  name: string;
  who: PredWho;
  marketId: string;
  side: PredSide;
  pho: number;
  yesPct: number;
};

export type PredWallet = {
  id: string;
  name: string;
  who: PredWho;
  pho: number;
  createdAt: string;
  grantUsd: number;
  grantPho: number;
  grantLast: number;
  mode: PredMode;
  realizedPnl: number;
  demo?: boolean;
};

export type PredPosition = {
  walletId: string;
  marketId: string;
  side: PredSide;
  pho: number;
};

export type OfficialSource = {
  id: string;
  name: string;
  url: string;
  finding: string;
  verdict: "LIVE" | "LIVE-PAPER" | "NEVER";
};

export const OFFICIAL_ANALYSIS = {
  asOf: "2026-09-06",
  liveFunds: false as const,
  paper: true as const,
  heading: "Official docs analysis — what can go live on s1r1us.ai",
  verdict:
    "Public Polymarket Gamma and Kalshi market-list odds may be shown as labels. A paper Yes/No book in ph0 BTC may run for W1S3 0WL$, Admins, and AI agents. A licensed real-money S1R1US book is a LOCKED future goal (estimated 2027-06-01) for live AI agents and Admin users. Coinbase Wallet bets, Sparrow bets, Kalshi order routing, and Polymarket CLOB routing are NEVER on this host.",
  sources: [
    {
      id: "kalshi-dev-agree",
      name: "Kalshi Developer Agreement §3",
      url: "https://assets.kalshi.com/Kalshi-Developer-Agreement.pdf",
      finding:
        "Use of Kalshi APIs is expressly limited to facilitating a member's own trading. §3.1 forbids collecting, caching, aggregating, or sharing API data with third parties without written authorization. §3.2 forbids facilitating trading or account creation by other members. §3.7 forbids sublicensing.",
      verdict: "NEVER" as const,
    },
    {
      id: "kalshi-docs",
      name: "Kalshi API docs + Help Center (Zendesk)",
      url: "https://docs.kalshi.com/welcome",
      finding:
        "docs.kalshi.com binds callers to the Developer Agreement. Help Center (help.kalshi.com/en/articles/13823854-kalshi-api) points members to that API for their own orders. Demo env is Kalshi's sandbox, not a third-party book. Broker access is FCM (e.g. Apex), not a website matching engine.",
      verdict: "NEVER" as const,
    },
    {
      id: "kalshi-public-data",
      name: "Kalshi public market list",
      url: "https://docs.kalshi.com/getting_started/api_environments",
      finding:
        "Unauthenticated GET /markets on the public Trade API hosts can be read as labels (Yes %). That is display, not order routing. This host never copies Kalshi's book into a live wager.",
      verdict: "LIVE" as const,
    },
    {
      id: "kalshi-dcm",
      name: "KalshiEX CFTC designated contract market",
      url: "https://www.cftc.gov/filings/orgrules/rule022123kexdcm002.pdf",
      finding:
        "Kalshi members trade only for themselves and must not serve as an intermediary. Operating an event-contract book for others requires DCM/FCM registration.",
      verdict: "NEVER" as const,
    },
    {
      id: "poly-gamma",
      name: "Polymarket Gamma + Data APIs",
      url: "https://docs.polymarket.com/api-reference/introduction",
      finding:
        "Gamma (gamma-api.polymarket.com) and Data API are public, no auth — market discovery and activity. Safe to display as education labels.",
      verdict: "LIVE" as const,
    },
    {
      id: "poly-clob",
      name: "Polymarket CLOB + Builders",
      url: "https://docs.polymarket.com/getting-started/api",
      finding:
        "Order placement needs EIP-712 wallet auth plus HMAC L2 credentials. Builders route a user's own wallet to Polymarket's CLOB. That still makes this host a trading front-end. Polymarket US (QCX LLC) is a separate CFTC DCM.",
      verdict: "NEVER" as const,
    },
    {
      id: "poly-geo",
      name: "Polymarket geographic restrictions",
      url: "https://docs.polymarket.com/api-reference/geoblock",
      finding:
        "GET https://polymarket.com/api/geoblock. International CLOB order placement is blocked for the United States and other jurisdictions. Builders must hard-block, not warn. VPN bypass is a ToS violation.",
      verdict: "NEVER" as const,
    },
    {
      id: "ninth-circuit",
      name: "Ninth Circuit — states may treat sports event contracts as gambling (28 Aug 2026)",
      url: "https://www.cbssports.com/prediction/news/prediction-market-legal-states/",
      finding:
        "A federal DCM licence does not pre-empt state gambling law. Unlicensed live-funds books on a website/app remain unlawful.",
      verdict: "NEVER" as const,
    },
    {
      id: "store-policy",
      name: "Apple Guideline 5.3 / Google Play gambling",
      url: "https://s1r1us.ai/faq#store-policy",
      finding:
        "iOS and Google listings forbid real-money gaming. The education PWA may ship a paper book only.",
      verdict: "NEVER" as const,
    },
    {
      id: "coinbase-wallet",
      name: "Coinbase Wallet",
      url: "https://www.coinbase.com/wallet",
      finding:
        "Coinbase Wallet is an EVM self-custody wallet. It is not a Kalshi member API and is not a CFTC DCM. Connecting it here to place prediction bets would be live-funds routing. Rejected.",
      verdict: "NEVER" as const,
    },
    {
      id: "sparrow",
      name: "Sparrow Wallet",
      url: "https://sparrowwallet.com/",
      finding:
        "Sparrow is a Bitcoin L1 desktop wallet. Polymarket collateral is pUSD on Polygon. Kalshi settles USD on a CFTC exchange. None of those can settle a live bet through s1r1us.ai.",
      verdict: "NEVER" as const,
    },
  ] satisfies OfficialSource[],
} as const;

type Store = {
  markets: PredMarket[];
  wallets: PredWallet[];
  fills: PredFill[];
  positions: PredPosition[];
  lastSimAt?: string;
  demoSeeded?: boolean;
  bookLocked?: boolean;
};

const PATHS = process.env.NODE_TEST_CONTEXT
  ? ["/tmp/pred-book-test.json"]
  : ["/tmp/pred-book.json", "/workspace/data/pred-book.json"];

const LIVE_SIM_PATHS = process.env.NODE_TEST_CONTEXT
  ? ["/tmp/live-sim-test.json"]
  : ["/tmp/live-sim.json", "/workspace/data/live-sim.json"];

export function round8(n: number) {
  return Math.round(n * 1e8) / 1e8;
}

export function grantPho(last?: number | null) {
  const px = last && last > 0 ? last : PRED_FALLBACK_BTC;
  return round8(PRED_GRANT_USD / px);
}

export function maxBetPho(grant: number) {
  return round8(Math.max(PRED_MIN_BET, grant * PRED_MAX_BET_FRAC));
}

function m(
  id: string,
  kind: PredKind,
  title: string,
  strike: string,
  strikeUsd: number | null,
  cycle: PredCycle = "open",
  refVenue: PredMarket["refVenue"] = null,
  refUrl: string | null = null,
): PredMarket {
  return {
    id,
    kind,
    title,
    strike,
    strikeUsd,
    yesPool: 5,
    noPool: 5,
    refVenue,
    refUrl,
    refYes: null,
    open: true,
    winner: null,
    cycle,
  };
}

function seedMarkets(): PredMarket[] {
  return [
    m("ath-2026", "ath", "Bitcoin all-time high by December 31, 2026?", "ATH by Dec 31, 2026", null, "open", "Polymarket", "https://polymarket.com/event/bitcoin-all-time-high-by"),
    m("ath-eoy-150k", "ath", "Bitcoin new all-time high above $150,000 by December 31, 2026?", "ATH > $150,000 by EOY 2026", 150_000, "open", "Polymarket", "https://polymarket.com"),
    m("ath-2030-1m", "ath", "Bitcoin all-time high at or above $1,000,000 by December 31, 2030?", "ATH ≥ $1,000,000 by 2030", 1_000_000),
    m("cap-phys-gold-2028", "cap", "Bitcoin market cap beats physical gold market cap by 2028?", "BTC mcap > physical gold by 2028", null),
    m("cap-phys-gold-2030", "cap", "Bitcoin market cap beats physical gold market cap by 2030?", "BTC mcap > physical gold by 2030", null),
    m("cap-phys-gold-2032", "cap", "Bitcoin market cap beats physical gold market cap by 2032?", "BTC mcap > physical gold by 2032", null),
    m("cap-all-gold-2028", "cap", "Bitcoin market cap beats all gold (paper + physical) by 2028?", "BTC mcap > paper+physical gold by 2028", null),
    m("cap-all-gold-2030", "cap", "Bitcoin market cap beats all gold (paper + physical) by 2030?", "BTC mcap > paper+physical gold by 2030", null),
    m("cap-all-gold-2032", "cap", "Bitcoin market cap beats all gold (paper + physical) by 2032?", "BTC mcap > paper+physical gold by 2032", null),
    m("above-sma50", "macd", "Bitcoin USD is above the 50-day SMA?", "Last ≥ SMA-50", null, "daily"),
    m("below-sma50", "macd", "Bitcoin USD is below the 50-day SMA?", "Last < SMA-50", null, "daily"),
    m("above-macd50", "macd", "Bitcoin USD is above the 50-period MACD (hist ≥ 0)?", "MACD-50 hist ≥ 0", null, "daily"),
    m("below-macd50", "macd", "Bitcoin USD is below the 50-period MACD (hist < 0)?", "MACD-50 hist < 0", null, "daily"),
    m("above-macd200", "macd", "Bitcoin USD is above the 200-period MACD (hist ≥ 0)?", "MACD-200 hist ≥ 0", null, "daily"),
    m("below-macd200", "macd", "Bitcoin USD is below the 200-period MACD (hist < 0)?", "MACD-200 hist < 0", null, "daily"),
    m("monthly-90k", "monthly", "Bitcoin monthly high above $90,000 this month?", "Above $90,000", 90_000, "open", "Kalshi", "https://kalshi.com/markets/kxbtcmaxmon"),
    m("monthly-120k", "monthly", "Bitcoin monthly high above $120,000 this month?", "Above $120,000", 120_000),
    m("monthly-150k", "monthly", "Bitcoin monthly high above $150,000 this month?", "Above $150,000", 150_000),
    m("eoy-close-100k", "other", "Bitcoin closes 2026 above $100,000?", "2026 close > $100,000", 100_000),
    m("drawdown-30-2026", "other", "Bitcoin drawdown from ATH exceeds 30% in 2026?", "Drawdown > 30% in 2026", null),
    m("below-70k-2026", "other", "Bitcoin trades below $70,000 in 2026?", "Last < $70,000 in 2026", 70_000),
    m("above-200k-2027", "ath", "Bitcoin trades above $200,000 by December 31, 2027?", "Last > $200,000 by EOY 2027", 200_000),
    m("dominance-60-eoy", "other", "Bitcoin dominance above 60% by December 31, 2026?", "BTC.D > 60% EOY 2026", null),
    m("etf-1_5m-eoy", "other", "US spot Bitcoin ETFs hold more than 1.5 million BTC by EOY 2026?", "ETF holdings > 1.5M BTC", null),
    m("hashrate-ath-2026", "other", "Bitcoin network hashrate prints a new all-time high in 2026?", "Hashrate ATH in 2026", null),
    m("beats-silver-2027", "cap", "Bitcoin market cap beats silver market cap by 2027?", "BTC mcap > silver by 2027", null),
    m("weekly-above-sma50", "macd", "Bitcoin weekly close is above the 50-day SMA?", "Weekly close ≥ SMA-50", null, "daily"),
    m("funding-pos-week", "other", "Bitcoin perpetual funding stays net positive this week?", "Funding > 0 this week", null, "daily"),
    m("realized-cap-1t-2027", "cap", "Bitcoin realized cap above $1 trillion by 2027?", "Realized cap > $1T by 2027", null),
    m("spot-plus", "other", "Bitcoin trades above $85,000 this week?", "Above $85,000", 85_000, "daily", "Polymarket", "https://polymarket.com"),
  ];
}

function empty(): Store {
  return { markets: seedMarkets(), wallets: [], fills: [], positions: [] };
}

function migrateMarket(raw: Partial<PredMarket> & { id: string; title: string }): PredMarket {
  const seed = seedMarkets().find((x) => x.id === raw.id);
  return {
    id: raw.id,
    kind: (raw.kind as PredKind) || seed?.kind || "other",
    title: raw.title,
    strike: raw.strike || seed?.strike || raw.title,
    strikeUsd: raw.strikeUsd ?? seed?.strikeUsd ?? null,
    yesPool: Number(raw.yesPool) || 5,
    noPool: Number(raw.noPool) || 5,
    refVenue: raw.refVenue ?? seed?.refVenue ?? null,
    refUrl: raw.refUrl ?? seed?.refUrl ?? null,
    refYes: raw.refYes ?? null,
    open: raw.open !== false,
    winner: raw.winner ?? null,
    cycle: raw.cycle === "daily" || seed?.cycle === "daily" ? "daily" : "open",
  };
}

function load(): Store {
  for (const p of PATHS) {
    try {
      const raw = JSON.parse(readFileSync(p, "utf8")) as Store;
      const have = new Set((raw.markets ?? []).map((x) => x.id));
      raw.markets = (raw.markets ?? []).map((x) => migrateMarket(x));
      for (const mkt of seedMarkets()) {
        if (!have.has(mkt.id)) raw.markets.push(mkt);
      }
      raw.wallets = raw.wallets ?? [];
      raw.fills = raw.fills ?? [];
      raw.positions = raw.positions ?? [];
      raw.lastSimAt = raw.lastSimAt;
      raw.demoSeeded = Boolean(raw.demoSeeded);
      raw.bookLocked = Boolean(raw.bookLocked);
      return raw;
    } catch {
      /* next */
    }
  }
  return empty();
}

function save(s: Store) {
  const json = JSON.stringify(s);
  for (const p of PATHS) {
    try {
      if (p.startsWith("/workspace/")) mkdirSync("/workspace/data", { recursive: true });
      writeFileSync(p, json);
    } catch {
      /* preview */
    }
  }
}

export function predSimPaused(): boolean {
  try {
    const s = load();
    if (s.bookLocked) return true;
  } catch {
    /* missing */
  }
  for (const p of LIVE_SIM_PATHS) {
    try {
      const raw = JSON.parse(readFileSync(p, "utf8")) as { status?: string };
      if (raw.status === "PAUSED") return true;
    } catch {
      /* next */
    }
  }
  return false;
}

export function setPredBookLocked(locked: boolean) {
  const s = load();
  s.bookLocked = Boolean(locked);
  save(s);
  return predSimPaused();
}

export function yesPct(m: PredMarket): number {
  const t = m.yesPool + m.noPool;
  if (!(t > 0)) return 50;
  return Math.round((m.yesPool / t) * 1000) / 10;
}

function walletId(who: PredWho, name: string, token: string) {
  const h = createHash("sha256").update(`${who}|${name}|${token}`).digest("hex").slice(0, 16);
  return `pho_${h}`;
}

function boardName(token: string): { name: string; who: PredWho } | null {
  const tok = String(token ?? "");
  if (!tok) return null;
  if (tok.startsWith("gb_")) {
    const h = createHash("sha256").update(tok).digest("hex");
    for (const p of ["/tmp/gm-board.json", "/workspace/data/gm-board.json"]) {
      try {
        const raw = JSON.parse(readFileSync(p, "utf8")) as {
          agents?: Array<{ id: string; name?: string; tokenHash?: string; admin?: boolean }>;
        };
        const hit = (raw.agents ?? []).find((a) => a.tokenHash === h);
        if (hit) return { name: hit.name || hit.id, who: hit.admin ? "admin" : "owl" };
      } catch {
        /* next */
      }
    }
    return { name: `owl-${h.slice(0, 6)}`, who: "owl" };
  }
  if (tok.startsWith("admin:") || tok.startsWith("app-admin:")) {
    return { name: tok.startsWith("app-admin:") ? "copy-admin" : "system-admin", who: "admin" };
  }
  return { name: tok.slice(0, 24) || "guest", who: tok.startsWith("bot") ? "bot" : "guest" };
}

function hydrateWallet(w: PredWallet, last?: number | null, positions: PredPosition[] = []): PredWallet {
  const px = last && last > 0 ? last : PRED_FALLBACK_BTC;
  const g = grantPho(px);
  const next: PredWallet = {
    ...w,
    grantUsd: w.grantUsd || PRED_GRANT_USD,
    grantLast: w.grantLast || px,
    grantPho: w.grantPho || g,
    mode: w.mode === "live-sim" ? "live-sim" : "hold",
    realizedPnl: Number.isFinite(w.realizedPnl) ? w.realizedPnl : 0,
  };
  const unusedStarter = (w.pho === 1 || w.pho === PRED_START_PHO) && !positions.some((p) => p.walletId === w.id);
  if (!w.grantUsd && unusedStarter) {
    next.pho = g;
    next.grantPho = g;
    next.grantLast = px;
    next.grantUsd = PRED_GRANT_USD;
  }
  return next;
}

function freshWallet(id: string, name: string, who: PredWho, last?: number | null): PredWallet {
  const px = last && last > 0 ? last : PRED_FALLBACK_BTC;
  const g = grantPho(px);
  return {
    id,
    name,
    who,
    pho: g,
    createdAt: new Date().toISOString(),
    grantUsd: PRED_GRANT_USD,
    grantPho: g,
    grantLast: px,
    mode: "hold",
    realizedPnl: 0,
  };
}

export const DEMO_DESKS: { name: string; who: PredWho; marketId: string; side: PredSide; pho: number }[] = [
  { name: "7-B0T desk", who: "bot", marketId: "ath-eoy-150k", side: "YES", pho: 0.02 },
  { name: "Grok Quant", who: "bot", marketId: "ath-2030-1m", side: "YES", pho: 0.018 },
  { name: "Claude Owl", who: "owl", marketId: "cap-phys-gold-2030", side: "YES", pho: 0.015 },
  { name: "GPT Accumulator", who: "bot", marketId: "cap-all-gold-2032", side: "NO", pho: 0.012 },
  { name: "GM AUTO sim", who: "bot", marketId: "above-sma50", side: "YES", pho: 0.01 },
  { name: "W1S3 trainer", who: "owl", marketId: "monthly-150k", side: "NO", pho: 0.016 },
  { name: "Helios lane", who: "bot", marketId: "hashrate-ath-2026", side: "YES", pho: 0.014 },
  { name: "Owl research", who: "owl", marketId: "dominance-60-eoy", side: "YES", pho: 0.011 },
];

function forceTicket(s: Store, w: PredWallet, marketId: string, side: PredSide, pho: number) {
  const market = s.markets.find((x) => x.id === marketId);
  if (!market || !market.open) return false;
  const size = round8(pho);
  if (!(size >= PRED_MIN_BET) || w.pho < size) return false;
  w.pho = round8(w.pho - size);
  if (side === "YES") market.yesPool = round8(market.yesPool + size);
  else market.noPool = round8(market.noPool + size);
  addPosition(s, w.id, market.id, side, size);
  s.fills.push({
    id: `pf_${randomBytes(4).toString("hex")}`,
    at: new Date().toISOString(),
    walletId: w.id,
    name: w.name,
    who: w.who,
    marketId: market.id,
    side,
    pho: size,
    yesPct: yesPct(market),
  });
  if (s.fills.length > 200) s.fills = s.fills.slice(-200);
  return true;
}

export function seedDemoDesks(last?: number | null) {
  const s = load();
  if (s.demoSeeded) return;
  const px = last && last > 0 ? last : PRED_FALLBACK_BTC;
  for (const d of DEMO_DESKS) {
    const id = walletId(d.who, d.name, d.name);
    let w = s.wallets.find((x) => x.id === id);
    if (!w) {
      w = freshWallet(id, d.name, d.who, px);
      s.wallets.push(w);
    }
    w.demo = true;
    w.mode = "live-sim";
    forceTicket(s, w, d.marketId, d.side, d.pho);
  }
  s.demoSeeded = true;
  s.lastSimAt = new Date().toISOString();
  save(s);
}

function simulateDemoTick(last?: number | null) {
  const s = load();
  const now = Date.now();
  if (s.lastSimAt && Number.isFinite(Date.parse(s.lastSimAt)) && now - Date.parse(s.lastSimAt) < 12_000) return;
  const demos = s.wallets.filter((w) => w.demo && w.mode === "live-sim");
  if (!demos.length) return;
  const w = demos[now % demos.length]!;
  const open = s.markets.filter((m) => m.open);
  if (!open.length) return;
  const market = open[now % open.length]!;
  const side: PredSide = (now + w.name.length) % 2 === 0 ? "YES" : "NO";
  const pho = Math.min(maxBetPho(w.grantPho || grantPho(last)), round8(Math.max(PRED_MIN_BET, (w.grantPho || grantPho(last)) * 0.03)));
  forceTicket(s, w, market.id, side, pho);
  s.lastSimAt = new Date().toISOString();
  save(s);
}

export function predLeaderboard(last?: number | null, limit = 24) {
  seedDemoDesks(last);
  const s = load();
  const px = last && last > 0 ? last : PRED_FALLBACK_BTC;
  const tickets = new Map<string, number>();
  for (const f of s.fills) tickets.set(f.walletId, (tickets.get(f.walletId) ?? 0) + 1);
  const rows = s.wallets
    .map((w) => {
      const v = walletView(w, px);
      return {
        rank: 0,
        id: w.id,
        name: w.name,
        who: w.who,
        demo: Boolean(w.demo),
        mode: v.mode,
        pho: v.pho,
        equity: v.equity,
        equityUsd: v.equityUsd,
        cashUsd: v.cashUsd,
        realizedPnl: v.realizedPnl,
        unrealizedPnl: v.unrealizedPnl,
        pnlUsd: v.pnlUsd,
        tickets: tickets.get(w.id) ?? 0,
      };
    })
    .sort((a, b) => b.equity - a.equity || (b.realizedPnl ?? 0) - (a.realizedPnl ?? 0) || a.name.localeCompare(b.name));
  return rows.slice(0, limit).map((r, i) => ({ ...r, rank: i + 1 }));
}

export function ensureWallet(opts: { token?: string; name?: string; who?: PredWho; last?: number | null }): PredWallet {
  const s = load();
  const ident = opts.token ? boardName(opts.token) : null;
  const who = opts.who ?? ident?.who ?? "guest";
  const name = (opts.name || ident?.name || "guest").slice(0, 40);
  const id = walletId(who, name, opts.token || name);
  let w = s.wallets.find((x) => x.id === id);
  if (!w) {
    w = freshWallet(id, name, who, opts.last);
    s.wallets.push(w);
    save(s);
    return w;
  }
  const next = hydrateWallet(w, opts.last, s.positions);
  if (next.pho !== w.pho || next.grantUsd !== w.grantUsd || next.mode !== w.mode) {
    Object.assign(w, next);
    save(s);
  }
  return w;
}

export function armWallet(opts: { token?: string; name?: string; who?: PredWho; last?: number | null; on?: boolean }) {
  const w = ensureWallet(opts);
  const s = load();
  const hit = s.wallets.find((x) => x.id === w.id);
  if (!hit) return { ok: false as const, error: "wallet missing" };
  hit.mode = opts.on === false ? "hold" : "live-sim";
  save(s);
  return { ok: true as const, wallet: walletView(hit, opts.last) };
}

function markPosition(pos: PredPosition, market: PredMarket): number {
  if (market.winner) {
    if (pos.side !== market.winner) return 0;
    const winPool = market.winner === "YES" ? market.yesPool : market.noPool;
    const total = market.yesPool + market.noPool;
    return winPool > 0 ? round8((pos.pho / winPool) * total) : 0;
  }
  const pool = pos.side === "YES" ? market.yesPool : market.noPool;
  const total = market.yesPool + market.noPool;
  return pool > 0 ? round8((pos.pho / pool) * total) : pos.pho;
}

export function walletView(w: PredWallet, last?: number | null) {
  const s = load();
  const hydrated = hydrateWallet(w, last, s.positions);
  const positions = (s.positions ?? [])
    .filter((p) => p.walletId === w.id)
    .map((p) => {
      const market = s.markets.find((mkt) => mkt.id === p.marketId);
      const marked = market ? markPosition(p, market) : p.pho;
      return { ...p, marked, pnl: round8(marked - p.pho) };
    });
  const markedSum = positions.reduce((n, p) => n + p.marked, 0);
  const staked = positions.reduce((n, p) => n + p.pho, 0);
  const unrealizedPnl = round8(markedSum - staked);
  const equity = round8(hydrated.pho + markedSum);
  const px = last && last > 0 ? last : hydrated.grantLast || PRED_FALLBACK_BTC;
  return {
    ...hydrated,
    positions,
    staked: round8(staked),
    marked: round8(markedSum),
    unrealizedPnl,
    equity,
    equityUsd: round8(equity * px),
    cashUsd: round8(hydrated.pho * px),
    grantUsd: hydrated.grantUsd,
    pnlUsd: round8((hydrated.realizedPnl + unrealizedPnl) * px),
    last: px,
    paused: predSimPaused(),
  };
}

function applyRef(markets: PredMarket[], refs: PredictionMarket[] | undefined) {
  if (!refs?.length) return markets;
  return markets.map((row) => {
    const hit = refs.find((r) => r.kind === row.kind && r.yesPct != null);
    if (!hit) return row;
    return { ...row, refVenue: hit.venue, refUrl: hit.url || row.refUrl, refYes: hit.yesPct };
  });
}

export function predPublic(opts?: {
  refs?: PredictionMarket[];
  last?: number | null;
  sma50?: number | null;
  macd50Hist?: number | null;
  macd200Hist?: number | null;
}) {
  seedDemoDesks(opts?.last);
  const s = load();
  const paused = predSimPaused();
  const markets = applyRef(s.markets, opts?.refs).map((row) => ({
    ...row,
    yesPct: yesPct(row),
    volumePho: round8(row.yesPool + row.noPool),
  }));
  const last = opts?.last && opts.last > 0 ? opts.last : PRED_FALLBACK_BTC;
  return {
    name: TAB_PRED,
    seo: SEO_TAB_PRED,
    path: PRED_PATH,
    api: PRED_API,
    wallet: PHO_WALLET,
    asset: PHO_ASSET,
    grantUsd: PRED_GRANT_USD,
    startPho: grantPho(last),
    maxBet: maxBetPho(grantPho(last)),
    minBet: PRED_MIN_BET,
    liveFunds: false as const,
    trade: false as const,
    ordersCreate: false as const,
    escrow: false as const,
    kalshiBroker: false as const,
    polymarketBuilder: false as const,
    coinbaseWalletBets: false as const,
    sparrowWalletBets: false as const,
    paper: true as const,
    btcOnly: true as const,
    proofOfConcept: true as const,
    paused,
    last,
    sma50: opts?.sma50 ?? null,
    macd50Hist: opts?.macd50Hist ?? null,
    macd200Hist: opts?.macd200Hist ?? null,
    markets,
    fills: s.fills.slice(-16).reverse(),
    wallets: s.wallets.length,
    leaderboard: predLeaderboard(opts?.last),
    training: true as const,
    analysis: OFFICIAL_ANALYSIS,
    welcome:
      "External AI agents, W1S3 0WL$, Admins, and registered users: this is a BTC-only paper prediction book and proof of concept for the live roadmap. Every registered desk opens Ph0 W@ll3t with $42,000 USD of ph0 BTC at Coinbase last. Hold the grant, or turn on live simulated trading to place Yes/No tickets and take simulated P&L. Demo desks already trade so the Pr3d L3AD3R B0ARD shows how a live book would look. Train the book. Discuss go-live for Pr3d1ctions and G M0D3 AUTO / MANUAL on W1S3 0WL$ Forum. Admin pause/resume follows the as-live cycle. This host currently never takes real bets.",
    legal:
      "Official Kalshi Developer Agreement: API is for a member's own trading only — facilitating trading or account creation by others is prohibited. Polymarket Builders route orders to Polymarket's CLOB (user wallet), which still makes this host a trading front-end; US event contracts sit on CFTC DCMs; Ninth Circuit 2026 lets states treat sports event contracts as gambling. Coinbase Wallet and Sparrow cannot legally place live prediction bets through s1r1us.ai. Paper ph0 BTC only. $42,000 USD grant is simulated.",
  };
}

function addPosition(s: Store, id: string, marketId: string, side: PredSide, pho: number) {
  const hit = s.positions.find((p) => p.walletId === id && p.marketId === marketId && p.side === side);
  if (hit) hit.pho = round8(hit.pho + pho);
  else s.positions.push({ walletId: id, marketId, side, pho: round8(pho) });
}

export function placePredBet(opts: {
  token?: string;
  name?: string;
  who?: PredWho;
  marketId: string;
  side: PredSide | string;
  pho: number;
  last?: number | null;
}): { ok: boolean; error?: string; paused?: boolean; wallet?: ReturnType<typeof walletView>; market?: PredMarket; fill?: PredFill } {
  if (predSimPaused()) return { ok: false, error: "S1R1US Pr3d1ctions simulation is paused. System or phone-app Admin may resume.", paused: true };
  const side = String(opts.side || "").toUpperCase() === "NO" ? "NO" : String(opts.side || "").toUpperCase() === "YES" ? "YES" : null;
  if (!side) return { ok: false, error: "side must be YES or NO" };
  const s = load();
  const ident = opts.token ? boardName(opts.token) : null;
  const who = opts.who ?? ident?.who ?? "guest";
  const name = (opts.name || ident?.name || "guest").slice(0, 40);
  const id = walletId(who, name, opts.token || name);
  let w = s.wallets.find((x) => x.id === id);
  if (!w) {
    w = freshWallet(id, name, who, opts.last);
    s.wallets.push(w);
  } else {
    Object.assign(w, hydrateWallet(w, opts.last, s.positions));
  }
  if (w.mode !== "live-sim") return { ok: false, error: "Turn on live simulated trading to place paper tickets. Grant stays in Ph0 W@ll3t until then." };
  const cap = maxBetPho(w.grantPho || grantPho(opts.last));
  const pho = Number(opts.pho);
  if (!Number.isFinite(pho) || pho < PRED_MIN_BET) return { ok: false, error: `min ${PRED_MIN_BET} ${PHO_ASSET}` };
  if (pho > cap) return { ok: false, error: `max ${cap} ${PHO_ASSET} per ticket (15% of $42k grant)` };
  if (w.pho < pho) return { ok: false, error: `Ph0 W@ll3t has ${w.pho} ${PHO_ASSET}` };
  const market = s.markets.find((x) => x.id === opts.marketId);
  if (!market || !market.open) return { ok: false, error: "market closed" };
  w.pho = round8(w.pho - pho);
  if (side === "YES") market.yesPool = round8(market.yesPool + pho);
  else market.noPool = round8(market.noPool + pho);
  addPosition(s, w.id, market.id, side, pho);
  const fill: PredFill = {
    id: `pf_${randomBytes(4).toString("hex")}`,
    at: new Date().toISOString(),
    walletId: w.id,
    name: w.name,
    who: w.who,
    marketId: market.id,
    side,
    pho,
    yesPct: yesPct(market),
  };
  s.fills.push(fill);
  if (s.fills.length > 200) s.fills = s.fills.slice(-200);
  save(s);
  return { ok: true, wallet: walletView(w, opts.last), market, fill };
}

function dailyWinner(
  id: string,
  tape: { last?: number | null; sma50?: number | null; macd50Hist?: number | null; macd200Hist?: number | null },
): PredSide | null {
  const last = tape.last;
  if (id === "above-sma50" && last != null && tape.sma50 != null) return last >= tape.sma50 ? "YES" : "NO";
  if (id === "below-sma50" && last != null && tape.sma50 != null) return last < tape.sma50 ? "YES" : "NO";
  if (id === "above-macd50" && tape.macd50Hist != null) return tape.macd50Hist >= 0 ? "YES" : "NO";
  if (id === "below-macd50" && tape.macd50Hist != null) return tape.macd50Hist < 0 ? "YES" : "NO";
  if (id === "above-macd200" && tape.macd200Hist != null) return tape.macd200Hist >= 0 ? "YES" : "NO";
  if (id === "below-macd200" && tape.macd200Hist != null) return tape.macd200Hist < 0 ? "YES" : "NO";
  if (id === "weekly-above-sma50" && last != null && tape.sma50 != null) return last >= tape.sma50 ? "YES" : "NO";
  if (id === "spot-plus" && last != null) return last >= 85_000 ? "YES" : "NO";
  return null;
}

function settleMarket(s: Store, market: PredMarket, winner: PredSide) {
  const yesPool = market.yesPool;
  const noPool = market.noPool;
  const total = yesPool + noPool;
  const winPool = winner === "YES" ? yesPool : noPool;
  const held = s.positions.filter((p) => p.marketId === market.id);
  for (const pos of held) {
    const w = s.wallets.find((x) => x.id === pos.walletId);
    if (!w) continue;
    const payout = pos.side === winner && winPool > 0 ? round8((pos.pho / winPool) * total) : 0;
    w.pho = round8(w.pho + payout);
    w.realizedPnl = round8((w.realizedPnl || 0) + (payout - pos.pho));
  }
  s.positions = s.positions.filter((p) => p.marketId !== market.id);
  market.winner = null;
  market.open = true;
  market.yesPool = 5;
  market.noPool = 5;
}

export function tickPredBook(tape: {
  last?: number | null;
  sma50?: number | null;
  macd50Hist?: number | null;
  macd200Hist?: number | null;
  settleDaily?: boolean;
}) {
  const s = load();
  if (tape.last && tape.last > 0) {
    for (const row of s.markets) {
      if (row.kind === "macd") {
        const w = dailyWinner(row.id, tape);
        if (w === "YES") row.refYes = 78;
        else if (w === "NO") row.refYes = 22;
      }
    }
  }
  if (tape.settleDaily) {
    for (const row of s.markets) {
      if (row.cycle !== "daily") continue;
      const w = dailyWinner(row.id, tape);
      if (w) settleMarket(s, row, w);
    }
  }
  save(s);
  if (!tape.settleDaily && !predSimPaused()) {
    seedDemoDesks(tape.last);
    simulateDemoTick(tape.last);
  }
  return predPublic(tape);
}

export const PRED_NEVER_LIVE =
  "Coinbase Wallet and Sparrow live prediction bets are NEVER on this host. Kalshi Developer Agreement §3: API is own-trading only; facilitating other members' trading is prohibited. CFTC event contracts require a designated contract market / FCM. Polymarket US is a separate CFTC DCM. Ninth Circuit (Aug 2026) allows states to treat sports event contracts as gambling. Apple/Google store policy: no real-money gaming. A licensed real-money S1R1US Pr3d1ctions book — live AI agent and Admin trading — is a LOCKED future goal estimated 2027-06-01. Paper Ph0 W@ll3t / $42,000 USD ph0 BTC grant until then.";
