import { C as looksLikeAdminX, a as isAppAdminKind, r as APP_ADMIN_PATH, t as APP_ADMIN_KINDS, w as looksLikeCompanyX } from "./tenancy-XVYWlKJ3.mjs";
import { o as inspectAgentInput } from "./agent-security-j9HmdOss.mjs";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-admin-C3sCKi8X.js
/** Server-only tenants for the iOS / Google copy-admin. Not system admin. */
var PATHS = ["/tmp/app-admins.json", "/workspace/data/app-admins.json"];
var MAX = 400;
var TTL_MS = 432e5;
var PEPPER = "s1r1us-app-admin-v1";
function load() {
	if (typeof window !== "undefined") return { rows: [] };
	for (const p of PATHS) try {
		const raw = JSON.parse(readFileSync(p, "utf8"));
		if (Array.isArray(raw?.rows)) return { rows: raw.rows.slice(0, MAX) };
	} catch {}
	return { rows: [] };
}
function save(s) {
	if (typeof window !== "undefined") return;
	const body = JSON.stringify(s);
	for (const p of PATHS) try {
		if (p.startsWith("/workspace/data")) mkdirSync("/workspace/data", { recursive: true });
		writeFileSync(p, body);
	} catch {}
}
function cleanHandle(raw) {
	return String(raw ?? "").trim().replace(/^@/, "").slice(0, 32);
}
function sign(payload) {
	return createHmac("sha256", PEPPER).update(payload).digest("hex");
}
function signAppAdminToken(id) {
	const exp = Date.now() + TTL_MS;
	return `app.${exp}.${id}.${sign(`app-admin.${exp}.${id}`)}`;
}
function verifyAppAdminToken(token) {
	if (!token) return null;
	const parts = token.split(".");
	if (parts.length !== 4 || parts[0] !== "app") return null;
	const exp = Number(parts[1]);
	const id = parts[2] ?? "";
	const sig = parts[3] ?? "";
	if (!Number.isFinite(exp) || Date.now() > exp || !id.startsWith("aa-")) return null;
	const expect = sign(`app-admin.${exp}.${id}`);
	try {
		if (!timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expect, "hex"))) return null;
	} catch {
		return null;
	}
	const row = load().rows.find((r) => r.id === id);
	return row ? { id: row.id } : null;
}
function peekAppAdmin(id) {
	return load().rows.find((r) => r.id === id) ?? null;
}
function claimAppAdmin(input) {
	if (input.mandate !== true) return {
		ok: false,
		error: "Read the mandate first. POST mandate:true. Accumulate bitcoin. Never sell. Never short."
	};
	const kindRaw = String(input.kind ?? "iphone").toLowerCase();
	if (!isAppAdminKind(kindRaw)) return {
		ok: false,
		error: `kind must be one of ${APP_ADMIN_KINDS.join(", ")}.`
	};
	const handle = cleanHandle(input.handle || input.xHandle || "");
	if (handle.length < 2) return {
		ok: false,
		error: "Need a short name or handle for this copy."
	};
	if (looksLikeAdminX(handle) || looksLikeCompanyX(handle)) return {
		ok: false,
		error: "System admin and company X use /admin. This copy is for the iOS / Google download user."
	};
	if (inspectAgentInput(handle).block || inspectAgentInput(String(input.label ?? "")).block) return {
		ok: false,
		error: "blocked"
	};
	const s = load();
	const existing = s.rows.find((r) => r.kind === kindRaw && r.handle.toLowerCase() === handle.toLowerCase());
	if (existing) return {
		ok: true,
		token: signAppAdminToken(existing.id),
		you: existing
	};
	const row = {
		id: `aa-${Date.now().toString(36)}-${randomBytes(4).toString("hex")}`,
		at: (/* @__PURE__ */ new Date()).toISOString(),
		kind: kindRaw,
		handle,
		label: String(input.label ?? handle).trim().slice(0, 40) || handle
	};
	s.rows = [row, ...s.rows].slice(0, MAX);
	save(s);
	return {
		ok: true,
		token: signAppAdminToken(row.id),
		you: row
	};
}
var APP_ADMIN_PUBLIC = {
	path: APP_ADMIN_PATH,
	trade: false,
	ordersCreate: false,
	hostAdmin: false,
	note: "This token opens the download-copy Admin only. It cannot open s1r1us.ai /admin, Yubi, vault, hunter, or live Coinbase."
};
//#endregion
export { APP_ADMIN_PUBLIC, claimAppAdmin, peekAppAdmin, verifyAppAdminToken };
