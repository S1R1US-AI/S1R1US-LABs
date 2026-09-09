/**
 * Yubico-aligned WebAuthn / FIDO2 for the admin panel.
 * Official: https://www.yubico.com/  https://developers.yubico.com/WebAuthn/
 *
 * Hardware-bound (cross-platform) keys. User verification required on register
 * and unlock (Yubico FIDO2 MFA checklist). Attestation none — we already bind
 * Yubico OTP via YubiCloud. Sign-count clone detection. Never import from a
 * client page.
 */
import { createHash, createPublicKey, randomBytes, verify as cryptoVerify } from "node:crypto";
import { getSql } from "@/lib/db";
import { originAllowedPinned, privilegeHostFromHeaders, rpIdPinned } from "./canonical-origin";

export const YUBICO_DOCS = {
  home: "https://www.yubico.com/",
  how: "https://www.yubico.com/products/how-the-yubikey-works/",
  setup: "https://www.yubico.com/setup/",
  webauthn: "https://developers.yubico.com/WebAuthn/",
  best: "https://developers.yubico.com/WebAuthn/WebAuthn_Developer_Guide/Best_Practices.html",
  checklist: "https://developers.yubico.com/WebAuthn/WebAuthn_Developer_Guide/WebAuthn_Readiness_Checklist.html",
  otp: "https://developers.yubico.com/OTP/",
  demo: "https://demo.yubico.com/webauthn-technical",
} as const;

type WebAuthnRow = {
  id: string;
  credential_id: string;
  public_key: string;
  alg: number;
  sign_count: number;
  transports: string;
};

const CHALLENGES = new Map<string, { at: number; type: "reg" | "auth"; origin: string; rpId: string }>();
const CHALLENGE_MS = 2 * 60_000;

export function b64url(buf: Buffer | Uint8Array) {
  return Buffer.from(buf).toString("base64url");
}

export function unb64url(s: string) {
  return Buffer.from(s, "base64url");
}

export function originAllowed(origin: string, _requestHost?: string) {
  // Wave 3: matching a foreign Host is not enough. Canonical / loopback only.
  return originAllowedPinned(origin);
}

export function rpIdOf(origin: string) {
  return rpIdPinned(origin);
}

export async function requestHost(): Promise<string> {
  try {
    const { getRequest } = await import("@tanstack/react-start/server");
    const req = getRequest();
    // Wave 3: X-Forwarded-Host cannot elevate WebAuthn privilege.
    return privilegeHostFromHeaders({
      host: req.headers.get("host"),
      forwardedHost: req.headers.get("x-forwarded-host"),
    });
  } catch {
    return "";
  }
}

function pruneChallenges() {
  const now = Date.now();
  for (const [k, v] of CHALLENGES) {
    if (now - v.at > CHALLENGE_MS) CHALLENGES.delete(k);
  }
}

export function issueWebauthnChallenge(type: "reg" | "auth", origin: string) {
  pruneChallenges();
  const rpId = rpIdOf(origin);
  const raw = randomBytes(32);
  const id = b64url(raw);
  CHALLENGES.set(id, { at: Date.now(), type, origin, rpId });
  return { challenge: id, rpId, rpName: "S1R1US Labs" };
}

function takeChallenge(id: string, type: "reg" | "auth", origin: string) {
  pruneChallenges();
  const row = CHALLENGES.get(id);
  if (!row || row.type !== type) return null;
  if (row.origin !== origin) return null;
  CHALLENGES.delete(id);
  return row;
}

export async function webauthnRows(): Promise<WebAuthnRow[]> {
  try {
    const sql = await getSql();
    return await sql<WebAuthnRow>`
      select id, credential_id, public_key, alg, sign_count, transports
      from admin_webauthn order by enrolled_at asc
    `;
  } catch {
    return [];
  }
}

export async function webauthnCount() {
  return (await webauthnRows()).length;
}

