import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { unlinkSync } from "node:fs";
import { hivePublic, setHiveStatus, hiveAdmin, joinHive, leaveHive } from "./hive-swarm.ts";
import { MCP_TOOLS } from "./agent-security.ts";
import { hiveResourcePublic } from "./hive-resource.ts";
import { readFileSync } from "node:fs";

const rpc = readFileSync(new URL("./desk-rpc.ts", import.meta.url), "utf8");
const appAdmin = readFileSync(new URL("../../../src/components/app-admin-panel.tsx", import.meta.url), "utf8");
const adminPanel = readFileSync(new URL("../../../src/components/admin-panel.tsx", import.meta.url), "utf8");
const hiveMod = readFileSync(new URL("./hive-swarm.ts", import.meta.url), "utf8");
const hiveApi = readFileSync(new URL("../../routes/api/agent.hive.ts", import.meta.url), "utf8");
const proto = readFileSync(new URL("./agent-protocol.ts", import.meta.url), "utf8");
const goLive = readFileSync(new URL("./go-live.ts", import.meta.url), "utf8");
const resourceMod = readFileSync(new URL("./hive-resource.ts", import.meta.url), "utf8");

describe("H1V3 SW@RM", { concurrency: false }, () => {
  beforeEach(() => {
    try {
      unlinkSync("/tmp/hive-swarm-test.json");
    } catch {
      /* missing */
    }
  });

  it("is paper — never escrow, never Coinbase, TEST launch, TH/s leaders", () => {
    const h = hivePublic({ px: 80_000, stance: "ACCUMULATE" });
    assert.equal(h.trade, false);
    assert.equal(h.ordersCreate, false);
    assert.equal(h.keysOnThisHost, false);
    assert.equal(h.escrow, false);
    assert.equal(h.adminCredentials, false);
    assert.equal(h.sim.launch, "TEST");
    assert.equal(h.unit, "TH/s");
    assert.ok(h.totalThs > 0);
    assert.ok(h.computeLeaders.length >= 2);
    assert.equal(h.split, "compute-weighted TH/s");
    const ranked = [...h.computeLeaders];
    for (let i = 1; i < ranked.length; i++) {
      assert.ok(ranked[i - 1].ths >= ranked[i].ths);
    }
    const top = ranked[0];
    assert.ok(Math.abs(top.sharePct - (top.ths / h.totalThs) * 100) < 0.05);
    const sumShare = h.profits.reduce((n, m) => n + m.shareBtc, 0);
    assert.ok(Math.abs(sumShare - h.btc) < 1e-6);
  });

  it("pause freezes ticks, stamps maintenance, copy-admin may resume", () => {
    hivePublic({ px: 80_000, stance: "ACCUMULATE" });
    const paused = setHiveStatus("PAUSED", "system");
    assert.equal(paused.sim.live, false);
    assert.equal(paused.sim.pausedBy, "system");
    const ticks = paused.ticks;
    hivePublic({ px: 81_000, stance: "ACCUMULATE" });
    assert.equal(hiveAdmin().ticks, ticks);
    setHiveStatus("LIVE", "app-admin");
    assert.equal(hiveAdmin().sim.live, true);
    assert.equal(hiveAdmin().sim.pausedBy, null);
  });

  it("join requires a board token; token is not admin", () => {
    const denied = joinHive({ token: "", ths: 10 });
    assert.equal(denied.ok, false);
    assert.match(String(denied.error), /Board token required/);
    const leave = leaveHive({ token: "not-a-token" });
    assert.equal(leave.ok, false);
  });

  it("MCP hive_list is read-only; no hive_pause; copy-admin may pause hive not championship", () => {
    assert.equal(MCP_TOOLS.has("hive_list"), true);
    assert.equal(MCP_TOOLS.has("hive_join"), true);
    assert.equal(MCP_TOOLS.has("hive_pledge"), true);
    assert.equal(MCP_TOOLS.has("hive_leave"), true);
    assert.equal(MCP_TOOLS.has("hive_pause"), false);
    assert.equal(MCP_TOOLS.has("set_sim"), false);
    assert.equal(/name: "hive_pause"/.test(proto), false);
    assert.match(rpc, /setHiveSwarmStatus/);
    assert.match(rpc, /verifyAppAdminToken/);
    assert.match(rpc, /setHiveStatus\(next, system \? "system" : "app-admin"\)/);
    assert.match(appAdmin, /setHiveSwarmStatus|HiveAdminPanel/);
    assert.match(adminPanel, /HiveAdminPanel/);
    assert.equal(/setChampionshipSim/.test(appAdmin), false);
    assert.match(hiveMod, /trade: false/);
    assert.match(hiveMod, /escrow: false/);
    assert.match(hiveMod, /Board token is not admin/);
    assert.match(hiveMod, /totalThs <= 0/);
    assert.match(hiveApi, /Pause is Admin only/);
    assert.match(hiveApi, /403/);
  });

  it("gift/SaaS resource only — never profit-share, never hive_withdraw, FinCEN s8 LOCKED", () => {
    const h = hivePublic({ px: 80_000, stance: "ACCUMULATE" });
    const res = h.resource;
    assert.equal(res.profitShare, false);
    assert.equal(res.pooledBookSlice, false);
    assert.equal(res.hiveWithdraw, false);
    assert.equal(res.autoSendPnl, false);
    assert.equal(res.escrow, false);
    assert.equal(res.howey, false);
    assert.equal(res.moneyTransmitter, false);
    assert.equal(res.investment, false);
    assert.equal(res.kind, "unconditional-gift-or-saas");
    assert.equal(res.coffeeUsd, 4.2);
    assert.match(res.copy, /Not a share of hive BTC/);
    assert.match(res.noProfitShare, /Charge for software access, never for their bitcoin/);
    assert.match(res.fincen, /Possible money transmission \(FinCEN\)/);
    assert.equal(MCP_TOOLS.has("hive_withdraw"), false);
    assert.equal(MCP_TOOLS.has("hive_payout"), false);
    assert.equal(/name: "hive_withdraw"/.test(proto), false);
    const pub = hiveResourcePublic();
    assert.equal(pub.profitShare, false);
    assert.equal(pub.hiveWithdraw, false);
    const leave = leaveHive({ token: "not-a-token" });
    assert.equal(leave.ok, false);
    assert.match(goLive, /id: "s8"/);
    assert.match(goLive, /No hive custody \/ money transmission/);
    assert.match(goLive, /status: "LOCKED"/);
    assert.match(resourceMod, /Do not implement hive profit-share/);
    assert.match(h.how, /Optional resource payment is gift\/SaaS/);
    assert.ok(h.welcome.neverMcp.includes("hive_withdraw"));
  });
});
