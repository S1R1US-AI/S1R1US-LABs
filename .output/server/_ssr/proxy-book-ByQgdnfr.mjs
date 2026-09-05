import { r as BOT7_NAME } from "./brand-CZvw9Xkc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/proxy-book-ByQgdnfr.js
function rsiWilder(closes, period = 14) {
	const series = rsiSeries(closes, period);
	for (let i = series.length - 1; i >= 0; i--) if (series[i] != null) return series[i];
	return null;
}
function rsiMean(closes, period = 14) {
	const vals = rsiSeries(closes, period).filter((n) => n != null);
	if (!vals.length) return null;
	return vals.reduce((a, b) => a + b, 0) / vals.length;
}
function rsiSeries(closes, period = 14) {
	const out = Array(closes.length).fill(null);
	if (closes.length < period + 1) return out;
	let gain = 0;
	let loss = 0;
	for (let i = 1; i <= period; i++) {
		const d = closes[i] - closes[i - 1];
		if (d >= 0) gain += d;
		else loss -= d;
	}
	let avgGain = gain / period;
	let avgLoss = loss / period;
	out[period] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
	for (let i = period + 1; i < closes.length; i++) {
		const d = closes[i] - closes[i - 1];
		avgGain = (avgGain * (period - 1) + Math.max(d, 0)) / period;
		avgLoss = (avgLoss * (period - 1) + Math.max(-d, 0)) / period;
		out[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
	}
	return out;
}
function macdLast(closes, fast = 12, slow = 26, signal = 9) {
	if (closes.length < slow + signal) return null;
	const eFast = ema(closes, fast);
	const eSlow = ema(closes, slow);
	const line = [];
	for (let i = 0; i < closes.length; i++) {
		const a = eFast[i];
		const b = eSlow[i];
		if (a == null || b == null) continue;
		line.push(a - b);
	}
	if (line.length < signal) return null;
	const sig = ema(line, signal);
	for (let i = sig.length - 1; i >= 0; i--) if (sig[i] != null && line[i] != null) {
		const macd = line[i];
		const s = sig[i];
		return {
			macd,
			signal: s,
			hist: macd - s
		};
	}
	return null;
}
function macdHistSeries(closes, fast = 12, slow = 26, signal = 9) {
	const out = Array(closes.length).fill(null);
	const eFast = ema(closes, fast);
	const eSlow = ema(closes, slow);
	const idx = [];
	const line = [];
	for (let i = 0; i < closes.length; i++) {
		const a = eFast[i];
		const b = eSlow[i];
		if (a == null || b == null) continue;
		idx.push(i);
		line.push(a - b);
	}
	const sig = ema(line, signal);
	for (let j = 0; j < idx.length; j++) if (sig[j] != null) out[idx[j]] = line[j] - sig[j];
	return out;
}
function ema(values, period) {
	const out = Array(values.length).fill(null);
	if (values.length < period) return out;
	const k = 2 / (period + 1);
	let prev = 0;
	for (let i = 0; i < period; i++) prev += values[i];
	prev /= period;
	out[period - 1] = prev;
	for (let i = period; i < values.length; i++) {
		prev = values[i] * k + prev * (1 - k);
		out[i] = prev;
	}
	return out;
}
function bollinger(values, period = 20, k = 2) {
	const upper = Array(values.length).fill(null);
	const lower = Array(values.length).fill(null);
	if (values.length < period) return {
		upper,
		lower
	};
	for (let i = period - 1; i < values.length; i++) {
		const slice = values.slice(i - period + 1, i + 1);
		const mean = slice.reduce((a, b) => a + b, 0) / period;
		const variance = slice.reduce((a, b) => a + (b - mean) ** 2, 0) / period;
		const sd = Math.sqrt(variance);
		upper[i] = mean + k * sd;
		lower[i] = mean - k * sd;
	}
	return {
		upper,
		lower
	};
}
function smaLast(values, period) {
	if (values.length < period) return null;
	let s = 0;
	for (let i = values.length - period; i < values.length; i++) s += values[i];
	return s / period;
}
function emaLast(values, period) {
	const s = ema(values, period);
	for (let i = s.length - 1; i >= 0; i--) if (s[i] != null) return s[i];
	return null;
}
function atrLast(candles, period = 14) {
	const ordered = [...candles].sort((a, b) => a.t - b.t);
	if (ordered.length < period + 1) return null;
	const tr = [];
	for (let i = 1; i < ordered.length; i++) {
		const h = ordered[i].high;
		const l = ordered[i].low;
		const pc = ordered[i - 1].close;
		tr.push(Math.max(h - l, Math.abs(h - pc), Math.abs(l - pc)));
	}
	return smaLast(tr, period);
}
function bbPercentB(closes, period = 20, k = 2) {
	if (closes.length < period) return null;
	const bb = bollinger(closes, period, k);
	const i = closes.length - 1;
	const u = bb.upper[i];
	const l = bb.lower[i];
	const c = closes[i];
	if (u == null || l == null || c == null || u <= l) return null;
	return (c - l) / (u - l);
}
function volumeRatio(candles, period = 20) {
	const ordered = [...candles].sort((a, b) => a.t - b.t);
	if (ordered.length < period) return null;
	const vols = ordered.map((c) => c.volume);
	const avg = smaLast(vols, period);
	const last = vols[vols.length - 1];
	if (avg == null || avg <= 0 || last == null) return null;
	return last / avg;
}
/** Mean of completed 24-hour volume windows from hourly Coinbase candles. */
function volumeAvg24h(candles, windows = 20) {
	const ordered = [...candles].sort((a, b) => a.t - b.t);
	if (ordered.length < 24) return null;
	const daily = [];
	for (let i = 23; i < ordered.length; i += 24) {
		let sum = 0;
		for (let j = i - 23; j <= i; j++) sum += ordered[j].volume;
		if (sum > 0) daily.push(sum);
	}
	if (!daily.length) return null;
	const take = daily.slice(-windows);
	return take.reduce((a, b) => a + b, 0) / take.length;
}
function overlayBars(candles) {
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
		up: c.close >= c.open
	}));
}
function candlesToClosesOldestFirst(candles) {
	return [...candles].sort((a, b) => a.t - b.t).map((c) => c.close);
}
function depthHeatmap(bids, asks, buckets = 18) {
	if (!bids.length || !asks.length) return [];
	const mid = (bids[0][0] + asks[0][0]) / 2;
	const span = mid * .012;
	const lo = mid - span;
	const step = (mid + span - lo) / buckets;
	const out = Array.from({ length: buckets }, (_, i) => ({
		price: lo + (i + .5) * step,
		bidUsd: 0,
		askUsd: 0
	}));
	const add = (px, sz, side) => {
		const i = Math.min(buckets - 1, Math.max(0, Math.floor((px - lo) / step)));
		const usd = px * sz;
		if (side === "bid") out[i].bidUsd += usd;
		else out[i].askUsd += usd;
	};
	for (const [px, sz] of bids) add(px, sz, "bid");
	for (const [px, sz] of asks) add(px, sz, "ask");
	return out;
}
var LEVS = [
	10,
	25,
	50,
	75,
	100
];
function liqHeatmap(opts) {
	const last = opts.last;
	if (last == null || last <= 0) return [];
	const buckets = opts.buckets ?? 16;
	const span = last * .08;
	const lo = last - span;
	const hi = last + span;
	const step = (hi - lo) / buckets;
	const out = Array.from({ length: buckets }, (_, i) => ({
		price: lo + (i + .5) * step,
		longUsd: 0,
		shortUsd: 0
	}));
	const slot = (px) => Math.min(buckets - 1, Math.max(0, Math.floor((px - lo) / step)));
	const oi = opts.oiUsd ?? 0;
	const ls = opts.ls ?? 1;
	const longShare = ls / (1 + ls);
	const shortShare = 1 / (1 + ls);
	const perLev = 1 / LEVS.length;
	for (const lev of LEVS) {
		const longPx = last * (1 - 1 / lev);
		const shortPx = last * (1 + 1 / lev);
		const w = oi * perLev / Math.max(lev / 10, 1);
		out[slot(longPx)].longUsd += w * longShare;
		out[slot(shortPx)].shortUsd += w * shortShare;
	}
	for (const hit of opts.liquidations) {
		if (hit.price < lo || hit.price > hi) continue;
		if (hit.side === "long") out[slot(hit.price)].longUsd += hit.usd;
		else out[slot(hit.price)].shortUsd += hit.usd;
	}
	for (const b of opts.book) {
		const i = slot(b.price);
		out[i].longUsd += b.bidUsd * .15;
		out[i].shortUsd += b.askUsd * .15;
	}
	return out;
}
/** Keep ~13d of Coinbase hours so MACD-50 / MACD-200 have enough bars for every visitor. */
function mergeHourly(prev, next) {
	const by = /* @__PURE__ */ new Map();
	for (const c of prev) if (c.t > 0 && Number.isFinite(c.close)) by.set(c.t, c);
	for (const c of next) if (c.t > 0 && Number.isFinite(c.close)) by.set(c.t, c);
	return [...by.values()].sort((a, b) => a.t - b.t).slice(-320);
}
function clipForNav(nav, stance) {
	const pct = stance === "BUY" ? .02 : stance === "ACCUMULATE" ? .01 : 0;
	if (pct <= 0) return 0;
	return Math.max(1, Math.round(nav * pct));
}
var RISK_RULES = [
	{
		id: "rsi-buy",
		label: "BUY RSI",
		value: "Hourly RSI(14) < 30 and F&G ≤ 40"
	},
	{
		id: "accum",
		label: "ACCUMULATE",
		value: "≥3 checks and (two orthogonal lanes or discount vs gold/Asia/F&G)"
	},
	{
		id: "etf",
		label: "ETF melt-up",
		value: "Wait if last session net > $350M and RSI ≥ 50"
	},
	{
		id: "trim",
		label: "No sell",
		value: "Never sell bitcoin. RSI > 72 and F&G ≥ 75 → HOLD, keep BTC. Never TRIM the stack."
	},
	{
		id: "wait",
		label: "WAIT",
		value: "Crowded Asia/EM or F&G ≥ 70 with weak tape — do not buy more. Do not sell."
	},
	{
		id: "ls",
		label: "Long/short",
		value: "Crowded if OI-weighted LS > 1.6 (OKX+Bybit+Binance+Bitfinex)"
	},
	{
		id: "fund",
		label: "Funding",
		value: "Overheated if > 0.05% (longs paying = crowded longs losing carry)"
	},
	{
		id: "wall",
		label: "Sell wall",
		value: "WAIT-lean if sell wall ≥ 2× buy wall in the 0.4% band + Coinbase L2"
	},
	{
		id: "kimchi",
		label: "Kimchi",
		value: "Crowded if Upbit premium > 3%"
	},
	{
		id: "cny",
		label: "CNY OTC",
		value: "Crowded if USDT premium > 2%"
	},
	{
		id: "em",
		label: "EM tape",
		value: "Crowded if 3+ regions hot (>2.5%)"
	},
	{
		id: "clip",
		label: "Clip",
		value: "BUY 2% NAV · ACCUMULATE 1% · HOLD/WAIT 0. Never a sell clip."
	},
	{
		id: "stop",
		label: "Stop-loss",
		value: "Per-clip watch 1.5% under entry. At +1% mark breakeven. A stop does NOT sell BTC — it blocks add-on buys into that lot. Never short. Never dump the stack."
	},
	{
		id: "short",
		label: "Shorts",
		value: "Forbidden. Mandate is accumulate BTC. Never sell. Never short."
	},
	{
		id: "ops",
		label: "Ops",
		value: "Honest error log. Never auto-green. Daily 08:00 ET chat report: architecture, security, open errors, mandate score 1–10."
	}
];
var BOT_ROSTER = [
	{
		id: "filings",
		name: "Filings Analyst",
		layer: "Event",
		feed: "SEC EDGAR 8-K/10-Q/10-K · MSTR COIN MARA SMLR only"
	},
	{
		id: "earnings",
		name: "Earnings Analyst",
		layer: "Flow",
		feed: "US spot ETF net + DAT treasury BTC · IBIT vs Coinbase"
	},
	{
		id: "sector",
		name: "Sector Research",
		layer: "Relative value",
		feed: "IBIT vs GLD · BTC/gold 1y median · DXY SPY"
	},
	{
		id: "sentiment",
		name: "Sentiment Analyst",
		layer: "Mood",
		feed: "Alternative.me F&G · Cointelegraph CoinDesk Decrypt RSS"
	},
	{
		id: "rotation",
		name: "Rotation Analyst",
		layer: "Capital rotation",
		feed: "QQQ NVDA vs IBIT · GLD paper · RSS + whale overlay"
	},
	{
		id: "coordinator",
		name: "Coordinator",
		layer: "Maker-checker",
		feed: "Orthogonal two-lane · event + flow + RV + mood"
	},
	{
		id: "helios",
		name: BOT7_NAME,
		layer: "Bot 7",
		feed: "All six + BTC tape, Asia, EM, ETF, BTC/gold, rotation, whales"
	}
];
var DATA_FEEDS = [
	{
		id: "coinbase",
		name: "Coinbase spot",
		role: "BTC-USD last, hourly candles, product_book 80 (level=1 fallback)"
	},
	{
		id: "okx",
		name: "Public leverage",
		role: "Core: OKX + Hyperliquid + Bitfinex. Bybit 403 from some clouds (last-good). Fill: Binance futures (fapi, CoinGecko if geo-blocked 451)."
	},
	{
		id: "asia",
		name: "Asia tape",
		role: "Upbit, Bithumb, HashKey, HTX, CNY OTC"
	},
	{
		id: "em",
		name: "EM flow",
		role: "UAE, ME, RU, Africa, LatAm premiums (fill phase)"
	},
	{
		id: "fear-greed",
		name: "Fear & Greed",
		role: "Alternative.me"
	},
	{
		id: "sec",
		name: "SEC EDGAR",
		role: "Filings + insiders (fill phase)"
	},
	{
		id: "rss",
		name: "Headlines",
		role: "Cointelegraph, CoinDesk, Decrypt, Bitcoin.com, CNBC, Yahoo, Motley Fool, Bitcoin Magazine (fill)"
	},
	{
		id: "capital",
		name: "Capital tape",
		role: "Core: SoSoValue ETF net. Fill: DAT/SWF treasuries, CEX notional, Hyperliquid (90s cache, 429 → last good)"
	},
	{
		id: "pools",
		name: "Slow capital",
		role: "CRE VNQ, 401k/IRA pipe, insurers, endowments, US state SBR, agent OI"
	},
	{
		id: "mining",
		name: "Hashrate",
		role: "Core: blockchain.info hash/height + mempool pool geography (Foundry/MARA/Luxor/OCEAN/CKPool = North America). Fill: mempool.space/Blockstream fees."
	},
	{
		id: "macro",
		name: "Rates + M2",
		role: "FRED bills/2s/10s/30s/M2/CPI/PCE · DefiLlama stables (fill, 7s cap)"
	},
	{
		id: "strategy",
		name: "MSTR stack",
		role: "MSTR, preferreds, MSTY/2x vehicles from quote tape"
	},
	{
		id: "holders",
		name: "Top holders",
		role: "Bitbo BTC treasuries (fill) · quote-derived gold/silver"
	}
];
/** Two-phase run cycle — shared by Paper, Admin, s1r1us.ai. */
var CYCLE_ARCH = {
	name: "core / fill",
	coreMs: 1800,
	clientRaceMs: 2800,
	spinnerMs: 3200,
	inflight: 12,
	core: "Coinbase last first, then RSI/MACD, F&G, on-chain, Asia kimchi, public leverage, ETF flow, whales",
	fill: "Holders, headlines, filings, EM, FRED/M2, DAT/SWF, Binance LS/OI, mempool.space + Blockstream fees — last good tape reused on 429/timeout",
	skip: "None cut. Slow or geo-blocked hosts run on fill with 1.4s caps and last-good cache (Binance fapi → CoinGecko; mempool.space fees; Blockstream fees)."
};
/** Bump on the weekly whole-desk free-source hunt. */
var SYSTEM_REVIEWED = "2026-09-05";
/** Most important public BTC holders for Earnings / Filings — DATs + miners, not the long tail. */
var PROXY_QUOTES = [
	"MSTR",
	"XXI",
	"MTPLF",
	"SMLR",
	"COIN",
	"IBIT",
	"MARA",
	"RIOT",
	"CLSK",
	"HUT",
	"IREN",
	"NVDA"
];
var MACRO_QUOTES = [
	"SPY",
	"QQQ",
	"DX-Y",
	"US10Y",
	"GLD",
	"SLV",
	"GDX",
	"TLT",
	"GC=F",
	"SI=F",
	"VNQ",
	"KIE"
];
/** Nasdaq duration / debasement trades — Mag 7 only. */
var MAG7_TICKERS = [
	"NVDA",
	"MSFT",
	"AAPL",
	"AMZN",
	"GOOGL",
	"META",
	"TSLA"
];
/** Physical silver + the two miners that matter for the SoV tape. */
var SILVER_TICKERS = [
	"SLV",
	"SIVR",
	"PSLV",
	"SIL",
	"PAAS",
	"WPM"
];
/** Physical gold + the two names that matter for the SoV tape. */
var GOLD_TICKERS = [
	"GLD",
	"IAU",
	"PHYS",
	"GDX",
	"NEM",
	"GOLD"
];
var MINER_TICKERS = [
	"MARA",
	"RIOT",
	"CLSK",
	"HUT",
	"IREN"
];
/** EDGAR watch — BTC treasury events only. No NVDA, no miner-ops noise. */
var FILING_CIKS = [
	{
		cik: "0001050446",
		name: "MSTR"
	},
	{
		cik: "0001679788",
		name: "COIN"
	},
	{
		cik: "0001507606",
		name: "MARA"
	},
	{
		cik: "0001554859",
		name: "SMLR"
	}
];
//#endregion
export { rsiMean as C, volumeAvg24h as D, smaLast as E, volumeRatio as O, overlayBars as S, rsiWilder as T, depthHeatmap as _, GOLD_TICKERS as a, macdLast as b, MINER_TICKERS as c, SILVER_TICKERS as d, SYSTEM_REVIEWED as f, clipForNav as g, candlesToClosesOldestFirst as h, FILING_CIKS as i, PROXY_QUOTES as l, bbPercentB as m, CYCLE_ARCH as n, MACRO_QUOTES as o, atrLast as p, DATA_FEEDS as r, MAG7_TICKERS as s, BOT_ROSTER as t, RISK_RULES as u, emaLast as v, rsiSeries as w, mergeHourly as x, liqHeatmap as y };
