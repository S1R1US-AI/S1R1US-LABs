//#region node_modules/.nitro/vite/services/ssr/assets/secret-check-Cy3_fFqY.js
/** Secret detection shared by public forms. Kept separate so public pages do not load the admin security module. */
var SECRET_RE = /"privateKey"\s*:|BEGIN (EC |OPENSSH )?PRIVATE KEY|"organizations\/|"apiSecret"\s*:|cdp[_-]?api[_-]?key/i;
var XPRV_RE = /\b([xyz]prv|tprv)[a-zA-Z0-9]{20,}/;
var WIF_RE = /\b[5KL][1-9A-HJ-NP-Za-km-z]{50,52}\b/;
var HEX_KEY_RE = /\b[0-9a-fA-F]{64}\b/;
function looksLikeCdpSecret(text) {
	if (!text || text.length < 20) return false;
	return SECRET_RE.test(text);
}
function looksLikeWalletSecret(text) {
	if (!text) return false;
	const trimmed = text.trim();
	if (XPRV_RE.test(trimmed) || WIF_RE.test(trimmed)) return true;
	if (HEX_KEY_RE.test(trimmed) && !/\s/.test(trimmed) && trimmed.length === 64) return true;
	const words = trimmed.toLowerCase().split(/\s+/);
	if ([
		12,
		15,
		18,
		21,
		24
	].includes(words.length) && words.every((w) => /^[a-z]{3,8}$/.test(w))) return true;
	return false;
}
function looksLikeSecret(text) {
	return looksLikeCdpSecret(text) || looksLikeWalletSecret(text);
}
//#endregion
export { looksLikeSecret as t };
