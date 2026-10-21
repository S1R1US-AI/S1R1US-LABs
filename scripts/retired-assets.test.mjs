import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { currentAdminFamily, isRetiredAdminAsset, RETIRED_ASSET_HEADERS } from "./do-start.mjs";

const root = mkdtempSync(join(tmpdir(), "retired-assets-"));
mkdirSync(join(root, ".output/public/assets"), { recursive: true });
mkdirSync(join(root, ".output/server/admin-assets"), { recursive: true });
for (const f of ["admin-NEW1.js", "app_.admin-NEW2.js", "btc-miners-panel-NEW3.js", "index-X.js"]) writeFileSync(join(root, ".output/public/assets", f), "");
writeFileSync(join(root, ".output/server/admin-assets/admin-assets.json"), JSON.stringify({ files: ["admin-panel-NEW4.js", "pdf-NEW5.js"] }));
const current = currentAdminFamily(root);

test("current build names pass through to the app", () => {
  for (const f of ["admin-NEW1.js", "app_.admin-NEW2.js", "btc-miners-panel-NEW3.js", "admin-panel-NEW4.js", "pdf-NEW5.js"]) {
    assert.equal(isRetiredAdminAsset(`/assets/${f}`, current), false, f);
  }
});

test("older admin-family names are denied in every spelling", () => {
  const old = ["btc-miners-panel-OLD1.js", "admin-OLD2.js", "app_.admin-OLD3.js", "admin-panel-OLD4.js", "pdf-OLD5.js"];
  for (const f of old) {
    for (const p of [`/assets/${f}`, `/assets/${f.toUpperCase()}`, `/ASSETS/${f}`, `/assets%2F${f}`, `/assets%5C${f}`, `//assets//${f}`, `/assets/%25${f.charCodeAt(0).toString(16)}${f.slice(1)}`]) {
      assert.equal(isRetiredAdminAsset(p, current), true, p);
    }
  }
});

test("current names in an encoded or odd spelling are denied", () => {
  for (const p of ["/assets%2Fadmin-panel-NEW4.js", "/assets%2fbtc-miners-panel-NEW3.js", "//assets/admin-NEW1.js", "/assets//pdf-NEW5.js", "/assets/%61dmin-NEW1.js"]) {
    assert.equal(isRetiredAdminAsset(p, current), true, p);
  }
});

test("source maps for the family are always denied", () => {
  assert.equal(isRetiredAdminAsset("/assets/btc-miners-panel-NEW3.js.map", current), true);
  assert.equal(isRetiredAdminAsset("/assets/admin-panel-NEW4.js.map", current), true);
});

test("a stale file left on disk is denied when the build lists its own names", () => {
  const r2 = mkdtempSync(join(tmpdir(), "retired-assets-"));
  mkdirSync(join(r2, ".output/public/assets"), { recursive: true });
  mkdirSync(join(r2, ".output/server/admin-assets"), { recursive: true });
  for (const f of ["btc-miners-panel-NEW3.js", "btc-miners-panel-STALE.js"]) writeFileSync(join(r2, ".output/public/assets", f), "");
  writeFileSync(join(r2, ".output/server/admin-assets/admin-assets.json"), JSON.stringify({ files: ["admin-panel-NEW4.js"], public: ["btc-miners-panel-NEW3.js"] }));
  const cur = currentAdminFamily(r2);
  assert.equal(isRetiredAdminAsset("/assets/btc-miners-panel-NEW3.js", cur), false);
  assert.equal(isRetiredAdminAsset("/assets/btc-miners-panel-STALE.js", cur), true);
  assert.equal(isRetiredAdminAsset("/assets/admin-panel-NEW4.js", cur), false);
});

test("other assets and paths are not touched", () => {
  for (const p of ["/assets/index-X.js", "/assets/brand-OLD.js", "/admin", "/images/admin-OLD.js", "/assets/admin.css"]) {
    assert.equal(isRetiredAdminAsset(p, current), false, p);
  }
});

test("denials are private and never cached", () => {
  assert.equal(RETIRED_ASSET_HEADERS["Cache-Control"], "private, no-store");
});

test("gated page code is answered private, no-store even when the app says otherwise", async () => {
  const { gatedAdminAssets, privateAssetHeaders, startFrontDoor } = await import("./do-start.mjs");
  const out = privateAssetHeaders({ "content-type": "text/javascript", "cache-control": "public, max-age=31536000, immutable", etag: "x", "Last-Modified": "y" });
  assert.equal(out["cache-control"], "private, no-store");
  assert.equal(out.etag, undefined);
  assert.equal(out["Last-Modified"], undefined);
  assert.equal(out.vary, "Cookie");

  const gated = [...gatedAdminAssets()];
  if (!gated.length) return; // no build in this checkout
  const http = await import("node:http");
  const app = http.createServer((req, res) => {
    res.writeHead(200, { "content-type": "text/javascript", "cache-control": "public, max-age=31536000, immutable", etag: '"e"' });
    res.end("ok");
  });
  await new Promise((r) => app.listen(0, "127.0.0.1", r));
  const door = startFrontDoor({ port: 0, host: "127.0.0.1", nitroPort: app.address().port });
  await new Promise((r) => (door.listening ? r() : door.once("listening", r)));
  try {
    const base = `http://127.0.0.1:${door.address().port}`;
    const real = readdirSync(join(process.cwd(), ".output/server/admin-assets")).find((f) => f.toLowerCase() === gated[0]);
    for (const method of ["GET", "HEAD"]) {
      const r = await fetch(`${base}/assets/${real}`, { method });
      assert.equal(r.status, 200);
      assert.equal(r.headers.get("cache-control"), "private, no-store", method);
      assert.equal(r.headers.get("etag"), null);
    }
  } finally {
    door.close();
    app.close();
  }
});
