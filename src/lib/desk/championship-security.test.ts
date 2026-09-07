import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { MCP_TOOLS } from "./agent-security.ts";

const appAdmin = readFileSync(new URL("../../../src/components/app-admin-panel.tsx", import.meta.url), "utf8");
const paperManual = readFileSync(new URL("../../../src/components/paper-manual.tsx", import.meta.url), "utf8");
const adminPanel = readFileSync(new URL("../../../src/components/admin-panel.tsx", import.meta.url), "utf8");
const deskRpc = readFileSync(new URL("./desk-rpc.ts", import.meta.url), "utf8");
const worldCup = readFileSync(new URL("./world-cup.ts", import.meta.url), "utf8");
const thesis = readFileSync(new URL("./thesis.ts", import.meta.url), "utf8");

describe("championship security sweep", { concurrency: false }, () => {
  it("copy-admin never imports thesis or PaperManual; championship sim pause is dual-admin", () => {
    assert.equal(/thesis/.test(appAdmin), false);
    assert.equal(/PaperManual/.test(appAdmin), false);
    assert.match(appAdmin, /ChampionshipSimPanel/);
    assert.match(appAdmin, /setChampionshipSim|ChampionshipSimPanel/);
    assert.match(appAdmin, /Device paper book only/);
  });

  it("research paper is wired only through system Admin Paper tab", () => {
    assert.match(paperManual, /THESIS_META/);
    assert.match(paperManual, /System Admin only/);
    assert.match(adminPanel, /PaperManual/);
    assert.match(thesis, /system Admin only/);
    assert.match(thesis, /not shown on iOS\/Google copy-admin/);
  });

  it("sim pause requires admin token and never Coinbase create", () => {
    assert.match(deskRpc, /setChampionshipSim/);
    assert.match(deskRpc, /verifyAccessToken/);
    assert.match(deskRpc, /verifyAppAdminToken/);
    assert.match(worldCup, /trade: false/);
    assert.match(worldCup, /ordersCreate: false/);
    assert.match(worldCup, /escrow: false/);
    assert.match(worldCup, /keysOnThisHost: false/);
    assert.match(worldCup, /Not affiliated with FIFA/);
  });

  it("MCP cup_list is read-only; no cup write tools", () => {
    assert.equal(MCP_TOOLS.has("cup_list"), true);
    assert.equal(MCP_TOOLS.has("cup_tick"), false);
    assert.equal(MCP_TOOLS.has("set_sim"), false);
    assert.equal(MCP_TOOLS.has("orders_create"), false);
  });

  it("H1V3 SW@RM MCP has no pause or withdraw; copy-admin may pause championship", () => {
    assert.equal(MCP_TOOLS.has("hive_list"), true);
    assert.equal(MCP_TOOLS.has("hive_join"), true);
    assert.equal(MCP_TOOLS.has("hive_pause"), false);
    assert.equal(MCP_TOOLS.has("hive_withdraw"), false);
    assert.equal(MCP_TOOLS.has("hive_payout"), false);
    assert.match(appAdmin, /ChampionshipSimPanel/);
    assert.match(appAdmin, /HiveAdminPanel/);
    assert.match(adminPanel, /HiveAdminPanel/);
    assert.equal(/thesis/.test(appAdmin), false);
    assert.match(thesis, /Do not implement hive profit-share/);
    assert.match(thesis, /go-live roadmap \(step s8\)/);
    assert.equal(MCP_TOOLS.has("byo_connect"), true);
    assert.equal(MCP_TOOLS.has("lock_status"), true);
    assert.equal(MCP_TOOLS.has("lock_set"), false);
    assert.equal(MCP_TOOLS.has("keys_store"), false);
    assert.equal(MCP_TOOLS.has("vpn_connect"), false);
    assert.equal(MCP_TOOLS.has("pred_list"), false);
    assert.equal(MCP_TOOLS.has("pred_bet"), false);
    assert.equal(MCP_TOOLS.has("pred_arm"), false);
    assert.equal(MCP_TOOLS.has("pred_live"), false);
  });

  it("as-live sim pause is dual-admin; championship pause is dual-admin", () => {
    assert.match(deskRpc, /export const setLiveSim/);
    const liveBlock = deskRpc.slice(deskRpc.indexOf("export const setLiveSim"), deskRpc.indexOf("export const fetchLockStatus"));
    assert.match(liveBlock, /verifyAppAdminToken/);
    const cupBlock = deskRpc.slice(deskRpc.indexOf("export const setChampionshipSim"), deskRpc.indexOf("export const fetchHiveSwarm"));
    assert.match(cupBlock, /verifyAppAdminToken/);
    assert.match(appAdmin, /LiveSimPanel/);
    assert.match(adminPanel, /LiveSimPanel/);
  });

  it("Terms and Privacy name championship, hive, lock, FinCEN, cookies", () => {
    const legal = readFileSync(new URL("../../lib/legal.ts", import.meta.url), "utf8");
    assert.match(legal, /id: "cup"/);
    assert.match(legal, /id: "fincen"/);
    assert.match(legal, /id: "cookies"/);
    assert.match(legal, /id: "sim"/);
    assert.match(thesis, /hunter h-legal/);
    assert.match(thesis, /Terms, Privacy, and operator-facing functions/);
  });
});
