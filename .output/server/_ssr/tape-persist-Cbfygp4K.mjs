import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
//#region node_modules/.nitro/vite/services/ssr/assets/tape-persist-Cbfygp4K.js
var LAST_PATH = "/tmp/desk-last-good.json";
var FREEZE_PATH = "/tmp/desk-tape-freeze";
var mem = null;
var frozen = null;
function isTapeFrozen() {
	if (typeof window !== "undefined") return false;
	try {
		frozen = existsSync(FREEZE_PATH);
	} catch {
		frozen = false;
	}
	return frozen;
}
function setTapeFrozen(on) {
	if (typeof window !== "undefined") return on;
	frozen = on;
	try {
		if (on) writeFileSync(FREEZE_PATH, "1");
		else if (existsSync(FREEZE_PATH)) unlinkSync(FREEZE_PATH);
	} catch {}
	return on;
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
	return {
		frozen: isTapeFrozen(),
		at: g?.at ?? null,
		ageMs: g ? Date.now() - g.at : null,
		price: g?.snap.btc.price ?? null
	};
}
//#endregion
export { isTapeFrozen, lastGoodMeta, readLastGood, setTapeFrozen, writeLastGood };
