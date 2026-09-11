import { atrLast, bbPercentB, candlesToClosesOldestFirst, depthHeatmap, emaLast, liqHeatmap, macdLast, mergeHourly, rsiMean, rsiWilder, smaLast, volumeAvg24h, volumeRatio } from "./indicators";
import { BTC_REGIONS, GOLD_BANKS, GOLD_REGIONS } from "./gold-sovereign";
import { buildSlowCapital } from "./slow-capital";
import { scoreFeeds } from "./feed-audit";
import { recordDeskFails } from "./error-log";
import { FILING_CIKS, GOLD_TICKERS, MACRO_QUOTES, MAG7_TICKERS, PROXY_QUOTES, SILVER_TICKERS } from "./proxy-book";
import { DESK_POLL_MS } from "./poll";
import { guardedFetch } from "./net-guard";
import { isTapeFrozen, readLastGood, writeLastGood } from "./tape-persist";
import { fetchPredictionMarkets } from "./prediction-markets";
import type { AsiaTape, AsiaVenue, BtcHolder, Candle, CapitalTape, DatHolding, DeskSnapshot, EmRegion, EmTape, EmVenue, Filing, Flow, GoldBtcPoint, GoldBtcTape, Headline, HoldersTape, LeverageVenue, MacroTape, MetalHolding, Quote, RateSeries, StableYield, StrategyProduct, StrategyTape, WhalePrint } from "./types";

const UA =
  "S1R1US-Lab/1.0 (bitcoin accumulator research; admin@s1rius.local)";

const TEXT_TTL_MS = 40_000;
const SNAP_FRESH_MS = DESK_POLL_MS;
const CORE_MS = 1_800;
const MAX_INFLIGHT = 12;
const textCache = new Map<string, { at: number; ttl: number; value?: string; pending?: Promise<string> }>();
let snapCache: { at: number; pendingAt?: number; value?: DeskSnapshot; pending?: Promise<DeskSnapshot> } | null = null;
let inflight = 0;
const waitQ: Array<() => void> = [];
let slotStuckAt = 0;
const deadUntil = new Map<string, number>();
let cycleStats = { ok: 0, fail: 0, bytes: 0, skipped: 0, fails: [] as string[] };

function resetCycleStats() {
  cycleStats = { ok: 0, fail: 0, bytes: 0, skipped: 0, fails: [] };
}

function hostOf(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function markDead(url: string, ms = 180_000) {
  deadUntil.set(hostOf(url), Date.now() + ms);
}

function isDead(url: string) {
  const until = deadUntil.get(hostOf(url));
  return until != null && until > Date.now();
}

function maxBytesFor(url: string) {
  if (/gamma-api\.polymarket|elections\.kalshi/.test(url)) return 280_000;
  if (/yields\.llama\.fi\/pools/.test(url)) return 12_500_000;
  if (/coingecko\.com\/api\/v3\/derivatives/.test(url)) return 280_000;
  if (/book\?level=2|product_book/.test(url)) return 80_000;
  if (/bitbo\.io|coingecko\.com\/en\/treasuries/.test(url)) return 520_000;
  if (/stlouisfed|fredgraph|sec\.gov\/Archives/.test(url)) return 120_000;
  return 160_000;
}

function ttlFor(url: string) {
  if (/polymarket\.com|kalshi\.com/.test(url)) return 60_000;
  if (/stlouisfed\.org|fred|bitbo\.io|treasury\.gov|imf\.org|worldgold|bls\.gov/.test(url)) return 180_000;
  if (/llama\.fi/.test(url)) return 300_000;
  if (/coinbase\.com|okx\.com|upbit|bithumb|hashkey|htx|bybit|hyperliquid|bitfinex|alternative\.me|blockstream|blockchain\.info/.test(url))
    return 12_000;
  return TEXT_TTL_MS;
}

function pruneTextCache() {
  const now = Date.now();
  for (const [k, v] of textCache) {
    if (now - v.at > v.ttl * 4) textCache.delete(k);
  }
}

function sleepMs(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function resetSlots() {
  inflight = 0;
  waitQ.length = 0;
  slotStuckAt = 0;
}

function acquireSlot(ms = 1_200): Promise<boolean> {
  if (inflight >= MAX_INFLIGHT) {
    if (!slotStuckAt) slotStuckAt = Date.now();
    else if (Date.now() - slotStuckAt > 3_000) resetSlots();
  } else {
    slotStuckAt = 0;
  }
  if (inflight < MAX_INFLIGHT) {
    inflight += 1;
    return Promise.resolve(true);
  }
  return new Promise((resolve) => {
    const go = () => {
      clearTimeout(timer);
      inflight += 1;
      resolve(true);
    };
    const timer = setTimeout(() => {
      const i = waitQ.indexOf(go);
      if (i >= 0) waitQ.splice(i, 1);
      resolve(false);
    }, ms);
    waitQ.push(go);
  });
}

function releaseSlot() {
  inflight = Math.max(0, inflight - 1);
  const next = waitQ.shift();
  if (next) next();
}

async function readCapped(res: Response, max: number): Promise<string> {
  if (!res.body) {
    const t = await res.text();
    return t.length > max ? t.slice(0, max) : t;
  }
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let out = "";
  let n = 0;
  try {
    while (n < max) {
      const { done, value } = await reader.read();
      if (done) break;
      n += value.byteLength;
      out += dec.decode(value, { stream: true });
    }
  } finally {
    try {
      await reader.cancel();
    } catch {
      /* already closed */
    }
  }
  return out;
}

async function getText(url: string, ms = 2500, extra: HeadersInit = {}): Promise<string> {
  pruneTextCache();
  if (isDead(url)) {
    cycleStats.skipped += 1;
    const hit = textCache.get(url);
    if (hit?.value) return hit.value;
    throw new Error(`dead host ${hostOf(url)}`);
  }
  const ttl = ttlFor(url);
  const key = url;
  const hit = textCache.get(key);
  const age = hit ? Date.now() - hit.at : Infinity;
  if (hit?.value && age < ttl) return hit.value;
  if (hit?.pending) {
    return Promise.race([
      hit.pending,
      sleepMs(ms).then(() => {
        const cur = textCache.get(key);
        if (cur?.value) return cur.value;
        throw new Error(`timeout ${hostOf(url)}`);
      }),
    ]);
  }
  const pending = (async () => {
    let held = false;
    try {
      const got = await acquireSlot(Math.min(ms, 1_400));
      if (!got) throw new Error(`slot timeout ${hostOf(url)}`);
      held = true;
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), ms);
      try {
        const res = await Promise.race([
          guardedFetch(url, {
            signal: ctrl.signal,
            headers: { "User-Agent": UA, Accept: "*/*", ...extra },
          }),
          sleepMs(ms).then(() => {
            throw new Error(`timeout ${hostOf(url)}`);
          }),
        ]);
        if (!res.ok) throw new Error(`${res.status} ${hostOf(url)}`);
        const text = await Promise.race([
          readCapped(res, maxBytesFor(url)),
          sleepMs(Math.max(400, ms - 200)).then(() => {
            throw new Error(`body timeout ${hostOf(url)}`);
          }),
        ]);
        cycleStats.ok += 1;
        cycleStats.bytes += text.length;
        textCache.set(key, { at: Date.now(), ttl, value: text });
        return text;
      } finally {
        clearTimeout(t);
      }
    } catch (e) {
      cycleStats.fail += 1;
      const msg = e instanceof Error ? e.message : String(e);
      if (cycleStats.fails.length < 12) cycleStats.fails.push(`${hostOf(url)} ${msg}`.slice(0, 96));
      if (/timeout|abort|dead|403|401|429|451/i.test(msg) && !/slot timeout/i.test(msg)) {
        markDead(url, /stlouisfed|fred|yahoo|llama|mempool\.space|bybit|hyperliquid|binance/.test(url) ? 180_000 : 90_000);
      }
      const prev = textCache.get(key);
      if (prev?.value) return prev.value;
      textCache.delete(key);
      throw e;
    } finally {
      if (held) releaseSlot();
    }
  })();
  void pending.catch(() => undefined);
  textCache.set(key, { at: Date.now(), ttl, value: hit?.value, pending });
  if (hit?.value) return hit.value;
  return Promise.race([
    pending,
    sleepMs(ms).then(() => {
      const cur = textCache.get(key);
      if (cur?.value) return cur.value;
      throw new Error(`timeout ${hostOf(url)}`);
    }),
  ]);
}

async function getJson<T>(url: string, ms = 2500, extra: HeadersInit = {}): Promise<T> {
  const text = await getText(url, ms, { Accept: "application/json", ...extra });
  return JSON.parse(text) as T;
}

async function postJson<T>(url: string, body: unknown, ms = 2500): Promise<T> {
  if (isDead(url)) {
    cycleStats.skipped += 1;
    throw new Error(`dead host ${hostOf(url)}`);
  }
  const got = await acquireSlot(Math.min(ms, 1_400));
  if (!got) {
    cycleStats.skipped += 1;
    throw new Error(`slot timeout ${hostOf(url)}`);
  }
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await Promise.race([
      guardedFetch(url, {
        method: "POST",
        signal: ctrl.signal,
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }),
      sleepMs(ms).then(() => {
        throw new Error(`timeout ${hostOf(url)}`);
      }),
    ]);
    if (res.status === 429) throw new Error(`429 ${hostOf(url)}`);
    if (!res.ok) throw new Error(`${res.status} ${hostOf(url)}`);
    const text = await readCapped(res, maxBytesFor(url));
    cycleStats.ok += 1;
    cycleStats.bytes += text.length;
    return JSON.parse(text) as T;
  } catch (e) {
    cycleStats.fail += 1;
    const msg = e instanceof Error ? e.message : String(e);
    if (/timeout|abort|429|403|451/i.test(msg)) markDead(url, /hyperliquid|stlouisfed|fred|yahoo|llama|binance/.test(url) ? 180_000 : 120_000);
    throw e;
  } finally {
    clearTimeout(t);
    releaseSlot();
  }
}

type HlVol = { usd: number | null; note: string };
let hlVolCache: { t: number; v: HlVol } | null = null;

type HlMeta = [{ universe?: { name?: string }[] }, { dayNtlVlm?: string; funding?: string; openInterest?: string; markPx?: string }[]];
let hlMetaCache: { t: number; v: HlMeta } | null = null;

async function hlMeta(): Promise<HlMeta> {
  if (hlMetaCache && Date.now() - hlMetaCache.t < 90_000) return hlMetaCache.v;
  try {
    const data = await postJson<HlMeta>("https://api.hyperliquid.xyz/info", { type: "metaAndAssetCtxs" }, 2200);
    hlMetaCache = { t: Date.now(), v: data };
    return data;
  } catch (e) {
    if (hlMetaCache) return hlMetaCache.v;
    throw e;
  }
}

async function hyperliquidBtcNotional(): Promise<HlVol> {
  if (hlVolCache && Date.now() - hlVolCache.t < 90_000) return hlVolCache.v;
  try {
    const data = await hlMeta();
    const uni = Array.isArray(data) ? data[0]?.universe ?? [] : [];
    const ctxs = Array.isArray(data) ? data[1] ?? [] : [];
    const i = uni.findIndex((u) => (u.name ?? "").toUpperCase() === "BTC");
    const ntl = i >= 0 ? Number(ctxs[i]?.dayNtlVlm) : NaN;
    if (Number.isFinite(ntl) && ntl > 0) {
      const v = { usd: ntl, note: "Hyperliquid BTC perp 24h notional (dayNtlVlm)" };
      hlVolCache = { t: Date.now(), v };
      return v;
    }
  } catch {
    if (hlVolCache) return hlVolCache.v;
  }
  if (hlVolCache) return hlVolCache.v;
  const v: HlVol = { usd: null, note: "Hyperliquid volume unavailable" };
  hlVolCache = { t: Date.now(), v };
  return v;
}

function settled<T>(label: string, errors: string[], r: PromiseSettledResult<T>, fallback: T): T {
  if (r.status === "fulfilled") return r.value;
  const msg = r.reason instanceof Error ? r.reason.message : String(r.reason);
  if (!/deferred|lane timeout|dead host|timeout |empty|slot timeout/i.test(msg)) {
    errors.push(`${label}: ${msg}`.slice(0, 120));
  }
  return fallback;
}

function parseRss(xml: string, source: string, limit = 6): Headline[] {
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].slice(0, limit);
  return items
    .map((m) => {
      const block = m[1] ?? "";
      const title = decode(tag(block, "title"));
      const url = tag(block, "link") || tag(block, "guid");
      const published = tag(block, "pubDate") || tag(block, "published");
      return { source, title, url, published };
    })
    .filter((h) => h.title && h.url);
}

function tag(block: string, name: string): string {
  const m = block.match(new RegExp(`<${name}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${name}>`, "i"))
    ?? block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, "i"));
  return (m?.[1] ?? "").trim();
}

function decode(s: string): string {
  return s
    .replace(/<[^>]+>/g, "")
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, '"')
    .replace(/&#39;/g, "'");
}

type CoinbaseTicker = {
  price?: string;
  bid?: string;
  ask?: string;
  volume?: string;
  time?: string;
};
type CoinbaseStats = {
  open?: string;
  high?: string;
  low?: string;
  last?: string;
  volume?: string;
};
type OkxList = { data?: string[][] };
type OkxObj = { data?: Record<string, string>[] };

const CIKS = FILING_CIKS;

function coinbaseHourlyUrl() {
  const end = new Date();
  const start = new Date(end.getTime() - 298 * 3600 * 1000);
  return `https://api.exchange.coinbase.com/products/BTC-USD/candles?granularity=3600&start=${start.toISOString()}&end=${end.toISOString()}`;
}

function parseCoinbaseCandles(raw: number[][] | null | undefined): Candle[] {
  return (raw ?? [])
    .map((row) => ({
      t: Number(row[0]),
      low: Number(row[1]),
      high: Number(row[2]),
      open: Number(row[3]),
      close: Number(row[4]),
      volume: Number(row[5]),
    }))
    .filter((c) => c.t > 0 && Number.isFinite(c.close) && c.close > 0);
}

async function coinbaseTape() {
  const [tickerR, statsR, rawCandlesR, bookR] = await Promise.allSettled([
    getJson<CoinbaseTicker>("https://api.exchange.coinbase.com/products/BTC-USD/ticker", 2200),
    getJson<CoinbaseStats>("https://api.exchange.coinbase.com/products/BTC-USD/stats", 2200),
    getJson<number[][]>(coinbaseHourlyUrl(), 3500),
    getJson<{
      pricebook?: { bids?: { price: string; size: string }[]; asks?: { price: string; size: string }[] };
    }>("https://api.coinbase.com/api/v3/brokerage/market/product_book?product_id=BTC-USD&limit=80", 1800),
  ]);
  if (tickerR.status !== "fulfilled" && statsR.status !== "fulfilled") {
    throw new Error("coinbase ticker/stats down");
  }
  const ticker = tickerR.status === "fulfilled" ? tickerR.value : ({} as CoinbaseTicker);
  const stats = statsR.status === "fulfilled" ? statsR.value : ({} as CoinbaseStats);
  const rawCandles = rawCandlesR.status === "fulfilled" ? rawCandlesR.value : [];
  const candles = mergeHourly(snapCache?.value?.candles ?? [], parseCoinbaseCandles(rawCandles));
  const last = num(ticker.price) ?? num(stats.last);
  const open = num(stats.open);
  const pb = bookR.status === "fulfilled" ? bookR.value.pricebook : undefined;
  let bids = (pb?.bids ?? [])
    .map((r) => [Number(r.price), Number(r.size)] as [number, number])
    .filter(([p, s]) => p > 0 && s > 0);
  let asks = (pb?.asks ?? [])
    .map((r) => [Number(r.price), Number(r.size)] as [number, number])
    .filter(([p, s]) => p > 0 && s > 0);
  if (!bids.length || !asks.length) {
    try {
      const thin = await getJson<{ bids: string[][]; asks: string[][] }>(
        "https://api.exchange.coinbase.com/products/BTC-USD/book?level=1",
        1200,
      );
      bids = (thin.bids ?? []).map(([p, s]) => [Number(p), Number(s)] as [number, number]);
      asks = (thin.asks ?? []).map(([p, s]) => [Number(p), Number(s)] as [number, number]);
    } catch {
      /* heatmap empty this cycle */
    }
  }
  const closes = candlesToClosesOldestFirst(candles);
  return {
    btc: {
      price: last,
      bid: num(ticker.bid) ?? bids[0]?.[0] ?? null,
      ask: num(ticker.ask) ?? asks[0]?.[0] ?? null,
      volume24h: num(stats.volume) ?? num(ticker.volume),
      volumeAvg24h: volumeAvg24h(candles),
      high24h: num(stats.high),
      low24h: num(stats.low),
      changePct: last != null && open ? ((last - open) / open) * 100 : null,
      source: "Coinbase Exchange BTC-USD",
    },
    candles,
    rsi14: rsiWilder(closes),
    rsiAvg: rsiMean(closes),
    macd: macdLast(closes),
    macd50: macdLast(closes, 50, 100, 9),
    macd200: macdLast(closes, 50, 200, 9),
    ema21: emaLast(closes, 21),
    sma50: smaLast(closes, 50),
    bbPct: bbPercentB(closes),
    volRatio: volumeRatio(candles),
    atr: atrLast(candles),
    heatmap: depthHeatmap(bids, asks),
  };
}

