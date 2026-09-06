import { a as BOT7_NAME } from "./brand-ByvcTltq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/policy-GHDtc2b_.js
var RISK_RULES = [
	{
		id: "rsi-buy",
		label: "BUY RSI",
		value: "Hourly RSI(14) < 30 and F&G ≤ 40"
	},
	{
		id: "accum",
		label: "ACCUMULATE",
		value: "≥3 checks and (two orthogonal lanes or discount vs gold/Asia/F&G)"
	},
	{
		id: "etf",
		label: "ETF melt-up",
		value: "Wait if last session net > $350M and RSI ≥ 50"
	},
	{
		id: "trim",
		label: "No sell",
		value: "Never sell bitcoin. RSI > 72 and F&G ≥ 75 → HOLD, keep BTC. Never TRIM the stack."
	},
	{
		id: "wait",
		label: "WAIT",
		value: "Crowded Asia/EM or F&G ≥ 70 with weak tape — do not buy more. Do not sell."
	},
	{
		id: "ls",
		label: "Long/short",
		value: "Crowded if OI-weighted LS > 1.6 (OKX+Bybit+Binance+Bitfinex)"
	},
	{
		id: "fund",
		label: "Funding",
		value: "Overheated if > 0.05% (longs paying = crowded longs losing carry)"
	},
	{
		id: "wall",
		label: "Sell wall",
		value: "WAIT-lean if sell wall ≥ 2× buy wall in the 0.4% band + Coinbase L2"
	},
	{
		id: "kimchi",
		label: "Kimchi",
		value: "Crowded if Upbit premium > 3%"
	},
	{
		id: "cny",
		label: "CNY OTC",
		value: "Crowded if USDT premium > 2%"
	},
	{
		id: "em",
		label: "EM tape",
		value: "Crowded if 3+ regions hot (>2.5%)"
	},
	{
		id: "clip",
		label: "Clip",
		value: "BUY 2% NAV · ACCUMULATE 1% · HOLD/WAIT 0. Never a sell clip."
	},
	{
		id: "stop",
		label: "Stop-loss",
		value: "Per-clip watch 1.5% under entry. At +1% mark breakeven. A stop does NOT sell BTC — it blocks add-on buys into that lot. Never short. Never dump the stack."
	},
	{
		id: "short",
		label: "Shorts",
		value: "Forbidden. Mandate is accumulate BTC. Never sell. Never short."
	},
	{
		id: "ops",
		label: "Ops",
		value: "Honest error log. Never auto-green. Daily 08:00 ET chat report: architecture, security, open errors, mandate score 1–10."
	}
];
var BOT_ROSTER = [
	{
		id: "filings",
		name: "Filings Analyst",
		layer: "Event",
		feed: "SEC EDGAR 8-K/10-Q/10-K · MSTR COIN MARA SMLR only"
	},
	{
		id: "earnings",
		name: "Earnings Analyst",
		layer: "Flow",
		feed: "US spot ETF net + DAT treasury BTC · IBIT vs Coinbase"
	},
	{
		id: "sector",
		name: "Sector Research",
		layer: "Relative value",
		feed: "IBIT vs GLD · BTC/gold 1y median · DXY SPY"
	},
	{
		id: "sentiment",
		name: "Sentiment Analyst",
		layer: "Mood",
		feed: "Alternative.me F&G · Cointelegraph CoinDesk Decrypt RSS"
	},
	{
		id: "rotation",
		name: "Rotation Analyst",
		layer: "Capital rotation",
		feed: "QQQ NVDA vs IBIT · GLD paper · RSS + whale overlay"
	},
	{
		id: "coordinator",
		name: "Coordinator",
		layer: "Maker-checker",
		feed: "Orthogonal two-lane · event + flow + RV + mood"
	},
	{
		id: "helios",
		name: BOT7_NAME,
		layer: "Bot 7",
		feed: "All six + BTC tape, Asia, EM, ETF, BTC/gold, rotation, whales"
	}
];
var DATA_FEEDS = [
	{
		id: "coinbase",
		name: "Coinbase spot",
		role: "BTC-USD last, hourly candles, product_book 80 (level=1 fallback)"
	},
	{
		id: "okx",
		name: "Public leverage",
		role: "Core: OKX + Hyperliquid + Bitfinex. Bybit 403 from some clouds (last-good). Fill: Binance futures (fapi, CoinGecko if geo-blocked 451)."
	},
	{
		id: "asia",
		name: "Asia tape",
		role: "Upbit, Bithumb, HashKey, HTX, CNY OTC"
	},
	{
		id: "em",
		name: "EM flow",
		role: "UAE, ME, RU, Africa, LatAm premiums (fill phase)"
	},
	{
		id: "fear-greed",
		name: "Fear & Greed",
		role: "Alternative.me"
	},
	{
		id: "sec",
		name: "SEC EDGAR",
		role: "Filings + insiders (fill phase)"
	},
	{
		id: "rss",
		name: "Headlines",
		role: "Cointelegraph, CoinDesk, Decrypt, Bitcoin.com, CNBC, Yahoo, Motley Fool, Bitcoin Magazine (fill)"
	},
	{
		id: "capital",
		name: "Capital tape",
		role: "Core: SoSoValue ETF net. Fill: DAT/SWF treasuries, CEX notional, Hyperliquid (90s cache, 429 → last good)"
	},
	{
		id: "pools",
		name: "Slow capital",
		role: "CRE VNQ, 401k/IRA pipe, insurers, endowments, US state SBR, agent OI"
	},
	{
		id: "mining",
		name: "Hashrate",
		role: "Core: blockchain.info hash/height + mempool pool geography (Foundry/MARA/Luxor/OCEAN/CKPool = North America). Fill: mempool.space/Blockstream fees."
	},
	{
		id: "macro",
		name: "Rates + M2",
		role: "FRED bills/2s/10s/30s/M2/CPI/PCE · DefiLlama stables (fill, 7s cap)"
	},
	{
		id: "strategy",
		name: "MSTR stack",
		role: "MSTR, preferreds, MSTY/2x vehicles from quote tape"
	},
	{
		id: "holders",
		name: "Top holders",
		role: "Bitbo BTC treasuries (fill) · quote-derived gold/silver"
	}
];
/** Two-phase run cycle — shared by Paper, Admin, s1r1us.ai. */
var CYCLE_ARCH = {
	name: "core / fill",
	coreMs: 1800,
	clientRaceMs: 2800,
	spinnerMs: 3200,
	inflight: 12,
	core: "Coinbase last first, then RSI/MACD, F&G, on-chain, Asia kimchi, public leverage, ETF flow, whales",
	fill: "Holders, headlines, filings, EM, FRED/M2, DAT/SWF, Binance LS/OI, mempool.space + Blockstream fees — last good tape reused on 429/timeout",
	skip: "None cut. Slow or geo-blocked hosts run on fill with 1.4s caps and last-good cache (Binance fapi → CoinGecko; mempool.space fees; Blockstream fees)."
};
/** Bump on the weekly whole-desk free-source hunt. */
var SYSTEM_REVIEWED = "2026-09-05";
//#endregion
export { SYSTEM_REVIEWED as a, RISK_RULES as i, CYCLE_ARCH as n, DATA_FEEDS as r, BOT_ROSTER as t };
