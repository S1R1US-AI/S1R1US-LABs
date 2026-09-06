import { r as __exportAll } from "../_runtime.mjs";
import { t as __exportAll$1 } from "./agent-ping-BXZGzZ_N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/x-admin-CALKyy-K.js
/** Canonical admin X account. Login matches this handle or its snowflake — nothing else. */
var ADMIN_X_NAME = "Mr. R0b0t0";
var ADMIN_X_HANDLE = "@_Mr_R0b0t0_";
var ADMIN_X_HANDLE_CORE = "_Mr_R0b0t0_";
var ADMIN_X_LABEL = `${ADMIN_X_NAME} (${ADMIN_X_HANDLE})`;
/** Only these Better Auth / broker provider ids count as X for admin. */
var ADMIN_X_PROVIDERS = [
	"grok-x",
	"twitter",
	"x"
];
/**
* Handles that must never be company X.
* @S1R1US — blocked for breaking rules.
* @_S1R1US_ — operator rejected.
* @S1R1S_AI — accidental; not the official desk.
*/
var DEAD_COMPANY_HANDLES = /* @__PURE__ */ new Set([
	"s1r1us",
	"_s1r1us_",
	"s1r1s_ai"
]);
/**
* Brand / company account — sub of the operator. Never admin.
* Official: @S1R1US_AI (https://x.com/S1R1US_AI).
* Do not wire blocked @S1R1US / @_S1R1US_ or accidental @S1R1S_AI.
*/
var COMPANY_X_NAME = "S1R1US AI";
var COMPANY_X_HANDLE = "@S1R1US_AI";
var COMPANY_X_HANDLE_CORE = "S1R1US_AI";
var COMPANY_X_URL = "https://x.com/S1R1US_AI";
var COMPANY_X_LABEL = `${COMPANY_X_NAME} (${COMPANY_X_HANDLE})`;
var COMPANY_X_BIO = "Company desk of S1R1US Labs · [ S1R1U$ <<L@B$>> ] · education only · not financial advice · not an offer of securities";
/** Square S1R!US Godzilla Logo — site mark and X profile (400×400 at s1r1us-avatar.jpg). */
var COMPANY_X_AVATAR = "/s1r1us-godzilla-logo.jpg";
var COMPANY_X_AVATAR_X400 = "/s1r1us-avatar.jpg";
var COMPANY_X_LOGO_NAME = "S1R!US Godzilla Logo";
var COMPANY_X_LOGO_FILE = "/S1R!US-Godzilla-Logo.jpg";
/** 1500×500 G0DZ1LLa vs bear header. */
var COMPANY_X_BANNER = "/s1r1us-x-banner.jpg";
/** Full G0DZ1LLa vs bear frame. */
var COMPANY_X_ART = "/s1r1us-x-art.png";
var HANDLE = ADMIN_X_HANDLE_CORE.toLowerCase();
function handleCore(s) {
	const raw = (s ?? "").trim();
	if (!raw) return "";
	const core = (raw.startsWith("@") ? raw.slice(1) : raw).toLowerCase();
	if (!core || /[*?/\s]/.test(core) || core.includes("@")) return "";
	return core;
}
function isDeadCompanyHandle(s) {
	const core = handleCore(s);
	return core.length > 0 && DEAD_COMPANY_HANDLES.has(core);
}
function companyHandleSet() {
	return !isDeadCompanyHandle(COMPANY_X_HANDLE_CORE);
}
function isAdminXProvider(providerId) {
	const id = (providerId ?? "").trim().toLowerCase();
	return ADMIN_X_PROVIDERS.includes(id);
}
/**
* Strip twitter:/x:/grok-x: prefixes and a single leading @.
* Reject emails, URLs, markdown, extra @, display names.
*/
function normalizeXIdentity(s) {
	let raw = (s ?? "").trim();
	if (!raw) return "";
	raw = raw.replace(/^(twitter|x|grok-x)[:|/]/i, "");
	if (raw.startsWith("@")) raw = raw.slice(1);
	if (!raw || raw.includes("@") || /[*?/\s.]/.test(raw)) return "";
	return raw;
}
/**
* True only for the live @_Mr_R0b0t0_ account:
* - snowflake 2093335535146131456 (OAuth sub of that same account)
* - handle @_Mr_R0b0t0_ or _Mr_R0b0t0_ (one leading @, case-insensitive)
* Display name "Mr. R0b0t0", emails, URLs, extra @, company/dead handles — all false.
*/
function looksLikeAdminX(s) {
	const core = normalizeXIdentity(s);
	if (!core) return false;
	if (core === "2093335535146131456") return true;
	if (isDeadCompanyHandle(core)) return false;
	return core.toLowerCase() === HANDLE;
}
var PROFILE_ID_KEYS = /* @__PURE__ */ new Set([
	"id",
	"sub",
	"user_id",
	"userid",
	"preferred_username",
	"nickname",
	"username",
	"screen_name",
	"screenname",
	"twitter_id",
	"twitterid",
	"x_user_id",
	"xuserid",
	"email"
]);
function pushIdentity(out, raw) {
	if (typeof raw === "number" && Number.isFinite(raw)) {
		out.push(String(raw));
		return;
	}
	if (typeof raw !== "string") return;
	const s = raw.trim();
	if (!s || s.length > 320) return;
	out.push(s);
	const local = /^([^@\s]+)@[^@\s]+$/.exec(s);
	if (local?.[1]) out.push(local[1]);
}
/** Pull handle / snowflake / email-local candidates from broker userinfo or an id_token. */
function collectXIdentityStrings(value, depth = 0) {
	const out = [];
	if (depth > 4 || value == null) return out;
	if (typeof value === "string" || typeof value === "number") {
		pushIdentity(out, value);
		return out;
	}
	if (Array.isArray(value)) {
		for (const item of value) out.push(...collectXIdentityStrings(item, depth + 1));
		return out;
	}
	if (typeof value !== "object") return out;
	for (const [k, v] of Object.entries(value)) {
		const compact = k.replace(/[-_]/g, "").toLowerCase();
		if (PROFILE_ID_KEYS.has(k.toLowerCase()) || PROFILE_ID_KEYS.has(compact)) {
			out.push(...collectXIdentityStrings(v, depth + 1));
			continue;
		}
		if (v && (Array.isArray(v) || typeof v === "object") && /identit|account|twitter|provider/i.test(k)) out.push(...collectXIdentityStrings(v, depth + 1));
	}
	return out;
}
function profileLooksLikeAdminX(value) {
	return collectXIdentityStrings(value).some((s) => looksLikeAdminX(s));
}
/** Stable accountId: operator handle/snowflake when present, else a twitter id/handle, else empty. */
function preferredXAccountId(value) {
	const all = collectXIdentityStrings(value);
	if (all.some((s) => looksLikeAdminX(s))) return all.map(normalizeXIdentity).find((c) => c === "2093335535146131456") || "_Mr_R0b0t0_";
	const snow = all.map(normalizeXIdentity).find((c) => /^\d{15,20}$/.test(c));
	if (snow) return snow;
	return all.map(normalizeXIdentity).find((c) => c.length >= 2 && c.length <= 15 && /[a-z]/i.test(c)) || "";
}
/** Live official company handle @S1R1US_AI only. Blocked @S1R1US / @_S1R1US_ and accidental @S1R1S_AI never match. Never admin. */
function looksLikeCompanyX(s) {
	if (!companyHandleSet()) return false;
	const core = handleCore(s);
	if (!core || isDeadCompanyHandle(core)) return false;
	if (looksLikeAdminX(core)) return false;
	return core === COMPANY_X_HANDLE_CORE.toLowerCase();
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
export { looksLikeAdminX as C, profileLooksLikeAdminX as E, isAdminXProvider as S, preferredXAccountId as T, COMPANY_X_LOGO_FILE as _, isAppAdminKind as a, COMPANY_X_URL as b, ADMIN_X_HANDLE as c, COMPANY_X_AVATAR as d, COMPANY_X_AVATAR_X400 as f, COMPANY_X_LABEL as g, COMPANY_X_HANDLE as h, combineCompute as i, ADMIN_X_LABEL as l, COMPANY_X_BIO as m, APP_ADMIN_KIND_LABEL as n, isAppAdminToken as o, COMPANY_X_BANNER as p, APP_ADMIN_PATH as r, tenancy_XVYWlKJ3_exports as s, APP_ADMIN_KINDS as t, COMPANY_X_ART as u, COMPANY_X_LOGO_NAME as v, looksLikeCompanyX as w, companyHandleSet as x, COMPANY_X_NAME as y };