async function positioning() {
  const emptyVenue = (id: string, name: string): LeverageVenue => ({
    id,
    name,
    longShort: null,
    fundingRate: null,
    openInterestUsd: null,
    buyWallUsd: null,
    sellWallUsd: null,
    liqLongUsd: null,
    liqShortUsd: null,
  });

  function saneLs(n: number | null | undefined): number | null {
    if (n == null || !Number.isFinite(n) || n <= 0) return null;
    if (n < 0.15 || n > 8) return null;
    return n;
  }

  function walls(bids: [number, number][], asks: [number, number][], band = 0.004) {
    const mid = ((bids[0]?.[0] ?? 0) + (asks[0]?.[0] ?? 0)) / 2;
    if (!(mid > 0)) return { buy: null as number | null, sell: null as number | null };
    let buy = 0;
    let sell = 0;
    for (const [px, sz] of bids) if (px >= mid * (1 - band)) buy += px * sz;
    for (const [px, sz] of asks) if (px <= mid * (1 + band)) sell += px * sz;
    return { buy, sell };
  }

  async function okxVenue(): Promise<{ venue: LeverageVenue; history: { t: number; ratio: number }[]; liqs: { price: number; side: "long" | "short"; usd: number }[] }> {
    const [ls, oi, fund, book] = await Promise.all([
      getJson<{ data?: string[][] }>("https://www.okx.com/api/v5/rubik/stat/contracts/long-short-account-ratio?ccy=BTC&period=1H", 2200),
      getJson<{ data?: { oiUsd?: string }[] }>("https://www.okx.com/api/v5/public/open-interest?instId=BTC-USDT-SWAP", 2200),
      getJson<{ data?: { fundingRate?: string }[] }>("https://www.okx.com/api/v5/public/funding-rate?instId=BTC-USDT-SWAP", 2200),
      getJson<{ data?: { bids?: string[][]; asks?: string[][] }[] }>(
        "https://www.okx.com/api/v5/market/books?instId=BTC-USDT-SWAP&sz=25",
        2200,
      ),
    ]);
    const rows = ls.data ?? [];
    const latest = rows[0];
    const details: { bkPx?: string; posSide?: string; sz?: string }[] = [];
    const b0 = book.data?.[0];
    const bids: [number, number][] = (b0?.bids ?? []).map((r) => [Number(r[0]), Number(r[1])]);
    const asks: [number, number][] = (b0?.asks ?? []).map((r) => [Number(r[0]), Number(r[1])]);
    const w = walls(bids, asks);
    const liqs = details
      .map((d) => {
        const price = num(d.bkPx);
        const sz = num(d.sz) ?? 0;
        const side = d.posSide === "short" ? ("short" as const) : ("long" as const);
        if (price == null) return null;
        return { price, side, usd: Math.abs(sz) * price };
      })
      .filter((x): x is { price: number; side: "long" | "short"; usd: number } => x != null);
    const longUsd = liqs.filter((x) => x.side === "long").reduce((s, x) => s + x.usd, 0);
    const shortUsd = liqs.filter((x) => x.side === "short").reduce((s, x) => s + x.usd, 0);
    return {
      venue: {
        id: "okx",
        name: "OKX",
        longShort: latest ? saneLs(Number(latest[1])) : null,
        fundingRate: num(fund.data?.[0]?.fundingRate),
        openInterestUsd: num(oi.data?.[0]?.oiUsd),
        buyWallUsd: w.buy,
        sellWallUsd: w.sell,
        liqLongUsd: longUsd || null,
        liqShortUsd: shortUsd || null,
      },
      history: rows
        .slice(0, 48)
        .map((row) => ({ t: Number(row[0]), ratio: Number(row[1]) }))
        .filter((p) => Number.isFinite(p.t) && saneLs(p.ratio) != null)
        .reverse(),
      liqs,
    };
  }

  async function bybitVenue(): Promise<LeverageVenue> {
    const [ratio, tick, book] = await Promise.all([
      getJson<{ result?: { list?: { buyRatio?: string; sellRatio?: string }[] } }>(
        "https://api.bybit.com/v5/market/account-ratio?category=linear&symbol=BTCUSDT&period=1h&limit=1",
      ),
      getJson<{ result?: { list?: { fundingRate?: string; openInterestValue?: string }[] } }>(
        "https://api.bybit.com/v5/market/tickers?category=linear&symbol=BTCUSDT",
      ),
      getJson<{ result?: { b?: string[][]; a?: string[][] } }>(
        "https://api.bybit.com/v5/market/orderbook?category=linear&symbol=BTCUSDT&limit=25",
      ),
    ]);
    const r = ratio.result?.list?.[0];
    const buy = Number(r?.buyRatio);
    const sell = Number(r?.sellRatio);
    const ls = sell > 0 && Number.isFinite(buy) ? buy / sell : null;
    const t = tick.result?.list?.[0];
    const bids: [number, number][] = (book.result?.b ?? []).map((x) => [Number(x[0]), Number(x[1])]);
    const asks: [number, number][] = (book.result?.a ?? []).map((x) => [Number(x[0]), Number(x[1])]);
    const w = walls(bids, asks);
    return {
      id: "bybit",
      name: "Bybit",
      longShort: saneLs(ls),
      fundingRate: num(t?.fundingRate),
      openInterestUsd: num(t?.openInterestValue),
      buyWallUsd: w.buy,
      sellWallUsd: w.sell,
      liqLongUsd: null,
      liqShortUsd: null,
    };
  }

  async function binanceVenue(): Promise<LeverageVenue> {
    const [ratio, oi, prem, book] = await Promise.all([
      getJson<{ longShortRatio?: string }[]>(
        "https://fapi.binance.com/futures/data/globalLongShortAccountRatio?symbol=BTCUSDT&period=1h&limit=1",
      ),
      getJson<{ openInterest?: string }>("https://fapi.binance.com/fapi/v1/openInterest?symbol=BTCUSDT"),
      getJson<{ lastFundingRate?: string; markPrice?: string }>(
        "https://fapi.binance.com/fapi/v1/premiumIndex?symbol=BTCUSDT",
      ),
      getJson<{ bids?: string[][]; asks?: string[][] }>("https://fapi.binance.com/fapi/v1/depth?symbol=BTCUSDT&limit=20"),
    ]);
    const mark = num(prem.markPrice);
    const oiBtc = num(oi.openInterest);
    const bids: [number, number][] = (book.bids ?? []).map((x) => [Number(x[0]), Number(x[1])]);
    const asks: [number, number][] = (book.asks ?? []).map((x) => [Number(x[0]), Number(x[1])]);
    const w = walls(bids, asks);
    return {
      id: "binance",
      name: "Binance futures",
      longShort: saneLs(num(ratio[0]?.longShortRatio)),
      fundingRate: num(prem.lastFundingRate),
      openInterestUsd: oiBtc != null && mark != null ? oiBtc * mark : null,
      buyWallUsd: w.buy,
      sellWallUsd: w.sell,
      liqLongUsd: null,
      liqShortUsd: null,
    };
  }

  async function hlVenue(): Promise<LeverageVenue> {
    const raw = await hlMeta();
    const ctxs = Array.isArray(raw) ? raw[1] : [];
    const meta = Array.isArray(raw) ? (raw[0] as { universe?: { name?: string }[] }) : undefined;
    const names = meta?.universe ?? [];
    let i = names.findIndex((u) => u.name === "BTC");
    if (i < 0) i = 0;
    const c = ctxs[i];
    const mark = num(c?.markPx);
    const oi = num(c?.openInterest);
    return {
      id: "hl",
      name: "Hyperliquid",
      longShort: null,
      fundingRate: num(c?.funding),
      openInterestUsd: oi != null && mark != null ? oi * mark : null,
      buyWallUsd: null,
      sellWallUsd: null,
      liqLongUsd: null,
      liqShortUsd: null,
    };
  }

  async function bitfinexVenue(): Promise<LeverageVenue> {
    const [longR, shortR, tick] = await Promise.all([
      getJson<[number, number]>("https://api-pub.bitfinex.com/v2/stats1/pos.size:1m:tBTCUSD:long/last"),
      getJson<[number, number]>("https://api-pub.bitfinex.com/v2/stats1/pos.size:1m:tBTCUSD:short/last"),
      getJson<[unknown, unknown, unknown, unknown, unknown, unknown, number]>("https://api-pub.bitfinex.com/v2/ticker/tBTCUSD"),
    ]);
    const longBtc = Number(longR?.[1]);
    const shortBtc = Number(shortR?.[1]);
    const last = Number(tick?.[6]);
    const ls = shortBtc > 0 && Number.isFinite(longBtc) ? longBtc / shortBtc : null;
    return {
      id: "bitfinex",
      name: "Bitfinex margin",
      longShort: saneLs(ls),
      fundingRate: null,
      openInterestUsd: Number.isFinite(last) && Number.isFinite(longBtc) && Number.isFinite(shortBtc) ? (longBtc + shortBtc) * last : null,
      buyWallUsd: null,
      sellWallUsd: null,
      liqLongUsd: null,
      liqShortUsd: null,
    };
  }

  const [okxR, byR, hlR, bfR] = await Promise.allSettled([
    okxVenue(),
    bybitVenue(),
    hlVenue(),
    bitfinexVenue(),
  ]);

  const venues: LeverageVenue[] = [];
  let history: { t: number; ratio: number }[] = [];
  let liqs: { price: number; side: "long" | "short"; usd: number }[] = [];
  if (okxR.status === "fulfilled") {
    venues.push(okxR.value.venue);
    history = okxR.value.history;
    liqs = okxR.value.liqs;
  } else venues.push(emptyVenue("okx", "OKX"));
  if (byR.status === "fulfilled") venues.push(byR.value);
  else venues.push(emptyVenue("bybit", "Bybit"));
  if (hlR.status === "fulfilled") venues.push(hlR.value);
  else venues.push(emptyVenue("hl", "Hyperliquid"));
  if (bfR.status === "fulfilled") venues.push(bfR.value);
  else venues.push(emptyVenue("bitfinex", "Bitfinex margin"));
  venues.push(emptyVenue("binance", "Binance futures"));

  let oiW = 0;
  let lsAcc = 0;
  let fundAcc = 0;
  let fundW = 0;
  let buy = 0;
  let sell = 0;
  let oiTot = 0;
  for (const v of venues) {
    if (v.openInterestUsd != null && v.openInterestUsd > 0) {
      oiTot += v.openInterestUsd;
      if (v.longShort != null) {
        lsAcc += v.longShort * v.openInterestUsd;
        oiW += v.openInterestUsd;
      }
      if (v.fundingRate != null) {
        fundAcc += v.fundingRate * v.openInterestUsd;
        fundW += v.openInterestUsd;
      }
    }
    if (v.buyWallUsd != null) buy += v.buyWallUsd;
    if (v.sellWallUsd != null) sell += v.sellWallUsd;
  }
  const longShort = oiW > 0 ? lsAcc / oiW : venues.find((v) => v.longShort != null)?.longShort ?? null;
  const fundingRate = fundW > 0 ? fundAcc / fundW : venues.find((v) => v.fundingRate != null)?.fundingRate ?? null;
  const wallBias: "SELL" | "BUY" | "FLAT" =
    sell > buy * 1.35 ? "SELL" : buy > sell * 1.35 ? "BUY" : "FLAT";

  return {
    longShort,
    openInterestUsd: oiTot || null,
    fundingRate,
    source: "OKX · Bybit · Hyperliquid · Bitfinex · Binance (fill: fapi or CoinGecko)",
    lsHistory: history,
    venues,
    buyWallUsd: buy || null,
    sellWallUsd: sell || null,
    wallBias,
    liquidations: liqs,
  };
}

async function whaleTape(spot: number | null): Promise<WhalePrint[]> {
  const [cbR, okxR, hlR, mpR] = await Promise.allSettled([
    getJson<{ trade_id?: number; side?: string; size?: string; price?: string; time?: string }[]>(
      "https://api.exchange.coinbase.com/products/BTC-USD/trades?limit=100",
      1400,
    ),
    getJson<{ data?: { tradeId?: string; px?: string; sz?: string; side?: string; ts?: string }[] }>(
      "https://www.okx.com/api/v5/market/trades?instId=BTC-USDT-SWAP&limit=100",
      1400,
    ),
    postJson<{ px?: string; sz?: string; side?: string; time?: number; hash?: string; tid?: number }[]>(
      "https://api.hyperliquid.xyz/info",
      { type: "recentTrades", coin: "BTC" },
      1400,
    ),
    mempoolUnconfirmed(),
  ]);

  const pxFallback = spot ?? 0;
  const cb: WhalePrint[] = [];
  if (cbR.status === "fulfilled") {
    for (const t of cbR.value ?? []) {
      const btc = Number(t.size);
      const px = Number(t.price);
      if (!Number.isFinite(btc) || btc <= 0) continue;
      const ts = t.time ? Date.parse(t.time) : NaN;
      cb.push({
        id: `cb-${t.trade_id ?? `${t.time}-${btc}`}`,
        venue: "Coinbase",
        side: t.side === "sell" ? "sell" : "buy",
        btc,
        usd: Number.isFinite(px) ? btc * px : btc * pxFallback,
        t: Number.isFinite(ts) ? ts : Date.now(),
      });
    }
  }
  const okx: WhalePrint[] = [];
  if (okxR.status === "fulfilled") {
    for (const t of okxR.value.data ?? []) {
      const contracts = Number(t.sz);
      const px = Number(t.px);
      const btc = contracts * 0.01;
      if (!Number.isFinite(btc) || btc <= 0) continue;
      let ts = Number(t.ts);
      if (ts > 0 && ts < 1e12) ts *= 1000;
      okx.push({
        id: `okx-${t.tradeId ?? `${t.ts}-${btc}`}`,
        venue: "OKX",
        side: t.side === "sell" ? "sell" : "buy",
        btc,
        usd: Number.isFinite(px) ? btc * px : btc * pxFallback,
        t: Number.isFinite(ts) && ts > 0 ? ts : Date.now(),
      });
    }
  }
  const hl: WhalePrint[] = [];
  if (hlR.status === "fulfilled") {
    for (const t of hlR.value ?? []) {
      const btc = Number(t.sz);
      const px = Number(t.px);
      if (!Number.isFinite(btc) || btc <= 0) continue;
      hl.push({
        id: `hl-${t.hash ?? t.tid ?? `${t.time}-${btc}`}`,
        venue: "Hyperliquid",
        side: t.side === "A" || t.side === "sell" ? "sell" : "buy",
        btc,
        usd: Number.isFinite(px) ? btc * px : btc * pxFallback,
        t: typeof t.time === "number" && t.time > 0 ? t.time : Date.now(),
      });
    }
  }
  const chain: WhalePrint[] = [];
  if (mpR.status === "fulfilled") {
    for (const tx of mpR.value) {
      let max = 0;
      for (const o of tx.out ?? []) {
        const v = Number(o.value);
        if (Number.isFinite(v) && v > max) max = v;
      }
      const btc = max / 1e8;
      if (btc < 5) continue;
      chain.push({
        id: `mp-${tx.hash ?? `${tx.time}-${btc}`}`,
        venue: "On-chain",
        side: "move",
        btc,
        usd: pxFallback > 0 ? btc * pxFallback : 0,
        t: tx.time ? tx.time * 1000 : Date.now(),
      });
    }
  }

  const merged = [...cb, ...okx, ...hl, ...chain];
  const seen = new Set<string>();
  const uniq: WhalePrint[] = [];
  for (const w of merged.sort((a, b) => b.t - a.t)) {
    if (seen.has(w.id)) continue;
    seen.add(w.id);
    uniq.push(w);
    if (uniq.length >= 120) break;
  }
  return uniq;
}

