/** Canonical admin X account. Login matches this handle or its snowflake — nothing else. */
export const ADMIN_X_NAME = "Mr. R0b0t0";
export const ADMIN_X_HANDLE = "@_Mr_R0b0t0_";
export const ADMIN_X_HANDLE_CORE = "_Mr_R0b0t0_";
export const ADMIN_X_ID = "2093335535146131456";
export const ADMIN_X_LABEL = `${ADMIN_X_NAME} (${ADMIN_X_HANDLE})`;

/**
 * Brand / company account — sub of @_Mr_R0b0t0_. Never admin.
 * Display and handle both S1R1US. Not @_S1R1US_. Not S1R1U$S as the X display.
 */
export const COMPANY_X_NAME = "S1R1US";
export const COMPANY_X_HANDLE = "@S1R1US";
export const COMPANY_X_HANDLE_CORE = "S1R1US";
export const COMPANY_X_URL = "https://x.com/S1R1US";
export const COMPANY_X_LABEL = `${COMPANY_X_NAME} (${COMPANY_X_HANDLE})`;
export const COMPANY_X_BIO =
  "Company desk of @_Mr_R0b0t0_ · [ S1R1U$ <<L@B$>> ] bitcoin accumulator · not financial advice";
/** Square 400×400 laser-ape — X profile pic for @S1R1US. */
export const COMPANY_X_AVATAR = "/s1r1us-avatar.jpg";
/** 1500×500 header from the same art. */
export const COMPANY_X_BANNER = "/s1r1us-x-banner.jpg";
/** Full attached frame, for download / header source. */
export const COMPANY_X_ART = "/s1r1us-x-art.png";

const HANDLE = ADMIN_X_HANDLE_CORE.toLowerCase();
const COMPANY = COMPANY_X_HANDLE_CORE.toLowerCase();
const COMPANY_DISPLAY_LEGACY = "s1r1u$s";
const COMPANY_DISPLAY_US = "_s1r1u$s_";

export function companyHandleSet() {
  return COMPANY_X_HANDLE_CORE.length > 0;
}

/**
 * True only for the live @_Mr_R0b0t0_ account:
 * - snowflake 2093335535146131456 (OAuth sub of that same account)
 * - handle @_Mr_R0b0t0_ or _Mr_R0b0t0_ (one leading @, case-insensitive)
 * Display name "Mr. R0b0t0", markdown *@*Mr_R0b0t0*, URLs, extra @, wildcards — all false.
 */
export function looksLikeAdminX(s: string | null | undefined) {
  const raw = (s ?? "").trim();
  if (!raw) return false;
  if (/[*?/\s]/.test(raw.replace(/^@/, ""))) return false;
  if (raw === ADMIN_X_ID) return true;
  if (raw.startsWith("@") && raw.slice(1).includes("@")) return false;
  const core = raw.startsWith("@") ? raw.slice(1) : raw;
  return core.toLowerCase() === HANDLE;
}

export function looksLikeCompanyX(s: string | null | undefined) {
  const raw = (s ?? "").trim();
  if (!raw) return false;
  const core = (raw.startsWith("@") ? raw.slice(1) : raw).toLowerCase();
  if (/[*?/\s]/.test(core) || core.includes("@")) return false;
  return core === COMPANY || core === COMPANY_DISPLAY_LEGACY || core === COMPANY_DISPLAY_US;
}
