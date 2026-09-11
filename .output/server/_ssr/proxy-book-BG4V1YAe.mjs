//#region node_modules/.nitro/vite/services/ssr/assets/proxy-book-BG4V1YAe.js
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
function smaSeries(values, period) {
	const out = values.map(() => null);
	let sum = 0;
	for (let i = 0; i < values.length; i++) {
		sum += values[i];
		if (i >= period) sum -= values[i - period];
		if (i >= period - 1) out[i] = sum / period;
	}
	return out;
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
	const s20 = smaSeries(closes, 20);
	const s50 = smaSeries(closes, 50);
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
		sma20: s20[i] ?? null,
		sma50: s50[i] ?? null,
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
export { volumeRatio as C, volumeAvg24h as S, overlayBars as _, MINER_TICKERS as a, rsiWilder as b, atrLast as c, clipForNav as d, depthHeatmap as f, mergeHourly as g, macdLast as h, MAG7_TICKERS as i, bbPercentB as l, liqHeatmap as m, GOLD_TICKERS as n, PROXY_QUOTES as o, emaLast as p, MACRO_QUOTES as r, SILVER_TICKERS as s, FILING_CIKS as t, candlesToClosesOldestFirst as u, rsiMean as v, smaLast as x, rsiSeries as y };
