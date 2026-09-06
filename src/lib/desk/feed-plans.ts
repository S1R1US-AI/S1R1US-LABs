/** Client-safe plan copy. Key hashing stays in feed-key.server / feed-key. */
export const FEED_KEY_HEADER = "x-s1r1us-key";
export const FEED_KEY_PREFIX = "s1r1_live_";

export const FEED_PLANS = [
  {
    id: "free",
    usdMonth: 0,
    pollSec: 300,
    burstEverySec: 25,
    note: "Public Bot 7 JSON. Poll every 300s. Scrapers get 429. Same call as paid.",
  },
  {
    id: "http",
    usdMonth: 9,
    pollSec: 5,
    burstEverySec: 5,
    note: "Pay for HTTP. Same MEDIUM/HIGH. No extra clip. No token. No profit share.",
  },
  {
    id: "burst",
    usdMonth: 29,
    pollSec: 1,
    burstEverySec: 1,
    note: "Higher poll for your bot loop. Still read-only. Still dry-run CLI.",
  },
] as const;

export type FeedPlanId = (typeof FEED_PLANS)[number]["id"];

export function feedPlansPublic() {
  return {
    product: "Bot 7 JSON HTTP access",
    kind: "saas",
    investment: false,
    token: false,
    extraConviction: false,
    btcShare: false,
    thisHostTrades: false,
    note: "Pay for HTTP. Same Bot 7 call. Operator hashes keys in BOT7_FEED_KEY_HASHES. Gifts (F33D / C0FF33) remain optional and unlock nothing extra.",
    header: `${FEED_KEY_HEADER}: ${FEED_KEY_PREFIX}…`,
    plans: FEED_PLANS,
  };
}
