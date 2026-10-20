import { s as isSystemAdminTokenShape } from "./tenancy-HfObArW9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-guards-DoZWhoEP.js
/**
* Pure server-side auth decisions shared by RPC handlers. No I/O here: the
* verifiers are passed in so the rules can be unit-tested without a database.
*/
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
		if (otp && YUBI_OTP_SHAPE.test(otp) && await deps.consumeYubiOtp(otp) === null) return null;
	} catch {
		return RENEW_PROOF_ERROR;
	}
	return RENEW_PROOF_ERROR;
}
//#endregion
export { forceRebuildAllowed, renewProofError, systemTokenOnly };
