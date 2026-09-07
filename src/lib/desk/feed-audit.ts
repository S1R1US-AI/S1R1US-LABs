import { DATA_FEEDS } from "./policy";
import type { DeskSnapshot, FeedAudit, FeedAuditRow } from "./types";

const RING: FeedAudit[] = [];
const RING_MAX = 12;
const LOG_PATH = "/tmp/desk-feed-audit.json";

function row(id: string, ok: boolean, detail: string): FeedAuditRow {
  return { id, ok, detail };
}

export function scoreFeeds(snap: DeskSnapshot): FeedAudit {
  const err = (id: string) => snap.errors.find((e) => e.toLowerCase().startsWith(id.toLowerCase()));
  const rows: FeedAuditRow[] = DATA_FEEDS.map((f) => {
    const fail = err(f.id);
    if (fail) return row(f.id, false, fail);
    switch (f.id) {
      case "coinbase":
        return row(f.id, snap.btc.price != null, snap.btc.price != null ? `last ${snap.btc.price}` : "no last");
      case "okx": {
        const ls = snap.positioning.longShort;
        const ok = ls != null && ls >= 0.15 && ls <= 8;
        return row(
          f.id,
          ok || snap.positioning.venues.length > 0,
          `LS ${ls != null ? ls.toFixed(2) : "n/a"}${ls != null && (ls < 0.15 || ls > 8) ? " (clamped/outlier dropped)" : ""} · ${snap.positioning.venues.length} venues`,
        );
      }
      case "asia":
        return row(f.id, snap.asia.kimchiPct != null || snap.asia.venues.length > 0, `kimchi ${snap.asia.kimchiPct ?? "n/a"}`);
      case "em":
        return row(f.id, snap.em.regions.length > 0, `${snap.em.net.inflow} in / ${snap.em.net.outflow} out`);
      case "fear-greed":
        return row(f.id, snap.fearGreed != null, snap.fearGreed ? `${snap.fearGreed.value}` : "missing");
      case "sec":
        return row(f.id, true, `${snap.filings.length} filings (empty can be a quiet window)`);
      case "rss":
        return row(f.id, snap.headlines.length > 0, `${snap.headlines.length} headlines`);
      case "capital":
        return row(
          f.id,
          snap.capital.etfFlow != null || snap.capital.bars.some((b) => b.usd != null),
          `ETF flow ${snap.capital.etfFlow ?? "n/a"}`,
        );
      case "pools":
        return row(f.id, snap.pools.pools.length > 0, `${snap.pools.pools.length} pools · hunt ${snap.pools.reviewedAt}`);
      case "mining":
        return row(
          f.id,
          snap.onchain.hashrateEh != null,
          `EH ${snap.onchain.hashrateEh ?? "n/a"} · fee ${snap.onchain.feeFast ?? "n/a"} · BTC.D ${snap.onchain.btcDom ?? "n/a"} · regions ${snap.onchain.regions.length}`,
        );
      case "macro":
        return row(
          f.id,
          snap.macro.tbill.last != null || snap.macro.m2.last != null,
          `T-bill ${snap.macro.tbill.last ?? "n/a"} 2y ${snap.macro.y2.last ?? "n/a"} 10y ${snap.macro.y10.last ?? "n/a"} 30y ${snap.macro.y30.last ?? "n/a"} M2 ${snap.macro.m2.last ?? "n/a"} llama ${snap.macro.stables.filter((s) => s.apy != null).length}`,
        );
      case "strategy":
        return row(f.id, snap.strategy.products.length > 0, `${snap.strategy.products.length} products`);
      case "holders":
        return row(f.id, snap.holders.holders.length > 0, `${snap.holders.holders.length} holders`);
      case "pred":
        return row(
          f.id,
          snap.predictionMarkets.length > 0,
          `${(snap.predictionMarkets ?? []).length} BTC markets (Polymarket/Kalshi, display only)`,
        );
    }
  });
  const goldOk = snap.goldBtc.ozPerBtc != null;
  rows.push(row("gold-btc", goldOk, goldOk ? `${snap.goldBtc.ozPerBtc?.toFixed(1)} oz` : "missing"));
  const ok = rows.filter((r) => r.ok).length;
  const fail = rows.length - ok;
  const audit: FeedAudit = {
    at: snap.fetchedAt,
    pullMs: snap.pullMs,
    ok,
    fail,
    rows,
  };
  RING.unshift(audit);
  if (RING.length > RING_MAX) RING.length = RING_MAX;
  if (typeof window === "undefined") {
    void import("node:fs")
      .then((fs) => {
        try {
          fs.writeFileSync(LOG_PATH, JSON.stringify({ latest: audit, history: RING.slice(0, 8) }, null, 2));
        } catch {
          /* preview / Vercel may deny fs */
        }
      })
      .catch(() => {
        /* browser bundle */
      });
  }
  console.info(
    `[desk-feeds] ${audit.at} ${audit.pullMs}ms ok=${ok} fail=${fail}${fail ? ` · ${rows.filter((r) => !r.ok).map((r) => r.id).join(",")}` : ""}`,
  );
  return audit;
}

export function recentFeedAudits() {
  return RING;
}
