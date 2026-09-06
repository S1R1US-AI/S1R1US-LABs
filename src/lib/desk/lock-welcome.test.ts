import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { MCP_TOOLS } from "./agent-security.ts";
import { lockWelcomePublic, LOCK_AGENT_WELCOME, LOCK_IMG_SEO, LOCK_PATH } from "./lock-welcome.ts";
import { LOCK_GIF_CLOSED, LOCK_GIF_OPEN } from "./lock-status.ts";

const proto = readFileSync(new URL("./agent-protocol.ts", import.meta.url), "utf8");
const ping = readFileSync(new URL("../../routes/api/agent.ping.ts", import.meta.url), "utf8");
const locksApi = readFileSync(new URL("../../routes/api/agent.locks.ts", import.meta.url), "utf8");
const page = readFileSync(new URL("../../components/lock-page.tsx", import.meta.url), "utf8");
const faq = readFileSync(new URL("../desk/public-nav.ts", import.meta.url), "utf8");

describe("LoCK3D STATUS public tutorial", { concurrency: false }, () => {
  it("welcome is read-only — never lock_set, never Coinbase create", () => {
    const w = lockWelcomePublic();
    assert.equal(w.page, LOCK_PATH);
    assert.equal(w.imgSeo, LOCK_IMG_SEO);
    assert.equal(w.lockSet, false);
    assert.equal(w.trade, false);
    assert.equal(w.ordersCreate, false);
    assert.equal(w.keysOnThisHost, false);
    assert.equal(w.tapeLock, false);
    assert.equal(w.championship, "system-only");
    assert.equal(w.gifs.closed, LOCK_GIF_CLOSED);
    assert.equal(w.gifs.open, LOCK_GIF_OPEN);
    assert.equal(LOCK_AGENT_WELCOME.proofOfConcept, true);
    assert.equal(LOCK_AGENT_WELCOME.soonLive, true);
    assert.ok(LOCK_AGENT_WELCOME.neverMcp.includes("lock_set"));
    assert.match(LOCK_AGENT_WELCOME.ask, /research Quants/);
    assert.match(w.liveVsSim.games, /proof of concept/);
    assert.ok(w.tutorial.length >= 6);
    assert.ok(w.howToToggle.some((h) => h.who === "System Admin"));
    assert.ok(w.howToToggle.some((h) => h.who === "External AI agents"));
  });

  it("MCP lock_status is read-only; lock_set is absent", () => {
    assert.equal(MCP_TOOLS.has("lock_status"), true);
    assert.equal(MCP_TOOLS.has("lock_set"), false);
    assert.match(proto, /name: "lock_status"/);
    assert.equal(/name: "lock_set"/.test(proto), false);
    assert.match(locksApi, /lockWelcomePublic/);
    assert.match(ping, /lockWelcomePublic/);
    assert.match(page, /welcome-agents/);
    assert.match(page, /Locked Status/);
    assert.match(faq, /id: "lock3d-status"/);
    assert.match(faq, /id: "live-vs-sim"/);
    assert.match(faq, /id: "how-to-use"/);
  });
});