type MemTx = { hash?: string; time?: number; fee?: number; size?: number; weight?: number; out?: { value?: number }[] };
let mempoolTxCache: { t: number; txs: MemTx[] } | null = null;

async function mempoolUnconfirmed(): Promise<MemTx[]> {
  if (mempoolTxCache && Date.now() - mempoolTxCache.t < 25_000) return mempoolTxCache.txs;
  try {
    const rows = await getJson<{ txid?: string; fee?: number; vsize?: number; value?: number; time?: number }[]>(
      "https://mempool.space/api/mempool/recent",
      2200,
    );
    const txs: MemTx[] = (Array.isArray(rows) ? rows : []).map((r) => ({
      hash: r.txid,
      time: r.time,
      fee: r.fee,
      size: r.vsize,
      weight: r.vsize != null ? r.vsize * 4 : undefined,
      out: r.value != null ? [{ value: r.value }] : [],
    }));
    if (txs.length) {
      mempoolTxCache = { t: Date.now(), txs };
      return txs;
    }
  } catch {
    /* blockchain.info last */
  }
  try {
    const j = await getJson<{ txs?: MemTx[] }>("https://blockchain.info/unconfirmed-transactions?format=json", 2200);
    const txs = j.txs ?? [];
    mempoolTxCache = { t: Date.now(), txs };
    return txs;
  } catch {
    return mempoolTxCache?.txs ?? [];
  }
}

async function fearGreed() {
  const j = await getJson<{ data?: { value: string; value_classification: string }[] }>(
    "https://api.alternative.me/fng/?limit=1",
  );
  const d = j.data?.[0];
  if (!d) return null;
  return { value: Number(d.value), label: d.value_classification };
}

async function onchain() {
  const [hashR, feeA, feeB, feeC, memR, globR, poolR] = await Promise.allSettled([
    mempoolSpaceHash(),
    mempoolSpaceFees(),
    blockstreamFees(),
    emzyFees(),
    mempoolUnconfirmed(),
    getJson<{ bitcoin_percentage_of_market_cap?: number }>("https://api.alternative.me/v1/global/", 3000),
    miningPoolShares(),
  ]);
  const used: string[] = [];
  let height: number | null = null;
  let hashrateEh: number | null = null;
  let difficulty: number | null = null;
  if (hashR.status === "fulfilled") {
    height = hashR.value.height;
    hashrateEh = hashR.value.eh > 0 ? hashR.value.eh : null;
    used.push("mempool.space hash");
  }
  const fee =
    feeA.status === "fulfilled"
      ? feeA.value
      : feeB.status === "fulfilled"
        ? feeB.value
        : feeC.status === "fulfilled"
          ? feeC.value
          : null;
  let feeFast: number | null = null;
  let feeEcon: number | null = null;
  if (fee) {
    feeFast = Math.round(fee.fast * 10) / 10;
    feeEcon = Math.round(fee.econ * 10) / 10;
    used.push(
      feeA.status === "fulfilled" ? "mempool.space fees" : feeB.status === "fulfilled" ? "blockstream fees" : "emzy fees",
    );
  } else if (memR.status === "fulfilled") {
    const rates: number[] = [];
    for (const tx of memR.value) {
      const f = Number(tx.fee);
      const vbytes = tx.weight != null && tx.weight > 0 ? tx.weight / 4 : Number(tx.size);
      if (!Number.isFinite(f) || !(vbytes > 0)) continue;
      rates.push(f / vbytes);
    }
    rates.sort((a, b) => a - b);
    if (rates.length >= 3) {
      feeEcon = Math.round((rates[Math.floor(rates.length * 0.5)] ?? 0) * 10) / 10;
      feeFast = Math.round((rates[Math.min(rates.length - 1, Math.floor(rates.length * 0.9))] ?? 0) * 10) / 10;
      used.push("mempool recent fees");
    }
  }
  let btcDom: number | null = null;
  if (globR.status === "fulfilled") {
    const d = globR.value.bitcoin_percentage_of_market_cap;
    if (typeof d === "number" && d > 0 && d < 1.5) btcDom = d * 100;
    else if (typeof d === "number") btcDom = d;
  }
  let regions: import("./types").HashRegion[] = [];
  if (poolR.status === "fulfilled") {
    regions = rollupHashRegions(poolR.value, hashrateEh ?? 0);
    if (regions.length) used.push("mempool pool geography");
  }
  const source = used.length ? used.join(" + ") : "mempool.space";
  return { height, hashrateEh, difficulty, source, regions, feeFast, feeEcon, btcDom };
}

let lastGoodPools: { poolName: string; share: number }[] | null = null;

async function miningPoolShares(): Promise<{ poolName: string; share: number }[]> {
  try {
    const j = await getJson<{ pools?: { name?: string; blockCount?: number }[] }>(
      "https://mempool.emzy.de/api/v1/mining/pools/1w",
      1600,
    );
    const rows = j.pools ?? [];
    const total = rows.reduce((a, p) => a + (Number(p.blockCount) || 0), 0);
    if (total >= 20) {
      const mapped = rows
        .map((p) => ({ poolName: String(p.name ?? "Unknown"), share: (Number(p.blockCount) || 0) / total }))
        .filter((p) => p.share > 0);
      if (mapped.some((p) => /foundry|mara|luxor|ocean|ck.?pool/i.test(p.poolName))) {
        lastGoodPools = mapped;
        return mapped;
      }
    }
  } catch {
    /* last good or blockchain.info */
  }
  if (lastGoodPools) return lastGoodPools;
  const counts = await getJson<Record<string, number>>("https://api.blockchain.info/pools?timespan=4days", 2000);
  const total = Object.values(counts).reduce((a, b) => a + (Number(b) || 0), 0) || 1;
  return Object.entries(counts).map(([poolName, n]) => ({
    poolName,
    share: (Number(n) || 0) / total,
  }));
}

async function mempoolSpaceFees(): Promise<{ fast: number; econ: number }> {
  const j = await getJson<{ fastestFee?: number; halfHourFee?: number; hourFee?: number; economyFee?: number }>(
    "https://mempool.space/api/v1/fees/recommended",
    1400,
  );
  const fast = Number(j.fastestFee ?? j.halfHourFee);
  const econ = Number(j.hourFee ?? j.economyFee);
  if (!Number.isFinite(fast) && !Number.isFinite(econ)) throw new Error("mempool fees empty");
  return { fast: Number.isFinite(fast) ? fast : econ, econ: Number.isFinite(econ) ? econ : fast };
}

async function emzyFees(): Promise<{ fast: number; econ: number }> {
  const j = await getJson<{ fastestFee?: number; halfHourFee?: number; hourFee?: number; economyFee?: number }>(
    "https://mempool.emzy.de/api/v1/fees/recommended",
    1400,
  );
  const fast = Number(j.fastestFee ?? j.halfHourFee);
  const econ = Number(j.hourFee ?? j.economyFee);
  if (!Number.isFinite(fast) && !Number.isFinite(econ)) throw new Error("emzy fees empty");
  return { fast: Number.isFinite(fast) ? fast : econ, econ: Number.isFinite(econ) ? econ : fast };
}

async function blockstreamFees(): Promise<{ fast: number; econ: number }> {
  const j = await getJson<Record<string, number>>("https://blockstream.info/api/fee-estimates", 1400);
  const fast = Number(j["1"] ?? j["2"]);
  const econ = Number(j["6"] ?? j["3"] ?? j["1"]);
  if (!Number.isFinite(fast) && !Number.isFinite(econ)) throw new Error("blockstream fees empty");
  return { fast: Number.isFinite(fast) ? fast : econ, econ: Number.isFinite(econ) ? econ : fast };
}

async function mempoolSpaceHash(): Promise<{ eh: number; height: number | null }> {
  const [hR, tipR] = await Promise.allSettled([
    getJson<{ currentHashrate?: number }>("https://mempool.space/api/v1/mining/hashrate/3d", 1600),
    getText("https://mempool.space/api/blocks/tip/height", 1200),
  ]);
  const hs = hR.status === "fulfilled" ? Number(hR.value.currentHashrate) : NaN;
  let eh = Number.isFinite(hs) ? hs / 1e18 : NaN;
  let height = tipR.status === "fulfilled" ? Number(tipR.value) : NaN;
  if (!Number.isFinite(eh)) {
    try {
      const ghs = Number(await getText("https://api.blockchain.info/q/hashrate", 1600));
      if (Number.isFinite(ghs) && ghs > 0) eh = ghs / 1e9;
    } catch {
      /* fallback optional */
    }
  }
  if (!Number.isFinite(height)) {
    try {
      const tip = Number(await getText("https://blockstream.info/api/blocks/tip/height", 1400));
      if (Number.isFinite(tip) && tip > 0) height = tip;
    } catch {
      /* fallback optional */
    }
  }
  if (!Number.isFinite(eh) && !Number.isFinite(height)) throw new Error("mempool hash empty");
  return {
    eh: Number.isFinite(eh) ? eh : 0,
    height: Number.isFinite(height) ? height : null,
  };
}

async function binanceFromFapi(): Promise<LeverageVenue> {
  const [ratio, oi, prem] = await Promise.all([
    getJson<{ longShortRatio?: string }[]>(
      "https://fapi.binance.com/futures/data/globalLongShortAccountRatio?symbol=BTCUSDT&period=1h&limit=1",
      1400,
    ),
    getJson<{ openInterest?: string }>("https://fapi.binance.com/fapi/v1/openInterest?symbol=BTCUSDT", 1400),
    getJson<{ lastFundingRate?: string; markPrice?: string }>(
      "https://fapi.binance.com/fapi/v1/premiumIndex?symbol=BTCUSDT",
      1400,
    ),
  ]);
  const mark = num(prem.markPrice);
  const oiBtc = num(oi.openInterest);
  return {
    id: "binance",
    name: "Binance futures",
    longShort: (() => {
      const n = num(ratio[0]?.longShortRatio);
      if (n == null || n <= 0 || n < 0.15 || n > 8) return null;
      return n;
    })(),
    fundingRate: num(prem.lastFundingRate),
    openInterestUsd: oiBtc != null && mark != null ? oiBtc * mark : null,
    buyWallUsd: null,
    sellWallUsd: null,
    liqLongUsd: null,
    liqShortUsd: null,
  };
}

async function binanceFromGecko(): Promise<LeverageVenue> {
  const j = await getJson<{
    tickers?: { symbol?: string; open_interest?: number; funding_rate?: number; converted_last?: { usd?: number } }[];
    open_interest_btc?: number;
    trade_volume_24h_btc?: number;
  }>("https://api.coingecko.com/api/v3/derivatives/exchanges/binance_futures?include_tickers=unexpired", 1800);
  const btc = (j.tickers ?? []).find((t) => /btc/i.test(t.symbol ?? "") && /usdt/i.test(t.symbol ?? ""));
  const oi = Number(btc?.open_interest ?? j.open_interest_btc);
  const px = Number(btc?.converted_last?.usd);
  const fund = Number(btc?.funding_rate);
  return {
    id: "binance",
    name: "Binance futures",
    longShort: null,
    fundingRate: Number.isFinite(fund) ? fund : null,
    openInterestUsd: Number.isFinite(oi) && oi > 0 ? (Number.isFinite(px) && px > 1000 ? oi * px : oi) : null,
    buyWallUsd: null,
    sellWallUsd: null,
    liqLongUsd: null,
    liqShortUsd: null,
  };
}

async function restoreCutFeeds(core: DeskSnapshot): Promise<{
  venues: LeverageVenue[];
  onchain: DeskSnapshot["onchain"];
}> {
  const [bnR, feeA, feeB, feeC, hashR, poolR] = await Promise.allSettled([
    (async () => {
      try {
        return await binanceFromFapi();
      } catch {
        return await binanceFromGecko();
      }
    })(),
    mempoolSpaceFees(),
    blockstreamFees(),
    emzyFees(),
    mempoolSpaceHash(),
    miningPoolShares(),
  ]);
  const venues = [...core.positioning.venues];
  if (bnR.status === "fulfilled") {
    const live = bnR.value;
    const i = venues.findIndex((v) => v.id === "binance");
    if (i >= 0) venues[i] = live;
    else venues.push(live);
  }
  const onchain = { ...core.onchain };
  const fee =
    feeA.status === "fulfilled"
      ? feeA.value
      : feeB.status === "fulfilled"
        ? feeB.value
        : feeC.status === "fulfilled"
          ? feeC.value
          : null;
  if (fee) {
    if (onchain.feeFast == null) onchain.feeFast = Math.round(fee.fast * 10) / 10;
    if (onchain.feeEcon == null) onchain.feeEcon = Math.round(fee.econ * 10) / 10;
    const tag =
      feeA.status === "fulfilled" ? "mempool.space fees" : feeB.status === "fulfilled" ? "blockstream fees" : "emzy fees";
    if (!onchain.source.includes(tag)) onchain.source = `${onchain.source} + ${tag}`;
  }
  if (hashR.status === "fulfilled") {
    if (onchain.hashrateEh == null && hashR.value.eh > 0) {
      onchain.hashrateEh = hashR.value.eh;
      if (!onchain.source.includes("mempool.space hash")) onchain.source = `${onchain.source} + mempool.space hash`;
    }
    if (onchain.height == null && hashR.value.height != null) onchain.height = hashR.value.height;
  }
  if (poolR.status === "fulfilled") {
    const next = rollupHashRegions(poolR.value, onchain.hashrateEh ?? 0);
    if (next.some((r) => r.id === "na" && r.share > 0) || next.length >= onchain.regions.length) {
      onchain.regions = next;
      if (!onchain.source.includes("pool geography")) onchain.source = `${onchain.source} + pool geography`;
    }
  }
  return { venues, onchain };
}

const POOL_REGION: { test: RegExp; id: string; name: string }[] = [
  { test: /foundry|mara\b|marathon|luxor|ocean|terawulf|cleanspark|riot|core.?sci|bitfarms|hut.?8|hive.?digital|cipher|american|ck.?pool/i, id: "na", name: "North America" },
  { test: /emcd|bova|luckypool|nicehash.?ru|whitepool/i, id: "ru", name: "Russia / CIS" },
  { test: /braiins|slush|bitfufu|ultimus|nicehash|mining.?dutch/i, id: "eu", name: "Europe" },
  { test: /sbi|gmo|bitbank|ocean.?tokyo/i, id: "jp", name: "Japan / Rest of Asia" },
  { test: /antpool|via.?btc|f2.?pool|binance|btc\.com|btcc|poolin|spider|secpool|rawpool|1thash|okminer|clover/i, id: "cn", name: "China" },
];

function poolRegion(name: string) {
  const raw = name.trim();
  if (/^unknown$/i.test(raw)) return { id: "na", name: "North America" };
  for (const row of POOL_REGION) {
    if (row.test.test(raw)) return row;
  }
  return { id: "ot", name: "Other" };
}

function rollupHashRegions(
  pools: { share?: number; poolName?: string }[],
  totalEh: number,
): import("./types").HashRegion[] {
  const acc = new Map<string, { id: string; name: string; share: number }>();
  for (const p of pools) {
    const share = Number(p.share);
    if (!Number.isFinite(share) || share <= 0) continue;
    const meta = poolRegion(p.poolName ?? "Other");
    const cur = acc.get(meta.id) ?? { id: meta.id, name: meta.name, share: 0 };
    cur.share += share;
    acc.set(meta.id, cur);
  }
  if (!acc.has("na")) acc.set("na", { id: "na", name: "North America", share: 0 });
  return [...acc.values()]
    .filter((r) => r.id === "na" || r.share > 0)
    .map((r) => ({ ...r, eh: totalEh * r.share }))
    .sort((a, b) => {
      if (a.id === "na") return -1;
      if (b.id === "na") return 1;
      return b.share - a.share;
    });
}

