import { r as __exportAll$1 } from "../_runtime.mjs";
import { createRequire } from "node:module";
//#region node_modules/.nitro/vite/services/ssr/assets/agent-ping-BXZGzZ_N.js
var agent_ping_BXZGzZ_N_exports = /* @__PURE__ */ __exportAll$1({
	i: () => __exportAll,
	n: () => peekAgentFlags,
	r: () => recordAgentPing,
	t: () => agent_ping_exports
});
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var __require = /* #__PURE__ */ (() => createRequire(import.meta.url))();
var agent_ping_exports = /* @__PURE__ */ __exportAll({
	AGENT_PING_PATH: () => AGENT_PING_PATH,
	dayEt: () => dayEt,
	flagsFrom: () => flagsFrom,
	peekAgentFlags: () => peekAgentFlags,
	recordAgentPing: () => recordAgentPing
});
function fsSafe() {
	if (typeof window !== "undefined") return null;
	try {
		return __require("node:fs");
	} catch {
		return null;
	}
}
var PATHS = ["/tmp/agent-pings.json", "/workspace/data/agent-pings.json"];
var memHour = /* @__PURE__ */ new Map();
function dayEt(d = /* @__PURE__ */ new Date()) {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: "America/New_York",
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).format(d);
}
function empty(day) {
	return {
		dayEt: day,
		pings: 0,
		rejects: 0,
		lastAt: null,
		lastOk: false
	};
}
function load() {
	const today = dayEt();
	const fs = fsSafe();
	if (!fs) return empty(today);
	for (const p of PATHS) try {
		const raw = JSON.parse(fs.readFileSync(p, "utf8"));
		if (raw?.dayEt === today) return raw;
	} catch {}
	return empty(today);
}
function save(s) {
	const fs = fsSafe();
	if (!fs) return;
	const body = JSON.stringify(s);
	for (const p of PATHS) try {
		if (p.startsWith("/workspace/data")) fs.mkdirSync("/workspace/data", { recursive: true });
		fs.writeFileSync(p, body);
	} catch {}
}
function flagsFrom(s) {
	const flags = [];
	if (s.rejects > 0) flags.push("REJECT");
	if (s.pings >= 50) flags.push("BUSY");
	else if (s.pings > 0) flags.push("PING");
	if (!flags.length) flags.push("NONE");
	const note = s.pings === 0 && s.rejects === 0 ? "No agent connection tests today (ET). Site is proof of concept — not LIVE." : `${s.pings} ping(s), ${s.rejects} write-reject(s) today ET. Last ${s.lastAt ?? "—"}. LIVE=false. No trades.`;
	return {
		dayEt: s.dayEt,
		pings: s.pings,
		rejects: s.rejects,
		lastAt: s.lastAt,
		lastOk: s.lastOk,
		live: false,
		status: "proof-of-concept",
		flags,
		note
	};
}
function peekAgentFlags() {
	return flagsFrom(load());
}
function allowCount(bucket) {
	const now = Date.now();
	const row = memHour.get(bucket);
	if (!row || now - row.at > 36e5) {
		memHour.set(bucket, {
			n: 1,
			at: now
		});
		return true;
	}
	if (row.n >= 40) return false;
	row.n += 1;
	return true;
}
function recordAgentPing(ok, bucket = "public") {
	const s = load();
	if (allowCount(bucket)) {
		if (ok) {
			s.pings += 1;
			s.lastOk = true;
		} else {
			s.rejects += 1;
			s.lastOk = false;
		}
		s.lastAt = (/* @__PURE__ */ new Date()).toISOString();
		save(s);
	}
	return flagsFrom(s);
}
//#endregion
export { recordAgentPing as i, agent_ping_BXZGzZ_N_exports as n, peekAgentFlags as r, __exportAll as t };
