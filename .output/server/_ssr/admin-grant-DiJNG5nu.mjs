import { o as systemTokenOnly } from "./auth-guards-DuV-KEZa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-grant-DiJNG5nu.js
/**
* Pure rule for the admin page-code cookie: only a verified system-admin token earns it.
* The verifier is passed in (the server uses the forwarded sign-in session), so the rule
* can be tested without a database.
*/
async function grantAdminAssetCookie(token, deps) {
	if (await systemTokenOnly(token, deps.verify)) {
		await deps.setCookie(token);
		return true;
	}
	await deps.clearCookie();
	return false;
}
//#endregion
export { grantAdminAssetCookie };
