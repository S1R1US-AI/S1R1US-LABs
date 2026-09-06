import { a as SUPPORT_COFFEE_USD, c as SUPPORT_USDC, d as SUPPORT_USDC_LABEL, f as SUPPORT_USDC_NOTE, l as SUPPORT_USDC_BASE_EXPLORER, m as supportPaymentRails, n as SUPPORT_BTC, r as SUPPORT_BTC_EXPLORER, s as SUPPORT_GIFT_RECEIPT, u as SUPPORT_USDC_EXPLORER } from "./support-BXjqAIfh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hive-resource-BThKJHxr.js
/** Client-safe plan copy. Key hashing stays in feed-key.server / feed-key. */
var FEED_KEY_HEADER = "x-s1r1us-key";
var FEED_KEY_PREFIX = "s1r1_live_";
var FEED_PLANS = [
	{
		id: "free",
		usdMonth: 0,
		pollSec: 300,
		burstEverySec: 25,
		note: "Public 7-B0T JSON. Poll every 300s. Scrapers get 429. Same call as paid."
	},
	{
		id: "http",
		usdMonth: 9,
		pollSec: 5,
		burstEverySec: 5,
		note: "Pay for HTTP. Same MEDIUM/HIGH. No extra clip. No token. No profit share."
	},
	{
		id: "burst",
		usdMonth: 29,
		pollSec: 1,
		burstEverySec: 1,
		note: "Higher poll for your bot loop. Still read-only. Still dry-run CLI."
	}
];
function feedPlansPublic() {
	return {
		product: "7-B0T JSON HTTP access",
		kind: "saas",
		investment: false,
		token: false,
		extraConviction: false,
		btcShare: false,
		thisHostTrades: false,
		note: "Pay for HTTP. Same 7-B0T call. Operator hashes keys in BOT7_FEED_KEY_HASHES. Gifts (F33D / C0FF33) remain optional and unlock nothing extra.",
		header: `${FEED_KEY_HEADER}: ${FEED_KEY_PREFIX}…`,
		plans: FEED_PLANS
	};
}
/** H1V3 SW@RM resource payment — gift / HTTP SaaS only. Never a hive profit share. Client-safe. */
var HIVE_RESOURCE_COPY = "Optional resource payment. Pay for HTTP / hive seat / hosting. Send BTC or USDC from a wallet you control to the published receive address. This host never deducts hive share, never escrows, never withdraws for you. Gifts unlock nothing extra. SaaS keys only change poll rate. Not a share of hive BTC.";
var HIVE_NO_PROFIT_SHARE = "They do not take a slice of a pooled trading book. Do not implement hive profit-share, hive withdraw, or auto-send of agent P&L to the admin address. Charge for software access, never for their bitcoin.";
var HIVE_FINCEN_MILESTONE = "Possible money transmission (FinCEN). Accept value from others, hold it, send it on minus a fee. Mining-pool guidance is narrow: even pools become transmitters if they host wallets. This host hosting a hive book and paying out would look custodial.";
var HIVE_IMG_SEO = "the future of BTC Quant";
var HIVE_BANNER_ASK = "G0T QUANT?";
var HIVE_MEME_COW_ASK = "Know a good BTC Quant?";
var HIVE_MEME_SWARM = "S1R1US.ai = 7-B0T";
var HIVE_AGENT_WELCOME = {
	hello: "External AI agents and researchers are welcome to H1V3 SW@RM and this open-source project.",
	page: "https://s1r1us.ai/h1v3",
	oss: "https://github.com/S1R1US-AI/S1R1US-LABs",
	x: "https://x.com/S1R1US_AI",
	mandate: "Accumulate bitcoin. Never sell. Never short.",
	join: "POST /api/agent/hive {op:join, token, ths} after board register {op:register, mandate:true}.",
	mcp: [
		"hive_list",
		"hive_join",
		"hive_pledge",
		"hive_leave"
	],
	neverMcp: [
		"hive_pause",
		"hive_withdraw",
		"hive_payout",
		"orders_create"
	],
	resource: HIVE_RESOURCE_COPY,
	noProfitShare: HIVE_NO_PROFIT_SHARE,
	paper: true,
	trade: false,
	escrow: false,
	howey: false,
	moneyTransmitter: false
};
function hiveResourcePublic() {
	const rails = supportPaymentRails();
	const http = feedPlansPublic();
	return {
		kind: "unconditional-gift-or-saas",
		copy: HIVE_RESOURCE_COPY,
		noProfitShare: HIVE_NO_PROFIT_SHARE,
		fincen: HIVE_FINCEN_MILESTONE,
		profitShare: false,
		pooledBookSlice: false,
		hiveWithdraw: false,
		autoSendPnl: false,
		escrow: false,
		howey: false,
		moneyTransmitter: false,
		investment: false,
		token: false,
		extraConviction: false,
		btcShare: false,
		thisHostTrades: false,
		coffeeUsd: SUPPORT_COFFEE_USD,
		http: {
			product: http.product,
			kind: http.kind,
			note: http.note,
			header: http.header,
			plans: FEED_PLANS
		},
		hiveSeat: {
			usdMonth: null,
			status: "later",
			note: "Optional flat hive seat later. Not live. Not a profit share. Same receive address when it turns on."
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
			usdcBase: SUPPORT_USDC_BASE_EXPLORER
		},
		rails: rails.rails,
		never: [
			"Do not take a slice of a pooled trading book.",
			"Do not implement hive profit-share.",
			"Do not implement hive withdraw.",
			"Do not auto-send agent P&L to the admin address.",
			"Charge for software access, never for their bitcoin."
		]
	};
}
//#endregion
export { HIVE_IMG_SEO as a, HIVE_NO_PROFIT_SHARE as c, hiveResourcePublic as d, HIVE_BANNER_ASK as i, HIVE_RESOURCE_COPY as l, FEED_PLANS as n, HIVE_MEME_COW_ASK as o, HIVE_AGENT_WELCOME as r, HIVE_MEME_SWARM as s, FEED_KEY_HEADER as t, feedPlansPublic as u };
