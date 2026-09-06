import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { unlinkSync } from "node:fs";
import { GM_AUTO_ID, SYSTEM_KING_ID } from "./board-callout.ts";
import { CUP_WILDCARDS, cupPublic, ensureField, setSimStatus } from "./world-cup.ts";

try {
  unlinkSync("/tmp/world-cup-test.json");
} catch {
  /* fresh */
}

const pool = [
  { id: "ag_bowl_1", name: "BowlChamp", house: false },
  { id: "ag_w1", name: "WildOne", house: false },
  { id: "ag_w2", name: "WildTwo", house: false },
  { id: "ag_w3", name: "WildThree", house: false },
  { id: "ag_w4", name: "WildFour", house: false },
  { id: "ag_w5", name: "WildFive", house: false },
  { id: "ag_w6", name: "WildSix", house: false },
  { id: "ag_house", name: "HOUSE", house: true },
];

describe("world-cup", { concurrency: false }, () => {
  it("always seats G M0D3 AUTO, system king, bowl invitees, and 5 wild cards", () => {
    const s = ensureField({ year: 2026, bowlWinners: [{ id: "ag_bowl_1", name: "BowlChamp" }], pool });
    const ids = s.desks.map((d) => d.id);
    assert.ok(ids.includes(GM_AUTO_ID));
    assert.ok(ids.includes(SYSTEM_KING_ID));
    assert.ok(ids.includes("ag_bowl_1"));
    assert.equal(s.desks.filter((d) => d.kind === "wildcard").length, CUP_WILDCARDS);
    assert.ok(!ids.includes("ag_house"));
  });

  it("keeps wild cards stable for the same ET year", () => {
    const a = ensureField({ year: 2026, bowlWinners: [{ id: "ag_bowl_1", name: "BowlChamp" }], pool });
    const b = ensureField({ year: 2026, bowlWinners: [{ id: "ag_bowl_1", name: "BowlChamp" }], pool });
    const wildA = a.desks.filter((d) => d.kind === "wildcard").map((d) => d.id).sort();
    const wildB = b.desks.filter((d) => d.kind === "wildcard").map((d) => d.id).sort();
    assert.deepEqual(wildA, wildB);
  });

  it("ticks paper fills when LIVE and freezes when PAUSED", () => {
    setSimStatus("LIVE");
    const live = cupPublic({
      px: 80_000,
      bowlWinners: [{ id: "ag_bowl_1", name: "BowlChamp" }],
      pool,
    });
    assert.equal(live.trade, false);
    assert.equal(live.ordersCreate, false);
    assert.equal(live.escrow, false);
    assert.equal(live.keysOnThisHost, false);
    assert.equal(live.sim.live, true);
    assert.ok(live.ticks >= 1);
    const afterLive = live.ticks;

    const paused = setSimStatus("PAUSED");
    assert.equal(paused.live, false);
    const held = cupPublic({
      px: 90_000,
      bowlWinners: [{ id: "ag_bowl_1", name: "BowlChamp" }],
      pool,
    });
    assert.equal(held.sim.live, false);
    assert.equal(held.ticks, afterLive);
    assert.equal(held.gmAuto?.id, GM_AUTO_ID);

    setSimStatus("LIVE");
  });

  it("never exposes admin credentials on the public cup", () => {
    const pub = cupPublic({
      px: 70_000,
      bowlWinners: [{ id: "ag_bowl_1", name: "BowlChamp" }],
      pool,
    });
    assert.equal(pub.adminCredentials, false);
    assert.match(pub.disclaimer, /FIFA/);
    assert.match(pub.how, /never places Coinbase orders/);
  });
});