function parseAbbrevBtc(raw: string): number | null {
  const s = raw.replace(/,/g, "").trim();
  const m = s.match(/^([0-9]+(?:\.[0-9]+)?)([MBK])?$/i);
  if (!m) return null;
  const n = Number(m[1]);
  if (!Number.isFinite(n)) return null;
  const u = (m[2] ?? "").toUpperCase();
  if (u === "M") return n * 1_000_000;
  if (u === "B") return n * 1_000_000_000;
  if (u === "K") return n * 1_000;
  return n;
}

function parseUsdToken(raw: string): number | null {
  const s = raw.replace(/[$,]/g, "").trim();
  const m = s.match(/^([0-9]+(?:\.[0-9]+)?)([MBK])?$/i);
  if (!m) return null;
  const n = Number(m[1]);
  if (!Number.isFinite(n)) return null;
  const u = (m[2] ?? "").toUpperCase();
  if (u === "B") return n * 1e9;
  if (u === "M") return n * 1e6;
  if (u === "K") return n * 1e3;
  return n;
}

function scrapeHeld(html: string, label: string): { btc: number | null; usd: number | null; change30: number | null } {
  const i = html.indexOf(label);
  if (i < 0) return { btc: null, usd: null, change30: null };
  const slice = html.slice(i, i + 3500);
  const btcM = slice.match(/>([0-9]{1,3}(?:,[0-9]{3})+|[0-9]+(?:\.[0-9]+)?[MBK])</i);
  const usdM = slice.match(/\$([0-9]+(?:\.[0-9]+)?[MBK]?)/i);
  let change30: number | null = null;
  const parts = slice.split(/30D/i);
  if (parts[1]) {
    const pctM = parts[1].match(/([+-]?[0-9]+(?:\.[0-9]+)?)%/);
    if (pctM) {
      const n = Number(pctM[1]);
      if (Number.isFinite(n) && Math.abs(n) < 50) change30 = n / 100;
    }
  }
  return {
    btc: btcM ? parseAbbrevBtc(btcM[1] ?? "") : null,
    usd: usdM ? parseUsdToken(usdM[1] ?? "") : null,
    change30,
  };
}

function parseBitboSection(html: string, startId: string, endId: string): DatHolding[] {
  const start = html.indexOf(`id="${startId}"`);
  const end = html.indexOf(`id="${endId}"`);
  const sec = start >= 0 ? html.slice(start, end > start ? end : undefined) : "";
  const re =
    /<td class="td-company"[^>]*>\s*<a href="[^"]+">\s*([^<]+?)\s*<\/a>[\s\S]*?<td class="td-symbol"[^>]*>\s*([^<]*)<\/td>[\s\S]*?<td class="td-company_btc"[^>]*>\s*([^<]+)<\/td>\s*<td class="td-value[^"]*"[^>]*>\s*\$?([^<]+)<\/td>/gi;
  const out: DatHolding[] = [];
  for (const m of sec.matchAll(re)) {
    const name = (m[1] ?? "").replace(/\s+/g, " ").trim();
    const ticker = (m[2] ?? "").split(":")[0]?.trim() || "";
    const btc = Number(String(m[3] ?? "").replace(/,/g, ""));
    const usd = Number(String(m[4] ?? "").replace(/[$,]/g, ""));
    if (!name || !Number.isFinite(btc) || btc <= 0) continue;
    out.push({
      name,
      ticker,
      btc,
      usd: Number.isFinite(usd) ? usd : 0,
    });
  }
  return out.sort((a, b) => b.btc - a.btc);
}

function parsePublicDats(html: string): DatHolding[] {
  return parseBitboSection(html, "public", "private");
}

function parseEtfs(html: string): DatHolding[] {
  return parseBitboSection(html, "etfs", "miners");
}

let bitboHtmlCache: { t: number; html: string } | null = null;

async function bitboTreasuriesHtml(): Promise<string> {
  if (bitboHtmlCache && Date.now() - bitboHtmlCache.t < 180_000) return bitboHtmlCache.html;
  const html = await getText("https://bitbo.io/treasuries/", 3500);
  bitboHtmlCache = { t: Date.now(), html };
  return html;
}

