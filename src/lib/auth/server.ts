/**
 * Self-hosted Better Auth for THIS app (server-only).
 *
 * Production s1r1us.ai: native X OAuth 2.0 (TWITTER_CLIENT_*).
 * Sandbox preview: grok-x broker. Do not use grok-x on production.
 */
import { betterAuth } from "better-auth";
import { bearer, genericOAuth } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { getCookie } from "@tanstack/react-start/server";
import { randomBytes } from "node:crypto";
import { Pool } from "pg";
import { ensureDbReady, getPglite } from "../db";
import { emailAndPasswordEnabled } from "./email-password";
import { GATE_PROVIDER_ID, gateIdentitySessions } from "./gate-session.server";
import { GROK_PROVIDERS, NATIVE_X_PROVIDER_ID } from "./providers";
import { pgliteDialect } from "./pglite-dialect";
import {
  GROK_ISSUER_DEFAULT,
  PREVIEW_ALLOWED_HOSTS,
  PREVIEW_CLIENT_ID,
  PREVIEW_CLIENT_SECRET,
} from "./preview";
import { looksLikeAdminX, preferredXAccountId } from "../desk/x-admin";

void ensureDbReady();

const globalAuthRef = globalThis as typeof globalThis & {
  __grokAuthPreviewSecret__?: string;
};
function previewAuthSecret(): string {
  globalAuthRef.__grokAuthPreviewSecret__ ??= randomBytes(32).toString("hex");
  return globalAuthRef.__grokAuthPreviewSecret__;
}

const env = (key: string): string | undefined => {
  const value = process.env[key]?.trim();
  return value ? value : undefined;
};

const authDisabled = env("VITE_AUTH_ENABLED") === "false";

const grokIssuer = env("GROK_AUTH_ISSUER") ?? GROK_ISSUER_DEFAULT;
const publicSite = Boolean(
  (env("BETTER_AUTH_URL") ?? "").includes("s1r1us.ai"),
);
const grokClientId = env("GROK_AUTH_CLIENT_ID") ?? (publicSite ? undefined : PREVIEW_CLIENT_ID);
const grokClientSecret = env("GROK_AUTH_CLIENT_SECRET") ?? (publicSite ? undefined : PREVIEW_CLIENT_SECRET);
const twitterClientId = env("TWITTER_CLIENT_ID") ?? env("X_CLIENT_ID");
const twitterClientSecret = env("TWITTER_CLIENT_SECRET") ?? env("X_CLIENT_SECRET");
const nativeXConfigured = Boolean(twitterClientId && twitterClientSecret);
const useGrokBroker = Boolean(grokClientId && grokClientSecret) && !(publicSite && nativeXConfigured);

export const authConfigured =
  !authDisabled && (nativeXConfigured || Boolean(grokClientId && grokClientSecret));

const explicitBaseURL = env("BETTER_AUTH_URL");
const previewAllowedHosts: string[] = [...PREVIEW_ALLOWED_HOSTS];
const LOCAL_DEV_ORIGINS: string[] = [
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  "http://[::1]:8080",
];
const PUBLIC_SITE_HOSTS: string[] = ["s1r1us.ai", "www.s1r1us.ai"];
const PUBLIC_SITE_ORIGINS: string[] = PUBLIC_SITE_HOSTS.map((h) => `https://${h}`);
const baseURL = explicitBaseURL ?? {
  allowedHosts: [...previewAllowedHosts, "localhost", "127.0.0.1", "[::1]", ...PUBLIC_SITE_HOSTS],
  protocol: "auto" as const,
  fallback: "http://localhost:8080",
};

const trustedOrigins: string[] = explicitBaseURL
  ? Array.from(new Set([explicitBaseURL, ...PUBLIC_SITE_ORIGINS, ...LOCAL_DEV_ORIGINS]))
  : [
      ...previewAllowedHosts,
      ...previewAllowedHosts.flatMap((host) => [`https://${host}`, `http://${host}`]),
      ...PUBLIC_SITE_ORIGINS,
      ...LOCAL_DEV_ORIGINS,
    ];

const databaseUrl = env("DATABASE_URL");

const issuerBase = grokIssuer.replace(/\/+$/, "");
const grokAuthorizationUrl = `${issuerBase}/api/auth/oauth2/authorize`;
const grokTokenUrl = `${issuerBase}/api/auth/oauth2/token`;
const grokUserInfoUrl = `${issuerBase}/api/auth/oauth2/userinfo`;

