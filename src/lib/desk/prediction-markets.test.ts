import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { classifyBtcTitle, parseKalshiMarkets, parsePolyEvent, parseStrikeUsd, predAnalyst } from "./prediction-markets.ts";
import { hostAllowed } from "./net-guard.ts";

describe("BTC prediction markets", () => {
  it("classifies ATH vs monthly vs other", () => {
    assert.equal(classifyBtcTitle("Bitcoin all time high by December 31, 2026?"), "ath");
    assert.equal(classifyBtcTitle("What price will Bitcoin hit in September?"), "monthly");
    assert.equal(classifyBtcTitle("How high will BTC get in September?"), "monthly");
    assert.equal(classifyBtcTitle("Bitcoin above ___ on September 7?"), "other");
  });

  it("parses Polymarket ATH markets and skips resolved 0/1", () => {
    const rows = parsePolyEvent(
      {
        title: "Bitcoin all time high by ___?",
        slug: "bitcoin-all-time-high-by",
        closed: false,
        markets: [
          { question: "Bitcoin all time high by June 30, 2026?", outcomePrices: ["0", "1"], closed: true, volumeNum: 1 },
          {
            question: "Bitcoin all time high by September 30, 2026?",
            outcomePrices: ["0.007", "0.993"],
            closed: false,
            volumeNum: 1147075,
            endDate: "2026-10-01T03:59:00Z",
          },
          {
            question: "Bitcoin all time high by December 31, 2026?",
            groupItemTitle: "Dec 31",
            outcomePrices: '["0.071","0.929"]',
            closed: false,
            volumeNum: 500000,
          },
        ],
      },
      "ath",
    );
    assert.equal(rows.length, 2);
    assert.equal(rows[0]?.venue, "Polymarket");
    assert.equal(rows[0]?.kind, "ath");
    assert.equal(rows[0]?.yesPct, 0.7);
    assert.equal(rows[1]?.yesPct, 7.1);
    assert.match(rows[0]?.url ?? "", /polymarket\.com\/event\/bitcoin-all-time-high-by/);
  });

  it("parses Kalshi monthly highs from last/mid dollars", () => {
    const rows = parseKalshiMarkets("KXBTCMAXMON", "monthly", [
      {
        ticker: "KXBTCMAXMON-BTC-26SEP30-8500000",
        event_ticker: "KXBTCMAXMON-BTC-26SEP30",
        title: "Will BTC trimmed mean be above $85000.00 by 11:59 PM ET on Sep 30, 2026?",
        yes_sub_title: "Above $85,000.00",
        status: "active",
        last_price_dollars: "0.5100",
        yes_bid_dollars: "0.5000",
        yes_ask_dollars: "0.5200",
        volume_fp: "200000",
        close_time: "2026-10-01T03:59:59Z",
      },
      {
        ticker: "KXBTCMAXMON-BTC-26SEP30-DEAD",
        status: "active",
        last_price_dollars: "0.0000",
        volume_fp: "10",
      },
    ]);
    assert.equal(rows.length, 1);
    assert.equal(rows[0]?.venue, "Kalshi");
    assert.equal(rows[0]?.kind, "monthly");
    assert.equal(rows[0]?.strike, "Above $85,000.00");
    assert.equal(rows[0]?.yesPct, 51);
    assert.match(rows[0]?.url ?? "", /kalshi\.com\/markets\/kxbtcmaxmon/);
  });

  it("allows Polymarket and Kalshi hosts and wires the wire panel", () => {
    assert.equal(hostAllowed("gamma-api.polymarket.com"), true);
    assert.equal(hostAllowed("api.elections.kalshi.com"), true);
    const ui = readFileSync(new URL("../../components/desk-tape-panels.tsx", import.meta.url), "utf8");
    assert.match(ui, /BTC prediction markets/);
    assert.match(ui, /this host never takes bets/);
    const faq = readFileSync(new URL("./public-nav.ts", import.meta.url), "utf8");
    assert.match(faq, /id: "btc-bets"/);
    assert.equal(/id: "s1r1us-predictions"/.test(faq), false);
    const legal = readFileSync(new URL("../../lib/legal.ts", import.meta.url), "utf8");
    assert.match(legal, /LEGAL_PRED/);
    assert.match(legal, /not a prediction market operator/);
  });

  it("parses strikes and overlays ACCUMULATE on cheap path, WAIT on FOMO, never sells", () => {
    assert.equal(parseStrikeUsd("Above $85,000.00", ""), 85000);
    assert.equal(parseStrikeUsd("↑ 100,000", ""), 100000);
    const cheap = predAnalyst(
      [
        {
          id: "p1",
          venue: "Polymarket",
          kind: "monthly",
          title: "Hit in September",
          strike: "↑ 90,000",
          yesPct: 18,
          volumeUsd: 100000,
          end: "",
          url: "https://polymarket.com",
        },
        {
          id: "k1",
          venue: "Kalshi",
          kind: "monthly",
          title: "How high",
          strike: "Above $90,000.00",
          yesPct: 22,
          volumeUsd: 80000,
          end: "",
          url: "https://kalshi.com",
        },
        {
          id: "k2",
          venue: "Kalshi",
          kind: "other",
          title: "Daily",
          strike: "$80,000 or above",
          yesPct: 20,
          volumeUsd: 1000,
          end: "",
          url: "https://kalshi.com",
        },
      ],
      80000,
    );
    assert.equal(cheap.stance, "ACCUMULATE");
    assert.equal(cheap.discount, true);
    assert.equal(cheap.fomo, false);
    assert.match(cheap.polymarket.headline, /Polymarket/);
    assert.match(cheap.kalshi.headline, /Kalshi/);
    const hot = predAnalyst(
      [
        {
          id: "d1",
          venue: "Kalshi",
          kind: "other",
          title: "Daily",
          strike: "$80,000 or above",
          yesPct: 82,
          volumeUsd: 5000,
          end: "",
          url: "https://kalshi.com",
        },
        {
          id: "d2",
          venue: "Polymarket",
          kind: "other",
          title: "Above today",
          strike: "↑ 80,000",
          yesPct: 78,
          volumeUsd: 4000,
          end: "",
          url: "https://polymarket.com",
        },
      ],
      80000,
    );
    assert.equal(hot.stance, "WAIT");
    assert.equal(hot.fomo, true);
    assert.equal(hot.overlayPass, false);
    const empty = predAnalyst([], 80000);
    assert.equal(empty.stance, "HOLD");
    assert.equal(empty.discount, false);
  });
});
