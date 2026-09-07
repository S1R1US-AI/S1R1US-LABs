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
  groupLockRows,
  lockStatusView,
  lockViewPath,
  normalizeFlags,
} from "./lock-status.ts";

const rpc = readFileSync(new URL("./desk-rpc.ts", import.meta.url), "utf8");
const ui = readFileSync(new URL("../../components/lock3d-status.tsx", import.meta.url), "utf8");
const rail = readFileSync(new URL("../../components/desk-workspace.tsx", import.meta.url), "utf8");
const admin = readFileSync(new URL("../../components/admin-panel.tsx", import.meta.url), "utf8");
const appAdmin = readFileSync(new URL("../../components/app-admin-panel.tsx", import.meta.url), "utf8");
const ping = readFileSync(new URL("../../routes/api/agent.ping.ts", import.meta.url), "utf8");
const css = readFileSync(new URL("../../../src/styles.css", import.meta.url), "utf8");
const closedGif = readFileSync(new URL("../../../public/lock-closed.gif", import.meta.url));
const openGif = readFileSync(new URL("../../../public/AI-Agent-Lock-System-for-AI-Agent-BTC-Trading-Bot.gif", import.meta.url));
const openAlias = readFileSync(new URL("../../../public/lock-open.gif", import.meta.url));
const botGif = readFileSync(new URL("../../../public/AI-Bitcoin-Trading-Bot.gif", import.meta.url));

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
    assert.equal(LOCK_GIF_OPEN, "/AI-Agent-Lock-System-for-AI-Agent-BTC-Trading-Bot.gif");
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
    assert.equal(LOCK_META.pred.css, "gold-css");
    assert.equal(LOCK_DEFAULT.locked.pred, false);
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
    assert.match(rail, /GIF_AI_BTC_BOT/);
    assert.match(rail, /to="\/gm"/);
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

  it("padlock GIFs are transparent and CSS never rainbows the GIF", () => {
    assert.equal(closedGif.subarray(0, 6).toString(), "GIF89a");
    assert.equal(openGif.subarray(0, 6).toString(), "GIF89a");
    assert.equal(openAlias.subarray(0, 6).toString(), "GIF89a");
    assert.equal(botGif.subarray(0, 6).toString(), "GIF89a");
    assert.equal(closedGif.includes(Buffer.from([0x21, 0xf9])), true);
    assert.equal(openGif.includes(Buffer.from([0x21, 0xf9])), true);
    assert.match(css, /Never inherit GM rainbow/);
    assert.match(css, /\.gm-rainbow \.lock-gif/);
    assert.match(css, /background: transparent !important/);
    assert.match(ui, /className=\{cn\("lock-gif"/);
    assert.equal(/gm-rainbow[^"]*lock-gif|lock-gif[^"]*gm-rainbow/.test(ui), false);
    assert.match(ui, /lock-status-cols/);
    assert.match(ui, /lock-col-open/);
    assert.match(ui, /lock-col-closed/);
    assert.match(css, /\.gold-css/);
    assert.match(css, /godzilla-shift/);
    assert.match(ui, /lock-cell-link/);
    assert.match(ui, /text-expand/);
    assert.match(ui, /rainGmBurst\(2500\)/);
    assert.match(ui, /gmAuto/);
    assert.match(ui, /gmManual/);
    assert.match(ui, /hash=\{row\.hash\}/);
    assert.equal(LOCK_META.agents.to, "/agent");
    assert.equal(LOCK_META.hive.to, "/h1v3");
    assert.equal(LOCK_META.gmAuto.to, "/gm");
    assert.equal(LOCK_META.gmAuto.hash, "auto");
    assert.equal(LOCK_META.gmManual.hash, "manual");
    assert.equal(LOCK_META.bot7Auto.hash, "bot7");
    assert.equal(LOCK_META.agentLive.hash, "live");
    assert.equal(LOCK_META.pred.to, "/pr3d");
    assert.equal(lockViewPath("gmAuto"), "/gm#auto");
    assert.equal(lockViewPath("hive"), "/h1v3");
    assert.match(ui, /lock-status-cols/);
    const board = ui.slice(ui.indexOf("function LockBoard"), ui.indexOf("export function LockHead"));
    assert.ok(board.indexOf('title="UNLOCKED"') < board.indexOf('title="LOCKED"'));
    const grouped = groupLockRows(lockStatusView(LOCK_DEFAULT, "TRUE LIVE", "live").rows);
    assert.equal(grouped.unlocked.every((r) => r.locked === false), true);
    assert.equal(grouped.locked.every((r) => r.locked === true), true);
    assert.equal(grouped.unlocked.length + grouped.locked.length, 7);
    assert.equal(grouped.unlocked.some((r) => r.id === "pred"), true);
  });
});
