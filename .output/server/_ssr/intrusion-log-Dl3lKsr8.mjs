import { r as __exportAll } from "../_runtime.mjs";
import { t as __exportAll$1 } from "./agent-ping-BXZGzZ_N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/intrusion-log-Dl3lKsr8.js
var intrusion_log_Dl3lKsr8_exports = /* @__PURE__ */ __exportAll({
	a: () => intrusion_log_exports,
	i: () => intrusionSummary,
	n: () => INTRUSION_KIND_LABEL,
	o: () => listIntrusions,
	r: () => ingestPersisted,
	s: () => recordIntrusion,
	t: () => BAD_BOT_KINDS
});
var intrusion_log_exports = /* @__PURE__ */ __exportAll$1({
	BAD_BOT_KINDS: () => BAD_BOT_KINDS,
	INTRUSION_KIND_LABEL: () => INTRUSION_KIND_LABEL,
	badBotIntrusions: () => badBotIntrusions,
	ingestPersisted: () => ingestPersisted,
	intrusionSummary: () => intrusionSummary,
	isBadBotKind: () => isBadBotKind,
	listIntrusions: () => listIntrusions,
	recordIntrusion: () => recordIntrusion
});
var INTRUSION_KIND_LABEL = {
	"rate-limit": "Rate limit",
	scraper: "Scraper",
	"blocked-host": "Blocked host",
	"blocked-url": "Blocked URL",
	"auth-fail": "Auth fail",
	"auth-throttle": "Auth throttle",
	"waitlist-reject": "Waitlist reject",
	"source-probe": "Source probe",
	"secret-paste": "Secret paste",
	"waf-block": "WAF block",
	"ip-ban": "IP ban",
	scanner: "Scanner",
	"agent-inject": "Agent injection",
	"mcp-deny": "MCP deny",
	"agency-probe": "Agency probe",
	"forum-bar": "W1S3 0WL$ bar",
	"forum-offtopic": "Forum off-topic",
	"bad-bot": "Bad bot"
};
/** External agents that probe, inject, scrape, or violate mandate. Always blocked. */
var BAD_BOT_KINDS = [
	"bad-bot",
	"source-probe",
	"agent-inject",
	"mcp-deny",
	"agency-probe",
	"forum-bar",
	"scraper",
	"scanner",
	"waitlist-reject",
	"secret-paste"
];
function isBadBotKind(kind) {
	return BAD_BOT_KINDS.includes(kind);
}
var MAX = 200;
var RING = [];
var LOG_PATH = "/tmp/desk-intrusions.json";
function persist() {
	if (typeof window !== "undefined") return;
	import("node:fs").then((fs) => {
		try {
			try {
				ingestPersisted(JSON.parse(fs.readFileSync(LOG_PATH, "utf8")));
			} catch {}
			fs.writeFileSync(LOG_PATH, JSON.stringify({
				at: (/* @__PURE__ */ new Date()).toISOString(),
				rows: RING
			}, null, 2));
		} catch {}
	}).catch(() => void 0);
}
function ingestPersisted(raw) {
	if (!raw || typeof raw !== "object") return;
	const rows = raw.rows;
	if (!Array.isArray(rows) || !rows.length) return;
	const seen = new Set(RING.map((r) => r.id));
	const extra = [];
	for (const item of rows) {
		if (!item || typeof item !== "object") continue;
		const r = item;
		if (!r.id || !r.at || !r.kind || !r.blocked) continue;
		if (seen.has(r.id)) continue;
		seen.add(r.id);
		extra.push({
			id: String(r.id).slice(0, 40),
			at: String(r.at).slice(0, 40),
			kind: r.kind,
			ip: String(r.ip ?? "local").slice(0, 64),
			ua: String(r.ua ?? "-").slice(0, 80),
			detail: String(r.detail ?? "").slice(0, 180),
			blocked: true
		});
	}
	if (!extra.length) return;
	RING = [...RING, ...extra].sort((a, b) => Date.parse(b.at) - Date.parse(a.at)).slice(0, MAX);
}
/** Permanent IP bar on first malicious / probing agent hit. Not scrapers (those 429). */
var AUTO_BAR_KINDS = [
	"bad-bot",
	"source-probe",
	"agent-inject",
	"mcp-deny",
	"agency-probe",
	"forum-bar"
];
function recordIntrusion(row) {
	const at = (/* @__PURE__ */ new Date()).toISOString();
	const ip = (row.ip ?? "local").slice(0, 64);
	const ua = (row.ua ?? "-").slice(0, 80);
	const detail = row.detail.slice(0, 180);
	const last = RING[0];
	if (last && last.kind === row.kind && last.ip === ip && last.detail === detail && Date.now() - Date.parse(last.at) < 2e4) {
		last.at = at;
		persist();
		return last;
	}
	const rec = {
		id: `${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 6)}`,
		at,
		kind: row.kind,
		ip,
		ua,
		detail,
		blocked: true
	};
	RING.unshift(rec);
	if (RING.length > MAX) RING.length = MAX;
	persist();
	if (typeof window === "undefined" && AUTO_BAR_KINDS.includes(row.kind)) import("./ban-list-C6IREqAh.mjs").then((n) => n.n).then((n) => n.n).then(({ barPermanent, isLoopback }) => {
		if (!isLoopback(ip)) barPermanent(ip, `${row.kind} ${detail}`.slice(0, 160));
	}).catch(() => void 0);
	return rec;
}
function listIntrusions() {
	return RING.slice(0, MAX);
}
function intrusionSummary() {
	const last24 = Date.now() - 864e5;
	const today = RING.filter((r) => Date.parse(r.at) >= last24);
	const byKind = {};
	for (const r of today) byKind[r.kind] = (byKind[r.kind] ?? 0) + 1;
	return {
		total: RING.length,
		last24h: today.length,
		byKind,
		lastAt: RING[0]?.at ?? null
	};
}
function badBotIntrusions(hours = 24) {
	const since = Date.now() - hours * 60 * 6e4;
	return RING.filter((r) => isBadBotKind(r.kind) && Date.parse(r.at) >= since);
}
//#endregion
export { intrusion_log_Dl3lKsr8_exports as a, intrusionSummary as i, INTRUSION_KIND_LABEL as n, listIntrusions as o, ingestPersisted as r, recordIntrusion as s, BAD_BOT_KINDS as t };
