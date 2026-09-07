#!/usr/bin/env node
/** Pin PGLite wasm/data into the Nitro output so the Docker image has no node_modules.
 *  Also copy the SSR stylesheet into public/assets — Nitro HTML references that hash. */
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "node_modules/@electric-sql/pglite/dist");
const destDir = join(root, ".output/server/_libs");
mkdirSync(destDir, { recursive: true });
for (const name of ["pglite.wasm", "pglite.data"]) {
  const src = join(srcDir, name);
  if (!existsSync(src)) {
    console.error(`[copy-pglite] missing ${src}`);
    process.exit(1);
  }
  copyFileSync(src, join(destDir, name));
}
console.log("[copy-pglite] pinned pglite.wasm + pglite.data into .output/server/_libs");

const ssrCssDir = join(root, "node_modules/.nitro/vite/services/ssr/assets");
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
