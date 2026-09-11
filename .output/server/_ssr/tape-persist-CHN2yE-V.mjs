import { r as __exportAll } from "../_runtime.mjs";
import { t as __exportAll$1 } from "./agent-ping-BXZGzZ_N.mjs";
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
//#region ../../workspace/node_modules/.nitro/vite/services/ssr/assets/tape-persist-CHN2yE-V.js
var tape_persist_CHN2yE_V_exports = /* @__PURE__ */ __exportAll({
	a: () => tape_persist_exports,
	i: () => setTapeFrozen,
	n: () => lastGoodMeta,
	o: () => writeLastGood,
	r: () => readLastGood,
	t: () => isTapeFrozen
});
/**
* Last-good snapshot + admin data-pull pause.
*
* Pause is a test switch only. It MUST NOT:
* - unlock live Coinbase create
* - sell or short bitcoin
* - change 7-B0T's accumulate mandate
* - auto-green feed errors
* - close/open the external AI gate
* - write paper fills
*
* While paused the desk serves the last validated snapshot. Resume restores
* the 5-minute pull clock. One process, one flag — Console and Security share it.
*/
var tape_persist_exports = /* @__PURE__ */ __exportAll$1({
	isTapeFrozen: () => isTapeFrozen,
	lastGoodMeta: () => lastGoodMeta,
	pullPauseState: () => pullPauseState,
	readLastGood: () => readLastGood,
	setTapeFrozen: () => setTapeFrozen,
	writeLastGood: () => writeLastGood
});
var LAST_PATH = "/tmp/desk-last-good.json";
var FREEZE_FLAG = "/tmp/desk-tape-freeze";
var STATE_PATHS = ["/tmp/desk-pull-pause.json", "/workspace/data/desk-pull-pause.json"];
var OPEN = {
	paused: false,
	pausedAt: null,
	resumedAt: null
};
var mem = null;
function readPauseDisk() {
	if (typeof window !== "undefined") return null;
	for (const p of STATE_PATHS) try {
		const raw = JSON.parse(readFileSync(p, "utf8"));
		if (typeof raw?.paused === "boolean") return {
			paused: raw.paused,
			pausedAt: raw.pausedAt ?? null,
			resumedAt: raw.resumedAt ?? null
		};
	} catch {}
	try {
		if (existsSync(FREEZE_FLAG)) return {
			paused: true,
			pausedAt: null,
			resumedAt: null
		};
	} catch {}
	return null;
}
function writePauseDisk(s) {
	if (typeof window !== "undefined") return;
	const body = JSON.stringify(s);
	for (const p of STATE_PATHS) try {
		if (p.startsWith("/workspace/data")) mkdirSync("/workspace/data", { recursive: true });
		writeFileSync(p, body);
	} catch {}
	try {
		if (s.paused) writeFileSync(FREEZE_FLAG, "1");
		else if (existsSync(FREEZE_FLAG)) unlinkSync(FREEZE_FLAG);
	} catch {}
}
function pullPauseState() {
	return readPauseDisk() ?? { ...OPEN };
}
function isTapeFrozen() {
	return pullPauseState().paused;
}
function setTapeFrozen(on) {
	if (typeof window !== "undefined") return on;
	const cur = pullPauseState();
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const next = on ? {
		paused: true,
		pausedAt: now,
		resumedAt: cur.resumedAt
	} : {
		paused: false,
		pausedAt: cur.pausedAt,
		resumedAt: now
	};
	writePauseDisk(next);
	return next.paused;
}
function readLastGood() {
	if (typeof window !== "undefined") return null;
	if (mem) return mem;
	try {
		if (!existsSync(LAST_PATH)) return null;
		const raw = JSON.parse(readFileSync(LAST_PATH, "utf8"));
		if (raw?.snap?.btc) {
			mem = raw;
			return raw;
		}
	} catch {}
	return null;
}
function writeLastGood(snap) {
	if (typeof window !== "undefined") return;
	if (snap.btc?.price == null) return;
	const prev = mem?.snap;
	const keep = prev ? {
		...snap,
		macro: (snap.macro?.m2?.points?.length ?? 0) >= 6 || (snap.macro?.cpiYoy?.points?.length ?? 0) >= 6 ? snap.macro : prev.macro,
		strategy: snap.strategy?.products?.some((p) => (p.points?.length ?? 0) > 2 || p.change6m != null) || (snap.strategy?.products?.length ?? 0) > (prev.strategy?.products?.length ?? 0) ? snap.strategy : prev.strategy?.products?.length ? prev.strategy : snap.strategy
	} : snap;
	mem = {
		at: Date.now(),
		snap: keep
	};
	try {
		writeFileSync(LAST_PATH, JSON.stringify(mem));
	} catch {}
}
function lastGoodMeta() {
	const g = readLastGood();
	const pause = pullPauseState();
	return {
		frozen: pause.paused,
		paused: pause.paused,
		pausedAt: pause.pausedAt,
		resumedAt: pause.resumedAt,
		at: g?.at ?? null,
		ageMs: g ? Date.now() - g.at : null,
		price: g?.snap.btc.price ?? null
	};
}
//#endregion
export { tape_persist_CHN2yE_V_exports as a, setTapeFrozen as i, lastGoodMeta as n, writeLastGood as o, readLastGood as r, isTapeFrozen as t };
