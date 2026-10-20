import { r as __exportAll } from "../_runtime.mjs";
import { t as __exportAll$1 } from "./agent-ping-BXZGzZ_N.mjs";
import { f as collectXIdentityStrings, g as normalizeXIdentity, m as isDeadCompanyHandle } from "./x-admin--2RwSK6Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/x-admin.server-BTs_6yjg.js
/**
* Server-only admin X identity (AUTH_PRESERVE).
* NEVER import from client components or any module the browser bundles.
*
* Env (DigitalOcean App Platform / local gitignored `.env` — never `VITE_`):
* - S1R1US_ADMIN_X_HANDLE — core handle WITHOUT leading `@` (`@` stripped if present)
* - S1R1US_ADMIN_X_NAME — display name
* - S1R1US_ADMIN_X_ID — X snowflake / OAuth user id for that account
*
* Fail closed: when unset, looksLikeAdminX is always false (no public fallback literals).
*/
function stripAt(raw) {
	const t = raw.trim();
	return t.startsWith("@") ? t.slice(1) : t;
}
/** Core handle without `@`. Empty when unset. */
function getAdminXHandleCore() {
	return stripAt(process.env.S1R1US_ADMIN_X_HANDLE ?? "");
}
/** `@` + core, or empty when unset. */
function getAdminXHandle() {
	const core = getAdminXHandleCore();
	return core ? `@${core}` : "";
}
function getAdminXName() {
	return (process.env.S1R1US_ADMIN_X_NAME ?? "").trim();
}
function getAdminXId() {
	return (process.env.S1R1US_ADMIN_X_ID ?? "").trim();
}
function getAdminXLabel() {
	const name = getAdminXName();
	const handle = getAdminXHandle();
	if (name && handle) return `${name} (${handle})`;
	if (handle) return handle;
	if (name) return name;
	return "system operator";
}
var ADMIN_X_PROVIDERS = [
	"grok-x",
	"twitter",
	"x"
];
function isAdminXProvider(providerId) {
	const id = (providerId ?? "").trim().toLowerCase();
	return ADMIN_X_PROVIDERS.includes(id);
}
/**
* True only for the configured system-admin X account (env):
* - snowflake S1R1US_ADMIN_X_ID
* - handle core / @core (case-insensitive)
* Display names, emails, URLs, company/dead handles — false.
*/
function looksLikeAdminX(s) {
	const core = normalizeXIdentity(s);
	if (!core) return false;
	const id = getAdminXId();
	const handle = getAdminXHandleCore().toLowerCase();
	if (!id && !handle) return false;
	if (id && core === id) return true;
	if (isDeadCompanyHandle(core)) return false;
	if (!handle) return false;
	return core.toLowerCase() === handle;
}
function profileLooksLikeAdminX(value) {
	return collectXIdentityStrings(value).some((cand) => looksLikeAdminX(cand));
}
/** Stable accountId: operator handle/snowflake when present, else a twitter id/handle, else empty. */
function preferredXAccountId(value) {
	const all = collectXIdentityStrings(value);
	const id = getAdminXId();
	const handleCore = getAdminXHandleCore();
	if (all.some((cand) => looksLikeAdminX(cand))) return all.map(normalizeXIdentity).find((c) => Boolean(id) && c === id) || handleCore;
	const snow = all.map(normalizeXIdentity).find((c) => /^\d{15,20}$/.test(c));
	if (snow) return snow;
	return all.map(normalizeXIdentity).find((c) => c.length >= 2 && c.length <= 15 && /[a-z]/i.test(c)) || "";
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/tenancy-XVYWlKJ3.js
var tenancy_XVYWlKJ3_exports = /* @__PURE__ */ __exportAll({
	a: () => isAppAdminKind,
	i: () => combineCompute,
	n: () => APP_ADMIN_KIND_LABEL,
	o: () => isAppAdminToken,
	r: () => APP_ADMIN_PATH,
	s: () => tenancy_exports,
	t: () => APP_ADMIN_KINDS
});
var tenancy_exports = /* @__PURE__ */ __exportAll$1({
	APP_ADMIN_KINDS: () => APP_ADMIN_KINDS,
	APP_ADMIN_KIND_LABEL: () => APP_ADMIN_KIND_LABEL,
	APP_ADMIN_PATH: () => APP_ADMIN_PATH,
	APP_ADMIN_ROLE: () => APP_ADMIN_ROLE,
	APP_SCOPE: () => "app",
	DESK_USER_ROLE: () => DESK_USER_ROLE,
	SYSTEM_ADMIN_PATH: () => SYSTEM_ADMIN_PATH,
	SYSTEM_ADMIN_ROLE: () => SYSTEM_ADMIN_ROLE,
	SYSTEM_SCOPE: () => SYSTEM_SCOPE,
	combineCompute: () => combineCompute,
	isAppAdminKind: () => isAppAdminKind,
	isAppAdminToken: () => isAppAdminToken
});
var APP_ADMIN_PATH = "/app/admin";
var APP_ADMIN_KINDS = [
	"x",
	"apple",
	"google",
	"claude",
	"agent",
	"iphone"
];
var APP_ADMIN_KIND_LABEL = {
	x: "X",
	apple: "Apple",
	google: "Google",
	claude: "Claude",
	agent: "AI agent",
	iphone: "iPhone"
};
function isAppAdminKind(raw) {
	return APP_ADMIN_KINDS.includes(raw);
}
/** Copy-admin tokens are 4-part `app.{exp}.{id}.{hmac}`. Never a 3-part system HMAC. */
function isAppAdminToken(token) {
	if (!token) return false;
	const parts = token.split(".");
	return parts.length === 4 && parts[0] === "app";
}
function combineCompute(phone, online) {
	const a = String(phone ?? "").trim().toUpperCase();
	const b = String(online ?? "").trim().toUpperCase();
	const yes = (s) => s === "ACCUMULATE" || s === "BUY";
	if (yes(a) && yes(b)) return "ACCUMULATE";
	return "WAIT";
}
//#endregion
export { isAppAdminKind as a, getAdminXHandle as c, looksLikeAdminX as d, preferredXAccountId as f, combineCompute as i, getAdminXLabel as l, APP_ADMIN_KIND_LABEL as n, isAppAdminToken as o, profileLooksLikeAdminX as p, APP_ADMIN_PATH as r, tenancy_XVYWlKJ3_exports as s, APP_ADMIN_KINDS as t, isAdminXProvider as u };
