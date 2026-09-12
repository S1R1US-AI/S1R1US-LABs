/** Public operating-cost donations only — not the trading book. */
export const SUPPORT_BTC = "33kmWvmf3nz3255dGmbHxigb9X6Szv6cJ8";
export const SUPPORT_USDC = "0x551163f5d4c0361155d16131459afa5c936a60ad";

/** Native Circle USDC token contracts — the receive wallet is the same 0x on both chains. */
export const SUPPORT_USDC_ETH_TOKEN = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
export const SUPPORT_USDC_BASE_TOKEN = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

export const SUPPORT_USDC_LABEL = "USDC (Ethereum ERC-20 + Base)";
export const SUPPORT_USDC_NOTE =
  "Same 0x address on Ethereum and Base. Native Circle USDC only. Do not send USDC on Solana, Polygon, Arbitrum, or other chains — wrong-network sends can be lost.";

export const SUPPORT_BTC_EXPLORER = `https://blockstream.info/address/${SUPPORT_BTC}`;
export const SUPPORT_USDC_EXPLORER = `https://etherscan.io/token/${SUPPORT_USDC_ETH_TOKEN}?a=${SUPPORT_USDC}`;
export const SUPPORT_USDC_BASE_EXPLORER = `https://basescan.org/token/${SUPPORT_USDC_BASE_TOKEN}?a=${SUPPORT_USDC}`;

/** Path A gift receipt — print on every donate surface. */
export const SUPPORT_GIFT_RECEIPT =
  "Unconditional gift. No tokens. No upside. No tax advice. Not an investment.";
export const SUPPORT_BLURB =
  "Optional donations cover web hosting, s1r1us.ai domain registration, and operation of the open-source web app, iOS app, and Google Play app. Not an investment, not a token sale, and not the trading book.";

export const SUPPORT_GIFT_USD_HINT = 4.2;
export const SUPPORT_COFFEE_USD = 4.2;
export const SUPPORT_COFFEE_PATH = "/c0ff33";
export const SUPPORT_SPONSOR_PATH = "/sponsor-ai-bitcoin-trading-bot";
export const SUPPORT_FEED_PATH = "/f33d";
export const SUPPORT_COFFEE_WHY =
  "Optional $4.20 cup of coffee to assist the long programming days at s1r1us.ai. Not required. Unlocks nothing extra.";
export const SUPPORT_ENCOURAGE =
  "If this 7-B0T feed is useful, Buy M3 a Cup of C0FF33 — an optional $4.20 gift in BTC or native USDC. Not required. Unlocks nothing extra. Covers long programming days, hosting, and the open-source apps.";

/** GitHub FUNDING.yml analysis — every supported funding platform mapped to the
    closest s1r1us.ai donation page (current sitemap URLs only). No third-party
    accounts exist: every gift is a direct on-chain BTC / native USDC gift.
    .github/FUNDING.yml `custom:` mirrors the same links. */
export type FundingPlatform = {
  /** FUNDING.yml key */
  key: string;
  /** Platform display name */
  platform: string;
  /** Donation type the platform represents */
  type: string;
  /** Best-fit s1r1us.ai path for that donation type */
  path: string;
  /** On-site donation name */
  fit: string;
};

export const FUNDING_PLATFORMS: FundingPlatform[] = [
  { key: "github", platform: "GitHub Sponsors", type: "recurring developer sponsorship", path: SUPPORT_SPONSOR_PATH, fit: "SP0NS0R TH3 B0T$ (Sponsor AI Bitcoin Trading Bot)" },
  { key: "patreon", platform: "Patreon", type: "membership patronage", path: SUPPORT_SPONSOR_PATH, fit: "SP0NS0R TH3 B0T$ (Sponsor AI Bitcoin Trading Bot)" },
  { key: "open_collective", platform: "Open Collective", type: "transparent collective funding", path: SUPPORT_FEED_PATH, fit: "F33D H0ST1Ng (Feed Hosting) — public explorer wallets" },
  { key: "ko_fi", platform: "Ko-fi", type: "coffee-style tip", path: SUPPORT_COFFEE_PATH, fit: "Buy M3 a Cup of C0FF33 (Buy Me a Cup of Coffee) $4.20" },
  { key: "tidelift", platform: "Tidelift", type: "open-source maintenance funding", path: SUPPORT_FEED_PATH, fit: "F33D H0ST1Ng (Feed Hosting) — sustain the OSS web / iOS / Play apps" },
  { key: "community_bridge", platform: "Community Bridge", type: "project crowdfunding", path: SUPPORT_SPONSOR_PATH, fit: "SP0NS0R TH3 B0T$ crowdfund goal" },
  { key: "liberapay", platform: "Liberapay", type: "recurrent donations", path: SUPPORT_FEED_PATH, fit: "F33D H0ST1Ng (Feed Hosting)" },
  { key: "issuehunt", platform: "IssueHunt", type: "issue bounty gifts", path: SUPPORT_SPONSOR_PATH, fit: "SP0NS0R TH3 B0T$ — OSS bounty-style gifts" },
  { key: "lfx_crowdfunding", platform: "LFX Crowdfunding", type: "project crowdfunding", path: SUPPORT_SPONSOR_PATH, fit: "SP0NS0R TH3 B0T$ crowdfund goal" },
  { key: "polar", platform: "Polar", type: "open-source funding hub", path: SUPPORT_SPONSOR_PATH, fit: "SP0NS0R TH3 B0T$ (Sponsor AI Bitcoin Trading Bot)" },
  { key: "buy_me_a_coffee", platform: "Buy Me a Coffee", type: "coffee-style tip", path: SUPPORT_COFFEE_PATH, fit: "Buy M3 a Cup of C0FF33 (Buy Me a Cup of Coffee) $4.20" },
  { key: "thanks_dev", platform: "thanks.dev", type: "gratitude-based OSS gifts", path: SUPPORT_FEED_PATH, fit: "F33D H0ST1Ng (Feed Hosting)" },
  { key: "custom", platform: "Custom sponsorship URLs", type: "direct donation links", path: SUPPORT_SPONSOR_PATH, fit: "s1r1us.ai gift pages + GET /api/agent/fee rails" },
];

