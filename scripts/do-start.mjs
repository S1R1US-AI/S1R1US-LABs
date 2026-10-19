#!/usr/bin/env node
/**
 * DigitalOcean App Platform / Docker entry.
 *
 * Security path A — soft-launch front-door static overlay:
 * - External PORT (default 8080): tiny Node HTTP front door
 * - Serves front-door-static/ for home, hello-world, discord, roadmap, Research, desk overlays + shared assets
 * - Proxies everything else to Nitro on internal 8081
 *
 * Soft-launch routes (/, /hello-world, /discord, /roadmap, /r0b0ts, /h1v3, /pr3d, /faq, /compute, /gm, /f33d, /forum, /agent, /board, /labs, /owl, /app, /ios, /play, /c0ff33, /sponsor-…, /media, /b3ars, /l0ck, /bowl, /w0rld, /c0ut, /Bitcoin-Miners, /wh1t3, /s1r1us, /sitemap, /search, /terms, /privacy, /copyright-terms, /WEB-3-and-ai-future) always overlay — no env gate.
 * Does not touch Grok live preview (:8080 dev) or regenerate .output.
 */
import { createReadStream, existsSync, realpathSync, statSync } from "node:fs";
import { spawn } from "node:child_process";
import http from "node:http";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline } from "node:stream/promises";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const EXTERNAL_PORT = String(process.env.PORT || process.env.NITRO_PORT || "8080");
const HOST = process.env.HOST || process.env.NITRO_HOST || "0.0.0.0";
const NITRO_INTERNAL_PORT = "8081";
const STATIC_ROOT = join(ROOT, "front-door-static");

const candidates = [
  join(ROOT, ".output/server/index.mjs"),
  join(ROOT, ".output/server/index.js"),
  join(ROOT, "dist/server/index.mjs"),
];
// Only boot when run directly (node scripts/do-start.mjs); importing for tests must not spawn Nitro.
const IS_MAIN = (() => {
  try {
    return Boolean(process.argv[1]) && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
})();
const entry = candidates.find((p) => existsSync(p));
if (IS_MAIN && !entry) {
  console.error(
    "[s1r1us] no node-server build. On DigitalOcean the Docker image must run npm run build:do (NITRO_PRESET=node-server).",
  );
  process.exit(1);
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

function safeJoin(root, urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath.split("?")[0].split("#")[0]);
  } catch {
    return null;
  }
  const cleaned = decoded.replace(/^\/+/, "");
  if (cleaned.includes("\0") || cleaned.split(/[/\\]/).some((p) => p === "..")) {
    return null;
  }
  const target = resolve(root, cleaned);
  const rootResolved = resolve(root);
  if (target !== rootResolved && !target.startsWith(rootResolved + sep)) {
    return null;
  }
  // Explicit containment barrier (CodeQL js/path-injection recognizes this form):
  // a path that escapes root has a relative form of ".." or "../…".
  const rel = relative(rootResolved, target);
  if (rel === ".." || rel.startsWith(".." + sep)) {
    return null;
  }
  return target;
}

function fileIfExists(absPath) {
  if (!absPath || !existsSync(absPath)) return null;
  try {
    const st = statSync(absPath);
    if (st.isFile()) return absPath;
    if (st.isDirectory()) {
      const index = join(absPath, "index.html");
      if (existsSync(index) && statSync(index).isFile()) return index;
    }
  } catch {
    return null;
  }
  return null;
}

