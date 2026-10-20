import { f as collectXIdentityStrings, g as normalizeXIdentity, m as isDeadCompanyHandle } from "./x-admin-BTG79yoD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/x-admin.server-C-k2BSyu.js
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
/** Claims from a server-stored OAuth id_token. */
function idTokenClaimsAreAdmin(token) {
	if (!token || token.split(".").length < 2) return false;
	try {
		const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8"));
		if (profileLooksLikeAdminX(payload)) return true;
		if (payload && typeof payload === "object" && !Array.isArray(payload)) {
			const rec = payload;
			return [
				rec.sub,
				rec.user_id,
				rec.preferred_username,
				rec.username,
				rec.nickname
			].some((v) => typeof v === "string" && looksLikeAdminX(v));
		}
		return false;
	} catch {
		return false;
	}
}
/** Admin identity from server-stored OAuth account rows (provider accountId or id_token claims). */
function accountRowsAreAdminX(rows) {
	for (const a of rows) {
		if (!isAdminXProvider(a.providerId)) continue;
		if (looksLikeAdminX(a.accountId)) return true;
		if (idTokenClaimsAreAdmin(a.idToken)) return true;
	}
	return false;
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
export { preferredXAccountId as a, looksLikeAdminX as i, getAdminXHandle as n, getAdminXLabel as r, accountRowsAreAdminX as t };
