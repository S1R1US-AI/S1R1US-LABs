import { r as __exportAll } from "../_runtime.mjs";
//#region src/lib/desk/intrusion-log.ts
var intrusion_log_exports = /* @__PURE__ */ __exportAll({ recordIntrusion: () => recordIntrusion });
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
//#endregion
export { recordIntrusion as n, intrusion_log_exports as t };
