#!/usr/bin/env node
/**
 * After `vite build`: move admin-only page code out of .output/public/assets
 * into .output/server/admin-assets. The server serves those files only to a
 * signed-in system admin (src/routes/assets.$.ts).
 *
 * A file is admin-only when it is reachable from the admin panel chunk and
 * not reachable from any other chunk without passing through the admin panel.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
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
export const isAdminPanelChunk = (name) => /^admin-panel-[A-Za-z0-9_-]+\.js$/.test(name);

function main() {
  const pubDir = join(ROOT, ".output/public/assets");
  const outDir = join(ROOT, ".output/server/admin-assets");
  if (!existsSync(pubDir)) {
    console.error("[gate-admin-assets] no .output/public/assets");
    process.exit(1);
  }
  rmSync(outDir, { recursive: true, force: true });
  const files = new Map();
  for (const f of readdirSync(pubDir)) if (f.endsWith(".js")) files.set(f, readFileSync(join(pubDir, f), "utf8"));
  const gated = adminOnly(files, isAdminPanelChunk);
  if (!gated.length) {
    console.error("[gate-admin-assets] admin panel chunk not found — refusing to ship an ungated build");
    process.exit(1);
  }
  mkdirSync(outDir, { recursive: true });
  for (const f of gated) {
    renameSync(join(pubDir, f), join(outDir, f));
    for (const extra of [`${f}.map`, `${f}.gz`, `${f}.br`]) rmSync(join(pubDir, extra), { force: true });
  }
  const serverEntry = join(ROOT, ".output/server/index.mjs");
  if (existsSync(serverEntry)) {
    const { out, missing } = dropFromAssetTable(readFileSync(serverEntry, "utf8"), gated);
    if (missing.length) {
      console.error(`[gate-admin-assets] asset table entry not found for ${missing.length} file(s)`);
      process.exit(1);
    }
    writeFileSync(serverEntry, out);
  }
  writeFileSync(join(outDir, "admin-assets.json"), `${JSON.stringify({ files: gated }, null, 2)}\n`);
  console.log(`[gate-admin-assets] moved ${gated.length} admin-only file(s) out of the public folder`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
