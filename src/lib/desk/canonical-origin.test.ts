import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CANONICAL_ORIGIN,
  classifyRequest,
  originAllowedPinned,
  phoneAdminHttps,
  phoneAdminProtocol,
  phoneAdminScheme,
  privilegeHostFromHeaders,
  resolvePhoneHref,
  rpIdPinned,
  runHostSwapPoc,
  systemOauthRedirectUri,
  uriHunterFinding,
} from "./canonical-origin.ts";

describe("Wave 3 URI pin", () => {
  it("pins system OAuth redirect_uri to s1r1us.ai, not the request host", () => {
    assert.equal(
      systemOauthRedirectUri("x"),
      `${CANONICAL_ORIGIN}/api/auth/oauth2/callback/x`,
    );
    const preview = classifyRequest({
      host: "deadbeef.preview.grok-sandbox.com",
      path: "/api/auth/oauth2/callback/x",
    });
    assert.equal(preview.allowed, false);
    assert.equal(preview.oauthRedirectUri, systemOauthRedirectUri("x"));
  });

  it("allows preview tape and denies preview /admin and /security", () => {
    const tape = classifyRequest({ host: "x.grok-sandbox.com", path: "/" });
    const admin = classifyRequest({ host: "x.grok-sandbox.com", path: "/admin" });
    const security = classifyRequest({ host: "x.grok-sandbox.com", path: "/security" });
    assert.equal(tape.allowed, true);
    assert.equal(admin.allowed, false);
    assert.equal(security.allowed, false);
  });

  it("rejects Host / X-Forwarded-Host swap and does not let XFH elevate", () => {
    const r = classifyRequest({
      host: "s1r1us.ai",
      forwardedHost: "attacker.invalid",
      path: "/admin",
    });
    assert.equal(r.allowed, false);
    assert.equal(r.spoof, true);
    assert.equal(
      privilegeHostFromHeaders({ host: "s1r1us.ai", forwardedHost: "evil.example" }),
      "s1r1us.ai",
    );
  });

  it("maps phone schemes to copy-admin https and refuses system admin scheme", () => {
    assert.equal(phoneAdminHttps(), "https://s1r1us.ai/app/admin");
    assert.equal(phoneAdminScheme(), "s1r1us://app/admin");
    assert.equal(phoneAdminProtocol(), "web+s1r1us://app/admin");
    const ok = resolvePhoneHref("s1r1us://app/admin");
    const proto = resolvePhoneHref("web+s1r1us://app/admin");
    const https = resolvePhoneHref("https://s1r1us.ai/app/admin");
    const bad = resolvePhoneHref("s1r1us://admin");
    const badProto = resolvePhoneHref("web+s1r1us://admin");
    assert.equal(ok.ok, true);
    assert.equal(ok.https, "https://s1r1us.ai/app/admin");
    assert.equal(proto.ok, true);
    assert.equal(https.ok, true);
    assert.equal(bad.ok, false);
    assert.equal(badProto.ok, false);
  });

  it("closes the WebAuthn Host-swap hole", () => {
    assert.equal(originAllowedPinned("https://s1r1us.ai"), true);
    assert.equal(originAllowedPinned("https://www.s1r1us.ai"), true);
    assert.equal(originAllowedPinned("http://127.0.0.1"), true);
    assert.equal(originAllowedPinned("https://evil.example"), false);
    assert.equal(originAllowedPinned("https://abc.preview.grok-sandbox.com"), false);
    assert.equal(rpIdPinned("https://evil.example"), "s1r1us.ai");
    assert.equal(rpIdPinned("https://www.s1r1us.ai"), "s1r1us.ai");
  });

  it("Host-swap PoC pack all pass and hunter is PASS", () => {
    const poc = runHostSwapPoc();
    const failed = poc.filter((p) => !p.pass);
    assert.deepEqual(failed, []);
    assert.equal(uriHunterFinding().status, "PASS");
  });
});
