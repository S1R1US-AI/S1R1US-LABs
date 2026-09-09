/**
 * Wave 3 — URI / origin identity for s1r1us.ai
 *
 * Security UI does not fix this. OAuth, WebAuthn, system admin, and phone
 * deep links all key off which host the request claims to be.
 *
 * Rules:
 *  1. Canonical system origin is https://s1r1us.ai
 *  2. Preview hosts (*.grok-sandbox.com, grok.me app guests) may serve the
 *     public tape only — never /admin, never system OAuth callback, never
 *     YubiKey / WebAuthn.
 *  3. System OAuth redirect_uri is always pinned to the canonical origin.
 *     A spoofed Host / X-Forwarded-Host cannot mint it.
 *  4. Phone copies use https://s1r1us.ai/app/admin (and s1r1us://app/admin
 *     / web+s1r1us://app/admin). System admin schemes are refused.
 *  5. Disagreeing Host vs X-Forwarded-Host vs Origin is a spoof → deny
 *     privileged planes.
 *  6. WebAuthn originAllowed is canonical or loopback only. Matching a
 *     foreign Host is not enough (that was the Host-swap hole).
 *
 * Do not import this from Grok template auth/server.ts (platform file).
 * Call classifyRequest() from desk access / hunter / well-known links.
 */

export const CANONICAL_HOST = "s1r1us.ai";
export const WWW_HOST = "www.s1r1us.ai";
export const CANONICAL_ORIGIN = "https://s1r1us.ai";
export const PHONE_SCHEME = "s1r1us";
export const PHONE_PROTOCOL = "web+s1r1us";
export const PHONE_SCHEMES = [PHONE_PROTOCOL, PHONE_SCHEME] as const;
export const SYSTEM_ADMIN_PATH = "/admin";
export const APP_ADMIN_PATH = "/app/admin";
export const OAUTH_CALLBACK_PREFIX = "/api/auth/oauth2/callback";

/** Same set as desk/tenancy SYSTEM_ONLY_PATHS. Preview must not serve these. */
export const SYSTEM_ONLY_PATHS = [
  "/admin",
  "/source",
  "/guide",
  "/security",
  "/launch",
  "/renew",
] as const;

export type Plane = "tape" | "system-admin" | "app-admin" | "oauth-callback";
export type HostKind = "canonical" | "www" | "preview" | "loopback" | "foreign";

export type ClassifyInput = {
  host?: string | null;
  forwardedHost?: string | null;
  origin?: string | null;
  path?: string | null;
  /** Custom scheme, e.g. s1r1us://app/admin or web+s1r1us://app/admin */
  href?: string | null;
};

export type ClassifyResult = {
  plane: Plane;
  hostKind: HostKind;
  host: string;
  allowed: boolean;
  spoof: boolean;
  redirectTo: string | null;
  oauthRedirectUri: string | null;
  reason: string;
  phoneHttps: string;
  phoneScheme: string;
  phoneProtocol: string;
};

function stripPort(h: string): string {
  const t = h.trim().toLowerCase();
  if (t.startsWith("[")) {
    const end = t.indexOf("]");
    return end >= 0 ? t.slice(1, end) : t;
  }
  return t.split(":")[0] ?? t;
}

export function normalizeHost(raw?: string | null): string {
  if (!raw) return "";
  const first = raw.split(",")[0]?.trim() ?? "";
  try {
    if (first.includes("://")) return stripPort(new URL(first).hostname);
  } catch {
    /* fall through */
  }
  return stripPort(first);
}

