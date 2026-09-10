/**
 * Sign-in providers.
 *
 * Production (s1r1us.ai): native X OAuth 2.0 (Better Auth `twitter`).
 * Callback: https://s1r1us.ai/api/auth/callback/twitter
 * Grok Auth / grok-x / auth.grok.me is DEAD on production (support will not allowlist).
 *
 * Sandbox preview (*.grok-sandbox.com): grok-x via the shared preview broker.
 */
export type GrokProvider = {
  providerId: string;
  idp: string;
  label: string;
};

/** Better Auth social id + callback path segment `/api/auth/callback/twitter`. */
export const NATIVE_X_PROVIDER_ID = "twitter";

export const GROK_PROVIDERS: readonly GrokProvider[] = [
  { providerId: "grok-x", idp: "twitter", label: "X" },
];

export function isPublicS1r1usHost(hostname?: string): boolean {
  const h = (hostname ?? (typeof window !== "undefined" ? window.location.hostname : "")).toLowerCase();
  return h === "s1r1us.ai" || h === "www.s1r1us.ai";
}

/** Which Continue with X provider the browser should start. */
export function xSignInProviderId(hostname?: string): string {
  return isPublicS1r1usHost(hostname) ? NATIVE_X_PROVIDER_ID : "grok-x";
}
