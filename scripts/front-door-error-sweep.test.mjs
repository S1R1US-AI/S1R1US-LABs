import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const start = readFileSync(join(ROOT, "scripts/do-start.mjs"), "utf8");

function arrayAfter(marker) {
  const at = start.indexOf(marker);
  assert.ok(at >= 0, `missing ${marker}`);
  const open = start.indexOf("[", at);
  const close = start.indexOf("]", open);
  return [...start.slice(open, close).matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

test("every front-door page redirects its no-slash path (308) like its siblings", () => {
  const exact = arrayAfter("const staticOnlyExact =");
  const dirExact = arrayAfter("const dirExact =");
  const pages = exact.filter((p) => !["/css", "/js", "/images"].includes(p));
  const missing = pages.filter((p) => !dirExact.includes(p));
  assert.deepEqual(missing, []);
  for (const p of ["/hindu-teachings", "/dmt", "/global-uprisings"]) assert.ok(dirExact.includes(p), p);
});

test("front-door-static meta tags have no raw quotes inside content", () => {
  const files = [];
  const walk = (d) => {
    for (const n of readdirSync(d)) {
      const p = join(d, n);
      if (statSync(p).isDirectory()) walk(p);
      else if (n.endsWith(".html")) files.push(p);
    }
  };
  walk(join(ROOT, "front-door-static"));
  const bad = [];
  for (const f of files) {
    const html = readFileSync(f, "utf8");
    for (const m of html.matchAll(/<meta\b[^>]*>/g)) {
      for (const c of m[0].matchAll(/content="([^"]*)"(.)/g)) {
        if (!" />\t\n".includes(c[2])) bad.push(`${f}: ${m[0].slice(0, 80)}`);
      }
    }
  }
  assert.deepEqual(bad, []);
});

test("/wh1t3/ description keeps its full text", () => {
  const html = readFileSync(join(ROOT, "front-door-static/wh1t3/index.html"), "utf8");
  const m = /<meta name="description" content="([^"]*)"/.exec(html);
  assert.ok(m);
  assert.ok(m[1].length > 60, `description is ${m[1].length} chars`);
  assert.match(m[1], /rebrand on your domain/);
});
