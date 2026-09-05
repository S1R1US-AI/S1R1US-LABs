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