async function grokBrokerUserInfo(tokens: { accessToken?: string; idToken?: string }) {
  const profile: Record<string, unknown> = {};
  if (tokens.idToken && tokens.idToken.split(".").length >= 2) {
    try {
      const payload = JSON.parse(
        Buffer.from(tokens.idToken.split(".")[1]!, "base64url").toString("utf8"),
      ) as unknown;
      if (payload && typeof payload === "object" && !Array.isArray(payload)) {
        Object.assign(profile, payload);
      }
    } catch {
      /* ignore */
    }
  }
  if (tokens.accessToken) {
    try {
      const res = await fetch(grokUserInfoUrl, {
        method: "GET",
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      });
      if (res.ok) {
        const data: unknown = await res.json();
        if (data && typeof data === "object" && !Array.isArray(data)) {
          Object.assign(profile, data);
        }
      }
    } catch {
      /* ignore */
    }
  }
  const id =
    preferredXAccountId(profile) ||
    (typeof profile.sub === "string" ? profile.sub.trim() : "") ||
    (typeof profile.id === "string" ? profile.id.trim() : "");
  if (!id) return null;
  const handle =
    [profile.preferred_username, profile.username, profile.nickname].find(
      (v) => typeof v === "string" && looksLikeAdminX(v),
    ) ?? null;
  return {
    id,
    name: typeof handle === "string" ? handle.replace(/^@/, "") : typeof profile.name === "string" ? profile.name : id,
    email: typeof profile.email === "string" ? profile.email : undefined,
    image: typeof profile.picture === "string" ? profile.picture : undefined,
    emailVerified: false,
  };
}

const database = databaseUrl
  ? new Pool({ connectionString: databaseUrl })
  : { dialect: pgliteDialect(() => getPglite()), type: "postgres" as const };

export const SESSION_TOKEN_COOKIE = "__Host-grok-auth.session_token";

const grokOAuthPlugin = useGrokBroker
  ? genericOAuth({
      config: GROK_PROVIDERS.map(({ providerId, idp }) => ({
        providerId,
        clientId: grokClientId as string,
        clientSecret: grokClientSecret as string,
        authorizationUrl: grokAuthorizationUrl,
        tokenUrl: grokTokenUrl,
        userInfoUrl: grokUserInfoUrl,
        scopes: ["openid", "profile", "email"],
        getUserInfo: grokBrokerUserInfo,
        authorizationUrlParams: { idp, prompt: "login" },
      })),
    })
  : null;

export const auth = betterAuth({
  baseURL,
  secret: env("BETTER_AUTH_SECRET") ?? previewAuthSecret(),
  database,
  ...(nativeXConfigured
    ? {
        socialProviders: {
          twitter: {
            clientId: twitterClientId as string,
            clientSecret: twitterClientSecret as string,
            disableDefaultScope: true,
            scope: ["users.read", "tweet.read", "offline.access"],
            mapProfileToUser: (profile) => {
              const data = (profile as { data?: { id?: string; name?: string; username?: string; profile_image_url?: string } }).data;
              const handle = typeof data?.username === "string" ? data.username.replace(/^@/, "") : "";
              return {
                name: handle || data?.name || data?.id || "x",
                image: data?.profile_image_url,
              };
            },
          },
        },
      }
    : {}),
  trustedOrigins,
  account: {
    encryptOAuthTokens: true,
    accountLinking: {
      enabled: true,
      trustedProviders: [
        ...GROK_PROVIDERS.map((p) => p.providerId),
        NATIVE_X_PROVIDER_ID,
        "x",
        GATE_PROVIDER_ID,
      ],
      requireLocalEmailVerified: false,
    },
  },
  session: { cookieCache: { enabled: true, maxAge: 300 } },
  ...(emailAndPasswordEnabled ? { emailAndPassword: { enabled: true } } : {}),
  advanced: {
    useSecureCookies: false,
    defaultCookieAttributes: { secure: true, sameSite: "lax", path: "/" },
    cookies: {
      session_token: { name: SESSION_TOKEN_COOKIE },
      session_data: { name: "__Host-grok-auth.session_data" },
      account_data: { name: "__Host-grok-auth.account_data" },
      dont_remember: { name: "__Host-grok-auth.dont_remember" },
    },
  },
  plugins: [
    gateIdentitySessions(),
    ...(grokOAuthPlugin ? [grokOAuthPlugin] : []),
    bearer(),
    tanstackStartCookies(),
  ],
});

export function readSessionToken(): string | null {
  return getCookie(SESSION_TOKEN_COOKIE) ?? null;
}

export { GROK_PROVIDERS, NATIVE_X_PROVIDER_ID } from "./providers";
