#!/usr/bin/env node
/** Nitro SSR hashes styles.css differently than the client emit, then only
 *  serves files listed in server/index.mjs. Point SSR at the emitted sheet
 *  and register every requested hash in the Nitro public asset map. */
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicAssets = join(root, ".output/public/assets");
const serverDir = join(root, ".output/server");
const nitroIndex = join(serverDir, "index.mjs");

function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) walk(p, acc);
    else if (/\.(mjs|js|json)$/.test(ent.name)) acc.push(p);
  }
  return acc;
}

if (!existsSync(publicAssets) || !existsSync(nitroIndex)) {
  console.error("[alias-ssr-css] missing .output");
  process.exit(1);
}

const emitted = readdirSync(publicAssets).filter((n) => /^styles-[A-Za-z0-9_-]+\.css$/.test(n));
if (!emitted.length) {
  console.error("[alias-ssr-css] no styles-*.css in", publicAssets);
  process.exit(1);
}
emitted.sort((a, b) => statSync(join(publicAssets, b)).size - statSync(join(publicAssets, a)).size);
const sourceName = emitted[0];
const emittedRoute = `/assets/${sourceName}`;

const needed = new Set();
const re = /\/assets\/(styles-[A-Za-z0-9_-]+\.css)/g;
for (const file of walk(serverDir)) {
  const t = readFileSync(file, "utf8");
  for (const m of t.matchAll(re)) needed.add(m[1]);
}

const ssrFiles = walk(join(serverDir, "_ssr"));
let rewrites = 0;
for (const file of ssrFiles) {
  const t = readFileSync(file, "utf8");
  const next = t.replace(/\/assets\/styles-[A-Za-z0-9_-]+\.css/g, emittedRoute);
  if (next !== t) {
    writeFileSync(file, next);
    rewrites += 1;
    console.log(`[alias-ssr-css] rewrite ${file.slice(root.length + 1)} -> ${sourceName}`);
  }
}

let nitro = readFileSync(nitroIndex, "utf8");
const blockRe = new RegExp(
  `(\\t"${emittedRoute.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}": \\{[\\s\\S]*?\\n\\t\\})`,
);
const blockMatch = nitro.match(blockRe);
if (!blockMatch) {
  console.error("[alias-ssr-css] emitted CSS missing from Nitro asset map:", emittedRoute);
  process.exit(1);
}
const emittedBlock = blockMatch[1];
let mapped = 0;
for (const name of needed) {
  const route = `/assets/${name}`;
  if (nitro.includes(`"${route}"`)) continue;
  const aliasBlock = emittedBlock.replace(emittedRoute, route);
  nitro = nitro.replace(emittedBlock, `${emittedBlock},\n${aliasBlock}`);
  mapped += 1;
  console.log(`[alias-ssr-css] map ${route} -> ${sourceName}`);
}
if (mapped) writeFileSync(nitroIndex, nitro);

if (!rewrites && !mapped) console.log("[alias-ssr-css] no aliases needed");
