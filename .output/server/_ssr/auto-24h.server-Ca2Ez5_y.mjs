import { a as AUTO_RUN_UNTIL_MS, i as AUTO_RUN_START_MS, n as AUTO_RUN_ID, t as AUTO_RUN_CASH } from "./auto-window-tj2zObbC.mjs";
import { readFileSync } from "node:fs";
//#region node_modules/.nitro/vite/services/ssr/assets/auto-24h.server-Ca2Ez5_y.js
var PATH = `/workspace/data/auto-24h.json`;
var mem = null;
function emptyBook() {
	return {
		cashUsd: AUTO_RUN_CASH,
		btc: 0,
		fills: 0,
		ticks: 0,
		last: "disabled"
	};
}
function fresh() {
	return {
		id: AUTO_RUN_ID,
		startedAt: new Date(AUTO_RUN_START_MS).toISOString(),
		until: new Date(AUTO_RUN_UNTIL_MS).toISOString(),
		paused: true,
		pausedAt: (/* @__PURE__ */ new Date()).toISOString(),
		lastAt: null,
		lastPx: null,
		bot7: emptyBook(),
		gm: emptyBook()
	};
}
function load() {
	if (mem && mem.id === "auto-24h-gm-20260904-1340et") return {
		...mem,
		paused: true
	};
	try {
		const raw = JSON.parse(readFileSync(PATH, "utf8"));
		mem = {
			...raw,
			paused: true,
			pausedAt: raw.pausedAt ?? (/* @__PURE__ */ new Date()).toISOString()
		};
		return mem;
	} catch {
		mem = fresh();
		return mem;
	}
}
function readAuto24h() {
	return load();
}
//#endregion
export { readAuto24h };
