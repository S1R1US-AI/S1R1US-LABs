import { r as __exportAll } from "../_runtime.mjs";
//#region src/lib/desk/intrusion-log.ts
var intrusion_log_exports = /* @__PURE__ */ __exportAll({
	ingestPersisted: () => ingestPersisted,
	recordIntrusion: () => recordIntrusion
});
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
	if (typeof window === "undefined" && AUTO_BAR_KINDS.includes(row.kind)) import("./ban-list.mjs").then(({ barPermanent, isLoopback }) => {
		if (!isLoopback(ip)) barPermanent(ip, `${row.kind} ${detail}`.slice(0, 160));
	}).catch(() => void 0);
	return rec;
}
//#endregion
export { recordIntrusion as n, intrusion_log_exports as t };
