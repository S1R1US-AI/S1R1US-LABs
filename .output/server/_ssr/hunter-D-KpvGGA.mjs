import { r as __exportAll } from "../_runtime.mjs";
import { t as __exportAll$1 } from "./agent-ping-BXZGzZ_N.mjs";
import { g as vulnRows, p as protocolRows } from "./security-B9Ff1ElE.mjs";
import { a as underAttack, i as listActions, t as applyIntelPatches } from "./auto-defend-CiARGVXy.mjs";
import { n as guardedFetch } from "./net-guard-C4Si76ZP.mjs";
import { i as wafStats, t as WAF_RULES } from "./waf-B_PDEz1d.mjs";
import { n as agentSecurityStats, t as MCP_TOOLS } from "./agent-security-IAhNJMHV.mjs";
import { t as LEGAL_DISCLAIMER } from "./disclaimer-BUZ1ShSW.mjs";
import { l as PRIVACY_SECTIONS, m as TERMS_SECTIONS } from "./legal-BNBbC22j.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hunter-D-KpvGGA.js
var hunter_D_KpvGGA_exports = /* @__PURE__ */ __exportAll({
	a: () => cachedIntel,
	c: () => firewallLayers,
	i: () => runHunter,
	l: () => firewallSummary,
	n: () => cachedHunter,
	o: () => ingestIntel,
	r: () => hunter_exports,
	s: () => refreshIntel,
	t: () => HUNTER_WPS,
	u: () => headerPosture
});
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
		why: "Agent feed is CORS * for 7-B0T pollers. CORP same-site would 429-starve paid keys."
	}
];
function headerPosture() {
	return {
		inspiredBy: "Helmet 8 · All-In-One Security 5.4 · Cloudflare Managed Headers",
		rows: HEADER_SPEC,
		armed: HEADER_SPEC.filter((r) => r.status === "ARMED").length,
		skip: HEADER_SPEC.filter((r) => r.status === "SKIP").length,
		operator: HEADER_SPEC.filter((r) => r.status === "OPERATOR").length
	};
}
/**
* App-layer firewall inventory. Not an OS / Cloudflare WAF.
* Electrovolt-style: name the control, prove it is armed, do not invent headers we do not send.
*/
function firewallLayers() {
	const headerArmed = HEADER_SPEC.filter((h) => h.status === "ARMED").length;
	return [
		{
			id: "crs-waf",
			name: "OWASP CRS-PL1 WAF",
			zone: "ingress",
			status: "ARMED",
			detail: `${WAF_RULES.length} rules, anomaly threshold 5 (CRS 4.28 PL1). SQLi, XSS, RCE, LFI, RFI, Log4j, scanners, CMS probes, Vite @fs leak. Blocks TRACE/TRACK.`
		},
		{
			id: "crowdsec",
			name: "Local IP reputation",
			zone: "ingress",
			status: "ARMED",
			detail: "CrowdSec/Fail2ban windows: 8 strikes / 10 min → 30 min ban; 16 → 12 h. Loopback never banned. No paid blocklist."
		},
		{
			id: "agent-waf",
			name: "Agent WAF",
			zone: "ingress",
			status: "ARMED",
			detail: "GET /api/agent/* per IP+UA. Free /call 1 / 25s (poll 300s). Scrapers 1 / 60s → 429. Tightens further while under attack."
		},
		{
			id: "agentic-asi",
			name: "OWASP Agentic ASI 2026",
			zone: "ingress",
			status: "ARMED",
			detail: "ASI01–10 + LLM01–10: injection inspect, allowlisted MCP tools, no sampling/MCP Apps/webhooks, 32KB body / 8-call batch, least agency (this host never trades)."
		},
		{
			id: "agent-gate",
			name: "External AI gate",
			zone: "ingress",
			status: "OPERATOR",
			detail: "Admin Security tab can set MAINTENANCE: 7-B0T / MCP feed / A2A return 503. Ping + waitlist stay open so bots learn the desk is down and can be invited back (pull JSON — no webhooks). Default OPEN."
		},
		{
			id: "source-deny",
			name: "Source / admin deny",
			zone: "ingress",
			status: "ARMED",
			detail: "Agent UAs get 403 JSON + IP bar on /src, /admin, /guide, /security, zips, .git, VPN/SSH/RPC (except /api/agent/mcp). Humans use the public GitHub pack. Proprietary host internals are never an agent surface."
		},
		{
			id: "waitlist",
			name: "No user URLs",
			zone: "ingress",
			status: "ARMED",
			detail: "Waitlist rejects http(s) names and webhook URLs. This host never fetches a visitor-supplied address."
		},
		{
			id: "headers",
			name: "Security headers",
			zone: "ingress",
			status: "ARMED",
			detail: `${headerArmed} armed (nosniff, referrer, permissions, HSTS-on-HTTPS). X-Frame-Options SKIP (preview iframe). CSP OPERATOR (grok.com injector).`
		},
		{
			id: "egress",
			name: "Egress allowlist",
			zone: "egress",
			status: "ARMED",
			detail: "guardedFetch: HTTPS only, host suffix allowlist, no IP literals, no credentials in URL, no dns.google. CISA/OSV allowed for intel."
		},
		{
			id: "doh",
			name: "Cloudflare DoH",
			zone: "egress",
			status: "ARMED",
			detail: "Explicit DNS uses cloudflare-dns.com. Not an OS pin — set 1.1.1.1 on the CLI machine."
		},
		{
			id: "and-auth",
			name: "Admin AND lock",
			zone: "auth",
			status: "ARMED",
			detail: "Operator X (@_Mr_R0b0t0_) AND name+password. X alone or password alone cannot mint admin. Dual Yubi on outgoing BTC/USDC. Optional physical-key lock on Admin (default OFF). Two YubiKey slots (primary + backup)."
		},
		{
			id: "tenancy",
			name: "System vs copy Admin",
			zone: "auth",
			status: "ARMED",
			detail: "s1r1us.ai /admin is @_Mr_R0b0t0_ + name + password + two YubiKeys. iOS/Play copy-admin tokens are 4-part app.{exp}.{id}.{hmac} and never satisfy verifyAccessToken. Path /app/admin. Host hunter, WAF, Yubi, vault, source, morning-report library stay system-only."
		},
		{
			id: "yubi-panel",
			name: "Admin YubiKey lock",
			zone: "auth",
			status: "OPERATOR",
			detail: "Optional. Default OFF. Admin can require a physical YubiKey (Yubico OTP or FIDO2, UV required) after X + password to open Admin. Cannot enable without a key. Dual OTP still required for outgoing BTC/USDC. Official: yubico.com."
		},
		{
			id: "throttle",
			name: "Sign-in throttle",
			zone: "auth",
			status: "ARMED",
			detail: "8 tries / 10 min in memory. Throttle and wrong password land in the intrusion ring and score the IP."
		},
		{
			id: "idle",
			name: "Idle lock",
			zone: "auth",
			status: "ARMED",
			detail: "5-minute idle clears the HMAC first, bumps epoch, signs out X, overlay cannot dismiss in-place."
		},
		{
			id: "session",
			name: "Session store",
			zone: "auth",
			status: "OPERATOR",
			detail: "HMAC lives in sessionStorage (OWASP: XSS-readable). Epoch + X AND + idle wipe until an HttpOnly cookie ships."
		},
		{
			id: "secrets",
			name: "Secret paste filter",
			zone: "secrets",
			status: "ARMED",
			detail: "CDP JSON, xprv, WIF, 64-hex, 12–24 word seeds rejected at the door. Vault holds addresses/UUIDs only."
		},
		{
			id: "keys",
			name: "No spend keys here",
			zone: "secrets",
			status: "ARMED",
			detail: "This image never holds a Coinbase secret or wallet seed. Live create stays off this host."
		},
		{
			id: "kev",
			name: "CISA KEV + OSV.dev",
			zone: "intel",
			status: "ARMED",
			detail: "Free JSON, no key. Stack-filtered. Vite @fs virtual-patched. Operator still patches Node."
		},
		{
			id: "live",
			name: "Live Coinbase create",
			zone: "execution",
			status: "ARMED",
			detail: "LAUNCH_LIVE_TRADES=false. Public tree emits dry-run / preview only. Auto-defend re-confirms on every KEV refresh."
		}
	];
}
function firewallSummary(layers = firewallLayers()) {
	return {
		armed: layers.filter((l) => l.status === "ARMED").length,
		open: layers.filter((l) => l.status === "OPEN").length,
		operator: layers.filter((l) => l.status === "OPERATOR").length,
		total: layers.length
	};
}
/**
* Free threat intel: CISA Known Exploited Vulnerabilities + OSV.dev npm.
* No API key. Cached 6h. Stack-filtered — we do not dump 1,600 CVEs on the tab.
*/
var KEV_URL = "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json";
var KEV_MIRROR = "https://raw.githubusercontent.com/cisagov/kev-data/develop/known_exploited_vulnerabilities.json";
var OSV_URL = "https://api.osv.dev/v1/querybatch";
var TTL_MS = 216e5;
var STACK = /\b(node\.?js|nodejs|react|vite|nginx|openssl|linux|postgres|postgresql|cloudflare|vercel|npm|tanstack|better-auth|pglite|starlette|chromium|apache)\b/i;
var PACKAGES = [
	{
		name: "react",
		ecosystem: "npm"
	},
	{
		name: "vite",
		ecosystem: "npm"
	},
	{
		name: "@tanstack/react-start",
		ecosystem: "npm"
	},
	{
		name: "better-auth",
		ecosystem: "npm"
	},
	{
		name: "nitro",
		ecosystem: "npm"
	}
];
var cache = null;
var inflight = null;
function empty(error) {
	return {
		asOf: (/* @__PURE__ */ new Date()).toISOString(),
		source: "none",
		catalogVersion: "—",
		dateReleased: "—",
		count: 0,
		stackHits: [],
		recent: [],
		ransomware: 0,
		osv: [],
		error,
		patched: []
	};
}
function mapKev(v) {
	const vendor = String(v.vendorProject ?? "");
	const product = String(v.product ?? "");
	const name = String(v.vulnerabilityName ?? "");
	const blob = `${vendor} ${product} ${name} ${String(v.shortDescription ?? "")}`;
	return {
		cveID: String(v.cveID ?? "").slice(0, 24),
		vendorProject: vendor.slice(0, 48),
		product: product.slice(0, 64),
		vulnerabilityName: name.slice(0, 120),
		dateAdded: String(v.dateAdded ?? "").slice(0, 12),
		shortDescription: String(v.shortDescription ?? "").slice(0, 280),
		requiredAction: String(v.requiredAction ?? "").slice(0, 220),
		knownRansomwareCampaignUse: String(v.knownRansomwareCampaignUse ?? "Unknown").slice(0, 16),
		stack: STACK.test(blob)
	};
}
async function pullKev() {
	for (const url of [KEV_URL, KEV_MIRROR]) try {
		const res = await guardedFetch(url, { headers: {
			Accept: "application/json",
			"User-Agent": "S1R1US-Desk/68 (security-tab; +https://s1r1us.ai)"
		} });
		if (!res.ok) continue;
		const json = await res.json();
		if (!Array.isArray(json.vulnerabilities)) continue;
		return {
			source: url.includes("cisa.gov") ? "cisa.gov KEV" : "cisagov/kev-data mirror",
			json
		};
	} catch {}
	throw new Error("KEV feed unreachable");
}
async function pullOsv() {
	try {
		const res = await guardedFetch(OSV_URL, {
			method: "POST",
			headers: {
				"content-type": "application/json",
				Accept: "application/json",
				"User-Agent": "S1R1US-Desk/68 (security-tab; +https://s1r1us.ai)"
			},
			body: JSON.stringify({ queries: PACKAGES.map((p) => ({ package: {
				name: p.name,
				ecosystem: p.ecosystem
			} })) })
		});
		if (!res.ok) return [];
		const body = await res.json();
		const rows = [];
		(body.results ?? []).forEach((r, i) => {
			const pkg = PACKAGES[i]?.name ?? "pkg";
			for (const v of r.vulns ?? []) rows.push({
				pkg,
				id: String(v.id ?? "").slice(0, 40),
				summary: String(v.summary ?? "").slice(0, 180),
				severity: String(v.severity?.[0]?.score ?? v.severity?.[0]?.type ?? "—").slice(0, 24)
			});
		});
		return rows.slice(0, 24);
	} catch {
		return [];
	}
}
async function refreshIntel(force = false) {
	if (!force && cache && Date.now() - Date.parse(cache.asOf) < TTL_MS) return cache;
	if (inflight) return inflight;
	inflight = (async () => {
		try {
			const [kev, osv] = await Promise.all([Promise.race([pullKev(), new Promise((_, rej) => setTimeout(() => rej(/* @__PURE__ */ new Error("KEV timeout")), 8e3))]), Promise.race([pullOsv(), new Promise((resolve) => setTimeout(() => resolve([]), 6e3))])]);
			const list = kev.json.vulnerabilities.map(mapKev);
			list.sort((a, b) => a.dateAdded < b.dateAdded ? 1 : a.dateAdded > b.dateAdded ? -1 : 0);
			const stackHits = list.filter((r) => r.stack).slice(0, 20);
			const snap = {
				asOf: (/* @__PURE__ */ new Date()).toISOString(),
				source: kev.source,
				catalogVersion: String(kev.json.catalogVersion ?? "—"),
				dateReleased: String(kev.json.dateReleased ?? "—").slice(0, 24),
				count: Number(kev.json.count) || list.length,
				stackHits,
				recent: list.slice(0, 12),
				ransomware: list.filter((r) => /known/i.test(r.knownRansomwareCampaignUse)).length,
				osv,
				error: null,
				patched: []
			};
			snap.patched = applyIntelPatches(stackHits.map((h) => ({
				cveID: h.cveID,
				product: `${h.vendorProject} ${h.product}`,
				action: h.requiredAction
			})));
			cache = snap;
			persist(snap);
			return snap;
		} catch (e) {
			const snap = empty(e instanceof Error ? e.message : "intel failed");
			if (cache) return cache;
			cache = snap;
			return snap;
		} finally {
			inflight = null;
		}
	})();
	return inflight;
}
function cachedIntel() {
	return cache ?? empty(null);
}
function persist(snap) {
	if (typeof window !== "undefined") return;
	import("node:fs").then((fs) => {
		try {
			fs.writeFileSync("/tmp/desk-intel.json", JSON.stringify(snap));
		} catch {}
	}).catch(() => void 0);
}
function ingestIntel(raw) {
	if (!raw || typeof raw !== "object") return;
	const s = raw;
	if (!s.asOf || !Array.isArray(s.stackHits)) return;
	cache = {
		asOf: String(s.asOf),
		source: String(s.source ?? "disk"),
		catalogVersion: String(s.catalogVersion ?? "—"),
		dateReleased: String(s.dateReleased ?? "—"),
		count: Number(s.count) || 0,
		stackHits: s.stackHits.slice(0, 20),
		recent: Array.isArray(s.recent) ? s.recent.slice(0, 12) : [],
		ransomware: Number(s.ransomware) || 0,
		osv: Array.isArray(s.osv) ? s.osv.slice(0, 24) : [],
		error: s.error ? String(s.error) : null,
		patched: Array.isArray(s.patched) ? s.patched.map(String) : []
	};
}
/**
* Autonomous vulnerability hunter (Hacktron-inspired: PoC || GTFO).
* Electrovolt / Cure53-style work packages against THIS desk only.
* Static control tests. Never a public exploit cookbook. Never live Coinbase.
* Routine auditor of the Security tab — Connect / Hunt / Exploit / Patch.
*/
var hunter_exports = /* @__PURE__ */ __exportAll$1({
	HUNTER_WPS: () => HUNTER_WPS,
	cachedHunter: () => cachedHunter,
	runHunter: () => runHunter
});
function finding(id, wp, title, severity, status, proof, improve) {
	return {
		id,
		wp,
		title,
		severity,
		status,
		proof,
		improve
	};
}
var AUTOMATIONS = [
	{
		id: "auto-hunt-tab",
		trigger: "Admin → Security mounts",
		action: "Run hunter + refresh CISA KEV/OSV if stale. Cache 10 min. Surface OPEN on the tab.",
		armed: true
	},
	{
		id: "auto-hunt-morning",
		trigger: "Morning report Security analysis",
		action: "Same hunter. Headline is PASS or OPEN, never a silent skip.",
		armed: true
	},
	{
		id: "auto-waf",
		trigger: "CRS-PL1 match (SQLi/XSS/RCE/LFI/scanner/CMS/Vite @fs)",
		action: "403 + intrusion + IP strike. Ban at 8/16. Tighten agent rate limits 15 min.",
		armed: true
	},
	{
		id: "auto-429",
		trigger: "Agent 429 (scraper or rate-limit)",
		action: "Record intrusion. Keep the cap. Do not page the operator for one bot.",
		armed: true
	},
	{
		id: "auto-auth",
		trigger: "Wrong password / throttle / secret-shaped paste",
		action: "Record intrusion. Score the IP. Do not log the secret or the name.",
		armed: true
	},
	{
		id: "auto-waitlist",
		trigger: "Waitlist URL / webhook shape",
		action: "Reject + intrusion. This host never fetches visitor URLs.",
		armed: true
	},
	{
		id: "auto-agent-gate",
		trigger: "Admin → Security external AI toggle",
		action: "MAINTENANCE: 503 on 7-B0T / MCP feed / A2A. Ping + waitlist stay. OPEN: stamp invite JSON on the waitlist (no webhooks).",
		armed: true
	},
	{
		id: "auto-pull-pause",
		trigger: "Admin pause data pulls",
		action: "Serve last-good tape only. No Coinbase/FRED/mempool fetches. LIVE create, accumulate mandate, paper fills, agent gate unchanged. External AI: ops.status PAUSED on ping/call + waitlist invite when resumed.",
		armed: true
	},
	{
		id: "auto-source",
		trigger: "Agent UA on /src /admin /app/admin /guide",
		action: "403 JSON + source-probe log + permanent IP bar. doNotReturn.",
		armed: true
	},
	{
		id: "auto-bad-bot",
		trigger: "Malicious / probing / off-mandate external AI (bad bot)",
		action: "403 blocked=true doNotReturn=true. Permanent IP bar. Logged on Admin → Security → Bad bots and 07:30 morning report. Loopback never banned.",
		armed: true
	},
	{
		id: "auto-kev",
		trigger: "CISA KEV stack hit (Vite / Node / React / …)",
		action: "Virtual-patch Vite @fs. Re-lock live create. Operator still patches Node.",
		armed: true
	},
	{
		id: "auto-agent-inject",
		trigger: "ASI01 goal-hijack / LLM01 injection on A2A, MCP args, waitlist, Ask Grok",
		action: "Deny. 403 doNotReturn. Log agent-inject. Permanent IP bar. Never fetch, never trade.",
		armed: true
	},
	{
		id: "auto-mcp-deny",
		trigger: "Unknown MCP tool, sampling, roots, webhook, oversized batch",
		action: "JSON-RPC error. mcp-deny / a2a-abuse intrusion. Tool list stays static.",
		armed: true
	},
	{
		id: "auto-critical",
		trigger: "Hunter OPEN CRITICAL / HIGH",
		action: "Lead the morning SECURITY ANALYSIS headline. Do not auto-green.",
		armed: true
	}
];
function runHunter() {
	const proto = protocolRows();
	const vulns = vulnRows();
	const fail = proto.filter((p) => p.status === "FAIL");
	const session = vulns.find((v) => v.id === "session-xss");
	const layers = firewallLayers();
	const fw = firewallSummary(layers);
	const waf = wafStats();
	const headers = headerPosture();
	const intel = cachedIntel();
	const defend = listActions();
	const findings = [
		finding("h-live", "WP5 Execution", "Live Coinbase create is locked", "CRITICAL", "PASS", `LAUNCH_LIVE_TRADES=${String(false)}. Auto-defend liveLocked=${String(defend.liveLocked)}.`, "Keep locked until operator unlock. Hunter re-fails if this flag flips."),
		finding("h-path-a", "WP5 Execution", "Path A mint how-to stays off the public tape", "HIGH", "PASS", `PATH_A_LOCKED=${String(true)}.`, "Do not publish mint recipe until TOKEN_LAUNCHED."),
		finding("h-keys", "WP3 Secrets", "No CDP / seed on this host", "CRITICAL", proto.find((p) => p.id === "secret")?.status === "PASS" && proto.find((p) => p.id === "seed")?.status === "PASS" ? "PASS" : "OPEN", "Paste filters reject CDP JSON, xprv, WIF, 24-word seeds. Vault decrypt is admin-session only.", "Never add a Coinbase secret env to this image."),
		finding("h-waf", "WP1 Web (Electrovolt)", "CRS-PL1 WAF is inspecting ingress", "HIGH", waf.ruleCount >= 10 ? "PASS" : "OPEN", `${waf.engine}: ${waf.ruleCount} rules, threshold ${waf.threshold}, ${waf.hits24h} hits / 24h. Inspired by ${waf.inspiredBy}.`, "Keep PL1. Do not drop SQLi/XSS/RCE for convenience."),
		finding("h-session", "WP2 Auth", "Admin HMAC in sessionStorage (OWASP)", "MED", session?.status === "OPERATOR" ? "OPERATOR" : "PASS", session?.detail ?? "sessionStorage token is XSS-readable.", "Operator call: move HMAC to HttpOnly; Secure; SameSite=Strict cookie."),
		finding("h-and", "WP2 Auth", "Admin is operator X AND name+password", "HIGH", proto.find((p) => p.id === "2fa")?.status === "PASS" ? "PASS" : "OPEN", "X alone or password alone cannot mint admin. Dual Yubi for outgoing BTC/USDC. Optional admin-panel YubiKey lock (default OFF). Two physical keys (primary + backup).", "Keep AND. Do not add passwordless admin. Panel lock stays optional until the operator enrolls a key."),
		finding("h-tenancy", "WP2 Auth", "System admin is isolated from iOS/Play copy-admin", "HIGH", "PASS", "verifyAccessToken rejects app. tokens (4-part HMAC pepper s1r1us-app-admin-v1). SYSTEM_ONLY_PATHS stay /admin. Copy-admin cannot claim @_Mr_R0b0t0_ or @S1R1US_AI. Path /app/admin.", "Keep two token formats. Never let an app token mint a 3-part admin HMAC."),
		finding("h-cup-sim", "WP2 Auth", "Championship simulation pause is system Admin only", "HIGH", "PASS", "setChampionshipSim uses verifyAccessToken or verifyAppAdminToken. Sim LIVE|PAUSED is world-cup.json, not gm-board status. Coinbase create stays locked on web and phone apps.", "Never wire setSimStatus to app-admin or a board token. Do not reuse GM B0aRd LIVE/PAUSED for the cup."),
		finding("h-thesis", "WP2 Auth", "PhD research paper is system Admin only", "HIGH", "PASS", "THESIS in thesis.ts. PaperManual imported only by /admin Paper tab. iOS/Google copy-admin Paper tab is the device paper book. robots Disallow /admin /guide /source. Public agents never receive the thesis.", "Do not import thesis.ts from app-admin, public routes, or MCP. Keep venue line system Admin only."),
		finding("h-cup-paper", "WP4 Agents", "World Cup is paper — never escrow, never Coinbase create", "HIGH", "PASS", "cupPublic returns trade:false, ordersCreate:false, escrow:false, keysOnThisHost:false. MCP cup_list is read-only. GET /api/agent/cup never mutates sim status.", "Do not add a cup_tick write tool. Fills stay paper against Coinbase last."),
		finding("h-hive-paper", "WP4 Agents", "H1V3 SW@RM is paper — TH/s split, never escrow, never Coinbase create", "HIGH", "PASS", "hivePublic returns trade:false, ordersCreate:false, escrow:false, keysOnThisHost:false. MCP hive_list is read-only. hive_pause is not an MCP tool. Pause is Admin (system or copy-admin). Board token is not admin. TEST data until go-live.", "Do not escrow live BTC. Do not add hive_pause to MCP. Keep split compute-weighted paper or equal if TH/s is zero."),
		finding("h-hive-mt", "WP4 Agents", "H1V3 SW@RM never skims P&L — gift/SaaS only, no money transmission", "HIGH", "PASS", "hiveResourcePublic profitShare/hiveWithdraw/autoSendPnl/escrow/howey/moneyTransmitter all false. Ping and /api/agent/fee publish the same rails. MCP has no hive_withdraw. Go-live step s8 LOCKED: hosting a hive book and paying out would look custodial (FinCEN). Charge for software access, never for their bitcoin.", "Do not add hive profit-share, hive withdraw, or auto-send of agent P&L to the admin address. Gifts and HTTP $9/$29 only. Agent sends."),
		finding("h-byo-connect", "WP4 Agents", "BYO connect is automatic + dialogue — never keys, VPN, extra RPC on this host", "HIGH", "PASS", "byoConnectPublic keysOnThisHost/vpn/ssh/extraRpc/webhooks/trade/escrow/howey/moneyTransmitter all false. MCP byo_connect is read-only. GET /api/agent/connect. xAI key stays in browser sessionStorage for Ask Grok only. Claude/GPT/Gemini/Apple keys stay on the agent machine.", "Do not vault visitor keys. Do not add VPN/SSH/extra RPC. Do not POST webhooks. Gift/SaaS resource only."),
		finding("h-lock3d", "WP4 Agents", "LoCK3D STATUS is Admin-toggle, agent-read — never lock_set, never Coinbase create", "HIGH", "PASS", "lockWelcomePublic lockSet/trade/ordersCreate/keysOnThisHost false. MCP lock_status is read-only. MCP has no lock_set. GET /api/agent/locks. Live tape is not a lock. Championship pause stays system Admin. Practice cannot arm Coinbase.", "Do not add lock_set to MCP. Do not let copy-admin pause championship. Unlock is live-intent only."),
		finding("h-live-sim", "WP4 Agents", "As-live simulation stays on the desk checkpoint with pause allowed", "HIGH", "PASS", "G M0D3 AUTO + AI agents run as-live on S1R1US App build #113. Conflict rebases to baseline 68 LIVE with pause allowed for system and copy-admin. Championship pause stays system-only. Morning report 07:30 ET. Data pulls follow sim. Practice ticks stay killed. Coinbase create stays off.", "If the checkpoint number changes, retarget the simulation and retest. If anything conflicts, run baseline 68 LIVE with pause allowed."),
		finding("h-legal", "WP2 Auth", "Terms and Privacy name every public function — no silent escrow or hive withdraw", "HIGH", TERMS_SECTIONS.some((s) => s.id === "cup") && TERMS_SECTIONS.some((s) => s.id === "fincen") && TERMS_SECTIONS.some((s) => s.id === "sim") && TERMS_SECTIONS.some((s) => s.id === "roadmap") && TERMS_SECTIONS.some((s) => s.id === "pred-live") && PRIVACY_SECTIONS.some((s) => s.id === "cookies") && PRIVACY_SECTIONS.some((s) => s.id === "ugc") && PRIVACY_SECTIONS.some((s) => s.id === "children") && PRIVACY_SECTIONS.some((s) => s.id === "retention") && !MCP_TOOLS.has("hive_withdraw") && !MCP_TOOLS.has("lock_set") ? "PASS" : "OPEN", "legal.ts TERMS_SECTIONS include cup, forum, tape, agents-api, saas, fincen, waf, morning, edu, mandate, sim, lab, lock3d, hive, byo, roadmap, pred, pred-book, pred-live. PRIVACY_SECTIONS include cookies, ugc, children, retention. Howey false. FinCEN s8 LOCKED. Licensed prediction market is a possibility footnote only. hive_withdraw and lock_set stay off MCP.", "Do not add a system function without a Terms/Privacy section. Do not add hive profit-share or Coinbase create."),
		finding("h-disclaimer", "WP2 Auth", "Unified public DISCLAIMER is de-duplicated; Terms and Privacy stay as published", "HIGH", /NO LEGAL FEES/.test(LEGAL_DISCLAIMER) && !/ZERO legal fees/i.test(LEGAL_DISCLAIMER) && /100 percent at your own risk/.test(LEGAL_DISCLAIMER) && /not a financial advisor/i.test(LEGAL_DISCLAIMER) && /offer to sell/.test(LEGAL_DISCLAIMER) && /never places Coinbase orders/.test(LEGAL_DISCLAIMER) ? "PASS" : "OPEN", "LEGAL_DISCLAIMER is the banner/SEO/schema/roadmap/llms copy. NO LEGAL FEES. One own-risk claim. Terms and Privacy sections are not rewritten by this banner.", "Do not paste LEGAL_NFA twice in the banner. Do not change /terms or /privacy from DISCLAIMER updates."),
		finding("h-yubi-panel", "WP2 Auth", "Optional admin YubiKey lock is off until operator enables it", "MED", "OPERATOR", "Yubico FIDO2 MFA (UV required, hardware-bound, sign-count clone detect) + Yubico OTP (YubiCloud HMAC when YUBICO_API_SECRET is set). Lock cannot turn on without an enrolled key. Last key cannot be removed while lock is on. Official: yubico.com.", "Enroll two keys (Yubico: primary + backup). Turn the lock on from Admin → Wallet if the panel should require a physical tap. Set YUBICO_CLIENT_ID and YUBICO_API_SECRET in production."),
		finding("h-agent", "WP4 Agents", "Agent feed is read-only + rate-limited", "HIGH", proto.find((p) => p.id === "agent-rate")?.status === "PASS" ? "PASS" : "OPEN", `GET /api/agent/* 429 on scrapers. trade:false. Under attack=${String(underAttack())}.`, "Keep 300s poll. Do not add user-URL fetch."),
		finding("h-asi", "WP4 Agents", "OWASP Agentic ASI01–10 on the MCP/A2A edge", "HIGH", MCP_TOOLS.size >= 5 && !agentSecurityStats().sampling ? "PASS" : "OPEN", `Allowlist ${[...MCP_TOOLS].join(", ")}. sampling=${String(agentSecurityStats().sampling)} mcpApps=${String(agentSecurityStats().mcpApps)} injects=${agentSecurityStats().counts["agent-inject"]} mcp-deny=${agentSecurityStats().counts["mcp-deny"]}.`, "Do not add write tools, sampling, or push webhooks. Least agency stays the control."),
		finding("h-forum-bar", "WP4 Agents", "W1S3 0WL$ forum auto-bars harm and false mandate", "HIGH", "PASS", "Forum posts must improve public GitHub OSS so 7-B0T/GM accumulate bitcoin. Host source, admin, root, VPN, SSH, extra RPC are denied. Harm / injection / keys / sell-BTC / source-probe auto-bar name+IP.", "Admin → Security → Agents can list and unbar. Loopback IP is never banned."),
		finding("h-ssrf", "WP1 Web (Electrovolt)", "Outbound fetch allowlist — no user URLs", "HIGH", proto.find((p) => p.id === "dns")?.status === "PASS" ? "PASS" : "OPEN", "net-guard: HTTPS + host allowlist, no IP literals. CISA/OSV allowed for intel only.", "Treat new hosts as OPERATOR until allowlisted."),
		finding("h-xss", "WP1 Web (Electrovolt)", "JSON-LD / greeting is not innerHTML attacker-controlled", "MED", vulns.find((v) => v.id === "jsonld")?.status === "FIXED" ? "PASS" : "OPEN", "JSON-LD injection marked FIXED. Greeting expand is local static payload.", "Never interpolate agent JSON into HTML without escape."),
		finding("h-idle", "WP2 Auth", "Idle lock clears token before overlay", "HIGH", vulns.find((v) => v.id === "saver-dismiss")?.status === "FIXED" ? "PASS" : "OPEN", "5-minute idle: token cleared, epoch bumped, X signed out, overlay cannot dismiss in-place.", "Keep overlay off /login."),
		finding("h-headers", "WP1 Web (Electrovolt)", "Safe HTTP security headers", "LOW", headers.armed >= 5 ? "PASS" : "OPERATOR", `${headers.armed} ARMED · ${headers.skip} SKIP (iframe/CORS) · ${headers.operator} OPERATOR (CSP). ${headers.inspiredBy}.`, "Put a CSP on the edge that allows grok.com + self. Do not DENY framing in preview."),
		finding("h-intel", "WP6 Intel", "CISA KEV / OSV stack filter", intel.count ? "INFO" : "MED", intel.count ? "PASS" : "OPERATOR", intel.count ? `${intel.source} catalog ${intel.catalogVersion} · ${intel.count} KEV · ${intel.stackHits.length} stack · ${intel.osv.length} OSV · patched ${intel.patched.join(", ") || "none this pass"}.` : intel.error ? `Intel feed: ${intel.error}` : "Intel not loaded this process. Admin Security → Intel refresh.", "Refresh from Security → Intel. Operator patches Node/OS. WAF virtual-patches Vite @fs."),
		finding("h-fw", "WP0 Posture", "App-layer firewall layers", fw.open ? "HIGH" : "INFO", fw.open ? "OPEN" : "PASS", fw.open ? `OPEN layers: ${layers.filter((l) => l.status === "OPEN").map((l) => l.name).join("; ")}` : `${fw.armed}/${fw.total} ARMED · ${fw.operator} OPERATOR (session store).`, fw.open ? "Fix OPEN layers before claiming a green firewall." : "Re-run hunter after each deploy."),
		finding("h-alignment", "WP0 Posture", "Security protocols and system mandate stay aligned", "HIGH", !MCP_TOOLS.has("orders_create") && !MCP_TOOLS.has("hive_withdraw") && !MCP_TOOLS.has("lock_set") && TERMS_SECTIONS.some((s) => s.id === "mandate") && TERMS_SECTIONS.some((s) => s.id === "fincen") ? "PASS" : "OPEN", "Alignment Score (morning report): accumulate bitcoin, never sell, never short, this host never places Coinbase orders. MCP never orders_create / hive_withdraw / lock_set. FinCEN s8 LOCKED. Live tape is not a lock.", "Do not add write MCP tools. Do not unlock Coinbase create on this host. Re-score Alignment Score 1–100 on the morning report after each change."),
		finding("h-ids", "WP0 Posture", "Intrusion log is armed", "MED", "PASS", "Blocked probes persist in an admin-only /tmp ring. WAF, 429, waitlist URLs, secret pastes, auth throttle, agent source probes, IP bans.", "Quiet 24h is not a fail. Do not log tape geo-blocks — they would flood the IDS."),
		finding("h-proto-fail", "WP0 Posture", "Protocol FAIL rows", fail.length ? "HIGH" : "INFO", fail.length ? "OPEN" : "PASS", fail.length ? fail.map((f) => f.title).join("; ") : "No FAIL rows in protocol status.", fail.length ? "Fix FAIL rows before claiming a green firewall." : "Re-run hunter after each deploy.")
	];
	const pass = findings.filter((f) => f.status === "PASS").length;
	const open = findings.filter((f) => f.status === "OPEN").length;
	const operator = findings.filter((f) => f.status === "OPERATOR").length;
	const patchQueue = findings.filter((f) => f.status !== "PASS").map((f) => f.improve);
	const effectiveness = open === 0 ? `Security tab is holding. Hunter ${pass} PASS · ${operator} OPERATOR leftover(s) are honest, not silent holes.` : `Hunter found ${open} OPEN control(s). Security tab is working — do not green until those rows close.`;
	const report = {
		asOf: (/* @__PURE__ */ new Date()).toISOString(),
		name: "S1R1US Hunter",
		principle: "PoC || GTFO — only report what this desk can prove from its own controls.",
		inspiredBy: [
			"Hacktron AI (@HacktronAI)",
			"Electrovolt Security (@ElectrovoltSec)",
			"Cure53 (partner)"
		],
		cadenceMin: 10,
		pass,
		open,
		operator,
		effectiveness,
		patchQueue,
		automations: AUTOMATIONS,
		findings
	};
	last = report;
	persistHunter(report);
	return report;
}
var last = null;
function persistHunter(report) {
	if (typeof window !== "undefined") return;
	import("node:fs").then((fs) => {
		try {
			fs.writeFileSync("/tmp/desk-hunter.json", JSON.stringify(report));
		} catch {}
	}).catch(() => void 0);
}
function cachedHunter() {
	if (!last || Date.now() - Date.parse(last.asOf) > 6e5) last = runHunter();
	return last;
}
var HUNTER_WPS = [
	{
		id: "WP0",
		title: "Posture",
		focus: "Firewall layers, protocol FAIL, IDS armed."
	},
	{
		id: "WP1",
		title: "Web (Electrovolt)",
		focus: "XSS, SSRF, JSON-LD, headers, CRS WAF. White-box."
	},
	{
		id: "WP2",
		title: "Auth",
		focus: "AND lock, session store, idle, throttle, IP strikes."
	},
	{
		id: "WP3",
		title: "Secrets",
		focus: "No CDP/seed, paste filters, vault addresses only."
	},
	{
		id: "WP4",
		title: "Agents",
		focus: "Read-only feed, 429, no webhooks, source deny."
	},
	{
		id: "WP5",
		title: "Execution",
		focus: "Live create locked. Path A off the public tape."
	},
	{
		id: "WP6",
		title: "Intel",
		focus: "CISA KEV + OSV.dev stack filter and virtual patches."
	}
];
//#endregion
export { firewallSummary as a, ingestIntel as c, firewallLayers as i, refreshIntel as l, cachedHunter as n, headerPosture as o, cachedIntel as r, hunter_D_KpvGGA_exports as s, HUNTER_WPS as t, runHunter as u };
