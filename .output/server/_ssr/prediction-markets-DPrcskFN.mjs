import { c as BOT7_NAME } from "./brand-DuaUmsed.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/prediction-markets-DPrcskFN.js
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
		value: "Honest error log. Never auto-green. Daily 07:30 ET chat report: architecture, security, open errors, Alignment Score 1–100 (mandate vs protocols). As-live sim auto-pauses 07:00 ET."
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
		layer: "7-B0T",
		feed: "All six + BTC tape, Asia, EM, ETF, BTC/gold, rotation, whales + Polymarket/Kalshi pred sub-analyst (label)"
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
	},
	{
		id: "pred",
		name: "BTC prediction markets",
		role: "Polymarket + Kalshi public odds: bitcoin all-time high, monthly high, other BTC (fill, display only)"
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
	fill: "Holders, headlines, filings, BTC prediction markets (Polymarket/Kalshi), EM, FRED/M2, DAT/SWF, Binance LS/OI, mempool.space + Blockstream fees — last good tape reused on 429/timeout",
	skip: "None cut. Slow or geo-blocked hosts run on fill with 1.4s caps and last-good cache (Binance fapi → CoinGecko; mempool.space fees; Blockstream fees)."
};
/** Bump on the weekly whole-desk free-source hunt. */
var SYSTEM_REVIEWED = "2026-09-05";
var POLY_HOST = "https://gamma-api.polymarket.com";
var KALSHI_HOST = "https://api.elections.kalshi.com/trade-api/v2";
var FETCH_MS = 2800;
var MAX_BYTES = 22e4;
function asBool(v) {
	return v === true || v === "true";
}
function asList(v) {
	if (Array.isArray(v)) return v;
	if (typeof v === "string") try {
		const j = JSON.parse(v);
		return Array.isArray(j) ? j : [];
	} catch {
		return [];
	}
	return [];
}
function num(v) {
	if (typeof v === "number" && Number.isFinite(v)) return v;
	if (typeof v === "string" && v.trim()) {
		const n = Number(v);
		return Number.isFinite(n) ? n : null;
	}
	return null;
}
function yesFromPrices(raw) {
	const yes = asList(raw).map((p) => Number(p))[0];
	if (yes == null || !Number.isFinite(yes)) return null;
	return Math.round(Math.min(1, Math.max(0, yes)) * 1e3) / 10;
}
function midYes(bid, ask, last) {
	const b = num(bid);
	const a = num(ask);
	const p = num(last) ?? (b != null && a != null ? (b + a) / 2 : a ?? b);
	if (p == null) return null;
	return Math.round(Math.min(1, Math.max(0, p)) * 1e3) / 10;
}
function nyParts(at = /* @__PURE__ */ new Date()) {
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone: "America/New_York",
		year: "numeric",
		month: "long",
		day: "2-digit"
	}).formatToParts(at);
	const year = parts.find((p) => p.type === "year")?.value ?? "2026";
	const month = parts.find((p) => p.type === "month")?.value ?? "September";
	return {
		year,
		month,
		day: parts.find((p) => p.type === "day")?.value ?? "06",
		monthLc: month.toLowerCase()
	};
}
function classifyBtcTitle(title) {
	const t = title.toLowerCase();
	if (/all.?time high|\bath\b|yearly high|year high|hit in 2026|before 2027|by december|by march|by june|by september 30|by dec/.test(t)) return "ath";
	if (/monthly|this month|in september|in october|in november|in december|how high will btc get|hit in september|hit in october/.test(t)) return "monthly";
	return "other";
}
function parsePolyEvent(ev, kindHint) {
	if (asBool(ev.closed)) return [];
	const slug = (ev.slug ?? "").trim();
	const eventTitle = (ev.title ?? slug).trim();
	const kind = kindHint ?? classifyBtcTitle(eventTitle);
	const url = slug ? `https://polymarket.com/event/${slug}` : "https://polymarket.com";
	const markets = asList(ev.markets);
	const rows = [];
	for (const m of markets) {
		if (asBool(m.closed)) continue;
		const yesPct = yesFromPrices(m.outcomePrices);
		if (yesPct == null) continue;
		if (yesPct <= .2 || yesPct >= 99.8) continue;
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
			url
		});
	}
	return rows;
}
function parseKalshiMarkets(series, kind, markets) {
	const seriesLc = series.toLowerCase();
	const rows = [];
	for (const m of markets) {
		if (m.status && m.status !== "active" && m.status !== "open") continue;
		const yesPct = midYes(m.yes_bid_dollars, m.yes_ask_dollars, m.last_price_dollars);
		if (yesPct == null) continue;
		if (yesPct <= .2 || yesPct >= 99.8) continue;
		const strike = (m.yes_sub_title ?? "").trim() || null;
		const title = (m.title ?? strike ?? m.ticker ?? series).trim();
		const event = (m.event_ticker ?? "").toLowerCase();
		const ticker = (m.ticker ?? "").toLowerCase();
		const url = event ? `https://kalshi.com/markets/${seriesLc}/${event}` : `https://kalshi.com/markets/${seriesLc}`;
		rows.push({
			id: `kalshi:${ticker || title}`,
			venue: "Kalshi",
			kind,
			title,
			strike,
			yesPct,
			volumeUsd: num(m.volume_fp) ?? num(m.volume_24h_fp),
			end: m.close_time ?? "",
			url
		});
	}
	return rows;
}
function pickTop(rows, n) {
	return [...rows].sort((a, b) => (b.volumeUsd ?? 0) - (a.volumeUsd ?? 0) || (b.yesPct ?? 0) - (a.yesPct ?? 0)).slice(0, n);
}
function dedupe(rows) {
	const seen = /* @__PURE__ */ new Set();
	return rows.filter((r) => {
		const k = `${r.venue}|${r.title.toLowerCase()}`;
		if (seen.has(k)) return false;
		seen.add(k);
		return true;
	});
}
async function getJson(url) {
	const { guardedFetch } = await import("./net-guard-C4Si76ZP.mjs").then((n) => n.r).then((n) => n.r);
	const ctrl = new AbortController();
	const t = setTimeout(() => ctrl.abort(), FETCH_MS);
	try {
		const res = await guardedFetch(url, {
			signal: ctrl.signal,
			headers: {
				Accept: "application/json",
				"User-Agent": "S1R1US-Lab/1.0 (bitcoin accumulator research; education tape)"
			}
		});
		if (!res.ok) throw new Error(`${res.status} ${url}`);
		const buf = await res.arrayBuffer();
		const slice = buf.byteLength > MAX_BYTES ? buf.slice(0, MAX_BYTES) : buf;
		return JSON.parse(new TextDecoder().decode(slice));
	} finally {
		clearTimeout(t);
	}
}
async function polyEvent(slug, kind) {
	const data = await getJson(`${POLY_HOST}/events?slug=${encodeURIComponent(slug)}&closed=false&limit=1`);
	return (Array.isArray(data) ? data : data.events ?? []).flatMap((ev) => parsePolyEvent(ev, kind));
}
async function polyBitcoinTag() {
	const data = await getJson(`${POLY_HOST}/events?active=true&closed=false&limit=10&order=volume24hr&ascending=false&tag_slug=bitcoin`);
	return (Array.isArray(data) ? data : data.events ?? []).flatMap((ev) => parsePolyEvent(ev));
}
async function kalshiSeries(series, kind, limit = 12) {
	return parseKalshiMarkets(series, kind, (await getJson(`${KALSHI_HOST}/markets?status=open&series_ticker=${encodeURIComponent(series)}&limit=${limit}`)).markets ?? []);
}
async function fetchPredictionMarkets() {
	const { year, monthLc } = nyParts();
	const monthlySlug = `what-price-will-bitcoin-hit-in-${monthLc}-${year}`;
	const settled = await Promise.allSettled([
		polyEvent("bitcoin-all-time-high-by", "ath"),
		polyEvent(monthlySlug, "monthly"),
		polyEvent("what-price-will-bitcoin-hit-before-2027", "ath"),
		polyBitcoinTag(),
		kalshiSeries("KXBTCMAXY", "ath", 8),
		kalshiSeries("KXBTCMAXMON", "monthly", 10),
		kalshiSeries("KXBTCD", "other", 8)
	]);
	const rows = [];
	for (const r of settled) if (r.status === "fulfilled") rows.push(...r.value);
	const ath = pickTop(rows.filter((x) => x.kind === "ath"), 5);
	const monthly = pickTop(rows.filter((x) => x.kind === "monthly"), 6);
	const other = pickTop(rows.filter((x) => x.kind === "other"), 5);
	return dedupe([
		...ath,
		...monthly,
		...other
	]).slice(0, 16);
}
var PRED_KIND_LABEL = {
	ath: "All-time high",
	monthly: "Monthly high",
	other: "Other BTC"
};
function parseStrikeUsd(strike, title = "") {
	const t = `${strike ?? ""} ${title}`.replace(/,/g, "");
	const k = t.match(/(\d+(?:\.\d+)?)\s*k\b/i);
	if (k) {
		const n = Number(k[1]) * 1e3;
		return n >= 1e3 && n <= 5e6 ? n : null;
	}
	const m = t.match(/\$?\s*(\d{4,7}(?:\.\d+)?)/);
	if (!m) return null;
	const n = Number(m[1]);
	return n >= 1e3 && n <= 5e6 ? n : null;
}
function volWtdYes(rows) {
	let w = 0;
	let acc = 0;
	for (const r of rows) {
		if (r.yesPct == null) continue;
		const v = Math.max(1, r.volumeUsd ?? 1);
		acc += r.yesPct * v;
		w += v;
	}
	return w > 0 ? Math.round(acc / w * 10) / 10 : null;
}
function impliedMonthly(rows) {
	const pts = rows.map((r) => {
		const strikeUsd = parseStrikeUsd(r.strike, r.title);
		if (strikeUsd == null || r.yesPct == null) return null;
		return {
			strikeUsd,
			yesPct: r.yesPct
		};
	}).filter((x) => x != null).sort((a, b) => a.strikeUsd - b.strikeUsd);
	if (!pts.length) return null;
	for (let i = 0; i < pts.length - 1; i++) {
		const a = pts[i];
		const b = pts[i + 1];
		if (a.yesPct >= 50 && b.yesPct <= 50 || a.yesPct <= 50 && b.yesPct >= 50) {
			const den = b.yesPct - a.yesPct;
			if (den === 0) return a.strikeUsd;
			const t = (50 - a.yesPct) / den;
			return Math.round(a.strikeUsd + t * (b.strikeUsd - a.strikeUsd));
		}
	}
	return [...pts].sort((a, b) => Math.abs(a.yesPct - 50) - Math.abs(b.yesPct - 50))[0]?.strikeUsd ?? null;
}
function yesAtTarget(rows, target) {
	let best = null;
	for (const r of rows) {
		const s = parseStrikeUsd(r.strike, r.title);
		if (s == null || r.yesPct == null) continue;
		const dist = Math.abs(s - target);
		if (!best || dist < best.dist) best = {
			dist,
			yes: r.yesPct
		};
	}
	return best && best.dist / target <= .12 ? best.yes : null;
}
function usdK(n) {
	if (n == null || !Number.isFinite(n)) return "n/a";
	if (n >= 1e3) return `$${(n / 1e3).toFixed(n >= 1e4 ? 0 : 1)}k`;
	return `$${n.toFixed(0)}`;
}
function venueBook(rows, venue, spot) {
	const mine = rows.filter((r) => r.venue === venue);
	const monthly = mine.filter((r) => r.kind === "monthly");
	const other = mine.filter((r) => r.kind === "other");
	const ath = mine.filter((r) => r.kind === "ath");
	const implied = impliedMonthly(monthly);
	const plus5 = spot != null && spot > 0 ? yesAtTarget(monthly.length ? monthly : mine, spot * 1.05) : null;
	const daily = spot != null && spot > 0 ? yesAtTarget(other.length ? other : mine, spot) : null;
	const athYes = volWtdYes(ath);
	const bullets = [];
	if (implied != null) bullets.push(`Implied monthly high ${usdK(implied)} (50% strike).`);
	if (plus5 != null) bullets.push(`Yes at ~spot+5% ${plus5.toFixed(1)}%.`);
	if (daily != null) bullets.push(`Near-spot daily Yes ${daily.toFixed(1)}%.`);
	if (athYes != null) bullets.push(`ATH / year-high Yes ${athYes.toFixed(1)}% (volume-weighted).`);
	const top = [...mine].sort((a, b) => (b.volumeUsd ?? 0) - (a.volumeUsd ?? 0)).slice(0, 3);
	for (const r of top) bullets.push(`${r.strike ?? r.title} · Yes ${r.yesPct ?? "—"}%.`);
	if (!mine.length) bullets.push("No live contracts this cycle.");
	const headline = !mine.length ? `${venue} quiet — no BTC contracts this pull.` : implied != null ? `${venue} prices a ${usdK(implied)} monthly high` + (plus5 != null ? ` · +5% Yes ${plus5.toFixed(0)}%` : "") + "." : `${venue} ${mine.length} BTC contract(s) · ATH Yes ${athYes != null ? `${athYes.toFixed(0)}%` : "n/a"}.`;
	return {
		venue,
		n: mine.length,
		impliedMonthly: implied,
		monthlyYesPlus5: plus5,
		dailyYesNearSpot: daily,
		athYes,
		headline,
		bullets: bullets.slice(0, 6)
	};
}
function predAnalyst(rows, spot) {
	const list = rows ?? [];
	const polymarket = venueBook(list, "Polymarket", spot);
	const kalshi = venueBook(list, "Kalshi", spot);
	const plus5 = [polymarket.monthlyYesPlus5, kalshi.monthlyYesPlus5].filter((n) => n != null);
	const daily = [polymarket.dailyYesNearSpot, kalshi.dailyYesNearSpot].filter((n) => n != null);
	const ath = [polymarket.athYes, kalshi.athYes].filter((n) => n != null);
	const avgPlus5 = plus5.length ? plus5.reduce((s, n) => s + n, 0) / plus5.length : null;
	const avgDaily = daily.length ? daily.reduce((s, n) => s + n, 0) / daily.length : null;
	const avgAth = ath.length ? ath.reduce((s, n) => s + n, 0) / ath.length : null;
	const fomo = avgDaily != null && avgDaily >= 70 || avgPlus5 != null && avgPlus5 >= 75;
	const discount = !fomo && (avgPlus5 != null && avgPlus5 <= 35 || avgDaily != null && avgDaily <= 28 || avgAth != null && avgAth <= 18 && (avgPlus5 == null || avgPlus5 <= 45));
	const stance = fomo ? "WAIT" : discount ? "ACCUMULATE" : "HOLD";
	const overlayPass = !fomo;
	const checkLabel = fomo ? "Prediction markets not crowded (near-term Yes FOMO)" : "Prediction markets not crowded (near-term Yes)";
	return {
		stance,
		summary: !list.length ? "7-B0T pred sub-analyst: no Polymarket/Kalshi tape this cycle — HOLD overlay, do not invent a buy." : fomo ? `7-B0T pred sub-analyst WAIT: crowd is long BTC into highs (near-spot Yes ${avgDaily != null ? `${avgDaily.toFixed(0)}%` : "n/a"}, +5% Yes ${avgPlus5 != null ? `${avgPlus5.toFixed(0)}%` : "n/a"}). Do not chase. Never sell.` : discount ? `7-B0T pred sub-analyst ACCUMULATE overlay: crowd is cheap on the path ( +5% Yes ${avgPlus5 != null ? `${avgPlus5.toFixed(0)}%` : "n/a"}, daily ${avgDaily != null ? `${avgDaily.toFixed(0)}%` : "n/a"}, ATH ${avgAth != null ? `${avgAth.toFixed(0)}%` : "n/a"}). Overlay only — still needs two orthogonal lanes. Never sell.` : `7-B0T pred sub-analyst HOLD: no strong fear or FOMO ( +5% Yes ${avgPlus5 != null ? `${avgPlus5.toFixed(0)}%` : "n/a"}, daily ${avgDaily != null ? `${avgDaily.toFixed(0)}%` : "n/a"}). Labels, not a 1–6 vote. Never sell.`,
		discount,
		fomo,
		overlayPass,
		checkLabel,
		polymarket,
		kalshi
	};
}
//#endregion
export { RISK_RULES as a, predAnalyst as c, PRED_KIND_LABEL as i, CYCLE_ARCH as n, SYSTEM_REVIEWED as o, DATA_FEEDS as r, fetchPredictionMarkets as s, BOT_ROSTER as t };
