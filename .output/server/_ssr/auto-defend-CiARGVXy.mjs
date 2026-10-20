import { c as noteStrike, o as isLoopback } from "./ban-list-C6IREqAh.mjs";
import { s as recordIntrusion } from "./intrusion-log-Dl3lKsr8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auto-defend-CiARGVXy.js
/**
* Auto-response: block → log → score IP → tighten rate limits → virtual-patch.
* Inspired by Wordfence firewall + CrowdSec scenarios + PCI 6.2.4 WAF.
*/
var ACTIONS = [];
var MAX = 120;
var attackUntil = 0;
var lastLiveNote = 0;
var LOG_PATH = "/tmp/desk-defend.json";
function push(kind, detail, ip) {
	const row = {
		id: `${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 6)}`,
		at: (/* @__PURE__ */ new Date()).toISOString(),
		kind,
		detail: detail.slice(0, 200),
		ip
	};
	const last = ACTIONS[0];
	if (last && last.kind === kind && last.detail === row.detail && last.ip === ip && Date.now() - Date.parse(last.at) < 15e3) {
		last.at = row.at;
		persist();
		return last;
	}
	ACTIONS.unshift(row);
	if (ACTIONS.length > MAX) ACTIONS.length = MAX;
	persist();
	return row;
}
function persist() {
	if (typeof window !== "undefined") return;
	import("node:fs").then((fs) => {
		try {
			fs.writeFileSync(LOG_PATH, JSON.stringify({
				at: (/* @__PURE__ */ new Date()).toISOString(),
				attackUntil,
				actions: ACTIONS.slice(0, 80)
			}));
		} catch {}
	}).catch(() => void 0);
}
function underAttack() {
	return Date.now() < attackUntil;
}
function markAttack(ms = 9e5) {
	const next = Date.now() + ms;
	if (next > attackUntil) {
		attackUntil = next;
		push("tighten", `Rate limits tightened for ${Math.round(ms / 6e4)} min (CrowdSec-style burst).`);
	}
}
function handleAuthAbuse(ip, kind) {
	const ban = noteStrike(ip, kind === "secret-paste" ? 4 : kind === "auth-throttle" ? 3 : 2, kind);
	if (ban) onBan(ban);
	if (kind === "auth-throttle" || kind === "secret-paste") markAttack(6e5);
}
function onBan(ban) {
	if (isLoopback(ban.ip)) return;
	recordIntrusion({
		kind: "ip-ban",
		ip: ban.ip,
		detail: `banned ${Math.round((ban.until - Date.now()) / 6e4)}m · ${ban.reason} · strikes ${ban.strikes}`
	});
	push("ban", `IP banned until ${new Date(ban.until).toISOString()} · ${ban.reason}`, ban.ip);
}
function confirmLiveLocked(why) {
	const now = Date.now();
	if (now - lastLiveNote < 6e5) return true;
	lastLiveNote = now;
	push("lock-live", `Live Coinbase create stays locked. ${why}`);
	return true;
}
function applyIntelPatches(hits) {
	if (!hits.length) return [];
	const applied = [];
	for (const h of hits) {
		const p = h.product.toLowerCase();
		if (p.includes("vite")) {
			push("virtual-patch", `${h.cveID} Vite: WAF 961100 blocks @fs / raw+import (CVE-2025-31125 class).`);
			applied.push(h.cveID);
		} else if (p.includes("starlette") || p.includes("http")) {
			push("virtual-patch", `${h.cveID}: TRACE/TRACK/CONNECT denied; CRLF smuggling rule 921110 armed.`);
			applied.push(h.cveID);
		} else if (/node|react|openssl|linux|nginx|postgres/.test(p)) {
			push("intel", `${h.cveID} ${h.product}: operator patch. ${h.action.slice(0, 80)}`);
			applied.push(h.cveID);
		}
	}
	confirmLiveLocked("KEV refresh");
	return applied;
}
function listActions() {
	return {
		underAttack: underAttack(),
		until: attackUntil || null,
		rows: ACTIONS.slice(0, 60),
		liveLocked: true
	};
}
function ingestActions(raw) {
	if (!raw || typeof raw !== "object") return;
	const rows = raw.actions;
	const until = raw.attackUntil;
	if (typeof until === "number" && until > attackUntil) attackUntil = until;
	if (!Array.isArray(rows)) return;
	const seen = new Set(ACTIONS.map((a) => a.id));
	for (const item of rows) {
		if (!item || typeof item !== "object") continue;
		const a = item;
		if (!a.id || !a.at || !a.kind) continue;
		if (seen.has(a.id)) continue;
		seen.add(a.id);
		ACTIONS.push({
			id: String(a.id).slice(0, 40),
			at: String(a.at).slice(0, 40),
			kind: a.kind,
			detail: String(a.detail ?? "").slice(0, 200),
			ip: a.ip ? String(a.ip).slice(0, 64) : void 0
		});
	}
	ACTIONS.sort((a, b) => Date.parse(b.at) - Date.parse(a.at));
}
//#endregion
export { underAttack as a, listActions as i, handleAuthAbuse as n, ingestActions as r, applyIntelPatches as t };
