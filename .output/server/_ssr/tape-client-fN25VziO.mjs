import { o as __toESM } from "../_runtime.mjs";
import { U as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as fetchDesk } from "./desk-rpc-CxxoomgM.mjs";
import { t as DESK_POLL_MS } from "./poll-ByA4PSVX.mjs";
//#region ../../workspace/node_modules/.nitro/vite/services/ssr/assets/tape-client-fN25VziO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
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
	const strat = (s.strategy?.products ?? []).filter((p) => (p.points?.length ?? 0) > 2 || p.change6m != null).length;
	return bars < 3 || curve < 8 || cpi < 6 || m2n < 6 || stables < 1 || holders < 5 || news < 3 || dats < 3 || strat < 1;
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
	if (pending && Date.now() - pendingAt >= 8e3) {
		pending = null;
		pendingAt = 0;
	}
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
//#endregion
export { pullDeskTape as n, useDeskTape as r, peekDeskTape as t };
