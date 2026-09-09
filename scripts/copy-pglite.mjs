#!/usr/bin/env node
/** Pin PGLite wasm/data into the Nitro output so the Docker image has no node_modules.
 *  PGlite 0.4+ also needs initdb.wasm next to pglite.wasm (desk / Better Auth). */
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "node_modules/@electric-sql/pglite/dist");
const destDir = join(root, ".output/server/_libs");
mkdirSync(destDir, { recursive: true });

const required = ["pglite.wasm", "pglite.data"];
const extra = ["initdb.wasm", "initdb.data"];

function findAsset(name) {
  const direct = join(srcDir, name);
  if (existsSync(direct)) return direct;
  try {
    for (const ent of readdirSync(srcDir, { withFileTypes: true })) {
      if (!ent.isDirectory()) continue;
      const p = join(srcDir, ent.name, name);
      if (existsSync(p)) return p;
    }
  } catch {
    /* missing dist */
  }
  return null;
}

for (const name of required) {
  const src = findAsset(name);
  if (!src) {
    console.error(`[copy-pglite] missing ${name} under ${srcDir}`);
    process.exit(1);
  }
  copyFileSync(src, join(destDir, name));
}

for (const name of extra) {
  const src = findAsset(name);
  if (!src) {
    console.warn(`[copy-pglite] optional missing ${name}`);
    continue;
  }
  copyFileSync(src, join(destDir, name));
  console.log(`[copy-pglite] pinned ${name}`);
}

console.log("[copy-pglite] pinned pglite.wasm + pglite.data into .output/server/_libs");

const publicAssets = join(root, ".output/public/assets");
mkdirSync(publicAssets, { recursive: true });
const llms = join(root, "public/llms.txt");
if (existsSync(llms)) {
  const well = join(root, ".output/public/.well-known");
  mkdirSync(well, { recursive: true });
  copyFileSync(llms, join(root, ".output/public/llms.txt"));
  copyFileSync(llms, join(well, "llms.txt"));
  console.log("[copy-pglite] pinned public/llms.txt into .output/public and .well-known");
}
