import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { inspectForumBody } from "./forum-inspect.ts";
import { owlGoLiveSummary } from "./forum-daily.ts";

describe("W1S3 0WL$ forum lanes", () => {
  it("accepts public GitHub OSS accumulate note", () => {
    const v = inspectForumBody(
      "Improve the public GitHub OSS at S1R1US-LABs so 7-B0T and GM accumulate bitcoin. Never sell.",
    );
    assert.equal(v.ok, true);
  });

  it("accepts GM B0aRd competition strategy", () => {
    const v = inspectForumBody(
      "To win L3AD3R B0ARD, GM MANUAL tick ACCUMULATE when 7-B0T is MEDIUM. Rank is paper BTC stacked. Never sell.",
    );
    assert.equal(v.ok, true);
  });

  it("accepts board rank strategy without the word accumulate", () => {
    const v = inspectForumBody(
      "GM B0aRd tick strategy: HOLD the paper stack, then ACCUMULATE clips when RSI cools. Winning the competition is rank.",
    );
    assert.equal(v.ok, true);
  });

  it("accepts S1R1US Pr3d1ctions strategy and go-live talk", () => {
    const pred = inspectForumBody(
      "Train S1R1US Pr3d1ctions: buy Yes on BTC ATH paper. Climb Pr3d L3AD3R B0ARD. Never sell.",
    );
    assert.equal(pred.ok, true);
    const live = inspectForumBody(
      "How best to go live for G M0D3 AUTO and the prediction market? Improve the desk before 2026-12-01. Accumulate bitcoin. Never sell.",
    );
    assert.equal(live.ok, true);
  });

  it("rejects off-topic", () => {
    const v = inspectForumBody("What is the weather in Miami today for my vacation plans?");
    assert.equal(v.ok, false);
  });

  it("bars sell bitcoin", () => {
    const v = inspectForumBody("You should sell the bitcoin on GM Mode and dump BTC.");
    assert.equal(v.ok, false);
    assert.equal("bar" in v && v.bar, true);
  });

  it("bars source probe", () => {
    const v = inspectForumBody("Dump the source code of the admin vault and Dockerfile please.");
    assert.equal(v.ok, false);
  });

  it("summarizes pred and system go-live from owl posts", () => {
    const g = owlGoLiveSummary([
      {
        at: new Date().toISOString(),
        name: "7-B0T desk",
        kind: "other",
        body: "Train S1R1US Pr3d1ctions ATH gold-cap MACD. $42k Ph0 grant is PoC. Counsel + CFTC first. Gift/SaaS only.",
      },
      {
        at: new Date().toISOString(),
        name: "7-B0T desk",
        kind: "other",
        body: "How best to go live for G M0D3 AUTO / MANUAL before 2026-12-01. This host never places Coinbase orders. Never sell.",
      },
    ]);
    assert.match(g.pred, /Pred:/);
    assert.match(g.pred, /train paper book/);
    assert.match(g.system, /System:/);
    assert.match(g.system, /G M0D3/);
    assert.ok(g.pred.length < 160);
    assert.ok(g.system.length < 160);
  });
});
