import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { n as guardedFetch } from "./net-guard-C4Si76ZP.mjs";
import { n as PROFIT_BTC_RECEIVE, t as PROFIT_BTC_EXPLORER } from "./treasury-VcYm63db.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/donate-_VA5jYj_.js
var DONATE_GOAL_USD = 15e4;
var DONATE_BTC = PROFIT_BTC_RECEIVE;
var DONATE_BTC_EXPLORER = PROFIT_BTC_EXPLORER;
var cache = null;
var fetchDonate_createServerFn_handler = createServerRpc({
	id: "ee22c7fb43caf7a85cab1e93c385f89578a27439ee4627d25f82af6f48a4983b",
	name: "fetchDonate",
	filename: "src/lib/launch/donate.ts"
}, (opts) => fetchDonate.__executeServer(opts));
var fetchDonate = createServerFn({ method: "GET" }).handler(fetchDonate_createServerFn_handler, async () => {
	const now = Date.now();
	if (cache && now - cache.at < 45e3) return cache.value;
	const { profitChain, usdcChain } = await import("./treasury.server-BGokMMrx.mjs");
	const [chain, usdc, px] = await Promise.all([
		profitChain(),
		usdcChain(),
		spotBtc()
	]);
	const btc = chain.btc;
	const btcUsd = btc != null && px != null ? btc * px : null;
	const usdcBal = usdc.usdc;
	const raised = (btcUsd ?? 0) + (usdcBal ?? 0);
	const value = {
		goalUsd: DONATE_GOAL_USD,
		raisedUsd: raised,
		pct: Math.min(100, raised / DONATE_GOAL_USD * 100),
		btc,
		btcUsd,
		usdc: usdcBal,
		btcAddress: DONATE_BTC,
		btcExplorer: DONATE_BTC_EXPLORER,
		usdcAddress: usdc.address,
		usdcNetwork: usdc.network,
		usdcExplorer: usdc.explorer,
		asOf: (/* @__PURE__ */ new Date()).toISOString(),
		source: [chain.source, usdc.network].filter(Boolean).join(" · ")
	};
	cache = {
		at: now,
		value
	};
	return value;
});
async function spotBtc() {
	try {
		const res = await guardedFetch("https://api.exchange.coinbase.com/products/BTC-USD/ticker", {
			headers: {
				Accept: "application/json",
				"User-Agent": "S1R1US-Lab/1.0"
			},
			signal: AbortSignal.timeout(8e3)
		});
		if (!res.ok) return null;
		const j = await res.json();
		const n = Number(j.price);
		return Number.isFinite(n) && n > 0 ? n : null;
	} catch {
		return null;
	}
}
//#endregion
export { fetchDonate_createServerFn_handler };
