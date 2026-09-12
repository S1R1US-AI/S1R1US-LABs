import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { writeFileSync, mkdirSync } from "node:fs";
import {
  PRED_GRANT,
  PRED_NAME,
  impliedYesPct,
  markDesk,
  predBookPublic,
  resetPredBookForTest,
} from "./pred-book.ts";

describe("PR3D1CT10N$ paper book", { concurrency: false }, () => {
  beforeEach(() => {
    process.env.NODE_TEST_CONTEXT = "1";
    resetPredBookForTest();
  });

  it("never takes bets and always seats G M0D3 AUTO with a 4,200 grant", () => {
    const snap = predBookPublic({ px: 108_000 });
    assert.equal(snap.name, PRED_NAME);
    assert.equal(snap.bets, false);
    assert.equal(snap.realMoney, false);
    assert.equal(snap.trade, false);
    assert.equal(snap.ordersCreate, false);
    assert.equal(snap.grant, PRED_GRANT);
    assert.equal(snap.tokenFake, true);
    assert.equal(snap.phoWallet, false);
    assert.ok(snap.board.some((d) => d.id === "gm-auto" && d.name === "G M0D3 AUTO"));
    assert.equal(snap.markets.length, 4);
    assert.match(snap.disclaimer, /never takes/);
  });

  it("ticks paper play on LIVE Coinbase last and freezes when admin sim is PAUSED", () => {
    try {
      mkdirSync("/workspace/data", { recursive: true });
    } catch {
      // /workspace may be read-only outside the production box; the test only needs /tmp under NODE_TEST_CONTEXT
    }
    writeFileSync("/tmp/live-sim.json", JSON.stringify({ status: "LIVE", practiceKilled: true, checkpoint: 68 }));
    resetPredBookForTest();
    const a = predBookPublic({ px: 108_000 });
    assert.equal(a.sim.live, true);
    assert.ok(a.sim.ticks >= 1);
    assert.ok(a.fills.length >= 1);
    const fills = a.fills.length;
    writeFileSync("/tmp/live-sim.json", JSON.stringify({ status: "PAUSED", practiceKilled: true, checkpoint: 68 }));
    const b = predBookPublic({ px: 130_000 });
    assert.equal(b.sim.live, false);
    assert.equal(b.fills.length, fills);
    writeFileSync("/tmp/live-sim.json", JSON.stringify({ status: "LIVE", practiceKilled: true, checkpoint: 68 }));
  });

  it("marks YES higher as BTC rises on the ATH paper market", () => {
    const low = impliedYesPct("ath-2026", 80_000, 80_000);
    const high = impliedYesPct("ath-2026", 160_000, 80_000);
    assert.ok(high > low);
    const eq = markDesk(
      { id: "x", name: "x", kind: "grok", system: false, bias: 0.5, cash: 1000, pos: [{ marketId: "ath-2026", yes: 100, no: 0 }], lastAt: null },
      [{ id: "ath-2026", kind: "ath", title: "t", strike: "ATH", yesPct: 60, volume: 0 }],
    );
    assert.equal(eq, 1060);
  });
});
