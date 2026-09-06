/**
 * Two admin planes. Never mix tokens or RPCs.
 *
 * SYSTEM — s1r1us.ai host. Only @_Mr_R0b0t0_ + admin name + password
 *   (+ two physical YubiKeys: primary + backup). Path /admin.
 *
 * APP    — free iOS / Google download copy. The phone user is admin of
 *   THAT copy only. Path /app/admin. Cannot open /admin, Yubi, vault,
 *   hunter, source, or live Coinbase on the host.
 */
export const SYSTEM_SCOPE = "system" as const;
export const APP_SCOPE = "app" as const;

export const SYSTEM_ADMIN_ROLE = "admin" as const;
export const APP_ADMIN_ROLE = "app-admin" as const;
export const DESK_USER_ROLE = "user" as const;

export const SYSTEM_ADMIN_PATH = "/admin";
export const APP_ADMIN_PATH = "/app/admin";

export const SYSTEM_ONLY_PATHS = [
  "/admin",
  "/source",
  "/guide",
  "/security",
  "/launch",
  "/renew",
] as const;

/** Host controls that never ship to a download copy. */
export const SYSTEM_ONLY_CONTROLS = [
  "s1r1us.ai Security hunter / WAF / bad-bot bar",
  "Host YubiKey enroll (primary + backup) and dual-control outgoing",
  "Agent gate / data-pull pause for the public tape",
  "Morning report library",
  "Source pack / operating manual internals",
  "Coinbase MCP live create on the operator book",
  "Desk-user creation on this host",
] as const;

export const APP_ADMIN_KINDS = ["x", "apple", "google", "claude", "agent", "iphone"] as const;
export type AppAdminKind = (typeof APP_ADMIN_KINDS)[number];

export const APP_ADMIN_KIND_LABEL: Record<AppAdminKind, string> = {
  x: "X",
  apple: "Apple",
  google: "Google",
  claude: "Claude",
  agent: "AI agent",
  iphone: "iPhone",
};

export function isAppAdminKind(raw: string): raw is AppAdminKind {
  return (APP_ADMIN_KINDS as readonly string[]).includes(raw);
}

export function isSystemOnlyPath(path: string) {
  const p = (path || "/").split("?", 1)[0]!.replace(/\/+$/, "") || "/";
  return SYSTEM_ONLY_PATHS.some((d) => p === d || p.startsWith(`${d}/`));
}

/** Copy-admin tokens are 4-part `app.{exp}.{id}.{hmac}`. Never a 3-part system HMAC. */
export function isAppAdminToken(token: string | undefined | null) {
  if (!token) return false;
  const parts = token.split(".");
  return parts.length === 4 && parts[0] === "app";
}

export function isSystemAdminTokenShape(token: string | undefined | null) {
  if (!token || isAppAdminToken(token)) return false;
  return token.split(".").length === 3;
}

/**
 * Phone compute + online compute. Both must ACCUMULATE (or BUY) to ACCUMULATE.
 * Else WAIT. Never sell. Never short. Never TRIM.
 */
export type CombineLane = "ACCUMULATE" | "BUY" | "HOLD" | "WAIT" | "TRIM";

export function combineCompute(phone: string, online: string): "ACCUMULATE" | "WAIT" {
  const a = String(phone ?? "")
    .trim()
    .toUpperCase();
  const b = String(online ?? "")
    .trim()
    .toUpperCase();
  const yes = (s: string) => s === "ACCUMULATE" || s === "BUY";
  if (yes(a) && yes(b)) return "ACCUMULATE";
  return "WAIT";
}
