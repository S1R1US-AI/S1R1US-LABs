import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  APP_ADMIN_PATH,
  SYSTEM_ADMIN_PATH,
  combineCompute,
  isAppAdminToken,
  isSystemAdminTokenShape,
  isSystemOnlyPath,
} from "./tenancy.ts";

describe("tenancy", () => {
  it("keeps system /admin off the copy-admin path", () => {
    assert.equal(SYSTEM_ADMIN_PATH, "/admin");
    assert.equal(APP_ADMIN_PATH, "/app/admin");
    assert.equal(isSystemOnlyPath("/admin"), true);
    assert.equal(isSystemOnlyPath("/admin/wallet"), true);
    assert.equal(isSystemOnlyPath("/app/admin"), false);
    assert.equal(isSystemOnlyPath("/app"), false);
    assert.equal(isSystemOnlyPath("/source"), true);
  });

  it("rejects copy-admin tokens as system HMAC shape", () => {
    assert.equal(isAppAdminToken("app.1.aa-x.deadbeef"), true);
    assert.equal(isAppAdminToken("123.1.deadbeef"), false);
    assert.equal(isSystemAdminTokenShape("123.1.deadbeef"), true);
    assert.equal(isSystemAdminTokenShape("app.1.aa-x.deadbeef"), false);
    assert.equal(isSystemAdminTokenShape("1.2.u.id.sig"), false);
  });

  it("combines phone + online: both ACCUMULATE else WAIT, never sell", () => {
    assert.equal(combineCompute("ACCUMULATE", "ACCUMULATE"), "ACCUMULATE");
    assert.equal(combineCompute("BUY", "ACCUMULATE"), "ACCUMULATE");
    assert.equal(combineCompute("ACCUMULATE", "WAIT"), "WAIT");
    assert.equal(combineCompute("HOLD", "HOLD"), "WAIT");
    assert.equal(combineCompute("TRIM", "ACCUMULATE"), "WAIT");
    assert.equal(combineCompute("SELL", "SELL"), "WAIT");
  });
});
