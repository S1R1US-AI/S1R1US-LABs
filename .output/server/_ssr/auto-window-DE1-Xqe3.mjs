import { b as rsiWilder, v as rsiMean, y as rsiSeries } from "./proxy-book-CtmrAojx.mjs";
import { n as runBots, t as heliosCall } from "./signal-DNSRJrEz.mjs";
import { n as PROFIT_BTC_RECEIVE, t as PROFIT_BTC_EXPLORER } from "./treasury-VcYm63db.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auto-window-DE1-Xqe3.js
var GM_NAME = "G0DZ1LLa M0D3";
var GM_CASH_MIN = 1e3;
var GM_CASH_MAX = 1e5;
var GM_CASH_STEP = 1e3;
var GM_PROFIT_BTC = PROFIT_BTC_RECEIVE;
var GM_PROFIT_EXPLORER = PROFIT_BTC_EXPLORER;
var GM_FUND_USDC = "0x551163f5d4c0361155d16131459afa5c936a60ad";
var GM_FUND_EXPLORER = `https://basescan.org/address/${GM_FUND_USDC}`;
var GM_VAR_META = [
	{
		id: "dca",
		label: "Aggressive DCA",
		hint: "More frequent spot buys when RSI < avg and vol > Coinbase avg.",
		sellSleeve: false
	},
	{
		id: "buyGrid",
		label: "Buy-only grid",
		hint: "Buy dips in a range. Does not sell coins.",
		sellSleeve: false
	},
	{
		id: "flush",
		label: "Flush buy",
		hint: "Buy after a sell-wall / liquidation wash — not during it.",
		sellSleeve: false
	},
	{
		id: "dayTrader",
		label: "Classic day-trader",
		hint: "RSI 30/70 on the candle you pick (1h–24h). Sells into strength on the GM sleeve only.",
		sellSleeve: true
	},
	{
		id: "neutralGrid",
		label: "Neutral grid",
		hint: "Buy and sell inside a range on the GM sleeve only.",
		sellSleeve: true
	},
	{
		id: "fundingArb",
		label: "Funding arb",
		hint: "Keep spot BTC, short perp equal size. Isolated sleeve.",
		sellSleeve: false
	},
	{
		id: "naked",
		label: "Naked long / short",
		hint: "Levered directional. Tiny isolated sleeve. Risk 4–5.",
		sellSleeve: true
	}
];
var DEFAULT_GM_VARS = {
	dca: true,
	buyGrid: true,
	flush: true,
	dayTrader: false,
	neutralGrid: false,
	fundingArb: false,
	naked: false
};
function clampGmTf(n) {
	return Math.min(24, Math.max(1, Math.round(n)));
}
function unixSec(t) {
	return t > 0xe8d4a51000 ? Math.floor(t / 1e3) : t;
}
function foldCandles(hourly, hours) {
	const h = clampGmTf(hours);
	const ordered = [...hourly].sort((a, b) => a.t - b.t);
	if (h <= 1) return ordered;
	const span = h * 3600;
	const map = /* @__PURE__ */ new Map();
	for (const c of ordered) {
		const key = Math.floor(unixSec(c.t) / span) * span;
		const prev = map.get(key);
		if (!prev) map.set(key, {
			t: key,
			open: c.open,
			high: c.high,
			low: c.low,
			close: c.close,
			volume: c.volume
		});
		else {
			prev.high = Math.max(prev.high, c.high);
			prev.low = Math.min(prev.low, c.low);
			prev.close = c.close;
			prev.volume += c.volume;
		}
	}
	return [...map.values()].sort((a, b) => a.t - b.t);
}
function rsiPeriod(bars) {
	if (bars >= 16) return 14;
	if (bars >= 9) return 7;
	return Math.max(4, bars - 2);
}
function simRsi30_70(closes, startUsd) {
	const period = rsiPeriod(closes.length);
	const series = rsiSeries(closes, period);
	let cash = startUsd;
	let btc = 0;
	let buys = 0;
	let sells = 0;
	for (let i = 0; i < closes.length; i++) {
		const r = series[i];
		const px = closes[i];
		if (r == null || px == null || px <= 0) continue;
		if (r < 30 && cash > 1) {
			const usd = cash * .25;
			cash -= usd;
			btc += usd / px;
			buys += 1;
		} else if (r > 70 && btc > 0) {
			const qty = btc * .25;
			cash += qty * px;
			btc -= qty;
			sells += 1;
		}
	}
	const last = closes[closes.length - 1] ?? 0;
	const nav = cash + btc * last;
	const first = closes.find((n) => n > 0) ?? last;
	const hold = first > 0 ? startUsd * (last / first) : startUsd;
	return {
		buys,
		sells,
		nav,
		hold
	};
}
function dayTraderTf(snap, hours, startUsd) {
	const h = clampGmTf(hours);
	const hourly = foldCandles(snap.candles ?? [], 1);
	const bars = foldCandles(hourly, h);
	const closes = bars.map((c) => c.close);
	const closes1h = hourly.map((c) => c.close);
	const period = rsiPeriod(closes.length);
	const rsi = rsiWilder(closes, period);
	const rsiAvg = rsiMean(closes, period);
	const rsi1h = rsiWilder(closes1h, rsiPeriod(closes1h.length));
	const now = rsi != null && rsi < 30 ? "BUY" : rsi != null && rsi > 70 ? "TRIM" : "WAIT";
	const sim = simRsi30_70(closes, startUsd);
	const sim1h = simRsi30_70(closes1h, startUsd);
	const vs1h = rsi == null || rsi1h == null ? "RSI n/a vs 1h" : `${rsi >= rsi1h ? "+" : ""}${(rsi - rsi1h).toFixed(1)} vs 1h RSI`;
	return {
		hours: h,
		bars: bars.length,
		rsi,
		rsiAvg,
		rsi1h,
		period,
		now,
		vs1h,
		sim: {
			buys: sim.buys,
			sells: sim.sells,
			nav: sim.nav,
			hold: sim.hold,
			deltaPct: sim.hold > 0 ? (sim.nav - sim.hold) / sim.hold * 100 : 0,
			buys1h: sim1h.buys,
			sells1h: sim1h.sells,
			nav1h: sim1h.nav,
			vs1hPct: sim1h.nav > 0 ? (sim.nav - sim1h.nav) / sim1h.nav * 100 : 0
		}
	};
}
function clampGmCash(n) {
	const x = Math.round(n / GM_CASH_STEP) * GM_CASH_STEP;
	return Math.min(GM_CASH_MAX, Math.max(GM_CASH_MIN, x));
}
function clampGmRisk(n) {
	return Math.min(5, Math.max(1, Math.round(n)));
}
function riskFraction(level) {
	return clampGmRisk(level) * .2;
}
function autoVars(snap, risk, adminLive, dayRsi) {
	const rsi = snap.rsi14;
	const funding = snap.positioning.fundingRate;
	const sell = snap.positioning.sellWallUsd;
	const buy = snap.positioning.buyWallUsd;
	return {
		dca: true,
		buyGrid: rsi != null && rsi >= 35 && rsi <= 65,
		flush: sell != null && buy != null && sell > buy * 1.5 || rsi != null && rsi < 35,
		dayTrader: adminLive && dayRsi != null && (dayRsi < 30 || dayRsi > 70),
		neutralGrid: false,
		fundingArb: risk >= 3 && funding != null && funding > 5e-4,
		naked: false
	};
}
function gmCall(snap, navUsd, opts) {
	const briefs = runBots(snap);
	const bot7 = heliosCall(snap, briefs, navUsd);
	const rsi = snap.rsi14;
	const rsiAvg = snap.rsiAvg;
	const vol = snap.btc.volume24h;
	const volAvg = snap.btc.volumeAvg24h;
	const funding = snap.positioning.fundingRate;
	const dayTf = dayTraderTf(snap, opts.dayHours, navUsd || 1e4);
	const dayRsi = dayTf.rsi;
	const picked = opts.pilot === "AUTO" ? autoVars(snap, opts.risk, opts.adminLive, dayRsi) : { ...opts.manual };
	if (opts.pilot === "MANUAL") {
		if (picked.naked && opts.risk < 4) picked.naked = false;
	}
	if (opts.pilot === "AUTO" && !opts.adminLive) {
		picked.dayTrader = false;
		picked.neutralGrid = false;
		picked.naked = false;
	}
	picked.naked = picked.naked && opts.risk >= 4 && (opts.adminLive || opts.pilot === "MANUAL");
	if (opts.pilot === "AUTO") picked.naked = false;
	const frac = riskFraction(opts.risk);
	const effects = GM_VAR_META.map((m) => {
		const on = picked[m.id];
		let effect = "idle";
		if (!on) effect = "off";
		else if (m.id === "dca") effect = rsi != null && rsiAvg != null && rsi < rsiAvg ? "add BUY" : "stand by (RSI not discounted)";
		else if (m.id === "buyGrid") effect = "buy dips in range";
		else if (m.id === "flush") effect = "buy after wash";
		else if (m.id === "dayTrader") effect = dayRsi != null && dayRsi > 70 ? `SELL sleeve · ${dayTf.hours}h RSI ${dayRsi.toFixed(1)}` : dayRsi != null && dayRsi < 30 ? `BUY oversold · ${dayTf.hours}h RSI ${dayRsi.toFixed(1)}` : `wait RSI 30/70 on ${dayTf.hours}h (${dayRsi != null ? dayRsi.toFixed(1) : "n/a"})`;
		else if (m.id === "neutralGrid") effect = "buy and sell inside range (sleeve)";
		else if (m.id === "fundingArb") effect = funding != null && funding > 5e-4 ? "HEDGE — shorts collect funding" : "funding not rich";
		else if (m.id === "naked") effect = rsi != null && rsi > 70 ? "SHORT sleeve" : "LONG sleeve";
		return {
			id: m.id,
			on,
			effect
		};
	});
	let stance = bot7.stance;
	let reason = `GM reads 7-B0T ${bot7.conviction} ${bot7.stance}.`;
	const volBid = vol != null && volAvg != null && vol > volAvg;
	const rsiBid = rsi != null && rsiAvg != null && rsi < rsiAvg;
	if (picked.dca && (rsiBid || volBid) && (bot7.stance === "HOLD" || bot7.stance === "WAIT" || bot7.stance === "ACCUMULATE")) {
		stance = rsi != null && rsi < 35 ? "BUY" : "ACCUMULATE";
		reason = "Aggressive DCA: tape cheaper than average — add to the sleeve.";
	}
	if (picked.flush && rsi != null && rsi < 32) {
		stance = "BUY";
		reason = "Flush buy: wash is done. Aggressive add.";
	}
	if (picked.buyGrid && rsi != null && rsi >= 35 && rsi <= 55 && stance === "HOLD") {
		stance = "ACCUMULATE";
		reason = "Buy-only grid: range dip.";
	}
	if (picked.dayTrader && dayRsi != null && dayRsi > 70) {
		stance = "TRIM";
		reason = `Day-trader ${dayTf.hours}h candle: RSI ${dayRsi.toFixed(1)} > 70 — profit BTC to ${GM_PROFIT_BTC}. Sleeve only.`;
	}
	if (picked.dayTrader && dayRsi != null && dayRsi < 30) {
		stance = "BUY";
		reason = `Day-trader ${dayTf.hours}h candle: RSI ${dayRsi.toFixed(1)} < 30 — buy oversold on the sleeve.`;
	}
	if (picked.neutralGrid && rsi != null && rsi > 62) {
		stance = "TRIM";
		reason = "Neutral grid: upper band — sleeve sell. Stack stays.";
	}
	if (picked.fundingArb && funding != null && funding > 5e-4) {
		stance = "HEDGE";
		reason = "Funding arb: keep spot BTC, short perp equal size. Isolated. Not a dump of the stack.";
	}
	if (picked.naked && opts.risk >= 4 && opts.adminLive) {
		stance = dayRsi != null && dayRsi > 70 ? "SHORT" : "BUY";
		reason = stance === "SHORT" ? "Naked short on the tiny GM sleeve only. 7-bot stack untouched." : "Naked long on the tiny GM sleeve.";
	} else if (picked.naked && opts.risk >= 4 && !opts.adminLive) {
		if (dayRsi != null && dayRsi > 70) {
			stance = "HOLD";
			reason = "Naked short is Live-admin only. Practice stays long-only on the sleeve.";
		}
	}
	const sellSleeve = stance === "TRIM" || stance === "SHORT";
	const conviction = stance === "BUY" || stance === "ACCUMULATE" || stance === "HEDGE" ? opts.risk >= 4 ? "HIGH" : opts.risk >= 2 ? "MEDIUM" : "LOW" : "LOW";
	const base = stance === "BUY" ? .04 : stance === "ACCUMULATE" ? .02 : stance === "TRIM" || stance === "SHORT" ? .03 : stance === "HEDGE" ? .02 : 0;
	const clipUsd = Math.round(Math.max(0, navUsd * frac * base));
	const triggers = [];
	const buy = stance === "BUY" || stance === "ACCUMULATE";
	const sell = stance === "TRIM" || stance === "SHORT";
	if (buy && picked.dca && (rsiBid || volBid)) triggers.push({
		id: "dca",
		label: "Aggressive DCA",
		why: rsiBid ? "RSI under average" : "vol > Coinbase avg"
	});
	if (buy && picked.flush && rsi != null && rsi < 32) triggers.push({
		id: "flush",
		label: "Flush buy",
		why: `RSI ${rsi.toFixed(1)} after wash`
	});
	if (buy && picked.buyGrid && rsi != null && rsi >= 35 && rsi <= 55) triggers.push({
		id: "buyGrid",
		label: "Buy-only grid",
		why: `range dip RSI ${rsi.toFixed(1)}`
	});
	if (buy && picked.dayTrader && dayRsi != null && dayRsi < 30) triggers.push({
		id: "dayTrader",
		label: `Day-trader ${dayTf.hours}h`,
		why: `RSI ${dayRsi.toFixed(1)} < 30`
	});
	if (buy && picked.naked) triggers.push({
		id: "naked",
		label: "Naked long",
		why: "isolated sleeve long"
	});
	if (sell && picked.dayTrader && dayRsi != null && dayRsi > 70) triggers.push({
		id: "dayTrader",
		label: `Day-trader ${dayTf.hours}h`,
		why: `RSI ${dayRsi.toFixed(1)} > 70 → profit BTC`
	});
	if (sell && picked.neutralGrid) triggers.push({
		id: "neutralGrid",
		label: "Neutral grid",
		why: "upper band sleeve sell"
	});
	if (sell && picked.naked && stance === "SHORT") triggers.push({
		id: "naked",
		label: "Naked short",
		why: "isolated sleeve only"
	});
	if (stance === "HEDGE" && picked.fundingArb) triggers.push({
		id: "fundingArb",
		label: "Funding arb",
		why: "keep spot, short perp"
	});
	if (!triggers.length) triggers.push({
		id: "bot7",
		label: "7-B0T",
		why: `${bot7.conviction} ${bot7.stance}`
	});
	return {
		stance,
		conviction,
		clipUsd,
		reason,
		vsBot7: {
			stance: bot7.stance,
			conviction: bot7.conviction,
			clipUsd: bot7.clipUsd
		},
		vars: picked,
		effects,
		triggers,
		sellSleeve,
		autoDayTrader: Boolean(picked.dayTrader && opts.pilot === "AUTO" && opts.adminLive),
		dayTf
	};
}
/** 24h AUTO practice GM. Start 4 Sep 2026 13:40 ET. Pause 5 Sep 2026 13:40 ET. Live Coinbase stays off. */
var AUTO_RUN_ID = "auto-24h-gm-20260904-1340et";
var AUTO_RUN_START_MS = Date.parse("2026-09-04T13:40:00-04:00");
var AUTO_RUN_UNTIL_MS = Date.parse("2026-09-05T13:40:00-04:00");
var AUTO_RUN_CASH = GM_CASH_MAX;
var AUTO_RUN_LABEL = "DEMO AUTO on live tape · paper only · Coinbase locked";
//#endregion
export { clampGmRisk as _, AUTO_RUN_UNTIL_MS as a, gmCall as b, GM_CASH_MIN as c, GM_FUND_USDC as d, GM_NAME as f, clampGmCash as g, GM_VAR_META as h, AUTO_RUN_START_MS as i, GM_CASH_STEP as l, GM_PROFIT_EXPLORER as m, AUTO_RUN_ID as n, DEFAULT_GM_VARS as o, GM_PROFIT_BTC as p, AUTO_RUN_LABEL as r, GM_CASH_MAX as s, AUTO_RUN_CASH as t, GM_FUND_EXPLORER as u, clampGmTf as v, dayTraderTf as y };
