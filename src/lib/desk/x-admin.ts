/**
 * Client-safe company / public X helpers.
 * System-admin X identity lives in `x-admin.server.ts` (env-only, never bundled for browsers).
 */

/** Only these Better Auth / broker provider ids count as X for admin (provider id list is not secret). */
export const ADMIN_X_PROVIDERS = ["grok-x", "twitter", "x"] as const;

/**
 * Handles that must never be company X.
 * @S1R1US — blocked for breaking rules.
 * @_S1R1US_ — operator rejected.
 * @S1R1S_AI — accidental; not the official desk.
 */
const DEAD_COMPANY_HANDLES = new Set(["s1r1us", "_s1r1us_", "s1r1s_ai"]);

/**
 * Brand / company account — sub of the operator. Never admin.
 * Official: @S1R1US_AI (https://x.com/S1R1US_AI).
 * Do not wire blocked @S1R1US / @_S1R1US_ or accidental @S1R1S_AI.
 */
export const COMPANY_X_NAME = "S1R1US AI";
export const COMPANY_X_HANDLE = "@S1R1US_AI";
export const COMPANY_X_HANDLE_CORE = "S1R1US_AI";
export const COMPANY_X_URL = "https://x.com/S1R1US_AI";
export const COMPANY_X_LABEL = `${COMPANY_X_NAME} (${COMPANY_X_HANDLE})`;
export const COMPANY_X_BIO =
  "Company desk of S1R1US Labs · [ S1R1U$ <<L@B$>> ] · education only · not financial advice · not an offer of securities";
/** Square S1R!US Godzilla Logo — site mark and X profile (400×400 at s1r1us-avatar.jpg). */
export const COMPANY_X_AVATAR = "/s1r1us-godzilla-logo.jpg";
export const COMPANY_X_AVATAR_X400 = "/s1r1us-avatar.jpg";
export const COMPANY_X_LOGO_NAME = "S1R!US Godzilla Logo";
export const COMPANY_X_LOGO_FILE = "/S1R!US-Godzilla-Logo.jpg";
/** 1500×500 G0DZ1LLa vs bear header. */
export const COMPANY_X_BANNER = "/s1r1us-x-banner.jpg";
/** Full G0DZ1LLa vs bear frame. */
export const COMPANY_X_ART = "/s1r1us-x-art.png";

function handleCore(s: string | null | undefined) {
  const raw = (s ?? "").trim();
  if (!raw) return "";
  const core = (raw.startsWith("@") ? raw.slice(1) : raw).toLowerCase();
  if (!core || /[*?/\s]/.test(core) || core.includes("@")) return "";
  return core;
}

export function isDeadCompanyHandle(s: string | null | undefined) {
  const core = handleCore(s);
  return core.length > 0 && DEAD_COMPANY_HANDLES.has(core);
}

export function companyHandleSet() {
  return COMPANY_X_HANDLE_CORE.length > 0 && !isDeadCompanyHandle(COMPANY_X_HANDLE_CORE);
}

export function isAdminXProvider(providerId: string | null | undefined) {
  const id = (providerId ?? "").trim().toLowerCase();
  return (ADMIN_X_PROVIDERS as readonly string[]).includes(id);
}

/**
 * Strip twitter:/x:/grok-x: prefixes and a single leading @.
 * Reject emails, URLs, markdown, extra @, display names.
 */
export function normalizeXIdentity(s: string | null | undefined) {
  let raw = (s ?? "").trim();
  if (!raw) return "";
  raw = raw.replace(/^(twitter|x|grok-x)[:|/]/i, "");
  if (raw.startsWith("@")) raw = raw.slice(1);
  if (!raw || raw.includes("@") || /[*?/\s.]/.test(raw)) return "";
  return raw;
}

const PROFILE_ID_KEYS = new Set([
  "id",
  "sub",
  "user_id",
  "userid",
  "preferred_username",
  "nickname",
  "username",
  "screen_name",
  "screenname",
  "twitter_id",
  "twitterid",
  "x_user_id",
  "xuserid",
  "email",
]);

function pushIdentity(out: string[], raw: unknown) {
  if (typeof raw === "number" && Number.isFinite(raw)) {
    out.push(String(raw));
    return;
  }
  if (typeof raw !== "string") return;
  const s = raw.trim();
  if (!s || s.length > 320) return;
  out.push(s);
  const local = /^([^@\s]+)@[^@\s]+$/.exec(s);
  if (local?.[1]) out.push(local[1]);
}

/** Pull handle / snowflake / email-local candidates from broker userinfo or an id_token. */
export function collectXIdentityStrings(value: unknown, depth = 0): string[] {
  const out: string[] = [];
  if (depth > 4 || value == null) return out;
  if (typeof value === "string" || typeof value === "number") {
    pushIdentity(out, value);
    return out;
  }
  if (Array.isArray(value)) {
    for (const item of value) out.push(...collectXIdentityStrings(item, depth + 1));
    return out;
  }
  if (typeof value !== "object") return out;
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    const compact = k.replace(/[-_]/g, "").toLowerCase();
    if (PROFILE_ID_KEYS.has(k.toLowerCase()) || PROFILE_ID_KEYS.has(compact)) {
      out.push(...collectXIdentityStrings(v, depth + 1));
      continue;
    }
    if (v && (Array.isArray(v) || typeof v === "object") && /identit|account|twitter|provider/i.test(k)) {
      out.push(...collectXIdentityStrings(v, depth + 1));
    }
  }
  return out;
}

/** Live official company handle @S1R1US_AI only. Blocked / accidental handles never match. Never admin. */
export function looksLikeCompanyX(s: string | null | undefined) {
  if (!companyHandleSet()) return false;
  const core = handleCore(s);
  if (!core || isDeadCompanyHandle(core)) return false;
  return core === COMPANY_X_HANDLE_CORE.toLowerCase();
}