/** Map request pathname → absolute file under front-door-static, or null to proxy. */
function resolveStatic(pathname) {
  if (!existsSync(STATIC_ROOT)) return null;

  // Exact home
  if (pathname === "/" || pathname === "/index.html") {
    return fileIfExists(join(STATIC_ROOT, "index.html"));
  }

  // Root favicon aliases → pack images (only if present)
  const faviconMap = {
    "/favicon.ico": "images/favicon.ico",
    "/favicon.svg": "images/favicon.svg",
    "/apple-touch-icon.png": "images/apple-touch-icon.png",
  };
  if (Object.prototype.hasOwnProperty.call(faviconMap, pathname)) {
    return fileIfExists(join(STATIC_ROOT, faviconMap[pathname]));
  }

  // Prefix routes: hello-world, discord, roadmap, 7 desk overlays, css, js, images
  const prefixes = ["/hello-world", "/discord", "/roadmap", "/r0b0ts", "/h1v3", "/pr3d", "/faq", "/compute", "/gm", "/f33d", "/forum", "/agent", "/board", "/labs", "/owl", "/app", "/ios", "/play", "/c0ff33", "/sponsor-ai-bitcoin-trading-bot", "/media", "/b3ars", "/l0ck", "/bowl", "/w0rld", "/c0ut", "/Bitcoin-Miners", "/wh1t3", "/s1r1us", "/sitemap", "/search", "/terms", "/privacy", "/copyright-terms", "/WEB-3-and-ai-future", "/sense1-engineering", "/sai-citizens-united", "/manifesto", "/oss-marketing", "/newsletter", "/escape-the-matrix", "/global-uprisings", "/future", "/cosmic-c0d3", "/blast-off", "/book-dj-mo-funky", "/dmt", "/dripped-out-matrix", "/hindu-teachings", "/css", "/js", "/images"];
  const hit = prefixes.find(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
  if (!hit) return null;

  const abs = safeJoin(STATIC_ROOT, pathname);
  if (!abs) return null; // traversal → treat as miss (will 404 via missing file or proxy)

  // Directory without trailing slash: serve index if present
  const asFile = fileIfExists(abs);
  if (asFile) return asFile;

  // /hello-world → /hello-world/index.html etc.
  if (pathname === hit || pathname === hit + "/") {
    return fileIfExists(join(STATIC_ROOT, hit.slice(1), "index.html"));
  }

  return null;
}

/** Weak validator from size + mtime; used for ETag and If-Range matching. */
export function staticValidators(st) {
  return {
    etag: `W/"${st.size.toString(16)}-${Math.floor(st.mtimeMs).toString(16)}"`,
    lastModified: new Date(Math.floor(st.mtimeMs / 1000) * 1000).toUTCString(),
  };
}

/**
 * If-Range: a partial response is allowed only when the validator matches the
 * current representation. Weak ETags are not strong validators per RFC 9110,
 * but this server's W/"size-mtime" is stable for an unchanged file, so we accept
 * an exact match (as Express/send does). HTTP-date must equal Last-Modified.
 */
function ifRangeMatches(ifRange, v) {
  const val = String(ifRange).trim();
  if (val.startsWith('"') || val.startsWith("W/")) return val === v.etag;
  const t = Date.parse(val);
  return !Number.isNaN(t) && t === Date.parse(v.lastModified);
}

export async function serveStatic(res, absPath, req) {
  const type = MIME[extname(absPath).toLowerCase()] || "application/octet-stream";
  const st = statSync(absPath);
  const size = st.size;
  const v = staticValidators(st);
  const method = (req && req.method) || "GET";
  const base = {
    "Content-Type": type,
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "public, max-age=60",
    "Accept-Ranges": "bytes",
    ETag: v.etag,
    "Last-Modified": v.lastModified,
  };
  const headers = (req && req.headers) || {};
  // Ranges apply only to GET; HEAD gets full 200 headers. Unmatched If-Range → full 200.
  const range =
    method === "GET" && headers.range && (headers["if-range"] == null || ifRangeMatches(headers["if-range"], v))
      ? headers.range
      : null;
  if (range) {
    const m = /^bytes=(\d*)-(\d*)$/.exec(String(range).trim());
    let start = m && m[1] !== "" ? Number(m[1]) : NaN;
    let end = m && m[2] !== "" ? Number(m[2]) : NaN;
    if (m && m[1] === "" && m[2] !== "") {
      start = Math.max(0, size - end);
      end = size - 1;
      if (Number(m[2]) === 0) start = size; // bytes=-0 is unsatisfiable
    } else if (m && !Number.isNaN(start) && Number.isNaN(end)) {
      end = size - 1;
    }
    if (!m || Number.isNaN(start) || Number.isNaN(end) || start > end || start >= size) {
      res.writeHead(416, { ...base, "Content-Range": `bytes */${size}` });
      res.end();
      return;
    }
    end = Math.min(end, size - 1);
    res.writeHead(206, {
      ...base,
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Content-Length": String(end - start + 1),
    });
    await pipeline(createReadStream(absPath, { start, end }), res);
    return;
  }
  res.writeHead(200, { ...base, "Content-Length": String(size) });
  if (method === "HEAD") return void res.end();
  await pipeline(createReadStream(absPath), res);
}

// Upstream port for the proxy; startFrontDoor() may override it (tests use a stub upstream).
let upstreamPort = NITRO_INTERNAL_PORT;

// Our own public hosts (mirrors PUBLIC_SITE_HOSTS in src/lib/auth/server.ts).
export const OWN_HOSTS = new Set(["s1r1us.ai", "www.s1r1us.ai"]);
// External https hosts an upstream redirect may point to: native X OAuth only (Better Auth
// `twitter` provider, https://x.com/i/oauth2/authorize). The Grok broker is off in production.
// Kept in sync by scripts/front-proxy-location.test.mjs.
export const TRUSTED_REDIRECT_HOSTS = new Set([
  "x.com",
  "www.x.com",
  "api.x.com",
  "twitter.com",
  "www.twitter.com",
  "api.twitter.com",
]);

/** True for loopback / unspecified hosts as WHATWG URL serializes them (case-insensitive). */
export function isInternalHost(hostname) {
  let h = String(hostname || "").toLowerCase();
  if (h.endsWith(".")) h = h.slice(0, -1);
  if (h === "localhost" || h.endsWith(".localhost")) return true;
  if (/^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(h) || /^0\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(h)) return true;
  if (h.startsWith("[") && h.endsWith("]")) h = h.slice(1, -1);
  if (h === "::1" || h === "::") return true;
  // IPv4-mapped (::ffff:a.b.c.d or ::ffff:XXXX:XXXX): loopback 127/8 or 0/8
  const mapped = /^::ffff:(?:(\d{1,3})\.\d{1,3}\.\d{1,3}\.\d{1,3}|([0-9a-f]{1,4}):[0-9a-f]{1,4})$/.exec(h);
  if (mapped) {
    const first = mapped[1] != null ? Number(mapped[1]) : parseInt(mapped[2], 16) >> 8;
    return first === 127 || first === 0;
  }
  return false;
}

/** Drop ASCII tab/CR/LF/NUL anywhere and leading whitespace/control chars (browsers ignore them). */
function stripIgnorable(value) {
  const s = String(value).replace(/[\t\r\n]/g, "").split("\0").join("");
  let i = 0;
  while (i < s.length && s.charCodeAt(i) <= 0x20) i++;
  return s.slice(i);
}

/** Collapse leading slashes/backslashes so a path can never be read as another host. */
function singleLeadingSlash(path) {
  return "/" + String(path).replace(/^[/\\]+/, "");
}

/**
 * Upstream Location → safe value for the browser (allowlist):
 * - https on a TRUSTED_REDIRECT_HOSTS host (no credentials, default port) passes through;
 * - our own host or a loopback/internal host → same-origin relative path;
 * - any other absolute URL → "/";
 * - relative paths keep exactly one leading slash.
 */
export function safeLocation(loc) {
  if (loc == null) return loc;
  const s = stripIgnorable(Array.isArray(loc) ? loc[0] : loc);
  if (/^[a-z][a-z0-9+.-]*:/i.test(s)) {
    let u;
    try {
      u = new URL(s);
    } catch {
      return "/";
    }
    const host = u.hostname.toLowerCase().replace(/\.$/, "");
    if (u.protocol === "https:" && TRUSTED_REDIRECT_HOSTS.has(host) && !u.username && !u.password && !u.port) {
      return u.href;
    }
    if (OWN_HOSTS.has(host) || isInternalHost(host)) {
      return singleLeadingSlash(u.pathname) + u.search + u.hash;
    }
    return "/";
  }
  if (s.startsWith("/") || s.startsWith("\\")) return singleLeadingSlash(s);
  return s;
}

/**
 * Request target → origin-form. Returns { url } to continue, { status: 400 } to reject,
 * or { status: 308, location } for a same-origin redirect. Tab/CR/LF and leading whitespace
 * are dropped; backslashes (raw or %5C) are rejected; absolute-form targets drop their
 * authority; repeated leading slashes collapse.
 */
export function normalizeRequestTarget(raw) {
  let target = String(raw || "/");
  if (target.includes("\0")) return { status: 400 };
  target = stripIgnorable(target);
  if (!target.startsWith("/")) {
    if (target === "*" || target === "") return { status: 400 };
    try {
      const u = new URL(target);
      target = (u.pathname || "/") + u.search;
    } catch {
      return { status: 400 };
    }
  }
  const qAt = target.indexOf("?");
  const path = qAt === -1 ? target : target.slice(0, qAt);
  const query = qAt === -1 ? "" : target.slice(qAt);
  if (/\\|%5c/i.test(path)) return { status: 400 };
  if (/^\/{2,}/.test(path)) return { status: 308, location: singleLeadingSlash(path) + query };
  return { url: target };
}

function proxyToNitro(req, res) {
  const headers = { ...req.headers, host: `127.0.0.1:${upstreamPort}` };
  const opts = {
    hostname: "127.0.0.1",
    port: Number(upstreamPort),
    path: req.url,
    method: req.method,
    headers,
  };
  res.on("error", (err) => console.error("[s1r1us] client response error:", err.message));
  const upstream = http.request(opts, (up) => {
    up.on("error", () => res.destroy());
    const outHeaders = { ...up.headers };
    if (outHeaders.location != null) outHeaders.location = safeLocation(outHeaders.location);
    res.writeHead(up.statusCode || 502, outHeaders);
    up.pipe(res);
  });
  upstream.on("error", (err) => {
    console.error("[s1r1us] nitro proxy error:", err.message);
    if (!res.headersSent) {
      res.writeHead(502, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Bad Gateway");
    } else {
      res.destroy();
    }
  });
  req.pipe(upstream);
}

export function startFrontDoor({ port = EXTERNAL_PORT, host = HOST, nitroPort = NITRO_INTERNAL_PORT } = {}) {
  upstreamPort = String(nitroPort);
  const handleRequest = async (req, res) => {
    // Normalize the request target before any routing or proxying.
    const target = normalizeRequestTarget(req.url);
    if (target.status === 400) {
      console.log(`[s1r1us] front-door 400 request target`);
      res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Bad Request");
      return;
    }
    if (target.status === 308) {
      res.writeHead(308, { Location: target.location, "Cache-Control": "public, max-age=60" });
      res.end();
      return;
    }
    req.url = target.url;
    const url = req.url;
    let pathname = "/";
    try {
      pathname = new URL(url, "http://localhost").pathname;
    } catch {
      pathname = url.split("?")[0] || "/";
    }

    // Sensei HOLD fix: GET /search?q= must reach Nitro desk search — do not swallow with static overlay.
    // Bare /search (no q) still serves soft-launch marketing shell.
    try {
      const u = new URL(url, "http://localhost");
      const q = u.searchParams.get("q");
      if ((u.pathname === "/search" || u.pathname === "/search/") && q != null && String(q).length > 0) {
        console.log(`[s1r1us] front-door proxy Nitro search q ${req.method} ${u.pathname}`);
        return proxyToNitro(req, res);
      }
    } catch {
      /* fall through */
    }

    // Belt-and-suspenders: /roadmap → /roadmap/ etc. Absolute CSS is the real fix for theme-css-miss.
    const dirExact = [      "/hello-world",
      "/discord",
      "/roadmap",
      "/r0b0ts",
      "/h1v3",
      "/pr3d",
      "/faq",
      "/compute",
      "/gm",
      "/f33d",
      "/forum",
      "/agent",
      "/board",
      "/labs",
      "/owl",
      "/app",
      "/ios",
      "/play",
      "/c0ff33",
      "/sponsor-ai-bitcoin-trading-bot",
      "/media",
      "/b3ars",
      "/l0ck",
      "/bowl",
      "/w0rld",
      "/c0ut",
      "/Bitcoin-Miners",
      "/wh1t3",
      "/s1r1us",
      "/sitemap",
      "/search",
      "/terms",
      "/privacy",
      "/copyright-terms",
      "/WEB-3-and-ai-future",
      "/sense1-engineering",
      "/sai-citizens-united",
      "/manifesto",
      "/oss-marketing",
      "/newsletter",
      "/escape-the-matrix",
      "/global-uprisings",
      "/future",
      "/cosmic-c0d3",
      "/blast-off",
      "/book-dj-mo-funky",
      "/dmt",
      "/dripped-out-matrix",
      "/hindu-teachings",
    ];
    if (dirExact.includes(pathname)) {
      const q = (url.includes("?") ? url.slice(url.indexOf("?")) : "");
      const loc = pathname + "/" + q;
      console.log(`[s1r1us] front-door static overlay 308 ${pathname} → ${pathname}/`);
      res.writeHead(308, { Location: loc, "Cache-Control": "public, max-age=60" });
      res.end();
      return;
    }

    // Malformed percent-encoding in the path → 400 (never reaches static resolve or Nitro)
    try {
      decodeURIComponent(pathname);
    } catch {
      console.log(`[s1r1us] front-door 400 malformed path encoding`);
      res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Bad Request");
      return;
    }

    // Reject obvious traversal in path before static resolve
    if (pathname.includes("..") || pathname.includes("%2e%2e") || pathname.includes("%2E%2E")) {
      console.log(`[s1r1us] front-door static overlay 400 ${pathname}`);
      res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Bad Request");
      return;
    }

    const abs = resolveStatic(pathname);
    if (abs) {
      console.log(`[s1r1us] front-door static overlay ${req.method} ${pathname}`);
      try {
        await serveStatic(res, abs, req);
      } catch (err) {
        console.error("[s1r1us] static serve error:", err.message);
        if (!res.headersSent) {
          res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        }
        res.end("Internal Server Error");
      }
      return;
    }

    // Prefix claimed but file missing under front-door-static → 404 (do not fall through to Nitro for css/js/images ship paths that 404 today)
    const staticOnlyPrefixes = ["/css/", "/js/", "/images/", "/hello-world/", "/discord/", "/roadmap/", "/r0b0ts/", "/h1v3/", "/pr3d/", "/faq/", "/compute/", "/gm/", "/f33d/", "/forum/", "/agent/", "/board/", "/labs/", "/owl/", "/app/", "/ios/", "/play/", "/c0ff33/", "/sponsor-ai-bitcoin-trading-bot/", "/media/", "/b3ars/", "/l0ck/", "/bowl/", "/w0rld/", "/c0ut/", "/Bitcoin-Miners/", "/wh1t3/", "/s1r1us/", "/sitemap/", "/search/", "/terms/", "/privacy/", "/copyright-terms/", "/WEB-3-and-ai-future/", "/sense1-engineering/", "/sai-citizens-united/", "/manifesto/", "/oss-marketing/", "/newsletter/", "/escape-the-matrix/", "/global-uprisings/", "/future/", "/cosmic-c0d3/", "/blast-off/", "/book-dj-mo-funky/", "/dmt/", "/dripped-out-matrix/", "/hindu-teachings/"];
    const staticOnlyExact = ["/hello-world", "/discord", "/roadmap", "/r0b0ts", "/h1v3", "/pr3d", "/faq", "/compute", "/gm", "/f33d", "/forum", "/agent", "/board", "/labs", "/owl", "/app", "/ios", "/play", "/c0ff33", "/sponsor-ai-bitcoin-trading-bot", "/media", "/b3ars", "/l0ck", "/bowl", "/w0rld", "/c0ut", "/Bitcoin-Miners", "/wh1t3", "/s1r1us", "/sitemap", "/search", "/terms", "/privacy", "/copyright-terms", "/WEB-3-and-ai-future", "/sense1-engineering", "/sai-citizens-united", "/manifesto", "/oss-marketing", "/newsletter", "/escape-the-matrix", "/global-uprisings", "/future", "/cosmic-c0d3", "/blast-off", "/book-dj-mo-funky", "/dmt", "/dripped-out-matrix", "/hindu-teachings", "/css", "/js", "/images"];
    const claimed =
      staticOnlyExact.includes(pathname) ||
      staticOnlyPrefixes.some((p) => pathname.startsWith(p)) ||
      pathname === "/" ||
      pathname === "/index.html";
    if (claimed && pathname !== "/" && pathname !== "/index.html") {
      // /css /js /images without file: 404 as task says these 404 on live today when missing
      // For hello-world/discord if resolve missed, also 404
      if (
        pathname.startsWith("/css") ||
        pathname.startsWith("/js") ||
        pathname.startsWith("/images") ||
        pathname.startsWith("/hello-world") ||
        pathname.startsWith("/discord") ||
        pathname.startsWith("/roadmap") ||
        pathname.startsWith("/r0b0ts") ||
        pathname.startsWith("/h1v3") ||
        pathname.startsWith("/pr3d") ||
        pathname.startsWith("/faq") ||
        pathname.startsWith("/forum") ||
        pathname.startsWith("/agent") ||
        pathname.startsWith("/board") ||
        pathname.startsWith("/labs") ||
        pathname.startsWith("/owl") ||
        pathname.startsWith("/app") ||
        pathname.startsWith("/ios") ||
        pathname.startsWith("/play") ||
        pathname.startsWith("/c0ff33") ||
        pathname.startsWith("/sponsor-ai-bitcoin-trading-bot") ||
        pathname.startsWith("/media") ||
        pathname.startsWith("/b3ars") ||
        pathname.startsWith("/l0ck") ||
        pathname.startsWith("/bowl") ||
        pathname.startsWith("/w0rld") ||
        pathname.startsWith("/c0ut") ||
        pathname.startsWith("/Bitcoin-Miners") ||
        pathname.startsWith("/wh1t3") ||
        pathname.startsWith("/s1r1us") ||
        (pathname === "/sitemap" || pathname.startsWith("/sitemap/")) ||
        (pathname === "/search" || pathname.startsWith("/search/")) ||
        pathname.startsWith("/terms") ||
        pathname.startsWith("/privacy") ||
        pathname.startsWith("/copyright-terms") ||
        pathname.startsWith("/WEB-3-and-ai-future") ||
        pathname === "/sense1-engineering" || pathname.startsWith("/sense1-engineering/") ||
        pathname === "/sai-citizens-united" || pathname.startsWith("/sai-citizens-united/") ||
        pathname === "/manifesto" || pathname.startsWith("/manifesto/") ||
        pathname === "/oss-marketing" || pathname.startsWith("/oss-marketing/") ||
        pathname === "/newsletter" || pathname.startsWith("/newsletter/") ||
        pathname === "/escape-the-matrix" || pathname.startsWith("/escape-the-matrix/") ||
        pathname === "/global-uprisings" || pathname.startsWith("/global-uprisings/") ||
        pathname === "/future" || pathname.startsWith("/future/") ||
        pathname === "/cosmic-c0d3" || pathname.startsWith("/cosmic-c0d3/") ||
        pathname === "/blast-off" || pathname.startsWith("/blast-off/") ||
        pathname === "/book-dj-mo-funky" || pathname.startsWith("/book-dj-mo-funky/") ||
        pathname === "/dmt" || pathname.startsWith("/dmt/") ||
        pathname === "/dripped-out-matrix" || pathname.startsWith("/dripped-out-matrix/") ||
        pathname === "/hindu-teachings" || pathname.startsWith("/hindu-teachings/") ||
        pathname.startsWith("/compute") ||
        pathname.startsWith("/gm") ||
        pathname.startsWith("/f33d")
      ) {
        console.log(`[s1r1us] front-door static overlay 404 ${pathname}`);
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not Found");
        return;
      }
    }

    console.log(`[s1r1us] nitro proxy ${req.method} ${pathname}`);
    proxyToNitro(req, res);
  };

  const server = http.createServer(async (req, res) => {
    try {
      await handleRequest(req, res);
    } catch (err) {
      console.error("[s1r1us] front-door handler error:", err && err.message);
      if (!res.headersSent) {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Internal Server Error");
      } else {
        res.destroy();
      }
    }
  });

  server.listen(Number(port), host, () => {
    console.log(
      `[s1r1us] front-door listening on ${host}:${port}; nitro internal :${upstreamPort}; static=${STATIC_ROOT}`,
    );
  });

  return server;
}

// Spawn Nitro on internal 8081 (do not bind external PORT)
const nitroEnv = {
  ...process.env,
  PORT: NITRO_INTERNAL_PORT,
  NITRO_PORT: NITRO_INTERNAL_PORT,
  HOST: "127.0.0.1",
  NITRO_HOST: "127.0.0.1",
  NODE_ENV: process.env.NODE_ENV || "production",
};

if (IS_MAIN) {
const child = spawn(process.execPath, [entry], {
  cwd: ROOT,
  env: nitroEnv,
  stdio: "inherit",
});

child.on("spawn", () => {
  console.log(`[s1r1us] nitro spawned on 127.0.0.1:${NITRO_INTERNAL_PORT} (${entry})`);
  startFrontDoor();
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});

child.on("error", (err) => {
  console.error("[s1r1us] failed to spawn nitro:", err.message);
  process.exit(1);
});
}
