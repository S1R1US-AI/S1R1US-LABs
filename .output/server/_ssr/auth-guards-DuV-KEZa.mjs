import { r as __exportAll } from "../_runtime.mjs";
import { t as __exportAll$1 } from "./agent-ping-BXZGzZ_N.mjs";
import { s as isSystemAdminTokenShape } from "./tenancy-HfObArW9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-guards-DuV-KEZa.js
var auth_guards_DuV_KEZa_exports = /* @__PURE__ */ __exportAll({
	a: () => renewProofFields,
	i: () => forceRefreshToken,
	n: () => OPERATOR_TOKEN_KEY,
	o: () => systemTokenOnly,
	r: () => auth_guards_exports,
	t: () => OPERATOR_ROLE_KEY
});
/**
* Pure server-side auth decisions shared by RPC handlers. No I/O here: the
* verifiers are passed in so the rules can be unit-tested without a database.
*/
var auth_guards_exports = /* @__PURE__ */ __exportAll$1({
	OPERATOR_ROLE_KEY: () => OPERATOR_ROLE_KEY,
	OPERATOR_TOKEN_KEY: () => OPERATOR_TOKEN_KEY,
	RENEW_PROOF_ERROR: () => RENEW_PROOF_ERROR,
	forceRebuildAllowed: () => forceRebuildAllowed,
	forceRefreshToken: () => forceRefreshToken,
	renewProofError: () => renewProofError,
	renewProofFields: () => renewProofFields,
	systemTokenOnly: () => systemTokenOnly
});
var MAX_TOKEN_LEN = 512;
/**
* Host-wide controls (sim, hive, tape, practice pulse, forced rebuild) accept the
* system admin token only. Copy-admin, desk-user and malformed tokens never reach
* the verifier.
*/
async function systemTokenOnly(token, verifySystem) {
	if (typeof token !== "string" || !token || token.length > MAX_TOKEN_LEN) return false;
	if (!isSystemAdminTokenShape(token) || token.includes(".u.")) return false;
	try {
		return await verifySystem(token) === true;
	} catch {
		return false;
	}
}
/** A forced tape rebuild needs the system admin token; anything else reads the cached tape. */
async function forceRebuildAllowed(input, verifySystem) {
	if (!input || input.force !== true) return false;
	return systemTokenOnly(input.token, verifySystem);
}
var YUBI_OTP_SHAPE = /^[cbdefghijklnrtuv]{44}$/;
var RENEW_PROOF_ERROR = "Enter the current admin password or tap an enrolled YubiKey.";
/**
* Renewing admin credentials from an X session also needs a second proof:
* the current admin password, or a fresh OTP from an enrolled YubiKey.
* Returns null when the proof passes, else an error string.
*/
async function renewProofError(input, liveName, deps) {
	const current = typeof input?.current === "string" ? input.current : "";
	const otp = typeof input?.otp === "string" ? input.otp.trim().toLowerCase() : "";
	try {
		if (current && current.length <= 128 && await deps.credsMatch(liveName, current) === true) return null;
	} catch {}
	try {
		if (otp && YUBI_OTP_SHAPE.test(otp) && await deps.consumeYubiOtp(otp) === null) return null;
	} catch {
		return RENEW_PROOF_ERROR;
	}
	return RENEW_PROOF_ERROR;
}
/**
* Client side of the renew proof. One input box can hold either the current
* password or a YubiKey tap. A password can look exactly like a tap, so the
* typed value is always sent as the password, and also as an OTP when it has
* the tap shape. The server tries the password first.
*/
function renewProofFields(proof) {
	const value = typeof proof === "string" ? proof : "";
	if (!value) return {};
	const tap = value.trim().toLowerCase();
	return YUBI_OTP_SHAPE.test(tap) ? {
		current: value,
		otp: tap
	} : { current: value };
}
/** Browser session keys for the operator token (shared with the operator store). */
var OPERATOR_TOKEN_KEY = "h3-op-token";
var OPERATOR_ROLE_KEY = "h3-op-role";
/**
* The system admin token for a forced tape refresh, or "" when this browser has
* no system admin session. Copy-admin and desk-user tokens are never returned.
*/
function forceRefreshToken(storage) {
	if (!storage) return "";
	try {
		if (storage.getItem("h3-op-role") !== "admin") return "";
		const token = storage.getItem("h3-op-token") ?? "";
		if (!token || token.length > MAX_TOKEN_LEN || token.includes(".u.")) return "";
		return isSystemAdminTokenShape(token) ? token : "";
	} catch {
		return "";
	}
}
//#endregion
export { renewProofFields as a, forceRefreshToken as i, OPERATOR_TOKEN_KEY as n, systemTokenOnly as o, auth_guards_DuV_KEZa_exports as r, OPERATOR_ROLE_KEY as t };
