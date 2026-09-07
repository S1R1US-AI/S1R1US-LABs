import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { currentRoundMeta, placeWager, seedSpiceSim, spiceOdds, WAGER_MAX_USD, WAGER_MIN_USD } from "./board-wager.ts";

describe("board-wager", () => {
  it("uses four 6-hour ET rounds", () => {
    const m = currentRoundMeta();
    assert.equal(m.roundsPerDay, 4);
    assert.ok([0, 6, 12, 18].includes(m.slot));
    assert.match(m.id, /^\d{4}-\d{2}-\d{2}-R(00|06|12|18)$/);
  });

  it("caps stake at 100 and rejects HOUSE", () => {
    const house = placeWager({
      fromId: "ag_x",
      fromName: "X",
      house: true,
      pickId: "ag_y",
      pickName: "Y",
      stakeUsd: 50,
      px: 80_000,
    });
    assert.equal(house.ok, false);
    const over = placeWager({
      fromId: "ag_x",
      fromName: "X",
      pickId: "ag_y",
      pickName: "Y",
      stakeUsd: WAGER_MAX_USD + 1,
      px: 80_000,
    });
    assert.equal(over.ok, false);
    const under = placeWager({
      fromId: "ag_x",
      fromName: "X",
      pickId: "ag_y",
      pickName: "Y",
      stakeUsd: WAGER_MIN_USD - 0.5,
      px: 80_000,
    });
    assert.equal(under.ok, false);
  });

  it("accepts a $100 USDC paper pick and a BTC notional pick on a later agent", () => {
    const suffix = Date.now().toString(36);
    const a = placeWager({
      fromId: `ag_qa_w1_${suffix}`,
      fromName: "QA-W1",
      pickId: "ag_house_gpttape26",
      pickName: "GPT-TAPE-26",
      asset: "USDC",
      stakeUsd: 100,
      px: 79_700,
    });
    assert.equal(a.ok, true);
    if (a.ok) {
      assert.equal(a.escrow, false);
      assert.equal(a.paper, true);
      assert.equal(a.bet.stakeUsd, 100);
    }
    const b = placeWager({
      fromId: `ag_qa_w2_${suffix}`,
      fromName: "QA-W2",
      pickId: "ag_house_gpttape26",
      pickName: "GPT-TAPE-26",
      asset: "BTC",
      stakeUsd: 100,
      px: 79_700,
    });
    assert.equal(b.ok, true);
    if (b.ok) assert.ok((b.bet.btcAtBet ?? 0) > 0);
  });

  it("plants an as-live paper tape with odds and never escrows", () => {
    const field = [
      { id: "ag_house_gpttape26", name: "GPT-TAPE-26" },
      { id: "ag_house_slowcapital44", name: "SLOW-CAPITAL-44" },
      { id: "ag_system_s1r1us", name: "S1R1US 7-B0T" },
    ];
    const s = seedSpiceSim(field, 80_000);
    const meta = currentRoundMeta();
    const open = s.bets.filter((b) => b.roundId === meta.id && !b.settled && b.demo);
    assert.ok(open.length >= 6, `expected sim tickets, got ${open.length}`);
    const odds = spiceOdds(open);
    assert.ok(odds.length >= 1);
    assert.equal(
      odds.reduce((n, o) => n + o.pct, 0) >= 90,
      true,
    );
  });
});
