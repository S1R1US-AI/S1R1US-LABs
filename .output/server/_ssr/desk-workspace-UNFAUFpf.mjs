import { o as __toESM } from "../_runtime.mjs";
import { Gn as SEO_TAB_GM_AUTO, Nr as TAB_GM_AUTO, Pr as TAB_GM_AUTO_TAIL, S as GIF_AI_BTC_BOT_NAME, b as GIF_AI_BTC_BOT, x as GIF_AI_BTC_BOT_EQ } from "./brand-CDqF9nyU.mjs";
import { S as require_jsx_runtime, U as require_react, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as rsiHex, f as rsiTone, n as Button, o as barBlue, s as cn, t as BTC_TONE } from "./renew-password-CgrcnRVg.mjs";
import { _ as Panel, a as GmRainbow, x as SeoImage } from "./shell-DhzBcQbb.mjs";
import { _ as overlayBars } from "./proxy-book-BG4V1YAe.mjs";
import { b as gmCall, f as GM_NAME, o as DEFAULT_GM_VARS, r as AUTO_RUN_LABEL, t as AUTO_RUN_CASH } from "./auto-window-D9gd5Rg8.mjs";
import { a as YAxis, c as Line, d as Bar, g as Tooltip, h as ResponsiveContainer, i as LineChart, l as CartesianGrid, m as Cell, o as XAxis, p as Customized, t as ComposedChart, u as ReferenceLine } from "../_libs/recharts+[...].mjs";
import { c as callStanceClass, d as stanceClass, u as money } from "./helios-card-BHXEEBxX.mjs";
import { t as Lock3dRail } from "./lock3d-status-Dcvw2b_m.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/desk-workspace-UNFAUFpf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var UP = "var(--color-high)";
var DN = "var(--color-sell)";
function hourLabel(t) {
	return (/* @__PURE__ */ new Date(t * 1e3)).toLocaleString("en-US", {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit"
	});
}
function CandleLayer({ xAxisMap, yAxisMap, rows }) {
	const xAxis = xAxisMap ? Object.values(xAxisMap)[0] : void 0;
	const yAxis = yAxisMap?.px ?? (yAxisMap ? Object.values(yAxisMap)[0] : void 0);
	if (!xAxis?.scale || !yAxis?.scale) return null;
	const bw = xAxis.scale.bandwidth?.() ?? 7;
	const bodyW = Math.max(3, Math.min(14, bw * .72));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", { children: rows.map((d) => {
		const x = xAxis.scale(d.t);
		if (!Number.isFinite(x)) return null;
		const cx = x + bw / 2;
		const yH = yAxis.scale(d.high);
		const yL = yAxis.scale(d.low);
		const yO = yAxis.scale(d.open);
		const yC = yAxis.scale(d.close);
		if (![
			yH,
			yL,
			yO,
			yC
		].every(Number.isFinite)) return null;
		const color = d.up ? UP : DN;
		const top = Math.min(yO, yC);
		const h = Math.max(1.2, Math.abs(yC - yO));
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1: cx,
			x2: cx,
			y1: yH,
			y2: yL,
			stroke: color,
			strokeWidth: 1.15
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: cx - bodyW / 2,
			y: top,
			width: bodyW,
			height: h,
			fill: d.up ? UP : DN,
			fillOpacity: d.up ? .92 : 1,
			stroke: color,
			strokeWidth: .8
		})] }, d.t);
	}) });
}
var RANGES = [
	"24 HR",
	"7-DAY",
	"365-DAY"
];
var RANGE_SPEC = {
	"24 HR": {
		granularity: 3600,
		days: 1
	},
	"7-DAY": {
		granularity: 21600,
		days: 7
	},
	"365-DAY": {
		granularity: 86400,
		days: 365
	}
};
/** Coinbase public candles for a range button. Max 300 rows per request — chunked. */
async function fetchRangeCandles(range) {
	const { granularity, days } = RANGE_SPEC[range];
	const endMs = Date.now();
	const startMs = endMs - days * 86400 * 1e3;
	const stepMs = 290 * granularity * 1e3;
	const out = [];
	for (let from = startMs; from < endMs; from += stepMs) {
		const to = Math.min(from + stepMs, endMs);
		const url = `https://api.exchange.coinbase.com/products/BTC-USD/candles?granularity=${granularity}&start=${new Date(from).toISOString()}&end=${new Date(to).toISOString()}`;
		const res = await fetch(url, { headers: { accept: "application/json" } });
		if (!res.ok) throw new Error(`coinbase ${res.status}`);
		const rows = await res.json();
		for (const row of rows ?? []) {
			const c = {
				t: Number(row[0]),
				low: Number(row[1]),
				high: Number(row[2]),
				open: Number(row[3]),
				close: Number(row[4]),
				volume: Number(row[5])
			};
			if (c.t > 0 && Number.isFinite(c.close) && c.close > 0) out.push(c);
		}
	}
	const seen = /* @__PURE__ */ new Set();
	return out.filter((c) => seen.has(c.t) ? false : (seen.add(c.t), true)).sort((a, b) => a.t - b.t);
}
/** Overlay assets selectable next to the BTC last price. GOLD uses Coinbase PAXG-USD (1 token = 1 oz gold). */
var TAPE_ASSETS = [
	"GOLD",
	"SOL",
	"ICP",
	"ETH",
	"USDC"
];
var ASSET_PRODUCT = {
	GOLD: "PAXG-USD",
	SOL: "SOL-USD",
	ICP: "ICP-USD",
	ETH: "ETH-USD",
	USDC: "USDC-USD"
};
/** Ratio semantics per pair. GOLD charts BTC needed for 1 oz gold; the rest chart units per 1 BTC. */
var RATIO_LABEL = {
	GOLD: "GOLD:BTC",
	SOL: "BTC:SOL",
	ICP: "BTC:ICP",
	ETH: "BTC:ETH"
};
/** Coinbase public hourly candles for an overlay pair product — feeds the ratio chart. */
async function fetchAssetCandles(asset) {
	const product = ASSET_PRODUCT[asset];
	const res = await fetch(`https://api.exchange.coinbase.com/products/${product}/candles?granularity=3600`, { headers: { accept: "application/json" } });
	if (!res.ok) throw new Error(`coinbase ${res.status}`);
	const rows = await res.json();
	const out = [];
	for (const row of rows ?? []) {
		const c = {
			t: Number(row[0]),
			low: Number(row[1]),
			high: Number(row[2]),
			open: Number(row[3]),
			close: Number(row[4]),
			volume: Number(row[5])
		};
		if (c.t > 0 && Number.isFinite(c.close) && c.close > 0) out.push(c);
	}
	const seen = /* @__PURE__ */ new Set();
	return out.filter((c) => seen.has(c.t) ? false : (seen.add(c.t), true)).sort((a, b) => a.t - b.t);
}
/** Coinbase public 24h stats with a v2 spot fallback. Read-only, no keys. */
async function fetchAssetQuote(asset) {
	const product = ASSET_PRODUCT[asset];
	try {
		const res = await fetch(`https://api.exchange.coinbase.com/products/${product}/stats`, { headers: { accept: "application/json" } });
		if (res.ok) {
			const j = await res.json();
			const lastPx = Number(j.last);
			const openPx = Number(j.open);
			if (Number.isFinite(lastPx) && lastPx > 0) return {
				last: lastPx,
				open: Number.isFinite(openPx) && openPx > 0 ? openPx : null
			};
		}
	} catch {}
	try {
		const res = await fetch(`https://api.coinbase.com/v2/prices/${product}/spot`, { headers: { accept: "application/json" } });
		if (!res.ok) return null;
		const j = await res.json();
		const lastPx = Number(j.data?.amount);
		return Number.isFinite(lastPx) && lastPx > 0 ? {
			last: lastPx,
			open: null
		} : null;
	} catch {
		return null;
	}
}
function IndicatorBtn({ on, onClick, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-pressed": on,
		onClick,
		className: cn("indicator-title h-7 rounded-sm border px-2 text-[10px] font-semibold tracking-[0.08em] uppercase", on ? "border-tab bg-tab/20" : "border-rule"),
		children: label
	});
}
/** Bitcoin Current Market tape — Coinbase data with clickable graph overlays. */
function WorkspaceTape({ snap }) {
	const [showCandle, setShowCandle] = (0, import_react.useState)(true);
	const [showRsi, setShowRsi] = (0, import_react.useState)(true);
	const [showVol, setShowVol] = (0, import_react.useState)(true);
	const [showMacd50, setShowMacd50] = (0, import_react.useState)(false);
	const [showMacd200, setShowMacd200] = (0, import_react.useState)(false);
	const [showBb, setShowBb] = (0, import_react.useState)(false);
	const [showEma, setShowEma] = (0, import_react.useState)(false);
	const [showSma, setShowSma] = (0, import_react.useState)(false);
	const [range, setRange] = (0, import_react.useState)(null);
	const [rangeCandles, setRangeCandles] = (0, import_react.useState)(null);
	const [rangeErr, setRangeErr] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!range) {
			setRangeCandles(null);
			setRangeErr(null);
			return;
		}
		let live = true;
		setRangeErr(null);
		fetchRangeCandles(range).then((c) => {
			if (live) setRangeCandles(c);
		}).catch(() => {
			if (live) setRangeErr("Coinbase range pull failed — showing live hourly tape.");
		});
		return () => {
			live = false;
		};
	}, [range]);
	const data = (0, import_react.useMemo)(() => {
		const candles = range && rangeCandles?.length ? rangeCandles : snap?.candles ?? [];
		return overlayBars(candles);
	}, [
		range,
		rangeCandles,
		snap?.candles
	]);
	const last = data[data.length - 1];
	const maxVol = Math.max(0, ...data.map((d) => d.volume));
	const pxDomain = (0, import_react.useMemo)(() => {
		if (!data.length) return ["auto", "auto"];
		let lo = Infinity;
		let hi = -Infinity;
		for (const d of data) {
			lo = Math.min(lo, d.low, showBb ? d.bbLower ?? d.low : d.low, showEma ? d.ema12 ?? d.low : d.low);
			hi = Math.max(hi, d.high, showBb ? d.bbUpper ?? d.high : d.high, showEma ? d.ema12 ?? d.high : d.high);
		}
		const pad = (hi - lo) * .06 || 50;
		return [lo - pad, hi + pad];
	}, [
		data,
		showBb,
		showEma
	]);
	const tickLabel = (v) => range === "365-DAY" || range === "7-DAY" ? (/* @__PURE__ */ new Date(v * 1e3)).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric"
	}) : (/* @__PURE__ */ new Date(v * 1e3)).toLocaleTimeString("en-US", { hour: "numeric" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3 min-w-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex flex-wrap items-center gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndicatorBtn, {
						on: showCandle,
						onClick: () => setShowCandle((v) => !v),
						label: "Candle"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndicatorBtn, {
						on: showRsi,
						onClick: () => setShowRsi((v) => !v),
						label: "RSI"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndicatorBtn, {
						on: showVol,
						onClick: () => setShowVol((v) => !v),
						label: "24-Vol"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndicatorBtn, {
						on: showMacd50,
						onClick: () => setShowMacd50((v) => !v),
						label: "MACD 50"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndicatorBtn, {
						on: showMacd200,
						onClick: () => setShowMacd200((v) => !v),
						label: "MACD 200"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndicatorBtn, {
						on: showBb,
						onClick: () => setShowBb((v) => !v),
						label: "BB"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndicatorBtn, {
						on: showEma,
						onClick: () => setShowEma((v) => !v),
						label: "EMA"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndicatorBtn, {
						on: showSma,
						onClick: () => setShowSma((v) => !v),
						label: "SMA"
					}),
					RANGES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndicatorBtn, {
						on: range === r,
						onClick: () => setRange((cur) => cur === r ? null : r),
						label: r
					}, r))
				]
			}),
			rangeErr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-1 text-[10px] text-down",
				children: rangeErr
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "tape-compact",
				children: !data.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Waiting for Coinbase candles."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ComposedChart, {
						data,
						margin: {
							top: 4,
							right: 8,
							left: 0,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "var(--color-rule)",
								vertical: false,
								strokeOpacity: .7
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "t",
								tickFormatter: (v) => tickLabel(Number(v)),
								tick: {
									fill: "var(--color-muted)",
									fontSize: 9
								},
								axisLine: false,
								tickLine: false,
								minTickGap: 36,
								height: 18
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								yAxisId: "px",
								domain: pxDomain,
								tickFormatter: (v) => `$${Math.round(Number(v) / 1e3)}k`,
								tick: {
									fill: "var(--color-muted)",
									fontSize: 9
								},
								axisLine: false,
								tickLine: false,
								width: 36,
								orientation: "right"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								yAxisId: "vol",
								orientation: "left",
								domain: [0, Math.max(1, maxVol) * 3.8],
								hide: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								yAxisId: "rsi",
								domain: [0, 400],
								hide: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								yAxisId: "macd",
								domain: ["auto", "auto"],
								hide: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								contentStyle: {
									background: "var(--color-surface)",
									border: "1px solid var(--color-rule)",
									borderRadius: 6,
									fontSize: 11,
									color: "var(--color-fg)"
								},
								labelFormatter: (l) => hourLabel(Number(l)),
								formatter: (value, name) => {
									const n = typeof value === "number" ? value : Number(value);
									if (name === "volume") return [`${n.toFixed(1)} BTC`, "24-Vol"];
									if (name === "RSI-14") return [n.toFixed(1), "RSI-14"];
									if (String(name).startsWith("MACD")) return [n.toFixed(1), String(name)];
									return [money(n, 0), String(name)];
								}
							}),
							showVol ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								yAxisId: "vol",
								dataKey: "volume",
								name: "volume",
								maxBarSize: 8,
								isAnimationActive: false,
								children: data.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
									fill: d.up ? UP : DN,
									fillOpacity: .35
								}, d.t))
							}) : null,
							showMacd50 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								yAxisId: "macd",
								dataKey: "macd50Hist",
								name: "MACD 50",
								maxBarSize: 6,
								isAnimationActive: false,
								children: data.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
									fill: (d.macd50Hist ?? 0) >= 0 ? UP : DN,
									fillOpacity: .55
								}, d.t))
							}) : null,
							showMacd200 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								yAxisId: "macd",
								dataKey: "macd200Hist",
								name: "MACD 200",
								maxBarSize: 6,
								isAnimationActive: false,
								children: data.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
									fill: (d.macd200Hist ?? 0) >= 0 ? "var(--color-tab)" : DN,
									fillOpacity: .45
								}, d.t))
							}) : null,
							showRsi ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								yAxisId: "rsi",
								type: "monotone",
								dataKey: "rsi",
								name: "RSI-14",
								stroke: "var(--color-expand, #a855f7)",
								strokeWidth: 1.2,
								strokeOpacity: .85,
								dot: false,
								isAnimationActive: false
							}) : null,
							showBb ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								yAxisId: "px",
								type: "monotone",
								dataKey: "bbUpper",
								stroke: "var(--color-muted)",
								strokeOpacity: .5,
								strokeDasharray: "3 3",
								dot: false,
								name: "BB upper",
								isAnimationActive: false
							}) : null,
							showBb ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								yAxisId: "px",
								type: "monotone",
								dataKey: "bbLower",
								stroke: "var(--color-muted)",
								strokeOpacity: .5,
								strokeDasharray: "3 3",
								dot: false,
								name: "BB lower",
								isAnimationActive: false
							}) : null,
							showEma ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								yAxisId: "px",
								type: "monotone",
								dataKey: "ema12",
								stroke: "var(--color-tab)",
								strokeWidth: 1.4,
								dot: false,
								name: "EMA12",
								isAnimationActive: false
							}) : null,
							showEma ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								yAxisId: "px",
								type: "monotone",
								dataKey: "ema26",
								stroke: "var(--color-tab)",
								strokeOpacity: .65,
								strokeDasharray: "4 3",
								strokeWidth: 1.2,
								dot: false,
								name: "EMA26",
								isAnimationActive: false
							}) : null,
							showSma ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								yAxisId: "px",
								type: "monotone",
								dataKey: "sma20",
								stroke: UP,
								strokeWidth: 1.3,
								dot: false,
								name: "SMA20",
								isAnimationActive: false
							}) : null,
							showSma ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								yAxisId: "px",
								type: "monotone",
								dataKey: "sma50",
								stroke: UP,
								strokeOpacity: .6,
								strokeDasharray: "4 3",
								strokeWidth: 1.1,
								dot: false,
								name: "SMA50",
								isAnimationActive: false
							}) : null,
							!showCandle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								yAxisId: "px",
								type: "monotone",
								dataKey: "close",
								stroke: BTC_TONE,
								strokeWidth: 1.5,
								dot: false,
								name: "Close",
								isAnimationActive: false
							}) : null,
							showCandle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Customized, { component: (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CandleLayer, {
								xAxisMap: props.xAxisMap,
								yAxisMap: props.yAxisMap,
								rows: data
							}) }) : null
						]
					})
				})
			}),
			last ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 font-mono text-[10px] text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: last.up ? "text-high" : "text-sell",
						children: last.up ? "▲" : "▼"
					}),
					" · ",
					range ?? "live hourly",
					" · toggles: Candle RSI 24-Vol MACD BB EMA SMA · ",
					snap?.btc.source ?? "Coinbase"
				]
			}) : null
		]
	});
}
function TapeChart({ snap }) {
	const [showEma, setShowEma] = (0, import_react.useState)(true);
	const [showBb, setShowBb] = (0, import_react.useState)(true);
	const [showVol, setShowVol] = (0, import_react.useState)(true);
	const [showMacd50, setShowMacd50] = (0, import_react.useState)(false);
	const [showMacd200, setShowMacd200] = (0, import_react.useState)(false);
	const [asset, setAsset] = (0, import_react.useState)("USDC");
	const [assetOpen, setAssetOpen] = (0, import_react.useState)(false);
	const [quotes, setQuotes] = (0, import_react.useState)({});
	const [pairCandles, setPairCandles] = (0, import_react.useState)(null);
	const [pairErr, setPairErr] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setPairCandles(null);
		setPairErr(null);
		if (asset === "USDC") return;
		let live = true;
		fetchAssetCandles(asset).then((c) => {
			if (live) setPairCandles(c);
		}).catch(() => {
			if (live) setPairErr(`Coinbase ${ASSET_PRODUCT[asset]} pull failed — showing the BTC tape.`);
		});
		return () => {
			live = false;
		};
	}, [asset]);
	(0, import_react.useEffect)(() => {
		let live = true;
		const load = () => {
			for (const a of TAPE_ASSETS) fetchAssetQuote(a).then((q) => {
				if (live && q) setQuotes((prev) => ({
					...prev,
					[a]: q
				}));
			});
		};
		load();
		const timer = setInterval(load, 3e5);
		return () => {
			live = false;
			clearInterval(timer);
		};
	}, []);
	const data = (0, import_react.useMemo)(() => overlayBars(snap?.candles ?? []), [snap?.candles]);
	/** Independent ratio series for the selected pair — one dropdown value at a time, never overlaid. */
	const ratioData = (0, import_react.useMemo)(() => {
		if (asset === "USDC" || !pairCandles?.length) return null;
		const byT = new Map(pairCandles.map((c) => [c.t, c.close]));
		const rows = [];
		for (const d of data) {
			const px = byT.get(d.t);
			if (!px || px <= 0 || d.close <= 0) continue;
			rows.push({
				t: d.t,
				ratio: asset === "GOLD" ? px / d.close : d.close / px
			});
		}
		return rows.length ? rows : null;
	}, [
		asset,
		pairCandles,
		data
	]);
	const ratioLast = ratioData?.[ratioData.length - 1];
	const ratioFirst = ratioData?.[0];
	const ratioPct = ratioLast && ratioFirst && ratioFirst.ratio > 0 ? (ratioLast.ratio - ratioFirst.ratio) / ratioFirst.ratio * 100 : null;
	const rsiData = data.filter((d) => d.rsi != null);
	const last = data[data.length - 1];
	const maxVol = Math.max(0, ...data.map((d) => d.volume));
	const pxDomain = (0, import_react.useMemo)(() => {
		if (!data.length) return ["auto", "auto"];
		let lo = Infinity;
		let hi = -Infinity;
		for (const d of data) {
			lo = Math.min(lo, d.low, d.bbLower ?? d.low, d.ema50 ?? d.low, d.ema200 ?? d.low);
			hi = Math.max(hi, d.high, d.bbUpper ?? d.high, d.ema50 ?? d.high, d.ema200 ?? d.high);
		}
		const pad = (hi - lo) * .06 || 50;
		return [lo - pad, hi + pad];
	}, [data]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		kicker: "Coinbase hourly",
		title: "BTC tape + overlays",
		className: "flex w-full min-h-0 flex-col",
		kickerClass: "coinbase-orange",
		titleClass: "text-high",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: ratioData ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							on: showEma,
							onClick: () => setShowEma((v) => !v),
							label: "EMA 12/26"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							on: showBb,
							onClick: () => setShowBb((v) => !v),
							label: "Bollinger"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							on: showVol,
							onClick: () => setShowVol((v) => !v),
							label: "Volume"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							on: showMacd50,
							onClick: () => setShowMacd50((v) => !v),
							label: "MACD 50"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							on: showMacd200,
							onClick: () => setShowMacd200((v) => !v),
							label: "MACD 200"
						})
					] })
				}), last ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-x-3 gap-y-1",
					children: [
						ratioData && ratioLast ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: cn("font-mono text-base tabular-nums sm:text-lg", ratioPct == null || ratioPct >= 0 ? "text-high" : "text-sell"),
							children: [asset === "GOLD" ? `${fmtRatio(ratioLast.ratio)} BTC = 1 oz gold` : `1 BTC = ${fmtRatio(ratioLast.ratio)} ${asset}`, ratioPct != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								" ",
								ratioPct >= 0 ? "▲" : "▼",
								" ",
								ratioPct >= 0 ? "+" : "",
								ratioPct.toFixed(2),
								"%"
							] }) : null]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: cn("font-mono text-base tabular-nums sm:text-lg", last.up ? "text-high" : "text-sell"),
							children: [
								money(last.close, 0),
								" ",
								last.up ? "▲" : "▼",
								" ",
								last.close >= last.open ? "+" : "",
								((last.close - last.open) / last.open * 100).toFixed(2),
								"%"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"aria-haspopup": "listbox",
								"aria-expanded": assetOpen,
								"aria-label": "Select overlay asset",
								onClick: () => setAssetOpen((v) => !v),
								className: "indicator-title h-8 rounded-sm border border-rule px-2 font-mono text-xs font-semibold tracking-[0.08em]",
								children: [asset, " ▾"]
							}), assetOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								role: "listbox",
								"aria-label": "Overlay asset",
								className: "absolute right-0 z-20 mt-1 w-24 rounded-md border border-rule bg-surface p-1 shadow-lg",
								children: TAPE_ASSETS.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									role: "option",
									"aria-selected": a === asset,
									onClick: () => {
										setAsset(a);
										setAssetOpen(false);
									},
									className: cn("w-full rounded-sm px-2 py-1 text-left font-mono text-xs", a === asset ? "bg-tab/20 text-fg" : "text-muted hover:text-fg"),
									children: a
								}) }, a))
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssetQuoteChip, {
							asset,
							quote: quotes[asset]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PairRatioChip, {
							asset,
							btc: last.close,
							px: quotes[asset]?.last
						})
					]
				}) : null]
			}),
			pairErr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-1 text-[10px] text-down",
				children: pairErr
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "tape-main",
				children: ratioData ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ComposedChart, {
						data: ratioData,
						margin: {
							top: 6,
							right: 12,
							left: 0,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "var(--color-rule)",
								vertical: false,
								strokeOpacity: .9
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "t",
								tickFormatter: (v) => (/* @__PURE__ */ new Date(Number(v) * 1e3)).toLocaleTimeString("en-US", { hour: "numeric" }),
								tick: {
									fill: "var(--color-muted)",
									fontSize: 10
								},
								axisLine: false,
								tickLine: false,
								minTickGap: 28,
								height: 22
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								domain: ["auto", "auto"],
								tickFormatter: (v) => fmtRatio(Number(v)),
								tick: {
									fill: "var(--color-muted)",
									fontSize: 10
								},
								axisLine: false,
								tickLine: false,
								width: 56,
								orientation: "right"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								contentStyle: {
									background: "var(--color-surface)",
									border: "1px solid var(--color-rule)",
									borderRadius: 8,
									fontSize: 12,
									color: "var(--color-fg)"
								},
								labelFormatter: (l) => hourLabel(Number(l)),
								formatter: (value) => [fmtRatio(typeof value === "number" ? value : Number(value)), asset === "USDC" ? "ratio" : RATIO_LABEL[asset]]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "ratio",
								stroke: "var(--color-medium)",
								strokeWidth: 1.8,
								dot: false,
								name: asset === "USDC" ? "ratio" : RATIO_LABEL[asset],
								isAnimationActive: false
							})
						]
					})
				}) : data.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ComposedChart, {
						data,
						margin: {
							top: 6,
							right: 12,
							left: 0,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "var(--color-rule)",
								vertical: false,
								strokeOpacity: .9
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "t",
								tickFormatter: (v) => (/* @__PURE__ */ new Date(Number(v) * 1e3)).toLocaleTimeString("en-US", { hour: "numeric" }),
								tick: {
									fill: "var(--color-muted)",
									fontSize: 10
								},
								axisLine: false,
								tickLine: false,
								minTickGap: 28,
								height: 22
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								yAxisId: "px",
								domain: pxDomain,
								tickFormatter: (v) => Number(v) >= 1e3 ? `$${Math.round(Number(v) / 1e3)}k` : money(Number(v), 0),
								tick: {
									fill: "var(--color-muted)",
									fontSize: 10
								},
								axisLine: false,
								tickLine: false,
								width: 46,
								orientation: "right"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								yAxisId: "vol",
								orientation: "left",
								domain: [0, (max) => max * 3.6],
								hide: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								contentStyle: {
									background: "var(--color-surface)",
									border: "1px solid var(--color-rule)",
									borderRadius: 8,
									fontSize: 12,
									color: "var(--color-fg)"
								},
								labelFormatter: (l) => hourLabel(Number(l)),
								formatter: (value, name) => {
									const n = typeof value === "number" ? value : Number(value);
									if (name === "volume") return [n.toFixed(1) + " BTC", "Vol"];
									if (name === "EMA12" || name === "EMA26" || name === "EMA50" || name === "EMA200" || name === "BB upper" || name === "BB lower") return [money(n, 0), String(name)];
									return [money(n, 0), String(name)];
								}
							}),
							showVol ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								yAxisId: "vol",
								dataKey: "volume",
								name: "volume",
								maxBarSize: 10,
								isAnimationActive: false,
								children: data.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: barBlue(d.volume, maxVol) }, d.t))
							}) : null,
							showBb ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								yAxisId: "px",
								type: "monotone",
								dataKey: "bbUpper",
								stroke: "var(--color-muted)",
								strokeOpacity: .55,
								strokeDasharray: "4 4",
								dot: false,
								name: "BB upper",
								isAnimationActive: false
							}) : null,
							showBb ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								yAxisId: "px",
								type: "monotone",
								dataKey: "bbLower",
								stroke: "var(--color-muted)",
								strokeOpacity: .55,
								strokeDasharray: "4 4",
								dot: false,
								name: "BB lower",
								isAnimationActive: false
							}) : null,
							showEma ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								yAxisId: "px",
								type: "monotone",
								dataKey: "ema12",
								stroke: "var(--color-medium)",
								strokeWidth: 1.6,
								dot: false,
								name: "EMA12",
								isAnimationActive: false
							}) : null,
							showEma ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								yAxisId: "px",
								type: "monotone",
								dataKey: "ema26",
								stroke: "var(--color-medium)",
								strokeOpacity: .7,
								strokeDasharray: "5 4",
								strokeWidth: 1.5,
								dot: false,
								name: "EMA26",
								isAnimationActive: false
							}) : null,
							showMacd50 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								yAxisId: "px",
								type: "monotone",
								dataKey: "ema50",
								stroke: "var(--color-accent)",
								strokeWidth: 1.5,
								dot: false,
								name: "EMA50",
								isAnimationActive: false
							}) : null,
							showMacd200 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								yAxisId: "px",
								type: "monotone",
								dataKey: "ema200",
								stroke: "var(--color-high)",
								strokeWidth: 1.7,
								dot: false,
								name: "EMA200",
								isAnimationActive: false
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Customized, { component: (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CandleLayer, {
								xAxisMap: props.xAxisMap,
								yAxisMap: props.yAxisMap,
								rows: data
							}) })
						]
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Waiting for candles."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 grid grid-cols-1 gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OscPane, {
						label: "RSI-14",
						tone: rsiHex(snap?.rsi14, snap?.rsiAvg),
						children: rsiData.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
								data: rsiData,
								margin: {
									top: 2,
									right: 12,
									left: 0,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										domain: [0, 100],
										hide: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
										y: 70,
										stroke: DN,
										strokeOpacity: .45,
										strokeDasharray: "3 3"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
										y: 50,
										stroke: "var(--color-muted)",
										strokeOpacity: .35
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
										y: 30,
										stroke: UP,
										strokeOpacity: .45,
										strokeDasharray: "3 3"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										type: "monotone",
										dataKey: "rsi",
										stroke: "var(--color-medium)",
										strokeWidth: 1.8,
										dot: false,
										isAnimationActive: false
									})
								]
							})
						}) : null
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OscPane, {
						label: "MACD hist",
						tone: snap?.macd ? snap.macd.hist >= 0 ? UP : DN : void 0,
						children: data.some((d) => d.macdHist != null) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ComposedChart, {
								data,
								margin: {
									top: 2,
									right: 12,
									left: 0,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										hide: true,
										domain: ["auto", "auto"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
										y: 0,
										stroke: "var(--color-muted)",
										strokeOpacity: .4
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "macdHist",
										maxBarSize: 6,
										isAnimationActive: false,
										children: data.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: (d.macdHist ?? 0) >= 0 ? UP : DN }, d.t))
									})
								]
							})
						}) : null
					}),
					showMacd50 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OscPane, {
						label: "MACD 50",
						children: data.some((d) => d.macd50Hist != null) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ComposedChart, {
								data,
								margin: {
									top: 2,
									right: 12,
									left: 0,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										hide: true,
										domain: ["auto", "auto"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
										y: 0,
										stroke: "var(--color-muted)",
										strokeOpacity: .4
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "macd50Hist",
										maxBarSize: 6,
										isAnimationActive: false,
										children: data.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: (d.macd50Hist ?? 0) >= 0 ? UP : DN }, `m50-${d.t}`))
									})
								]
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[10px] text-muted",
							children: [
								"Coinbase hours ",
								data.length,
								"/109 — filling live"
							]
						})
					}) : null,
					showMacd200 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OscPane, {
						label: "MACD 200",
						children: data.some((d) => d.macd200Hist != null) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ComposedChart, {
								data,
								margin: {
									top: 2,
									right: 12,
									left: 0,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										hide: true,
										domain: ["auto", "auto"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
										y: 0,
										stroke: "var(--color-muted)",
										strokeOpacity: .4
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "macd200Hist",
										maxBarSize: 6,
										isAnimationActive: false,
										children: data.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: (d.macd200Hist ?? 0) >= 0 ? UP : DN }, `m200-${d.t}`))
									})
								]
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[10px] text-muted",
							children: [
								"Coinbase hours ",
								data.length,
								"/209 — filling live"
							]
						})
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4 lg:grid-cols-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TapeStat, {
						k: "24h high / low",
						v: data.length ? `${money(Math.max(...data.map((d) => d.high)), 0)} / ${money(Math.min(...data.map((d) => d.low)), 0)}` : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TapeStat, {
						k: "EMA-21",
						v: snap?.ema21 != null ? money(snap.ema21, 0) : "—",
						tone: last && snap?.ema21 != null ? last.close >= snap.ema21 ? "rsi-above" : "rsi-below" : void 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TapeStat, {
						k: "SMA-50",
						v: snap?.sma50 != null ? money(snap.sma50, 0) : "—",
						tone: last && snap?.sma50 != null ? last.close >= snap.sma50 ? "rsi-above" : "rsi-below" : void 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TapeStat, {
						k: "BB %B",
						v: snap?.bbPct != null ? snap.bbPct.toFixed(2) : "—",
						tone: snap?.bbPct == null ? void 0 : snap.bbPct <= .3 ? "rsi-above" : snap.bbPct >= .7 ? "rsi-below" : void 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TapeStat, {
						k: "ATR-14",
						v: snap?.atr != null ? money(snap.atr, 0) : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TapeStat, {
						k: "MACD hist",
						v: snap?.macd ? `${snap.macd.hist >= 0 ? "+" : ""}${Math.abs(snap.macd.hist) >= 10 ? snap.macd.hist.toFixed(0) : snap.macd.hist.toFixed(1)}` : "—",
						tone: snap?.macd ? snap.macd.hist >= 0 ? "rsi-above" : "rsi-below" : void 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TapeStat, {
						k: "MACD 50",
						v: snap?.macd50 ? `${snap.macd50.hist >= 0 ? "+" : ""}${Math.abs(snap.macd50.hist) >= 10 ? snap.macd50.hist.toFixed(0) : snap.macd50.hist.toFixed(1)}` : data.length ? `${data.length}/109h` : "—",
						tone: snap?.macd50 ? snap.macd50.hist >= 0 ? "rsi-above" : "rsi-below" : void 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TapeStat, {
						k: "MACD 200",
						v: snap?.macd200 ? `${snap.macd200.hist >= 0 ? "+" : ""}${Math.abs(snap.macd200.hist) >= 10 ? snap.macd200.hist.toFixed(0) : snap.macd200.hist.toFixed(1)}` : data.length ? `${data.length}/209h` : "—",
						tone: snap?.macd200 ? snap.macd200.hist >= 0 ? "rsi-above" : "rsi-below" : void 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TapeStat, {
						k: "Vol vs 20h",
						v: snap?.volRatio != null ? `${snap.volRatio.toFixed(2)}×` : "—",
						tone: snap?.volRatio != null && snap.volRatio >= 1 ? "rsi-above" : snap?.volRatio != null ? "rsi-below" : void 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TapeStat, {
						k: "Funding",
						v: snap?.positioning.fundingRate != null ? `${(snap.positioning.fundingRate * 100).toFixed(4)}%` : "—"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 font-mono text-xs text-muted",
				children: [
					"RSI(14)",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: rsiTone(snap?.rsi14, snap?.rsiAvg),
						style: { color: rsiHex(snap?.rsi14, snap?.rsiAvg) },
						children: snap?.rsi14 != null ? snap.rsi14.toFixed(1) : "—"
					}),
					snap?.rsiAvg != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted",
						children: [" vs avg ", snap.rsiAvg.toFixed(1)]
					}) : null,
					" · ",
					"Vol 24h",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: BTC_TONE,
						children: [snap?.btc.volume24h != null ? snap.btc.volume24h.toFixed(0) : "—", " BTC"]
					}),
					snap?.btc.volumeAvg24h != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted",
						children: [
							" ",
							"vs Coinbase avg ",
							snap.btc.volumeAvg24h.toFixed(0),
							" BTC"
						]
					}) : null,
					" ",
					"· ",
					snap?.btc.source
				]
			})
		]
	});
}
function OscPane({ label, tone, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-10 min-h-10 items-stretch gap-2 sm:h-14",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "w-16 shrink-0 self-center font-mono text-[10px] tracking-[0.12em] text-muted uppercase sm:w-20",
			style: tone ? { color: tone } : void 0,
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-0 min-w-0 flex-1",
			children
		})]
	});
}
function assetMoney(v) {
	return money(v, v >= 100 ? 0 : v >= 2 ? 2 : 4);
}
/** Selected overlay asset quote: last price plus 24h change when Coinbase stats are available. */
function AssetQuoteChip({ asset, quote }) {
	if (!quote) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "font-mono text-xs text-muted",
		children: [
			asset,
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "tabular-nums",
				children: "—"
			})
		]
	});
	const pct = quote.open != null ? (quote.last - quote.open) / quote.open * 100 : null;
	const up = pct != null ? pct >= 0 : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "font-mono text-xs tabular-nums text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-muted",
				children: [asset, " "]
			}),
			assetMoney(quote.last),
			pct != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: up ? "text-high" : "text-sell",
				children: [
					" ",
					up ? "▲" : "▼",
					" ",
					up ? "+" : "",
					pct.toFixed(2),
					"%"
				]
			}) : null
		]
	});
}
/** Ratio display: 34.4k / 512 / 15.2 / 2.05 / 0.0291 depending on magnitude. */
function fmtRatio(v) {
	if (!Number.isFinite(v)) return "—";
	if (v >= 1e5) return `${Math.round(v / 1e3)}k`;
	if (v >= 1e3) return `${(v / 1e3).toFixed(1)}k`;
	if (v >= 100) return v.toFixed(0);
	if (v >= 10) return v.toFixed(1);
	if (v >= 1) return v.toFixed(2);
	return v.toFixed(4);
}
/** Selected-pair BTC ratio chip — only the dropdown pick shows, never all pairs at once.
GOLD = BTC required for 1 oz gold (Coinbase PAXG-USD, 1 PAXG = 1 oz). Others = units per 1 BTC. */
function PairRatioChip({ asset, btc, px }) {
	if (asset === "USDC" || !px || px <= 0 || !Number.isFinite(btc) || btc <= 0) return null;
	const label = RATIO_LABEL[asset];
	if (asset === "GOLD") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "rounded-sm border border-rule px-2 py-0.5 font-mono text-xs tabular-nums text-muted",
		title: "Gold to BTC ratio — BTC required to purchase 1 oz of gold (Coinbase PAXG-USD, 1 PAXG = 1 oz gold)",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "gold-css",
				children: label
			}),
			" ",
			(px / btc).toFixed(4),
			" · 1 BTC = ",
			(btc / px).toFixed(1),
			" oz"
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "rounded-sm border border-rule px-2 py-0.5 font-mono text-xs tabular-nums text-muted",
		title: `${asset} to BTC ratio — how many ${asset} one bitcoin purchases (Coinbase ${ASSET_PRODUCT[asset]})`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-fg",
				children: label
			}),
			" 1 BTC = ",
			fmtRatio(btc / px),
			" ",
			asset
		]
	});
}
function TapeStat({ k, v, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-mono text-[10px] tracking-[0.12em] text-muted uppercase",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cn("mt-0.5 truncate font-mono text-sm tabular-nums", tone ?? "text-fg"),
			children: v
		})]
	});
}
function Toggle({ on, onClick, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		size: "sm",
		variant: "outline",
		"aria-pressed": on,
		onClick,
		className: cn("indicator-title h-10 min-h-10 px-3 text-xs", on && "border-tab"),
		children: label
	});
}
function LiqHeatmap({ snap }) {
	const rows = [...snap?.liqMap ?? []].reverse();
	const last = snap?.btc.price;
	const max = Math.max(1, ...rows.flatMap((r) => [r.longUsd, r.shortUsd]));
	const pos = snap?.positioning;
	const ls = pos?.longShort;
	const longPct = ls != null ? ls / (1 + ls) * 100 : null;
	const shortPct = longPct != null ? 100 - longPct : null;
	const spark = pos?.lsHistory ?? [];
	const venues = pos?.venues ?? [];
	const sellW = pos?.sellWallUsd;
	const buyW = pos?.buyWallUsd;
	const nearest = last ? rows.reduce((best, r) => Math.abs(r.price - last) < Math.abs(best.price - last) ? r : best, rows[0] ?? {
		price: last,
		longUsd: 0,
		shortUsd: 0
	}) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		kicker: "Public leverage · no CoinGlass",
		title: "Long / short heatmap",
		kickerClass: "indicator-title",
		titleClass: "indicator-title",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-2 overflow-hidden rounded-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-up",
							style: { width: `${longPct ?? 50}%` }
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-down",
							style: { width: `${shortPct ?? 50}%` }
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 font-mono text-xs text-muted",
						children: [
							"Longs ",
							longPct != null ? `${longPct.toFixed(0)}%` : "—",
							" · shorts",
							" ",
							shortPct != null ? `${shortPct.toFixed(0)}%` : "—",
							" · LS ",
							ls?.toFixed(2) ?? "—",
							" · OI",
							" ",
							pos?.openInterestUsd != null ? money(pos.openInterestUsd, 0) : "—"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 font-mono text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-down",
								children: ["Sell wall ", sellW != null ? money(sellW, 0) : "—"]
							}),
							" · ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-up",
								children: ["Buy wall ", buyW != null ? money(buyW, 0) : "—"]
							}),
							" · ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: pos?.wallBias === "SELL" ? "text-down" : pos?.wallBias === "BUY" ? "text-up" : "text-muted",
								children: pos?.wallBias ?? "FLAT"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-52 gap-2 sm:h-60",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex min-w-0 flex-1 flex-col justify-between",
					children: rows.map((r) => {
						const isLast = nearest != null && r.price === nearest.price;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-1 items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("w-12 shrink-0 font-mono text-xs tabular-nums", isLast ? "text-fg" : "text-muted"),
								children: r.price.toFixed(0)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex h-2 min-w-0 flex-1 items-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-2 rounded-sm bg-down",
										style: { width: r.longUsd > 0 ? `${Math.max(4, r.longUsd / max * 48)}%` : "0%" }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("mx-0.5 h-2 w-px shrink-0", isLast ? "bg-fg" : "bg-rule") }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-2 rounded-sm bg-up",
										style: { width: r.shortUsd > 0 ? `${Math.max(4, r.shortUsd / max * 48)}%` : "0%" }
									})
								]
							})]
						}, r.price);
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 h-12",
				children: spark.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
						data: spark,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							domain: ["auto", "auto"],
							hide: true
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
							type: "monotone",
							dataKey: "ratio",
							stroke: "var(--color-medium)",
							strokeWidth: 1.25,
							dot: false
						})]
					})
				}) : null
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-muted",
				children: "Brick = long liquidations (below). Sage = short liquidations (above). Magnets from OI at 10–100× plus OKX fills. Midline is last. Spark is 48h OKX long/short."
			}),
			venues.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[28rem] text-left text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-rule text-muted uppercase tracking-[0.08em]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-1 pr-2",
								children: "Venue"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-1 pr-2 text-right",
								children: "L/S"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-1 pr-2 text-right",
								children: "Fund"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-1 pr-2 text-right",
								children: "OI"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-1 pr-2 text-right",
								children: "Buy wall"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-1 text-right",
								children: "Sell wall"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: venues.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-rule/60",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-1 pr-2 text-fg",
								children: v.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: cn("py-1 pr-2 text-right font-mono", v.longShort != null && v.longShort > 1.6 ? "text-down" : "tabular-nums"),
								children: v.longShort != null ? v.longShort.toFixed(2) : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: cn("py-1 pr-2 text-right font-mono", v.fundingRate != null && v.fundingRate > 5e-4 ? "text-down" : v.fundingRate != null && v.fundingRate < 0 ? "text-up" : "tabular-nums"),
								children: v.fundingRate != null ? `${(v.fundingRate * 100).toFixed(4)}%` : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-1 pr-2 text-right font-mono tabular-nums",
								children: v.openInterestUsd != null ? money(v.openInterestUsd, 0) : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-1 pr-2 text-right font-mono text-up",
								children: v.buyWallUsd != null ? money(v.buyWallUsd, 0) : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-1 text-right font-mono text-down",
								children: v.sellWallUsd != null ? money(v.sellWallUsd, 0) : "—"
							})
						]
					}, v.id)) })]
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-[11px] text-muted",
				children: pos?.source
			})
		]
	});
}
function isPurchase(stance) {
	if (!stance) return false;
	const u = stance.toUpperCase();
	return u === "BUY" || u.includes("ACCUMULATE");
}
function convClass(c) {
	if (c === "MEDIUM") return "call-medium";
	if (c === "HIGH") return "text-high";
	return "text-sell";
}
function vsAvg(n, avg) {
	if (n == null || avg == null) return void 0;
	if (n > avg) return "rsi-above";
	if (n < avg) return "rsi-below";
	return "rsi-flat";
}
function DeskWorkspace({ snap, briefs, call, canAct, canFill, asking, copied, grok, grokErr, onAsk, onCopy, onFill }) {
	const [overseer, setOverseer] = (0, import_react.useState)(false);
	const gm = (0, import_react.useMemo)(() => snap ? gmCall(snap, AUTO_RUN_CASH, {
		pilot: "AUTO",
		risk: 2,
		manual: DEFAULT_GM_VARS,
		adminLive: false,
		dayHours: 1
	}) : null, [snap]);
	const px = snap?.btc.price ?? null;
	const chg = snap?.btc.changePct ?? null;
	const high = snap?.btc.high24h ?? null;
	const low = snap?.btc.low24h ?? null;
	const mid24 = high != null && low != null ? (high + low) / 2 : null;
	const vol = snap?.btc.volume24h ?? null;
	const volAvg = snap?.btc.volumeAvg24h ?? null;
	const up = chg != null && chg >= 0;
	const pxTone = vsAvg(px, mid24) ?? (up ? "rsi-above" : chg != null ? "rsi-below" : void 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock3dRail, { feedAudit: snap?.feedAudit }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid isolate rounded-md border border-rule carbon-fiber lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,0.7fr)] lg:items-stretch",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "relative z-0 flex min-h-0 min-w-0 flex-col overflow-hidden border-b border-rule bg-surface p-3 lg:border-b-0 lg:border-r",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "coinbase-orange text-[10px] font-semibold tracking-[0.1em] uppercase",
								children: "Bitcoin Current Market"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: cn("text-[clamp(1.75rem,4vw,2.6rem)] leading-tight font-medium tracking-tight tabular-nums", pxTone),
								children: px != null ? money(px, 2) : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: cn("text-sm tabular-nums", pxTone),
								children: chg != null ? `${chg >= 0 ? "+" : ""}${chg.toFixed(2)}%` : "waiting on tape"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkspaceTape, { snap }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "mt-3 grid grid-cols-3 gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "coinbase-orange text-[10px] tracking-[0.08em] uppercase",
										children: "RSI-14"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: cn("text-sm font-medium tabular-nums", vsAvg(snap?.rsi14, snap?.rsiAvg)),
										children: snap?.rsi14 != null ? snap.rsi14.toFixed(1) : "—"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "coinbase-orange text-[10px] tracking-[0.08em] uppercase",
										children: "MACD"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: cn("text-sm font-medium tabular-nums", snap?.macd ? snap.macd.hist >= 0 ? "rsi-above" : "rsi-below" : void 0),
										children: snap?.macd ? `${snap.macd.hist >= 0 ? "+" : ""}${Math.abs(snap.macd.hist) >= 10 ? snap.macd.hist.toFixed(0) : snap.macd.hist.toFixed(1)}` : "—"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "coinbase-orange text-[10px] tracking-[0.08em] uppercase",
										children: "F&G"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
										className: cn("text-sm font-medium tabular-nums", vsAvg(snap?.fearGreed?.value, 50)),
										children: [
											snap?.fearGreed?.value ?? "—",
											" ",
											snap?.fearGreed?.label ?? ""
										]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "coinbase-orange text-[10px] tracking-[0.08em] uppercase",
										children: "EMA-21"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: cn("text-sm font-medium tabular-nums", px != null && snap?.ema21 != null ? vsAvg(px, snap.ema21) : void 0),
										children: snap?.ema21 != null ? money(snap.ema21, 0) : "—"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "coinbase-orange text-[10px] tracking-[0.08em] uppercase",
										children: "24h high"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: cn("text-sm font-medium tabular-nums", vsAvg(px, mid24)),
										children: high != null ? money(high, 0) : "—"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "coinbase-orange text-[10px] tracking-[0.08em] uppercase",
										children: "24h vol"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: cn("text-sm font-medium tabular-nums", vsAvg(vol, volAvg)),
										children: vol != null ? `${(vol / 1e9).toFixed(2)}B` : "—"
									})] })
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "relative z-[1] flex min-h-0 min-w-0 flex-col overflow-hidden border-b border-rule bg-surface p-3 lg:border-b-0 lg:border-r",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "coinbase-orange text-[10px] font-semibold tracking-[0.1em] uppercase",
								children: "Order ticket · 7-B0T"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "mt-2 text-lg font-semibold tracking-tight",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: convClass(call?.conviction),
										children: call?.conviction ?? "—"
									}),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: stanceClass(call?.stance ?? "HOLD"),
										children: call?.stance ?? "—"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-muted",
								children: [
									"Clip ",
									call ? money(call.clipUsd, 0) : "—",
									" · preview only"
								]
							}),
							call ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-muted",
								children: call.brief
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-mono text-[11px] break-all text-muted",
								children: call?.cli ?? "coinbase products ticker BTC-USD"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-col gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "primary",
										onClick: onFill,
										disabled: !canAct || !canFill,
										children: call?.stance === "TRIM" ? "Paper take-profit" : "Preview buy"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										disabled: true,
										children: "Create — locked"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										onClick: onCopy,
										disabled: !call,
										children: copied ? "Copied" : "Copy CLI"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										onClick: onAsk,
										disabled: asking,
										children: asking ? "Asking…" : canAct ? "Ask Grok" : "Ask Grok · BYO"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 rounded-sm border border-brand/30 bg-brand/8 p-2.5 text-xs leading-relaxed text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "coinbase-orange mb-1 text-[10px] font-semibold tracking-[0.08em] uppercase",
									children: "Bot capability"
								}), "Other agents already read 7-B0T (poll 300s). They cannot trade on this host. When the operator unlocks auto trade, each bot runs Coinbase for Agents on an account it controls. Keys never sit here."]
							}),
							grokErr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-down",
								children: grokErr
							}) : null,
							grok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 whitespace-pre-wrap border-t border-rule pt-2 text-sm leading-relaxed",
								children: grok
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						id: "bot7",
						className: "relative flex min-h-0 min-w-0 flex-col overflow-hidden carbon-fiber p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative z-10 rounded-sm bg-bg/50 px-1 backdrop-blur-[1px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "bots-1-6 text-[10px] font-semibold tracking-[0.1em] uppercase",
									children: "Bots 1–6"
								}),
								briefs.map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-baseline gap-x-2 gap-y-0.5 border-b border-rule py-2 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "bots-1-6 w-4 shrink-0",
											children: i + 1
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "bot-lane-name min-w-0 flex-1 leading-snug",
											children: b.name.replace(/ Analyst$/i, "")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("shrink-0", stanceClass(b.stance)),
											children: b.stance
										})
									]
								}, b.id)),
								call ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-baseline gap-x-2 gap-y-0.5 border-b border-rule py-2 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "coinbase-orange w-4 shrink-0",
											children: "7"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "min-w-0 flex-1 font-semibold leading-snug",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "coinbase-orange",
													children: "7-B0T"
												}),
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GmRainbow, { text: "AUTO" })
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("shrink-0", stanceClass(call.stance)),
											children: call.stance
										})
									]
								}) : null,
								gm ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-baseline gap-x-2 gap-y-0.5 py-2 text-xs",
									title: `${TAB_GM_AUTO} (${SEO_TAB_GM_AUTO})`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-4 shrink-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GmRainbow, { text: "G" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "min-w-0 flex-1 leading-snug",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GmRainbow, { text: TAB_GM_AUTO_TAIL })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("shrink-0", callStanceClass(gm.stance)),
											children: gm.stance
										})
									]
								}) : null
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoloGifExpand, {})]
					})
				]
			}),
			(() => {
				const buys = [
					...briefs.filter((b) => isPurchase(b.stance)).map((b) => ({
						id: b.id,
						name: b.name,
						stance: b.stance,
						detail: b.summary,
						tone: "bot"
					})),
					...call && isPurchase(call.stance) ? [{
						id: "bot7",
						name: "7-B0T AUTO",
						stance: `${call.conviction} ${call.stance}`,
						detail: `Would clip ${money(call.clipUsd, 0)} USDC · ${call.brief}`,
						tone: "bot7"
					}] : [],
					...gm && isPurchase(gm.stance) ? [{
						id: "gm",
						name: TAB_GM_AUTO,
						stance: `${gm.conviction} ${gm.stance}`,
						detail: `Would clip ${money(gm.clipUsd, 0)} · ${gm.reason}`,
						tone: "gm"
					}] : []
				];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 rounded-md border border-rule bg-surface p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "bots-1-6 text-[10px] font-semibold tracking-[0.1em] uppercase",
						children: "Purchase calls · this cycle · would-accumulate (Coinbase create off)"
					}), buys.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 space-y-2",
						children: buys.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex flex-wrap items-baseline gap-x-2 gap-y-0.5 border-b border-rule pb-2 text-xs last:border-0 last:pb-0",
							children: [
								row.tone === "gm" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GmRainbow, {
									text: row.name,
									className: "font-semibold"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("font-semibold", row.tone === "bot7" ? "coinbase-orange" : "bot-lane-name"),
									children: row.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: stanceClass(row.stance.split(" ").pop() ?? row.stance),
									children: row.stance
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-full text-muted",
									children: row.detail
								})
							]
						}, row.id))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-muted",
						children: [
							"No BUY / ACCUMULATE this cycle. Bots 1–6, 7-B0T AUTO, and ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GmRainbow, { text: TAB_GM_AUTO }),
							" are scanning the live tape. Coinbase create stays locked."
						]
					})]
				});
			})(),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 overflow-x-auto rounded-md border border-rule bg-surface",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-rule text-[10px] tracking-[0.08em] uppercase",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "coinbase-orange px-3 py-2 font-semibold",
								children: "Bot"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "coinbase-orange px-3 py-2 font-semibold",
								children: "Stance"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "coinbase-orange px-3 py-2 font-semibold",
								children: "Summary"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [
						briefs.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-rule last:border-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "bot-lane-name px-3 py-2",
									children: b.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: cn("px-3 py-2", stanceClass(b.stance)),
									children: b.stance
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 text-muted",
									children: b.summary
								})
							]
						}, b.id)),
						call ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "coinbase-orange px-3 py-2 font-semibold",
								children: "7-B0T"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-3 py-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: convClass(call.conviction),
										children: call.conviction
									}),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: stanceClass(call.stance),
										children: call.stance
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-3 py-2 text-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: call.brief }),
									isPurchase(call.stance) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 font-mono text-[11px] text-tab",
										children: [
											"would-run · clip ",
											money(call.clipUsd, 0),
											" · Coinbase create off"
										]
									}) : null,
									canAct ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "expand-ctl text-[11px] font-medium hover:underline",
											"aria-expanded": overseer,
											onClick: () => setOverseer((o) => !o),
											children: "Overseer"
										}), overseer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 max-w-prose text-[11px] leading-relaxed text-muted",
											children: call.thesis
										}) : null]
									}) : null
								]
							})
						] }) : null,
						gm ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GmRainbow, { text: GM_NAME })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-3 py-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: convClass(gm.conviction),
										children: gm.conviction
									}),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: callStanceClass(gm.stance),
										children: gm.stance
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-3 py-2 text-muted",
								children: [
									"AUTO · clip ",
									money(gm.clipUsd, 0),
									" · ",
									gm.reason,
									" ",
									AUTO_RUN_LABEL,
									isPurchase(gm.stance) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 font-mono text-[11px] text-tab",
										children: "would-run · Coinbase create off"
									}) : null
								]
							})
						] }) : null
					] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 font-mono text-[11px] text-oss",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/agent",
						className: "hover:underline",
						children: "Agent feed"
					}),
					" · ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/compute",
						className: "hover:underline",
						children: "BYO compute"
					}),
					" · dry-run only until unlock"
				]
			})
		]
	});
}
function HoloGifExpand() {
	const [open, setOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const onKey = (e) => {
			if (e.key === "Escape") setOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "gm-holo mt-2 flex-1",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setOpen(true),
			"aria-expanded": open,
			"aria-controls": "holo-gif-expand",
			title: `${GIF_AI_BTC_BOT_EQ} · expand`,
			"aria-label": `${GIF_AI_BTC_BOT_EQ} · expand`,
			className: "relative block h-full min-h-11 w-full",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoImage, {
				src: GIF_AI_BTC_BOT,
				alt: GIF_AI_BTC_BOT_NAME,
				title: GIF_AI_BTC_BOT_EQ,
				desc: GIF_AI_BTC_BOT_EQ,
				width: 640,
				height: 960,
				className: "h-full w-full object-cover object-center"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "expand-ctl pointer-events-none absolute right-2 top-2 z-10 font-mono text-[11px] drop-shadow",
				children: "expand"
			})]
		})
	}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		id: "holo-gif-expand",
		className: "gif-expand-overlay",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": GIF_AI_BTC_BOT_NAME,
		onClick: () => setOpen(false),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "gif-expand-panel",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/gm",
					hash: "auto",
					className: "min-h-11 text-sm font-semibold text-oss hover:underline",
					title: `${GIF_AI_BTC_BOT_EQ} · open G M0D3 AUTO`,
					"aria-label": `${GIF_AI_BTC_BOT_EQ} · open G M0D3 AUTO`,
					children: GIF_AI_BTC_BOT_EQ
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "expand-ctl min-h-11 font-mono text-[11px]",
					onClick: () => setOpen(false),
					children: "collapse"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoImage, {
				src: GIF_AI_BTC_BOT,
				alt: GIF_AI_BTC_BOT_NAME,
				title: GIF_AI_BTC_BOT_EQ,
				desc: GIF_AI_BTC_BOT_EQ,
				width: 640,
				height: 960,
				className: "gif-expand-img mt-2"
			})]
		})
	}) : null] });
}
//#endregion
export { LiqHeatmap as n, TapeChart as r, DeskWorkspace as t };
