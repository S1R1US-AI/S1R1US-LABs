import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import {
  isAdminXProvider,
  isDeadCompanyHandle,
  looksLikeCompanyX,
  normalizeXIdentity,
} from "./x-admin.ts";

const PREV = {
  handle: process.env.S1R1US_ADMIN_X_HANDLE,
  name: process.env.S1R1US_ADMIN_X_NAME,
  id: process.env.S1R1US_ADMIN_X_ID,
};

const FIX_HANDLE = "aid_test_admin_x";
const FIX_NAME = "AID Test Admin";
const FIX_ID = "1000000000000000001";

describe("admin X identity (server env)", () => {
  before(() => {
    process.env.S1R1US_ADMIN_X_HANDLE = FIX_HANDLE;
    process.env.S1R1US_ADMIN_X_NAME = FIX_NAME;
    process.env.S1R1US_ADMIN_X_ID = FIX_ID;
  });

  after(() => {
    for (const [k, v] of [
      ["S1R1US_ADMIN_X_HANDLE", PREV.handle],
      ["S1R1US_ADMIN_X_NAME", PREV.name],
      ["S1R1US_ADMIN_X_ID", PREV.id],
    ] as const) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  });

  it("accepts only configured handle and snowflake from env", async () => {
    const {
      looksLikeAdminX,
      preferredXAccountId,
      profileLooksLikeAdminX,
      getAdminXHandle,
      getAdminXHandleCore,
      getAdminXId,
    } = await import("./x-admin.server.ts");
    assert.equal(getAdminXHandleCore(), FIX_HANDLE);
    assert.equal(getAdminXHandle(), `@${FIX_HANDLE}`);
    assert.equal(getAdminXId(), FIX_ID);
    assert.equal(looksLikeAdminX(`@${FIX_HANDLE}`), true);
    assert.equal(looksLikeAdminX(FIX_HANDLE), true);
    assert.equal(looksLikeAdminX(`@${FIX_HANDLE.toUpperCase()}`), true);
    assert.equal(looksLikeAdminX(FIX_ID), true);
    assert.equal(looksLikeAdminX(`twitter:${FIX_ID}`), true);
    assert.equal(looksLikeAdminX(`x:${FIX_HANDLE}`), true);
    assert.equal(looksLikeAdminX(`grok-x:${FIX_ID}`), true);
  });

  it("rejects display names, emails, company, dead handles, noise", async () => {
    const { looksLikeAdminX } = await import("./x-admin.server.ts");
    assert.equal(looksLikeAdminX(FIX_NAME), false);
    assert.equal(looksLikeAdminX(`@${FIX_NAME}`), false);
    assert.equal(looksLikeAdminX(`${FIX_HANDLE}@x.com`), false);
    assert.equal(looksLikeAdminX(`https://x.com/${FIX_HANDLE}`), false);
    assert.equal(looksLikeAdminX(`@@${FIX_HANDLE}`), false);
    assert.equal(looksLikeAdminX(`@${FIX_HANDLE} extra`), false);
    assert.equal(looksLikeAdminX("@S1R1US"), false);
    assert.equal(looksLikeAdminX("S1R1US"), false);
    assert.equal(looksLikeAdminX("@_S1R1US_"), false);
    assert.equal(looksLikeAdminX("@S1R1S_AI"), false);
    assert.equal(looksLikeAdminX("@S1R1US_AI"), false);
    assert.equal(looksLikeAdminX(""), false);
    assert.equal(looksLikeAdminX(null), false);
    assert.equal(looksLikeAdminX("1000000000000000002"), false);
  });

  it("never treats company or dead handles as company while unset, never as admin", async () => {
    const { looksLikeAdminX } = await import("./x-admin.server.ts");
    assert.equal(looksLikeCompanyX("@S1R1US"), false);
    assert.equal(looksLikeCompanyX("@_S1R1US_"), false);
    assert.equal(looksLikeCompanyX("@S1R1S_AI"), false);
    assert.equal(looksLikeCompanyX("S1R1S_AI"), false);
    assert.equal(looksLikeCompanyX("@S1R1US_AI"), true);
    assert.equal(looksLikeCompanyX("S1R1US_AI"), true);
    assert.equal(looksLikeAdminX("@S1R1US_AI"), false);
    assert.equal(isDeadCompanyHandle("S1R1US"), true);
    assert.equal(isDeadCompanyHandle("@_S1R1US_"), true);
    assert.equal(isDeadCompanyHandle("@S1R1S_AI"), true);
    assert.equal(isDeadCompanyHandle("@S1R1US_AI"), false);
  });

  it("only grok-x / twitter / x providers count", () => {
    assert.equal(isAdminXProvider("grok-x"), true);
    assert.equal(isAdminXProvider("twitter"), true);
    assert.equal(isAdminXProvider("x"), true);
    assert.equal(isAdminXProvider("google"), false);
    assert.equal(isAdminXProvider("email"), false);
    assert.equal(isAdminXProvider("credential"), false);
    assert.equal(isAdminXProvider("grok-gate"), false);
    assert.equal(normalizeXIdentity(`${FIX_HANDLE}@x.com`), "");
  });

  it("reads broker userinfo preferred_username when sub is a grok uuid", async () => {
    const { looksLikeAdminX, profileLooksLikeAdminX, preferredXAccountId, getAdminXHandleCore, getAdminXId } =
      await import("./x-admin.server.ts");
    const grokSub = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";
    const profile = {
      sub: grokSub,
      name: FIX_NAME,
      preferred_username: FIX_HANDLE,
      email: `${FIX_HANDLE}@users.noreply.x.com`,
    };
    assert.equal(looksLikeAdminX(grokSub), false);
    assert.equal(looksLikeAdminX(FIX_NAME), false);
    assert.equal(profileLooksLikeAdminX(profile), true);
    assert.equal(preferredXAccountId(profile), getAdminXHandleCore());
    assert.equal(
      preferredXAccountId({
        sub: grokSub,
        identities: [{ provider: "twitter", user_id: getAdminXId(), username: FIX_HANDLE }],
      }),
      getAdminXId(),
    );
    assert.equal(profileLooksLikeAdminX({ sub: grokSub, name: FIX_NAME }), false);
  });
});
