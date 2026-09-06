import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  LOCK_DEFAULT,
  LOCK_GIF_CLOSED,
  LOCK_GIF_OPEN,
  LOCK_IDS,
  LOCK_META,
  TAB_LOCK3D,
  emptyFlags,
  lockStatusView,
  normalizeFlags,
} from "./lock-status.ts";

const rpc = readFileSync(new URL("./desk-rpc.ts", import.meta.url), "utf8");
const ui = readFileSync(new URL("../../components/lock3d-status.tsx", import.meta.url), "utf8");
const rail = readFileSync(new URL("../../components/desk-workspace.tsx", import.meta.url), "utf8");
const admin = readFileSync(new URL("../../components/admin-panel.tsx", import.meta.url), "utf8");
const appAdmin = readFileSync(new URL("../../components/app-admin-panel.tsx", import.meta.url), "utf8");
const ping = readFileSync(new URL("../../routes/api/agent.ping.ts", import.meta.url), "utf8");

describe("LoCK3D STATUS", () => {
  it("keeps live tape as status only — not a lock", () => {
    const view = lockStatusView(LOCK_DEFAULT, "TRUE LIVE", "live");
    assert.equal(view.tapeLock, false);
    assert.equal(view.trade, false);
    assert.equal(view.ordersCreate, false);
    assert.equal(view.keysOnThisHost, false);
    assert.equal(view.thisHostTrades, false);
    assert.equal(view.coinbaseCreate, false);
    assert.equal(view.name, TAB_LOCK3D);
    assert.equal(LOCK_IDS.includes("tape" as (typeof LOCK_IDS)[number]), false);
    assert.equal(view.rows.every((r) => r.gif === LOCK_GIF_CLOSED || r.gif === LOCK_GIF_OPEN), true);
    assert.equal(view.rows.length, LOCK_IDS.length);
  });

  it("master lock follows include set", () => {
    const locked = emptyFlags(true);
    const include = emptyFlags(true);
    include.hive = false;
    locked.hive = false;
    const view = lockStatusView({ ...LOCK_DEFAULT, locked, include }, "SIMULATED", "paused");
    assert.equal(view.masterLocked, true);
    assert.equal(view.tape, "SIMULATED");
    const openAgents = lockStatusView(
      { ...LOCK_DEFAULT, locked: { ...locked, agents: false }, include },
      "TRUE LIVE",
      "live",
    );
    assert.equal(openAgents.masterLocked, false);
  });

  it("uses current CSS names for lock labels", () => {
    assert.equal(LOCK_META.agents.css, "legal-purple");
    assert.equal(LOCK_META.bot7Auto.css, "coinbase-orange");
    assert.equal(LOCK_META.gmAuto.css, "gm-rainbow");
    assert.equal(LOCK_META.gmManual.css, "gm-rainbow");
    assert.equal(LOCK_META.agentLive.css, "legal-purple");
    assert.equal(LOCK_META.hive.css, "hive-nav");
  });

  it("is wired for system Admin, phone Admin, tape rail, and agent ping", () => {
    assert.match(rpc, /setLockStatus/);
    assert.match(rpc, /verifyAppAdminToken/);
    assert.match(rpc, /setHiveSwarmStatus/);
    assert.match(rpc, /setHiveStatus\(next, system \? "system" : "app-admin"\)/);
    assert.match(ui, /LockGif/);
    assert.match(ui, /LOCK_GIF_CLOSED/);
    assert.match(ui, /LOCK_GIF_OPEN/);
    assert.match(rail, /Lock3dRail/);
    assert.match(admin, /Lock3dStatusPanel/);
    assert.match(appAdmin, /Lock3dStatusPanel/);
    assert.match(ping, /lockStatus/);
    assert.match(ping, /lockWelcomePublic/);
  });

  it("normalizeFlags fills missing ids from fallback", () => {
    const next = normalizeFlags({ agents: true }, LOCK_DEFAULT.locked);
    assert.equal(next.agents, true);
    assert.equal(next.bot7Auto, LOCK_DEFAULT.locked.bot7Auto);
    assert.equal(next.hive, LOCK_DEFAULT.locked.hive);
  });
});
