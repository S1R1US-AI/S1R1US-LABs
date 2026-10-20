#!/usr/bin/env node
/**
 * After `vite build`: move admin-only page code out of .output/public/assets
 * into .output/server/admin-assets. The server serves those files only to a
 * signed-in system admin (src/routes/assets.$.ts).
 *
 * A file is admin-only when it is reachable from the admin panel chunk and
 * not reachable from any other chunk without passing through the admin panel.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

export function refsOf(src) {
  const out = new Set();
  const re = /(?:\.\/|assets\/)([A-Za-z0-9_.$-]+\.js)\b/g;
  let m;
  while ((m = re.exec(src))) out.add(m[1]);
  return out;
}

/** files: Map<name, source>. Returns the sorted admin-only names. */
export function adminOnly(files, isAdminEntry) {
  const graph = new Map();
  for (const [name, src] of files) graph.set(name, [...refsOf(src)].filter((r) => r !== name && files.has(r)));
  const entries = [...files.keys()].filter(isAdminEntry);
  if (!entries.length) return [];
  const walk = (starts, skip) => {
    const seen = new Set();
    const stack = [...starts];
    while (stack.length) {
      const n = stack.pop();
      if (seen.has(n) || skip.has(n)) continue;
      seen.add(n);
      for (const r of graph.get(n) ?? []) stack.push(r);
    }
    return seen;
  };
  const adminReach = walk(entries, new Set());
  // Roots: the client entry (index-*.js) plus every chunk the admin panel never reaches.
  const roots = [...files.keys()].filter((n) => isClientEntry(n) || !adminReach.has(n));
  const pub = walk(roots, new Set(entries));
  return [...adminReach].filter((n) => !pub.has(n)).sort();
}

/** Drop gated files from Nitro's built-in public asset table so it never tries to serve them. */
export function dropFromAssetTable(src, names) {
  let out = src;
  const missing = [];
  for (const n of names) {
    const esc = n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`\\t"/assets/${esc}": \\{[^{}]*\\},?\\n`);
    if (!re.test(out)) missing.push(n);
    out = out.replace(re, "");
  }
  return { out, missing };
}

export const isClientEntry = (name) => /^index-[A-Za-z0-9_-]+\.js$/.test(name);
export const isAdminFamily = (name) => /^(?:admin|app_\.admin|btc-miners-panel|pdf)-[\w-]+\.js$/.test(name.toLowerCase());
export const isAdminPanelChunk = (name) => /^admin-panel-[A-Za-z0-9_-]+\.js$/.test(name);

/** Where each build target writes its output. */
export const TARGETS = {
  node: {
    pub: ".output/public/assets",
    server: ".output/server",
    entry: ".output/server/index.mjs",
    marker: ".output/nitro.json",
    preset: "node-server",
  },
  vercel: {
    pub: ".vercel/output/static/assets",
    server: ".vercel/output/functions/__server.func",
    entry: ".vercel/output/functions/__server.func/index.mjs",
    marker: ".vercel/output/nitro.json",
    config: ".vercel/output/config.json",
    preset: "vercel",
  },
};

const stampPath = (root, target) => join(root, "node_modules/.cache/admin-gate", `${target}.stamp`);

/** Before the build: note the start time so the gate can refuse output from an older build. */
export function beginBuild(root, target, now = Date.now()) {
  if (!TARGETS[target]) throw new Error(`unknown build target: ${target}`);
  mkdirSync(dirname(stampPath(root, target)), { recursive: true });
  writeFileSync(stampPath(root, target), String(now));
}

