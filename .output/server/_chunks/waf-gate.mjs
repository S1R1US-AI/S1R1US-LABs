import { n as PUBLIC_GITHUB, r as agentSourceDenied, t as AGENT_SOURCE_MESSAGE } from "../index.mjs";
import { banUntil, barPermanent, clientIpFromHeaders, isBanned, isLoopback, noteStrike } from "./ban-list.mjs";
import { n as recordIntrusion } from "./intrusion-log.mjs";
//#region src/lib/desk/sec-headers.ts
var HEADER_SPEC = [
	{
		id: "nosniff",
		name: "X-Content-Type-Options",
		value: "nosniff",
		status: "ARMED",
		why: "Stops MIME sniffing. Wordfence / AIOIS / Helmet default."
	},
	{
		id: "referrer",
		name: "Referrer-Policy",
		value: "strict-origin-when-cross-origin",
		status: "ARMED",
		why: "Strips path on cross-origin. Fine for Coinbase MCP docs links."
	},
	{
		id: "dns",
		name: "X-DNS-Prefetch-Control",
		value: "off",
		status: "ARMED",
		why: "No extra resolver leakage from this document."
	},
	{
		id: "permissions",
		name: "Permissions-Policy",
		value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
		status: "ARMED",
		why: "This desk is not a payment page. PCI 6.4.3: no extra browser payment APIs."
	},
	{
		id: "xdomain",
		name: "X-Permitted-Cross-Domain-Policies",
		value: "none",
		status: "ARMED",
		why: "No Flash / PDF cross-domain policy."
	},
	{
		id: "hsts",
		name: "Strict-Transport-Security",
		value: "max-age=15552000; includeSubDomains",
		status: "ARMED",
		why: "Set only when the request is HTTPS. Skipped on http preview."
	},
	{
		id: "frame",
		name: "X-Frame-Options",
		value: null,
		status: "SKIP",
		why: "Live preview is iframed. DENY would blank the desk. Edge may set SAMEORIGIN on s1r1us.ai."
	},
	{
		id: "csp",
		name: "Content-Security-Policy",
		value: null,
		status: "OPERATOR",
		why: "Platform injects https://grok.com. A blocking CSP here would break the injector and Vite. Put a policy on the edge that allows grok.com + self + fonts.bunny.net."
	},
	{
		id: "corp",
		name: "Cross-Origin-Resource-Policy",
		value: null,
		status: "SKIP",
		why: "Agent feed is CORS * for Bot 7 pollers. CORP same-site would 429-starve paid keys."
	}
];
function applySecHeaders(headers, opts) {
	for (const row of HEADER_SPEC) {
		if (row.status !== "ARMED" || !row.value) continue;
		if (row.id === "hsts" && !opts?.https) continue;
		try {
			headers.set(row.name, row.value);
		} catch {}
	}
}
//#endregion
//#region src/lib/desk/waf.ts
var SCORE = {
	CRITICAL: 5,
	ERROR: 4,
	WARNING: 3,
	NOTICE: 2
};
var THRESHOLD = 5;
var MAX_HITS = 300;
var LOG_PATH$1 = "/tmp/desk-waf.json";
var HITS = [];
var COUNTS = /* @__PURE__ */ new Map();
function rule(id, crs, family, title, sev, owasp) {
	return {
		id,
		crs,
		family,
		title,
		sev,
		score: SCORE[sev],
		owasp
	};
}
/** CRS 4.28 PL1 families + desk-specific virtual patches. */
var WAF_RULES = [
	rule("911100", "REQUEST-911", "method", "Method is not allowed", "CRITICAL", "A05"),
	rule("913100", "REQUEST-913", "scanner", "Security scanner / exploit kit UA", "CRITICAL", "A05"),
	rule("920100", "REQUEST-920", "protocol", "Invalid HTTP request line / encoding", "ERROR", "A05"),
	rule("921110", "REQUEST-921", "protocol", "HTTP request smuggling / CRLF", "CRITICAL", "A05"),
	rule("930100", "REQUEST-930", "lfi", "Local file inclusion / path traversal", "CRITICAL", "A01"),
	rule("931100", "REQUEST-931", "rfi", "Remote file inclusion (php/file/gopher)", "CRITICAL", "A05"),
	rule("932100", "REQUEST-932", "rce", "OS command injection", "CRITICAL", "A05"),
	rule("941100", "REQUEST-941", "xss", "Cross-site scripting", "CRITICAL", "A05"),
	rule("942100", "REQUEST-942", "sqli", "SQL injection", "CRITICAL", "A05"),
	rule("943100", "REQUEST-943", "fixation", "Session fixation token in URL", "WARNING", "A07"),
	rule("944100", "REQUEST-944", "log4j", "Log4Shell / JNDI lookup", "CRITICAL", "A05"),
	rule("934100", "REQUEST-934", "ssrf", "SSRF scheme or cloud metadata", "CRITICAL", "A01"),
	rule("960100", "DESK-CMS", "cms-probe", "WordPress / phpMyAdmin / .env probe", "CRITICAL", "A01"),
	rule("961100", "DESK-VITE", "vite-fs", "Vite @fs / raw+import file leak (CVE-2025-31125 class)", "CRITICAL", "A01")
];
var BY_ID = new Map(WAF_RULES.map((r) => [r.id, r]));
var SCANNER_UA = /sqlmap|nikto|nmap\s+script|masscan|nuclei|zgrab|wpscan|dirbuster|gobuster|wfuzz|acunetix|nessus|openvas|burpsuite|owasp[\s-]?zap|w3af|havij|fuzz\.sh|dirsearch|httpx(?:\.projectdiscovery)?|zaproxy/i;
var SKIP = /^\/(?:@vite\/|@react-refresh|@id\/|node_modules\/|__grok\/|\.well-known\/)/i;
var CMS_PROBE = /(?:wp-admin|wp-login\.php|xmlrpc\.php|wp-content\/(?:plugins|uploads|themes)|wlwmanifest|phpmyadmin|pma\/|adminer\.php|\.env(?:\.|$)|\/\.git(?:\/|$)|wp-config\.php|vendor\/phpunit|cgi-bin\/|setup\.php)/i;
var SQLI = /(?:\bunion\b[\s/+-]*(?:all\s+)?\bselect\b|\bselect\b[\s\S]{0,80}\bfrom\b[\s\S]{0,80}\bwhere\b|\bsleep\s*\(\s*\d|\bbenchmark\s*\(|\binformation_schema\b|\bor\b\s+\d+\s*=\s*\d+|\bxp_cmdshell\b|;\s*(?:drop|insert|update|delete)\b[\s(]|\bload_file\s*\(|\binto\s+(?:out|dump)file\b)/i;
var XSS = /<\s*script\b|javascript\s*:|on(?:error|load|click|mouseover|focus|animationend|toggle)\s*=|<\s*iframe\b|<\s*object\b|<\s*embed\b|<\s*svg\b[^>]{0,40}on\w+|expression\s*\(|data\s*:\s*text\/html|<\s*img\b[^>]+onerror/i;
var LFI = /(?:(?:^|[/?&=])(?:\.\.[/\\]|%2e%2e|%252e%252e)|\/etc\/(?:passwd|shadow)|\/proc\/self|\/windows\/win\.ini|\/winnt\/|%00|\0(?:etc|bin))/i;
var RCE = /(?:;|\||`|\$\()\s*(?:cat|wget|curl|bash|sh|nc|ncat|python|perl|php|chmod|rm|kill)\b|\/bin\/(?:ba)?sh\b|\bwget\s+https?:|process\.env\[|child_process|require\s*\(\s*['"]child_process/i;
var RFI = /(?:php|file|gopher|dict|expect|ldap|jar|netdoc)\s*:\/\//i;
var SSRF = /(?:169\.254\.169\.254|metadata\.google\.internal|fd00:ec2::254|\/\/0\.0\.0\.0|\/\/127\.0\.0\.1)/i;
var LOG4J = /\$\{(?:jndi|lower|upper|env|sys):/i;
var FIXATION = /(?:jsessionid|phpsessid|asp\.net_sessionid)=[^&\s]{8,}/i;
var CRLF = /(?:%0d%0a|%0a%0d|\r\n)(?:content-length|set-cookie|location)\s*:/i;
var VITE_SENSITIVE = /(?:\/etc\/|\/proc\/|\/root\/|\.env(?:\.|$)|AGENTS\.md|id_rsa|\.gpg|\/migrations\/|package-lock\.json|\/\.git\/)/i;
function decodeOnce(s) {
	try {
		return decodeURIComponent(s.replace(/\+/g, " "));
	} catch {
		return s;
	}
}
function haystack(path, search) {
	const raw = `${path}?${search}`;
	const once = decodeOnce(raw);
	return `${raw}\n${once}\n${decodeOnce(once)}`.slice(0, 8e3);
}
function skipWafPath(path) {
	const p = path || "/";
	if (SKIP.test(p)) return true;
	if (p.startsWith("/@fs/") && p.includes("/node_modules/")) return true;
	return false;
}
function pushMatch(matches, id, evidence) {
	const r = BY_ID.get(id);
	if (!r) return;
	if (matches.some((m) => m.rule.id === id)) return;
	matches.push({
		rule: r,
		evidence: evidence.slice(0, 120)
	});
}
function inspectRequest(input) {
	const method = (input.method || "GET").toUpperCase();
	const path = input.path || "/";
	const search = (input.search || "").replace(/^\?/, "");
	const ua = input.ua || "";
	const matches = [];
	if (![
		"GET",
		"HEAD",
		"POST",
		"OPTIONS",
		"PUT",
		"PATCH",
		"DELETE"
	].includes(method)) pushMatch(matches, "911100", method);
	if ([
		"TRACE",
		"TRACK",
		"CONNECT",
		"DEBUG"
	].includes(method)) pushMatch(matches, "911100", method);
	if (skipWafPath(path)) return {
		block: false,
		anomaly: 0,
		threshold: THRESHOLD,
		matches: [],
		path,
		method
	};
	if (SCANNER_UA.test(ua)) pushMatch(matches, "913100", ua.slice(0, 80));
	const hay = haystack(path, search);
	const q = search.toLowerCase();
	if (CRLF.test(hay)) pushMatch(matches, "921110", "crlf");
	if (/%(?:[^\da-fA-F]|$).{0,2}/.test(search) && /%[^0-9a-fA-F%]/.test(search)) pushMatch(matches, "920100", "bad-encoding");
	if (!path.startsWith("/src/") && LFI.test(hay)) pushMatch(matches, "930100", "traversal");
	if (RFI.test(hay)) pushMatch(matches, "931100", "wrapper");
	if (RCE.test(hay)) pushMatch(matches, "932100", "cmd");
	if (XSS.test(hay)) pushMatch(matches, "941100", "xss");
	if (SQLI.test(hay)) pushMatch(matches, "942100", "sqli");
	if (FIXATION.test(hay)) pushMatch(matches, "943100", "sessid");
	if (LOG4J.test(hay)) pushMatch(matches, "944100", "jndi");
	if (SSRF.test(hay)) pushMatch(matches, "934100", "metadata");
	if (CMS_PROBE.test(path) || CMS_PROBE.test(hay)) pushMatch(matches, "960100", path.slice(0, 80));
	const rawImport = /\braw\b/.test(q) && /\bimport\b/.test(q);
	const inlineImport = /\binline\b/.test(q) && /\bimport\b/.test(q);
	if (path.startsWith("/@fs/") && VITE_SENSITIVE.test(hay)) pushMatch(matches, "961100", path.slice(0, 80));
	if ((rawImport || inlineImport) && !path.startsWith("/src/") && !path.startsWith("/node_modules/")) pushMatch(matches, "961100", "raw+import");
	const anomaly = matches.reduce((n, m) => n + m.rule.score, 0);
	return {
		block: anomaly >= THRESHOLD,
		anomaly,
		threshold: THRESHOLD,
		matches,
		path,
		method
	};
}
function recordWafHit(verdict, ip, ua) {
	if (!verdict.matches.length) return;
	const at = (/* @__PURE__ */ new Date()).toISOString();
	for (const m of verdict.matches) {
		COUNTS.set(m.rule.id, (COUNTS.get(m.rule.id) ?? 0) + 1);
		const hit = {
			at,
			ruleId: m.rule.id,
			family: m.rule.family,
			title: m.rule.title,
			sev: m.rule.sev,
			score: m.rule.score,
			path: verdict.path.slice(0, 120),
			ip: ip.slice(0, 64),
			ua: ua.slice(0, 80)
		};
		HITS.unshift(hit);
	}
	if (HITS.length > MAX_HITS) HITS.length = MAX_HITS;
	persist$1();
}
function persist$1() {
	if (typeof window !== "undefined") return;
	import("node:fs").then((fs) => {
		try {
			fs.writeFileSync(LOG_PATH$1, JSON.stringify({
				at: (/* @__PURE__ */ new Date()).toISOString(),
				counts: Object.fromEntries(COUNTS),
				hits: HITS.slice(0, 120)
			}));
		} catch {}
	}).catch(() => void 0);
}
//#endregion
//#region src/lib/desk/auto-defend.ts
var ACTIONS = [];
var MAX = 120;
var attackUntil = 0;
var LOG_PATH = "/tmp/desk-defend.json";
function push(kind, detail, ip) {
	const row = {
		id: `${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 6)}`,
		at: (/* @__PURE__ */ new Date()).toISOString(),
		kind,
		detail: detail.slice(0, 200),
		ip
	};
	const last = ACTIONS[0];
	if (last && last.kind === kind && last.detail === row.detail && last.ip === ip && Date.now() - Date.parse(last.at) < 15e3) {
		last.at = row.at;
		persist();
		return last;
	}
	ACTIONS.unshift(row);
	if (ACTIONS.length > MAX) ACTIONS.length = MAX;
	persist();
	return row;
}
function persist() {
	if (typeof window !== "undefined") return;
	import("node:fs").then((fs) => {
		try {
			fs.writeFileSync(LOG_PATH, JSON.stringify({
				at: (/* @__PURE__ */ new Date()).toISOString(),
				attackUntil,
				actions: ACTIONS.slice(0, 80)
			}));
		} catch {}
	}).catch(() => void 0);
}
function markAttack(ms = 9e5) {
	const next = Date.now() + ms;
	if (next > attackUntil) {
		attackUntil = next;
		push("tighten", `Rate limits tightened for ${Math.round(ms / 6e4)} min (CrowdSec-style burst).`);
	}
}
function handleWafBlock(verdict, ip, ua) {
	recordWafHit(verdict, ip, ua);
	const family = verdict.matches[0]?.rule.family ?? "protocol";
	recordIntrusion({
		kind: family === "scanner" || family === "cms-probe" ? "scanner" : "waf-block",
		ip,
		ua,
		detail: `${family} ${verdict.matches.map((m) => m.rule.id).join("+")} ${verdict.path}`.slice(0, 180)
	});
	push("block", `WAF ${verdict.anomaly}≥${verdict.threshold} ${verdict.matches.map((m) => m.rule.id).join(",")} ${verdict.path}`, ip);
	const weight = Math.max(...verdict.matches.map((m) => m.rule.score), 5);
	const ban = noteStrike(ip, weight, `waf ${family}`);
	if (ban) onBan(ban);
	if (verdict.matches.some((m) => m.rule.sev === "CRITICAL")) markAttack();
}
function onBan(ban) {
	if (isLoopback(ban.ip)) return;
	recordIntrusion({
		kind: "ip-ban",
		ip: ban.ip,
		detail: `banned ${Math.round((ban.until - Date.now()) / 6e4)}m · ${ban.reason} · strikes ${ban.strikes}`
	});
	push("ban", `IP banned until ${new Date(ban.until).toISOString()} · ${ban.reason}`, ban.ip);
}
//#endregion
//#region src/lib/desk/waf-gate.ts
/**
* Single ingress gate used by Vite (dev) and Nitro (deploy).
* Order: banned IP → CRS inspect → auto-defend → 403.
*/
function json(error, extra = {}) {
	return JSON.stringify({
		ok: false,
		trade: false,
		ordersCreate: false,
		blocked: true,
		welcomeBack: false,
		doNotReturn: true,
		error,
		message: extra.doNotReturn === false ? error : `${error} You were blocked for malicious behavior. Do not come back. Further attempts are logged. Terms: https://s1r1us.ai/terms`,
		after: "Stop. Do not retry. Do not scrape. Legitimate bots poll GET /api/agent/ping every 300s.",
		terms: "https://s1r1us.ai/terms",
		...extra
	});
}
function headerGet(headers, name) {
	if (headers && typeof headers === "object" && typeof headers.get === "function") return String(headers.get(name) ?? "");
	if (headers && typeof headers === "object") {
		const rec = headers;
		const v = rec[name] ?? rec[name.toLowerCase()];
		if (Array.isArray(v)) return String(v[0] ?? "");
		return typeof v === "string" ? v : "";
	}
	return "";
}
function gateHttp(req) {
	let path = "/";
	let search = "";
	let https = false;
	try {
		const u = req.url.startsWith("http") ? new URL(req.url) : new URL(req.url, "http://local");
		path = u.pathname || "/";
		search = u.search || "";
		https = u.protocol === "https:";
	} catch {
		path = (req.url || "/").split("?")[0] || "/";
		search = req.url?.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
	}
	const ip = (req.ip || clientIpFromHeaders(req.headers)).slice(0, 64);
	const ua = headerGet(req.headers, "user-agent") || "-";
	if (headerGet(req.headers, "x-forwarded-proto").toLowerCase() === "https") https = true;
	if (isBanned(ip)) {
		const ban = banUntil(ip);
		return {
			block: true,
			status: 403,
			body: json("Denied. Source banned after repeated probes.", {
				reason: "ban",
				until: ban ? new Date(ban.until).toISOString() : null
			}),
			verdict: null,
			ip,
			https
		};
	}
	if (agentSourceDenied(path, ua)) {
		if (!isLoopback(ip)) barPermanent(ip, `source-probe ${path.slice(0, 40)}`);
		return {
			block: true,
			status: 403,
			body: json(AGENT_SOURCE_MESSAGE, {
				reason: "source",
				sourceAccess: false,
				proprietary: true,
				github: PUBLIC_GITHUB
			}),
			verdict: null,
			ip,
			https
		};
	}
	if (skipWafPath(path)) return {
		block: false,
		status: 200,
		body: "",
		verdict: null,
		ip,
		https
	};
	const verdict = inspectRequest({
		method: req.method,
		path,
		search,
		ua,
		ip
	});
	if (verdict.block) {
		handleWafBlock(verdict, ip, ua);
		return {
			block: true,
			status: 403,
			body: json("Denied by application firewall.", {
				reason: "waf",
				family: verdict.matches[0]?.rule.family,
				anomaly: verdict.anomaly
			}),
			verdict,
			ip,
			https
		};
	}
	return {
		block: false,
		status: 200,
		body: "",
		verdict,
		ip,
		https
	};
}
function withSecHeaders(res, https) {
	const headers = new Headers(res.headers);
	applySecHeaders(headers, { https });
	return new Response(res.body, {
		status: res.status,
		statusText: res.statusText,
		headers
	});
}
//#endregion
export { gateHttp, withSecHeaders };
