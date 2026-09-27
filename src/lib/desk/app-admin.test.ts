import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { claimAppAdmin, signAppAdminToken, verifyAppAdminToken } from "./app-admin.ts";
import { isAppAdminToken, isSystemAdminTokenShape } from "./tenancy.ts";

// AID: synthetic admin handle for claim rejection (matches x-admin.server env fixture).
process.env.S1R1US_ADMIN_X_HANDLE ??= "aid_test_admin_x";
process.env.S1R1US_ADMIN_X_ID ??= "1000000000000000001";
process.env.S1R1US_ADMIN_X_NAME ??= "AID Test Admin";

describe("copy-admin tokens", () => {
  it("issues a 4-part app token that is not a system HMAC", () => {
    const res = claimAppAdmin({ mandate: true, kind: "iphone", handle: "alice-desk" });
    assert.equal(res.ok, true);
    if (!res.ok) return;
    assert.equal(isAppAdminToken(res.token), true);
    assert.equal(isSystemAdminTokenShape(res.token), false);
    assert.equal(res.token.split(".").length, 4);
    assert.equal(res.token.split(".")[0], "app");
    assert.ok(res.you.id.startsWith("aa-"));
    const hit = verifyAppAdminToken(res.token);
    assert.ok(hit && hit.id === res.you.id);
  });

  it("rejects system admin and company X as copy-admin", () => {
    const op = claimAppAdmin({ mandate: true, kind: "x", handle: "aid_test_admin_x" });
    assert.equal(op.ok, false);
    const company = claimAppAdmin({ mandate: true, kind: "x", handle: "S1R1US_AI" });
    assert.equal(company.ok, false);
  });

  it("requires the mandate", () => {
    const res = claimAppAdmin({ kind: "iphone", handle: "bob-desk" });
    assert.equal(res.ok, false);
  });

  it("does not verify a forged 3-part token as copy-admin", () => {
    assert.equal(verifyAppAdminToken("1.2.deadbeef"), null);
    assert.equal(verifyAppAdminToken(signAppAdminToken("aa-missing")), null);
  });
});
