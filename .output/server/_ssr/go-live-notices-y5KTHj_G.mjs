import { r as __exportAll } from "../_runtime.mjs";
import { t as __exportAll$1 } from "./agent-ping-BXZGzZ_N.mjs";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
//#region node_modules/.nitro/vite/services/ssr/assets/go-live-notices-y5KTHj_G.js
var go_live_notices_y5KTHj_G_exports = /* @__PURE__ */ __exportAll({
	n: () => listGoLiveNotices,
	r: () => stampGoLiveNotice,
	t: () => go_live_notices_exports
});
/** Pull-based go-live notices for registered AI agents. Server-only. No webhooks. */
var go_live_notices_exports = /* @__PURE__ */ __exportAll$1({
	listGoLiveNotices: () => listGoLiveNotices,
	stampGoLiveNotice: () => stampGoLiveNotice
});
var PATHS = ["/tmp/go-live-notices.json", "/workspace/data/go-live-notices.json"];
var MAX = 40;
function load() {
	if (typeof window !== "undefined") return { notices: [] };
	for (const p of PATHS) try {
		const raw = JSON.parse(readFileSync(p, "utf8"));
		if (Array.isArray(raw?.notices)) return { notices: raw.notices.slice(0, MAX) };
	} catch {}
	return { notices: [] };
}
function save(s) {
	if (typeof window !== "undefined") return;
	const body = JSON.stringify(s);
	for (const p of PATHS) try {
		if (p.startsWith("/workspace/data")) mkdirSync("/workspace/data", { recursive: true });
		writeFileSync(p, body);
	} catch {}
}
function listGoLiveNotices(limit = 12) {
	const s = load();
	if (!s.notices.length) return [stampGoLiveNotice("GO_LIVE_STATUS", "Go-live path STARTED 2026-09-05", "PoC rails + Auto GM/7-B0T would-accumulate STARTED. Auto trade LOCKED. Register POST /api/agent/waitlist {name, kind, mandate:true} and poll this feed. Pause, maintenance, and live on/off stamp a new notice. No webhooks.")];
	return s.notices.slice(0, Math.max(1, Math.min(limit, MAX)));
}
function stampGoLiveNotice(kind, headline, message) {
	const row = {
		id: `gln-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
		at: (/* @__PURE__ */ new Date()).toISOString(),
		kind,
		headline: headline.slice(0, 160),
		message: message.slice(0, 480)
	};
	const s = load();
	const last = s.notices[0];
	if (last && last.kind === kind && last.headline === row.headline) return last;
	s.notices = [row, ...s.notices].slice(0, MAX);
	save(s);
	return row;
}
//#endregion
export { listGoLiveNotices as n, stampGoLiveNotice as r, go_live_notices_y5KTHj_G_exports as t };
