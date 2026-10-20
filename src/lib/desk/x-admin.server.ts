/**
 * Server-only admin X identity (AUTH_PRESERVE).
 * NEVER import from client components or any module the browser bundles.
 *
 * Env (DigitalOcean App Platform / local gitignored `.env` — never `VITE_`):
 * - S1R1US_ADMIN_X_HANDLE — core handle WITHOUT leading `@` (`@` stripped if present)
 * - S1R1US_ADMIN_X_NAME — display name
 * - S1R1US_ADMIN_X_ID — X snowflake / OAuth user id for that account
 *
 * Fail closed: when unset, looksLikeAdminX is always false (no public fallback literals).
 */
import {
  collectXIdentityStrings,
  isDeadCompanyHandle,
  normalizeXIdentity,
} from "./x-admin.ts";

function stripAt(raw: string): string {
  const t = raw.trim();
  return t.startsWith("@") ? t.slice(1) : t;
}

/** Core handle without `@`. Empty when unset. */
export function getAdminXHandleCore(): string {
  return stripAt(process.env.S1R1US_ADMIN_X_HANDLE ?? "");
}

/** `@` + core, or empty when unset. */
export function getAdminXHandle(): string {
  const core = getAdminXHandleCore();
  return core ? `@${core}` : "";
}

export function getAdminXName(): string {
  return (process.env.S1R1US_ADMIN_X_NAME ?? "").trim();
}

export function getAdminXId(): string {
  return (process.env.S1R1US_ADMIN_X_ID ?? "").trim();
}

export function getAdminXLabel(): string {
  const name = getAdminXName();
  const handle = getAdminXHandle();
  if (name && handle) return `${name} (${handle})`;
  if (handle) return handle;
  if (name) return name;
  return "system operator";
}

/** Snapshot for server handlers (re-reads env each call). */
export function loadAdminX() {
  return {
    ADMIN_X_NAME: getAdminXName(),
    ADMIN_X_HANDLE: getAdminXHandle(),
    ADMIN_X_HANDLE_CORE: getAdminXHandleCore(),
    ADMIN_X_ID: getAdminXId(),
    ADMIN_X_LABEL: getAdminXLabel(),
  };
}

export const ADMIN_X_PROVIDERS = ["grok-x", "twitter", "x"] as const;

export function isAdminXProvider(providerId: string | null | undefined) {
  const id = (providerId ?? "").trim().toLowerCase();
  return (ADMIN_X_PROVIDERS as readonly string[]).includes(id);
}

/**
 * True only for the configured system-admin X account (env):
 * - snowflake S1R1US_ADMIN_X_ID
 * - handle core / @core (case-insensitive)
 * Display names, emails, URLs, company/dead handles — false.
 */
export function looksLikeAdminX(s: string | null | undefined) {
  const core = normalizeXIdentity(s);
  if (!core) return false;
  const id = getAdminXId();
  const handle = getAdminXHandleCore().toLowerCase();
  if (!id && !handle) return false;
  if (id && core === id) return true;
  if (isDeadCompanyHandle(core)) return false;
  if (!handle) return false;
  return core.toLowerCase() === handle;
}

export function profileLooksLikeAdminX(value: unknown) {
  return collectXIdentityStrings(value).some((cand) => looksLikeAdminX(cand));
}

export type XAccountRow = { accountId: string; providerId: string; idToken: string | null };

/** Claims from a server-stored OAuth id_token. */
export function idTokenClaimsAreAdmin(token: string | null | undefined) {
  if (!token || token.split(".").length < 2) return false;
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1]!, "base64url").toString("utf8")) as unknown;
    if (profileLooksLikeAdminX(payload)) return true;
    if (payload && typeof payload === "object" && !Array.isArray(payload)) {
      const rec = payload as Record<string, unknown>;
      const fields = [rec.sub, rec.user_id, rec.preferred_username, rec.username, rec.nickname];
      return fields.some((v) => typeof v === "string" && looksLikeAdminX(v));
    }
    return false;
  } catch {
    return false;
  }
}

/** Admin identity from server-stored OAuth account rows (provider accountId or id_token claims). */
export function accountRowsAreAdminX(rows: readonly XAccountRow[]): boolean {
  for (const a of rows) {
    if (!isAdminXProvider(a.providerId)) continue;
    if (looksLikeAdminX(a.accountId)) return true;
    if (idTokenClaimsAreAdmin(a.idToken)) return true;
  }
  return false;
}

/** Stable accountId: operator handle/snowflake when present, else a twitter id/handle, else empty. */
export function preferredXAccountId(value: unknown): string {
  const all = collectXIdentityStrings(value);
  const id = getAdminXId();
  const handleCore = getAdminXHandleCore();
  if (all.some((cand) => looksLikeAdminX(cand))) {
    const snow = all.map(normalizeXIdentity).find((c) => Boolean(id) && c === id);
    return snow || handleCore;
  }
  const snow = all.map(normalizeXIdentity).find((c) => /^\d{15,20}$/.test(c));
  if (snow) return snow;
  const handle = all.map(normalizeXIdentity).find((c) => c.length >= 2 && c.length <= 15 && /[a-z]/i.test(c));
  return handle || "";
}

export { normalizeXIdentity, collectXIdentityStrings };
