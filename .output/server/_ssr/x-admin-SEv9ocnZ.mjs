//#region node_modules/.nitro/vite/services/ssr/assets/x-admin-SEv9ocnZ.js
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
*/
var DEAD_COMPANY_HANDLES = /* @__PURE__ */ new Set(["s1r1us", "_s1r1us_"]);
var COMPANY_X_LABEL = "company X";
var COMPANY_X_BIO = "Company desk of S1R1US Labs · [ S1R1U$ <<L@B$>> ] bitcoin accumulator · not financial advice";
/** Square 400×400 laser-ape — desk mark / future X profile pic. */
var COMPANY_X_AVATAR = "/s1r1us-avatar.jpg";
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
	return false;
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
/** Live company handle only. Blocked @S1R1US / @_S1R1US_ never match. Never admin. */
function looksLikeCompanyX(s) {
	if (!companyHandleSet()) return false;
	const core = handleCore(s);
	if (!core || isDeadCompanyHandle(core)) return false;
	if (looksLikeAdminX(core)) return false;
	return core === "".toLowerCase();
}
//#endregion
export { COMPANY_X_BANNER as a, companyHandleSet as c, looksLikeCompanyX as d, COMPANY_X_AVATAR as i, isAdminXProvider as l, ADMIN_X_LABEL as n, COMPANY_X_BIO as o, COMPANY_X_ART as r, COMPANY_X_LABEL as s, ADMIN_X_HANDLE as t, looksLikeAdminX as u };
