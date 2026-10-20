/**
 * Pure server-side auth decisions shared by RPC handlers. No I/O here: the
 * verifiers are passed in so the rules can be unit-tested without a database.
 */
import { isSystemAdminTokenShape } from "./tenancy.ts";

export type VerifySystemToken = (token: string | undefined) => Promise<boolean>;

const MAX_TOKEN_LEN = 512;

/**
 * Host-wide controls (sim, hive, tape, practice pulse, forced rebuild) accept the
 * system admin token only. Copy-admin, desk-user and malformed tokens never reach
 * the verifier.
 */
export async function systemTokenOnly(token: unknown, verifySystem: VerifySystemToken): Promise<boolean> {
  if (typeof token !== "string" || !token || token.length > MAX_TOKEN_LEN) return false;
  if (!isSystemAdminTokenShape(token) || token.includes(".u.")) return false;
  try {
    return (await verifySystem(token)) === true;
  } catch {
    return false;
  }
}

/** A forced tape rebuild needs the system admin token; anything else reads the cached tape. */
export async function forceRebuildAllowed(
  input: { force?: unknown; token?: unknown } | null | undefined,
  verifySystem: VerifySystemToken,
): Promise<boolean> {
  if (!input || input.force !== true) return false;
  return systemTokenOnly(input.token, verifySystem);
}

export type RenewProofDeps = {
  credsMatch: (name: string, pass: string) => Promise<boolean>;
  consumeYubiOtp: (otp: string) => Promise<string | null>;
};

const YUBI_OTP_SHAPE = /^[cbdefghijklnrtuv]{44}$/;
export const RENEW_PROOF_ERROR = "Enter the current admin password or tap an enrolled YubiKey.";

/**
 * Renewing admin credentials from an X session also needs a second proof:
 * the current admin password, or a fresh OTP from an enrolled YubiKey.
 * Returns null when the proof passes, else an error string.
 */
export async function renewProofError(
  input: { current?: unknown; otp?: unknown } | null | undefined,
  liveName: string,
  deps: RenewProofDeps,
): Promise<string | null> {
  const current = typeof input?.current === "string" ? input.current : "";
  const otp = typeof input?.otp === "string" ? input.otp.trim().toLowerCase() : "";
  // Password first, then the YubiKey. A failure or error in one never skips the other.
  try {
    if (current && current.length <= 128 && (await deps.credsMatch(liveName, current)) === true) return null;
  } catch {
    /* try the YubiKey next */
  }
  try {
    if (otp && YUBI_OTP_SHAPE.test(otp) && (await deps.consumeYubiOtp(otp)) === null) return null;
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
export function renewProofFields(proof: string | null | undefined): { current?: string; otp?: string } {
  const value = typeof proof === "string" ? proof : "";
  if (!value) return {};
  const tap = value.trim().toLowerCase();
  return YUBI_OTP_SHAPE.test(tap) ? { current: value, otp: tap } : { current: value };
}

/** Browser session keys for the operator token (shared with the operator store). */
export const OPERATOR_TOKEN_KEY = "h3-op-token";
export const OPERATOR_ROLE_KEY = "h3-op-role";

type ReadStorage = { getItem: (key: string) => string | null };

/**
 * The system admin token for a forced tape refresh, or "" when this browser has
 * no system admin session. Copy-admin and desk-user tokens are never returned.
 */
export function forceRefreshToken(storage: ReadStorage | null | undefined): string {
  if (!storage) return "";
  try {
    if (storage.getItem(OPERATOR_ROLE_KEY) !== "admin") return "";
    const token = storage.getItem(OPERATOR_TOKEN_KEY) ?? "";
    if (!token || token.length > MAX_TOKEN_LEN || token.includes(".u.")) return "";
    return isSystemAdminTokenShape(token) ? token : "";
  } catch {
    return "";
  }
}
