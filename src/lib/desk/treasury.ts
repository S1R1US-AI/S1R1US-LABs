import { isBtcReceiveAddress } from "./security";

export const SPARROW = "https://sparrowwallet.com/";

/** Operator Coinbase.com BTC Receive — TRIM destination. Not a desk-held key. */
export const PROFIT_BTC_RECEIVE = "33kmWvmf3nz3255dGmbHxigb9X6Szv6cJ8";
export const PROFIT_BTC_EXPLORER = `https://www.blockchain.com/explorer/addresses/btc/${PROFIT_BTC_RECEIVE}`;

export function takeProfitPreview(btc: number, address: string) {
  const qty = Math.max(btc, 0);
  const n = qty >= 0.0001 ? qty.toFixed(8).replace(/0+$/, "").replace(/\.$/, "") : qty.toFixed(8);
  return `coinbase send --dry-run amount=${n} currency=BTC to=${address}`;
}

export function takeProfitPreviewUsd(usd: number, address: string, px?: number | null) {
  if (px && px > 0) return takeProfitPreview(usd / px, address);
  return `coinbase send --dry-run amount=<BTC for ${usd} USD at spot> currency=BTC to=${address}`;
}

export function sellBtcPreview(usd: number) {
  return `coinbase orders preview --dry-run product_id=BTC-USD side=SELL type=market quote_size=${usd}`;
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isPortfolioUuid(s: string) {
  return UUID_RE.test(s.trim());
}

export function transferPreview(amount: number, currency: "USDC" | "BTC", from: string, to: string) {
  return `coinbase transfer amount=${amount} currency=${currency} from=${from} to=${to}`;
}

export function buyBtcPreview(usd: number) {
  return `coinbase orders preview --dry-run product_id=BTC-USDC side=BUY type=market quote_size=${usd}`;
}

export { isBtcReceiveAddress };
