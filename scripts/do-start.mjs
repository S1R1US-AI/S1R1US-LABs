#!/usr/bin/env node
/**
 * DigitalOcean App Platform / Docker entry.
 *
 * Security path A — soft-launch front-door static overlay:
 * - External PORT (default 8080): tiny Node HTTP front door
 * - Serves front-door-static/ for home, hello-world, discord, roadmap, 7 desk overlays + shared assets
 * - Proxies everything else to Nitro on internal 8081
 *
 * Soft-launch routes (/, /hello-world, /discord, /roadmap, /r0b0ts, /h1v3, /pr3d, /faq, /compute, /gm, /f33d, /forum, /agent, /board, /labs, /owl, /app, /ios, /play, /c0ff33, /sponsor-…, /media, /b3ars, /l0ck, /bowl, /w0rld, /c0ut, /Bitcoin-Miners, /wh1t3, /s1r1us, /sitemap, /search, /terms, /privacy) always overlay — no env gate.
 * Does not touch Grok live preview (:8080 dev) or regenerate .output.
 */
import { createReadStream, existsSync, statSync } from "node:fs";
import { spawn } from "node:child_process";
import http from "node:http";
import { dirname, extname, join, resolve, sep } from "node:path";
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
const entry = candidates.find((p) => existsSync(p));
if (!entry) {
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
};

function safeJoin(root, urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0].split("#")[0]);
  const cleaned = decoded.replace(/^\/+/, "");
  if (cleaned.includes("\0") || cleaned.split(/[/\\]/).some((p) => p === "..")) {
    return null;
  }
  const target = resolve(root, cleaned);
  const rootResolved = resolve(root);
  if (target !== rootResolved && !target.startsWith(rootResolved + sep)) {
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
  const prefixes = ["/hello-world", "/discord", "/roadmap", "/r0b0ts", "/h1v3", "/pr3d", "/faq", "/compute", "/gm", "/f33d", "/forum", "/agent", "/board", "/labs", "/owl", "/app", "/ios", "/play", "/c0ff33", "/sponsor-ai-bitcoin-trading-bot", "/media", "/b3ars", "/l0ck", "/bowl", "/w0rld", "/c0ut", "/Bitcoin-Miners", "/wh1t3", "/s1r1us", "/sitemap", "/search", "/terms", "/privacy", "/css", "/js", "/images"];
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

async function serveStatic(res, absPath) {
  const type = MIME[extname(absPath).toLowerCase()] || "application/octet-stream";
  res.writeHead(200, {
    "Content-Type": type,
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "public, max-age=60",
  });
  await pipeline(createReadStream(absPath), res);
}

function proxyToNitro(req, res) {
  const headers = { ...req.headers, host: `127.0.0.1:${NITRO_INTERNAL_PORT}` };
  const opts = {
    hostname: "127.0.0.1",
    port: Number(NITRO_INTERNAL_PORT),
    path: req.url,
    method: req.method,
    headers,
  };
  const upstream = http.request(opts, (up) => {
    res.writeHead(up.statusCode || 502, up.headers);
    up.pipe(res);
  });
  upstream.on("error", (err) => {
    console.error("[s1r1us] nitro proxy error:", err.message);
    if (!res.headersSent) {
      res.writeHead(502, { "Content-Type": "text/plain; charset=utf-8" });
    }
    res.end("Bad Gateway");
  });
  req.pipe(upstream);
}

function startFrontDoor() {
  const server = http.createServer(async (req, res) => {
    const url = req.url || "/";
    let pathname = "/";
    try {
      pathname = new URL(url, "http://localhost").pathname;
    } catch {
      pathname = url.split("?")[0] || "/";
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
    ];
    if (dirExact.includes(pathname)) {
      const q = (url.includes("?") ? url.slice(url.indexOf("?")) : "");
      const loc = pathname + "/" + q;
      console.log(`[s1r1us] front-door static overlay 308 ${pathname} → ${pathname}/`);
      res.writeHead(308, { Location: loc, "Cache-Control": "public, max-age=60" });
      res.end();
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
        await serveStatic(res, abs);
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
    const staticOnlyPrefixes = ["/css/", "/js/", "/images/", "/hello-world/", "/discord/", "/roadmap/", "/r0b0ts/", "/h1v3/", "/pr3d/", "/faq/", "/compute/", "/gm/", "/f33d/", "/forum/", "/agent/", "/board/", "/labs/", "/owl/", "/app/", "/ios/", "/play/", "/c0ff33/", "/sponsor-ai-bitcoin-trading-bot/", "/media/", "/b3ars/", "/l0ck/", "/bowl/", "/w0rld/", "/c0ut/", "/Bitcoin-Miners/", "/wh1t3/", "/s1r1us/", "/sitemap/", "/search/", "/terms/", "/privacy/"];
    const staticOnlyExact = ["/hello-world", "/discord", "/roadmap", "/r0b0ts", "/h1v3", "/pr3d", "/faq", "/compute", "/gm", "/f33d", "/forum", "/agent", "/board", "/labs", "/owl", "/app", "/ios", "/play", "/c0ff33", "/sponsor-ai-bitcoin-trading-bot", "/media", "/b3ars", "/l0ck", "/bowl", "/w0rld", "/c0ut", "/Bitcoin-Miners", "/wh1t3", "/s1r1us", "/sitemap", "/search", "/terms", "/privacy", "/css", "/js", "/images"];
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
  });

  server.listen(Number(EXTERNAL_PORT), HOST, () => {
    console.log(
      `[s1r1us] front-door listening on ${HOST}:${EXTERNAL_PORT}; nitro internal :${NITRO_INTERNAL_PORT}; static=${STATIC_ROOT}`,
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
