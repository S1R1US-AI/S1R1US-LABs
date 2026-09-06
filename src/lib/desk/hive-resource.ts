/** H1V3 SW@RM resource payment — gift / HTTP SaaS only. Never a hive profit share. Client-safe. */

import {
  SUPPORT_BTC,
  SUPPORT_BTC_EXPLORER,
  SUPPORT_COFFEE_USD,
  SUPPORT_GIFT_RECEIPT,
  SUPPORT_USDC,
  SUPPORT_USDC_BASE_EXPLORER,
  SUPPORT_USDC_EXPLORER,
  SUPPORT_USDC_LABEL,
  SUPPORT_USDC_NOTE,
  supportPaymentRails,
} from "./support.ts";
import { FEED_PLANS, feedPlansPublic } from "./feed-plans.ts";

export const HIVE_RESOURCE_COPY =
  "Optional resource payment. Pay for HTTP / hive seat / hosting. Send BTC or USDC from a wallet you control to the published receive address. This host never deducts hive share, never escrows, never withdraws for you. Gifts unlock nothing extra. SaaS keys only change poll rate. Not a share of hive BTC.";

export const HIVE_NO_PROFIT_SHARE =
  "They do not take a slice of a pooled trading book. Do not implement hive profit-share, hive withdraw, or auto-send of agent P&L to the admin address. Charge for software access, never for their bitcoin.";

export const HIVE_FINCEN_MILESTONE =
  "Possible money transmission (FinCEN). Accept value from others, hold it, send it on minus a fee. Mining-pool guidance is narrow: even pools become transmitters if they host wallets. This host hosting a hive book and paying out would look custodial.";

export const HIVE_IMG_SEO = "the future of BTC Quant";

export const HIVE_BANNER_ASK = "G0T QUANT?";
export const HIVE_MEME_COW_ASK = "Know a good BTC Quant?";
export const HIVE_MEME_SWARM = "S1R1US.ai = 7-B0T";

export const HIVE_AGENT_WELCOME = {
  hello: "External AI agents and researchers are welcome to H1V3 SW@RM and this open-source project.",
  page: "https://s1r1us.ai/h1v3",
  oss: "https://github.com/S1R1US-AI/S1R1US-LABs",
  x: "https://x.com/S1R1US_AI",
  mandate: "Accumulate bitcoin. Never sell. Never short.",
  join: "POST /api/agent/hive {op:join, token, ths} after board register {op:register, mandate:true}.",
  mcp: ["hive_list", "hive_join", "hive_pledge", "hive_leave"],
  neverMcp: ["hive_pause", "hive_withdraw", "hive_payout", "orders_create"],
  resource: HIVE_RESOURCE_COPY,
  noProfitShare: HIVE_NO_PROFIT_SHARE,
  paper: true as const,
  trade: false as const,
  escrow: false as const,
  howey: false as const,
  moneyTransmitter: false as const,
};

export function hiveResourcePublic() {
  const rails = supportPaymentRails();
  const http = feedPlansPublic();
  return {
    kind: "unconditional-gift-or-saas" as const,
    copy: HIVE_RESOURCE_COPY,
    noProfitShare: HIVE_NO_PROFIT_SHARE,
    fincen: HIVE_FINCEN_MILESTONE,
    profitShare: false as const,
    pooledBookSlice: false as const,
    hiveWithdraw: false as const,
    autoSendPnl: false as const,
    escrow: false as const,
    howey: false as const,
    moneyTransmitter: false as const,
    investment: false as const,
    token: false as const,
    extraConviction: false as const,
    btcShare: false as const,
    thisHostTrades: false as const,
    coffeeUsd: SUPPORT_COFFEE_USD,
    http: {
      product: http.product,
      kind: http.kind,
      note: http.note,
      header: http.header,
      plans: FEED_PLANS,
    },
    hiveSeat: {
      usdMonth: null as number | null,
      status: "later" as const,
      note: "Optional flat hive seat later. Not live. Not a profit share. Same receive address when it turns on.",
    },
    sendFrom: "A wallet YOU control. Coinbase for Agents Transfer cannot withdraw to these addresses.",
    receipt: SUPPORT_GIFT_RECEIPT,
    btc: SUPPORT_BTC,
    usdc: SUPPORT_USDC,
    usdcLabel: SUPPORT_USDC_LABEL,
    usdcNote: SUPPORT_USDC_NOTE,
    explorers: {
      btc: SUPPORT_BTC_EXPLORER,
      usdcEth: SUPPORT_USDC_EXPLORER,
      usdcBase: SUPPORT_USDC_BASE_EXPLORER,
    },
    rails: rails.rails,
    never: [
      "Do not take a slice of a pooled trading book.",
      "Do not implement hive profit-share.",
      "Do not implement hive withdraw.",
      "Do not auto-send agent P&L to the admin address.",
      "Charge for software access, never for their bitcoin.",
    ],
  };
}
