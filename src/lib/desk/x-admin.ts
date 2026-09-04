/** Canonical admin X account. Login matches this handle or its snowflake — nothing else. */
export const ADMIN_X_NAME = "Mr. R0b0t0";
export const ADMIN_X_HANDLE = "@_Mr_R0b0t0_";
export const ADMIN_X_HANDLE_CORE = "_Mr_R0b0t0_";
export const ADMIN_X_ID = "2093335535146131456";
export const ADMIN_X_LABEL = `${ADMIN_X_NAME} (${ADMIN_X_HANDLE})`;

/** Brand / coin company account. Never admin. */
export const COMPANY_X_NAME = "S1R1U$";
export const COMPANY_X_HANDLE = "@_S1R1US_";
export const COMPANY_X_FALLBACK = "@_S1R1US_LAB_";
export const COMPANY_X_URL = "https://x.com/_S1R1US_";
export const COMPANY_X_LABEL = `${COMPANY_X_NAME} (${COMPANY_X_HANDLE})`;
export const COMPANY_X_BIO =
  "Company desk of @_Mr_R0b0t0_ · [ S1R1U$ <<L@B$>> ] bitcoin accumulator · not financial advice";

const HANDLE = ADMIN_X_HANDLE_CORE.toLowerCase();
const COMPANY = "_s1r1us_";
const COMPANY_LAB = "_s1r1us_lab_";

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
  return core === COMPANY || core === COMPANY_LAB;
}
