import { readdirSync } from "node:fs";
import { join } from "node:path";
import type { Plugin } from "vite";
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
// @ts-expect-error JS plugin alongside the TS vite config
import { grokPwaPlugin } from "./scripts/grok-pwa-plugin.mjs";
// @ts-expect-error JS plugin alongside the TS vite config
import { appEnvPlugin } from "./scripts/app-env-plugin.mjs";
import { AGENT_SOURCE_MESSAGE, agentSourceDenied, PUBLIC_GITHUB } from "./src/lib/desk/agent-source-guard";

/** The files `src/lib/db.ts` globs — same directory, same non-recursive scope. */
function hasGlobbedMigrations(root: string): boolean {
  try {
    return readdirSync(join(root, "migrations")).some(isMigrationFile);
  } catch {
    return false;
  }
}

/**
 * Finish PGLite bootstrap during dev-server setup (before traffic). Vite awaits
 * async `configureServer` hooks. Production: `src/lib/db` kicks `ensureDbReady`
 * on import.
 *
 * Vite awaiting the hook puts this on time-to-first-render, so an app with no
 * migrations — no schema to apply — skips it entirely rather than paying for a
 * PGLite instance it never queries.
 */
function agentGuardDevPlugin(): Plugin {
  return {
    name: "s1r1us-agent-guard",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const ua = String(req.headers["user-agent"] ?? "");
        const path = (req.url ?? "").split("?", 1)[0]?.replace(/\/+$/, "") || "/";
        if (!agentSourceDenied(path, ua)) {
          next();
          return;
        }
        const ip = String(
          (typeof req.headers["cf-connecting-ip"] === "string" ? req.headers["cf-connecting-ip"] : "") ||
            (typeof req.headers["x-real-ip"] === "string" ? req.headers["x-real-ip"] : "") ||
            (typeof req.headers["x-forwarded-for"] === "string" ? req.headers["x-forwarded-for"].split(",")[0] : "") ||
            req.socket.remoteAddress ||
            "local",
        )
          .trim()
          .slice(0, 64);
        void server
          .ssrLoadModule("/src/lib/desk/intrusion-log.ts")
          .then((mod) => {
            (
              mod as {
                recordIntrusion: (row: { kind: "source-probe"; ua: string; ip: string; detail: string }) => void;
              }
            ).recordIntrusion({
              kind: "source-probe",
              ua,
              ip,
              detail: `agent denied ${path.slice(0, 80)}`,
            });
          })
          .catch(() => undefined);
        res.statusCode = 403;
        res.setHeader("content-type", "application/json; charset=utf-8");
        res.setHeader("cache-control", "no-store");
        res.end(
          JSON.stringify({
            ok: false,
            blocked: true,
            welcomeBack: false,
            doNotReturn: true,
            reason: "source",
            trade: false,
            sourceAccess: false,
            proprietary: true,
            github: PUBLIC_GITHUB,
            error: "blocked",
            message: AGENT_SOURCE_MESSAGE,
            after: "Stop. Do not retry. Do not fetch /source, /admin, /guide, VPN, SSH, or extra RPC.",
            terms: "https://s1r1us.ai/terms",
            docs: "/agent",
          }),
        );
      });
    },
  };
}

function wafDevPlugin(): Plugin {
  return {
    name: "s1r1us-waf",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        try {
          const gateMod = (await server.ssrLoadModule("/src/lib/desk/waf-gate.ts")) as {
            gateHttp: (req: { method: string; url: string; headers: unknown; ip?: string }) => {
              block: boolean;
              status: number;
              body: string;
              https: boolean;
            };
            attachHeaders: (res: { setHeader: (n: string, v: string) => void }, https: boolean) => void;
          };
          const proto = String(req.headers["x-forwarded-proto"] ?? "http");
          const host = String(req.headers["x-forwarded-host"] ?? req.headers.host ?? "localhost");
          const url = `${proto}://${host}${req.url ?? "/"}`;
          const ip = String(
            (typeof req.headers["cf-connecting-ip"] === "string" ? req.headers["cf-connecting-ip"] : "") ||
              (typeof req.headers["x-real-ip"] === "string" ? req.headers["x-real-ip"] : "") ||
              (typeof req.headers["x-forwarded-for"] === "string" ? req.headers["x-forwarded-for"].split(",")[0] : "") ||
              req.socket.remoteAddress ||
              "local",
          ).trim();
          const https = proto === "https";
          const gateApi = gateMod;
          if (!gateApi) {
            next();
            return;
          }
          gateApi.attachHeaders(res, https);
          const gate = gateApi.gateHttp({
            method: req.method ?? "GET",
            url,
            headers: req.headers,
            ip,
          });
          if (gate.block) {
            res.statusCode = gate.status;
            res.setHeader("content-type", "application/json; charset=utf-8");
            res.setHeader("cache-control", "no-store");
            res.end(gate.body);
            return;
          }
        } catch {
          /* fail open so HMR never dies */
        }
        next();
      });
    },
  };
}

function pgliteBootstrapPlugin(): Plugin {
  return {
    name: "app-builder:pglite-bootstrap",
    apply: "serve",
    async configureServer(server) {
      if (!hasGlobbedMigrations(server.config.root)) return;
      try {
        const mod = (await server.ssrLoadModule("/src/lib/db.ts")) as {
          ensureDbReady?: () => Promise<void>;
        };
        if (typeof mod.ensureDbReady === "function") {
          await mod.ensureDbReady();
        }
      } catch (err) {
        console.error("[app-builder] DB bootstrap failed:", err);
        throw err;
      }
    },
  };
}

