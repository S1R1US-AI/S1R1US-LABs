// Admin-only data and page code never ship in the public folder.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, statSync, utimesSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { adminOnly, beginBuild, dropFromAssetTable, isAdminFamily, isAdminPanelChunk, refsOf, staleReason, vercelRoutes } from "./gate-admin-assets.mjs";

const ROOT = new URL("..", import.meta.url).pathname;
const read = (p) => readFileSync(join(ROOT, p), "utf8");

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(js|mjs|html|txt|json|xml|css|map)$/.test(f)) out.push(p);
  }
  return out;
}
const publicFiles = existsSync(join(ROOT, ".output/public")) ? walk(join(ROOT, ".output/public")).map((p) => readFileSync(p, "utf8")) : [];

/** String literals from the server-only modules, read as text so no copy lives in this test. */
function serverOnlyStrings() {
  const out = new Set();
  for (const file of ["src/lib/desk/security.ts", "src/lib/desk/thesis.ts"]) {
    const src = read(file);
    for (const m of src.matchAll(/(?:title|detail|subtitle|venue):\s*"([^"\\]{24,})"/g)) out.add(m[1]);
    for (const m of src.matchAll(/^\s{6}"([^"\\]{60,})",?$/gm)) out.add(m[1]);
  }
  return [...out];
}

test("graph: only code reachable solely through the admin panel is gated", () => {
  const files = new Map([
    ["index-a.js", 'import("./admin-x.js");import"./brand-b.js"'],
    ["admin-x.js", 'import"./brand-b.js";const m=["assets/admin-panel-p.js"]'],
    ["admin-panel-p.js", 'import"./brand-b.js";import"./only-admin-c.js";import("./pdf-d.js")'],
    ["only-admin-c.js", ""],
    ["pdf-d.js", ""],
    ["brand-b.js", 'import"./index-a.js"'],
  ]);
  assert.deepEqual([...refsOf(files.get("admin-x.js"))].sort(), ["admin-panel-p.js", "brand-b.js"]);
  assert.deepEqual(adminOnly(files, isAdminPanelChunk), ["admin-panel-p.js", "only-admin-c.js", "pdf-d.js"]);
});

test("Nitro asset table entries for gated files are removed", () => {
  const src = '{\n\t"/assets/admin-panel-p.js": {\n\t\t"type": "text/javascript",\n\t\t"path": "../public/assets/admin-panel-p.js"\n\t},\n\t"/assets/brand-b.js": {\n\t\t"type": "x"\n\t}\n}';
  const { out, missing } = dropFromAssetTable(src, ["admin-panel-p.js"]);
  assert.deepEqual(missing, []);
  assert.ok(!out.includes("admin-panel-p.js"));
  assert.ok(out.includes("brand-b.js"));
});

test("built public folder holds no admin panel code and the server table does not list it", { skip: !publicFiles.length }, () => {
  const list = JSON.parse(read(".output/server/admin-assets/admin-assets.json")).files;
  assert.ok(list.some(isAdminPanelChunk), "admin panel chunk is gated");
  const assets = readdirSync(join(ROOT, ".output/public/assets"));
  for (const f of list) assert.ok(!assets.includes(f), `${f} is still public`);
  const table = read(".output/server/index.mjs");
  for (const f of list) assert.ok(!table.includes(`"/assets/${f}"`), `${f} is still in the static table`);
  const entry = assets.filter((f) => /^index-.*\.js$/.test(f)).map((f) => read(`.output/public/assets/${f}`)).join("\n");
  for (const f of list) assert.ok(!entry.includes(f), `${f} is named in the main script`);
});

test("built public folder carries none of the admin security log or research paper text", { skip: !publicFiles.length }, () => {
  const strings = serverOnlyStrings();
  assert.ok(strings.length > 40, "server-only strings were found to check");
  let hits = 0;
  for (const s of strings) if (publicFiles.some((body) => body.includes(s))) hits += 1;
  assert.equal(hits, 0, `${hits} admin-only string(s) reached the public folder`);
});

test("no page or component imports the server-only admin modules", () => {
  const roots = ["src/components", "src/routes"];
  const banned = /from\s+"(?:@\/lib\/desk\/|\.\.?\/(?:lib\/desk\/)?)(morning-security\.server|hunter|thesis|posture|s3c-sweep|godaddy-dns\.server)"/;
  for (const r of roots) {
    for (const p of walk(join(ROOT, r))) {
      if (!/\.(ts|tsx)$/.test(p)) continue;
      const src = readFileSync(p, "utf8").replace(/^import type .*$/gm, "");
      assert.doesNotMatch(src, banned, p);
      assert.doesNotMatch(src, /\b(?:protocolRows|vulnRows)\b/, p);
    }
  }
});

