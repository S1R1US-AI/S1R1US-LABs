import { o as systemTokenOnly } from "./auth-guards-DuV-KEZa.mjs";
import { k as verifyAccessToken } from "./access.server-CF7ff_ig.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-gate.server-BhKp4MMm.js
/**
* Admin-only page code is moved out of the public folder at build time and
* served only to a signed-in system admin. Pure helpers (no I/O) so tests can
* exercise every request shape.
*/
/** Cookie that lets the browser load admin page code. HttpOnly; asset path only. */
var ADMIN_ASSET_COOKIE = "s1r1_adm";
var ADMIN_ASSET_COOKIE_PATH = "/assets/";
var ADMIN_ASSET_HEADERS = {
	"cache-control": "private, no-store",
	vary: "Cookie",
	"x-content-type-options": "nosniff"
};
/**
* Normalize a request path however the request spells it: percent-encoding
* (including %2F and %5C), backslashes, repeated slashes, case, query, and a
* trailing `.map`. Returns the bare lower-case asset file name, or null when
* the path is not under /assets/.
*/
function assetNameOf(rawPath) {
	let p = rawPath.split("?", 1)[0].split("#", 1)[0];
	for (let i = 0; i < 3; i++) try {
		const next = decodeURIComponent(p);
		if (next === p) break;
		p = next;
	} catch {
		break;
	}
	p = p.replace(/\\/g, "/").replace(/\/{2,}/g, "/").toLowerCase();
	const m = /^\/?assets\/(.+)$/.exec(p);
	if (!m) return null;
	const name = m[1].split("/").pop() ?? "";
	return name ? name.replace(/\.map$/, "") : null;
}
/**
* Decide the answer for a request that reached the gate. Source maps never ship.
* Exact gated name + admin session → serve. Everything else → 404.
*/
function adminAssetDecision(rawPath, gated, isAdmin) {
	const name = assetNameOf(rawPath);
	if (!name || !gated.has(name)) return {
		serve: null,
		status: 404
	};
	const exact = rawPath.split("?", 1)[0];
	if (/\.map$/i.test(exact)) return {
		serve: null,
		status: 404
	};
	if (!isAdmin) return {
		serve: null,
		status: 404
	};
	return {
		serve: name,
		status: 200
	};
}
/** Read one cookie value from a Cookie header. */
function cookieValue(header, name) {
	if (!header) return void 0;
	for (const part of header.split(";")) {
		const i = part.indexOf("=");
		if (i < 0) continue;
		if (part.slice(0, i).trim() === name) try {
			return decodeURIComponent(part.slice(i + 1).trim());
		} catch {
			return;
		}
	}
}
/**
* Server-only admin check for admin-only data. Reuses verifyAccessToken (the
* same check every admin server function uses). On failure the response is
* 401 with no data; every answer is marked private, no-store.
*/
var PRIVATE_NO_STORE = "private, no-store";
async function isAdminToken(token) {
	return systemTokenOnly(token, verifyAccessToken);
}
/** Server function guard: true for a signed-in system admin, else sets 401. */
async function requireAdminData(token) {
	const ok = await isAdminToken(token);
	try {
		const { setResponseHeader, setResponseStatus } = await import("./server-DzHNyCdz.mjs").then((n) => n.t);
		setResponseHeader("cache-control", PRIVATE_NO_STORE);
		if (!ok) setResponseStatus(401);
	} catch {}
	return ok;
}
/** Set the HttpOnly cookie that lets this browser load admin page code. Caller has verified the token. */
async function setAdminAssetCookie(token) {
	const { getRequestHeader, setCookie } = await import("./server-DzHNyCdz.mjs").then((n) => n.t);
	const exp = Number(token.split(".")[0]);
	const maxAge = Number.isFinite(exp) ? Math.max(60, Math.floor((exp - Date.now()) / 1e3)) : 3600;
	setCookie(ADMIN_ASSET_COOKIE, token, {
		httpOnly: true,
		sameSite: "strict",
		secure: (getRequestHeader("x-forwarded-proto") ?? "").split(",")[0]?.trim() === "https",
		path: ADMIN_ASSET_COOKIE_PATH,
		maxAge
	});
}
async function clearAdminAssetCookie() {
	const { deleteCookie, setResponseHeader } = await import("./server-DzHNyCdz.mjs").then((n) => n.t);
	deleteCookie(ADMIN_ASSET_COOKIE, { path: ADMIN_ASSET_COOKIE_PATH });
	setResponseHeader("cache-control", PRIVATE_NO_STORE);
}
//#endregion
export { clearAdminAssetCookie, cookieValue as i, isAdminToken, ADMIN_ASSET_HEADERS as n, adminAssetDecision as r, requireAdminData, setAdminAssetCookie, ADMIN_ASSET_COOKIE as t };
