import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  OSS_LICENSE_NOTICE,
  SYSTEM_ADMIN_OVERRIDE,
  WHITE_LABEL_BUILDERS,
  WHITE_LABEL_PATH,
  WHITE_LABEL_PRIVILEGES,
  WHITE_LABEL_STRIP,
  builderPrompt,
  emptyWhiteLabelConfig,
  fieldBlocked,
  verifyWhiteLabelConfig,
  whiteLabelGate,
  whiteLabelGoLive,
  type WhiteLabelConfig,
} from "./white-label.ts";

function goodConfig(): WhiteLabelConfig {
  return {
    domain: "example-fund.com",
    menus: ["Home", "Desk", "FAQ"],
    systemAdmin: "@new_admin",
    phoneAppUser: "@phone_user",
    webhostName: "my-droplet",
    webhostIp: "203.0.113.7",
    dns1: "ns1.example-fund.com",
    dns2: "ns2.example-fund.com",
    secrets: [{ id: "better_auth_id", secret: "better_auth_secret_name" }],
    githubRepo: "new-admin/example-fund",
    githubAdmin: "@new_admin",
  };
}

describe("7-B0T H3DGE FUND WHITE LABEL", () => {
  it("strips all S1R1US.ai admin rights, data, tokens, and host info from the offering", () => {
    const strip = WHITE_LABEL_STRIP.join(" ");
    assert.match(strip, /system admin rights and privileges/);
    assert.match(strip, /games, rolls, information, and simulations of data/);
    assert.match(strip, /GitHub S1R1US-AI\/S1R1US-LABs/);
    assert.match(strip, /access tokens — including any encrypted data — and all web host information/);
    assert.match(strip, /S1R1US-ADMIN/);
    assert.match(strip, /Roadmap and licensing/);
    assert.match(strip, /Terms and Agreement and Privacy Policy/);
  });

  it("blocks proprietary s1r1us.ai info in every dialogue box", () => {
    assert.equal(fieldBlocked("example.com"), null);
    assert.match(fieldBlocked("s1r1us.ai") ?? "", /Blocked/);
    assert.match(fieldBlocked("S1R1US-ADMIN") ?? "", /Blocked/);
    assert.match(fieldBlocked("S1R1uSxadm") ?? "", /Blocked/);
    assert.match(fieldBlocked("github.com/S1R1US-AI/S1R1US-LABs") ?? "", /Blocked/);
    assert.match(fieldBlocked("@_Mr_R0b0t0_") ?? "", /Blocked/);
    assert.match(fieldBlocked("shop.s1r1u$.io") ?? "", /Blocked/);
  });

  it("verifies a clean custom config and rebrands on go-live", () => {
    const res = whiteLabelGoLive(goodConfig(), { handle: "@phone_user" });
    assert.equal(res.live, true);
    assert.equal(res.brand, "example-fund.com");
  });

  it("never goes live under S1R1US.ai and reports the failure on screen", () => {
    const cfg = { ...goodConfig(), domain: "s1r1us.ai" };
    const res = whiteLabelGoLive(cfg, { handle: "@phone_user" });
    assert.equal(res.live, false);
    assert.match(res.report.join(" "), /GO-LIVE BLOCKED/);
    assert.match(res.report.join(" "), /Double-check the config .* or redownload the app and try again/);
  });

  it("never allows S1R1US-AI/S1R1US-LABs (any branch or main) as the white label repository", () => {
    for (const repo of [
      "S1R1US-AI/S1R1US-LABs",
      "github.com/S1R1US-AI/S1R1US-LABs",
      "https://github.com/S1R1US-AI/S1R1US-LABs/tree/main",
      "S1R1US-AI/S1R1US-LABs#main",
    ]) {
      const check = verifyWhiteLabelConfig({ ...goodConfig(), githubRepo: repo });
      assert.equal(check.ok, false, repo);
      assert.match(check.failures.join(" "), /never be the white label repository/);
    }
  });

  it("requires domain, both accounts, a repo, a GitHub admin, and one token id + secret", () => {
    const check = verifyWhiteLabelConfig(emptyWhiteLabelConfig());
    assert.equal(check.ok, false);
    const joined = check.failures.join(" ");
    assert.match(joined, /Domain name is required/);
    assert.match(joined, /system admin name is required/);
    assert.match(joined, /phone app user name is required/);
    assert.match(joined, /GitHub repository is required/);
    assert.match(joined, /GitHub system admin/);
    assert.match(joined, /token id \+ secret pair/);
  });

  it("blocks bad actors flagged by security tab, S3C sweep, or morning report — permanently", () => {
    for (const flaggedBy of ["security-tab", "s3c-sweep", "morning-report"] as const) {
      const gate = whiteLabelGate({ handle: "@bad_actor", flaggedBy });
      assert.equal(gate.allowed, false);
      assert.equal(gate.lockedForever, true);
      assert.match(gate.reason, /No second chances/);
      const live = whiteLabelGoLive(goodConfig(), { handle: "@bad_actor", flaggedBy });
      assert.equal(live.live, false);
    }
  });

  it("lets @_Mr_R0b0t0_ override anything — even an accidental ban", () => {
    assert.equal(SYSTEM_ADMIN_OVERRIDE, "@_Mr_R0b0t0_");
    const gate = whiteLabelGate({ handle: "_Mr_R0b0t0_", flaggedBy: "s3c-sweep" });
    assert.equal(gate.allowed, true);
    assert.equal(gate.lockedForever, false);
  });

  it("offers Grok, Claude, and GitHub Copilot builder links and the OSS obligation notice", () => {
    assert.deepEqual(
      WHITE_LABEL_BUILDERS.map((b) => b.id),
      ["grok", "claude", "copilot"],
    );
    assert.match(
      OSS_LICENSE_NOTICE,
      /Copyright, public-source terms, and OSS license obligations must be reviewed and enforced before quoting, copying, or integrating material\./,
    );
    const prompt = builderPrompt(goodConfig());
    assert.match(prompt, /example-fund\.com/);
    assert.match(prompt, /OSS license obligations/);
    assert.doesNotMatch(prompt, /better_auth_secret_name/);
  });

  it("keeps s1r1us.ai system admin the highest privilege — white label can never overtake it", () => {
    for (const row of WHITE_LABEL_PRIVILEGES) {
      if (row.system === "YES") assert.match(row.white, /NEVER/);
    }
  });

  it("is wired to the Security tab, page route, sitemap, and app download page", () => {
    assert.equal(WHITE_LABEL_PATH, "/wh1t3");
    const securityUi = readFileSync(new URL("../../components/security-desk.tsx", import.meta.url), "utf8");
    assert.match(securityUi, /WHITE_LABEL_WATCH/);
    assert.match(securityUi, /useSaverLock/);
    const page = readFileSync(new URL("../../components/white-label-page.tsx", import.meta.url), "utf8");
    assert.match(page, /whiteLabelGoLive/);
    assert.match(page, /WHITE_LABEL_BUILDERS/);
    assert.match(page, /fieldBlocked/);
    const nav = readFileSync(new URL("./public-nav.ts", import.meta.url), "utf8");
    assert.match(nav, /WHITE_LABEL_PATH/);
    const app = readFileSync(new URL("../../components/mobile-app-page.tsx", import.meta.url), "utf8");
    assert.match(app, /WHITE_LABEL/);
  });
});