async function capitalTape(): Promise<CapitalTape> {
  const [etfR, datR, swfR, cbR, okxR, krR, byR, hlR] = await Promise.allSettled([
    postJson<{
      data?: { date: string; totalNetInflow: number; totalNetAssets?: number }[];
    }>(
      "https://api.sosovalue.xyz/openapi/v2/etf/historicalInflowChart",
      { type: "us-btc-spot" },
      2200,
    ),
    bitboTreasuriesHtml(),
    getText("https://bitbo.io/treasuries/countries/", 3500),
    getJson<{ last?: string; volume?: string }>("https://api.exchange.coinbase.com/products/BTC-USD/stats", 2000),
    getJson<{ data?: { volCcy24h?: string; last?: string }[] }>(
      "https://www.okx.com/api/v5/market/ticker?instId=BTC-USDT",
      2000,
    ),
    getJson<{ result?: Record<string, { c?: string[]; v?: string[] }> }>(
      "https://api.kraken.com/0/public/Ticker?pair=XBTUSD",
      2000,
    ),
    getJson<{ result?: { list?: { turnover24h?: string }[] } }>(
      "https://api.bybit.com/v5/market/tickers?category=spot&symbol=BTCUSDT",
      2000,
    ),
    hyperliquidBtcNotional(),
  ]);

  let etfFlow: number | null = null;
  let etfAum: number | null = null;
  let asOf: string | null = null;
  if (etfR.status === "fulfilled") {
    const row = etfR.value.data?.[0];
    if (row && Number.isFinite(row.totalNetInflow)) {
      etfFlow = row.totalNetInflow;
      asOf = row.date;
    }
    const aum = row?.totalNetAssets;
    if (typeof aum === "number" && Number.isFinite(aum)) etfAum = aum;
  }

  const datHtml = datR.status === "fulfilled" ? datR.value : "";
  const dats = parsePublicDats(datHtml);
  const etfs = parseEtfs(datHtml);
  const datUsd = dats.length ? dats.reduce((s, d) => s + d.usd, 0) : null;
  const datBtc = dats.reduce((s, d) => s + d.btc, 0);
  const named = dats.slice(0, 4).map((d) => `${d.ticker || d.name} ${d.btc.toLocaleString("en-US", { maximumFractionDigits: 0 })}`);
  const etfUsd = etfs.length ? etfs.reduce((s, d) => s + d.usd, 0) : etfAum;
  const etfBtc = etfs.reduce((s, d) => s + d.btc, 0);
  const etfNamed = etfs.slice(0, 4).map((d) => `${d.ticker || d.name} ${d.btc.toLocaleString("en-US", { maximumFractionDigits: 0 })}`);
  const etfFlowNote =
    etfFlow != null
      ? `US last session net ${etfFlow >= 0 ? "+" : ""}$${(Math.abs(etfFlow) / 1e6).toFixed(0)}M`
      : "US session net n/a";

  let coinbaseUsd: number | null = null;
  let spot: number | null = null;
  if (cbR.status === "fulfilled") {
    const last = Number(cbR.value.last);
    const vol = Number(cbR.value.volume);
    if (Number.isFinite(last)) spot = last;
    if (Number.isFinite(last) && Number.isFinite(vol)) coinbaseUsd = last * vol;
  }

  const LATAM = [
    "el salvador",
    "salvador",
    "venezuela",
    "brazil",
    "brasil",
    "argentina",
    "chile",
    "colombia",
    "peru",
    "bolivia",
    "paraguay",
    "uruguay",
    "ecuador",
    "panama",
    "mexico",
    "méxico",
    "costa rica",
    "honduras",
    "guatemala",
    "nicaragua",
    "guyana",
    "cuba",
    "dominican",
    "jamaica",
  ];
  const SOVEREIGN_CORE = ["bhutan", "united arab emirates", "uae", "mubadala"];

  function normGov(name: string) {
    return name
      .normalize("NFKD")
      .replace(/[^\p{L}\s]/gu, "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }
  function isLatam(name: string) {
    const k = normGov(name);
    return LATAM.some((s) => k.includes(s) || s.includes(k));
  }
  function isSovereign(name: string) {
    const k = normGov(name);
    return isLatam(k) || SOVEREIGN_CORE.some((s) => k.includes(s) || s.includes(k));
  }

  const byGov = new Map<string, { name: string; btc: number; usd: number }>();

  function addGov(name: string, btc: number, usd: number) {
    if (!isSovereign(name)) return;
    if (!Number.isFinite(btc) && !Number.isFinite(usd)) return;
    const key = isLatam(name)
      ? LATAM.find((s) => normGov(name).includes(s)) ?? normGov(name)
      : normGov(name);
    const prev = byGov.get(key);
    const nextBtc = Math.max(prev?.btc ?? 0, Number.isFinite(btc) ? btc : 0);
    const nextUsd = Math.max(prev?.usd ?? 0, Number.isFinite(usd) ? usd : 0);
    byGov.set(key, { name: prev?.name ?? name.replace(/[^\p{L}\s.-]/gu, "").trim(), btc: nextBtc, usd: nextUsd });
  }

  if (swfR.status === "fulfilled") {
    for (const m of swfR.value.matchAll(/data-name="([^"]+)" data-btcc="([^"]+)"/g)) {
      const name = m[1] ?? "";
      const btc = Number(m[2]);
      addGov(name, btc, 0);
    }
  }

  for (const row of [
    { name: "El Salvador", btc: 7757 },
    { name: "Venezuela", btc: 240 },
  ]) {
    addGov(row.name, row.btc, 0);
  }

  if (spot != null) {
    for (const row of byGov.values()) {
      if (row.btc > 0 && row.usd <= 0) row.usd = row.btc * spot;
      if (row.usd > 0 && row.btc <= 0) row.btc = row.usd / spot;
    }
  }

  const swfRows = [...byGov.values()].sort((a, b) => b.usd - a.usd || b.btc - a.btc);
  const esRow = swfRows.find((r) => normGov(r.name).includes("salvador"));
  const latamRows = swfRows.filter((r) => isLatam(r.name));
  const coreRows = swfRows.filter((r) => !isLatam(r.name));
  const esUsd = esRow && esRow.usd > 0 ? esRow.usd : null;
  const latamUsd = latamRows.length ? latamRows.reduce((s, r) => s + r.usd, 0) : null;
  const swfUsd = coreRows.length ? coreRows.reduce((s, r) => s + r.usd, 0) : null;
  const fmtGov = (r: { name: string; btc: number }) =>
    `${r.name} ${r.btc.toLocaleString("en-US", { maximumFractionDigits: 0 })} BTC`;

  let others = 0;
  let otherN = 0;
  if (okxR.status === "fulfilled") {
    const volQuote = Number(okxR.value.data?.[0]?.volCcy24h);
    if (Number.isFinite(volQuote)) {
      others += volQuote;
      otherN += 1;
    }
  }
  if (krR.status === "fulfilled") {
    const row = Object.values(krR.value.result ?? {})[0];
    const last = Number(row?.c?.[0]);
    const vol = Number(row?.v?.[1]);
    if (Number.isFinite(last) && Number.isFinite(vol)) {
      others += last * vol;
      otherN += 1;
    }
  }
  if (byR.status === "fulfilled") {
    const turn = Number(byR.value.result?.list?.[0]?.turnover24h);
    if (Number.isFinite(turn)) {
      others += turn;
      otherN += 1;
    }
  }

  const hlUsd = hlR.status === "fulfilled" ? hlR.value.usd : null;
  const hlNote =
    hlR.status === "fulfilled"
      ? hlR.value.note
      : "Hyperliquid volume unavailable";

  return {
    asOf,
    source: "Bitbo ETFs + public DATs · SoSoValue US flow · Bitbo countries · Mubadala 13F · public CEX · Hyperliquid",
    bars: [
      {
        id: "etf",
        name: "ETF",
        usd: etfUsd,
        note: etfs.length
          ? `${etfs.length} ETF/ETP, ${etfBtc.toLocaleString("en-US", { maximumFractionDigits: 0 })} BTC · ${etfNamed.join(" · ")} · ${etfFlowNote}`
          : etfAum != null
            ? `US spot AUM · ${etfFlowNote}`
            : "ETF holdings unavailable",
      },
      {
        id: "dat",
        name: "DAT",
        usd: datUsd,
        note: dats.length
          ? `${dats.length} public treasuries, ${datBtc.toLocaleString("en-US", { maximumFractionDigits: 0 })} BTC · ${named.join(" · ")}`
          : "Public-company treasuries unavailable",
      },
      {
        id: "elsal",
        name: "El Salv",
        usd: esUsd,
        note: esRow
          ? `${fmtGov(esRow)} · Bitbo + CoinGecko`
          : "El Salvador holdings unavailable",
      },
      {
        id: "latam",
        name: "LatAm",
        usd: latamUsd,
        note: latamRows.length
          ? `LatAm official BTC · ${latamRows.map(fmtGov).join(" · ")} (El Salvador floor 7,757 BTC · BitcoinTreasuries Aug 2026)`
          : "LatAm official BTC unavailable",
      },
      {
        id: "swf",
        name: "Sovereign",
        usd: swfUsd,
        note: coreRows.length
          ? `${coreRows.map(fmtGov).join(" · ")} (not seized US/CN/UK)`
          : "SWF estimate unavailable",
      },
      { id: "coinbase", name: "Coinbase", usd: coinbaseUsd, note: "Coinbase BTC-USD 24h spot notional" },
      { id: "hl", name: "Hyperliq", usd: hlUsd, note: hlNote },
      {
        id: "others",
        name: "Other CEX",
        usd: otherN ? others : null,
        note: "OKX + Kraken + Bybit 24h spot notional",
      },
    ],
    dats,
    etfs,
    etfFlow,
  };
}

async function mubadalaIbit(): Promise<{ usd: number; asOf: string } | null> {
  const j = await getJson<{
    filings?: { recent?: { form: string[]; accessionNumber: string[]; filingDate: string[] } };
  }>("https://data.sec.gov/submissions/CIK0001704268.json", 9000);
  const rec = j.filings?.recent;
  if (!rec) return null;
  let acc: string | null = null;
  let asOf = "";
  for (let i = 0; i < rec.form.length; i++) {
    if (rec.form[i] === "13F-HR") {
      acc = rec.accessionNumber[i] ?? null;
      asOf = rec.filingDate[i] ?? "";
      break;
    }
  }
  if (!acc) return null;
  const xml = await getText(
    `https://www.sec.gov/Archives/edgar/data/1704268/${acc.replace(/-/g, "")}/informationtable.xml`,
    9000,
  );
  const block = xml.match(/<infoTable>[\s\S]*?ISHARES BITCOIN[\s\S]*?<\/infoTable>/i);
  const raw = block?.[0].match(/<value>(\d+)<\/value>/);
  const usd = raw ? Number(raw[1]) : NaN;
  if (!Number.isFinite(usd) || usd <= 0) return null;
  return { usd: usd < 10_000_000 ? usd * 1000 : usd, asOf };
}

async function quotes(): Promise<Quote[]> {
  const symbols = [...new Set([...PROXY_QUOTES, ...MACRO_QUOTES, ...MAG7_TICKERS, ...SILVER_TICKERS, ...GOLD_TICKERS, "STRK", "STRF", "STRD", "STRC", "MSTY", "MSTU", "MSTX", "MSTZ"])];
  const url =
    `https://quote.cnbc.com/quote-html-webservice/restQuote/symbolType/symbol?symbols=${symbols.join("|")}&requestMethod=itv&noform=1&partnerId=2&fund=1&exthrs=1&output=json`;
  const j = await getJson<{
    FormattedQuoteResult?: {
      FormattedQuote?: {
        symbol: string;
        name?: string;
        last?: string;
        change_pct?: string;
      }[];
    };
  }>(url, 2200);
  const rows = j.FormattedQuoteResult?.FormattedQuote ?? [];
  const out: Quote[] = rows
    .filter((r) => r.symbol && r.last != null)
    .map((r) => ({
      symbol: r.symbol,
      name: r.name ?? r.symbol,
      last: num(r.last),
      changePct: num(r.change_pct),
    }));
  const have = new Set(out.map((q) => q.symbol.toUpperCase()));
  const missing = symbols.filter((s) => !have.has(s));
  if (missing.length && missing.length <= 8 && !isDead("https://query1.finance.yahoo.com/")) {
    try {
      const y = await getJson<{
        quoteResponse?: {
          result?: { symbol?: string; shortName?: string; regularMarketPrice?: number; regularMarketChangePercent?: number }[];
        };
      }>(
        `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${missing.slice(0, 8).join(",")}`,
        2000,
        { "User-Agent": "Mozilla/5.0 S1R1US-Lab/1.0" },
      );
      for (const r of y.quoteResponse?.result ?? []) {
        if (!r.symbol || r.regularMarketPrice == null) continue;
        out.push({
          symbol: r.symbol,
          name: r.shortName ?? r.symbol,
          last: r.regularMarketPrice,
          changePct: r.regularMarketChangePercent ?? null,
        });
      }
    } catch {
      /* CNBC row is enough */
    }
  }
  const still = symbols.filter((s) => !out.some((q) => q.symbol.toUpperCase() === s.toUpperCase()));
  if (still.length) {
    const us = still.filter((s) => !/[=\^-]/.test(s)).slice(0, 8);
    await Promise.all(
      us.map(async (sym) => {
        try {
          const csv = await getText(`https://stooq.com/q/l/?s=${encodeURIComponent(sym.toLowerCase())}.us&f=sd2t2ohlcv&h&e=csv`, 1600);
          const line = csv.trim().split("\n")[1];
          if (!line || /N\/D/.test(line)) return;
          const cols = line.split(",");
          const close = Number(cols[6]);
          if (!Number.isFinite(close) || close <= 0) return;
          out.push({ symbol: sym, name: sym, last: close, changePct: null });
        } catch {
          /* optional quote fill */
        }
      }),
    );
  }
  return out;
}

async function filings(): Promise<Filing[]> {
  const packs = await Promise.all(
    CIKS.map(async ({ cik, name }) => {
      const j = await getJson<{
        filings?: {
          recent?: {
            form: string[];
            filingDate: string[];
            primaryDocDescription: string[];
            accessionNumber: string[];
          };
        };
      }>(`https://data.sec.gov/submissions/CIK${cik}.json`, 5000);
      const rec = j.filings?.recent;
      if (!rec) return [];
      const out: Filing[] = [];
      for (let i = 0; i < Math.min(rec.form.length, 8); i++) {
        const form = rec.form[i] ?? "";
        if (!/^(8-K|10-Q|10-K|4|3|5|13F)/i.test(form)) continue;
        out.push({
          cik,
          name,
          form,
          filed: rec.filingDate[i] ?? "",
          title: rec.primaryDocDescription[i] || form,
        });
      }
      return out.slice(0, 4);
    }),
  );
  return packs.flat().sort((a, b) => b.filed.localeCompare(a.filed)).slice(0, 12);
}

async function headlines(): Promise<Headline[]> {
  const feeds = await Promise.allSettled([
    getText("https://cointelegraph.com/rss", 2200),
    getText("https://www.coindesk.com/arc/outboundfeeds/rss/", 2200),
    getText("https://decrypt.co/feed", 2200),
    getText("https://news.bitcoin.com/feed/", 2200),
  ]);
  const names = ["Cointelegraph", "CoinDesk", "Decrypt", "Bitcoin.com"] as const;
  const caps = [5, 4, 3, 3];
  const out: Headline[] = [];
  feeds.forEach((r, i) => {
    if (r.status === "fulfilled") out.push(...parseRss(r.value, names[i]!, caps[i]));
  });
  const seen = new Set<string>();
  return out.filter((h) => {
    const k = h.title.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  }).slice(0, 18);
}

type UpbitTick = {
  trade_price?: number;
  signed_change_rate?: number;
  acc_trade_volume_24h?: number;
};
type BithumbTick = {
  data?: {
    closing_price?: string;
    units_traded_24H?: string;
    fluctate_rate_24H?: string;
  };
};
type HashTick = { c?: string; v?: string };
type HtxTick = { tick?: { close?: number; amount?: number } };
type OkxTicker = { data?: { last?: string; vol24h?: string }[] };
type FxFrank = { rates?: { KRW?: number; HKD?: number; CNY?: number } };
type C2CBook = { data?: { sell?: { price?: string }[] } };

function median(xs: number[]): number | null {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m]! : (s[m - 1]! + s[m]!) / 2;
}

function prem(px: number | null, ref: number | null): number | null {
  if (px == null || ref == null || ref === 0) return null;
  return ((px / ref) - 1) * 100;
}

function utcSession(d = new Date()): AsiaTape["session"] {
  const h = d.getUTCHours();
  if (h >= 23 || h < 8) return "ASIA";
  if (h < 13) return "LONDON";
  return "US";
}

async function usdAsiaFx(): Promise<{ KRW?: number; HKD?: number; CNY?: number }> {
  try {
    const j = await getJson<FxFrank>("https://api.frankfurter.app/latest?from=USD&to=KRW,HKD,CNY", 1800);
    if (j.rates?.KRW) return j.rates;
  } catch {
    /* er-api fallback */
  }
  const j = await getJson<{ rates?: { KRW?: number; HKD?: number; CNY?: number } }>(
    "https://open.er-api.com/v6/latest/USD",
    1800,
  );
  return j.rates ?? {};
}

async function asiaRaw() {
  const [fxR, upR, biR, hkR, okR, htR, c2R] = await Promise.allSettled([
    usdAsiaFx(),
    getJson<UpbitTick[]>("https://api.upbit.com/v1/ticker?markets=KRW-BTC", 2200),
    getJson<BithumbTick>("https://api.bithumb.com/public/ticker/BTC_KRW", 2200),
    getJson<HashTick[]>("https://api-pro.hashkey.com/quote/v1/ticker/24hr?symbol=BTCUSDT", 2200),
    getJson<OkxTicker>("https://www.okx.com/api/v5/market/ticker?instId=BTC-USDT", 2200),
    getJson<HtxTick>("https://api.huobi.pro/market/detail/merged?symbol=btcusdt", 2200),
    getJson<C2CBook>(
      "https://www.okx.com/v3/c2c/tradingOrders/books?quoteCurrency=CNY&baseCurrency=USDT&side=sell&paymentMethod=all&userType=all",
      2200,
    ),
  ]);
  const fx = fxR.status === "fulfilled" ? fxR.value : {};
  const up = upR.status === "fulfilled" ? upR.value[0] : undefined;
  const bi = biR.status === "fulfilled" ? biR.value.data : undefined;
  const hk = hkR.status === "fulfilled" ? hkR.value[0] : undefined;
  const ok = okR.status === "fulfilled" ? okR.value.data?.[0] : undefined;
  const ht = htR.status === "fulfilled" ? htR.value.tick : undefined;
  const ads = c2R.status === "fulfilled" ? c2R.value.data?.sell ?? [] : [];
  const usdtCny = median(
    ads.slice(0, 12).map((a) => Number(a.price)).filter((n) => Number.isFinite(n) && n > 0),
  );
  return {
    krw: fx.KRW ?? null,
    hkd: fx.HKD ?? null,
    cny: fx.CNY ?? null,
    upbitKrw: num(up?.trade_price),
    upbitVol: num(up?.acc_trade_volume_24h),
    upbitChg: up?.signed_change_rate != null ? up.signed_change_rate * 100 : null,
    bithumbKrw: num(bi?.closing_price),
    bithumbVol: num(bi?.units_traded_24H),
    bithumbChg: num(bi?.fluctate_rate_24H),
    hashkeyUsdt: num(hk?.c),
    hashkeyVol: num(hk?.v),
    okxUsdt: num(ok?.last),
    okxVol: num(ok?.vol24h),
    htxUsdt: num(ht?.close),
    htxVol: num(ht?.amount),
    usdtCny,
  };
}

function toAsia(raw: Awaited<ReturnType<typeof asiaRaw>>, refUsd: number | null): AsiaTape {
  const upbitUsd =
    raw.upbitKrw != null && raw.krw ? raw.upbitKrw / raw.krw : null;
  const bithumbUsd =
    raw.bithumbKrw != null && raw.krw ? raw.bithumbKrw / raw.krw : null;
  const venues: AsiaVenue[] = [
    {
      id: "upbit",
      region: "KR",
      name: "Upbit KRW",
      lastUsd: upbitUsd,
      volumeBtc: raw.upbitVol,
      changePct: raw.upbitChg,
      premiumPct: prem(upbitUsd, refUsd),
    },
    {
      id: "bithumb",
      region: "KR",
      name: "Bithumb KRW",
      lastUsd: bithumbUsd,
      volumeBtc: raw.bithumbVol,
      changePct: raw.bithumbChg,
      premiumPct: prem(bithumbUsd, refUsd),
    },
    {
      id: "hashkey",
      region: "HK",
      name: "HashKey USDT",
      lastUsd: raw.hashkeyUsdt,
      volumeBtc: raw.hashkeyVol,
      changePct: null,
      premiumPct: prem(raw.hashkeyUsdt, refUsd),
    },
    {
      id: "okx",
      region: "HK",
      name: "OKX USDT",
      lastUsd: raw.okxUsdt,
      volumeBtc: raw.okxVol,
      changePct: null,
      premiumPct: prem(raw.okxUsdt, refUsd),
    },
    {
      id: "htx",
      region: "CN",
      name: "HTX USDT",
      lastUsd: raw.htxUsdt,
      volumeBtc: raw.htxVol,
      changePct: null,
      premiumPct: prem(raw.htxUsdt, refUsd),
    },
  ];
  const cnyPrem = prem(raw.usdtCny, raw.cny);
  return {
    session: utcSession(),
    fx: { krw: raw.krw, hkd: raw.hkd, cny: raw.cny },
    kimchiPct: prem(upbitUsd, refUsd),
    hkPremiumPct: prem(raw.hashkeyUsdt, refUsd),
    cnyOtc: {
      usdtCny: raw.usdtCny,
      officialCny: raw.cny,
      premiumPct: cnyPrem,
    },
    venues,
  };
}

function flowOf(p: number | null): Flow {
  if (p == null) return "FLAT";
  if (p >= 1.5) return "INFLOW";
  if (p <= -1.5) return "OUTFLOW";
  return "FLAT";
}

async function okxUsdtP2p(ccy: string): Promise<number | null> {
  const j = await getJson<C2CBook>(
    `https://www.okx.com/v3/c2c/tradingOrders/books?quoteCurrency=${ccy}&baseCurrency=USDT&side=sell&paymentMethod=all&userType=all`,
  );
  const ads = j.data?.sell ?? [];
  return median(
    ads.slice(0, 12).map((a) => Number(a.price)).filter((n) => Number.isFinite(n) && n > 0),
  );
}

type FxEr = { rates?: Record<string, number> };
type OasisTick = { ticker?: { last_price?: string; daily_percentage_change?: string } };
type Rapira = { data?: { symbol?: string; close?: number }[] };
type LunoTick = { last_trade?: string; rolling_24_hour_volume?: string };
type MbTick = { last?: string; vol?: string }[];
type BudaTick = { ticker?: { last_price?: [string, string]; volume?: [string, string] } };

async function emRaw() {
  const [fxR, oasisR, rapR, lunoZarR, lunoNgnR, mbR, budaClpR, budaCopR, sarR, tryR, ngnR, zarR, arsR] =
    await Promise.allSettled([
      getJson<FxEr>("https://open.er-api.com/v6/latest/USD"),
      getJson<OasisTick>("https://api.bitoasis.net/v1/exchange/ticker/BTC-AED"),
      getJson<Rapira>("https://api.rapira.net/open/market/rates"),
      getJson<LunoTick>("https://api.luno.com/api/1/ticker?pair=XBTZAR"),
      getJson<LunoTick>("https://api.luno.com/api/1/ticker?pair=XBTNGN"),
      getJson<MbTick>("https://api.mercadobitcoin.net/api/v4/tickers?symbols=BTC-BRL"),
      getJson<BudaTick>("https://www.buda.com/api/v2/markets/btc-clp/ticker"),
      getJson<BudaTick>("https://www.buda.com/api/v2/markets/btc-cop/ticker"),
      okxUsdtP2p("SAR"),
      okxUsdtP2p("TRY"),
      okxUsdtP2p("NGN"),
      okxUsdtP2p("ZAR"),
      okxUsdtP2p("ARS"),
    ]);
  const fx = fxR.status === "fulfilled" ? fxR.value.rates ?? {} : {};
  const rap = rapR.status === "fulfilled" ? rapR.value.data ?? [] : [];
  const usdtRub = rap.find((r) => r.symbol === "USDT/RUB")?.close ?? null;
  return {
    aed: num(fx.AED),
    sar: num(fx.SAR),
    tryFx: num(fx.TRY),
    rub: num(fx.RUB),
    zar: num(fx.ZAR),
    ngn: num(fx.NGN),
    brl: num(fx.BRL),
    ars: num(fx.ARS),
    clp: num(fx.CLP),
    cop: num(fx.COP),
    oasisAed: oasisR.status === "fulfilled" ? num(oasisR.value.ticker?.last_price) : null,
    usdtRub: num(usdtRub),
    lunoZar: lunoZarR.status === "fulfilled" ? num(lunoZarR.value.last_trade) : null,
    lunoNgn: lunoNgnR.status === "fulfilled" ? num(lunoNgnR.value.last_trade) : null,
    mbBrl: mbR.status === "fulfilled" ? num(mbR.value[0]?.last) : null,
    budaClp: budaClpR.status === "fulfilled" ? num(budaClpR.value.ticker?.last_price?.[0]) : null,
    budaCop: budaCopR.status === "fulfilled" ? num(budaCopR.value.ticker?.last_price?.[0]) : null,
    p2pSar: sarR.status === "fulfilled" ? sarR.value : null,
    p2pTry: tryR.status === "fulfilled" ? tryR.value : null,
    p2pNgn: ngnR.status === "fulfilled" ? ngnR.value : null,
    p2pZar: zarR.status === "fulfilled" ? zarR.value : null,
    p2pArs: arsR.status === "fulfilled" ? arsR.value : null,
  };
}

function venue(
  id: string,
  region: EmVenue["region"],
  name: string,
  kind: EmVenue["kind"],
  lastUsd: number | null,
  premiumPct: number | null,
): EmVenue {
  return { id, region, name, kind, lastUsd, premiumPct };
}

function packRegion(
  id: EmRegion["id"],
  name: string,
  venues: EmVenue[],
): EmRegion {
  const xs = venues.map((v) => v.premiumPct).filter((n): n is number => n != null);
  const premiumPct = median(xs);
  return { id, name, flow: flowOf(premiumPct), premiumPct, venues };
}

function toEm(raw: Awaited<ReturnType<typeof emRaw>>, refUsd: number | null): EmTape {
  const oasisUsd = raw.oasisAed != null && raw.aed ? raw.oasisAed / raw.aed : null;
  const lunoZarUsd = raw.lunoZar != null && raw.zar ? raw.lunoZar / raw.zar : null;
  const lunoNgnUsd = raw.lunoNgn != null && raw.ngn ? raw.lunoNgn / raw.ngn : null;
  const mbUsd = raw.mbBrl != null && raw.brl ? raw.mbBrl / raw.brl : null;
  const clpUsd = raw.budaClp != null && raw.clp ? raw.budaClp / raw.clp : null;
  const copUsd = raw.budaCop != null && raw.cop ? raw.budaCop / raw.cop : null;
  const regions = [
    packRegion("UAE", "UAE", [
      venue("bitoasis", "UAE", "BitOasis AED", "spot", oasisUsd, prem(oasisUsd, refUsd)),
    ]),
    packRegion("ME", "Middle East", [
      venue("sar", "ME", "OKX P2P USDT/SAR", "p2p", null, prem(raw.p2pSar, raw.sar)),
      venue("try", "ME", "OKX P2P USDT/TRY", "p2p", null, prem(raw.p2pTry, raw.tryFx)),
    ]),
    packRegion("RU", "Russia", [
      venue("rapira", "RU", "Rapira USDT/RUB", "p2p", null, prem(raw.usdtRub, raw.rub)),
    ]),
    packRegion("AF", "Africa", [
      venue("luno-zar", "AF", "Luno ZAR", "spot", lunoZarUsd, prem(lunoZarUsd, refUsd)),
      venue("luno-ngn", "AF", "Luno NGN", "spot", lunoNgnUsd, prem(lunoNgnUsd, refUsd)),
      venue("ngn-p2p", "AF", "OKX P2P USDT/NGN", "p2p", null, prem(raw.p2pNgn, raw.ngn)),
      venue("zar-p2p", "AF", "OKX P2P USDT/ZAR", "p2p", null, prem(raw.p2pZar, raw.zar)),
    ]),
    packRegion("SA", "South America", [
      venue("mb", "SA", "Mercado BTC-BRL", "spot", mbUsd, prem(mbUsd, refUsd)),
      venue("buda-clp", "SA", "Buda CLP", "spot", clpUsd, prem(clpUsd, refUsd)),
      venue("buda-cop", "SA", "Buda COP", "spot", copUsd, prem(copUsd, refUsd)),
      venue("ars-p2p", "SA", "OKX P2P USDT/ARS", "p2p", null, prem(raw.p2pArs, raw.ars)),
    ]),
  ];
  return {
    net: {
      inflow: regions.filter((r) => r.flow === "INFLOW").length,
      outflow: regions.filter((r) => r.flow === "OUTFLOW").length,
      flat: regions.filter((r) => r.flow === "FLAT").length,
    },
    regions,
  };
}

function num(v: string | number | undefined | null): number | null {
  if (v == null || v === "") return null;
  const n = typeof v === "number" ? v : Number(String(v).replace(/,/g, "").replace(/%/g, ""));
  return Number.isFinite(n) ? n : null;
}

function parseCsv(text: string): { header: string[]; rows: string[][] } {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter((l) => l.trim());
  const start = lines.findIndex((l) => {
    const h = l.split(",")[0]?.replace(/"/g, "").trim().toLowerCase();
    return h === "observation_date" || h === "date" || h === "period";
  });
  const table = start >= 0 ? lines.slice(start) : lines;
  const header = (table[0] ?? "").split(",").map((h) => h.replace(/"/g, "").trim());
  const rows = table.slice(1).map((line) => line.split(",").map((c) => c.replace(/"/g, "").trim()));
  return { header, rows };
}

function parseFredTxt(text: string, col = "VALUE"): RateSeries["points"] {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((l) => /^DATE\s+/i.test(l) && /VALUE/i.test(l));
  const points: { t: string; v: number }[] = [];
  for (const line of lines.slice(start >= 0 ? start + 1 : 0)) {
    const m = line.trim().match(/^(\d{4}-\d{2}-\d{2})\s+(-?\d+(?:\.\d+)?)/);
    if (!m) continue;
    const v = Number(m[2]);
    if (Number.isFinite(v)) points.push({ t: m[1]!, v });
  }
  void col;
  return points;
}

function isoDay(raw: string): string | null {
  const s = raw.trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) return `${m[3]}-${m[1]!.padStart(2, "0")}-${m[2]!.padStart(2, "0")}`;
  return null;
}

function seriesFromFred(csv: string, col: string, name: string, id: string): RateSeries {
  const { header, rows } = parseCsv(csv);
  const want = col.replace(/_PC1$/, "");
  const ci = header.findIndex((h) => h === col || h === want || h === "VALUE" || h === "value");
  const di = header.findIndex((h) => /^(observation_date|DATE|date|period)$/i.test(h));
  const points: { t: string; v: number }[] = [];
  if (ci >= 0 && di >= 0) {
    for (const row of rows) {
      const raw = (row[ci] ?? "").trim();
      if (!raw || raw === "." || raw === "NA" || raw === "n/a") continue;
      const v = Number(raw);
      const t = isoDay(row[di] ?? "");
      if (!t || !Number.isFinite(v)) continue;
      points.push({ t, v });
    }
  }
  if (!points.length) {
    for (const p of parseFredTxt(csv)) points.push(p);
  }
  const last = points[points.length - 1];
  return {
    id,
    name,
    last: last?.v ?? null,
    asOf: last?.t ?? null,
    points: points.slice(-180),
  };
}

function yoyFromLevels(s: RateSeries, id: string, name: string): RateSeries {
  const by = new Map<string, number>();
  for (const p of s.points) {
    const k = p.t.slice(0, 7);
    if (k && Number.isFinite(p.v)) by.set(k, p.v);
  }
  const keys = [...by.keys()].sort();
  const pts: { t: string; v: number }[] = [];
  for (const k of keys) {
    const y = Number(k.slice(0, 4));
    const m = k.slice(5, 7);
    const prev = by.get(`${y - 1}-${m}`);
    const v = by.get(k);
    if (prev && v && prev !== 0) pts.push({ t: `${k}-01`, v: ((v - prev) / prev) * 100 });
  }
  const last = pts[pts.length - 1];
  return { id, name, last: last?.v ?? s.last, asOf: last?.t ?? s.asOf, points: pts.slice(-24) };
}

async function fredCsv(ids: string, cosd: string): Promise<string> {
  const text = await getText(
    `https://fred.stlouisfed.org/graph/fredgraph.csv?id=${encodeURIComponent(ids)}&cosd=${cosd}`,
    3500,
  );
  if (!/observation_date|DATE|CPIAUCSL|M2SL|DTB3/i.test(text.slice(0, 4000))) {
    throw new Error(`FRED ${ids} not csv`);
  }
  if (/^\s*<!DOCTYPE/i.test(text) || /<html/i.test(text.slice(0, 200))) {
    throw new Error(`FRED ${ids} html wall`);
  }
  return text;
}

async function fredSeries(id: string, name: string, years: number, yoy = false): Promise<RateSeries> {
  const start = new Date();
  start.setUTCFullYear(start.getUTCFullYear() - years);
  const cosd = start.toISOString().slice(0, 10);
  const seriesId = yoy ? `${id}_PC1` : id;
  try {
    const csv = await fredCsv(seriesId, cosd);
    const s = seriesFromFred(csv, seriesId, name, id.toLowerCase());
    if (s.points.length) return yoy ? s : s;
    if (!yoy) return s;
  } catch {
    /* txt fallback */
  }
  try {
    const txt = await getText(`https://fred.stlouisfed.org/data/${seriesId}.txt`, 3500);
    if (/^\s*<!DOCTYPE/i.test(txt) || /<html/i.test(txt.slice(0, 200))) {
      throw new Error("FRED txt html wall");
    }
    const points = parseFredTxt(txt);
    const last = points[points.length - 1];
    const raw: RateSeries = {
      id: id.toLowerCase(),
      name,
      last: last?.v ?? null,
      asOf: last?.t ?? null,
      points: points.slice(-180),
    };
    return yoy ? raw : raw;
  } catch {
    return emptySeries(id.toLowerCase(), name);
  }
}

function emptySeries(id: string, name: string): RateSeries {
  return { id, name, last: null, asOf: null, points: [] };
}

type LlamaPool = {
  symbol?: string;
  project?: string;
  tvlUsd?: number;
  apy?: number;
  apyBase?: number;
  stablecoin?: boolean;
  ilRisk?: string;
  exposure?: string;
};

function pickStable(pools: LlamaPool[], symbol: StableYield["symbol"]): StableYield {
  const rows = pools.filter((p) => {
    const s = String(p.symbol ?? "").toUpperCase();
    if (s !== symbol) return false;
    if (p.ilRisk && p.ilRisk !== "no") return false;
    if (p.exposure && p.exposure !== "single") return false;
    if ((p.tvlUsd ?? 0) < 5_000_000) return false;
    const apy = p.apyBase ?? p.apy;
    return Number.isFinite(apy);
  });
  const usable = rows.length
    ? rows
    : pools.filter((p) => {
        const s = String(p.symbol ?? "").toUpperCase();
        return s === symbol && Number.isFinite(p.apy ?? p.apyBase) && (p.tvlUsd ?? 0) > 1_000_000;
      });
  let tvl = 0;
  let w = 0;
  let top: LlamaPool | null = null;
  for (const p of usable) {
    const t = p.tvlUsd ?? 0;
    const apy = Number(p.apyBase ?? p.apy);
    tvl += t;
    w += apy * t;
    if (!top || t > (top.tvlUsd ?? 0)) top = p;
  }
  return {
    symbol,
    apy: tvl > 0 ? w / tvl : null,
    tvlUsd: tvl || null,
    protocol: top?.project ?? null,
    poolCount: usable.length,
  };
}

let llamaCache: { t: number; v: StableYield[] } | null = null;

async function llamaStables(): Promise<StableYield[]> {
  if (llamaCache && Date.now() - llamaCache.t < 600_000) return llamaCache.v;
  const prev = snapCache?.value?.macro.stables;
  if (prev?.some((s) => s.apy != null) && llamaCache) return llamaCache.v;
  const j = await getJson<{ data?: LlamaPool[] }>("https://yields.llama.fi/pools", 4500);
  const pools = j.data ?? [];
  if (!pools.length) {
    if (prev?.length) return prev;
    throw new Error("llama empty");
  }
  const v = [pickStable(pools, "USDC"), pickStable(pools, "USDT"), pickStable(pools, "USD1")];
  llamaCache = { t: Date.now(), v };
  return v;
}

async function macroTape(): Promise<MacroTape> {
  const prev = snapCache?.value?.macro;
  const [tbillR, y2R, y10R, y30R, m2R, cpiR, pceR, llamaR] = await Promise.allSettled([
    fredSeries("DTB3", "T-bill 3m", 1, false),
    fredSeries("DGS2", "2-year", 1, false),
    fredSeries("DGS10", "10-year", 1, false),
    fredSeries("DGS30", "30-year", 1, false),
    fredSeries("M2SL", "M2", 5, false),
    fredSeries("CPIAUCSL", "CPI", 2, false),
    fredSeries("PCEPI", "PCE", 2, false),
    llamaStables(),
  ]);
  const take = <T,>(r: PromiseSettledResult<T>, fb: T): T => (r.status === "fulfilled" ? r.value : fb);
  const m2 = take(m2R, prev?.m2 ?? emptySeries("m2", "M2"));
  const cpi = take(cpiR, emptySeries("cpi", "CPI"));
  const pce = take(pceR, emptySeries("pce", "PCE"));
  const stables = take(llamaR, prev?.stables ?? []);
  const liveStables = stables.some((s) => s.apy != null) ? stables : prev?.stables ?? stables;
  return {
    tbill: take(tbillR, prev?.tbill ?? emptySeries("tbill", "T-bill 3m")),
    y2: take(y2R, prev?.y2 ?? emptySeries("y2", "2-year")),
    y10: take(y10R, prev?.y10 ?? emptySeries("y10", "10-year")),
    y30: take(y30R, prev?.y30 ?? emptySeries("y30", "30-year")),
    m2: m2.points.length ? m2 : prev?.m2 ?? m2,
    cpiYoy: cpi.points.length ? yoyFromLevels(cpi, "cpi", "CPI YoY") : prev?.cpiYoy ?? emptySeries("cpi", "CPI YoY"),
    pceYoy: pce.points.length ? yoyFromLevels(pce, "pce", "PCE YoY") : prev?.pceYoy ?? emptySeries("pce", "PCE YoY"),
    printed: m2Printed(m2.points.length ? m2 : prev?.m2 ?? m2),
    stables: liveStables,
    source: "FRED DTB3/DGS2/DGS10/DGS30/M2SL/CPI/PCE · DefiLlama stables",
  };
}

function m2Printed(m2: RateSeries): RateSeries {
  const pts = m2.points;
  const out: { t: string; v: number }[] = [];
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    if (!a || !b) continue;
    out.push({ t: b.t, v: b.v - a.v });
  }
  const last12 = out.slice(-12);
  const last = last12[last12.length - 1];
  return {
    id: "printed",
    name: "M2 printed (MoM $bn)",
    last: last?.v ?? null,
    asOf: last?.t ?? null,
    points: last12,
  };
}

const STRATEGY_BOOK: { symbol: string; name: string; kind: StrategyProduct["kind"]; coupon: string | null }[] = [
  { symbol: "MSTR", name: "Strategy common", kind: "common", coupon: null },
  { symbol: "STRK", name: "Strike convertible preferred", kind: "preferred", coupon: "8%" },
  { symbol: "STRF", name: "Strife preferred", kind: "preferred", coupon: "10%" },
  { symbol: "STRD", name: "Stride preferred", kind: "preferred", coupon: "fixed" },
  { symbol: "STRC", name: "Stretch preferred", kind: "preferred", coupon: "12% adj" },
  { symbol: "MSTY", name: "YieldMax MSTR income ETF", kind: "etf", coupon: "option" },
  { symbol: "MSTU", name: "T-Rex 2x long MSTR", kind: "etf", coupon: "2x" },
  { symbol: "MSTX", name: "Defiance 2x long MSTR", kind: "etf", coupon: "2x" },
  { symbol: "MSTZ", name: "T-Rex 2x inverse MSTR", kind: "etf", coupon: "-2x" },
];

function strategyTape(
  quoteRows: Quote[] = [],
  sparks: Map<string, { last: number | null; changePct: number | null; change6m: number | null; points: { t: number; v: number }[] }> = new Map(),
): StrategyTape {
  const prev = snapCache?.value?.strategy;
  const live = new Map(quoteRows.map((q) => [q.symbol.toUpperCase(), q]));
  const products: StrategyProduct[] = STRATEGY_BOOK.map((meta) => {
    const q = live.get(meta.symbol);
    const prevP = prev?.products.find((p) => p.symbol === meta.symbol);
    const spark = sparks.get(meta.symbol);
    const points = spark?.points?.length ? spark.points : prevP?.points ?? [];
    const last = q?.last ?? spark?.last ?? prevP?.last ?? null;
    const first = points[0]?.v;
    const change6m =
      spark?.change6m ??
      prevP?.change6m ??
      (first && last != null && first > 0 ? ((last - first) / first) * 100 : null);
    return {
      ...meta,
      last,
      changePct: q?.changePct ?? spark?.changePct ?? prevP?.changePct ?? null,
      change6m,
      points,
    };
  }).filter((p) => p.last != null);
  return {
    source: sparks.size ? "Yahoo chart 6m · CNBC last" : prev?.source ?? "CNBC last",
    products,
  };
}

function goldBtcFromQuotes(
  btcUsd: number | null,
  quoteRows: Quote[],
  goldUsdOverride?: number | null,
  sourceExtra?: string,
): GoldBtcTape {
  const prev = snapCache?.value?.goldBtc;
  const gc = quoteRows.find((q) => q.symbol === "GC=F" || q.symbol === "GC%3DF")?.last;
  const gld = quoteRows.find((q) => q.symbol === "GLD")?.last;
  const goldUsd =
    goldUsdOverride && goldUsdOverride > 100
      ? goldUsdOverride
      : gc && gc > 100
        ? gc
        : gld && gld > 10
          ? gld / 0.095
          : prev?.goldUsd ?? null;
  const px = btcUsd ?? prev?.btcUsd ?? null;
  const ozPerBtc = px != null && goldUsd != null && goldUsd > 0 ? px / goldUsd : prev?.ozPerBtc ?? null;
  const series = [...(prev?.series ?? [])];
  if (ozPerBtc != null && goldUsd != null && px != null) {
    const t = Date.now();
    const last = series[series.length - 1];
    if (!last || t - last.t > 12 * 3600 * 1000) series.push({ t, ozPerBtc, goldUsd, btcUsd: px });
    else series[series.length - 1] = { t, ozPerBtc, goldUsd, btcUsd: px };
    if (series.length > 64) series.splice(0, series.length - 64);
  }
  const src = [
    "Coinbase BTC",
    sourceExtra,
    gc && gc > 100 ? "CNBC GC=F" : gld && gld > 10 ? "GLD / 0.095 oz" : null,
  ]
    .filter(Boolean)
    .join(" · ");
  return {
    ozPerBtc,
    btcPerOz: ozPerBtc != null && ozPerBtc > 0 ? 1 / ozPerBtc : null,
    goldUsd,
    btcUsd: px,
    series,
    source: src || prev?.source || "Coinbase BTC · gold spot",
  };
}

/** query1 quote is 401 here. query2 chart is free and live. */
async function goldSpotUsd(): Promise<{ usd: number; source: string } | null> {
  try {
    const j = await getJson<{
      chart?: {
        result?: {
          meta?: { regularMarketPrice?: number };
          timestamp?: number[];
          indicators?: { quote?: { close?: (number | null)[] }[] };
        }[];
      };
    }>("https://query2.finance.yahoo.com/v8/finance/chart/GC=F?range=5d&interval=1d", 2000, {
      "User-Agent": "Mozilla/5.0 S1R1US-Lab/1.0",
    });
    const res = j.chart?.result?.[0];
    const live = Number(res?.meta?.regularMarketPrice);
    const closes = res?.indicators?.quote?.[0]?.close ?? [];
    const lastClose = [...closes].reverse().find((n) => n != null && Number(n) > 100);
    const usd = live > 100 ? live : Number(lastClose);
    if (Number.isFinite(usd) && usd > 100) return { usd, source: "Yahoo chart GC=F" };
  } catch {
    /* GLD / last-good */
  }
  return null;
}

type StrategySpark = {
  last: number | null;
  changePct: number | null;
  change6m: number | null;
  points: { t: number; v: number }[];
};

async function yahooChartSpark(symbol: string): Promise<StrategySpark> {
  const j = await getJson<{
    chart?: {
      result?: {
        meta?: { regularMarketPrice?: number; chartPreviousClose?: number; regularMarketChangePercent?: number };
        timestamp?: number[];
        indicators?: { quote?: { close?: (number | null)[] }[] };
      }[];
    };
  }>(`https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=6mo&interval=1wk`, 2200, {
    "User-Agent": "Mozilla/5.0 S1R1US-Lab/1.0",
  });
  const res = j.chart?.result?.[0];
  const ts = res?.timestamp ?? [];
  const closes = res?.indicators?.quote?.[0]?.close ?? [];
  const points: { t: number; v: number }[] = [];
  for (let i = 0; i < ts.length; i++) {
    const v = closes[i];
    const t = ts[i];
    if (t != null && v != null && Number.isFinite(v)) points.push({ t: t * 1000, v: Number(v) });
  }
  const live = Number(res?.meta?.regularMarketPrice);
  const last = Number.isFinite(live) && live > 0 ? live : points[points.length - 1]?.v ?? null;
  const first = points[0]?.v;
  const change6m = first && last != null && first > 0 ? ((last - first) / first) * 100 : null;
  const prevClose = Number(res?.meta?.chartPreviousClose);
  const changePct =
    last != null && Number.isFinite(prevClose) && prevClose > 0
      ? ((last - prevClose) / prevClose) * 100
      : Number.isFinite(Number(res?.meta?.regularMarketChangePercent))
        ? Number(res?.meta?.regularMarketChangePercent)
        : null;
  return { last, changePct, change6m, points };
}

async function strategySparks(): Promise<Map<string, StrategySpark>> {
  const out = new Map<string, StrategySpark>();
  const rows = await Promise.allSettled(STRATEGY_BOOK.map((m) => capLane(yahooChartSpark(m.symbol), 2200)));
  rows.forEach((r, i) => {
    if (r.status === "fulfilled" && (r.value.points.length > 2 || r.value.last != null)) {
      out.set(STRATEGY_BOOK[i]!.symbol, r.value);
    }
  });
  return out;
}

function metalsFromQuotes(quoteRows: Quote[], meta: Record<string, MetalMeta>, symbols: string[]): MetalHolding[] {
  const by = new Map(quoteRows.map((q) => [q.symbol.toUpperCase(), q]));
  return symbols.map((sym) => {
    const m = meta[sym]!;
    const q = by.get(sym);
    return {
      symbol: sym,
      name: m.name,
      kind: m.kind,
      last: q?.last ?? null,
      changePct: q?.changePct ?? null,
      aumUsd: null,
      oz: null,
      held: m.held,
    };
  });
}

function howHeld(name: string, href: string): string {
  const n = name.toLowerCase();
  const h = href.toLowerCase();
  if (/\/usa\/|\/china\/|\/uk\/|\/el-salvador\/|\/bhutan\/|\/ukraine|\/germany\/|\/finland\/|\/oman\/|\/venezuela/.test(h) || /^(usa|china|uk|el salvador|bhutan)$/i.test(name.trim())) {
    return "Government — seized, lost, or strategic reserve";
  }
  if (/wrapped|cbbtc|wbtc/.test(n)) return "Wrapped BTC — tokenized on other chains";
  if (/casascius/.test(n)) return "Physical Casascius coins";
  if (/bitmex|binance|coinbase|kraken|okx|bitfinex|gemini/.test(n) && !/etf|trust/.test(n)) {
    return "Exchange custody (hot/cold wallets)";
  }
  if (/etf|etp|ishares|wise origin|ark 21|vaneck|bitwise|purpose|hashdex|galaxy/.test(n) || /ibit|fbtc|bitb|arkb|hodl/.test(h)) {
    return "Spot ETF / ETP — issuer + qualified custodian";
  }
  if (/grayscale|trust/.test(n)) return "Investment trust — custodian";
  if (/block\.one|tether/.test(n)) return "Private company treasury";
  return "Corporate treasury — self-custody / qualified custodian";
}

type MetalMeta = { name: string; kind: MetalHolding["kind"]; held: string; ozPerShare: number | null };

const GOLD_META: Record<string, MetalMeta> = {
  GLD: { name: "SPDR Gold Shares", kind: "etf", held: "Allocated LBMA bars — ~0.095 oz / share", ozPerShare: 0.095 },
  IAU: { name: "iShares Gold Trust", kind: "etf", held: "Allocated vault — fractional oz / share", ozPerShare: 0.02 },
  PHYS: { name: "Sprott Physical Gold Trust", kind: "trust", held: "Allocated vault, redeemable for metal", ozPerShare: null },
  GDX: { name: "VanEck Gold Miners", kind: "etf", held: "Miner equity — not ounces in a vault", ozPerShare: null },
  NEM: { name: "Newmont", kind: "miner", held: "Producer treasury + reserves", ozPerShare: null },
  GOLD: { name: "Barrick Mining", kind: "miner", held: "Producer treasury + reserves", ozPerShare: null },
};

const SILVER_META: Record<string, MetalMeta> = {
  SLV: { name: "iShares Silver Trust", kind: "etf", held: "Allocated COMEX vault — ~1 oz / share", ozPerShare: 1 },
  SIVR: { name: "abrdn Physical Silver Shares", kind: "etf", held: "LBMA bars — physical ETF", ozPerShare: 1 },
  PSLV: { name: "Sprott Physical Silver Trust", kind: "trust", held: "Allocated vault, redeemable for metal", ozPerShare: null },
  SIL: { name: "Global X Silver Miners", kind: "etf", held: "Miner equity — not ounces in a vault", ozPerShare: null },
  PAAS: { name: "Pan American Silver", kind: "miner", held: "Producer treasury + reserves", ozPerShare: null },
  WPM: { name: "Wheaton Precious Metals", kind: "miner", held: "Streaming / royalty — not unencumbered vault", ozPerShare: null },
};

async function metalHoldings(symbols: string[], meta: Record<string, MetalMeta>): Promise<MetalHolding[]> {
  const fallback = () =>
    symbols.map((sym) => ({
      symbol: sym,
      name: meta[sym]!.name,
      kind: meta[sym]!.kind,
      last: null,
      changePct: null,
      aumUsd: null,
      oz: null,
      held: meta[sym]!.held,
    }));
  try {
    const y = await getJson<{
      quoteResponse?: {
        result?: {
          symbol?: string;
          shortName?: string;
          regularMarketPrice?: number;
          regularMarketChangePercent?: number;
          marketCap?: number;
          sharesOutstanding?: number;
        }[];
      };
    }>(
      `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols.join(",")}`,
      10000,
      { "User-Agent": "Mozilla/5.0 S1R1US-Lab/1.0" },
    );
    const by = new Map((y.quoteResponse?.result ?? []).map((r) => [String(r.symbol).toUpperCase(), r]));
    return symbols.map((sym) => {
      const m = meta[sym]!;
      const r = by.get(sym);
      const last = r?.regularMarketPrice ?? null;
      const shares = r?.sharesOutstanding ?? null;
      let oz: number | null = null;
      if (m.kind !== "miner" && m.ozPerShare && shares && shares > 0) oz = shares * m.ozPerShare;
      else if (m.kind !== "miner" && last && r?.marketCap && m.ozPerShare) oz = (r.marketCap / last) * m.ozPerShare;
      return {
        symbol: sym,
        name: m.name,
        kind: m.kind,
        last,
        changePct: r?.regularMarketChangePercent ?? null,
        aumUsd: r?.marketCap ?? null,
        oz,
        held: m.held,
      };
    });
  } catch {
    return fallback();
  }
}

async function holdersTape(): Promise<HoldersTape> {
  const html = await bitboTreasuriesHtml();
  const re =
    /<td class="td-rank"[^>]*>\s*(\d+)\s*<\/td>\s*<td class="td-company"[^>]*>\s*<a href="([^"]+)">([^<]+)<\/a>[\s\S]*?data-tooltip="([^"]*)"[\s\S]*?<td class="td-company_btc"[^>]*>\s*([^<]+)<\/td>\s*<td class="td-value[^"]*"[^>]*>\s*([^<]+)<\/td>\s*<td class="td-company_percent"[^>]*>\s*([^<]+)<\/td>/gi;
  const by = new Map<string, BtcHolder>();
  for (const m of html.matchAll(re)) {
    const href = m[2] ?? "";
    const name = (m[3] ?? "").replace(/\s+/g, " ").trim();
    const btc = Number(String(m[5] ?? "").replace(/,/g, ""));
    if (!name || !Number.isFinite(btc) || btc <= 0) continue;
    const usdRaw = String(m[6] ?? "").replace(/[$,]/g, "");
    const usd = Number(usdRaw);
    const share = num(m[7]);
    const row: BtcHolder = {
      rank: 0,
      name,
      btc,
      usd: Number.isFinite(usd) ? usd : null,
      sharePct: share,
      country: (m[4] ?? "").trim() || null,
      held: howHeld(name, href),
      url: href.startsWith("http") ? href : `https://bitbo.io${href}`,
    };
    const prev = by.get(href);
    if (!prev || row.btc > prev.btc) by.set(href, row);
  }
  const ranked = [...by.values()].sort((a, b) => b.btc - a.btc);
  const holders = ranked
    .filter((h) => !/satoshi/i.test(h.name))
    .slice(0, 20)
    .map((h, i) => ({ ...h, rank: i + 1 }));
  return {
    source: "Bitbo treasuries · CNBC gold/silver last · IMF/WGC official gold",
    holders,
    gold: [],
    silver: [],
    goldRegions: GOLD_REGIONS,
    goldBanks: GOLD_BANKS,
    btcRegions: BTC_REGIONS,
  };
}

function rejected<T>(): PromiseSettledResult<T> {
  return { status: "rejected", reason: new Error("deferred") };
}

function skeletonSnapshot(): DeskSnapshot {
  return stitchCore(
    Date.now(),
    [],
    rejected(),
    rejected(),
    rejected(),
    rejected(),
    rejected(),
    rejected(),
    rejected(),
    rejected(),
    snapCache?.value,
  );
}

function hydrateLastGood() {
  if (snapCache?.value) return;
  const g = readLastGood();
  if (!g?.snap) return;
  snapCache = { at: g.at, value: g.snap };
}

export function getLiveSnapshot() {
  ensureWarmLoop();
  return loadSnapshot(false);
}

let warmTimer: ReturnType<typeof setInterval> | null = null;
function ensureWarmLoop() {
  if (typeof window !== "undefined") return;
  if (isTapeFrozen()) return;
  if (warmTimer) return;
  hydrateLastGood();
  warmTimer = setInterval(() => {
    if (isTapeFrozen()) return;
    void loadSnapshot(false).catch(() => undefined);
  }, DESK_POLL_MS);
  void loadSnapshot(false).catch(() => undefined);
}

export async function loadSnapshot(force: boolean): Promise<DeskSnapshot> {
  ensureWarmLoop();
  hydrateLastGood();
  const now = Date.now();
  const cached = snapCache?.value;
  const age = cached ? now - (snapCache!.at ?? 0) : Infinity;
  if (isTapeFrozen() && cached) return cached;
  if (!force && cached && age < SNAP_FRESH_MS) return cached;
  if (isTapeFrozen()) return cached ?? skeletonSnapshot();
  const pendingAge = snapCache?.pendingAt != null ? now - snapCache.pendingAt : Infinity;
  if (snapCache?.pending && pendingAge > CORE_MS + 400) {
    resetSlots();
    snapCache.pending = undefined;
    snapCache.pendingAt = undefined;
  }
  const pending = snapCache?.pending ?? startBuild();
  const wait = !cached || force ? CORE_MS : 400;
  try {
    return await Promise.race([
      pending,
      sleepMs(wait).then(() => snapCache?.value ?? skeletonSnapshot()),
    ]);
  } catch {
    return snapCache?.value ?? skeletonSnapshot();
  }
}

function startBuild(): Promise<DeskSnapshot> {
  const pendingAt = Date.now();
  const pending = buildSnapshot().then(
    (value) => {
      if (snapCache) {
        snapCache.pending = undefined;
        snapCache.pendingAt = undefined;
        if (!snapCache.value) snapCache.value = value;
      } else {
        snapCache = { at: Date.now(), value };
      }
      return snapCache.value ?? value;
    },
    (_err: unknown) => {
      const keep = snapCache?.value ?? skeletonSnapshot();
      snapCache = { at: snapCache?.at ?? Date.now(), value: keep };
      return keep;
    },
  );
  snapCache = { at: snapCache?.at ?? pendingAt, pendingAt, value: snapCache?.value, pending };
  return pending;
}

function capLane<T>(p: Promise<T>, ms = 2_000): Promise<T> {
  return Promise.race([
    p,
    sleepMs(ms).then(() => {
      throw new Error("lane timeout");
    }),
  ]);
}

async function etfFlowOnly(): Promise<CapitalTape> {
  const prev = snapCache?.value?.capital;
  const empty: CapitalTape = {
    asOf: null,
    source: "SoSoValue US flow",
    bars: prev?.bars ?? [],
    dats: prev?.dats ?? [],
    etfs: prev?.etfs ?? [],
    etfFlow: prev?.etfFlow ?? null,
  };
  try {
    const j = await postJson<{
      data?: { date: string; totalNetInflow: number; totalNetAssets?: number }[];
    }>("https://api.sosovalue.xyz/openapi/v2/etf/historicalInflowChart", { type: "us-btc-spot" }, 2000);
    const row = j.data?.[0];
    if (row && Number.isFinite(row.totalNetInflow)) {
      return { ...empty, asOf: row.date ?? empty.asOf, etfFlow: row.totalNetInflow };
    }
  } catch {
    /* keep previous */
  }
  return empty;
}

function logCycle(ev: Record<string, unknown>) {
  const fails = cycleStats.fails;
  if (fails.length) recordDeskFails(fails, new Date().toISOString());
  console.info("[desk-cycle]", JSON.stringify(ev));
  if (typeof window !== "undefined") return;
  void import("node:fs")
    .then((fs) => {
      try {
        fs.writeFileSync("/tmp/desk-cycle.json", JSON.stringify({ ...ev, stats: cycleStats }, null, 2));
      } catch {
        /* preview */
      }
    })
    .catch(() => undefined);
}

const EMPTY_ASIA_RAW = {
  krw: null as number | null,
  hkd: null as number | null,
  cny: null as number | null,
  upbitKrw: null as number | null,
  upbitVol: null as number | null,
  upbitChg: null as number | null,
  bithumbKrw: null as number | null,
  bithumbVol: null as number | null,
  bithumbChg: null as number | null,
  hashkeyUsdt: null as number | null,
  hashkeyVol: null as number | null,
  okxUsdt: null as number | null,
  okxVol: null as number | null,
  htxUsdt: null as number | null,
  htxVol: null as number | null,
  usdtCny: null as number | null,
};

const EMPTY_EM_RAW = {
  aed: null as number | null,
  sar: null as number | null,
  tryFx: null as number | null,
  rub: null as number | null,
  zar: null as number | null,
  ngn: null as number | null,
  brl: null as number | null,
  ars: null as number | null,
  clp: null as number | null,
  cop: null as number | null,
  oasisAed: null as number | null,
  usdtRub: null as number | null,
  lunoZar: null as number | null,
  lunoNgn: null as number | null,
  mbBrl: null as number | null,
  budaClp: null as number | null,
  budaCop: null as number | null,
  p2pSar: null as number | null,
  p2pTry: null as number | null,
  p2pNgn: null as number | null,
  p2pZar: null as number | null,
  p2pArs: null as number | null,
};

function stitchCore(
  t0: number,
  errors: string[],
  tapeR: PromiseSettledResult<Awaited<ReturnType<typeof coinbaseTape>>>,
  posR: PromiseSettledResult<Awaited<ReturnType<typeof positioning>>>,
  fgR: PromiseSettledResult<Awaited<ReturnType<typeof fearGreed>>>,
  onR: PromiseSettledResult<Awaited<ReturnType<typeof onchain>>>,
  qR: PromiseSettledResult<Quote[]>,
  aR: PromiseSettledResult<Awaited<ReturnType<typeof asiaRaw>>>,
  capR: PromiseSettledResult<CapitalTape>,
  whR: PromiseSettledResult<WhalePrint[]>,
  prev: DeskSnapshot | undefined,
): DeskSnapshot {
  const tape = settled("coinbase", errors, tapeR, {
    btc: {
      price: prev?.btc.price ?? null,
      bid: prev?.btc.bid ?? null,
      ask: prev?.btc.ask ?? null,
      volume24h: prev?.btc.volume24h ?? null,
      volumeAvg24h: prev?.btc.volumeAvg24h ?? null,
      high24h: prev?.btc.high24h ?? null,
      low24h: prev?.btc.low24h ?? null,
      changePct: prev?.btc.changePct ?? null,
      source: "Coinbase Exchange BTC-USD",
    },
    candles: prev?.candles ?? [],
    rsi14: prev?.rsi14 ?? null,
    rsiAvg: prev?.rsiAvg ?? null,
    macd: prev?.macd ?? null,
    macd50: prev?.macd50 ?? null,
    macd200: prev?.macd200 ?? null,
    ema21: prev?.ema21 ?? null,
    sma50: prev?.sma50 ?? null,
    bbPct: prev?.bbPct ?? null,
    volRatio: prev?.volRatio ?? null,
    atr: prev?.atr ?? null,
    heatmap: prev?.heatmap ?? [],
  });
  const pos = settled("leverage", errors, posR, {
    longShort: prev?.positioning.longShort ?? null,
    openInterestUsd: prev?.positioning.openInterestUsd ?? null,
    fundingRate: prev?.positioning.fundingRate ?? null,
    source: prev?.positioning.source ?? "public perps",
    lsHistory: prev?.positioning.lsHistory ?? [],
    venues: (prev?.positioning.venues ?? []) as LeverageVenue[],
    buyWallUsd: prev?.positioning.buyWallUsd ?? null,
    sellWallUsd: prev?.positioning.sellWallUsd ?? null,
    wallBias: prev?.positioning.wallBias ?? ("FLAT" as const),
    liquidations: [],
  });
  const cbBuy = tape.heatmap.reduce((s, b) => s + b.bidUsd, 0);
  const cbSell = tape.heatmap.reduce((s, b) => s + b.askUsd, 0);
  const venues: LeverageVenue[] = [
    ...pos.venues.filter((v) => v.id !== "coinbase"),
    {
      id: "coinbase",
      name: "Coinbase L2 (80)",
      longShort: null,
      fundingRate: null,
      openInterestUsd: null,
      buyWallUsd: cbBuy || null,
      sellWallUsd: cbSell || null,
      liqLongUsd: null,
      liqShortUsd: null,
    },
  ];
  const buyWallUsd = (pos.buyWallUsd ?? 0) + cbBuy || null;
  const sellWallUsd = (pos.sellWallUsd ?? 0) + cbSell || null;
  const wallBias: "SELL" | "BUY" | "FLAT" =
    sellWallUsd != null && buyWallUsd != null && sellWallUsd > buyWallUsd * 1.35
      ? "SELL"
      : sellWallUsd != null && buyWallUsd != null && buyWallUsd > sellWallUsd * 1.35
        ? "BUY"
        : pos.wallBias;
  const quoteRows = settled("cnbc", errors, qR, prev?.quotes ?? []);
  const cap = settled("capital", errors, capR, prev?.capital ?? {
    asOf: null,
    source: "SoSoValue US flow",
    bars: [],
    dats: [],
    etfs: [],
    etfFlow: null,
  });
  const asia = toAsia(settled("asia", errors, aR, EMPTY_ASIA_RAW), tape.btc.price);
  const snapshot: DeskSnapshot = {
    fetchedAt: new Date().toISOString(),
    pullMs: Date.now() - t0,
    errors,
    btc: tape.btc,
    rsi14: tape.rsi14,
    rsiAvg: tape.rsiAvg,
    macd: tape.macd,
    macd50: tape.macd50,
    macd200: tape.macd200,
    ema21: tape.ema21,
    sma50: tape.sma50,
    bbPct: tape.bbPct,
    volRatio: tape.volRatio,
    atr: tape.atr,
    candles: tape.candles.slice(-320),
    fearGreed: settled("fear-greed", errors, fgR, prev?.fearGreed ?? null),
    positioning: {
      longShort: pos.longShort,
      openInterestUsd: pos.openInterestUsd,
      fundingRate: pos.fundingRate,
      source: pos.source,
      lsHistory: pos.lsHistory,
      venues,
      buyWallUsd,
      sellWallUsd,
      wallBias,
    },
    heatmap: tape.heatmap,
    liqMap: liqHeatmap({
      last: tape.btc.price,
      oiUsd: pos.openInterestUsd,
      ls: pos.longShort,
      liquidations: pos.liquidations,
      book: tape.heatmap,
    }),
    whales: settled("whales", errors, whR, prev?.whales ?? []).map((w) =>
      w.usd > 0 || tape.btc.price == null ? w : { ...w, usd: w.btc * tape.btc.price },
    ),
    onchain: settled("onchain", errors, onR, prev?.onchain ?? {
      height: null,
      hashrateEh: null,
      difficulty: null,
      source: "blockchain.info mempool",
      regions: [],
      feeFast: null,
      feeEcon: null,
      btcDom: null,
    }),
    quotes: quoteRows,
    filings: prev?.filings ?? [],
    headlines: prev?.headlines ?? [],
    predictionMarkets: prev?.predictionMarkets ?? [],
    asia: asia.kimchiPct != null || asia.venues.some((v) => v.lastUsd != null) ? asia : prev?.asia ?? asia,
    em: prev?.em ?? toEm(EMPTY_EM_RAW, tape.btc.price),
    capital: cap.etfFlow != null || cap.dats.length ? cap : prev?.capital ?? cap,
    pools: buildSlowCapital(quoteRows, venues),
    macro: prev?.macro ?? {
      tbill: emptySeries("tbill", "T-bill 3m"),
      y2: emptySeries("y2", "2-year"),
      y10: emptySeries("y10", "10-year"),
      y30: emptySeries("y30", "30-year"),
      m2: emptySeries("m2", "M2"),
      cpiYoy: emptySeries("cpi", "CPI YoY"),
      pceYoy: emptySeries("pce", "PCE YoY"),
      printed: emptySeries("printed", "M2 printed (MoM $bn)"),
      stables: [],
      source: "FRED",
    },
    strategy: strategyTape(quoteRows),
    goldBtc: goldBtcFromQuotes(tape.btc.price, quoteRows),
    holders: {
      source: prev?.holders.source ?? "Bitbo treasuries · CNBC metals",
      holders: prev?.holders.holders ?? [],
      gold: metalsFromQuotes(quoteRows, GOLD_META, [...GOLD_TICKERS]),
      silver: metalsFromQuotes(quoteRows, SILVER_META, [...SILVER_TICKERS]),
      goldRegions: GOLD_REGIONS,
      goldBanks: GOLD_BANKS,
      btcRegions: BTC_REGIONS,
    },
    feedAudit: { at: "", pullMs: 0, ok: 0, fail: 0, rows: [] },
  };
  snapshot.strategy = snapshot.strategy.products.length ? snapshot.strategy : prev?.strategy ?? snapshot.strategy;
  if (snapshot.btc.price != null) {
    snapshot.errors = errors.filter((e) => !/lane timeout|dead host|timeout /i.test(e));
  }
  snapshot.feedAudit = scoreFeeds(snapshot);
  return snapshot;
}

async function buildSnapshot(): Promise<DeskSnapshot> {
  try {
    const { ensureLiveSimScheduler } = await import("./live-sim.server");
    ensureLiveSimScheduler();
  } catch {
    /* preview */
  }
  if (isTapeFrozen()) {
    return snapCache?.value ?? readLastGood()?.snap ?? skeletonSnapshot();
  }
  resetCycleStats();
  const t0 = Date.now();
  const errors: string[] = [];
  const prev = snapCache?.value;
  console.info("[desk-cycle] core start");
  let tapeR: PromiseSettledResult<Awaited<ReturnType<typeof coinbaseTape>>> = rejected();
  try {
    tapeR = { status: "fulfilled", value: await capLane(coinbaseTape(), 1_800) };
  } catch (e) {
    tapeR = { status: "rejected", reason: e };
  }
  const early = stitchCore(t0, errors, tapeR, rejected(), rejected(), rejected(), rejected(), rejected(), rejected(), rejected(), prev);
  snapCache = { at: Date.now(), pendingAt: snapCache?.pendingAt, value: early, pending: snapCache?.pending };
  const [posR, fgR, onR, qR, aR, capR, whR] = await Promise.allSettled([
    capLane(positioning(), 1600),
    capLane(fearGreed(), 1200),
    capLane(onchain(), 1800),
    capLane(quotes(), 1600),
    capLane(asiaRaw(), 1800),
    capLane(etfFlowOnly(), 1600),
    capLane(whaleTape(null), 2800),
  ]);
  const snap = stitchCore(t0, errors, tapeR, posR, fgR, onR, qR, aR, capR, whR, prev);
  snapCache = { at: Date.now(), pendingAt: snapCache?.pendingAt, value: snap, pending: snapCache?.pending };
  if (snap.btc.price != null) writeLastGood(snap);
  logCycle({
    phase: "core",
    ms: Date.now() - t0,
    price: snap.btc.price,
    errors: snap.errors,
    rsi: snap.rsi14,
    fg: snap.fearGreed?.value ?? null,
  });
  void assembleFill(t0, snap);
  return snap;
}

async function assembleFill(t0: number, core: DeskSnapshot) {
  try {
    await sleepMs(120);
    try {
      await bitboTreasuriesHtml();
    } catch {
      /* holders/capital use last cache */
    }
    const [capR, hoR, hR, fR, eR, macR, aR, cutR, qR, fgR, whR, goldR, stR, predR] = await Promise.allSettled([
      capLane(capitalTape(), 4000),
      capLane(holdersTape(), 4000),
      capLane(headlines(), 3500),
      capLane(filings(), 3500),
      capLane(emRaw(), 3500),
      capLane(macroTape(), 7000),
      capLane(asiaRaw(), 4000),
      capLane(restoreCutFeeds(core), 2800),
      capLane(quotes(), 2500),
      capLane(fearGreed(), 1500),
      capLane(whaleTape(core.btc.price), 2800),
      capLane(goldSpotUsd(), 2000),
      capLane(strategySparks(), 7000),
      capLane(fetchPredictionMarkets(), 4500),
    ]);
    const silent: string[] = [];
    const capital = settled("capital", silent, capR, core.capital);
    const holders = settled("holders", silent, hoR, core.holders);
    const headlinesV = settled("rss", silent, hR, core.headlines);
    const whalesV = settled("whales", silent, whR, core.whales);
    const filingsV = settled("sec", silent, fR, core.filings);
    const predV = settled("pred", silent, predR, core.predictionMarkets);
    const em = toEm(settled("em", silent, eR, EMPTY_EM_RAW), core.btc.price);
    const macro = settled("macro", silent, macR, core.macro);
    const asia = toAsia(settled("asia", silent, aR, EMPTY_ASIA_RAW), core.btc.price);
    const quoteRows = settled("cnbc", silent, qR, core.quotes);
    let quotesLive = quoteRows.length ? quoteRows : core.quotes;
    const goldSpot = goldR.status === "fulfilled" ? goldR.value : null;
    const sparks = stR.status === "fulfilled" ? stR.value : new Map();
    if (goldSpot && !quotesLive.some((q) => q.symbol === "GC=F" || q.symbol === "GC%3DF")) {
      quotesLive = [...quotesLive, { symbol: "GC=F", name: "Gold COMEX", last: goldSpot.usd, changePct: null }];
    }
    const fg = settled("fear-greed", silent, fgR, core.fearGreed);
    const restored = cutR.status === "fulfilled" ? cutR.value : null;
    const venues = restored?.venues?.length ? restored.venues : core.positioning.venues;
    const onchain = restored?.onchain ?? core.onchain;
    let oiTot = 0;
    let lsAcc = 0;
    let oiW = 0;
    let fundAcc = 0;
    let fundW = 0;
    for (const v of venues) {
      if (v.openInterestUsd != null && v.openInterestUsd > 0) {
        oiTot += v.openInterestUsd;
        if (v.longShort != null) {
          lsAcc += v.longShort * v.openInterestUsd;
          oiW += v.openInterestUsd;
        }
        if (v.fundingRate != null) {
          fundAcc += v.fundingRate * v.openInterestUsd;
          fundW += v.openInterestUsd;
        }
      }
    }
    const positioning = {
      ...core.positioning,
      venues,
      openInterestUsd: oiTot || core.positioning.openInterestUsd,
      longShort: oiW > 0 ? lsAcc / oiW : core.positioning.longShort,
      fundingRate: fundW > 0 ? fundAcc / fundW : core.positioning.fundingRate,
    };
    const next: DeskSnapshot = {
      ...core,
      pullMs: Date.now() - t0,
      errors: core.errors,
      positioning,
      onchain,
      quotes: quotesLive,
      fearGreed: fg ?? core.fearGreed,
      strategy: strategyTape(quotesLive, sparks),
      goldBtc: goldBtcFromQuotes(core.btc.price, quotesLive, goldSpot?.usd, goldSpot?.source ?? undefined)
        .ozPerBtc != null
        ? goldBtcFromQuotes(core.btc.price, quotesLive, goldSpot?.usd, goldSpot?.source ?? undefined)
        : core.goldBtc,
      capital: capital.dats.length || capital.etfFlow != null ? capital : core.capital,
      holders: {
        ...holders,
        gold: core.holders.gold.length ? core.holders.gold : holders.gold,
        silver: core.holders.silver.length ? core.holders.silver : holders.silver,
        holders: holders.holders.length ? holders.holders : core.holders.holders,
      },
      headlines: headlinesV.length ? headlinesV : core.headlines,
      whales: whalesV.length ? whalesV : core.whales,
      filings: filingsV.length ? filingsV : core.filings,
      predictionMarkets: predV.length ? predV : core.predictionMarkets,
      em: em.regions.some((r) => r.premiumPct != null) ? em : core.em,
      asia: asia.kimchiPct != null ? asia : core.asia,
      macro: macro.tbill.last != null || macro.m2.last != null ? macro : core.macro,
    };
    next.feedAudit = scoreFeeds(next);
    snapCache = { at: Date.now(), value: next };
    writeLastGood(next);
    logCycle({
      phase: "fill",
      ms: Date.now() - t0,
      price: next.btc.price,
      errors: next.errors,
      holders: next.holders.holders.length,
      headlines: next.headlines.length,
    });
  } catch (e) {
    logCycle({ phase: "fill-fail", err: e instanceof Error ? e.message : String(e) });
  }
}
