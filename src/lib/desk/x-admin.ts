/** Canonical admin X account. Login matches this handle or its snowflake — nothing else. */
export const ADMIN_X_NAME = "Mr. R0b0t0";
export const ADMIN_X_HANDLE = "@_Mr_R0b0t0_";
export const ADMIN_X_HANDLE_CORE = "_Mr_R0b0t0_";
export const ADMIN_X_ID = "2093335535146131456";
export const ADMIN_X_LABEL = `${ADMIN_X_NAME} (${ADMIN_X_HANDLE})`;

/** Only these Better Auth / broker provider ids count as X for admin. */
export const ADMIN_X_PROVIDERS = ["grok-x", "twitter", "x"] as const;

/**
 * Handles that must never be company X.
 * @S1R1US — blocked for breaking rules.
 * @_S1R1US_ — operator rejected.
 */
const DEAD_COMPANY_HANDLES = new Set(["s1r1us", "_s1r1us_"]);

/**
 * Brand / company account — sub of the operator. Never admin.
 * Live: @S1R1S_AI. Do not wire blocked @S1R1US / @_S1R1US_.
 */
export const COMPANY_X_NAME = "S1R1S AI";
export const COMPANY_X_HANDLE = "@S1R1S_AI";
export const COMPANY_X_HANDLE_CORE = "S1R1S_AI";
export const COMPANY_X_URL = "https://x.com/S1R1S_AI";
export const COMPANY_X_LABEL = `${COMPANY_X_NAME} (${COMPANY_X_HANDLE})`;
export const COMPANY_X_BIO =
  "Company desk of S1R1US Labs · [ S1R1U$ <<L@B$>> ] · education only · not financial advice · not an offer of securities";
/** Square 400×400 laser-ape — desk mark / future X profile pic. */
export const COMPANY_X_AVATAR = "/s1r1us-avatar.jpg";
/** 1500×500 G0DZ1LLa vs bear header. */
export const COMPANY_X_BANNER = "/s1r1us-x-banner.jpg";
/** Full G0DZ1LLa vs bear frame. */
export const COMPANY_X_ART = "/s1r1us-x-art.png";

const HANDLE = ADMIN_X_HANDLE_CORE.toLowerCase();

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

/**
 * True only for the live @_Mr_R0b0t0_ account:
 * - snowflake 2093335535146131456 (OAuth sub of that same account)
 * - handle @_Mr_R0b0t0_ or _Mr_R0b0t0_ (one leading @, case-insensitive)
 * Display name "Mr. R0b0t0", emails, URLs, extra @, company/dead handles — all false.
 */
export function looksLikeAdminX(s: string | null | undefined) {
  const core = normalizeXIdentity(s);
  if (!core) return false;
  if (core === ADMIN_X_ID) return true;
  if (isDeadCompanyHandle(core)) return false;
  return core.toLowerCase() === HANDLE;
}

/** Live company handle only. Blocked @S1R1US / @_S1R1US_ never match. Never admin. */
export function looksLikeCompanyX(s: string | null | undefined) {
  if (!companyHandleSet()) return false;
  const core = handleCore(s);
  if (!core || isDeadCompanyHandle(core)) return false;
  if (looksLikeAdminX(core)) return false;
  return core === COMPANY_X_HANDLE_CORE.toLowerCase();
}
