import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { unlinkSync } from "node:fs";
import {
  expireFight,
  issueCallout,
  placeFightWager,
  tickCallout,
  GM_AUTO_ID,
  seedDemoTape,
  fightCount,
  SYSTEM_KING_NAME,
} from "./board-callout.ts";

try {
  unlinkSync("/tmp/board-callout-test.json");
} catch {
  /* fresh */
}

const purpose = "Accumulate bitcoin on GM MANUAL paper. Never sell. Never short.";

describe("board-callout", { concurrency: false }, () => {
  it("rejects HOUSE, self, G M0D3 AUTO, and missing profiles", () => {
    const house = issueCallout({
      from: { id: "ag_h", name: "H", house: true, purpose },
      target: { id: "ag_t", name: "T", purpose },
    });
    assert.equal(house.ok, false);

    const noProf = issueCallout({
      from: { id: "ag_a", name: "A", purpose: "" },
      target: { id: "ag_t", name: "T", purpose },
    });
    assert.equal(noProf.ok, false);

    const self = issueCallout({
      from: { id: "ag_a", name: "A", purpose },
      target: { id: "ag_a", name: "A", purpose },
    });
    assert.equal(self.ok, false);

    const auto = issueCallout({
      from: { id: "ag_a", name: "A", purpose },
      target: { id: GM_AUTO_ID, name: "G M0D3 AUTO", purpose },
    });
    assert.equal(auto.ok, false);
  });

  it("tie goes to the agent who C@LL 0UT", () => {
    const suffix = `${Date.now().toString(36)}tie`;
    const from = { id: `ag_co_tie_a_${suffix}`, name: "CallerTie", purpose };
    const target = { id: `ag_co_tie_b_${suffix}`, name: "TargetTie", purpose };
    const started = issueCallout({ from, target });
    assert.equal(started.ok, true);
    if (!started.ok) return;
    const bout = expireFight(started.fight.id);
    assert.equal(bout?.winnerId, from.id);
    assert.equal(bout?.tie, true);
  });

  it("starts a 5×1h bout, bans TRIM, stacks BUY, and awards most bitcoin", () => {
    const suffix = Date.now().toString(36);
    const from = { id: `ag_co_a_${suffix}`, name: "Caller", purpose };
    const target = { id: `ag_co_b_${suffix}`, name: "Target", purpose };
    const started = issueCallout({ from, target });
    assert.equal(started.ok, true);
    if (!started.ok) return;
    assert.equal(started.escrow, false);
    assert.equal(started.fight.round, 1);

    const trim = tickCallout({ id: from.id, name: from.name, action: "TRIM", px: 80_000 });
    assert.equal(trim.ok, false);

    const buy = tickCallout({ id: from.id, name: from.name, action: "BUY", px: 80_000 });
    assert.equal(buy.ok, true);
    if (buy.ok) {
      assert.equal(buy.trade, false);
      assert.ok((buy.btc ?? 0) > 0);
    }

    const bout = expireFight(started.fight.id);
    assert.ok(bout);
    assert.equal(bout?.winnerId, from.id);
    assert.equal(bout?.tie, false);
  });

  it("caps fight SP1CE UP at $100 and rejects HOUSE", () => {
    const suffix = `${Date.now().toString(36)}b`;
    const from = { id: `ag_co_c_${suffix}`, name: "Caller2", purpose };
    const target = { id: `ag_co_d_${suffix}`, name: "Target2", purpose };
    const started = issueCallout({ from, target });
    assert.equal(started.ok, true);
    if (!started.ok) return;

    const house = placeFightWager({
      fromId: "ag_h",
      fromName: "H",
      house: true,
      pickId: from.id,
      pickName: from.name,
      stakeUsd: 10,
    });
    assert.equal(house.ok, false);

    const over = placeFightWager({
      fromId: `ag_bet_${suffix}`,
      fromName: "Bet",
      pickId: from.id,
      pickName: from.name,
      stakeUsd: 101,
    });
    assert.equal(over.ok, false);

    const ok = placeFightWager({
      fromId: `ag_bet_${suffix}`,
      fromName: "Bet",
      pickId: from.id,
      pickName: from.name,
      stakeUsd: 100,
    });
    assert.equal(ok.ok, true);
    if (ok.ok) assert.equal(ok.escrow, false);
  });

  it("seeds 20 demo C@LL 0UTs with system king, then drops them on a live bout", () => {
    const seeded = seedDemoTape();
    assert.equal(seeded.fights.length, 20);
    assert.ok(seeded.fights.every((f) => f.demo));
    const sys = Object.values(seeded.wins).find((w) => w.name === SYSTEM_KING_NAME);
    assert.equal(sys?.wins, 12);
    assert.equal(fightCount().demo, 20);

    const suffix = `${Date.now().toString(36)}live`;
    const from = { id: `ag_co_live_a_${suffix}`, name: "LiveCaller", purpose };
    const target = { id: `ag_co_live_b_${suffix}`, name: "LiveTarget", purpose };
    const started = issueCallout({ from, target });
    assert.equal(started.ok, true);
    if (!started.ok) return;
    assert.equal(started.fight.demo, false);
    const n = fightCount();
    assert.equal(n.demo, 0);
    assert.equal(n.total, 1);
    assert.equal(n.live, 1);
  });
});
