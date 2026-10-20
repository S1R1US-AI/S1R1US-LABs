/**
 * Server-only admin check for admin-only data. Reuses verifyAccessToken (the
 * same check every admin server function uses). On failure the response is
 * 401 with no data; every answer is marked private, no-store.
 */
import { ADMIN_ASSET_COOKIE, ADMIN_ASSET_COOKIE_PATH } from "./admin-assets";
import { verifyAccessToken } from "./access.server";
import { systemTokenOnly } from "./auth-guards";

export const PRIVATE_NO_STORE = "private, no-store";

export async function isAdminToken(token: string | undefined): Promise<boolean> {
  return systemTokenOnly(token, verifyAccessToken);
}

/** Server function guard: true for a signed-in system admin, else sets 401. */
export async function requireAdminData(token: string | undefined): Promise<boolean> {
  const ok = await isAdminToken(token);
  try {
    const { setResponseHeader, setResponseStatus } = await import("@tanstack/react-start/server");
    setResponseHeader("cache-control", PRIVATE_NO_STORE);
    if (!ok) setResponseStatus(401);
  } catch {
    /* outside a request (tests) */
  }
  return ok;
}

/** Mark the current server-function answer as a private 401. */
export async function denyAdminData(): Promise<void> {
  try {
    const { setResponseHeader, setResponseStatus } = await import("@tanstack/react-start/server");
    setResponseHeader("cache-control", PRIVATE_NO_STORE);
    setResponseStatus(401);
  } catch {
    /* outside a request (tests) */
  }
}

/** API route guard: null when allowed, else a 401 Response with no data. */
export async function adminDataDenied(token: string | undefined): Promise<Response | null> {
  if (await isAdminToken(token)) return null;
  return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
    status: 401,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": PRIVATE_NO_STORE },
  });
}

export function bearerOf(request: Request): string | undefined {
  const h = request.headers.get("authorization") ?? "";
  const m = /^Bearer\s+(\S+)$/i.exec(h.trim());
  return m?.[1];
}

/** Set the HttpOnly cookie that lets this browser load admin page code. Caller has verified the token. */
export async function setAdminAssetCookie(token: string) {
  const { getRequestHeader, setCookie } = await import("@tanstack/react-start/server");
  const exp = Number(token.split(".")[0]);
  const maxAge = Number.isFinite(exp) ? Math.max(60, Math.floor((exp - Date.now()) / 1000)) : 3600;
  const https = (getRequestHeader("x-forwarded-proto") ?? "").split(",")[0]?.trim() === "https";
  setCookie(ADMIN_ASSET_COOKIE, token, { httpOnly: true, sameSite: "strict", secure: https, path: ADMIN_ASSET_COOKIE_PATH, maxAge });
}

export async function clearAdminAssetCookie() {
  const { deleteCookie, setResponseHeader } = await import("@tanstack/react-start/server");
  deleteCookie(ADMIN_ASSET_COOKIE, { path: ADMIN_ASSET_COOKIE_PATH });
  setResponseHeader("cache-control", PRIVATE_NO_STORE);
}
