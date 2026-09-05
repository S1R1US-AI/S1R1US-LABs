import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  ADMIN_X_HANDLE,
  ADMIN_X_HANDLE_CORE,
  ADMIN_X_ID,
  isAdminXProvider,
  isDeadCompanyHandle,
  looksLikeAdminX,
  looksLikeCompanyX,
  normalizeXIdentity,
  preferredXAccountId,
  profileLooksLikeAdminX,
} from "./x-admin.ts";

describe("admin X identity", () => {
  it("accepts only @_Mr_R0b0t0_ handle and snowflake", () => {
    assert.equal(looksLikeAdminX("@_Mr_R0b0t0_"), true);
    assert.equal(looksLikeAdminX("_Mr_R0b0t0_"), true);
    assert.equal(looksLikeAdminX("@_mr_r0b0t0_"), true);
    assert.equal(looksLikeAdminX(ADMIN_X_HANDLE), true);
    assert.equal(looksLikeAdminX(ADMIN_X_HANDLE_CORE), true);
    assert.equal(looksLikeAdminX(ADMIN_X_ID), true);
    assert.equal(looksLikeAdminX(`twitter:${ADMIN_X_ID}`), true);
    assert.equal(looksLikeAdminX(`x:${ADMIN_X_HANDLE_CORE}`), true);
    assert.equal(looksLikeAdminX(`grok-x:${ADMIN_X_ID}`), true);
  });

  it("rejects display names, emails, company, dead handles, noise", () => {
    assert.equal(looksLikeAdminX("Mr. R0b0t0"), false);
    assert.equal(looksLikeAdminX("@Mr. R0b0t0"), false);
    assert.equal(looksLikeAdminX("_Mr_R0b0t0_@x.com"), false);
    assert.equal(looksLikeAdminX("_Mr_R0b0t0_@gmail.com"), false);
    assert.equal(looksLikeAdminX("https://x.com/_Mr_R0b0t0_"), false);
    assert.equal(looksLikeAdminX("@@_Mr_R0b0t0_"), false);
    assert.equal(looksLikeAdminX("@_Mr_R0b0t0_ extra"), false);
    assert.equal(looksLikeAdminX("@S1R1US"), false);
    assert.equal(looksLikeAdminX("S1R1US"), false);
    assert.equal(looksLikeAdminX("@_S1R1US_"), false);
    assert.equal(looksLikeAdminX(""), false);
    assert.equal(looksLikeAdminX(null), false);
    assert.equal(looksLikeAdminX("2093335535146131457"), false);
  });

  it("never treats company or dead handles as company while unset, never as admin", () => {
    assert.equal(looksLikeCompanyX("@S1R1US"), false);
    assert.equal(looksLikeCompanyX("@_S1R1US_"), false);
    assert.equal(looksLikeCompanyX(ADMIN_X_HANDLE), false);
    assert.equal(isDeadCompanyHandle("S1R1US"), true);
    assert.equal(isDeadCompanyHandle("@_S1R1US_"), true);
    assert.equal(isDeadCompanyHandle(ADMIN_X_HANDLE), false);
  });

  it("only grok-x / twitter / x providers count", () => {
    assert.equal(isAdminXProvider("grok-x"), true);
    assert.equal(isAdminXProvider("twitter"), true);
    assert.equal(isAdminXProvider("x"), true);
    assert.equal(isAdminXProvider("google"), false);
    assert.equal(isAdminXProvider("email"), false);
    assert.equal(isAdminXProvider("credential"), false);
    assert.equal(isAdminXProvider("grok-gate"), false);
    assert.equal(normalizeXIdentity("_Mr_R0b0t0_@x.com"), "");
  });

  it("reads broker userinfo preferred_username when sub is a grok uuid", () => {
    const grokSub = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";
    const profile = {
      sub: grokSub,
      name: "Mr. R0b0t0",
      preferred_username: "_Mr_R0b0t0_",
      email: "_Mr_R0b0t0_@users.noreply.x.com",
    };
    assert.equal(looksLikeAdminX(grokSub), false);
    assert.equal(looksLikeAdminX("Mr. R0b0t0"), false);
    assert.equal(profileLooksLikeAdminX(profile), true);
    assert.equal(preferredXAccountId(profile), ADMIN_X_HANDLE_CORE);
    assert.equal(
      preferredXAccountId({
        sub: grokSub,
        identities: [{ provider: "twitter", user_id: ADMIN_X_ID, username: "_Mr_R0b0t0_" }],
      }),
      ADMIN_X_ID,
    );
    assert.equal(profileLooksLikeAdminX({ sub: grokSub, name: "Mr. R0b0t0" }), false);
  });
});
