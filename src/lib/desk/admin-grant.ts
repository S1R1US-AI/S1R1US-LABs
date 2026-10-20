/**
 * Pure rule for the admin page-code cookie: only a verified system-admin token earns it.
 * The verifier is passed in (the server uses the forwarded sign-in session), so the rule
 * can be tested without a database.
 */
import { systemTokenOnly, type VerifySystemToken } from "./auth-guards.ts";

export type GrantDeps = {
  verify: VerifySystemToken;
  setCookie: (token: string) => Promise<void> | void;
  clearCookie: () => Promise<void> | void;
};

export async function grantAdminAssetCookie(token: unknown, deps: GrantDeps): Promise<boolean> {
  if (await systemTokenOnly(token, deps.verify)) {
    await deps.setCookie(token as string);
    return true;
  }
  await deps.clearCookie();
  return false;
}
