//#region ../../workspace/node_modules/.nitro/vite/services/ssr/assets/webauthn-client-wWVK9Jpi.js
/** Browser-only WebAuthn helpers. Never import from a server module. */
function webauthnAvailable() {
	return typeof window !== "undefined" && typeof window.PublicKeyCredential === "function" && typeof navigator.credentials?.create === "function" && typeof navigator.credentials?.get === "function";
}
function clientOrigin() {
	return typeof window !== "undefined" ? window.location.origin : "";
}
function bufToB64url(buf) {
	const bytes = buf instanceof ArrayBuffer ? new Uint8Array(buf) : new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
	let s = "";
	for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
	return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function b64urlToBuf(s) {
	const b64 = (s + "=".repeat((4 - s.length % 4) % 4)).replace(/-/g, "+").replace(/_/g, "/");
	const bin = atob(b64);
	const out = new Uint8Array(bin.length);
	for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
	return out.buffer;
}
function toCreateOptions(o) {
	return {
		challenge: b64urlToBuf(o.challenge),
		rp: o.rp,
		user: {
			id: b64urlToBuf(o.user.id),
			name: o.user.name,
			displayName: o.user.displayName
		},
		pubKeyCredParams: o.pubKeyCredParams,
		authenticatorSelection: o.authenticatorSelection,
		attestation: o.attestation ?? "none",
		timeout: o.timeout,
		excludeCredentials: (o.excludeCredentials ?? []).map((c) => ({
			type: "public-key",
			id: b64urlToBuf(c.id),
			transports: c.transports
		}))
	};
}
function toRequestOptions(o) {
	return {
		challenge: b64urlToBuf(o.challenge),
		rpId: o.rpId,
		timeout: o.timeout,
		userVerification: o.userVerification ?? "required",
		allowCredentials: (o.allowCredentials ?? []).map((c) => ({
			type: "public-key",
			id: b64urlToBuf(c.id),
			transports: c.transports
		}))
	};
}
async function createYubiCredential(options) {
	if (!webauthnAvailable()) throw new Error("This browser does not support WebAuthn. Use Yubico OTP instead.");
	const PK = PublicKeyCredential;
	const parsed = PK.parseCreationOptionsFromJSON ? PK.parseCreationOptionsFromJSON(options) : toCreateOptions(options);
	const cred = await navigator.credentials.create({ publicKey: parsed });
	if (!cred) throw new Error("YubiKey did not complete registration. Touch the gold disc.");
	const att = cred.response;
	const pk = typeof att.getPublicKey === "function" ? att.getPublicKey() : null;
	if (!pk) throw new Error("Authenticator did not return a public key. Use a current browser and a YubiKey 5 / Security Key.");
	const transports = typeof att.getTransports === "function" ? att.getTransports() : ["usb"];
	const alg = typeof att.getPublicKeyAlgorithm === "function" ? att.getPublicKeyAlgorithm() : -7;
	return {
		credentialId: bufToB64url(cred.rawId),
		publicKey: bufToB64url(pk),
		alg,
		clientDataJSON: bufToB64url(att.clientDataJSON),
		transports: transports.length ? transports : ["usb"],
		challenge: options.challenge
	};
}
async function getYubiAssertion(options) {
	if (!webauthnAvailable()) throw new Error("This browser does not support WebAuthn. Use Yubico OTP instead.");
	const PK = PublicKeyCredential;
	const parsed = PK.parseRequestOptionsFromJSON ? PK.parseRequestOptionsFromJSON(options) : toRequestOptions(options);
	const cred = await navigator.credentials.get({ publicKey: parsed });
	if (!cred) throw new Error("YubiKey did not complete authentication. Touch the gold disc.");
	const asrt = cred.response;
	return {
		credentialId: bufToB64url(cred.rawId),
		authenticatorData: bufToB64url(asrt.authenticatorData),
		clientDataJSON: bufToB64url(asrt.clientDataJSON),
		signature: bufToB64url(asrt.signature),
		challenge: options.challenge
	};
}
//#endregion
export { clientOrigin, createYubiCredential, getYubiAssertion, webauthnAvailable };
