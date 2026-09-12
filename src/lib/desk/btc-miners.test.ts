import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  MINER_TIMEFRAMES,
  MINERS_DEFAULT_ADDRESS,
  MINERS_DEFAULT_BACKUP,
  MINERS_DEFAULT_STRATUM,
  MINERS_FAQ_ITEMS,
  MINERS_INSTRUCTIONS,
  MINERS_PATH,
  MINERS_STRATUM_SCHEME,
  SEO_TAB_MINERS,
  TAB_MINERS,
  bucketMinerSamples,
  ckpoolStatsUrl,
  ckpoolUserJsonUrl,
  defaultMinerConfig,
  fmtThs,
  minerActive,
  minerAddressError,
  parseCkpoolHash,
  stratumError,
  stratumUrl,
  withMinerDefaults,
} from "./btc-miners.ts";

describe("BTC M1N3Rz (BTC Miners View)", () => {
  it("ships the S1R1US.ai defaults — the default entry for all systems", () => {
    assert.equal(TAB_MINERS, "BTC M1N3Rz");
    assert.equal(SEO_TAB_MINERS, "BTC Miners View");
    assert.equal(MINERS_PATH, "/Bitcoin-Miners");
    assert.equal(MINERS_DEFAULT_ADDRESS, "33kmWvmf3nz3255dGmbHxigb9X6Szv6cJ8");
    assert.equal(MINERS_DEFAULT_STRATUM, "solo.ckpool.org:3333");
    assert.equal(MINERS_DEFAULT_BACKUP, "solo.ckpool.org:443");
    assert.equal(MINERS_STRATUM_SCHEME, "stratum+tcp://");
    assert.deepEqual(defaultMinerConfig(), {
      stratum: MINERS_DEFAULT_STRATUM,
      backup: MINERS_DEFAULT_BACKUP,
      address: MINERS_DEFAULT_ADDRESS,
    });
    assert.equal(
      ckpoolStatsUrl(MINERS_DEFAULT_ADDRESS),
      "https://stats.ckpool.org/users/33kmWvmf3nz3255dGmbHxigb9X6Szv6cJ8",
    );
    assert.match(ckpoolUserJsonUrl(""), /^https:\/\/solo\.ckpool\.org\/users\/33kmWvmf/);
  });

  it("blank + Save populates the S1R1US.ai CKPool data back into the dialogue boxes", () => {
    assert.deepEqual(withMinerDefaults(null), defaultMinerConfig());
    assert.deepEqual(withMinerDefaults({ stratum: " ", backup: "", address: "  " }), defaultMinerConfig());
    const own = withMinerDefaults({
      stratum: "stratum+tcp://my.pool.example:3333",
      backup: "my.pool.example:443",
      address: "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4",
    });
    assert.equal(own.stratum, "my.pool.example:3333");
    assert.equal(own.backup, "my.pool.example:443");
    assert.equal(own.address, "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4");
  });

  it("validates dialogue boxes with only the most basic information", () => {
    assert.equal(stratumError(""), null);
    assert.equal(stratumError("solo.ckpool.org:3333"), null);
    assert.equal(stratumError("stratum+tcp://solo.ckpool.org:443"), null);
    assert.match(String(stratumError("not a url")), /host:port/);
    assert.equal(minerAddressError(""), null);
    assert.equal(minerAddressError(MINERS_DEFAULT_ADDRESS), null);
    assert.equal(minerAddressError("bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4"), null);
    assert.match(String(minerAddressError("hello")), /BTC address/);
    assert.equal(stratumUrl("solo.ckpool.org:3333"), "stratum+tcp://solo.ckpool.org:3333");
    assert.equal(stratumUrl(""), "stratum+tcp://solo.ckpool.org:3333");
  });

  it("parses ckpool SI hashrate strings into TH/s", () => {
    assert.equal(parseCkpoolHash("1T"), 1);
    assert.equal(parseCkpoolHash("500G"), 0.5);
    assert.equal(parseCkpoolHash("2.5P"), 2500);
    assert.equal(parseCkpoolHash("0"), 0);
    assert.equal(parseCkpoolHash("nope"), 0);
    assert.equal(parseCkpoolHash(2e12), 2);
    assert.equal(fmtThs(2), "2.00 TH/s");
    assert.equal(fmtThs(2500), "2.50 PH/s");
    assert.equal(fmtThs(0.5), "500.00 GH/s");
    assert.equal(fmtThs(0), "0 H/s");
  });

  it("miner data populates the view only for active miners on the pool", () => {
    const now = 1_700_000_000;
    assert.equal(minerActive({ lastshare: now - 60, hashrate1hr: "0" }, now), true);
    assert.equal(minerActive({ lastshare: now - 7200, hashrate1hr: "0" }, now), false);
    assert.equal(minerActive({ lastshare: now - 7200, hashrate1hr: "3T" }, now), true);
    assert.equal(minerActive(null), false);
  });

  it("buckets hash power samples for the hour/day/month/year drop-down", () => {
    assert.equal(MINER_TIMEFRAMES.map((f) => f.id).join(","), "hour,day,month,year");
    const now = Date.now();
    const samples = [
      { t: now - 30 * 60 * 1000, ths: 10, ths5m: 9, ths1h: 8 },
      { t: now - 29 * 60 * 1000, ths: 20, ths5m: 19, ths1h: 18 },
      { t: now - 10 * 24 * 60 * 60 * 1000, ths: 50, ths5m: 50, ths1h: 50 },
    ];
    const hour = bucketMinerSamples(samples, "hour", now);
    assert.ok(hour.length >= 1 && hour.length <= 2);
    const total = hour.reduce((a, p) => a + p.ths, 0);
    assert.ok(total === 30 || Math.abs(total - 15) < 1e-9);
    assert.equal(bucketMinerSamples(samples, "hour", now).every((p) => p.ths5m > 0), true);
    const month = bucketMinerSamples(samples, "month", now);
    assert.ok(month.some((p) => p.ths === 50));
    assert.equal(bucketMinerSamples([], "year").length, 0);
  });

  it("keeps the instruction + FAQ modules on message", () => {
    assert.equal(MINERS_INSTRUCTIONS.length, 8);
    assert.match(MINERS_INSTRUCTIONS[0], /stratum\+tcp:\/\/solo\.ckpool\.org:3333/);
    assert.match(MINERS_INSTRUCTIONS.join(" "), /only their own stratum/);
    assert.deepEqual(
      MINERS_FAQ_ITEMS.map((f) => f.id),
      ["btc-miners", "btc-miners-setup", "btc-miners-payout"],
    );
    assert.match(MINERS_FAQ_ITEMS[1].a, /never stripped/);
    assert.match(MINERS_FAQ_ITEMS[2].a, /33kmWvmf3nz3255dGmbHxigb9X6Szv6cJ8/);
  });
});