test("the app head and every llms.txt copy no longer advertise the agent API", () => {
  const rootRoute = read("src/routes/__root.tsx");
  assert.doesNotMatch(rootRoute, /href:\s*"\/api\/agent/);
  assert.doesNotMatch(rootRoute, /agent feed/i);
  for (const p of ["public/llms.txt", "public/.well-known/llms.txt", ".output/public/llms.txt", ".output/public/.well-known/llms.txt"]) {
    if (!existsSync(join(ROOT, p))) continue;
    const body = read(p);
    assert.ok(!body.includes("/api/agent/"), `${p} lists agent API paths`);
    assert.doesNotMatch(body, /agent feed/i, p);
  }
  const ssr = walk(join(ROOT, ".output/server")).filter((p) => /router-.*\.mjs$/.test(p));
  for (const p of ssr) assert.doesNotMatch(readFileSync(p, "utf8"), /rel: "alternate",[^}]*href: "\/api\/agent/);
});

test("the board page code example has no endpoint path", () => {
  const board = read("front-door-static/board/index.html");
  for (const m of board.matchAll(/<pre[^>]*>([\s\S]*?)<\/pre>/g)) assert.ok(!m[1].includes("/api/agent/"), "board example names an endpoint");
  assert.ok(!board.includes("x-s1r1us-agent"));
});

test("the public miners panel does not name internal settings, source files or functions", () => {
  const dir = join(ROOT, ".output/public/assets");
  if (!existsSync(dir)) return;
  const chunks = readdirSync(dir).filter((f) => /^btc-miners-panel-.*\.js$/.test(f));
  for (const f of chunks) {
    const text = [...readFileSync(join(dir, f), "utf8").matchAll(/`([^`$]{3,400})`/g)].map((m) => m[1]).filter((l) => /^[^{}();=]*$/.test(l) || /=(?:true|false)$/.test(l));
    for (const l of text) {
      assert.doesNotMatch(l, /\b[A-Z][A-Z0-9]*_[A-Z0-9_]+\b/, `${f}: setting name in text`);
      assert.doesNotMatch(l, /\b[a-z]\w*\.[a-z]\w*=(?:true|false)\b|\b[a-z]\w*[A-Z]\w*=(?:true|false)\b/, `${f}: internal flag in text`);
      assert.doesNotMatch(l, /\.(?:tsx?|mjs)\b|\bsrc\/|\.server\b|\b[a-z]\w*[A-Z]\w*\(\)/, `${f}: source path or function in text`);
    }
  }
});

test("the build lists its current admin-family names for the front door", () => {
  const p = join(ROOT, ".output/server/admin-assets/admin-assets.json");
  if (!existsSync(p)) return;
  const list = JSON.parse(readFileSync(p, "utf8"));
  assert.ok(Array.isArray(list.public) && list.public.length > 0);
  const onDisk = readdirSync(join(ROOT, ".output/public/assets")).filter(isAdminFamily).sort();
  assert.deepEqual(list.public, onDisk);
});

test("every build target runs the gate on its own fresh output", () => {
  const pkg = JSON.parse(read("package.json"));
  assert.match(pkg.scripts["build:do"], /^node scripts\/gate-admin-assets\.mjs --begin node && NITRO_PRESET=node-server [\s\S]*gate-admin-assets\.mjs node$/);
  assert.match(pkg.scripts.build, /^node scripts\/gate-admin-assets\.mjs --begin vercel && [\s\S]*gate-admin-assets\.mjs vercel$/);
});

test("the gate refuses missing, older or wrong-preset output", () => {
  const root = mkdtempSync(join(tmpdir(), "gate-stale-"));
  assert.match(staleReason(root, "vercel"), /no build start recorded/);
  beginBuild(root, "vercel");
  assert.match(staleReason(root, "vercel"), /missing/);
  mkdirSync(join(root, ".vercel/output/static/assets"), { recursive: true });
  mkdirSync(join(root, ".vercel/output/functions/__server.func"), { recursive: true });
  writeFileSync(join(root, ".vercel/output/functions/__server.func/index.mjs"), "");
  writeFileSync(join(root, ".vercel/output/nitro.json"), JSON.stringify({ preset: "vercel" }));
  assert.equal(staleReason(root, "vercel"), null);
  const old = new Date(Date.now() - 3600_000);
  utimesSync(join(root, ".vercel/output/nitro.json"), old, old);
  assert.match(staleReason(root, "vercel"), /older than this build/);
  writeFileSync(join(root, ".vercel/output/nitro.json"), JSON.stringify({ preset: "node-server" }));
  assert.match(staleReason(root, "vercel"), /preset/);
  assert.match(staleReason(root, "nope"), /unknown build target/);
});

test("vercel routes send gated names to the server privately, ahead of public caching", () => {
  const cfg = { routes: [{ src: "/assets/(.*)", headers: { "cache-control": "public, max-age=31536000, immutable" } }, { handle: "filesystem" }, { src: "/(.*)", dest: "/__server" }] };
  const r = vercelRoutes(cfg, ["admin-panel-A.js"]).routes;
  assert.equal(r[0].dest, "/__server");
  assert.equal(r[0].headers["cache-control"], "private, no-store");
  assert.ok(new RegExp(r[0].src).test("/assets/admin-panel-A.js"));
  const fs = r.findIndex((x) => x.handle === "filesystem");
  assert.equal(r[fs + 1].headers["cache-control"], "private, no-store");
  assert.equal(r.at(-1).src, "/(.*)");
});
