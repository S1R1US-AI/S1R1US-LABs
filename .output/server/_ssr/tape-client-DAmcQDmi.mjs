import { o as __toESM } from "../_runtime.mjs";
import { U as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { t as DESK_POLL_MS } from "./poll-ByA4PSVX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tape-client-DAmcQDmi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var fetchDesk = createServerFn({ method: "GET" }).validator((input) => input ?? {}).handler(createSsrRpc("5cf62f4e779d5d6880a0cc11d158c6be2e5eeb2026216ec06a53d5d2048406cd"));
var fetchTapeMeta = createServerFn({ method: "GET" }).handler(createSsrRpc("4ad2fda086277f62e7ecbc8458401244541db57fe627e90504025516478eab67"));
var setTapeFreeze = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("645ce5dcd2143f301180bb73a3bbb42b5706b9673c921fa057498f2781d8f8b4"));
createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("6cec224d2d3bacdaff9821d9e34983f58a4bb3ab931693a937be1ca19d5e3a92"));
var fetchDeskErrors = createServerFn({ method: "GET" }).handler(createSsrRpc("a09f23fe5bdae92d6c7606faa5e475556882d6ad931424c9a3c8a4bce42359e6"));
var fetchIntrusions = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("7d95ce8b736ec263ed12bbaf93d618091433ac4e9c24ddd5d170c160adbb013c"));
var runHunterAudit = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("821cc51f8e53d995bccf344d723b48c673b7c3561883022e778666c2642bf20a"));
var fetchSecurityPosture = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("e8c64d6bb68ba4681691bea632985bc7af5dce8570257d70688d43934a6347ed"));
var fetchSecurityBrief = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("7d0c11795f8624b74086b669339d9431d40f36fe77ad35a1e50d0b60b7e1bd4f"));
var fetchAgentFlags = createServerFn({ method: "GET" }).handler(createSsrRpc("428fb23ec9fdf3ede46607e1241acc80a5022a44f56391a98b427fcb0e9286ec"));
var fetchAgentGate = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("f372babf0f6ae485bb7482c85c670110ca8e92222ea4bf7de3f257bfa9b3c45d"));
var setAgentGate = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("cc566ed26039b1983e76b5e9e83cce49a5174091823080d91b7d1a5cb3658e1f"));
var unbarAgent = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("9e2d670ea9885717b4bf6e44d44cffedc7a7dde00507e196e67749e1b40d8cca"));
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
export { fetchMorningLib as a, fetchTapeMeta as c, runHunterAudit as d, setAgentGate as f, useDeskTape as g, unbarAgent as h, fetchIntrusions as i, peekDeskTape as l, setTapeFreeze as m, fetchAgentGate as n, fetchSecurityBrief as o, setMorningReportPaused as p, fetchDeskErrors as r, fetchSecurityPosture as s, fetchAgentFlags as t, pullDeskTape as u };
