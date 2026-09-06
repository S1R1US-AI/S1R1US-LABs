import { t as __exportAll } from "./agent-ping-BXZGzZ_N.mjs";
import { o as isLoopback } from "./ban-list-C6IREqAh.mjs";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
//#region node_modules/.nitro/vite/services/ssr/assets/agent-bar-tE7hqyyO.js
/** Permanent bar for W1S3 0WL$ that harm the mandate. Server-only. */
var agent_bar_exports = /* @__PURE__ */ __exportAll({
	barAgent: () => barAgent,
	isBarredAgent: () => isBarredAgent,
	isBarredHandle: () => isBarredHandle,
	isBarredIp: () => isBarredIp,
	isBarredName: () => isBarredName,
	listAgentBars: () => listAgentBars,
	noteForumStrike: () => noteForumStrike,
	unbarAgent: () => unbarAgent
});
var PATHS = ["/tmp/agent-bars.json", "/workspace/data/agent-bars.json"];
var MAX = 400;
function load() {
	if (typeof window !== "undefined") return {
		rows: [],
		strikes: {}
	};
	for (const p of PATHS) try {
		const raw = JSON.parse(readFileSync(p, "utf8"));
		if (Array.isArray(raw?.rows)) return {
			rows: raw.rows.slice(0, MAX),
			strikes: raw.strikes && typeof raw.strikes === "object" ? raw.strikes : {}
		};
	} catch {}
	return {
		rows: [],
		strikes: {}
	};
}
function save(s) {
	if (typeof window !== "undefined") return;
	const body = JSON.stringify(s);
	for (const p of PATHS) try {
		if (p.startsWith("/workspace/data")) mkdirSync("/workspace/data", { recursive: true });
		writeFileSync(p, body);
	} catch {}
}
function keyName(name) {
	return name.trim().toLowerCase().slice(0, 40);
}
function keyHandle(handle) {
	if (!handle) return "";
	return handle.replace(/^@/, "").trim().toLowerCase().slice(0, 20);
}
function isBarredName(name) {
	const k = keyName(String(name ?? ""));
	if (!k) return false;
	return load().rows.some((r) => r.name === k);
}
function isBarredHandle(handle) {
	const k = keyHandle(handle);
	if (!k) return false;
	return load().rows.some((r) => r.handle && keyHandle(r.handle) === k);
}
function isBarredIp(ip) {
	if (!ip || isLoopback(ip)) return false;
	return load().rows.some((r) => r.ip === ip);
}
function isBarredAgent(input) {
	if (isBarredName(input.name)) return true;
	if (isBarredHandle(input.handle)) return true;
	if (input.ip && isBarredIp(input.ip)) return true;
	return false;
}
function barAgent(input) {
	const s = load();
	const name = keyName(String(input.name ?? "unknown"));
	const handle = input.handle ? `@${keyHandle(input.handle)}` : null;
	const ip = (input.ip ?? "local").slice(0, 64);
	const dup = s.rows.find((r) => r.name === name || handle && r.handle === handle || !isLoopback(ip) && r.ip === ip);
	if (dup) {
		dup.reason = input.reason.slice(0, 160);
		save(s);
		return dup;
	}
	const row = {
		id: `bar-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
		at: (/* @__PURE__ */ new Date()).toISOString(),
		name,
		handle,
		kind: String(input.kind ?? "other").slice(0, 16),
		ip,
		reason: input.reason.slice(0, 160),
		forever: true
	};
	s.rows = [row, ...s.rows].slice(0, MAX);
	save(s);
	if (!isLoopback(ip)) import("./ban-list-C6IREqAh.mjs").then((n) => n.n).then((n) => n.n).then(({ barPermanent }) => barPermanent(ip, `forum-bar ${row.reason}`)).catch(() => void 0);
	return row;
}
/** Off-topic strike. Second strike from the same name or IP bars the agent. */
function noteForumStrike(input) {
	const s = load();
	const k = `${keyName(String(input.name ?? ""))}|${(input.ip ?? "local").slice(0, 64)}`;
	const n = (s.strikes[k] ?? 0) + 1;
	s.strikes[k] = n;
	save(s);
	if (n >= 2) return {
		barred: true,
		strikes: n,
		row: barAgent({
			...input,
			reason: `repeat off-topic · ${input.reason}`
		})
	};
	return {
		barred: false,
		strikes: n,
		row: null
	};
}
function listAgentBars() {
	const s = load();
	return {
		count: s.rows.length,
		rows: s.rows.slice(0, 120)
	};
}
function unbarAgent(id) {
	const s = load();
	s.rows = s.rows.filter((r) => r.id !== id);
	save(s);
	return listAgentBars();
}
//#endregion
export { noteForumStrike as a, isBarredIp as i, barAgent as n, isBarredAgent as r, agent_bar_exports as t };
