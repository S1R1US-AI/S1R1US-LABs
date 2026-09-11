//#region ../../workspace/node_modules/.nitro/vite/services/ssr/assets/treasury-VcYm63db.js
/** Operator Coinbase.com BTC Receive — TRIM destination. Not a desk-held key. */
var PROFIT_BTC_RECEIVE = "33kmWvmf3nz3255dGmbHxigb9X6Szv6cJ8";
var PROFIT_BTC_EXPLORER = `https://www.blockchain.com/explorer/addresses/btc/${PROFIT_BTC_RECEIVE}`;
function takeProfitPreview(btc, address) {
	const qty = Math.max(btc, 0);
	return `coinbase send --dry-run amount=${qty >= 1e-4 ? qty.toFixed(8).replace(/0+$/, "").replace(/\.$/, "") : qty.toFixed(8)} currency=BTC to=${address}`;
}
function takeProfitPreviewUsd(usd, address, px) {
	if (px && px > 0) return takeProfitPreview(usd / px, address);
	return `coinbase send --dry-run amount=<BTC for ${usd} USD at spot> currency=BTC to=${address}`;
}
var UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function isPortfolioUuid(s) {
	return UUID_RE.test(s.trim());
}
function transferPreview(amount, currency, from, to) {
	return `coinbase transfer amount=${amount} currency=${currency} from=${from} to=${to}`;
}
function buyBtcPreview(usd) {
	return `coinbase orders preview --dry-run product_id=BTC-USDC side=BUY type=market quote_size=${usd}`;
}
//#endregion
export { takeProfitPreviewUsd as a, isPortfolioUuid as i, PROFIT_BTC_RECEIVE as n, transferPreview as o, buyBtcPreview as r, PROFIT_BTC_EXPLORER as t };