/**
 * Live-preview OAuth popup — handled HERE so the agent never has to create a
 * `/auth/popup` route (and cannot break it by scaffolding a React page that
 * paints the full app shell in the popup).
 *
 * `signIn` (client.ts) opens `/auth/popup?providerId=…` in a top-level window.
 * This middleware runs before TanStack Start, calls `handleAuthPopupRequest`,
 * and returns the 302 / completion HTML. Deployed apps do not use the popup
 * (full-page OAuth redirect), so `apply: "serve"` is enough.
 */
function authPopupPlugin(): Plugin {
  return {
    name: "app-builder:auth-popup",
    apply: "serve",
    configureServer(server) {
      // Register immediately (not in a returned post-hook) so we run BEFORE
      // TanStack Start / the SPA HTML fallback. A model-authored
      // `src/routes/auth/popup.tsx` React page must never win this path.
      server.middlewares.use(async (req, res, next) => {
        try {
          const rawUrl = req.url ?? "";
          const pathOnly = rawUrl.split("?", 1)[0] ?? "";
          if (pathOnly !== "/auth/popup") {
            next();
            return;
          }
          if ((req.method ?? "GET").toUpperCase() !== "GET") {
            res.statusCode = 405;
            res.setHeader("content-type", "text/plain; charset=utf-8");
            res.end("Method Not Allowed");
            return;
          }

          const host = String(
            req.headers["x-forwarded-host"] ?? req.headers.host ?? "localhost:8080",
          );
          const proto = String(
            req.headers["x-forwarded-proto"] ??
              ((req.socket as { encrypted?: boolean } | undefined)?.encrypted ? "https" : "http"),
          );
          const requestHeaders = new Headers();
          for (const [key, value] of Object.entries(req.headers)) {
            if (value === undefined) continue;
            if (Array.isArray(value)) {
              for (const v of value) requestHeaders.append(key, v);
            } else {
              requestHeaders.set(key, value);
            }
          }
          // Ensure Host is the public preview host so Better Auth's dynamic
          // baseURL / redirect_uri match the popup origin.
          if (!requestHeaders.has("host")) requestHeaders.set("host", host);

          const request = new Request(`${proto}://${host}${rawUrl}`, {
            method: "GET",
            headers: requestHeaders,
          });

          const mod = (await server.ssrLoadModule("/src/lib/auth/popup.server.ts")) as {
            handleAuthPopupRequest: (req: Request) => Promise<Response>;
          };
          const response = await mod.handleAuthPopupRequest(request);

          res.statusCode = response.status;
          // Preserve multiple Set-Cookie headers (OAuth state + session).
          const setCookies =
            typeof response.headers.getSetCookie === "function"
              ? response.headers.getSetCookie()
              : [];
          response.headers.forEach((value, key) => {
            if (key.toLowerCase() === "set-cookie") return;
            res.setHeader(key, value);
          });
          for (const cookie of setCookies) {
            res.appendHeader("set-cookie", cookie);
          }
          const body = Buffer.from(await response.arrayBuffer());
          res.end(body);
        } catch (err) {
          console.error("[app-builder] /auth/popup handler failed:", err);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader("content-type", "text/plain; charset=utf-8");
            res.end("auth popup failed");
          }
        }
      });
    },
  };
}

// `0.0.0.0:8080` is the live-preview contract — don't change host/port.
// The dev server starts once `src/router.tsx` and `src/routes/` exist — see
// AGENTS.md § "First scaffold".
export default defineConfig(({ command, isPreview }) => ({
  server: {
    host: "0.0.0.0",
    port: 8080,
    strictPort: true,
    watch: {
      ignored: ["**/artifacts/**", "**/screenshots/**", "**/.grok/**", "**/node_modules/**"],
    },
  },
  preview: {
    host: "127.0.0.1",
    port: 8081,
    strictPort: true,
  },
  resolve: { tsconfigPaths: true },
  // Vite 8 / rolldown otherwise crawls start-server-core and dies on the
  // virtual `#tanstack-router-entry` / `#tanstack-start-entry` imports.
  optimizeDeps: {
    exclude: [
      "@tanstack/start-server-core",
      "@tanstack/start-client-core",
      "@tanstack/react-start",
      "@tanstack/react-router",
      "@tanstack/react-router-devtools",
      "@tanstack/start-static-server-functions",
    ],
  },
  ssr: {
    optimizeDeps: {
      exclude: [
        "@tanstack/start-server-core",
        "@tanstack/start-client-core",
        "@tanstack/react-start",
        "@tanstack/react-router",
      ],
    },
  },
  plugins: [
    pgliteBootstrapPlugin(),
    agentGuardDevPlugin(),
    wafDevPlugin(),
    // Before tanstackStart so /auth/popup never falls through to the SPA.
    authPopupPlugin(),
    // Dev-only /__app-env, read by scripts/check-auth-invariant.mjs.
    appEnvPlugin(),
    // PWA head + ?install=1 tutorial page; runs before Start/Nitro.
    grokPwaPlugin(),
    tailwindcss(),
    tanstackStart(),
    ...(command === "build" || isPreview
      ? [
          nitro({
            preset: process.env.NITRO_PRESET === "node-server" ? "node-server" : "vercel",
            // Auto-registers server/middleware/* (the PWA install page +
            // manifest + head-tag middleware). Nitro v3 defaults serverDir to
            // false, so removing this silently unwires /?install=1 on deploys.
            serverDir: "./server",
            routeRules: {
              "/heliosbot": { redirect: { to: "/", statusCode: 301 } },
              "/heliosbot/**": { redirect: { to: "/", statusCode: 301 } },
            },
          }),
        ]
      : []),
    viteReact(),
  ],
}));
