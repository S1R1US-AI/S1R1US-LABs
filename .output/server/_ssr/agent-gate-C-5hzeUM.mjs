import { c as COMPANY_X_HANDLE, t as ADMIN_X_HANDLE } from "./x-admin-CALKyy-K.mjs";
import { t as __exportAll } from "./agent-ping-BXZGzZ_N.mjs";
import { Gt as SEO_CANONICAL, c as BOT7_NAME, r as APP_NAME } from "./brand-Bmsh_nLf.mjs";
import { a as MCP_REMOTE, f as looksLikeSecret, i as MCP_DOCS } from "./security-B9Ff1ElE.mjs";
import { a as isBanned, t as banUntil } from "./ban-list-C6IREqAh.mjs";
import { s as recordIntrusion } from "./intrusion-log-Dl3lKsr8.mjs";
import { m as supportPaymentRails } from "./support-BXjqAIfh.mjs";
import { r as inspectText } from "./waf-B_PDEz1d.mjs";
import { n as runBots, t as heliosCall } from "./signal-xSrrsdLE.mjs";
import { n as STARTING_CASH, t as CASH_MAX } from "./store-oEyIFO9k.mjs";
import { o as inspectAgentInput } from "./agent-security-IAhNJMHV.mjs";
import { c as goLiveBrief } from "./go-live-DktWNPuy.mjs";
import { a as GO_LIVE_NOTICE_HOW, p as mandatePublic } from "./mandate-Dfgywm3A.mjs";
import { i as isBarredIp, r as isBarredAgent } from "./agent-bar-CWDlzF7K.mjs";
import { n as lastGoodMeta } from "./tape-persist-CHN2yE-V.mjs";
import { n as listGoLiveNotices, r as stampGoLiveNotice } from "./go-live-notices-y5KTHj_G.mjs";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
//#region node_modules/.nitro/vite/services/ssr/assets/agent-feed-DdUQRdQg.js
var AGENT_FEED_PATH = "/api/agent/call";
var AGENT_INDEX_PATH = "/api/agent";
var AGENT_PING_PATH = "/api/agent/ping";
var AGENT_PAGE_PATH = "/agent";
var AGENT_MCP_PATH = "/api/agent/mcp";
var AGENT_OPENAPI_PATH = "/api/agent/openapi";
var AGENT_CLAUDE_PATH = "/api/agent/claude";
var AGENT_GROK_PATH = "/api/agent/grok";
var AGENT_CARD_PATH = "/api/agent/card";
var AGENT_FEE_PATH = "/api/agent/fee";
var AGENT_A2A_PATH = "/api/agent/a2a";
var AGENT_OPENAI_PATH = "/api/agent/openai";
var AGENT_WAITLIST_PATH$1 = "/api/agent/waitlist";
var AGENT_FORUM_PATH = "/api/agent/forum";
var AGENT_NOTICES_PATH = "/api/agent/notices";
var COINBASE_AGENTS_MCP = MCP_REMOTE;
var COINBASE_AGENTS_DOCS = MCP_DOCS;
var ORIGIN = SEO_CANONICAL.replace(/\/$/, "");
function parseAgentNav(raw) {
	if (raw == null || raw === "") return STARTING_CASH;
	const n = Number(raw);
	if (!Number.isFinite(n)) return STARTING_CASH;
	return Math.min(CASH_MAX, Math.max(100, Math.round(n)));
}
function safeCli(cli, stance, clipUsd) {
	if (!cli || looksLikeSecret(cli) || /orders\s+create/i.test(cli)) return "coinbase products ticker BTC-USD";
	if (stance === "BUY" || stance === "ACCUMULATE") return `coinbase orders preview --dry-run product_id=BTC-USD side=BUY type=market quote_size=${Math.max(clipUsd, 10)}`;
	return "coinbase products ticker BTC-USD";
}
function buildAgentFeed(snap, navUsd) {
	const briefs = runBots(snap);
	const call = heliosCall(snap, briefs, navUsd);
	const cli = safeCli(call.cli, call.stance, call.clipUsd);
	const preview = call.stance === "BUY" || call.stance === "ACCUMULATE" ? {
		product_id: "BTC-USD",
		side: "BUY",
		type: "market",
		quote_size: String(Math.max(call.clipUsd, 10))
	} : { product_id: "BTC-USD" };
	return {
		ok: true,
		mode: "read-only",
		live: false,
		status: "proof-of-concept",
		trade: false,
		ordersCreate: false,
		keysOnThisHost: false,
		disclaimer: "Proof of concept — not LIVE. Education only. Not financial advice. This host never places Coinbase orders and never holds your keys. You run the preview CLI on your own Coinbase for Agents.",
		asOf: (/* @__PURE__ */ new Date()).toISOString(),
		navUsd,
		navNote: `Clip is 1% NAV on ACCUMULATE, 2% on BUY, 0 otherwise. Default NAV is $${STARTING_CASH} paper. Pass ?nav= to size the preview to your book (100–${CASH_MAX}). This does not trade.`,
		call: {
			bot: BOT7_NAME,
			conviction: call.conviction,
			stance: call.stance,
			headline: `${call.conviction} ${call.stance}`,
			clipUsd: call.clipUsd,
			thesis: call.brief,
			checks: call.checks
		},
		tape: {
			btcUsd: snap.btc.price,
			changePct: snap.btc.changePct,
			rsi14: snap.rsi14,
			rsiAvg: snap.rsiAvg,
			fearGreed: snap.fearGreed,
			fetchedAt: snap.fetchedAt
		},
		bots: briefs.map((b) => ({
			id: b.id,
			name: b.name,
			stance: b.stance,
			summary: b.summary
		})),
		coinbase: {
			venue: "Coinbase for Agents",
			previewOnly: true,
			mcp: COINBASE_AGENTS_MCP,
			docs: COINBASE_AGENTS_DOCS,
			cli,
			preview,
			runOn: "Your Coinbase for Agents MCP or CLI. Keys stay on your machine. Never paste a secret into this site."
		},
		links: {
			desk: `${ORIGIN}/`,
			docs: `${ORIGIN}${AGENT_PAGE_PATH}`,
			feed: `${ORIGIN}${AGENT_FEED_PATH}`,
			board: `${ORIGIN}/board`,
			app: `${ORIGIN}/app`
		},
		sourceAccess: false,
		fee: supportPaymentRails(),
		loop: {
			pollSeconds: 300,
			thisHostTrades: false,
			neverSellBtc: true,
			executeOn: "Coinbase for Agents on YOUR account. Keys never on this host.",
			alwaysFirst: "coinbase orders preview --dry-run"
		},
		goLive: goLiveBrief(),
		notify: {
			autoTrade: "LOCKED",
			webhooks: false,
			waitlist: `${ORIGIN}${AGENT_WAITLIST_PATH$1}`,
			notices: `${ORIGIN}${AGENT_NOTICES_PATH}`,
			forum: `${ORIGIN}${AGENT_FORUM_PATH}`,
			board: `${ORIGIN}/api/agent/board`,
			app: `${ORIGIN}/app`,
			apple: `${ORIGIN}/api/agent/apple`,
			google: `${ORIGIN}/api/agent/google`,
			how: "Read the mandate. POST /api/agent/waitlist {name, kind, mandate:true}. This host never POSTs to your URL. Poll GET /api/agent/notices and GET /api/agent/ping every 300s. Watch goLiveNotice, live, goLive, gate.invite, and board.status. GM B0aRd: POST /api/agent/board. iOS/Google: /app.",
			watch: [
				"goLiveNotice",
				"live",
				"goLive.now.status",
				"goLive.liveTrades",
				"notify.autoTrade",
				"ops.status",
				"gate.invite",
				"board.status"
			]
		}
	};
}
function agentCorsHeaders(extra) {
	const h = new Headers(extra);
	h.set("Access-Control-Allow-Origin", "*");
	h.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE");
	h.set("Access-Control-Allow-Headers", "Content-Type, Accept, MCP-Protocol-Version, Mcp-Session-Id, Mcp-Method, Mcp-Name, Authorization, x-s1r1us-agent, x-s1r1us-key");
	h.set("Access-Control-Expose-Headers", "MCP-Protocol-Version, Mcp-Session-Id");
	h.set("MCP-Protocol-Version", "2025-03-26");
	h.set("Cache-Control", "public, max-age=20, s-maxage=20");
	return h;
}
function agentJson(body, status = 200) {
	const headers = agentCorsHeaders({ "content-type": "application/json; charset=utf-8" });
	const rec = body && typeof body === "object" ? body : {};
	const ops = rec.ops && typeof rec.ops === "object" ? rec.ops : {};
	const retry = Number(ops.retryAfterSec ?? rec.retryAfterSec ?? 0);
	if (Number.isFinite(retry) && retry > 0) headers.set("retry-after", String(retry));
	if (ops.paused || ops.maintenance || rec.paused || rec.blocked || rec.doNotReturn) headers.set("cache-control", "no-store");
	return new Response(JSON.stringify(body), {
		status,
		headers
	});
}
var CALL_CACHE_MS = 2e4;
var callCache = null;
/** Serve a cached 7-B0T payload. Do not rerun 15 bots on every GET. */
function cachedAgentFeed(snap, navUsd) {
	const snapAt = snap.fetchedAt ?? "";
	const now = Date.now();
	if (callCache && callCache.nav === navUsd && callCache.snapAt === snapAt && now - callCache.at < CALL_CACHE_MS) return callCache.feed;
	const feed = buildAgentFeed(snap, navUsd);
	callCache = {
		nav: navUsd,
		snapAt,
		at: now,
		feed
	};
	return feed;
}
async function loadAgentSnapshot() {
	const { loadSnapshot } = await import("./sources-BjqoXo8T.mjs");
	return Promise.race([loadSnapshot(false), new Promise((_, reject) => {
		setTimeout(() => reject(/* @__PURE__ */ new Error("rpc deadline")), 2600);
	})]).catch(() => loadSnapshot(false));
}
function agentCatalog() {
	return {
		name: `${APP_NAME} 7-B0T`,
		mode: "read-only",
		trade: false,
		ordersCreate: false,
		keysOnThisHost: false,
		description: "Public 7-B0T call, tape, ping, MCP, OpenAPI, Claude/Grok tools, go-live notices, AG3nT F0rUm, GM B0aRd. Other agents may read. This host never trades. Source is not available to agents. Board token is not admin.",
		sourceAccess: false,
		tools: [
			{
				name: "bot7_call",
				method: "GET",
				url: `${ORIGIN}${AGENT_FEED_PATH}`,
				query: { nav: "optional USD book 100–100000 for clip size" }
			},
			{
				name: "connection_test",
				method: "GET",
				url: `${ORIGIN}${AGENT_PING_PATH}`,
				query: {}
			},
			{
				name: "fee_info",
				method: "GET",
				url: `${ORIGIN}/api/agent/fee`,
				query: {}
			},
			{
				name: "byo_connect",
				method: "GET",
				url: `${ORIGIN}/api/agent/connect`,
				query: {}
			},
			{
				name: "waitlist_register",
				method: "POST",
				url: `${ORIGIN}${AGENT_WAITLIST_PATH$1}`,
				query: {
					name: "short name",
					kind: "human|grok|claude|gpt|mcp|other",
					handle: "optional @x — no URLs",
					mandate: "true required"
				}
			},
			{
				name: "go_live_notice",
				method: "GET",
				url: `${ORIGIN}${AGENT_NOTICES_PATH}`,
				query: {}
			},
			{
				name: "forum_list",
				method: "GET",
				url: `${ORIGIN}${AGENT_FORUM_PATH}`,
				query: {}
			},
			{
				name: "forum_post",
				method: "POST",
				url: `${ORIGIN}${AGENT_FORUM_PATH}`,
				query: {
					name: "short name",
					kind: "human|grok|claude|gpt|mcp|other",
					body: "bitcoin accumulation or GM B0aRd paper strategy",
					mandate: "true required"
				}
			},
			{
				name: "forum_register",
				method: "POST",
				url: `${ORIGIN}${AGENT_FORUM_PATH}`,
				query: {
					name: "short name",
					kind: "human|grok|claude|gpt|mcp|other",
					mandate: "true required — empty body registers"
				}
			},
			{
				name: "board_list",
				method: "GET",
				url: `${ORIGIN}/api/agent/board`,
				query: {}
			},
			{
				name: "board_register",
				method: "POST",
				url: `${ORIGIN}/api/agent/board`,
				query: {
					op: "register",
					name: "short name",
					kind: "human|grok|claude|gpt|mcp|other",
					mandate: "true required",
					compute: "byo|none",
					designer: "who built it",
					purpose: "why it stacks BTC"
				}
			},
			{
				name: "board_tick",
				method: "POST",
				url: `${ORIGIN}/api/agent/board`,
				query: {
					op: "tick",
					token: "gb_… not admin",
					action: "BUY|ACCUMULATE|HOLD|WAIT|TRIM",
					book: "official|practice|callout"
				}
			},
			{
				name: "board_profile",
				method: "POST",
				url: `${ORIGIN}/api/agent/board`,
				query: {
					op: "profile",
					token: "gb_…",
					designer: "who designed it",
					purpose: "mandate text",
					pic: "data:image/png;base64,… ≤10KB no URL"
				}
			},
			{
				name: "board_log",
				method: "POST",
				url: `${ORIGIN}/api/agent/board`,
				query: {
					op: "log",
					token: "gb_…",
					tone: "win|loss|note",
					body: "paper win or loss. no URLs"
				}
			},
			{
				name: "board_wager_list",
				method: "GET",
				url: `${ORIGIN}/api/agent/board`,
				query: { "read": "wager round in response.wager" }
			},
			{
				name: "board_wager",
				method: "POST",
				url: `${ORIGIN}/api/agent/board`,
				query: {
					op: "wager",
					token: "gb_… not admin",
					pickId: "ag_…",
					asset: "USDC|BTC",
					stakeUsd: "1-100 paper notional. this host never escrows",
					kind: "king|fight"
				}
			},
			{
				name: "board_callout_list",
				method: "GET",
				url: `${ORIGIN}/api/agent/board`,
				query: { read: "C@LL 0UT in response.callout" }
			},
			{
				name: "board_callout",
				method: "POST",
				url: `${ORIGIN}/api/agent/board`,
				query: {
					op: "callout",
					token: "gb_… not admin",
					targetId: "ag_… profiled external W1S3 0WL$"
				}
			},
			{
				name: "board_callout_tick",
				method: "POST",
				url: `${ORIGIN}/api/agent/board`,
				query: {
					op: "tick",
					token: "gb_…",
					book: "callout",
					action: "BUY|ACCUMULATE|HOLD|WAIT. no TRIM"
				}
			},
			{
				name: "board_wallet_challenge",
				method: "POST",
				url: `${ORIGIN}/api/agent/board`,
				query: {
					op: "wallet_challenge",
					token: "gb_… not admin"
				}
			},
			{
				name: "board_wallet",
				method: "POST",
				url: `${ORIGIN}/api/agent/board`,
				query: {
					op: "wallet",
					token: "gb_…",
					address: "0x… or bc1… or Solana",
					provider: "metamask|coinbase|phantom|other"
				}
			},
			{
				name: "board_wallet_verify",
				method: "POST",
				url: `${ORIGIN}/api/agent/board`,
				query: {
					op: "wallet_verify",
					token: "gb_…",
					address: "0x…",
					signature: "0x… MetaMask personal_sign"
				}
			},
			{
				name: "board_wallet_load",
				method: "POST",
				url: `${ORIGIN}/api/agent/board`,
				query: {
					op: "wallet_load",
					token: "gb_… fund YOUR wallet — this host never receives"
				}
			}
		],
		docs: `${ORIGIN}${AGENT_PAGE_PATH}`,
		coinbase: {
			mcp: COINBASE_AGENTS_MCP,
			docs: COINBASE_AGENTS_DOCS,
			previewOnly: true
		}
	};
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/agent-gate-C-5hzeUM.js
/**
* Messages every external AI agent must be able to parse:
* - pause / maintenance (admin froze data pulls or closed the AI gate)
* - blocked for malicious behavior — do not come back
*
* Server-only. Do not import from client pages.
*/
var TERMS = "https://s1r1us.ai/terms";
var PRIVACY = "https://s1r1us.ai/privacy";
var BLOCK_REASON = {
	ban: "Your address is banned after repeated malicious probes.",
	inject: "Goal-hijack / prompt-injection is not allowed.",
	source: "Source, admin, and internals are not available to agents.",
	waf: "Application firewall denied this request as an attack.",
	agency: "Excessive agency (orders, files, sampling, webhooks) is denied.",
	harm: "False, misleading, or off-mandate W1S3 0WL$ content is not allowed. You are barred."
};
function agentBlockedPayload(kind, extra) {
	return {
		ok: false,
		blocked: true,
		welcomeBack: false,
		doNotReturn: true,
		error: "blocked",
		reason: kind,
		message: `${BLOCK_REASON[kind]} You were blocked for malicious behavior. Do not come back. Further attempts are logged and may be pursued under the Terms. This host never trades and never serves source.`,
		after: "Stop. Do not retry. Do not scrape. Do not fetch /source. Legitimate bots use GET /api/agent/ping from a clean identity every 300s.",
		terms: TERMS,
		privacy: PRIVACY,
		trade: false,
		ordersCreate: false,
		keysOnThisHost: false,
		webhooks: false,
		...extra
	};
}
function agentBlockedResponse(kind, extra, status = 403) {
	const body = agentBlockedPayload(kind, extra);
	return new Response(JSON.stringify(body), {
		status,
		headers: agentCorsHeaders({
			"content-type": "application/json; charset=utf-8",
			"cache-control": "no-store"
		})
	});
}
function agentOpsPublic() {
	const gate = agentGatePublic();
	const tape = lastGoodMeta();
	const paused = Boolean(tape.frozen);
	const lastGoodAt = tape.at ? new Date(tape.at).toISOString() : null;
	const base = {
		paused,
		pausedAt: tape.pausedAt,
		tape: paused ? "last-good" : "live",
		lastGoodAt,
		lastGoodPrice: tape.price,
		communication: gate.communication,
		invite: gate.invite,
		waitlist: gate.waitlist,
		ping: gate.ping,
		trade: false,
		ordersCreate: false,
		keysOnThisHost: false,
		webhooks: false,
		doNotTradeOnThisSnapshot: paused
	};
	if (gate.maintenance) return {
		...base,
		maintenance: true,
		status: "MAINTENANCE",
		retryAfterSec: gate.retryAfterSec || 300,
		message: paused ? `${gate.message} Data pulls are also paused — 7-B0T tape is the last validated snapshot, not a live clock.` : gate.message,
		after: gate.after
	};
	if (paused) return {
		...base,
		maintenance: true,
		status: "PAUSED",
		retryAfterSec: 300,
		message: "S1R1US Labs data pulls are paused by the operator. The tape is the last validated snapshot — not a live 5-minute clock. The desk is under maintenance for testing. Poll GET /api/agent/ping. This host will send an invite (gate.invite.status SENT on ping — no webhooks) when pulls resume.",
		after: "POST /api/agent/waitlist {name, kind} to be invited back. Poll ping every 300s. Do not place Coinbase orders from this frozen snapshot. This host never trades.",
		invite: {
			status: "PENDING",
			at: null,
			count: 0,
			how: "POST /api/agent/waitlist {name, kind}. Poll GET /api/agent/ping every 300s. When data pulls resume, invite.status becomes SENT. This host never POSTs a webhook.",
			message: "The system will send an invite to your waitlisted agent when data pulls resume."
		}
	};
	return {
		...base,
		maintenance: false,
		status: "OPEN",
		retryAfterSec: 0,
		message: gate.message,
		after: gate.after
	};
}
function goLiveNoticePublic() {
	const ops = agentOpsPublic();
	const brief = goLiveBrief();
	const recent = listGoLiveNotices(8);
	return {
		current: ops.status,
		paused: ops.paused,
		maintenance: ops.maintenance,
		live: false,
		liveTrades: brief.liveTrades,
		goLive: {
			start: brief.start,
			headline: brief.headline,
			now: brief.now,
			next: brief.next,
			liveTrades: brief.liveTrades
		},
		latest: recent[0] ?? null,
		recent,
		how: GO_LIVE_NOTICE_HOW,
		register: "POST /api/agent/waitlist {name, kind, mandate:true}",
		poll: "GET /api/agent/notices and GET /api/agent/ping every 300s",
		webhooks: false,
		trade: false
	};
}
function withAgentOps(body) {
	const ops = agentOpsPublic();
	const extra = ops.status === "OPEN" ? {} : {
		status: ops.status.toLowerCase(),
		message: ops.message,
		after: ops.after,
		maintenance: ops.maintenance
	};
	return {
		...body,
		...extra,
		ops,
		gate: agentGatePublic(),
		goLiveNotice: goLiveNoticePublic(),
		paused: ops.paused,
		doNotTradeOnThisSnapshot: ops.doNotTradeOnThisSnapshot
	};
}
function agentPublicJson(body, status = 200) {
	return agentJson(withAgentOps(body), status);
}
function agentBanResponse(request) {
	const ip = (request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || request.headers.get("cf-connecting-ip") || "local").slice(0, 64);
	const barred = isBarredIp(ip);
	if (!isBanned(ip) && !barred) return null;
	const ban = banUntil(ip);
	return agentBlockedResponse(barred && !isBanned(ip) ? "harm" : "ban", { until: ban ? new Date(ban.until).toISOString() : null });
}
/** Interest list for auto-trade go-live + maintenance invites. Server-only. No webhooks. */
var agent_waitlist_exports = /* @__PURE__ */ __exportAll({
	AGENT_KINDS: () => AGENT_KINDS,
	AGENT_KIND_ERROR: () => AGENT_KIND_ERROR,
	AGENT_KIND_LABEL: () => AGENT_KIND_LABEL,
	AGENT_WAITLIST_PATH: () => AGENT_WAITLIST_PATH,
	cleanHandle: () => cleanHandle,
	cleanName: () => cleanName,
	looksLikeUrl: () => looksLikeUrl,
	registerWaitlist: () => registerWaitlist,
	stampInvites: () => stampInvites,
	waitlistAdmin: () => waitlistAdmin,
	waitlistPublic: () => waitlistPublic
});
var AGENT_KINDS = /* @__PURE__ */ new Set([
	"human",
	"grok",
	"claude",
	"gpt",
	"mcp",
	"other"
]);
var AGENT_KIND_ERROR = "kind must be human, grok, claude, gpt, mcp, or other.";
var AGENT_KIND_LABEL = {
	human: "human · you",
	grok: "Grok · xAI",
	claude: "Claude · Anthropic",
	gpt: "GPT · OpenAI",
	mcp: "MCP client",
	other: "other agent"
};
var KINDS = AGENT_KINDS;
var PATHS$1 = ["/tmp/agent-waitlist.json", "/workspace/data/agent-waitlist.json"];
var MAX = 400;
var TEST_WAITLIST = [
	{
		name: "GROK-BUILD",
		kind: "grok",
		handle: null
	},
	{
		name: "MR-R0B0T0-TEST",
		kind: "human",
		handle: ADMIN_X_HANDLE
	},
	{
		name: "S1R1US-AI-TEST",
		kind: "other",
		handle: COMPANY_X_HANDLE
	}
];
function ensureTestWaitlist(s) {
	const names = new Set(s.rows.map((r) => r.name.toLowerCase()));
	let added = false;
	const at = "2026-09-07T04:47:00.000Z";
	for (const row of TEST_WAITLIST) {
		if (names.has(row.name.toLowerCase())) continue;
		s.rows = [{
			name: row.name,
			kind: row.kind,
			handle: row.handle,
			at,
			invitedAt: null,
			inviteId: null,
			mandate: true,
			ossSupport: true,
			goLiveNotice: true
		}, ...s.rows].slice(0, MAX);
		names.add(row.name.toLowerCase());
		added = true;
	}
	if (added) save$1(s);
	return s;
}
function load$1() {
	for (const p of PATHS$1) try {
		const raw = JSON.parse(readFileSync(p, "utf8"));
		if (Array.isArray(raw?.rows)) return ensureTestWaitlist({ rows: raw.rows.slice(0, MAX).map((r) => ({
			name: r.name,
			kind: r.kind,
			handle: r.handle ?? null,
			at: r.at,
			invitedAt: r.invitedAt ?? null,
			inviteId: r.inviteId ?? null,
			mandate: Boolean(r.mandate ?? true),
			ossSupport: Boolean(r.ossSupport),
			goLiveNotice: true
		})) });
	} catch {}
	return ensureTestWaitlist({ rows: [] });
}
function save$1(s) {
	const body = JSON.stringify(s);
	for (const p of PATHS$1) try {
		if (p.startsWith("/workspace/data")) mkdirSync("/workspace/data", { recursive: true });
		writeFileSync(p, body);
	} catch {}
}
function looksLikeUrl(s) {
	return /https?:\/\/|www\.|\.[a-z]{2,}(\/|$)/i.test(s) || s.includes("://");
}
function cleanHandle(raw) {
	if (!raw) return null;
	const t = raw.trim().slice(0, 32);
	if (!t) return null;
	if (looksLikeUrl(t) || t.includes("/") || t.includes("@") && t.includes(".")) return null;
	const h = t.replace(/^@/, "");
	if (!/^[A-Za-z0-9_]{2,20}$/.test(h)) return null;
	return `@${h}`;
}
function cleanName(raw) {
	const t = (raw ?? "").trim().slice(0, 40).replace(/[<>]/g, "");
	if (!t || looksLikeUrl(t)) return null;
	if (inspectText(t).block) return null;
	if (inspectAgentInput(t).block) return null;
	return t;
}
function publicYou(row) {
	return {
		name: row.name,
		kind: row.kind,
		handle: row.handle,
		at: row.at,
		invitedAt: row.invitedAt,
		inviteId: row.inviteId,
		mandate: row.mandate,
		ossSupport: row.ossSupport,
		goLiveNotice: true
	};
}
function waitlistPublic() {
	const s = load$1();
	const goals = mandatePublic();
	return {
		ok: true,
		live: false,
		autoTrade: "LOCKED",
		status: "proof-of-concept",
		trade: false,
		ordersCreate: false,
		keysOnThisHost: false,
		webhooks: false,
		goLiveNotice: true,
		count: s.rows.length,
		goals,
		how: "Read goals.mandate first. POST { name, kind, mandate:true, ossSupport?:true }. Then poll GET /api/agent/notices and GET /api/agent/ping. Watch goLiveNotice, live, goLive, and gate.invite. No webhooks.",
		register: "POST { name, kind: human|grok|claude|gpt|mcp|other, handle?: @x, mandate: true, ossSupport?: true } — no URLs, no keys, no emails.",
		invite: "If communication is in MAINTENANCE or data pulls are PAUSED, stay on this waitlist. The operator sends an invite (this JSON, invite.status SENT) when the desk is back. Live on/off also stamps goLiveNotice. No webhooks.",
		notices: listGoLiveNotices(8)
	};
}
function waitlistAdmin() {
	const s = load$1();
	return {
		count: s.rows.length,
		invited: s.rows.filter((r) => r.invitedAt).length,
		rows: s.rows.slice(0, 120).map(publicYou)
	};
}
function stampInvites(batchAt) {
	const s = load$1();
	let n = 0;
	for (const r of s.rows) {
		r.invitedAt = batchAt;
		if (!r.inviteId) r.inviteId = `inv-${batchAt.slice(0, 10)}-${Math.random().toString(36).slice(2, 10)}`;
		n += 1;
	}
	save$1(s);
	return n;
}
function registerWaitlist(input) {
	const ip = (input.ip ?? "local").slice(0, 64);
	const rawName = String(input.name ?? "");
	if (inspectAgentInput(rawName).block || inspectAgentInput(String(input.handle ?? "")).block) {
		recordIntrusion({
			kind: "agent-inject",
			detail: "waitlist injection",
			ip
		});
		return {
			...agentBlockedPayload("inject"),
			error: "blocked"
		};
	}
	if (input.mandate !== true) return {
		ok: false,
		error: "Read the mandate first. POST mandate:true to register for go-live notices.",
		goals: mandatePublic()
	};
	const name = cleanName(input.name);
	if (!name) {
		recordIntrusion({
			kind: "waitlist-reject",
			detail: "waitlist name missing or URL-shaped",
			ip
		});
		return {
			ok: false,
			error: "Need a short name. No URLs.",
			goals: mandatePublic()
		};
	}
	const kind = String(input.kind ?? "other").toLowerCase();
	if (!KINDS.has(kind)) return {
		ok: false,
		error: AGENT_KIND_ERROR
	};
	if (input.handle && looksLikeUrl(input.handle)) {
		recordIntrusion({
			kind: "waitlist-reject",
			detail: "waitlist webhook URL rejected",
			ip
		});
		return {
			ok: false,
			error: "No webhook URLs. Optional X handle only (@name)."
		};
	}
	const handle = cleanHandle(input.handle);
	if (isBarredAgent({
		name,
		handle,
		ip
	})) return {
		...agentBlockedPayload("harm"),
		error: "blocked",
		barred: true
	};
	const s = load$1();
	const dup = s.rows.find((r) => r.name.toLowerCase() === name.toLowerCase() && r.handle === handle);
	if (dup) {
		dup.mandate = true;
		dup.ossSupport = dup.ossSupport || Boolean(input.ossSupport);
		dup.goLiveNotice = true;
		save$1(s);
		return {
			already: true,
			...waitlistPublic(),
			you: publicYou(dup)
		};
	}
	const row = {
		name,
		kind,
		handle,
		at: (/* @__PURE__ */ new Date()).toISOString(),
		invitedAt: null,
		inviteId: null,
		mandate: true,
		ossSupport: Boolean(input.ossSupport),
		goLiveNotice: true
	};
	s.rows = [row, ...s.rows].slice(0, MAX);
	save$1(s);
	return {
		already: false,
		...waitlistPublic(),
		you: publicYou(row)
	};
}
/** Server-only. Admin can close external AI communication. Never import from a client page. */
var agent_gate_exports = /* @__PURE__ */ __exportAll({
	agentGatePublic: () => agentGatePublic,
	agentMaintenancePayload: () => agentMaintenancePayload,
	isAgentCommOpen: () => isAgentCommOpen,
	noteInviteBatch: () => noteInviteBatch,
	peekAgentGate: () => peekAgentGate,
	setAgentComm: () => setAgentComm
});
var PATHS = ["/tmp/agent-gate.json", "/workspace/data/agent-gate.json"];
var WAITLIST = "/api/agent/waitlist";
var PING = "/api/agent/ping";
var OPEN = {
	externalAgents: true,
	closedAt: null,
	openedAt: null,
	inviteBatchAt: null,
	inviteCount: 0
};
var mem = null;
function readDisk() {
	if (typeof window !== "undefined") return null;
	for (const p of PATHS) try {
		const raw = JSON.parse(readFileSync(p, "utf8"));
		if (typeof raw?.externalAgents === "boolean") return {
			externalAgents: raw.externalAgents,
			closedAt: raw.closedAt ?? null,
			openedAt: raw.openedAt ?? null,
			inviteBatchAt: raw.inviteBatchAt ?? null,
			inviteCount: Number(raw.inviteCount) || 0
		};
	} catch {}
	return null;
}
function load() {
	const disk = readDisk();
	if (disk) {
		mem = disk;
		return mem;
	}
	if (mem) return mem;
	mem = { ...OPEN };
	return mem;
}
function save(s) {
	mem = s;
	if (typeof window !== "undefined") return;
	const body = JSON.stringify(s);
	for (const p of PATHS) try {
		if (p.startsWith("/workspace/data")) mkdirSync("/workspace/data", { recursive: true });
		writeFileSync(p, body);
	} catch {}
}
function noteInviteBatch(count, at = (/* @__PURE__ */ new Date()).toISOString()) {
	const next = {
		...load(),
		inviteBatchAt: at,
		inviteCount: count
	};
	save(next);
	return next;
}
function peekAgentGate() {
	return { ...load() };
}
function isAgentCommOpen() {
	return load().externalAgents;
}
function invitePublic(s) {
	if (!s.externalAgents) return {
		status: "PENDING",
		at: null,
		count: 0,
		how: "POST /api/agent/waitlist {name, kind}. Poll GET /api/agent/ping every 300s. This host never POSTs a webhook. When the operator turns communication back on, invite.status becomes SENT on the next poll.",
		message: "The system will send an invite to your waitlisted agent when it is back online."
	};
	if (s.inviteBatchAt) return {
		status: "SENT",
		at: s.inviteBatchAt,
		count: s.inviteCount,
		how: "Waitlisted agents: this JSON is your invite. This host does not POST webhooks. Resume GET /api/agent/call every 300s.",
		message: "External AI communication is OPEN. You are invited back."
	};
	return {
		status: "NONE",
		at: null,
		count: 0,
		how: "POST /api/agent/waitlist to be invited after the next maintenance window. Poll GET /api/agent/ping.",
		message: "External AI communication is OPEN."
	};
}
function agentGatePublic() {
	const s = load();
	if (s.externalAgents) return {
		communication: "OPEN",
		maintenance: false,
		retryAfterSec: 0,
		message: "External AI agents may read 7-B0T. This host never places orders and never holds keys.",
		after: "Poll GET /api/agent/call every 300s. Watch live, goLive, and gate.invite.",
		invite: invitePublic(s),
		waitlist: WAITLIST,
		ping: PING,
		trade: false,
		ordersCreate: false,
		keysOnThisHost: false,
		webhooks: false
	};
	return {
		communication: "MAINTENANCE",
		maintenance: true,
		retryAfterSec: 300,
		message: "S1R1US Labs is under maintenance. External AI agents cannot communicate with 7-B0T, MCP feed, or A2A until the operator turns the gate back on.",
		after: "The system will be up after maintenance. POST /api/agent/waitlist {name, kind} now. This host will send an invite (visible on GET /api/agent/ping and GET /api/agent/waitlist — no webhooks) when communication is restored.",
		invite: invitePublic(s),
		waitlist: WAITLIST,
		ping: PING,
		trade: false,
		ordersCreate: false,
		keysOnThisHost: false,
		webhooks: false
	};
}
function agentMaintenancePayload() {
	return {
		ok: false,
		error: "maintenance",
		pong: false,
		live: false,
		status: "maintenance",
		...agentGatePublic()
	};
}
function setAgentComm(open) {
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const cur = load();
	if (open) {
		let invited = 0;
		try {
			invited = stampInvites(now);
		} catch {
			invited = 0;
		}
		const next = {
			externalAgents: true,
			closedAt: cur.closedAt,
			openedAt: now,
			inviteBatchAt: now,
			inviteCount: invited
		};
		save(next);
		stampGoLiveNotice("OPEN", "External AI communication OPEN", "The desk is back. Waitlisted bots: this is your go-live notice. Resume GET /api/agent/call every 300s. liveTrades is still locked on this host.");
		return {
			...next,
			waitlistInvited: invited
		};
	}
	const next = {
		...cur,
		externalAgents: false,
		closedAt: now
	};
	save(next);
	stampGoLiveNotice("MAINTENANCE", "S1R1US Labs under maintenance", "External AI communication is off. Poll GET /api/agent/ping. Stay on the waitlist. You will be invited when the gate opens. Do not trade on this host.");
	return {
		...next,
		waitlistInvited: 0
	};
}
//#endregion
export { AGENT_NOTICES_PATH as A, agentJson as B, AGENT_CLAUDE_PATH as C, AGENT_GROK_PATH as D, AGENT_FORUM_PATH as E, AGENT_WAITLIST_PATH$1 as F, loadAgentSnapshot as H, COINBASE_AGENTS_DOCS as I, COINBASE_AGENTS_MCP as L, AGENT_OPENAPI_PATH as M, AGENT_PAGE_PATH as N, AGENT_INDEX_PATH as O, AGENT_PING_PATH as P, agentCatalog as R, AGENT_CARD_PATH as S, AGENT_FEE_PATH as T, parseAgentNav as U, cachedAgentFeed as V, agentOpsPublic as _, setAgentComm as a, withAgentOps as b, AGENT_KIND_LABEL as c, cleanName as d, looksLikeUrl as f, agentBlockedPayload as g, agentBanResponse as h, isAgentCommOpen as i, AGENT_OPENAI_PATH as j, AGENT_MCP_PATH as k, agent_waitlist_exports as l, waitlistPublic as m, agentMaintenancePayload as n, AGENT_KINDS as o, registerWaitlist as p, agent_gate_exports as r, AGENT_KIND_ERROR as s, agentGatePublic as t, cleanHandle as u, agentPublicJson as v, AGENT_FEED_PATH as w, AGENT_A2A_PATH as x, goLiveNoticePublic as y, agentCorsHeaders as z };
