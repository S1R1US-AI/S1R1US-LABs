/** Browser-only WebAuthn helpers. Never import from a server module. */

export function webauthnAvailable() {
  return (
    typeof window !== "undefined" &&
    typeof window.PublicKeyCredential === "function" &&
    typeof navigator.credentials?.create === "function" &&
    typeof navigator.credentials?.get === "function"
  );
}

export function clientOrigin() {
  return typeof window !== "undefined" ? window.location.origin : "";
}

function bufToB64url(buf: ArrayBuffer | ArrayBufferView) {
  const bytes = buf instanceof ArrayBuffer ? new Uint8Array(buf) : new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]!);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function b64urlToBuf(s: string) {
  const pad = "=".repeat((4 - (s.length % 4)) % 4);
  const b64 = (s + pad).replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out.buffer;
}

export type CreateOpts = {
  challenge: string;
  rp: { id: string; name: string };
  user: { id: string; name: string; displayName: string };
  pubKeyCredParams: { type: "public-key"; alg: number }[];
  authenticatorSelection?: {
    authenticatorAttachment?: string;
    residentKey?: string;
    requireResidentKey?: boolean;
    userVerification?: string;
  };
  attestation?: string;
  timeout?: number;
  excludeCredentials?: { type: "public-key"; id: string; transports?: string[] }[];
  hints?: string[];
};

export type RequestOpts = {
  challenge: string;
  rpId: string;
  timeout?: number;
  userVerification?: string;
  allowCredentials?: { type: "public-key"; id: string; transports?: string[] }[];
  hints?: string[];
};

function toCreateOptions(o: CreateOpts): PublicKeyCredentialCreationOptions {
  return {
    challenge: b64urlToBuf(o.challenge),
    rp: o.rp,
    user: { id: b64urlToBuf(o.user.id), name: o.user.name, displayName: o.user.displayName },
    pubKeyCredParams: o.pubKeyCredParams,
    authenticatorSelection: o.authenticatorSelection as AuthenticatorSelectionCriteria | undefined,
    attestation: (o.attestation ?? "none") as AttestationConveyancePreference,
    timeout: o.timeout,
    excludeCredentials: (o.excludeCredentials ?? []).map((c) => ({
      type: "public-key" as const,
      id: b64urlToBuf(c.id),
      transports: c.transports as AuthenticatorTransport[] | undefined,
    })),
  };
}

function toRequestOptions(o: RequestOpts): PublicKeyCredentialRequestOptions {
  return {
    challenge: b64urlToBuf(o.challenge),
    rpId: o.rpId,
    timeout: o.timeout,
    userVerification: (o.userVerification ?? "required") as UserVerificationRequirement,
    allowCredentials: (o.allowCredentials ?? []).map((c) => ({
      type: "public-key" as const,
      id: b64urlToBuf(c.id),
      transports: c.transports as AuthenticatorTransport[] | undefined,
    })),
  };
}

export async function createYubiCredential(options: CreateOpts) {
  if (!webauthnAvailable()) {
    throw new Error("This browser does not support WebAuthn. Use Yubico OTP instead.");
  }
  const PK = PublicKeyCredential as unknown as {
    parseCreationOptionsFromJSON?: (o: unknown) => PublicKeyCredentialCreationOptions;
  };
  const parsed = PK.parseCreationOptionsFromJSON ? PK.parseCreationOptionsFromJSON(options) : toCreateOptions(options);
  const cred = (await navigator.credentials.create({ publicKey: parsed })) as PublicKeyCredential | null;
  if (!cred) throw new Error("YubiKey did not complete registration. Touch the gold disc.");
  const att = cred.response as AuthenticatorAttestationResponse;
  const pk = typeof att.getPublicKey === "function" ? att.getPublicKey() : null;
  if (!pk) {
    throw new Error("Authenticator did not return a public key. Use a current browser and a YubiKey 5 / Security Key.");
  }
  const transports = typeof att.getTransports === "function" ? att.getTransports() : ["usb"];
  const alg = typeof att.getPublicKeyAlgorithm === "function" ? att.getPublicKeyAlgorithm() : -7;
  return {
    credentialId: bufToB64url(cred.rawId),
    publicKey: bufToB64url(pk),
    alg,
    clientDataJSON: bufToB64url(att.clientDataJSON),
    transports: transports.length ? transports : ["usb"],
    challenge: options.challenge,
  };
}

export async function getYubiAssertion(options: RequestOpts) {
  if (!webauthnAvailable()) {
    throw new Error("This browser does not support WebAuthn. Use Yubico OTP instead.");
  }
  const PK = PublicKeyCredential as unknown as {
    parseRequestOptionsFromJSON?: (o: unknown) => PublicKeyCredentialRequestOptions;
  };
  const parsed = PK.parseRequestOptionsFromJSON ? PK.parseRequestOptionsFromJSON(options) : toRequestOptions(options);
  const cred = (await navigator.credentials.get({ publicKey: parsed })) as PublicKeyCredential | null;
  if (!cred) throw new Error("YubiKey did not complete authentication. Touch the gold disc.");
  const asrt = cred.response as AuthenticatorAssertionResponse;
  return {
    credentialId: bufToB64url(cred.rawId),
    authenticatorData: bufToB64url(asrt.authenticatorData),
    clientDataJSON: bufToB64url(asrt.clientDataJSON),
    signature: bufToB64url(asrt.signature),
    challenge: options.challenge,
  };
}
