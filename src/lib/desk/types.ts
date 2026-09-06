export type Stance = "ACCUMULATE" | "BUY" | "HOLD" | "WAIT" | "TRIM";

export type BotId =
  | "filings"
  | "earnings"
  | "sector"
  | "sentiment"
  | "rotation"
  | "coordinator"
  | "helios";

export type Quote = {
  symbol: string;
  name: string;
  last: number | null;
  changePct: number | null;
};

export type Filing = {
  cik: string;
  name: string;
  form: string;
  filed: string;
  title: string;
};

export type Headline = {
  source: string;
  title: string;
  url: string;
  published: string;
};

export type HeatBucket = {
  price: number;
  bidUsd: number;
  askUsd: number;
};

export type LiqBand = {
  price: number;
  longUsd: number;
  shortUsd: number;
};

export type LsPoint = {
  t: number;
  ratio: number;
};

export type WhalePrint = {
  id: string;
  venue: "Coinbase" | "Hyperliquid" | "OKX" | "On-chain";
  side: "buy" | "sell" | "move";
  btc: number;
  usd: number;
  t: number;
};

export type Candle = {
  t: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type HashRegion = {
  id: string;
  name: string;
  share: number;
  eh: number;
};

export type CapitalBar = {
  id: "etf" | "dat" | "elsal" | "latam" | "swf" | "coinbase" | "hl" | "others";
  name: string;
  usd: number | null;
  note: string;
};

export type DatHolding = {
  name: string;
  ticker: string;
  btc: number;
  usd: number;
};

export type CapitalTape = {
  asOf: string | null;
  source: string;
  bars: CapitalBar[];
  dats: DatHolding[];
  etfs: DatHolding[];
  etfFlow: number | null;
};

export type PoolStatus = "holding" | "law" | "bill" | "pipe" | "watch";

export type SlowPool = {
  id: string;
  name: string;
  sleeve: string;
  status: PoolStatus;
  disclosedUsd: number | null;
  proxy: string | null;
  proxyChg: number | null;
  vsIbit: number | null;
  note: string;
};

export type SlowCapitalTape = {
  source: string;
  reviewedAt: string;
  pools: SlowPool[];
};

export type MacroPoint = { t: string; v: number };

export type RateSeries = {
  id: string;
  name: string;
  last: number | null;
  asOf: string | null;
  points: MacroPoint[];
};

export type StableYield = {
  symbol: "USDT" | "USDC" | "USD1";
  apy: number | null;
  tvlUsd: number | null;
  protocol: string | null;
  poolCount: number;
};

export type GoldBtcPoint = {
  t: number;
  ozPerBtc: number;
  goldUsd: number;
  btcUsd: number;
};

export type GoldBtcTape = {
  ozPerBtc: number | null;
  btcPerOz: number | null;
  goldUsd: number | null;
  btcUsd: number | null;
  series: GoldBtcPoint[];
  source: string;
};

export type MacroTape = {
  tbill: RateSeries;
  y2: RateSeries;
  y10: RateSeries;
  y30: RateSeries;
  m2: RateSeries;
  cpiYoy: RateSeries;
  pceYoy: RateSeries;
  printed: RateSeries;
  stables: StableYield[];
  source: string;
};

export type StrategyProduct = {
  symbol: string;
  name: string;
  kind: "common" | "preferred" | "etf";
  coupon: string | null;
  last: number | null;
  changePct: number | null;
  change6m: number | null;
  points: { t: number; v: number }[];
};

export type StrategyTape = {
  source: string;
  products: StrategyProduct[];
};

export type BtcHolder = {
  rank: number;
  name: string;
  btc: number;
  usd: number | null;
  sharePct: number | null;
  country: string | null;
  held: string;
  url: string;
};

export type MetalHolding = {
  symbol: string;
  name: string;
  kind: "etf" | "trust" | "miner";
  last: number | null;
  changePct: number | null;
  aumUsd: number | null;
  oz: number | null;
  held: string;
};

export type GoldRegion = {
  id: string;
  name: string;
  tonnes: number;
  estimate: boolean;
  note: string;
  fill: string;
};

export type BtcRegion = {
  id: string;
  name: string;
  btc: number;
  estimate: boolean;
  note: string;
  fill: string;
};

export type HoldersTape = {
  source: string;
  holders: BtcHolder[];
  gold: MetalHolding[];
  silver: MetalHolding[];
  goldRegions: GoldRegion[];
  goldBanks: GoldRegion[];
  btcRegions: BtcRegion[];
};

export type FeedAuditRow = {
  id: string;
  ok: boolean;
  detail: string;
};

export type FeedAudit = {
  at: string;
  pullMs: number;
  ok: number;
  fail: number;
  rows: FeedAuditRow[];
};

export type LeverageVenue = {
  id: string;
  name: string;
  longShort: number | null;
  fundingRate: number | null;
  openInterestUsd: number | null;
  buyWallUsd: number | null;
  sellWallUsd: number | null;
  liqLongUsd: number | null;
  liqShortUsd: number | null;
};

export type DeskSnapshot = {
  fetchedAt: string;
  pullMs: number;
  errors: string[];
  feedAudit: FeedAudit;
  btc: {
    price: number | null;
    bid: number | null;
    ask: number | null;
    volume24h: number | null;
    volumeAvg24h: number | null;
    high24h: number | null;
    low24h: number | null;
    changePct: number | null;
    source: string;
  };
  rsi14: number | null;
  rsiAvg: number | null;
  macd: { macd: number; signal: number; hist: number } | null;
  macd50: { macd: number; signal: number; hist: number } | null;
  macd200: { macd: number; signal: number; hist: number } | null;
  ema21: number | null;
  sma50: number | null;
  bbPct: number | null;
  volRatio: number | null;
  atr: number | null;
  candles: Candle[];
  fearGreed: { value: number; label: string } | null;
  positioning: {
    longShort: number | null;
    openInterestUsd: number | null;
    fundingRate: number | null;
    source: string;
    lsHistory: LsPoint[];
    venues: LeverageVenue[];
    buyWallUsd: number | null;
    sellWallUsd: number | null;
    wallBias: "SELL" | "BUY" | "FLAT";
  };
  heatmap: HeatBucket[];
  liqMap: LiqBand[];
  whales: WhalePrint[];
  onchain: {
    height: number | null;
    hashrateEh: number | null;
    difficulty: number | null;
    source: string;
    regions: HashRegion[];
    feeFast: number | null;
    feeEcon: number | null;
    btcDom: number | null;
  };
  quotes: Quote[];
  filings: Filing[];
  headlines: Headline[];
  asia: AsiaTape;
  em: EmTape;
  capital: CapitalTape;
  pools: SlowCapitalTape;
  macro: MacroTape;
  strategy: StrategyTape;
  goldBtc: GoldBtcTape;
  holders: HoldersTape;
};

export type AsiaVenue = {
  id: string;
  region: "KR" | "HK" | "CN";
  name: string;
  lastUsd: number | null;
  volumeBtc: number | null;
  changePct: number | null;
  premiumPct: number | null;
};

export type AsiaTape = {
  session: "ASIA" | "LONDON" | "US";
  fx: { krw: number | null; hkd: number | null; cny: number | null };
  kimchiPct: number | null;
  hkPremiumPct: number | null;
  cnyOtc: {
    usdtCny: number | null;
    officialCny: number | null;
    premiumPct: number | null;
  };
  venues: AsiaVenue[];
};

export type Flow = "INFLOW" | "OUTFLOW" | "FLAT";

export type EmVenue = {
  id: string;
  region: EmRegionId;
  name: string;
  kind: "spot" | "p2p";
  lastUsd: number | null;
  premiumPct: number | null;
};

export type EmRegionId = "UAE" | "ME" | "RU" | "AF" | "SA";

export type EmRegion = {
  id: EmRegionId;
  name: string;
  flow: Flow;
  premiumPct: number | null;
  venues: EmVenue[];
};

export type EmTape = {
  net: { inflow: number; outflow: number; flat: number };
  regions: EmRegion[];
};

export type BotBrief = {
  id: BotId;
  name: string;
  layer: string;
  status: "idle" | "live" | "error";
  summary: string;
  bullets: string[];
  stance: Stance;
  sources: string[];
};

export type HeliosCall = {
  stance: Stance;
  conviction: "LOW" | "MEDIUM" | "HIGH";
  clipUsd: number;
  /** Public one-liner. Never the overseer dump. */
  brief: string;
  /** Proprietary overseer note — admin / operator only. */
  thesis: string;
  checks: { label: string; pass: boolean }[];
  cli: string;
  preview: Record<string, string>;
};

export type PaperFill = {
  id: string;
  at: string;
  side: "BUY" | "SELL";
  usd: number;
  btc: number;
  price: number;
  note: string;
  kind?: "clip" | "stop" | "trim";
  triggers?: { label: string; why: string }[];
  stopPrice?: number;
  peakPrice?: number;
  openBtc?: number;
};

export type PaperBook = {
  cashUsd: number;
  btc: number;
  profitBtc: number;
  fills: PaperFill[];
};
