#!/usr/bin/env node
/** SSR hashes styles.css differently than the client emit. Copy the emitted
 *  stylesheet to every /assets/styles-*.css name the SSR bundle requests. */
import { copyFileSync, existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicAssets = join(root, ".output/public/assets");
const serverDir = join(root, ".output/server");

function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) walk(p, acc);
    else if (/\.(mjs|js|json)$/.test(ent.name)) acc.push(p);
  }
  return acc;
}

if (!existsSync(publicAssets)) {
  console.error("[alias-ssr-css] missing", publicAssets);
  process.exit(1);
}

const emitted = readdirSync(publicAssets).filter((n) => /^styles-[A-Za-z0-9_-]+\.css$/.test(n));
if (!emitted.length) {
  console.error("[alias-ssr-css] no styles-*.css in", publicAssets);
  process.exit(1);
}
emitted.sort((a, b) => statSync(join(publicAssets, b)).size - statSync(join(publicAssets, a)).size);
const sourceName = emitted[0];
const source = join(publicAssets, sourceName);

const needed = new Set();
const re = /\/assets\/(styles-[A-Za-z0-9_-]+\.css)/g;
for (const file of walk(serverDir)) {
  const t = readFileSync(file, "utf8");
  for (const m of t.matchAll(re)) needed.add(m[1]);
}

let copies = 0;
for (const name of needed) {
  const dest = join(publicAssets, name);
  if (existsSync(dest)) continue;
  copyFileSync(source, dest);
  copies += 1;
  console.log(`[alias-ssr-css] ${sourceName} -> ${name}`);
}
if (!copies) console.log("[alias-ssr-css] no aliases needed");
