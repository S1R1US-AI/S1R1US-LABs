import { r as getSql } from "./db-CnQahlAD.mjs";
import { createHash, createPublicKey, randomBytes, verify } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/webauthn.server-DPjCYsym.js
/**
* Yubico-aligned WebAuthn / FIDO2 for the admin panel.
* Official: https://www.yubico.com/  https://developers.yubico.com/WebAuthn/
*
* Hardware-bound (cross-platform) keys. User verification required on register
* and unlock (Yubico FIDO2 MFA checklist). Attestation none — we already bind
* Yubico OTP via YubiCloud. Sign-count clone detection. Never import from a
* client page.
*/
var CHALLENGES = /* @__PURE__ */ new Map();
var CHALLENGE_MS = 12e4;
function b64url(buf) {
	return Buffer.from(buf).toString("base64url");
}
function unb64url(s) {
	return Buffer.from(s, "base64url");
}
function originAllowed(origin, requestHost) {
	try {
		const u = new URL(origin);
		if (u.protocol !== "https:" && u.protocol !== "http:") return false;
		const host = u.hostname.toLowerCase();
		if (host === "s1r1us.ai" || host === "www.s1r1us.ai") return u.protocol === "https:";
		if (host === "localhost" || host === "127.0.0.1") return true;
		const reqHost = (requestHost ?? "").split(",")[0]?.split(":")[0]?.trim().toLowerCase() ?? "";
		if (reqHost && host === reqHost) {
			if (u.protocol === "https:") return true;
			if (host === "localhost" || host === "127.0.0.1") return true;
		}
		return false;
	} catch {
		return false;
	}
}
function rpIdOf(origin) {
	try {
		const host = new URL(origin).hostname.toLowerCase();
		if (host === "www.s1r1us.ai") return "s1r1us.ai";
		if (host === "s1r1us.ai") return "s1r1us.ai";
		return host;
	} catch {
		return "s1r1us.ai";
	}
}
async function requestHost() {
	try {
		const { getRequest } = await import("./server-Mq7o1Nh0.mjs").then((n) => n.t);
		const req = getRequest();
		return (req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "").split(",")[0]?.trim() ?? "";
	} catch {
		return "";
	}
}
function pruneChallenges() {
	const now = Date.now();
	for (const [k, v] of CHALLENGES) if (now - v.at > CHALLENGE_MS) CHALLENGES.delete(k);
}
function issueWebauthnChallenge(type, origin) {
	pruneChallenges();
	const rpId = rpIdOf(origin);
	const id = b64url(randomBytes(32));
	CHALLENGES.set(id, {
		at: Date.now(),
		type,
		origin,
		rpId
	});
	return {
		challenge: id,
		rpId,
		rpName: "S1R1US Labs"
	};
}
function takeChallenge(id, type, origin) {
	pruneChallenges();
	const row = CHALLENGES.get(id);
	if (!row || row.type !== type) return null;
	if (row.origin !== origin) return null;
	CHALLENGES.delete(id);
	return row;
}
async function webauthnRows() {
	try {
		return await (await getSql())`
      select id, credential_id, public_key, alg, sign_count, transports
      from admin_webauthn order by enrolled_at asc
    `;
	} catch {
		return [];
	}
}
async function webauthnCount() {
	return (await webauthnRows()).length;
}
function maskCredId(id) {
	if (id.length < 10) return id;
	return `${id.slice(0, 6)}…${id.slice(-4)}`;
}
async function saveWebauthn(input) {
	const sql = await getSql();
	const id = `fido-${Date.now().toString(36)}`;
	await sql`
    insert into admin_webauthn (id, credential_id, public_key, alg, sign_count, transports, enrolled_at)
    values (
      ${id},
      ${input.credentialId},
      ${input.publicKey},
      ${input.alg},
      0,
      ${input.transports.join(",")},
      now()
    )
  `;
	return id;
}
async function bumpSignCount(credentialId, next) {
	await (await getSql())`update admin_webauthn set sign_count = ${next} where credential_id = ${credentialId}`;
}
async function clearWebauthn(credentialId) {
	try {
		const sql = await getSql();
		if (credentialId) {
			await sql`delete from admin_webauthn where id = ${credentialId} or credential_id = ${credentialId}`;
			return;
		}
		await sql`delete from admin_webauthn`;
	} catch {}
}
async function registrationOptions(origin, host) {
	if (!originAllowed(origin, host)) return {
		ok: false,
		error: "Origin not allowed for WebAuthn."
	};
	const ch = issueWebauthnChallenge("reg", origin);
	const existing = await webauthnRows();
	return {
		ok: true,
		options: {
			challenge: ch.challenge,
			rp: {
				id: ch.rpId,
				name: ch.rpName
			},
			user: {
				id: b64url(Buffer.from("s1r1us-admin")),
				name: "admin",
				displayName: "S1R1US operator"
			},
			pubKeyCredParams: [{
				type: "public-key",
				alg: -7
			}, {
				type: "public-key",
				alg: -257
			}],
			authenticatorSelection: {
				authenticatorAttachment: "cross-platform",
				residentKey: "preferred",
				requireResidentKey: false,
				userVerification: "required"
			},
			attestation: "none",
			timeout: 6e4,
			excludeCredentials: existing.map((r) => ({
				type: "public-key",
				id: r.credential_id,
				transports: r.transports ? r.transports.split(",").filter(Boolean) : ["usb", "nfc"]
			})),
			hints: ["security-key"]
		}
	};
}
async function authenticationOptions(origin, host) {
	if (!originAllowed(origin, host)) return {
		ok: false,
		error: "Origin not allowed for WebAuthn."
	};
	const rows = await webauthnRows();
	if (!rows.length) return {
		ok: false,
		error: "No FIDO2 YubiKey enrolled. Enroll in Admin → Wallet or tap Yubico OTP."
	};
	const ch = issueWebauthnChallenge("auth", origin);
	return {
		ok: true,
		options: {
			challenge: ch.challenge,
			rpId: ch.rpId,
			timeout: 6e4,
			userVerification: "required",
			allowCredentials: rows.map((r) => ({
				type: "public-key",
				id: r.credential_id,
				transports: r.transports ? r.transports.split(",").filter(Boolean) : ["usb", "nfc"]
			})),
			hints: ["security-key"]
		}
	};
}
function parseClientData(jsonB64, expectType, origin, challenge) {
	const raw = unb64url(jsonB64).toString("utf8");
	const data = JSON.parse(raw);
	if (data.type !== expectType) return "Wrong WebAuthn ceremony.";
	if (data.origin !== origin) return "WebAuthn origin mismatch.";
	if (data.challenge !== challenge) return "WebAuthn challenge mismatch.";
	return null;
}
function parseAuthData(b64) {
	const buf = unb64url(b64);
	if (buf.length < 37) return null;
	const flags = buf[32];
	return {
		rpIdHash: buf.subarray(0, 32),
		flags,
		signCount: buf.readUInt32BE(33),
		up: Boolean(flags & 1),
		uv: Boolean(flags & 4)
	};
}
function verifySig(alg, spkiB64, data, sigB64) {
	const key = createPublicKey({
		key: unb64url(spkiB64),
		format: "der",
		type: "spki"
	});
	const sig = unb64url(sigB64);
	if (alg === -7) return verify("SHA256", data, key, sig);
	if (alg === -257) return verify("SHA256", data, key, sig);
	return false;
}
async function finishRegistration(input) {
	if (!takeChallenge(input.challenge, "reg", input.origin)) return {
		ok: false,
		error: "WebAuthn registration challenge expired. Try again."
	};
	const bad = parseClientData(input.clientDataJSON, "webauthn.create", input.origin, input.challenge);
	if (bad) return {
		ok: false,
		error: bad
	};
	if (!input.credentialId || !input.publicKey) return {
		ok: false,
		error: "Authenticator did not return a public key. Use a current browser and a YubiKey 5 / Security Key."
	};
	try {
		createPublicKey({
			key: unb64url(input.publicKey),
			format: "der",
			type: "spki"
		});
	} catch {
		return {
			ok: false,
			error: "Public key from the YubiKey could not be parsed."
		};
	}
	const existing = await webauthnRows();
	if (existing.some((r) => r.credential_id === input.credentialId)) return {
		ok: false,
		error: "That YubiKey FIDO2 credential is already enrolled."
	};
	if (existing.length >= 4) return {
		ok: false,
		error: "FIDO2 slots full (4). Remove a key before adding another."
	};
	return {
		ok: true,
		id: await saveWebauthn({
			credentialId: input.credentialId,
			publicKey: input.publicKey,
			alg: input.alg || -7,
			transports: input.transports.length ? input.transports : ["usb", "nfc"]
		}),
		credentialId: maskCredId(input.credentialId),
		count: existing.length + 1
	};
}
async function finishAuthentication(input) {
	const ch = takeChallenge(input.challenge, "auth", input.origin);
	if (!ch) return {
		ok: false,
		error: "WebAuthn challenge expired. Unlock again."
	};
	const bad = parseClientData(input.clientDataJSON, "webauthn.get", input.origin, input.challenge);
	if (bad) return {
		ok: false,
		error: bad
	};
	const cred = (await webauthnRows()).find((r) => r.credential_id === input.credentialId);
	if (!cred) return {
		ok: false,
		error: "That YubiKey is not an enrolled FIDO2 admin key."
	};
	const auth = parseAuthData(input.authenticatorData);
	if (!auth) return {
		ok: false,
		error: "Authenticator data missing."
	};
	const expectRp = createHash("sha256").update(ch.rpId).digest();
	if (!auth.rpIdHash.equals(expectRp)) return {
		ok: false,
		error: "WebAuthn rpId mismatch."
	};
	if (!auth.up) return {
		ok: false,
		error: "YubiKey user presence required. Touch the gold disc."
	};
	if (!auth.uv) return {
		ok: false,
		error: "YubiKey PIN / biometric required (Yubico user verification)."
	};
	if (cred.sign_count > 0 && auth.signCount > 0 && auth.signCount <= cred.sign_count) return {
		ok: false,
		error: "YubiKey sign counter did not advance. Possible clone. Rejected."
	};
	const clientHash = createHash("sha256").update(unb64url(input.clientDataJSON)).digest();
	const signed = Buffer.concat([unb64url(input.authenticatorData), clientHash]);
	let ok = false;
	try {
		ok = verifySig(cred.alg, cred.public_key, signed, input.signature);
	} catch {
		ok = false;
	}
	if (!ok) return {
		ok: false,
		error: "YubiKey signature rejected."
	};
	try {
		await bumpSignCount(cred.credential_id, auth.signCount);
	} catch {}
	return { ok: true };
}
//#endregion
export { authenticationOptions, clearWebauthn, finishAuthentication, finishRegistration, maskCredId, originAllowed, registrationOptions, requestHost, webauthnCount, webauthnRows };
