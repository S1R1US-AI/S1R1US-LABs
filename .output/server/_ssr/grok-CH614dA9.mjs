import { r as createServerFn } from "./ssr.mjs";
import { c as grokRateLimit, l as grokUsage, s as assertSafePayload } from "./security-LsSQVjJ2.mjs";
import { storedAdminName, verifyAccessToken, verifyDeskToken } from "./access.server-3EnTNYk9.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { n as guardedFetch } from "./net-guard-C-AYNeR_.mjs";
import { n as runBots, t as heliosCall } from "./signal-BqWu6ECB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/grok-CH614dA9.js
var askHelios_createServerFn_handler = createServerRpc({
	id: "70e9587696840a33b344a5ecd8706e3aa8526f9c1a9462bcac2625207915aa78",
	name: "askHelios",
	filename: "src/lib/desk/grok.ts"
}, (opts) => askHelios.__executeServer(opts));
var askHelios = createServerFn({ method: "POST" }).validator((input) => input).handler(askHelios_createServerFn_handler, async ({ data }) => {
	if (!await verifyDeskToken(data.token)) return {
		ok: false,
		error: "Desk session required."
	};
	const limited = grokRateLimit();
	if (limited) return {
		ok: false,
		error: limited
	};
	const { getLiveSnapshot } = await import("./sources-BCnLbycM.mjs");
	const s = await getLiveSnapshot();
	const briefs = runBots(s);
	const call = heliosCall(s, briefs, 1e3);
	const compact = {
		btc: s.btc,
		rsi14: s.rsi14,
		fearGreed: s.fearGreed,
		positioning: s.positioning,
		onchain: s.onchain,
		asia: s.asia,
		em: {
			net: s.em.net,
			regions: s.em.regions.map((r) => ({
				id: r.id,
				flow: r.flow,
				premiumPct: r.premiumPct
			}))
		},
		quotes: s.quotes,
		filings: s.filings.slice(0, 6),
		headlines: s.headlines.slice(0, 8).map((h) => `${h.source}: ${h.title}`),
		bots: briefs.map((b) => ({
			id: b.id,
			stance: b.stance,
			summary: b.summary
		})),
		helios: {
			stance: call.stance,
			conviction: call.conviction,
			clipUsd: call.clipUsd
		}
	};
	const unsafe = assertSafePayload(JSON.stringify(compact));
	if (unsafe) return {
		ok: false,
		error: unsafe
	};
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "Grok is not available in this environment."
	};
	const res = await guardedFetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			max_tokens: 700,
			temperature: .2,
			messages: [{
				role: "system",
				content: "You are Helios, the seventh bot of a one-operator bitcoin accumulator. You can see the other six bots including Rotation Analyst (Nasdaq/AI/paper-gold → BTC, whale overlay, free RSS). Mandate: accumulate BTC, never short, never recommend leverage. Use only the supplied snapshot. Weight the Asia tape (Upbit kimchi, HashKey HK, HTX, OKX CNY OTC) especially during session ASIA. Weight the EM flow tape. Binance is unavailable. Mention X/Twitter sentiment only if the headlines imply it — do not invent posts. End with a single line: STANCE / CONVICTION / CLIP_USD."
			}, {
				role: "user",
				content: `Grade the coordinator and issue the BTC accumulation call.\n${JSON.stringify(compact)}`
			}]
		})
	});
	if (!res.ok) return {
		ok: false,
		error: `xAI API error ${res.status}`
	};
	return {
		ok: true,
		text: (await res.json()).choices?.[0]?.message?.content ?? ""
	};
});
var adminStatus_createServerFn_handler = createServerRpc({
	id: "7426936e6524e949f61ef1414e1b7b92054624acddd912f28187bda0b5b11380",
	name: "adminStatus",
	filename: "src/lib/desk/grok.ts"
}, (opts) => adminStatus.__executeServer(opts));
var adminStatus = createServerFn({ method: "POST" }).validator((input) => input).handler(adminStatus_createServerFn_handler, async ({ data }) => {
	if (!await verifyAccessToken(data.token)) return {
		ok: false,
		error: "Admin session required."
	};
	const exp = Number(data.token.split(".")[0]);
	return {
		ok: true,
		grok: grokUsage(),
		grokReady: Boolean(process.env.XAI_API_KEY),
		exp: Number.isFinite(exp) ? exp : null,
		adminName: await storedAdminName()
	};
});
//#endregion
export { adminStatus_createServerFn_handler, askHelios_createServerFn_handler };
