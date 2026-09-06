import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { MCP_TOOLS } from "./agent-security.ts";
import { byoConnectPublic } from "./byo-connect.ts";
import { systemHealth } from "./system-health.ts";

const proto = readFileSync(new URL("./agent-protocol.ts", import.meta.url), "utf8");
const ping = readFileSync(new URL("../../routes/api/agent.ping.ts", import.meta.url), "utf8");
const connectApi = readFileSync(new URL("../../routes/api/agent.connect.ts", import.meta.url), "utf8");

describe("BYO connect + health", { concurrency: false }, () => {
  it("is automatic for agents — never keys, VPN, extra RPC, profit-share", () => {
    const c = byoConnectPublic();
    assert.equal(c.auto, true);
    assert.equal(c.keysOnThisHost, false);
    assert.equal(c.vpn, false);
    assert.equal(c.extraRpc, false);
    assert.equal(c.ssh, false);
    assert.equal(c.trade, false);
    assert.equal(c.escrow, false);
    assert.equal(c.howey, false);
    assert.equal(c.resource.profitShare, false);
    assert.equal(c.resource.hiveWithdraw, false);
    assert.ok(c.steps.length >= 5);
    assert.ok(c.competitions.includes("H1V3 SW@RM"));
    assert.match(c.autoHow, /Automatic for AI agents/);
    assert.match(connectApi, /byoConnectPublic/);
    assert.match(ping, /byoConnectPublic/);
  });

  it("MCP byo_connect is read-only; no key write tools", () => {
    assert.equal(MCP_TOOLS.has("byo_connect"), true);
    assert.equal(MCP_TOOLS.has("keys_store"), false);
    assert.equal(MCP_TOOLS.has("vpn_connect"), false);
    assert.match(proto, /name: "byo_connect"/);
    assert.match(proto, /readOnlyHint: true/);
    assert.equal(/name: "keys_store"/.test(proto), false);
  });

  it("checkpoint-68 health score is A-range and practice cannot arm Coinbase", () => {
    const h = systemHealth();
    assert.equal(h.checkpoint, "68");
    assert.equal(h.liveUnlocked, false);
    assert.equal(h.trade, false);
    assert.equal(h.practiceCannotArmCoinbase, true);
    assert.equal(h.copyAdminMayPauseHive, true);
    assert.equal(h.copyAdminCannotPauseChampionship, true);
    assert.ok(h.overall >= 85);
    assert.ok(h.security.score >= 90);
    assert.ok(h.function.score >= 80);
    assert.equal(h.grade === "A" || h.grade === "B", true);
  });
});
