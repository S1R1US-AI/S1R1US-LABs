/**
 * Shared LIVE-PREVIEW OAuth client (server-only — NEVER import from the client).
 *
 * The sandbox serves each live preview on a dynamic `https://*.grok-sandbox.com`
 * URL, which can't be pre-registered per app. The broker exposes ONE shared
 * "preview" client that accepts any
 * `https://*.grok-sandbox.com/api/auth/oauth2/callback/*`.
 * When deployed, a per-app `GROK_AUTH_*` pair overrides these (see `server.ts`).
 *
 * The preview client secret is read from the server environment only
 * (`GROK_PREVIEW_CLIENT_SECRET`). There is no value in source. When it is unset
 * the preview broker sign-in is simply disabled (fails safe).
 */
export const PREVIEW_CLIENT_ID = "grok_preview";
export const PREVIEW_CLIENT_SECRET: string | undefined =
  (typeof process !== "undefined" ? process.env.GROK_PREVIEW_CLIENT_SECRET?.trim() : undefined) || undefined;

/** The shared auth broker issuer (OIDC discovery lives under it). */
export const GROK_ISSUER_DEFAULT = "https://auth.grok.me";

/**
 * Host patterns whose callbacks the preview client accepts. Better Auth derives
 * the live preview's real origin from the request host and validates it against
 * this list (wildcard-matched), so the OAuth `redirect_uri` becomes the concrete
 * `https://<preview-host>/api/auth/oauth2/callback/...` the broker allows.
 */
export const PREVIEW_ALLOWED_HOSTS = ["*.grok-sandbox.com"] as const;