export function maskCredId(id: string) {
  if (id.length < 10) return id;
  return `${id.slice(0, 6)}…${id.slice(-4)}`;
}

export async function saveWebauthn(input: {
  credentialId: string;
  publicKey: string;
  alg: number;
  transports: string[];
}) {
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

export async function bumpSignCount(credentialId: string, next: number) {
  const sql = await getSql();
  await sql`update admin_webauthn set sign_count = ${next} where credential_id = ${credentialId}`;
}

export async function clearWebauthn(credentialId?: string) {
  try {
    const sql = await getSql();
    if (credentialId) {
      await sql`delete from admin_webauthn where id = ${credentialId} or credential_id = ${credentialId}`;
      return;
    }
    await sql`delete from admin_webauthn`;
  } catch {
    /* preview */
  }
}

export async function registrationOptions(origin: string, host?: string) {
  if (!originAllowed(origin, host)) return { ok: false as const, error: "Origin not allowed for WebAuthn." };
  const ch = issueWebauthnChallenge("reg", origin);
  const existing = await webauthnRows();
  return {
    ok: true as const,
    options: {
      challenge: ch.challenge,
      rp: { id: ch.rpId, name: ch.rpName },
      user: {
        id: b64url(Buffer.from("s1r1us-admin")),
        name: "admin",
        displayName: "S1R1US operator",
      },
      pubKeyCredParams: [
        { type: "public-key" as const, alg: -7 },
        { type: "public-key" as const, alg: -257 },
      ],
      authenticatorSelection: {
        authenticatorAttachment: "cross-platform" as const,
        residentKey: "preferred" as const,
        requireResidentKey: false,
        userVerification: "required" as const,
      },
      attestation: "none" as const,
      timeout: 60_000,
      excludeCredentials: existing.map((r) => ({
        type: "public-key" as const,
        id: r.credential_id,
        transports: r.transports ? r.transports.split(",").filter(Boolean) : ["usb", "nfc"],
      })),
      hints: ["security-key"],
    },
  };
}

export async function authenticationOptions(origin: string, host?: string) {
  if (!originAllowed(origin, host)) return { ok: false as const, error: "Origin not allowed for WebAuthn." };
  const rows = await webauthnRows();
  if (!rows.length) return { ok: false as const, error: "No FIDO2 YubiKey enrolled. Enroll in Admin → Wallet or tap Yubico OTP." };
  const ch = issueWebauthnChallenge("auth", origin);
  return {
    ok: true as const,
    options: {
      challenge: ch.challenge,
      rpId: ch.rpId,
      timeout: 60_000,
      userVerification: "required" as const,
      allowCredentials: rows.map((r) => ({
        type: "public-key" as const,
        id: r.credential_id,
        transports: r.transports ? r.transports.split(",").filter(Boolean) : ["usb", "nfc"],
      })),
      hints: ["security-key"],
    },
  };
}

function parseClientData(jsonB64: string, expectType: string, origin: string, challenge: string) {
  const raw = unb64url(jsonB64).toString("utf8");
  const data = JSON.parse(raw) as { type?: string; origin?: string; challenge?: string };
  if (data.type !== expectType) return "Wrong WebAuthn ceremony.";
  if (data.origin !== origin) return "WebAuthn origin mismatch.";
  if (data.challenge !== challenge) return "WebAuthn challenge mismatch.";
  return null;
}

function parseAuthData(b64: string) {
  const buf = unb64url(b64);
  if (buf.length < 37) return null;
  const flags = buf[32]!;
  return {
    rpIdHash: buf.subarray(0, 32),
    flags,
    signCount: buf.readUInt32BE(33),
    up: Boolean(flags & 0x01),
    uv: Boolean(flags & 0x04),
  };
}

function verifySig(alg: number, spkiB64: string, data: Buffer, sigB64: string) {
  const key = createPublicKey({ key: unb64url(spkiB64), format: "der", type: "spki" });
  const sig = unb64url(sigB64);
  if (alg === -7) return cryptoVerify("SHA256", data, key, sig);
  if (alg === -257) return cryptoVerify("SHA256", data, key, sig);
  return false;
}

export async function finishRegistration(input: {
  origin: string;
  challenge: string;
  credentialId: string;
  publicKey: string;
  alg: number;
  transports: string[];
  clientDataJSON: string;
}) {
  const ch = takeChallenge(input.challenge, "reg", input.origin);
  if (!ch) return { ok: false as const, error: "WebAuthn registration challenge expired. Try again." };
  const bad = parseClientData(input.clientDataJSON, "webauthn.create", input.origin, input.challenge);
  if (bad) return { ok: false as const, error: bad };
  if (!input.credentialId || !input.publicKey) {
    return { ok: false as const, error: "Authenticator did not return a public key. Use a current browser and a YubiKey 5 / Security Key." };
  }
  try {
    createPublicKey({ key: unb64url(input.publicKey), format: "der", type: "spki" });
  } catch {
    return { ok: false as const, error: "Public key from the YubiKey could not be parsed." };
  }
  const existing = await webauthnRows();
  if (existing.some((r) => r.credential_id === input.credentialId)) {
    return { ok: false as const, error: "That YubiKey FIDO2 credential is already enrolled." };
  }
  if (existing.length >= 4) return { ok: false as const, error: "FIDO2 slots full (4). Remove a key before adding another." };
  const id = await saveWebauthn({
    credentialId: input.credentialId,
    publicKey: input.publicKey,
    alg: input.alg || -7,
    transports: input.transports.length ? input.transports : ["usb", "nfc"],
  });
  return { ok: true as const, id, credentialId: maskCredId(input.credentialId), count: existing.length + 1 };
}

export async function finishAuthentication(input: {
  origin: string;
  challenge: string;
  credentialId: string;
  authenticatorData: string;
  clientDataJSON: string;
  signature: string;
}) {
  const ch = takeChallenge(input.challenge, "auth", input.origin);
  if (!ch) return { ok: false as const, error: "WebAuthn challenge expired. Unlock again." };
  const bad = parseClientData(input.clientDataJSON, "webauthn.get", input.origin, input.challenge);
  if (bad) return { ok: false as const, error: bad };
  const rows = await webauthnRows();
  const cred = rows.find((r) => r.credential_id === input.credentialId);
  if (!cred) return { ok: false as const, error: "That YubiKey is not an enrolled FIDO2 admin key." };
  const auth = parseAuthData(input.authenticatorData);
  if (!auth) return { ok: false as const, error: "Authenticator data missing." };
  const expectRp = createHash("sha256").update(ch.rpId).digest();
  if (!auth.rpIdHash.equals(expectRp)) return { ok: false as const, error: "WebAuthn rpId mismatch." };
  if (!auth.up) return { ok: false as const, error: "YubiKey user presence required. Touch the gold disc." };
  if (!auth.uv) return { ok: false as const, error: "YubiKey PIN / biometric required (Yubico user verification)." };
  if (cred.sign_count > 0 && auth.signCount > 0 && auth.signCount <= cred.sign_count) {
    return { ok: false as const, error: "YubiKey sign counter did not advance. Possible clone. Rejected." };
  }
  const clientHash = createHash("sha256").update(unb64url(input.clientDataJSON)).digest();
  const signed = Buffer.concat([unb64url(input.authenticatorData), clientHash]);
  let ok = false;
  try {
    ok = verifySig(cred.alg, cred.public_key, signed, input.signature);
  } catch {
    ok = false;
  }
  if (!ok) return { ok: false as const, error: "YubiKey signature rejected." };
  try {
    await bumpSignCount(cred.credential_id, auth.signCount);
  } catch {
    /* still authenticated */
  }
  return { ok: true as const };
}
