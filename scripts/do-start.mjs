#!/usr/bin/env node
/**
 * DigitalOcean App Platform / Docker entry.
 * Serves the Nitro node-server build on 0.0.0.0:$PORT (default 8080).
 */
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PORT = String(process.env.PORT || process.env.NITRO_PORT || "8080");
const HOST = process.env.HOST || process.env.NITRO_HOST || "0.0.0.0";

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

process.env.PORT = PORT;
process.env.NITRO_PORT = PORT;
process.env.HOST = HOST;
process.env.NITRO_HOST = HOST;
process.env.NODE_ENV = process.env.NODE_ENV || "production";

const child = spawn(process.execPath, [entry], {
  cwd: ROOT,
  env: process.env,
  stdio: "inherit",
});
child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
