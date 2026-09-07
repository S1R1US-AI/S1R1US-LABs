import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { alignmentScore } from "./alignment.ts";
import { systemHealth } from "./system-health.ts";
import { morningProblems } from "./morning-problems.ts";
import { classifyFail } from "./error-log.ts";
import { readFileSync } from "node:fs";

describe("Alignment Score", { concurrency: false }, () => {
  it("scores 1–100 and stays aligned with mandate + never-on-this-host rails", () => {
    const a = alignmentScore();
    assert.equal(a.name, "Alignment Score");
    assert.equal(a.max, 100);
    assert.ok(a.score >= 1 && a.score <= 100);
    assert.equal(a.fail, 0);
    assert.equal(a.aligned, true);
    assert.ok(a.score >= 90);
    assert.equal(a.grade, "A");
    assert.match(a.headline, /ALIGNMENT SCORE/);
    assert.ok(a.checks.every((c) => c.pass));
    assert.ok(a.checks.some((c) => c.id === "m-never-sell"));
    assert.ok(a.checks.some((c) => c.id === "s-no-withdraw"));
    assert.ok(a.checks.some((c) => c.id === "s-fincen"));
    assert.ok(a.checks.some((c) => c.id === "s-pred-paper"));
  });

  it("is folded into checkpoint-68 health and hunter control test", () => {
    const h = systemHealth();
    assert.ok(h.alignment.score >= 90);
    assert.equal(h.alignment.fail, 0);
    assert.equal(h.practiceCannotArmCoinbase, true);
    assert.equal(h.liveUnlocked, false);
    assert.ok(h.overall >= 85);
    const build = readFileSync(new URL("../launch/build.ts", import.meta.url), "utf8");
    const model = readFileSync(new URL("../launch/model.ts", import.meta.url), "utf8");
    assert.match(build, /LAUNCH_LIVE_TRADES = false/);
    assert.match(model, /PATH_A_LOCKED = true/);
    const hunterSrc = readFileSync(new URL("./hunter.ts", import.meta.url), "utf8");
    assert.match(hunterSrc, /h-alignment/);
    const morning = readFileSync(new URL("../../components/morning-report-pdf.tsx", import.meta.url), "utf8");
    assert.match(morning, /AlignmentMorningSection/);
    assert.match(morning, /Alignment Score/);
  });

  it("classifies stooq abort as not-core and reports no OPEN problems when rails hold", () => {
    const c = classifyFail("stooq.com This operation was aborted");
    assert.equal(c.resolved, true);
    assert.equal(c.attention, false);
    const a = alignmentScore();
    const p = morningProblems({
      snap: { errors: [], pullMs: 900, fetchedAt: new Date().toISOString() } as never,
      errors: [{ at: new Date().toISOString(), msg: "stooq.com This operation was aborted", resolved: true, attention: false, verdict: c.verdict }],
      alignment: a,
      sim: { status: "LIVE", paused: false, practiceKilled: true },
    });
    assert.equal(p.none, true);
    assert.equal(p.open.length, 0);
    assert.match(p.headline, /PROBLEMS LAST 24h/);
  });
});
