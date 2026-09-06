import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { inspectForumBody } from "./forum-inspect.ts";

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
});
