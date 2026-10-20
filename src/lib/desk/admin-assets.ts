/**
 * Admin-only page code is moved out of the public folder at build time and
 * served only to a signed-in system admin. Pure helpers (no I/O) so tests can
 * exercise every request shape.
 */

/** Cookie that lets the browser load admin page code. HttpOnly; asset path only. */
export const ADMIN_ASSET_COOKIE = "s1r1_adm";
export const ADMIN_ASSET_COOKIE_PATH = "/assets/";
export const ADMIN_ASSET_HEADERS = {
  "cache-control": "private, no-store",
  vary: "Cookie",
  "x-content-type-options": "nosniff",
} as const;

/**
 * Normalize a request path however the request spells it: percent-encoding
 * (including %2F and %5C), backslashes, repeated slashes, case, query, and a
 * trailing `.map`. Returns the bare lower-case asset file name, or null when
 * the path is not under /assets/.
 */
export function assetNameOf(rawPath: string): string | null {
  let p = rawPath.split("?", 1)[0]!.split("#", 1)[0]!;
  for (let i = 0; i < 3; i++) {
    try {
      const next = decodeURIComponent(p);
      if (next === p) break;
      p = next;
    } catch {
      break;
    }
  }
  p = p.replace(/\\/g, "/").replace(/\/{2,}/g, "/").toLowerCase();
  const m = /^\/?assets\/(.+)$/.exec(p);
  if (!m) return null;
  const name = m[1]!.split("/").pop() ?? "";
  return name ? name.replace(/\.map$/, "") : null;
}

/** True when the normalized name is one of the gated admin files. */
export function isGatedAsset(rawPath: string, gated: ReadonlySet<string>): boolean {
  const name = assetNameOf(rawPath);
  if (!name) return false;
  return gated.has(name);
}

/**
 * Decide the answer for a request that reached the gate. Source maps never ship.
 * Exact gated name + admin session → serve. Everything else → 404.
 */
export function adminAssetDecision(rawPath: string, gated: ReadonlySet<string>, isAdmin: boolean): { serve: string | null; status: 200 | 404 } {
  const name = assetNameOf(rawPath);
  if (!name || !gated.has(name)) return { serve: null, status: 404 };
  const exact = rawPath.split("?", 1)[0]!;
  if (/\.map$/i.test(exact)) return { serve: null, status: 404 };
  if (!isAdmin) return { serve: null, status: 404 };
  return { serve: name, status: 200 };
}

/** Read one cookie value from a Cookie header. */
export function cookieValue(header: string | null | undefined, name: string): string | undefined {
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const i = part.indexOf("=");
    if (i < 0) continue;
    if (part.slice(0, i).trim() === name) {
      try {
        return decodeURIComponent(part.slice(i + 1).trim());
      } catch {
        return undefined;
      }
    }
  }
  return undefined;
}
