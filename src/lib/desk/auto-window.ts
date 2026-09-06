import { GM_CASH_MAX } from "./gm";

/** 24h AUTO practice GM. Start 4 Sep 2026 13:40 ET. Pause 5 Sep 2026 13:40 ET. Live Coinbase stays off. */
export const AUTO_RUN_ID = "auto-24h-gm-20260904-1340et";
export const AUTO_RUN_START_MS = Date.parse("2026-09-04T13:40:00-04:00");
export const AUTO_RUN_UNTIL_MS = Date.parse("2026-09-05T13:40:00-04:00");
export const AUTO_RUN_CASH = GM_CASH_MAX;
export const AUTO_RUN_LABEL =
  "DEMO AUTO on live tape · paper only · Coinbase locked";

export function autoWindowOpen() {
  return false;
}
