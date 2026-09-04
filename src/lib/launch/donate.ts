import { createServerFn } from "@tanstack/react-start";
import { guardedFetch } from "@/lib/desk/net-guard";
import { PROFIT_BTC_EXPLORER, PROFIT_BTC_RECEIVE } from "@/lib/desk/treasury";

export const DONATE_GOAL_USD = 150_000;
export const DONATE_BTC = PROFIT_BTC_RECEIVE;
export const DONATE_BTC_EXPLORER = PROFIT_BTC_EXPLORER;
export const DONATE_ASK =
  "Please donate Bitcoin or USDC to support the 7-bot desk. This is a gift — not a sale of tokens, not a share of the book, not s1r1us. [ S1R1U$ <<L@B$>> ] thanks you for your support.";

export type DonateProgress = {
  goalUsd: number;
  raisedUsd: number;
  pct: number;
  btc: number | null;
  btcUsd: number | null;
  usdc: number | null;
  btcAddress: string;
  btcExplorer: string;
  usdcAddress: string;
  usdcNetwork: string;
  usdcExplorer?: string;
  asOf: string;
  source: string;
};

let cache: { at: number; value: DonateProgress } | null = null;

export const fetchDonate = createServerFn({ method: "GET" }).handler(async (): Promise<DonateProgress> => {
  const now = Date.now();
  if (cache && now - cache.at < 45_000) return cache.value;
  const { profitChain, usdcChain } = await import("@/lib/desk/treasury.server");
  const [chain, usdc, px] = await Promise.all([profitChain(), usdcChain(), spotBtc()]);
  const btc = chain.btc;
  const btcUsd = btc != null && px != null ? btc * px : null;
  const usdcBal = usdc.usdc;
  const raised = (btcUsd ?? 0) + (usdcBal ?? 0);
  const value: DonateProgress = {
    goalUsd: DONATE_GOAL_USD,
    raisedUsd: raised,
    pct: Math.min(100, (raised / DONATE_GOAL_USD) * 100),
    btc,
    btcUsd,
    usdc: usdcBal,
    btcAddress: DONATE_BTC,
    btcExplorer: DONATE_BTC_EXPLORER,
    usdcAddress: usdc.address,
    usdcNetwork: usdc.network,
    usdcExplorer: usdc.explorer,
    asOf: new Date().toISOString(),
    source: [chain.source, usdc.network].filter(Boolean).join(" · "),
  };
  cache = { at: now, value };
  return value;
});

async function spotBtc(): Promise<number | null> {
  try {
    const res = await guardedFetch("https://api.exchange.coinbase.com/products/BTC-USD/ticker", {
      headers: { Accept: "application/json", "User-Agent": "S1R1US-Lab/1.0" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const j = (await res.json()) as { price?: string };
    const n = Number(j.price);
    return Number.isFinite(n) && n > 0 ? n : null;
  } catch {
    return null;
  }
}
