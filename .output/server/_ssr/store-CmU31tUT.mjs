import { o as __toESM } from "../_runtime.mjs";
import { H as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as DESK_POLL_MS } from "./poll-ByA4PSVX.mjs";
import { g as createSsrRpc } from "./operator-Be3_TEkH.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-CmU31tUT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var fetchDesk = createServerFn({ method: "GET" }).validator((input) => input ?? {}).handler(createSsrRpc("5cf62f4e779d5d6880a0cc11d158c6be2e5eeb2026216ec06a53d5d2048406cd"));
var fetchTapeMeta = createServerFn({ method: "GET" }).handler(createSsrRpc("4ad2fda086277f62e7ecbc8458401244541db57fe627e90504025516478eab67"));
var setTapeFreeze = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("645ce5dcd2143f301180bb73a3bbb42b5706b9673c921fa057498f2781d8f8b4"));
createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("6cec224d2d3bacdaff9821d9e34983f58a4bb3ab931693a937be1ca19d5e3a92"));
var fetchDeskErrors = createServerFn({ method: "GET" }).handler(createSsrRpc("a09f23fe5bdae92d6c7606faa5e475556882d6ad931424c9a3c8a4bce42359e6"));
var fetchMorningLib = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("f57bee00551cea168a828cfda0a1bbfa0a2802559e29d2c609fe1d31497cd3cf"));
var setMorningReportPaused = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("56a5cd771ece1bf754af79b4554bf63f9f41484e364fb0b15cf2e36f5ee5bc68"));
createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("e91da4e66df44aa9ebdf315575068b5fff2eede3ec0cfb2fcef1671147a4c0c7"));
createServerFn({ method: "GET" }).handler(createSsrRpc("f50e05dc58b5b0575866cc2c7311bb5c3e0e947c4d045a2d25e02521fee667aa"));
createServerFn({ method: "GET" }).handler(createSsrRpc("5d795ffcbdcf278e95568b2620b25787d8cc249f9c1bd5d88d8fc94e060d890b"));
var STORE = "s1r1us-desk-snap-v3";
var LAST_PULL_KEY = "s1r1us-last-pull-at";
var listeners = /* @__PURE__ */ new Set();
var liveListeners = /* @__PURE__ */ new Set();
var memory = null;
var pending = null;
var pendingAt = 0;
var pollOn = false;
var pollPaused = false;
var reloadForceUsed = false;
var fillCatch = 0;
var fillCatchTimer = 0;
/** Core paints first. These lanes arrive on fill — don't treat a thin snap as done. */
function tapeNeedsFill(s) {
	if (!s) return true;
	const bars = (s.capital?.bars ?? []).filter((b) => b.usd != null).length;
	const curve = (s.macro?.tbill?.points?.length ?? 0) + (s.macro?.y10?.points?.length ?? 0);
	const cpi = s.macro?.cpiYoy?.points?.length ?? 0;
	const m2n = s.macro?.m2?.points?.length ?? 0;
	const stables = s.macro?.stables?.length ?? 0;
	const holders = s.holders?.holders?.length ?? 0;
	const news = (s.headlines?.length ?? 0) + (s.filings?.length ?? 0);
	const dats = s.capital?.dats?.length ?? 0;
	return bars < 3 || curve < 8 || cpi < 6 || m2n < 6 || stables < 1 || holders < 5 || news < 3 || dats < 3;
}
function richness(s) {
	return [
		(s.capital.bars ?? []).filter((b) => b.usd != null).length,
		s.capital.dats.length,
		s.holders.holders.length,
		s.headlines.length,
		s.filings.length,
		s.macro.tbill.last ?? "",
		s.macro.m2.last ?? "",
		s.macro.cpiYoy.points.length,
		s.macro.stables.length,
		s.quotes.length,
		s.candles.length
	].join("|");
}
function lastPullAt() {
	if (typeof localStorage === "undefined") return 0;
	try {
		return Number(localStorage.getItem(LAST_PULL_KEY) || 0);
	} catch {
		return 0;
	}
}
function markPull() {
	if (typeof localStorage === "undefined") return;
	try {
		localStorage.setItem(LAST_PULL_KEY, String(Date.now()));
	} catch {}
}
function forcePullAllowed() {
	const last = lastPullAt();
	return !Number.isFinite(last) || last <= 0 || Date.now() - last >= 3e5;
}
function isBrowserReload() {
	if (typeof performance === "undefined") return false;
	try {
		return performance.getEntriesByType("navigation")[0]?.type === "reload";
	} catch {
		return false;
	}
}
/** One forced rebuild per reload, and only if the mandate cycle has elapsed since the last pull. */
function takeReloadForce() {
	if (reloadForceUsed) return false;
	reloadForceUsed = true;
	return isBrowserReload() && forcePullAllowed();
}
function readStored() {
	if (typeof sessionStorage === "undefined") return null;
	try {
		const raw = sessionStorage.getItem(STORE);
		if (!raw) return null;
		return JSON.parse(raw);
	} catch {
		return null;
	}
}
function writeStored(s) {
	if (typeof sessionStorage === "undefined") return;
	try {
		const hours = [...s.candles].sort((a, b) => a.t - b.t).slice(-300);
		const slim = {
			...s,
			errors: [],
			candles: hours
		};
		sessionStorage.setItem(STORE, JSON.stringify(slim));
	} catch {}
}
function tapeKey(s) {
	const last = s.candles[s.candles.length - 1];
	return [
		s.btc.price,
		s.rsi14,
		s.fearGreed?.value ?? "",
		s.candles.length,
		last?.t ?? "",
		last?.close ?? "",
		s.positioning.longShort ?? "",
		s.positioning.fundingRate ?? "",
		s.capital.etfFlow ?? "",
		s.asia.kimchiPct ?? ""
	].join("|");
}
function emit(s) {
	if (s && memory && tapeKey(s) === tapeKey(memory) && richness(s) === richness(memory)) {
		memory = s;
		writeStored(s);
		return;
	}
	memory = s;
	if (s) writeStored(s);
	for (const fn of listeners) fn(s);
}
function scheduleFillCatch() {
	if (typeof window === "undefined") return;
	if (fillCatch >= 2 || fillCatchTimer) return;
	fillCatch += 1;
	fillCatchTimer = window.setTimeout(() => {
		fillCatchTimer = 0;
		if (tapeNeedsFill(peekDeskTape())) pullDeskTape();
	}, 2800);
}
function peekDeskTape() {
	if (memory) return memory;
	memory = readStored();
	return memory;
}
async function pullDeskTape(opts) {
	if (pending && Date.now() - pendingAt < 4e3) return pending;
	const had = peekDeskTape();
	let force = Boolean(opts?.force) || takeReloadForce();
	if (force && !forcePullAllowed()) force = false;
	if (!force && had?.fetchedAt && !tapeNeedsFill(had)) {
		const age = Date.now() - Date.parse(had.fetchedAt);
		if (Number.isFinite(age) && age >= 0 && age < 3e5) return had;
	}
	const fetchP = fetchDesk({ data: { force } }).then((s) => {
		markPull();
		emit(s);
		if (tapeNeedsFill(s)) scheduleFillCatch();
		else fillCatch = 0;
		return s;
	});
	const run = Promise.race([fetchP, new Promise((resolve, reject) => {
		setTimeout(() => {
			const last = peekDeskTape() ?? had;
			if (last) resolve(last);
			else reject(/* @__PURE__ */ new Error("tape timeout"));
		}, force ? 3200 : 2800);
	})]);
	pendingAt = Date.now();
	pending = run.finally(() => {
		pending = null;
		pendingAt = 0;
	});
	return pending;
}
function ensurePoll() {
	if (pollOn || typeof window === "undefined") return;
	pollOn = true;
	if (!peekDeskTape()) pullDeskTape();
	window.setInterval(() => {
		if (pollPaused) return;
		if (typeof document !== "undefined" && document.hidden) return;
		pullDeskTape();
	}, DESK_POLL_MS);
}
function setDeskPollLive(on) {
	pollPaused = !on;
	for (const fn of liveListeners) fn(on);
}
function useDeskTape() {
	const [snap, setSnap] = (0, import_react.useState)(null);
	const [err, setErr] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [live, setLiveState] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		listeners.add(setSnap);
		liveListeners.add(setLiveState);
		const had = peekDeskTape();
		if (had) {
			setSnap(had);
			setLoading(false);
		}
		const stop = window.setTimeout(() => setLoading(false), 5e3);
		ensurePoll();
		if (!had || tapeNeedsFill(had) || had.candles.length < 220) pullDeskTape().then((s) => {
			setSnap(s);
			setErr(null);
		}).catch((e) => setErr(e instanceof Error ? e.message : "Desk fetch failed")).finally(() => {
			window.clearTimeout(stop);
			setLoading(false);
		});
		else {
			window.clearTimeout(stop);
			setLoading(false);
		}
		return () => {
			listeners.delete(setSnap);
			liveListeners.delete(setLiveState);
		};
	}, []);
	function setLive(on) {
		setDeskPollLive(on);
		setLiveState(on);
	}
	async function refresh() {
		setErr(null);
		try {
			await pullDeskTape({ force: forcePullAllowed() });
		} catch (e) {
			setErr(e instanceof Error ? e.message : "Desk fetch failed");
		} finally {
			setLoading(false);
		}
	}
	return {
		snap,
		err,
		loading,
		refresh,
		live,
		setLive
	};
}
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
export { useDeskTape as _, clampCash as a, fetchMorningLib as c, lotsThroughStop as d, openLots as f, setTapeFreeze as g, setMorningReportPaused as h, STOP_MAX as i, fetchTapeMeta as l, pullDeskTape as m, STARTING_CASH as n, clampStop as o, peekDeskTape as p, STOP_DEFAULT as r, fetchDeskErrors as s, CASH_MAX as t, initialStop as u, usePaper as v };
