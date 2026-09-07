import { describe, it, before } from "node:test";
import assert from "node:assert/strict";
import { unlinkSync } from "node:fs";
import {
  armWallet,
  ensureWallet,
  grantPho,
  OFFICIAL_ANALYSIS,
  placePredBet,
  predPublic,
  PRED_GRANT_USD,
  PRED_NEVER_LIVE,
  setPredBookLocked,
  tickPredBook,
  walletView,
} from "./pred-book.ts";
import { MCP_TOOLS } from "./agent-security.ts";
import { LIVE_FUNCTIONS, LOCKED_FUNCTIONS } from "./oss-roadmap.ts";

const LAST = 105_000;
const GRANT = grantPho(LAST);

describe("S1R1US Pr3d1ctions paper book", { concurrency: false }, () => {
  before(() => {
    try {
      unlinkSync("/tmp/pred-book-test.json");
    } catch {
      /* fresh */
    }
  });

  it("opens Ph0 W@ll3t with $42,000 USD of ph0 BTC and never live funds", () => {
    const w = ensureWallet({ name: "owl-test", who: "owl", last: LAST });
    assert.equal(w.who, "owl");
    assert.equal(w.pho, GRANT);
    assert.equal(w.grantUsd, PRED_GRANT_USD);
    assert.equal(w.mode, "hold");
    const pub = predPublic({ last: LAST });
    assert.equal(pub.liveFunds, false);
    assert.equal(pub.trade, false);
    assert.equal(pub.ordersCreate, false);
    assert.equal(pub.escrow, false);
    assert.equal(pub.coinbaseWalletBets, false);
    assert.equal(pub.sparrowWalletBets, false);
    assert.equal(pub.kalshiBroker, false);
    assert.equal(pub.polymarketBuilder, false);
    assert.equal(pub.paper, true);
    assert.equal(pub.btcOnly, true);
    assert.equal(pub.grantUsd, 42_000);
    assert.equal(pub.wallet, "Ph0 W@ll3t");
    assert.equal(pub.asset, "ph0 BTC");
    assert.ok(pub.markets.length >= 20);
    assert.ok(pub.markets.some((m) => m.id === "ath-eoy-150k"));
    assert.ok(pub.markets.some((m) => m.id === "ath-2030-1m"));
    assert.ok(pub.markets.some((m) => m.id === "cap-phys-gold-2028"));
    assert.ok(pub.markets.some((m) => m.id === "cap-all-gold-2032"));
    assert.ok(pub.markets.some((m) => m.id === "below-macd200"));
    assert.ok(pub.markets.some((m) => m.id === "above-sma50"));
    assert.ok(OFFICIAL_ANALYSIS.sources.some((s) => s.id === "kalshi-dev-agree" && s.verdict === "NEVER"));
    assert.ok(OFFICIAL_ANALYSIS.sources.some((s) => s.id === "poly-gamma" && s.verdict === "LIVE"));
    assert.match(PRED_NEVER_LIVE, /NEVER/);
  });

  it("holds the grant until live-sim is armed, then takes simulated P&L", () => {
    const blocked = placePredBet({ name: "owl-test", who: "owl", marketId: "ath-2026", side: "YES", pho: 0.05, last: LAST });
    assert.equal(blocked.ok, false);
    const armed = armWallet({ name: "owl-test", who: "owl", last: LAST, on: true });
    assert.equal(armed.ok, true);
    assert.equal(armed.wallet?.mode, "live-sim");
    const bet = placePredBet({ name: "owl-test", who: "owl", marketId: "ath-2026", side: "YES", pho: 0.05, last: LAST });
    assert.equal(bet.ok, true);
    assert.equal(bet.fill?.side, "YES");
    const pos = (bet.wallet?.positions ?? []).find((p) => p.marketId === "ath-2026" && p.side === "YES");
    assert.ok(pos);
    assert.equal(pos?.pho, 0.05);
    assert.ok((bet.wallet?.equity ?? 0) > 0);
    const again = placePredBet({ name: "owl-test", who: "owl", marketId: "ath-2026", side: "YES", pho: GRANT, last: LAST });
    assert.equal(again.ok, false);
    const w = walletView(ensureWallet({ name: "owl-test", who: "owl", last: LAST }), LAST);
    assert.ok(w.pho < GRANT);
    assert.ok(w.unrealizedPnl !== undefined);
  });

  it("settles daily MACD markets for simulated profit or loss", () => {
    armWallet({ name: "macd-owl", who: "owl", last: LAST, on: true });
    const bet = placePredBet({ name: "macd-owl", who: "owl", marketId: "above-sma50", side: "YES", pho: 0.02, last: LAST });
    assert.equal(bet.ok, true);
    tickPredBook({ last: LAST, sma50: 90_000, settleDaily: true });
    const w = walletView(ensureWallet({ name: "macd-owl", who: "owl", last: LAST }), LAST);
    assert.ok(w.realizedPnl > 0);
    assert.ok(w.pho > GRANT - 0.02);
  });

  it("shows a simulated Pr3d L3AD3R B0ARD with demo wallets", () => {
    const pub = predPublic({ last: LAST });
    assert.ok((pub.leaderboard ?? []).length >= 6);
    assert.ok(pub.leaderboard.some((r) => r.demo && r.tickets > 0));
    assert.ok(pub.leaderboard.every((r) => r.equityUsd > 0));
    assert.equal(pub.training, true);
  });

  it("LoCK3D Pr3d1ctions lock pauses the paper book", () => {
    setPredBookLocked(true);
    const paused = placePredBet({ name: "lock-owl", who: "owl", marketId: "ath-2026", side: "YES", pho: 0.01, last: LAST });
    assert.equal(paused.ok, false);
    assert.match(String(paused.error), /paused/i);
    setPredBookLocked(false);
  });

  it("is LIVE-PAPER on the roadmap and LOCKED for real-money funds", () => {
    assert.ok(LIVE_FUNCTIONS.some((f) => f.id === "pred-book" && f.status === "LIVE-PAPER"));
    assert.ok(LOCKED_FUNCTIONS.some((f) => f.id === "pred-live-funds" && f.status === "LOCKED"));
    assert.ok(LOCKED_FUNCTIONS.some((f) => f.id === "pred-coinbase-sparrow" && f.status === "NEVER"));
    assert.equal(MCP_TOOLS.has("pred_list"), true);
    assert.equal(MCP_TOOLS.has("pred_arm"), true);
    assert.equal(MCP_TOOLS.has("pred_live"), false);
    assert.equal(MCP_TOOLS.has("orders_create"), false);
  });
});
