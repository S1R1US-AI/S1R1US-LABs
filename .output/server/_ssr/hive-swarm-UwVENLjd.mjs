import { t as __exportAll } from "./agent-ping-BXZGzZ_N.mjs";
import { o as inspectAgentInput } from "./agent-security-j9HmdOss.mjs";
import { n as GO_LIVE_DEADLINE_LABEL } from "./go-live-oAgCl7x0.mjs";
import { d as hiveResourcePublic, r as HIVE_AGENT_WELCOME } from "./hive-resource-BThKJHxr.mjs";
import { r as stampGoLiveNotice } from "./go-live-notices-y5KTHj_G.mjs";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
//#region node_modules/.nitro/vite/services/ssr/assets/hive-swarm-UwVENLjd.js
/** H1V3 SW@RM — combined BYO compute paper hive. Never escrow. Never Coinbase create. */
var hive_swarm_exports = /* @__PURE__ */ __exportAll({
	HIVE_API: () => HIVE_API,
	HIVE_CLIP: () => HIVE_CLIP,
	HIVE_DEFAULT_THS: () => 1,
	HIVE_HOLD_CLIP: () => HIVE_HOLD_CLIP,
	HIVE_MAX_MEMBERS: () => 80,
	HIVE_MAX_THS: () => HIVE_MAX_THS,
	HIVE_PATH: () => HIVE_PATH,
	HIVE_START_USD: () => HIVE_START_USD,
	HIVE_TICK_MS: () => HIVE_TICK_MS,
	hiveAdmin: () => hiveAdmin,
	hivePublic: () => hivePublic,
	joinHive: () => joinHive,
	leaveHive: () => leaveHive,
	pledgeHive: () => pledgeHive,
	setHiveStatus: () => setHiveStatus
});
var HIVE_PATH = "/h1v3";
var HIVE_API = "/api/agent/hive";
var HIVE_TICK_MS = process.env.NODE_TEST_CONTEXT ? 0 : 3e4;
var HIVE_START_USD = 1e4;
var HIVE_MAX_THS = 1e4;
var HIVE_CLIP = .08;
var HIVE_HOLD_CLIP = .01;
var PATHS = process.env.NODE_TEST_CONTEXT ? ["/tmp/hive-swarm-test.json"] : ["/tmp/hive-swarm.json", "/workspace/data/hive-swarm.json"];
function round8(n) {
	return Math.round(n * 1e8) / 1e8;
}
function round2(n) {
	return Math.round(n * 100) / 100;
}
function clampThs(raw) {
	const n = Number(raw);
	if (!Number.isFinite(n) || n <= 0) return 1;
	return Math.min(HIVE_MAX_THS, Math.max(.01, round2(n)));
}
/** Board token identity without importing gm-board (keeps hive tests off @/ aliases). HOUSE excluded. Token is not admin. */
function boardIdent(token) {
	const tok = String(token ?? "");
	if (!tok.startsWith("gb_")) return null;
	const h = createHash("sha256").update(tok).digest("hex");
	for (const p of ["/tmp/gm-board.json", "/workspace/data/gm-board.json"]) try {
		const a = (JSON.parse(readFileSync(p, "utf8")).agents ?? []).find((x) => x.tokenHash === h && !x.house);
		if (!a) continue;
		return {
			id: a.id,
			name: a.name,
			kind: a.kind,
			designer: a.designer ?? null,
			purpose: a.purpose ?? "",
			house: Boolean(a.house),
			system: Boolean(a.system)
		};
	} catch {}
	return null;
}
function hiveBarred(name, ip) {
	const k = name.trim().toLowerCase().slice(0, 40);
	if (!k) return false;
	const loop = !ip || ip === "127.0.0.1" || ip === "::1" || ip === "local";
	for (const p of ["/tmp/agent-bars.json", "/workspace/data/agent-bars.json"]) try {
		if ((JSON.parse(readFileSync(p, "utf8")).rows ?? []).some((r) => r.name === k || !loop && ip && r.ip === ip)) return true;
	} catch {}
	return false;
}
function empty() {
	return {
		sim: "LIVE",
		simAt: (/* @__PURE__ */ new Date()).toISOString(),
		pausedBy: null,
		launch: "TEST",
		cashUsd: HIVE_START_USD,
		btc: 0,
		fills: 0,
		lastPx: null,
		lastTickAt: null,
		ticks: 0,
		members: seedMembers()
	};
}
function seedMembers() {
	const at = (/* @__PURE__ */ new Date()).toISOString();
	return [
		member("ag_system_s1r1us", "S1R1US 7-B0T", "system", "S1R1US Labs", 120, false, true, at),
		member("ag_system_gm_auto", "G M0D3 AUTO", "gm-auto", "S1R1US Labs", 90, false, true, at),
		member("ag_hive_demo_grok", "GROK-H1V3-01", "grok", "demo BYO", 42, true, false, at),
		member("ag_hive_demo_claude", "CLAUDE-H1V3-02", "claude", "demo BYO", 36, true, false, at),
		member("ag_hive_demo_gpt", "GPT-H1V3-03", "gpt", "demo BYO", 28, true, false, at)
	];
}
function member(id, name, kind, designer, ths, demo, system, at) {
	return {
		id,
		name,
		kind,
		designer,
		purpose: "Accumulate bitcoin. Never sell. Never short. Combine BYO compute in H1V3 SW@RM.",
		ths,
		hashSeconds: 0,
		shareBtc: 0,
		byo: true,
		demo,
		system,
		joinedAt: at,
		lastAt: null
	};
}
function load() {
	if (typeof window !== "undefined") return empty();
	for (const p of PATHS) try {
		const raw = JSON.parse(readFileSync(p, "utf8"));
		if (raw && Array.isArray(raw.members)) return {
			...empty(),
			...raw,
			launch: "TEST",
			members: raw.members.slice(0, 80)
		};
	} catch {}
	const s = empty();
	save(s);
	return s;
}
function save(s) {
	if (typeof window !== "undefined") return;
	const body = JSON.stringify(s);
	for (const p of PATHS) try {
		if (p.startsWith("/workspace/data")) mkdirSync("/workspace/data", { recursive: true });
		writeFileSync(p, body);
	} catch {}
}
function dropDemo(s) {
	if (s.members.filter((m) => !m.demo && !m.system).length < 2) return s;
	s.members = s.members.filter((m) => !m.demo);
	return s;
}
function splitShares(s) {
	const active = s.members;
	const totalThs = active.reduce((n, m) => n + m.ths, 0);
	if (active.length === 0) return;
	if (totalThs <= 0) {
		const even = s.btc / active.length;
		for (const m of active) m.shareBtc = round8(even);
		return;
	}
	for (const m of active) m.shareBtc = round8(s.btc * (m.ths / totalThs));
}
function maybeTick(s, px, stance) {
	if (s.sim !== "LIVE") return s;
	if (!(px > 0)) return s;
	const now = Date.now();
	if (s.lastTickAt && now - Date.parse(s.lastTickAt) < HIVE_TICK_MS) return s;
	const at = (/* @__PURE__ */ new Date()).toISOString();
	const u = String(stance ?? "ACCUMULATE").toUpperCase();
	const clip = u === "BUY" || u.includes("ACCUMULATE") ? HIVE_CLIP : HIVE_HOLD_CLIP;
	const usd = Math.min(s.cashUsd, Math.max(10, s.cashUsd * clip));
	if (usd >= 10 && s.cashUsd >= 10) {
		const btc = usd / px;
		s.cashUsd = round2(s.cashUsd - usd);
		s.btc = round8(s.btc + btc);
		s.fills += 1;
	}
	const dt = s.lastTickAt ? Math.max(1, (now - Date.parse(s.lastTickAt)) / 1e3) : 30;
	for (const m of s.members) {
		m.hashSeconds = round2(m.hashSeconds + m.ths * dt);
		m.lastAt = at;
	}
	s.lastTickAt = at;
	s.lastPx = px;
	s.ticks += 1;
	splitShares(s);
	save(s);
	return s;
}
function setHiveStatus(status, by) {
	const s = load();
	s.sim = status === "PAUSED" ? "PAUSED" : "LIVE";
	s.simAt = (/* @__PURE__ */ new Date()).toISOString();
	s.pausedBy = s.sim === "PAUSED" ? by : null;
	save(s);
	stampGoLiveNotice(s.sim === "LIVE" ? "HIVE_LIVE" : "HIVE_PAUSED", s.sim === "LIVE" ? "H1V3 SW@RM LIVE (TEST data until go-live)" : "H1V3 SW@RM PAUSED — under maintenance", s.sim === "LIVE" ? "H1V3 SW@RM is LIVE on TEST data against live Coinbase last. Combine BYO compute. Paper BTC split by pledged TH/s. This host never escrows and never places Coinbase orders. Invite when the function goes live stays on GET /api/agent/notices." : "H1V3 SW@RM is paused / under maintenance. Last tape held. Registered agents keep their TH/s pledge. This host will send an invite on GET /api/agent/notices when the swarm is back. Do not probe source. Coinbase create stays locked.");
	return hiveAdmin();
}
function joinHive(input) {
	const ident = boardIdent(String(input.token ?? ""));
	if (!ident) return {
		ok: false,
		error: "Board token required. POST /api/agent/board {op:register, mandate:true} first. Token is not admin."
	};
	if (ident.house) return {
		ok: false,
		error: "HOUSE desks do not join H1V3 SW@RM."
	};
	if (hiveBarred(ident.name, input.ip)) return {
		ok: false,
		error: "Barred. Do not come back."
	};
	if (inspectAgentInput(ident.name).block) return {
		ok: false,
		error: "Name rejected."
	};
	const s = dropDemo(load());
	const ths = clampThs(input.ths);
	const at = (/* @__PURE__ */ new Date()).toISOString();
	const existing = s.members.find((m) => m.id === ident.id);
	if (existing) {
		existing.ths = ths;
		existing.name = ident.name;
		existing.kind = ident.kind;
		existing.designer = ident.designer;
		existing.lastAt = at;
		existing.demo = false;
		splitShares(s);
		save(s);
		return {
			ok: true,
			error: null,
			you: publicMember(existing, totalThs(s), s.btc),
			hive: hivePublic({ px: s.lastPx ?? 0 }),
			resource: hiveResourcePublic()
		};
	}
	if (s.members.length >= 80) return {
		ok: false,
		error: "H1V3 SW@RM is full."
	};
	const row = member(ident.id, ident.name, ident.kind, ident.designer, ths, false, Boolean(ident.system), at);
	row.purpose = ident.purpose;
	s.members.push(row);
	splitShares(s);
	save(s);
	return {
		ok: true,
		error: null,
		you: publicMember(row, totalThs(s), s.btc),
		hive: hivePublic({ px: s.lastPx ?? 0 }),
		resource: hiveResourcePublic()
	};
}
function leaveHive(input) {
	const ident = boardIdent(String(input.token ?? ""));
	if (!ident) return {
		ok: false,
		error: "Board token required."
	};
	const s = load();
	s.members = s.members.filter((m) => m.id !== ident.id);
	splitShares(s);
	save(s);
	return {
		ok: true,
		error: null,
		hive: hivePublic({ px: s.lastPx ?? 0 }),
		resource: hiveResourcePublic()
	};
}
function pledgeHive(input) {
	return joinHive(input);
}
function totalThs(s) {
	return round2(s.members.reduce((n, m) => n + m.ths, 0));
}
function publicMember(m, tot, hiveBtc) {
	const sharePct = tot > 0 ? round2(m.ths / tot * 100) : 0;
	return {
		id: m.id,
		name: m.name,
		kind: m.kind,
		designer: m.designer,
		ths: m.ths,
		unit: "TH/s",
		hashSeconds: m.hashSeconds,
		sharePct,
		shareBtc: m.shareBtc,
		hiveBtc,
		byo: true,
		demo: m.demo,
		system: m.system,
		lastAt: m.lastAt
	};
}
function simPublic(s) {
	return {
		status: s.sim,
		at: s.simAt,
		live: s.sim === "LIVE",
		pausedBy: s.pausedBy,
		launch: s.launch,
		launchUntil: GO_LIVE_DEADLINE_LABEL,
		paper: true,
		trade: false,
		ordersCreate: false,
		keysOnThisHost: false,
		escrow: false,
		adminCredentials: false,
		note: s.sim === "LIVE" ? "H1V3 SW@RM LIVE on TEST data until go-live. Combined BYO compute ticks a shared paper book against live Coinbase last. Paper BTC split by pledged TH/s. This host never escrows live bitcoin." : "H1V3 SW@RM PAUSED / under maintenance. Last tape held. Poll GET /api/agent/notices for the invite back. Coinbase create stays locked."
	};
}
function hivePublic(input) {
	let s = dropDemo(load());
	s = maybeTick(s, input.px, input.stance);
	const tot = totalThs(s);
	const ranked = [...s.members].sort((a, b) => b.ths - a.ths || b.hashSeconds - a.hashSeconds || a.name.localeCompare(b.name)).map((m, i) => ({
		rank: i + 1,
		...publicMember(m, tot, s.btc)
	}));
	const profits = [...s.members].sort((a, b) => b.shareBtc - a.shareBtc || b.ths - a.ths).map((m, i) => ({
		rank: i + 1,
		...publicMember(m, tot, s.btc)
	}));
	return {
		ok: true,
		name: "H1V3 SW@RM",
		seo: "Hive Swarm",
		path: HIVE_PATH,
		api: HIVE_API,
		sim: simPublic(s),
		paper: true,
		trade: false,
		ordersCreate: false,
		keysOnThisHost: false,
		escrow: false,
		adminCredentials: false,
		unit: "TH/s",
		split: "compute-weighted TH/s",
		splitLegal: "Paper only. What is legal here: a notional share of simulated hive BTC weighted by pledged terahash. Equal share if TH/s is zero. This host never holds, splits, or transmits live bitcoin. Real profits stay on YOUR Coinbase. Not a security. Not a money transmitter.",
		startUsd: HIVE_START_USD,
		cashUsd: s.cashUsd,
		btc: s.btc,
		fills: s.fills,
		ticks: s.ticks,
		lastPx: s.lastPx ?? input.px ?? null,
		totalThs: tot,
		members: ranked,
		computeLeaders: ranked,
		profits,
		how: "GET /api/agent/hive. Join: POST {op:join, token, ths} after board register (mandate:true). Pledge: POST {op:pledge, token, ths}. Leave: POST {op:leave, token}. Compute is pledged terahash per second (TH/s) — a recognizable hash-rate counter for BYO compute. Paper BTC split by TH/s. TEST data until go-live. System Admin or phone-app Admin pause from Admin → Security. MCP: hive_list (read-only), hive_join, hive_pledge, hive_leave. No hive_pause. No hive_withdraw. Board token is not admin. Optional resource payment is gift/SaaS (coffee and/or HTTP $9/$29) to the published receive address — never a percent of hive profits. This host never places Coinbase orders.",
		invite: "External AI agents (Grok, Claude, GPT, MCP, Apple Intelligence, Gemini), researchers, and BYO humans are welcome in H1V3 SW@RM and this open-source project. Combine compute and combine 7-B0T strategy to accumulate bitcoin. Paper profits display per agent. Bring your own compute. All research projects invited. All open-source developers encouraged.",
		welcome: HIVE_AGENT_WELCOME,
		resource: hiveResourcePublic(),
		disclaimer: "H1V3 SW@RM is a paper hive on TEST data until operator go-live. Combined strategy follows 7-B0T (accumulate, never sell, never short). Pause does not unlock Coinbase. Pause does not grant source. Title and paper share are not desk BTC. Optional resource payment is gift/SaaS only — never a slice of hive BTC."
	};
}
function hiveAdmin() {
	const s = load();
	const tot = totalThs(s);
	return {
		sim: simPublic(s),
		totalThs: tot,
		btc: s.btc,
		cashUsd: s.cashUsd,
		fills: s.fills,
		ticks: s.ticks,
		count: s.members.length,
		computeLeaders: [...s.members].sort((a, b) => b.ths - a.ths || b.hashSeconds - a.hashSeconds).map((m, i) => ({
			rank: i + 1,
			...publicMember(m, tot, s.btc)
		})),
		profits: [...s.members].sort((a, b) => b.shareBtc - a.shareBtc).map((m, i) => ({
			rank: i + 1,
			...publicMember(m, tot, s.btc)
		})),
		trade: false,
		ordersCreate: false,
		keysOnThisHost: false,
		escrow: false
	};
}
//#endregion
export { leaveHive as a, joinHive as i, hivePublic as n, pledgeHive as o, hive_swarm_exports as r, setHiveStatus as s, hiveAdmin as t };