function stripKnownScheme(raw: string): string | null {
  const lower = raw.toLowerCase();
  for (const s of PHONE_SCHEMES) {
    if (lower.startsWith(`${s}:`)) {
      let p = raw.slice(s.length);
      p = p.replace(/^:/, "");
      p = p.replace(/^\/\//, "/");
      return p;
    }
  }
  return null;
}

export function pathOnly(raw?: string | null): string {
  if (!raw) return "/";
  let p = raw.trim();
  const stripped = stripKnownScheme(p);
  if (stripped != null) {
    p = stripped;
  } else {
    try {
      if (/^[a-z][a-z0-9+.-]*:\/\//i.test(p)) p = new URL(p).pathname;
    } catch {
      /* keep */
    }
  }
  p = p.split("?")[0]?.split("#")[0] ?? "/";
  if (!p.startsWith("/")) p = `/${p}`;
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return p || "/";
}

export function isLoopbackHost(host: string): boolean {
  const h = normalizeHost(host);
  return h === "localhost" || h === "127.0.0.1" || h === "::1";
}

export function isCanonicalHost(host: string): boolean {
  const h = normalizeHost(host);
  return h === CANONICAL_HOST || h === WWW_HOST;
}

export function isPreviewHost(host: string): boolean {
  const h = normalizeHost(host);
  if (!h) return false;
  if (h === "grok-sandbox.com" || h.endsWith(".grok-sandbox.com")) return true;
  if (h === "grok.me" || h.endsWith(".grok.me")) return true;
  if (h === "grok.com" || h.endsWith(".grok.com")) return true;
  return false;
}

export function hostKindOf(host: string): HostKind {
  const h = normalizeHost(host);
  if (isLoopbackHost(h)) return "loopback";
  if (h === WWW_HOST) return "www";
  if (h === CANONICAL_HOST) return "canonical";
  if (isPreviewHost(h)) return "preview";
  return "foreign";
}

export function classifyPath(path: string): Plane {
  const p = pathOnly(path);
  if (p === OAUTH_CALLBACK_PREFIX || p.startsWith(`${OAUTH_CALLBACK_PREFIX}/`)) {
    return "oauth-callback";
  }
  if (p === APP_ADMIN_PATH || p.startsWith(`${APP_ADMIN_PATH}/`)) return "app-admin";
  if (SYSTEM_ONLY_PATHS.some((d) => p === d || p.startsWith(`${d}/`))) {
    return "system-admin";
  }
  return "tape";
}

export function systemOauthRedirectUri(providerId = "x"): string {
  const id = providerId.replace(/[^a-z0-9_-]/gi, "") || "x";
  return `${CANONICAL_ORIGIN}${OAUTH_CALLBACK_PREFIX}/${id}`;
}

export function phoneAdminHttps(): string {
  return `${CANONICAL_ORIGIN}${APP_ADMIN_PATH}`;
}

export function phoneAdminScheme(): string {
  return `${PHONE_SCHEME}://${APP_ADMIN_PATH.replace(/^\//, "")}`;
}

export function phoneAdminProtocol(): string {
  return `${PHONE_PROTOCOL}://${APP_ADMIN_PATH.replace(/^\//, "")}`;
}

function isPhoneScheme(scheme: string): boolean {
  return (PHONE_SCHEMES as readonly string[]).includes(scheme.toLowerCase());
}

/** Phone custom-scheme → https. System admin scheme is refused. */
export function resolvePhoneHref(href: string): { ok: boolean; https: string | null; reason: string } {
  const raw = href.trim();
  if (!raw) return { ok: false, https: null, reason: "Empty deep link." };
  if (raw.startsWith("https://") || raw.startsWith("http://")) {
    const host = normalizeHost(raw);
    const path = pathOnly(raw);
    const plane = classifyPath(path);
    if (!isCanonicalHost(host) && !isLoopbackHost(host)) {
      return { ok: false, https: null, reason: "Phone links must land on s1r1us.ai." };
    }
    if (plane === "system-admin") {
      return { ok: false, https: null, reason: "Phone copies cannot open /admin." };
    }
    if (plane === "app-admin" || plane === "tape") {
      return { ok: true, https: `${CANONICAL_ORIGIN}${path}`, reason: "Pinned to canonical https." };
    }
    return { ok: false, https: null, reason: "That path is not a phone surface." };
  }
  const scheme = raw.split(":")[0]?.toLowerCase() ?? "";
  if (!isPhoneScheme(scheme)) {
    return {
      ok: false,
      https: null,
      reason: `Unknown scheme ${scheme}. Use ${PHONE_SCHEME}:, ${PHONE_PROTOCOL}:, or https://s1r1us.ai.`,
    };
  }
  const path = pathOnly(raw);
  if (classifyPath(path) === "system-admin") {
    return { ok: false, https: null, reason: `${scheme}://admin is refused. Use ${scheme}://app/admin.` };
  }
  if (path === "/" || path === APP_ADMIN_PATH || path.startsWith(`${APP_ADMIN_PATH}/`) || path.startsWith("/app")) {
    const dest = path === "/" ? APP_ADMIN_PATH : path.startsWith("/app") ? path : APP_ADMIN_PATH;
    return { ok: true, https: `${CANONICAL_ORIGIN}${dest}`, reason: "Mapped custom scheme to canonical https." };
  }
  return { ok: false, https: null, reason: "That deep link is not a copy-admin path." };
}

function originHost(origin?: string | null): string {
  if (!origin) return "";
  try {
    return normalizeHost(new URL(origin).hostname);
  } catch {
    return normalizeHost(origin);
  }
}

/**
 * WebAuthn / Yubi origin pin. Preview and foreign HTTPS hosts are never
 * allowed even if Host === Origin (that was the Host-swap hole).
 */
export function originAllowedPinned(origin: string): boolean {
  try {
    const u = new URL(origin);
    const host = u.hostname.toLowerCase();
    if (host === CANONICAL_HOST || host === WWW_HOST) return u.protocol === "https:";
    if (isLoopbackHost(host)) return u.protocol === "http:" || u.protocol === "https:";
    return false;
  } catch {
    return false;
  }
}

/** rpId is always the apex except loopback operator. Never a preview host. */
export function rpIdPinned(origin: string): string {
  try {
    const host = new URL(origin).hostname.toLowerCase();
    if (isLoopbackHost(host)) return host;
    return CANONICAL_HOST;
  } catch {
    return CANONICAL_HOST;
  }
}

/**
 * Privilege Host is the real Host header. X-Forwarded-Host cannot elevate.
 * classifyRequest still flags disagreement as spoof.
 */
export function privilegeHostFromHeaders(input: {
  host?: string | null;
  forwardedHost?: string | null;
}): string {
  return normalizeHost(input.host);
}

export function classifyRequest(input: ClassifyInput): ClassifyResult {
  const phone = input.href?.trim() ?? "";
  if (phone && /^https?:\/\//i.test(phone)) {
    try {
      const u = new URL(phone);
      return classifyRequest({
        host: u.hostname,
        path: u.pathname,
        origin: u.origin,
        forwardedHost: input.forwardedHost,
      });
    } catch {
      return {
        plane: "tape",
        hostKind: "foreign",
        host: "",
        allowed: false,
        spoof: false,
        redirectTo: null,
        oauthRedirectUri: null,
        reason: "Malformed https deep link.",
        phoneHttps: phoneAdminHttps(),
        phoneScheme: phoneAdminScheme(),
        phoneProtocol: phoneAdminProtocol(),
      };
    }
  }
  if (phone && /^[a-z][a-z0-9+.-]*:/i.test(phone) && !phone.toLowerCase().startsWith("http")) {
    const mapped = resolvePhoneHref(phone);
    const path = pathOnly(phone);
    const plane = classifyPath(path);
    return {
      plane: plane === "system-admin" ? "system-admin" : "app-admin",
      hostKind: "canonical",
      host: CANONICAL_HOST,
      allowed: mapped.ok,
      spoof: false,
      redirectTo: mapped.https,
      oauthRedirectUri: null,
      reason: mapped.reason,
      phoneHttps: phoneAdminHttps(),
      phoneScheme: phoneAdminScheme(),
      phoneProtocol: phoneAdminProtocol(),
    };
  }

  const host = privilegeHostFromHeaders(input);
  const forwarded = normalizeHost(input.forwardedHost);
  const oHost = originHost(input.origin);
  const path = pathOnly(input.path || phone || "/");
  const plane = classifyPath(path);
  const kind = hostKindOf(host);

  const hosts = [host, forwarded, oHost].filter(Boolean);
  const unique = new Set(hosts);
  const spoof =
    unique.size > 1 &&
    !(
      unique.size === 2 &&
      [...unique].every((h) => isCanonicalHost(h) || isLoopbackHost(h))
    );

  const wwwRedirect = kind === "www" ? `${CANONICAL_ORIGIN}${path}` : null;

  const oauthPinned = systemOauthRedirectUri("x");

  const base = {
    plane,
    hostKind: kind,
    host,
    spoof,
    redirectTo: wwwRedirect,
    oauthRedirectUri: plane === "oauth-callback" || plane === "system-admin" ? oauthPinned : null,
    phoneHttps: phoneAdminHttps(),
    phoneScheme: phoneAdminScheme(),
    phoneProtocol: phoneAdminProtocol(),
  };

  if (spoof) {
    return {
      ...base,
      allowed: false,
      reason:
        "Host / X-Forwarded-Host / Origin disagree. Privilege denied. PoC || GTFO.",
    };
  }

  if (!host) {
    return { ...base, allowed: false, reason: "Missing Host." };
  }

  if (plane === "tape") {
    if (kind === "foreign") {
      return { ...base, allowed: false, reason: "Unknown host. Tape is s1r1us.ai or a Grok preview guest." };
    }
    return {
      ...base,
      allowed: true,
      reason:
        kind === "preview"
          ? "Preview host: public tape only. Admin and system OAuth stay on s1r1us.ai."
          : "Canonical (or loopback) tape.",
    };
  }

  if (plane === "app-admin") {
    if (kind === "canonical" || kind === "www" || kind === "loopback") {
      return { ...base, allowed: true, reason: "Copy-admin on canonical / loopback. Cannot mint system HMAC." };
    }
    return { ...base, allowed: false, reason: "Copy-admin is not served on preview hosts. Use https://s1r1us.ai/app/admin." };
  }

  if (plane === "system-admin") {
    if (kind === "canonical" || kind === "www" || kind === "loopback") {
      return { ...base, allowed: true, reason: "System admin only on s1r1us.ai (www aliases to apex) or local operator." };
    }
    return { ...base, allowed: false, reason: "Preview / foreign host cannot open /admin." };
  }

  // oauth-callback
  if (kind === "canonical" || kind === "www") {
    return {
      ...base,
      allowed: true,
      reason: `OAuth redirect_uri pinned to ${oauthPinned}. Preview Host is ignored.`,
    };
  }
  if (kind === "loopback") {
    return { ...base, allowed: true, reason: "Local operator OAuth on loopback." };
  }
  return {
    ...base,
    allowed: false,
    oauthRedirectUri: oauthPinned,
    reason: `Preview callback refused for system OAuth. Broker must see ${oauthPinned}.`,
  };
}

export function runHostSwapPoc(): {
  name: string;
  input: ClassifyInput;
  allowed: boolean;
  expectAllow: boolean;
  pass: boolean;
  reason: string;
}[] {
  const cases: { name: string; input: ClassifyInput; expectAllow: boolean }[] = [
    { name: "Canonical /admin", input: { host: "s1r1us.ai", path: "/admin" }, expectAllow: true },
    { name: "www /admin (alias)", input: { host: "www.s1r1us.ai", path: "/admin" }, expectAllow: true },
    { name: "Canonical tape", input: { host: "s1r1us.ai", path: "/" }, expectAllow: true },
    { name: "Preview tape", input: { host: "abc.preview.grok-sandbox.com", path: "/" }, expectAllow: true },
    { name: "Preview /admin", input: { host: "abc.preview.grok-sandbox.com", path: "/admin" }, expectAllow: false },
    { name: "Preview /security", input: { host: "abc.preview.grok-sandbox.com", path: "/security" }, expectAllow: false },
    { name: "Preview OAuth callback", input: { host: "abc.grok-sandbox.com", path: "/api/auth/oauth2/callback/x" }, expectAllow: false },
    { name: "Canonical OAuth callback", input: { host: "s1r1us.ai", path: "/api/auth/oauth2/callback/x" }, expectAllow: true },
    { name: "Evil host /admin", input: { host: "evil.example", path: "/admin" }, expectAllow: false },
    {
      name: "Host swap via X-Forwarded-Host",
      input: { host: "s1r1us.ai", forwardedHost: "evil.example", path: "/admin" },
      expectAllow: false,
    },
    {
      name: "Origin swap vs Host",
      input: { host: "s1r1us.ai", origin: "https://evil.example", path: "/api/auth/oauth2/callback/x" },
      expectAllow: false,
    },
    { name: "Phone https copy-admin", input: { href: "https://s1r1us.ai/app/admin" }, expectAllow: true },
    { name: "Phone scheme copy-admin", input: { href: "s1r1us://app/admin" }, expectAllow: true },
    { name: "Phone protocol copy-admin", input: { href: "web+s1r1us://app/admin" }, expectAllow: true },
    { name: "Phone scheme system admin", input: { href: "s1r1us://admin" }, expectAllow: false },
    { name: "Phone protocol system admin", input: { href: "web+s1r1us://admin" }, expectAllow: false },
    { name: "Preview copy-admin", input: { host: "guest.grok-sandbox.com", path: "/app/admin" }, expectAllow: false },
    { name: "Loopback /admin", input: { host: "127.0.0.1:8080", path: "/admin" }, expectAllow: true },
  ];
  return cases.map((c) => {
    const r = classifyRequest(c.input);
    return {
      name: c.name,
      input: c.input,
      allowed: r.allowed,
      expectAllow: c.expectAllow,
      pass: r.allowed === c.expectAllow,
      reason: r.reason,
    };
  });
}

export function uriHunterFinding() {
  const poc = runHostSwapPoc();
  const fail = poc.filter((p) => !p.pass);
  const originHoleClosed =
    originAllowedPinned("https://s1r1us.ai") &&
    !originAllowedPinned("https://evil.example") &&
    !originAllowedPinned("https://abc.preview.grok-sandbox.com") &&
    originAllowedPinned("http://127.0.0.1");
  const pass = fail.length === 0 && originHoleClosed;
  return {
    id: "h-uri",
    wp: "WP2 Auth · Wave 3 URI",
    title: "Host / Origin swap cannot mint system OAuth, WebAuthn, or /admin",
    severity: "HIGH" as const,
    status: pass ? ("PASS" as const) : ("OPEN" as const),
    proof: pass
      ? `PoC ${poc.length}/${poc.length} cases. redirect_uri stays ${systemOauthRedirectUri("x")}. WebAuthn origin is canonical/loopback only. Preview hosts tape-only.`
      : `OPEN: ${[
          ...fail.map((f) => f.name),
          originHoleClosed ? null : "WebAuthn origin pin",
        ]
          .filter(Boolean)
          .join("; ")}`,
    improve:
      "Keep BETTER_AUTH_URL=https://s1r1us.ai on DigitalOcean. Never trust X-Forwarded-Host to elevate. originAllowed is canonical/loopback only. Phone universal links → /app/admin only.",
  };
}

export const WAVE3_STEPS = [
  {
    id: "1",
    owner: "env",
    title: "Pin BETTER_AUTH_URL",
    body: "DigitalOcean live-production already lists BETTER_AUTH_URL=https://s1r1us.ai in .do/app.yaml. Confirm the encrypted dashboard value has no trailing slash and preview injection does not overwrite it on the production app.",
  },
  {
    id: "2",
    owner: "code",
    title: "Close the WebAuthn Host-swap hole",
    body: "originAllowed used to allow any https origin if Host matched Origin, and requestHost preferred X-Forwarded-Host. Wave 3 pins both: originAllowedPinned (canonical/loopback only) and privilege Host from the real Host header.",
  },
  {
    id: "3",
    owner: "broker",
    title: "Register one OAuth callback with the Grok broker",
    body: "Production GROK_AUTH_CLIENT_* must allow only https://s1r1us.ai/api/auth/oauth2/callback/x and /google. Do not list *.grok-sandbox.com on the live client.",
  },
  {
    id: "4",
    owner: "edge",
    title: "www → apex",
    body: "Redirect https://www.s1r1us.ai/* → https://s1r1us.ai$uri. WebAuthn rpId stays s1r1us.ai. Confirm the load balancer does not let clients set X-Forwarded-Host.",
  },
  {
    id: "5",
    owner: "env",
    title: "Phone universal links",
    body: "AASA and assetlinks routes already exist. Fill APPLE_TEAM_ID (10-char) and ANDROID_SHA256 in DigitalOcean so Apple/Play actually associate. Paths exclude /admin and /app/admin as universal links (copy-admin stays in the PWA). Schemes: s1r1us:// and web+s1r1us://.",
  },
  {
    id: "6",
    owner: "code",
    title: "Gate /admin in the router",
    body: "Import classifyRequest() in desk access / Nitro hook. Preview or foreign host on /admin, /source, /guide, /security → 403 + intrusion log. Do not rewrite src/lib/auth/server.ts.",
  },
  {
    id: "7",
    owner: "code",
    title: "Hunter h-uri",
    body: "Add uriHunterFinding() to runHunter() findings. Morning report Security analysis: one line on URI pin PASS/OPEN.",
  },
  {
    id: "8",
    owner: "release",
    title: "Stay on checkpoint 68 until this lands",
    body: "Do not invent checkpoint 101. Merge wave-3-uri, rebuild .output, push main (autodeploy). After DigitalOcean is green, cut the next official tag. Two prior folds are already on main; this is the third set.",
  },
] as const;
