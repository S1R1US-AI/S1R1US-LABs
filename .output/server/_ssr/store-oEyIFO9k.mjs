import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region ../../workspace/node_modules/.nitro/vite/services/ssr/assets/store-oEyIFO9k.js
var STOP_MAX = .1;
var STOP_STEP = .0025;
var STOP_DEFAULT = .015;
function clampStop(n) {
	if (!Number.isFinite(n)) return STOP_DEFAULT;
	const snapped = Math.round(n / STOP_STEP) * STOP_STEP;
	return Math.min(STOP_MAX, Math.max(0, snapped));
}
function initialStop(entry, pct) {
	return entry * (1 - clampStop(pct));
}
/** Once the lot is +1%, stop sits at entry — no USD loss on that clip. */
function liveStop(entry, peak, pct) {
	if (peak >= entry * 1.01) return entry;
	return initialStop(entry, pct);
}
function openLots(fills, last, pct) {
	return fills.filter((f) => f.side === "BUY" && (f.openBtc ?? f.btc) > 1e-10).map((f) => {
		const entry = f.price;
		const peak = Math.max(f.peakPrice ?? entry, last || entry);
		const stop = liveStop(entry, peak, pct);
		const btc = f.openBtc ?? f.btc;
		const pnlPct = entry > 0 && last > 0 ? (last - entry) / entry : 0;
		return {
			id: f.id,
			at: f.at,
			entry,
			btc,
			peak,
			stop,
			pnlPct
		};
	});
}
function lotsThroughStop(lots, last) {
	if (!last) return [];
	return lots.filter((l) => last <= l.stop + 1e-9);
}
var START_CASH = 1e3;
var CASH_MAX = 1e5;
function clampCash(n) {
	const x = Math.round(n / 100) * 100;
	return Math.min(CASH_MAX, Math.max(100, x));
}
function consumeOpen(fills, qty) {
	let left = qty;
	return fills.map((f) => {
		if (f.side !== "BUY" || left <= 0) return f;
		const open = f.openBtc ?? f.btc;
		if (open <= 0) return f;
		const take = Math.min(open, left);
		left -= take;
		return {
			...f,
			openBtc: open - take
		};
	});
}
var usePaper = create()(persist((set, get) => ({
	cashUsd: START_CASH,
	btc: 0,
	profitBtc: 0,
	fills: [],
	hydrate: () => {
		get();
	},
	markPeaks: (last) => {
		if (!last) return;
		set((s) => ({ fills: s.fills.map((f) => f.side === "BUY" && (f.openBtc ?? f.btc) > 0 ? {
			...f,
			peakPrice: Math.max(f.peakPrice ?? f.price, last)
		} : f) }));
	},
	fill: (f) => {
		const id = `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
		set((s) => {
			if (f.side === "BUY") {
				if (s.cashUsd < f.usd) return s;
				const row = {
					...f,
					id,
					kind: f.kind ?? "clip",
					openBtc: f.btc,
					peakPrice: f.price,
					stopPrice: f.stopPrice ?? initialStop(f.price, .015)
				};
				return {
					cashUsd: s.cashUsd - f.usd,
					btc: s.btc + f.btc,
					profitBtc: s.profitBtc ?? 0,
					fills: [row, ...s.fills].slice(0, 40)
				};
			}
			if (s.btc < f.btc) return s;
			const kind = f.kind ?? "trim";
			const nextFills = consumeOpen([{
				...f,
				id,
				kind,
				openBtc: 0
			}, ...s.fills], f.btc).slice(0, 40);
			if (kind === "stop") return {
				cashUsd: s.cashUsd + f.usd,
				btc: s.btc - f.btc,
				profitBtc: s.profitBtc ?? 0,
				fills: nextFills
			};
			return {
				cashUsd: s.cashUsd,
				btc: s.btc - f.btc,
				profitBtc: (s.profitBtc ?? 0) + f.btc,
				fills: nextFills
			};
		});
	},
	reset: (cash = START_CASH) => set({
		cashUsd: clampCash(cash),
		btc: 0,
		profitBtc: 0,
		fills: []
	}),
	setCash: (cash) => set({ cashUsd: clampCash(cash) })
}), { name: "s1rius-paper-book-v1000" }));
var STARTING_CASH = START_CASH;
//#endregion
export { clampCash as a, lotsThroughStop as c, STOP_MAX as i, openLots as l, STARTING_CASH as n, clampStop as o, STOP_DEFAULT as r, initialStop as s, CASH_MAX as t, usePaper as u };