/** Null when the target's output exists and was written by the build that began last; else the reason. */
export function staleReason(root, target) {
  const t = TARGETS[target];
  if (!t) return `unknown build target: ${target}`;
  const stamp = stampPath(root, target);
  if (!existsSync(stamp)) return `no build start recorded for ${target}; run with --begin before the build`;
  const began = Number(readFileSync(stamp, "utf8"));
  for (const rel of [t.marker, t.pub, t.entry]) {
    if (!existsSync(join(root, rel))) return `expected ${target} output is missing: ${rel}`;
  }
  if (statSync(join(root, t.marker)).mtimeMs + 1000 < began) return `${target} output is older than this build`;
  try {
    const preset = JSON.parse(readFileSync(join(root, t.marker), "utf8")).preset;
    if (preset && preset !== t.preset && !String(preset).startsWith(t.preset)) return `${target} output was built with preset ${preset}`;
  } catch {
    return `${target} build marker is unreadable`;
  }
  return null;
}

/** Vercel: send gated names and admin-family misses to the server function, never publicly cached. */
export function vercelRoutes(config, gated) {
  const routes = Array.isArray(config.routes) ? config.routes : [];
  const priv = { "cache-control": "private, no-store", vary: "Cookie" };
  const esc = (n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const gatedRoutes = gated.map((n) => ({ src: `/assets/${esc(n)}(?:\\.map)?`, dest: "/__server", headers: priv }));
  const fs = routes.findIndex((r) => r.handle === "filesystem");
  const at = fs === -1 ? routes.length : fs;
  const family = { src: "(?i)/assets/(?:admin|app_\\.admin|btc-miners-panel|pdf)-[^/]*", dest: "/__server", headers: priv };
  // Gated names go first so no public cache rule applies; admin-family misses go right after the filesystem.
  return { ...config, routes: [...gatedRoutes, ...routes.slice(0, at + 1), family, ...routes.slice(at + 1)] };
}

function fail(msg) {
  console.error(`[gate-admin-assets] ${msg}`);
  process.exit(1);
}

function main(argv = process.argv.slice(2)) {
  const begin = argv.includes("--begin");
  const target = argv.find((a) => !a.startsWith("--")) ?? "node";
  if (!TARGETS[target]) fail(`unknown build target: ${target}`);
  if (begin) {
    beginBuild(ROOT, target);
    return;
  }
  const why = staleReason(ROOT, target);
  if (why) fail(`${why} — refusing to ship an ungated build`);
  const t = TARGETS[target];
  const pubDir = join(ROOT, t.pub);
  const outDir = join(ROOT, t.server, "admin-assets");
  rmSync(outDir, { recursive: true, force: true });
  const files = new Map();
  for (const f of readdirSync(pubDir)) if (f.endsWith(".js")) files.set(f, readFileSync(join(pubDir, f), "utf8"));
  const gated = adminOnly(files, isAdminPanelChunk);
  if (!gated.length) fail("admin panel chunk not found — refusing to ship an ungated build");
  mkdirSync(outDir, { recursive: true });
  for (const f of gated) {
    renameSync(join(pubDir, f), join(outDir, f));
    for (const extra of [`${f}.map`, `${f}.gz`, `${f}.br`]) rmSync(join(pubDir, extra), { force: true });
  }
  const entry = join(ROOT, t.entry);
  const src = readFileSync(entry, "utf8");
  if (target === "node" || src.includes('"/assets/')) {
    const { out, missing } = dropFromAssetTable(src, gated);
    if (target === "node" && missing.length) fail(`asset table entry not found for ${missing.length} file(s)`);
    writeFileSync(entry, out);
  }
  if (t.config) {
    const cfgPath = join(ROOT, t.config);
    if (!existsSync(cfgPath)) fail(`expected ${target} output is missing: ${t.config}`);
    writeFileSync(cfgPath, `${JSON.stringify(vercelRoutes(JSON.parse(readFileSync(cfgPath, "utf8")), gated), null, 2)}\n`);
  }
  // The current build's public names in the admin families; the front door denies any other name.
  const current = readdirSync(pubDir).filter(isAdminFamily).sort();
  writeFileSync(join(outDir, "admin-assets.json"), `${JSON.stringify({ files: gated, public: current }, null, 2)}\n`);
  rmSync(stampPath(ROOT, target), { force: true });
  console.log(`[gate-admin-assets] ${target}: moved ${gated.length} admin-only file(s) out of the public folder`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
