//#region node_modules/.nitro/vite/services/ssr/assets/error-log-AIBGWk_n.js
var MAX = 100;
var RING = [];
var LOG_PATH = "/tmp/desk-errors.json";
function hostOf(msg) {
	return msg.match(/([a-z0-9.-]+\.[a-z]{2,})/i)?.[1]?.toLowerCase() ?? "desk";
}
/** Honest classify. Never green a host because we have a story — only if the miss is understood AND not core. */
function classifyFail(msg) {
	const m = msg.toLowerCase();
	if (/fapi\.binance|binance\.com/.test(m) && /451|403|geo/.test(m)) return {
		resolved: true,
		attention: false,
		verdict: "Known geo-block. Binance is not on the mandate path. OKX/HL/Bitfinex stay."
	};
	if (/bybit/.test(m) && /403|forbidden/.test(m)) return {
		resolved: true,
		attention: false,
		verdict: "Known geo-block. LS still comes from OKX / Hyperliquid / Bitfinex."
	};
	if (/yahoo/.test(m) && /429/.test(m)) return {
		resolved: true,
		attention: false,
		verdict: "Yahoo chart rate-limit. Last-good MSTR spark + CNBC last stay. Not core BTC tape."
	};
	if (/yahoo/.test(m) && /401|403/.test(m)) return {
		resolved: true,
		attention: false,
		verdict: "query1 quote is 401 from this host. CNBC last + Yahoo query2 charts are the live path. Not core BTC tape."
	};
	if (/stooq/.test(m) && /block|403|451/.test(m)) return {
		resolved: true,
		attention: false,
		verdict: "Stooq off-allowlist or geo. CNBC + Yahoo query2 charts cover Mag7/MSTR. Not core BTC tape."
	};
	if (/mempool\.space|blockstream/.test(m) && /timeout|slot/.test(m)) return {
		resolved: false,
		attention: true,
		verdict: "OPEN — recommended fees n/a on last fill. Fallbacks: mempool.space, Blockstream, mempool.emzy.de. Fee-spike gate is blind when all three miss."
	};
	if (/coingecko/.test(m) && /429/.test(m)) return {
		resolved: true,
		attention: false,
		verdict: "Rate limit on Binance-futures fallback only. Core LS is not CoinGecko."
	};
	if (/slot timeout/i.test(m)) return {
		resolved: true,
		attention: false,
		verdict: "Semaphore miss — host was not marked dead. Core Coinbase still retries next cycle."
	};
	if (/^gm:/.test(m) || m.startsWith("gm ")) return {
		resolved: false,
		attention: true,
		verdict: "OPEN — G0DZ1LLa M0D3 sleeve. Report in the GM morning block. Do not green without a live tape."
	};
	if (/agent-ping|\/api\/agent\/ping|calling all bots/.test(m)) return {
		resolved: true,
		attention: true,
		verdict: "FLAG — AI agent connection test. Counted on the daily morning AGENT block. PoC, not LIVE. No trade."
	};
	return {
		resolved: false,
		attention: true,
		verdict: "OPEN — no verified fallback. Do not green. Report in the morning ops note."
	};
}
function persist() {
	if (typeof window !== "undefined") return;
	import("node:fs").then((fs) => {
		try {
			fs.writeFileSync(LOG_PATH, JSON.stringify({
				at: (/* @__PURE__ */ new Date()).toISOString(),
				rows: RING
			}, null, 2));
		} catch {}
	}).catch(() => void 0);
}
function recordDeskFails(fails, at = (/* @__PURE__ */ new Date()).toISOString()) {
	if (!fails.length) return;
	for (const msg of fails) {
		const text = String(msg).slice(0, 160);
		if (!text) continue;
		const { resolved, attention, verdict } = classifyFail(text);
		const last = RING.find((r) => r.msg === text);
		if (last && Date.now() - Date.parse(last.at) < 36e4) {
			last.at = at;
			last.resolved = resolved;
			last.attention = attention;
			last.verdict = verdict;
			continue;
		}
		RING.unshift({
			id: `${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 6)}`,
			at,
			msg: text,
			source: hostOf(text),
			resolved,
			attention,
			verdict
		});
	}
	if (RING.length > MAX) RING.length = MAX;
	persist();
}
function listDeskErrors() {
	return RING.slice(0, MAX);
}
//#endregion
export { listDeskErrors, recordDeskFails };
