import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { CHECKPOINT_BASELINE_N, CHECKPOINT_BUILD_N, liveSimNote } from "./live-sim.ts";
import { checkpointId, checkpointLabel, CHECKPOINT_FOLD } from "../launch/checkpoint.ts";
import { systemHealth } from "./system-health.ts";

const rpc = readFileSync(new URL("./desk-rpc.ts", import.meta.url), "utf8");
const hunter = readFileSync(new URL("./hunter.ts", import.meta.url), "utf8");
const faq = readFileSync(new URL("./public-nav.ts", import.meta.url), "utf8");
const appAdmin = readFileSync(new URL("../../components/app-admin-panel.tsx", import.meta.url), "utf8");
const admin = readFileSync(new URL("../../components/admin-panel.tsx", import.meta.url), "utf8");
const morning = readFileSync(new URL("../../components/morning-report-pdf.tsx", import.meta.url), "utf8");
const server = readFileSync(new URL("./live-sim.server.ts", import.meta.url), "utf8");

describe("live-sim checkpoint sync", { concurrency: false }, () => {
  it("baseline and current checkpoint are 68 and stay labeled", () => {
    assert.equal(CHECKPOINT_BASELINE_N, 68);
    assert.equal(CHECKPOINT_BUILD_N, 68);
    assert.equal(checkpointId(), "68");
    assert.equal(checkpointLabel(), "DEPLOY #68");
    assert.match(CHECKPOINT_FOLD, /^2026-09-07/);
    assert.match(liveSimNote("LIVE"), /DEPLOY #68/);
    const h = systemHealth();
    assert.equal(h.checkpoint, "68");
    assert.equal(h.liveUnlocked, false);
    assert.equal(h.copyAdminCannotPauseChampionship, false);
    assert.equal(h.copyAdminMayPauseChampionship, true);
  });

  it("dual-admin pause is wired; championship pause is dual-admin", () => {
    assert.match(rpc, /export const setLiveSim/);
    assert.match(rpc, /verifyAppAdminToken/);
    assert.match(rpc, /setLiveSimStatus/);
    assert.match(rpc, /export const setChampionshipSim/);
    const cupBlock = rpc.slice(rpc.indexOf("export const setChampionshipSim"), rpc.indexOf("export const fetchHiveSwarm"));
    assert.match(cupBlock, /verifyAppAdminToken/);
    assert.match(admin, /LiveSimPanel/);
    assert.match(appAdmin, /LiveSimPanel/);
    assert.match(appAdmin, /MorningReportPdf/);
    assert.match(morning, /Problems found last 24 hours/);
    assert.match(morning, /ProblemsMorningSection/);
    assert.match(hunter, /h-live-sim/);
    assert.match(faq, /id: "live-sim"/);
    assert.match(server, /CHECKPOINT_BUILD_N/);
    assert.match(server, /desync-rebased-to-baseline/);
    assert.match(server, /testLiveSimCheckpoint/);
    assert.match(server, /healLiveSim/);
  });

  it("pause and resume stay paper — never Coinbase create", async () => {
    const { setLiveSimStatus, healLiveSim } = await import("./live-sim.server.ts");
    const paused = setLiveSimStatus("PAUSED", "system");
    assert.equal(paused.status, "PAUSED");
    assert.equal(paused.trade, false);
    assert.equal(paused.ordersCreate, false);
    const live = setLiveSimStatus("LIVE", "system");
    assert.equal(live.status, "LIVE");
    assert.equal(live.practiceKilled, true);
    const healed = healLiveSim();
    assert.equal(healed.status, "LIVE");
    assert.equal(healed.trade, false);
  });
});