export type SupportRail = {
  asset: "BTC" | "USDC";
  network: "bitcoin" | "ethereum" | "base";
  address: string;
  uri: string;
  explorer: string;
  how: string;
  token?: string;
  chainId?: number;
};

export function usdcUnitsFromUsd(usd: number): string {
  return String(Math.round(usd * 1_000_000));
}

export function supportBtcUri(message: string): string {
  return `bitcoin:${SUPPORT_BTC}?label=${encodeURIComponent("S1R1US Labs")}&message=${encodeURIComponent(message)}`;
}

export function supportUsdcUri(network: "ethereum" | "base", usd: number): string {
  const units = usdcUnitsFromUsd(usd);
  if (network === "base") {
    return `ethereum:${SUPPORT_USDC_BASE_TOKEN}@8453/transfer?address=${SUPPORT_USDC}&uint256=${units}`;
  }
  return `ethereum:${SUPPORT_USDC_ETH_TOKEN}@1/transfer?address=${SUPPORT_USDC}&uint256=${units}`;
}

export function supportPaymentRails() {
  const usd = SUPPORT_COFFEE_USD;
  const rails: SupportRail[] = [
    {
      asset: "BTC",
      network: "bitcoin",
      address: SUPPORT_BTC,
      uri: supportBtcUri("Buy M3 a Cup of C0FF33"),
      explorer: SUPPORT_BTC_EXPLORER,
      how: `On-chain Bitcoin send to this address. Suggested ~$${usd.toFixed(2)} (a cup of coffee). Any amount. No memo required.`,
    },
    {
      asset: "USDC",
      network: "ethereum",
      chainId: 1,
      token: SUPPORT_USDC_ETH_TOKEN,
      address: SUPPORT_USDC,
      uri: supportUsdcUri("ethereum", usd),
      explorer: SUPPORT_USDC_EXPLORER,
      how: `Native Circle USDC on Ethereum (ERC-20). EIP-681 uri is $${usd.toFixed(2)}. Any amount is fine.`,
    },
    {
      asset: "USDC",
      network: "base",
      chainId: 8453,
      token: SUPPORT_USDC_BASE_TOKEN,
      address: SUPPORT_USDC,
      uri: supportUsdcUri("base", usd),
      explorer: SUPPORT_USDC_BASE_EXPLORER,
      how: `Native Circle USDC on Base. Same 0x as Ethereum. Suggested $${usd.toFixed(2)}. Do not send on Solana, Polygon, or Arbitrum.`,
    },
  ];
  return {
    optional: true as const,
    required: false as const,
    paywall: false as const,
    kind: "unconditional-gift" as const,
    amountUsdHint: usd,
    coffee: {
      usd,
      path: SUPPORT_COFFEE_PATH,
      label: "Buy M3 a Cup of C0FF33",
      why: SUPPORT_COFFEE_WHY,
    },
    note: `${SUPPORT_GIFT_RECEIPT} Optional. Agents may use the read-only feed with no payment.`,
    encourage: SUPPORT_ENCOURAGE,
    blurb: SUPPORT_BLURB,
    receipt: SUPPORT_GIFT_RECEIPT,
    btc: SUPPORT_BTC,
    usdc: SUPPORT_USDC,
    usdcLabel: SUPPORT_USDC_LABEL,
    usdcNote: SUPPORT_USDC_NOTE,
    usdcEthToken: SUPPORT_USDC_ETH_TOKEN,
    usdcExplorers: { ethereum: SUPPORT_USDC_EXPLORER, base: SUPPORT_USDC_BASE_EXPLORER },
    btcExplorer: SUPPORT_BTC_EXPLORER,
    x402: {
      enabled: false as const,
      note: "No HTTP 402. Feed stays free. On-chain gift uses the rails below. Coinbase for Agents Transfer cannot withdraw to external addresses — send from a wallet the bot controls.",
    },
    never: [
      "Do not use Coinbase for Agents Transfer for this gift — that MCP cannot withdraw to external addresses.",
      "Do not send USDC on Solana, Polygon, or Arbitrum.",
      "Do not paste keys, seeds, or xprv into this site.",
    ],
    rails,
  };
}
