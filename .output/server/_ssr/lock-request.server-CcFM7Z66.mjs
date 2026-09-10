import { a as LOCK_IDS } from "./lock-status-C5D-dhGx.mjs";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
//#region node_modules/.nitro/vite/services/ssr/assets/lock-request.server-CcFM7Z66.js
/** Phone-admin lock change tickets. System admin applies. Never execute from app-admin. */
var PHONE_REQUEST_OK = [
	"agents",
	"hive",
	"pred"
];
var PATH = "/tmp/lock-tickets.json";
function load() {
	try {
		const raw = JSON.parse(readFileSync(PATH, "utf8"));
		return Array.isArray(raw) ? raw : [];
	} catch {
		return [];
	}
}
function save(rows) {
	try {
		writeFileSync(PATH, JSON.stringify(rows.slice(-50), null, 2));
	} catch {
		try {
			mkdirSync("/tmp", { recursive: true });
			writeFileSync(PATH, JSON.stringify(rows.slice(-50), null, 2));
		} catch {}
	}
}
function listLockTickets() {
	return load();
}
function fileLockTicket(ids, locked, note) {
	const clean = ids.filter((id) => LOCK_IDS.includes(id) && PHONE_REQUEST_OK.includes(id));
	if (!clean.length) return { error: "No requestable rails (agents, hive, pred only). Live-intent locks stay system admin." };
	const row = {
		id: `t-${Date.now()}`,
		at: (/* @__PURE__ */ new Date()).toISOString(),
		by: "app-admin",
		ids: clean,
		locked: Boolean(locked),
		note: String(note || "").slice(0, 240),
		status: "open"
	};
	const rows = load();
	rows.push(row);
	save(rows);
	return row;
}
//#endregion
export { fileLockTicket, listLockTickets };
