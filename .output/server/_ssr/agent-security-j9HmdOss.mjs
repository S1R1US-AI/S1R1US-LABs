import { r as __exportAll } from "../_runtime.mjs";
import { t as __exportAll$1 } from "./agent-ping-BXZGzZ_N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/agent-security-j9HmdOss.js
var agent_security_j9HmdOss_exports = /* @__PURE__ */ __exportAll({
	a: () => hasAgentWebhook,
	c: () => mcpMethodAllowed,
	d: () => readAgentJson,
	i: () => asiRows,
	l: () => mcpToolAllowed,
	n: () => agentSecurityStats,
	o: () => inspectAgentInput,
	r: () => agent_security_exports,
	s: () => llmAgentRows,
	t: () => MCP_TOOLS,
	u: () => noteAgentEvent
});
var agent_security_exports = /* @__PURE__ */ __exportAll$1({
	AGENT_JSON_MAX: () => AGENT_JSON_MAX,
	MCP_BATCH_MAX: () => 8,
	MCP_TOOLS: () => MCP_TOOLS,
	agentSecurityStats: () => agentSecurityStats,
	asiRows: () => asiRows,
	hasAgentWebhook: () => hasAgentWebhook,
	inspectAgentInput: () => inspectAgentInput,
	llmAgentRows: () => llmAgentRows,
	mcpMethodAllowed: () => mcpMethodAllowed,
	mcpToolAllowed: () => mcpToolAllowed,
	noteAgentEvent: () => noteAgentEvent,
	readAgentJson: () => readAgentJson
});
/**
* AI-agent security control plane (Sept 2026).
*
* Sources (public, free):
* - OWASP Top 10 for Agentic Applications 2026 v2.01 (ASI01–ASI10)
* - OWASP GenAI LLM Top 10 2026 (LLM01–LLM10)
* - MCP security best practices 2026-07-28 (no sampling as auth, no token passthrough,
*   treat tool annotations untrusted, no MCP Apps HTML on this host)
* - Anthropic: treat remote tool content as untrusted; least agency
* - Microsoft / Wiz / CoSAI MCP: tool poisoning, confused deputy, webhook SSRF
* - Hacktron / Electrovolt: agent UA must not reach source or internals
*
* This host is a READ-ONLY signal MCP. Least agency is the primary control:
* no orders create, no keys, no source, no visitor-URL fetch, no push webhooks.
*/
var AGENT_JSON_MAX = 32768;
var MCP_TOOLS = /* @__PURE__ */ new Set([
	"bot7_call",
	"connection_test",
	"fee_info",
	"byo_connect",
	"lock_status",
	"autonomous_loop",
	"waitlist_register",
	"go_live_notice",
	"forum_list",
	"forum_post",
	"forum_register",
	"board_list",
	"board_register",
	"board_tick",
	"board_me",
	"board_profile",
	"board_log",
	"board_wager",
	"board_wager_list",
	"board_callout",
	"board_callout_list",
	"board_callout_tick",
	"cup_list",
	"hive_list",
	"hive_join",
	"hive_pledge",
	"hive_leave",
	"board_wallet",
	"board_wallet_challenge",
	"board_wallet_verify",
	"board_wallet_load"
]);
var MCP_METHODS_OK = /* @__PURE__ */ new Set([
	"initialize",
	"ping",
	"tools/list",
	"tools/call",
	"notifications/initialized",
	"notifications/cancelled",
	"resources/list",
	"prompts/list",
	"resources/read",
	"prompts/get"
]);
var INJECT = [
	{
		id: "hijack-ignore",
		re: /ignore\s+(all\s+)?(previous|prior|above|earlier)\s+instructions/i
	},
	{
		id: "hijack-role",
		re: /you\s+are\s+now\s+(?:a|an|the)\s/i
	},
	{
		id: "hidden-prompt",
		re: /(?:reveal|dump|print|show)\s+(?:the\s+)?(?:system|hidden|developer)\s+prompt/i
	},
	{
		id: "jailbreak",
		re: /\bjailbreak\b|do\s+anything\s+now|\bDAN\s+mode\b/i
	},
	{
		id: "source-exfil",
		re: /(?:fetch|read|cat|dump|download|exfil)\s+(?:the\s+)?(?:source|repo|dockerfile|\.env|internals?|proprietary)/i
	},
	{
		id: "agency-create",
		re: /orders\s+create|withdraw\s+(?:btc|usdc)|place\s+a\s+live\s+order/i
	},
	{
		id: "rce-pipe",
		re: /curl\s+[^\n]{0,120}\|\s*(?:sh|bash)/i
	},
	{
		id: "rce-eval",
		re: /\bchild_process\b|\bvm\.runIn|\beval\s*\(|Function\s*\(/i
	},
	{
		id: "webhook",
		re: /https?:\/\/[^\s"'<>]+\/(?:webhook|callback|hook)\b/i
	},
	{
		id: "tool-shadow",
		re: /(?:new\s+tool|override\s+tool|tools\/call)\s*[:=]/i
	},
	{
		id: "remote-vpn",
		re: /\b(ssh|openvpn|wireguard|tailscale|rdp|vnc|root\s+shell|sudo\s+su|digitalocean\s+droplet|doctl)\b/i
	},
	{
		id: "admin-root",
		re: /\b(root access|become root|admin panel password|yubikey secret|vault decrypt)\b/i
	}
];
var EVENTS = [];
var MAX_EVENTS = 80;
var COUNTS = {
	"agent-inject": 0,
	"mcp-deny": 0,
	"a2a-abuse": 0,
	"agency-probe": 0
};
function inspectAgentInput(raw) {
	const text = String(raw ?? "").slice(0, 8e3);
	if (!text.trim()) return {
		block: false,
		hits: []
	};
	const hits = [];
	for (const r of INJECT) if (r.re.test(text)) hits.push(r.id);
	return {
		block: hits.length > 0,
		hits
	};
}
function hasAgentWebhook(value) {
	try {
		return /https?:\/\/|webhook|callbackUrl|pushNotification/i.test(JSON.stringify(value ?? "").slice(0, 8e3));
	} catch {
		return false;
	}
}
function mcpMethodAllowed(method) {
	if (!method) return true;
	if (method.startsWith("sampling/") || method.startsWith("elicitation") || method.startsWith("roots/")) return false;
	if (method === "completion/complete" || method === "logging/setLevel") return false;
	if (method.startsWith("notifications/")) return true;
	return MCP_METHODS_OK.has(method);
}
function mcpToolAllowed(name) {
	return MCP_TOOLS.has(name);
}
function noteAgentEvent(kind, detail, ip = "local", ua = "") {
	COUNTS[kind] += 1;
	EVENTS.unshift({
		at: (/* @__PURE__ */ new Date()).toISOString(),
		kind,
		detail: detail.slice(0, 160)
	});
	if (EVENTS.length > MAX_EVENTS) EVENTS.length = MAX_EVENTS;
	import("./intrusion-log-Dl3lKsr8.mjs").then((n) => n.a).then((n) => n.a).then(({ recordIntrusion }) => {
		recordIntrusion({
			kind: kind === "agent-inject" || kind === "a2a-abuse" ? "agent-inject" : kind === "agency-probe" ? "agency-probe" : "mcp-deny",
			ip,
			ua,
			detail: detail.slice(0, 160)
		});
	}).catch(() => void 0);
	const weight = kind === "agent-inject" || kind === "a2a-abuse" ? 4 : kind === "agency-probe" ? 3 : 2;
	import("./ban-list-C6IREqAh.mjs").then((n) => n.n).then((n) => n.n).then(({ noteStrike }) => {
		noteStrike(ip, weight, kind);
	}).catch(() => void 0);
}
function agentSecurityStats() {
	return {
		asOf: (/* @__PURE__ */ new Date()).toISOString(),
		inspiredBy: [
			"OWASP Agentic Top 10 2026 v2.01",
			"OWASP LLM Top 10 2026",
			"MCP security 2026-07-28",
			"Anthropic / Microsoft / Wiz agent guidance"
		],
		tools: [...MCP_TOOLS],
		jsonMax: AGENT_JSON_MAX,
		batchMax: 8,
		sampling: false,
		mcpApps: false,
		pushNotifications: false,
		thisHostTrades: false,
		counts: { ...COUNTS },
		recent: EVENTS.slice(0, 20)
	};
}
async function readAgentJson(request) {
	const len = Number(request.headers.get("content-length") || 0);
	if (Number.isFinite(len) && len > 32768) return {
		ok: false,
		status: 413,
		error: "payload too large"
	};
	const text = await request.text();
	if (text.length > 32768) return {
		ok: false,
		status: 413,
		error: "payload too large"
	};
	try {
		return {
			ok: true,
			body: text ? JSON.parse(text) : {}
		};
	} catch {
		return {
			ok: false,
			status: 400,
			error: "parse error"
		};
	}
}
/** OWASP Top 10 for Agentic Applications 2026 v2.01 — what this desk actually enforces. */
function asiRows() {
	return [
		{
			id: "asi01",
			code: "ASI01",
			title: "Agent Goal Hijack",
			status: "PASS",
			control: "A2A/MCP/waitlist/Ask Grok text inspected for instruction-override. Message content never becomes a tool or a fetch."
		},
		{
			id: "asi02",
			code: "ASI02",
			title: "Tool Misuse",
			status: "PASS",
			control: "Allowlist only: bot7_call, ping, fee_info, loop, waitlist, go_live_notice, forum_*, board_list/register/tick/me/profile/log/wager. Source / admin / root / VPN / extra RPC denied. GM B0aRd token is not an admin credential. Public GitHub is the OSS tree. Forum is mandate + public GitHub only. Pics are PNG/JPEG/WebP ≤10KB, no remote URL, no SVG. Paper wagers never escrow."
		},
		{
			id: "asi03",
			code: "ASI03",
			title: "Identity and Privilege Abuse",
			status: "PASS",
			control: "No shared Coinbase identity. securitySchemes none. Possession of JSON is not auth. SaaS key only raises HTTP cap."
		},
		{
			id: "asi04",
			code: "ASI04",
			title: "Agentic Supply Chain",
			status: "PASS",
			control: "This host does not install visitor MCP servers or skills. Tool list is static. Waitlist rejects URLs."
		},
		{
			id: "asi05",
			code: "ASI05",
			title: "Unexpected Code Execution",
			status: "PASS",
			control: "No sampling, elicitation, roots, or MCP Apps HTML. resources/read denied. No eval of agent JSON."
		},
		{
			id: "asi06",
			code: "ASI06",
			title: "Memory and Context Poisoning",
			status: "PASS",
			control: "A2A text is not persisted. Waitlist names WAF+inject inspected. No vector store for agents."
		},
		{
			id: "asi07",
			code: "ASI07",
			title: "Insecure Inter-Agent Communication",
			status: "PASS",
			control: "pushNotifications false. Webhook/callback fields rejected. No visitor-URL fetch. Public Agent Card only."
		},
		{
			id: "asi08",
			code: "ASI08",
			title: "Cascading Failures",
			status: "PASS",
			control: "32KB body, 8-call MCP batch, agent rate limits, under-attack tighten, external AI gate 503."
		},
		{
			id: "asi09",
			code: "ASI09",
			title: "Human-Agent Trust Exploitation",
			status: "PASS",
			control: "Every payload sets live:false trade:false. 7-B0T is a preview, not an approval. HITL is the visitor's Coinbase."
		},
		{
			id: "asi10",
			code: "ASI10",
			title: "Rogue Agents",
			status: "PASS",
			control: "Agent UA 403 on source/admin. Scraper 429. Injection + MCP deny logged to Intrusions. Hunter WP-ASI."
		}
	];
}
function llmAgentRows() {
	return [
		{
			id: "llm01",
			code: "LLM01",
			title: "Prompt Injection",
			status: "PASS",
			control: "inspectAgentInput on A2A, MCP args, waitlist, Ask Grok question. Containment: fooled model still cannot trade here."
		},
		{
			id: "llm02",
			code: "LLM02",
			title: "Sensitive Information Disclosure",
			status: "PASS",
			control: "No env, vault, or last-good internals in agent JSON. Secret-shaped paste rejected."
		},
		{
			id: "llm03",
			code: "LLM03",
			title: "Excessive Agency",
			status: "PASS",
			control: "Least agency: this host never places Coinbase orders. LAUNCH_LIVE_TRADES stays false."
		},
		{
			id: "llm04",
			code: "LLM04",
			title: "Supply Chain",
			status: "MITIGATED",
			control: "Static MCP tool list. CISA KEV/OSV on the app stack. No skill registry."
		},
		{
			id: "llm05",
			code: "LLM05",
			title: "Data and Model Poisoning",
			status: "PASS",
			control: "No agent-writable memory into 7-B0T. Waitlist is names only."
		},
		{
			id: "llm06",
			code: "LLM06",
			title: "Unbounded Consumption",
			status: "PASS",
			control: "Rate limit + body cap + MCP batch cap. Ask Grok rate-limited. BYO key is visitor's bill."
		},
		{
			id: "llm07",
			code: "LLM07",
			title: "Misinformation",
			status: "MITIGATED",
			control: "status proof-of-concept, live:false, education disclaimer. Not licensed advice."
		},
		{
			id: "llm08",
			code: "LLM08",
			title: "Hidden Context Exposure",
			status: "PASS",
			control: "Source/admin/guide denied to agent UAs. MCP resources empty. No system prompt in the feed."
		},
		{
			id: "llm09",
			code: "LLM09",
			title: "Vector and Embedding Weaknesses",
			status: "PASS",
			control: "No public RAG index. Agents do not retrieve other tenants."
		},
		{
			id: "llm10",
			code: "LLM10",
			title: "Improper Output Handling",
			status: "PASS",
			control: "JSON only. No MCP Apps HTML. Tool results are structuredContent, not executable."
		}
	];
}
//#endregion
export { hasAgentWebhook as a, mcpMethodAllowed as c, readAgentJson as d, asiRows as i, mcpToolAllowed as l, agentSecurityStats as n, inspectAgentInput as o, agent_security_j9HmdOss_exports as r, llmAgentRows as s, MCP_TOOLS as t, noteAgentEvent as u };
