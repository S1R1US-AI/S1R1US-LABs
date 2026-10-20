import { r as __exportAll } from "../_runtime.mjs";
import { t as __exportAll$1 } from "./agent-ping-BXZGzZ_N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tenancy-HfObArW9.js
var tenancy_HfObArW9_exports = /* @__PURE__ */ __exportAll({
	a: () => isAppAdminKind,
	c: () => tenancy_exports,
	i: () => combineCompute,
	n: () => APP_ADMIN_KIND_LABEL,
	o: () => isAppAdminToken,
	r: () => APP_ADMIN_PATH,
	s: () => isSystemAdminTokenShape,
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
	isAppAdminToken: () => isAppAdminToken,
	isSystemAdminTokenShape: () => isSystemAdminTokenShape
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
function isSystemAdminTokenShape(token) {
	if (!token || isAppAdminToken(token)) return false;
	return token.split(".").length === 3;
}
function combineCompute(phone, online) {
	const a = String(phone ?? "").trim().toUpperCase();
	const b = String(online ?? "").trim().toUpperCase();
	const yes = (s) => s === "ACCUMULATE" || s === "BUY";
	if (yes(a) && yes(b)) return "ACCUMULATE";
	return "WAIT";
}
//#endregion
export { isAppAdminKind as a, tenancy_HfObArW9_exports as c, combineCompute as i, APP_ADMIN_KIND_LABEL as n, isAppAdminToken as o, APP_ADMIN_PATH as r, isSystemAdminTokenShape as s, APP_ADMIN_KINDS as t };
