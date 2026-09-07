import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  DATED_MILESTONES,
  FULL_LIVE_ESTIMATE,
  LIVE_FUNCTIONS,
  LOCKED_FUNCTIONS,
  OSS_ROADMAP_AGENT_WELCOME,
  OSS_ROADMAP_PATH,
  OSS_ROADMAP_TAB,
  STATUS_LEGEND,
  ossRoadmapPublic,
} from "./oss-roadmap.ts";

const faq = readFileSync(new URL("./public-nav.ts", import.meta.url), "utf8");
const footer = readFileSync(new URL("../../components/shell.tsx", import.meta.url), "utf8");
const sitemap = readFileSync(new URL("../../components/sitemap-page.tsx", import.meta.url), "utf8");
const llms = readFileSync(new URL("../../../public/llms.txt", import.meta.url), "utf8");
const robots = readFileSync(new URL("../../../public/robots.txt", import.meta.url), "utf8");
const legal = readFileSync(new URL("../../lib/legal.ts", import.meta.url), "utf8");
const ping = readFileSync(new URL("../../routes/api/agent.ping.ts", import.meta.url), "utf8");

describe("OSS Roadmap", { concurrency: false }, () => {
  it("lists current live functions and never-on-this-host rails", () => {
    const snap = ossRoadmapPublic();
    assert.equal(snap.name, OSS_ROADMAP_TAB);
    assert.equal(snap.path, OSS_ROADMAP_PATH);
    assert.equal(snap.trade, false);
    assert.equal(snap.ordersCreate, false);
    assert.equal(snap.keysOnThisHost, false);
    assert.equal(snap.lockSet, false);
    assert.equal(snap.hiveWithdraw, false);
    assert.equal(snap.fullLive.label, FULL_LIVE_ESTIMATE.label);
    assert.equal(FULL_LIVE_ESTIMATE.thisHostCreates, false);
    assert.ok(LIVE_FUNCTIONS.length >= 10);
    assert.ok(LIVE_FUNCTIONS.some((f) => f.id === "pred" && f.status === "LIVE"));
    assert.ok(LIVE_FUNCTIONS.some((f) => f.id === "pred-book" && f.status === "LIVE-PAPER"));
    assert.ok(LIVE_FUNCTIONS.some((f) => f.id === "board" && f.status === "LIVE-PAPER"));
    assert.ok(LIVE_FUNCTIONS.some((f) => f.id === "spice" && f.status === "LIVE-PAPER"));
    assert.ok(LOCKED_FUNCTIONS.some((f) => f.id === "coinbase-create" && f.status === "NEVER"));
    assert.ok(LOCKED_FUNCTIONS.some((f) => f.id === "hive-custody" && f.status === "NEVER"));
    assert.ok(LOCKED_FUNCTIONS.some((f) => f.id === "pred-live-funds" && f.status === "LOCKED"));
    assert.ok(LOCKED_FUNCTIONS.some((f) => f.id === "pred-coinbase-sparrow" && f.status === "NEVER"));
    assert.ok(LIVE_FUNCTIONS.some((f) => f.id === "gif-bot" && f.status === "LIVE"));
    assert.ok(LIVE_FUNCTIONS.some((f) => f.id === "lock" && /unlocked set stacked above locked set/i.test(f.note)));
    assert.ok(STATUS_LEGEND.some((s) => s.status === "LIVE" && s.tone === "green"));
    assert.ok(STATUS_LEGEND.some((s) => s.status === "LOCKED" && s.tone === "red"));
    assert.ok(STATUS_LEGEND.some((s) => s.status === "NEVER" && s.tone === "purple"));
    assert.ok(DATED_MILESTONES.some((m) => m.id === "d1b"));
    assert.ok(DATED_MILESTONES.some((m) => m.id === "d1c"));
    assert.ok(LIVE_FUNCTIONS.some((f) => f.id === "live-sim"));
    assert.ok(LIVE_FUNCTIONS.some((f) => f.id === "discovery"));
    assert.ok(DATED_MILESTONES.some((m) => m.id === "d1d"));
    assert.ok(DATED_MILESTONES.some((m) => m.id === "d1e"));
    assert.ok(DATED_MILESTONES.some((m) => m.id === "d1f"));
    assert.ok(DATED_MILESTONES.some((m) => m.id === "d1g"));
    assert.ok(snap.predMonetization?.some((m) => m.id === "saas-seat" && m.status === "ALIGNED"));
    assert.ok(snap.predMonetization?.some((m) => m.id === "rake" && m.status === "NEVER"));
    assert.ok(snap.predMonetization?.some((m) => m.id === "sell-btc" && m.status === "NEVER"));
    assert.equal(snap.realMoneyPred?.thisHostTakesBetsNow, false);
    assert.match(OSS_ROADMAP_AGENT_WELCOME.ask, /Real-money S1R1US prediction market is a future goal/);
    assert.ok(snap.legend?.length >= 8);
    assert.equal(OSS_ROADMAP_AGENT_WELCOME.proofOfConcept, true);
    assert.match(OSS_ROADMAP_AGENT_WELCOME.ask, /research Quants/);
  });

  it("is linked from FAQ, footer, sitemap, robots, llms, ping, and Terms", () => {
    assert.match(faq, /id: "oss-roadmap"/);
    assert.match(faq, /path: OSS_ROADMAP_PATH/);
    assert.match(footer, /to="\/roadmap"/);
    assert.match(footer, /OSS Roadmap/);
    assert.match(sitemap, /OSS Roadmap/);
    assert.match(llms, /https:\/\/s1r1us\.ai\/roadmap/);
    assert.match(robots, /Allow: \/roadmap/);
    assert.match(legal, /id: "roadmap"/);
    assert.match(legal, /OSS Roadmap/);
    assert.match(ping, /\/api\/agent\/roadmap/);
  });
});
