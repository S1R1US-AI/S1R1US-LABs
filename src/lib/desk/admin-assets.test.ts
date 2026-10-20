import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { ADMIN_ASSET_COOKIE_PATH, ADMIN_ASSET_HEADERS, adminAssetDecision, assetNameOf, cookieValue } from "./admin-assets.ts";

const gated = new Set(["admin-panel-abc123.js"]);
const read = (p: string) => readFileSync(new URL(p, import.meta.url), "utf8");

describe("admin page code is served only to a signed-in admin", () => {
  const variants = [
    "/assets/admin-panel-abc123.js",
    "/assets/ADMIN-PANEL-ABC123.JS",
    "/ASSETS/admin-panel-abc123.js",
    "/assets%2Fadmin-panel-abc123.js",
    "/assets%2fadmin-panel-abc123.js",
    "/assets%5Cadmin-panel-abc123.js",
    "/assets\\admin-panel-abc123.js",
    "/assets/%61dmin-panel-abc123.js",
    "/assets/%2561dmin-panel-abc123.js",
    "//assets/admin-panel-abc123.js",
    "/assets//admin-panel-abc123.js",
    "/assets/x/../admin-panel-abc123.js",
    "/assets/admin-panel-abc123.js?x=1",
    "/assets/admin-panel-abc123.js.map",
  ];

  it("every encoding of a gated name resolves to that name", () => {
    for (const v of variants) assert.equal(assetNameOf(v), "admin-panel-abc123.js", v);
  });

  it("without an admin session every variant is a 404 with nothing served", () => {
    for (const v of variants) assert.deepEqual(adminAssetDecision(v, gated, false), { serve: null, status: 404 }, v);
  });

  it("with an admin session the file is served, but source maps never are", () => {
    assert.deepEqual(adminAssetDecision("/assets/admin-panel-abc123.js", gated, true), { serve: "admin-panel-abc123.js", status: 200 });
    assert.equal(adminAssetDecision("/assets/admin-panel-abc123.js.map", gated, true).status, 404);
  });

  it("names that are not gated are never served by the gate", () => {
    assert.equal(adminAssetDecision("/assets/brand-xyz.js", gated, true).status, 404);
    assert.equal(adminAssetDecision("/login", gated, true).status, 404);
  });

  it("gate answers are private and not stored", () => {
    assert.equal(ADMIN_ASSET_HEADERS["cache-control"], "private, no-store");
    assert.equal(ADMIN_ASSET_COOKIE_PATH, "/assets/");
  });

  it("reads one cookie by exact name", () => {
    assert.equal(cookieValue("a=1; s1r1_adm=tok%2E1; b=2", "s1r1_adm"), "tok.1");
    assert.equal(cookieValue("xs1r1_adm=nope", "s1r1_adm"), undefined);
    assert.equal(cookieValue(null, "s1r1_adm"), undefined);
  });
});

describe("admin-only data is checked on the server", () => {
  const rpc = read("./desk-rpc.ts");
  const gate = read("./admin-gate.server.ts");

  it("the guard reuses verifyAccessToken and answers 401 with private, no-store", () => {
    assert.match(gate, /from "\.\/access\.server"/);
    assert.match(gate, /systemTokenOnly\(token, verifyAccessToken\)/);
    assert.match(gate, /setResponseStatus\(401\)/);
    assert.match(gate, /status: 401/);
    assert.match(gate, /private, no-store/);
  });

  for (const fn of ["fetchSecurityLog", "fetchAdminPaper", "fetchSecurityPosture", "runHunterAudit", "fetchSecurityBrief", "grantAdminAssets"]) {
    it(`${fn} checks the admin session before returning anything`, () => {
      const start = rpc.indexOf(`export const ${fn} =`);
      assert.ok(start >= 0, fn);
      const body = rpc.slice(start, rpc.indexOf("export const", start + 10) > 0 ? rpc.indexOf("export const", start + 10) : undefined);
      const guard = body.indexOf("requireAdminData(data.token)");
      assert.ok(guard > 0, `${fn} has no server-side admin check`);
      for (const mod of ["./security", "./thesis", "./guide", "./hunter", "./posture", "./morning-security.server"]) {
        const at = body.indexOf(`import("${mod}")`);
        if (at >= 0) assert.ok(at > guard, `${fn} loads ${mod} before the check`);
      }
    });
  }
});

describe("sweep score without rows", () => {
  it("reports not loaded instead of a perfect score", async () => {
    const { s3cSweepScore } = await import("./s3c-score.ts");
    const empty = s3cSweepScore([]);
    assert.equal(empty.ready, false);
    assert.equal(empty.score, null);
    assert.doesNotMatch(empty.headline, /100\/100/);
    const one = s3cSweepScore([{ id: "a", name: "a", status: "PASS", note: "" }]);
    assert.equal(one.ready, true);
    assert.equal(one.score, 100);
  });
});
