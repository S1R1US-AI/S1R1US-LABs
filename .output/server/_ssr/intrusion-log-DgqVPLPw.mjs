import { r as __exportAll } from "../_runtime.mjs";
import { t as __exportAll$1 } from "./agent-ping-BXZGzZ_N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/intrusion-log-DgqVPLPw.js
var intrusion_log_DgqVPLPw_exports = /* @__PURE__ */ __exportAll({
	a: () => listIntrusions,
	i: () => intrusion_log_exports,
	n: () => ingestPersisted,
	o: () => recordIntrusion,
	r: () => intrusionSummary,
	t: () => INTRUSION_KIND_LABEL
});
var intrusion_log_exports = /* @__PURE__ */ __exportAll$1({
	INTRUSION_KIND_LABEL: () => INTRUSION_KIND_LABEL,
	ingestPersisted: () => ingestPersisted,
	intrusionSummary: () => intrusionSummary,
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
	"forum-offtopic": "Forum off-topic"
};
var MAX = 200;
var RING = [];
var LOG_PATH = "/tmp/desk-intrusions.json";
function persist() {
	if (typeof window !== "undefined") return;
	import("node:fs").then((fs) => {
		try {
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
//#endregion
export { listIntrusions as a, intrusion_log_DgqVPLPw_exports as i, ingestPersisted as n, recordIntrusion as o, intrusionSummary as r, INTRUSION_KIND_LABEL as t };
