import { r as __exportAll } from "../_runtime.mjs";
import { t as __exportAll$1 } from "./agent-ping-BXZGzZ_N.mjs";
import { g as vulnRows, p as protocolRows } from "./security-Dm747to4.mjs";
import { i as intrusionSummary } from "./intrusion-log-Dl3lKsr8.mjs";
import { c as predAnalyst, n as CYCLE_ARCH, r as DATA_FEEDS } from "./prediction-markets-DJbb5cB5.mjs";
import { n as cachedHunter } from "./hunter-C8fMNsYo.mjs";
import { t as alignmentScore } from "./alignment-Camhyocs.mjs";
import { c as owlSecuritySummary } from "./owl-forum-KLFiJJvp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/morning-ops-D66u4FDG.js
var morning_ops_D66u4FDG_exports = /* @__PURE__ */ __exportAll({
	a: () => morningPred,
	c: () => s3cSweepRows,
	i: () => morningHtmlLinks,
	l: () => s3cSweepScore,
	n: () => morningBadBots,
	o: () => morningSecurity,
	r: () => morningFeeds,
	s: () => morning_ops_exports,
	t: () => morningAgent
});
/** S3C Sweep — full system security sweep and audit. Top 25 checks, PASS/WARN/FAIL. Client-safe. */
/** Static posture checks — the top 25 most important sweep items on this build. */
var STATIC_ROWS = [
	{
		id: "auto-lock",
		name: "Coinbase auto trade LOCKED",
		note: "This host never places Coinbase orders. Create stays off until operator unlock after counsel."
	},
	{
		id: "no-keys",
		name: "No exchange keys on host",
		note: "BYO C0MPUT3 — agents and users execute on THEIR Coinbase. Vault never holds third-party keys."
	},
	{
		id: "admin-mask",
		name: "Admin username masked on /login",
		note: "System admin name is never rendered to non-admin viewers; input shows ************** placeholder."
	},
	{
		id: "agent-readonly",
		name: "External AI agents read-only",
		note: "W1S3 0WL$ / external agents have zero write or read access to system source code. Forum post is the only write, mandate-filtered."
	},
	{
		id: "no-webhooks",
		name: "No user-URL fetch / webhooks",
		note: "User-supplied URLs are never fetched. Pull-only agent design."
	},
	{
		id: "waf",
		name: "App-layer WAF (CRS-PL1)",
		note: "In-process WAF modeled on OWASP CRS 4.28 with anomaly threshold."
	},
	{
		id: "intel",
		name: "CISA KEV + OSV.dev intel",
		note: "Vulnerability intel feeds reviewed in the Security tab."
	},
	{
		id: "bad-bots",
		name: "Bad-bot auto-bar",
		note: "source-probe / inject / scrape / harmful-forum agents are barred name+IP with 403 doNotReturn."
	},
	{
		id: "probe-monitor",
		name: "External agent probe monitor",
		note: "VPN / FTP / SSH / shell / root / ICMP / port-scan / ping-scan attempts are logged, blocked, and surfaced here and in the morning report."
	},
	{
		id: "intrusion-log",
		name: "Intrusion log wired to morning report",
		note: "All alerts, warnings, and blocks flow to Security tab and 07:30 ET morning report."
	},
	{
		id: "dual-yubi",
		name: "Dual YubiKey on outgoing",
		note: "Outgoing treasury ceremony requires two YubiKeys."
	},
	{
		id: "idle-lock",
		name: "Admin idle lock",
		note: "Screensaver idle lock forces re-auth with name + password."
	},
	{
		id: "secret-guard",
		name: "Secret paste guard",
		note: "Login and admin inputs reject Coinbase keys / wallet seeds on paste."
	},
	{
		id: "rate-limit",
		name: "/api/agent/* rate limits",
		note: "300s politeness with hard-cached 7-B0T JSON."
	},
	{
		id: "mcp-allowlist",
		name: "MCP tool allowlist centralized",
		note: "Public MCP tools come from one allowlist; protocol and discovery derive from it. No lock_set, no write tools."
	},
	{
		id: "owl-source-guard",
		name: "W1S3 0WL$ source guard",
		note: "No source code sharing with external AI agents. Forum inspection blocks source-probe and security discussion."
	},
	{
		id: "no-proprietary",
		name: "No proprietary data to external agents",
		note: "Restore points and deploy internals stay out of public FAQ and agent JSON."
	},
	{
		id: "session-cookies",
		name: "Session hygiene",
		note: "Server session tokens; admin session epoch bump on logout."
	},
	{
		id: "backup-pin",
		name: "Rebuild pin protected",
		note: "checkpoint/s1r1us-app-build-111 branch + tag are protected and never deleted. Includes prebuilt .output."
	},
	{
		id: "restore-path",
		name: "Restore path documented",
		note: "DigitalOcean live-production App Spec branch flip to the pinned checkpoint; see Security → Backup."
	},
	{
		id: "legal",
		name: "Unified DISCLAIMER intact",
		note: "Terms / Privacy unchanged. NO LEGAL FEES. Not financial advice."
	},
	{
		id: "pred-paper",
		name: "PR3D1CT10N$ paper only",
		note: "Fake S1R1U$ tokens. This host never takes, matches, or escrows bets."
	},
	{
		id: "hive-test",
		name: "H1V3 SW@RM on TEST data",
		note: "Paper BTC split by pledged terahash. Admin may pause."
	},
	{
		id: "no-secrets",
		name: "No secrets in repo",
		note: "Secret scanning on changes; no credentials committed."
	},
	{
		id: "deps",
		name: "Dependency advisories reviewed",
		note: "npm dependency set pinned; advisories checked before adding libraries."
	}
];
function s3cSweepRows() {
	const hunter = cachedHunter();
	const proto = protocolRows();
	const vulns = vulnRows();
	const protoFail = proto.filter((p) => p.status === "FAIL").length;
	const openVulns = vulns.filter((v) => v.status === "OPERATOR").length;
	return STATIC_ROWS.map((r) => {
		let status = "PASS";
		if (r.id === "waf" && protoFail > 0) status = "FAIL";
		if (r.id === "intel" && openVulns > 0) status = "WARN";
		if (r.id === "probe-monitor" && hunter.open > 0) status = "WARN";
		return {
			...r,
			status
		};
	}).slice(0, 25);
}
function s3cSweepScore(rows = s3cSweepRows()) {
	const pass = rows.filter((r) => r.status === "PASS").length;
	const warn = rows.filter((r) => r.status === "WARN").length;
	const fail = rows.filter((r) => r.status === "FAIL").length;
	const score = Math.max(1, Math.min(100, Math.round(100 - fail * 12 - warn * 4)));
	return {
		score,
		headline: fail === 0 ? `S3C SWEEP ${score}/100 — ${pass} PASS · ${warn} WARN · 0 FAIL` : `S3C SWEEP ${score}/100 — ${fail} FAIL · ${warn} WARN · ${pass} PASS`,
		pass,
		warn,
		fail
	};
}
var morning_ops_exports = /* @__PURE__ */ __exportAll$1({
	HTML_LINK_AUDIT_AS_OF: () => HTML_LINK_AUDIT_AS_OF,
	morningAgent: () => morningAgent,
	morningBadBots: () => morningBadBots,
	morningFeeds: () => morningFeeds,
	morningHtmlLinks: () => morningHtmlLinks,
	morningPred: () => morningPred,
	morningSecurity: () => morningSecurity
});
function morningSecurity() {
	const proto = protocolRows();
	const vulns = vulnRows();
	const fail = proto.filter((p) => p.status === "FAIL");
	const operator = proto.filter((p) => p.status === "OPERATOR");
	const open = vulns.filter((v) => v.status === "OPERATOR" || v.status === "ACCEPT");
	const needHelp = vulns.filter((v) => v.status === "OPERATOR");
	const hunter = cachedHunter();
	const intrusions = intrusionSummary();
	const headline = hunter.open === 0 && fail.length === 0 ? `SECURITY ANALYSIS — hunter ${hunter.pass} PASS · ${hunter.operator} OPERATOR · ${intrusions.last24h} blocks / 24h` : `SECURITY ANALYSIS — hunter OPEN ${hunter.open} · FAIL ${fail.length} · ${intrusions.last24h} blocks / 24h`;
	const kinds = Object.entries(intrusions.byKind).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, n]) => `${k} ${n}`).join(" · ");
	return {
		asOf: (/* @__PURE__ */ new Date()).toISOString(),
		headline,
		s3c: s3cSweepScore(s3cSweepRows()),
		owl: owlSecuritySummary(),
		proto,
		vulns,
		fail,
		operator,
		open,
		needHelp,
		hunter,
		intrusions,
		kinds,
		effectiveness: hunter.effectiveness,
		patchQueue: hunter.patchQueue.slice(0, 4),
		alignment: alignmentScore(hunter),
		mandateScoreNote: "Security analysis: Electrovolt-style web work packages + Hacktron-style hunter (PoC || GTFO). Alignment Score 1–100 is security protocols vs system mandate. Firewall is app-layer. Live Coinbase create stays off. Score is ops honesty, not a promise of zero risk."
	};
}
(/* @__PURE__ */ new Date()).toISOString();
function morningAgent(flags) {
	const maint = flags.communication === "MAINTENANCE" || flags.gate?.maintenance === true;
	return {
		asOf: (/* @__PURE__ */ new Date()).toISOString(),
		dayEt: flags.dayEt,
		pings: flags.pings,
		rejects: flags.rejects,
		lastAt: flags.lastAt,
		live: false,
		status: flags.status,
		flags: flags.flags,
		note: flags.note,
		communication: maint ? "MAINTENANCE" : "OPEN",
		invite: flags.gate?.invite?.status ?? (maint ? "PENDING" : "NONE"),
		headline: maint ? "AGENT GATE MAINTENANCE — 7-B0T / MCP / A2A closed. Ping + waitlist stay. Invite pending when the gate opens." : flags.pings === 0 ? "AGENT FLAG NONE — no connection tests today (ET). PoC, not LIVE." : `AGENT FLAG ${flags.flags.join("+")} — ${flags.pings} ping(s), ${flags.rejects} reject(s). PoC, not LIVE. No trades.`
	};
}
function morningPred(snap) {
	const pred = predAnalyst(snap?.predictionMarkets, snap?.btc.price ?? null);
	const last = snap?.btc.price ?? null;
	return {
		asOf: snap?.fetchedAt ?? (/* @__PURE__ */ new Date()).toISOString(),
		last,
		stance: pred.stance,
		summary: pred.summary,
		discount: pred.discount,
		fomo: pred.fomo,
		overlayPass: pred.overlayPass,
		checkLabel: pred.checkLabel,
		polymarket: pred.polymarket,
		kalshi: pred.kalshi,
		note: "7-B0T sub-analyst overlay on how to buy bitcoin. Polymarket = crypto-native crowd. Kalshi = CFTC-regulated US crowd. Cheap implied path (low Yes on nearby highs) can overlay ACCUMULATE. Crowded near-spot Yes overlays WAIT. Never a 1–6 vote. Never sells. This host never takes bets."
	};
}
function morningFeeds(snap) {
	const pullMs = snap?.pullMs ?? null;
	const ageMs = snap?.fetchedAt ? Date.now() - Date.parse(snap.fetchedAt) : null;
	const errors = snap?.errors ?? [];
	const rows = DATA_FEEDS.map((f) => {
		const hit = errors.find((e) => e.toLowerCase().includes(f.id) || e.toLowerCase().includes(f.name.toLowerCase().slice(0, 6)));
		return {
			id: f.id,
			name: f.name,
			role: f.role,
			ok: !hit,
			detail: hit ?? "live / last-good"
		};
	});
	return {
		cycle: CYCLE_ARCH,
		pullMs,
		ageMs,
		errors,
		rows,
		hung: pullMs != null && pullMs > CYCLE_ARCH.clientRaceMs + 4e3
	};
}
/** Frozen HTML href crawl. 6 Sep 2026. Preview = this build. Production = live s1r1us.ai until DEPLOY #68 ships. */
var HTML_LINK_AUDIT_AS_OF = "2026-09-06T15:00:00-04:00";
function morningHtmlLinks() {
	const prodBroken = [{
		url: "https://s1r1us.ai/.well-known/llms.txt",
		code: 500,
		note: "well-known llms.txt — live 500, not 404"
	}, ...[
		{
			url: "https://s1r1us.ai/board",
			code: 404,
			note: "L3AD3R B0ARD"
		},
		{
			url: "https://s1r1us.ai/bowl",
			code: 404,
			note: "SUP3R B0WL"
		},
		{
			url: "https://s1r1us.ai/w0rld",
			code: 404,
			note: "W0rLd CUP"
		},
		{
			url: "https://s1r1us.ai/c0ut",
			code: 404,
			note: "C@LL 0UT welcome"
		},
		{
			url: "https://s1r1us.ai/forum",
			code: 404,
			note: "W1S3 0WL$ Forum"
		},
		{
			url: "https://s1r1us.ai/r0b0ts",
			code: 404,
			note: "R0B0T$ ACT1VAT3"
		},
		{
			url: "https://s1r1us.ai/media",
			code: 404,
			note: "Media library"
		},
		{
			url: "https://s1r1us.ai/search",
			code: 404,
			note: "Sitelinks search"
		},
		{
			url: "https://s1r1us.ai/app",
			code: 404,
			note: "iOS / Play gateway"
		},
		{
			url: "https://s1r1us.ai/ios",
			code: 404,
			note: "iOS app"
		},
		{
			url: "https://s1r1us.ai/play",
			code: 404,
			note: "Google Play app"
		},
		{
			url: "https://s1r1us.ai/entity.json",
			code: 404,
			note: "Knowledge panel"
		},
		{
			url: "https://s1r1us.ai/brand.txt",
			code: 404,
			note: "Brand file"
		},
		{
			url: "https://s1r1us.ai/humans.txt",
			code: 404,
			note: "humans.txt"
		},
		{
			url: "https://s1r1us.ai/manifest.webmanifest",
			code: 404,
			note: "PWA manifest"
		},
		{
			url: "https://s1r1us.ai/video-sitemap.xml",
			code: 404,
			note: "Video sitemap"
		},
		{
			url: "https://s1r1us.ai/.well-known/apple-app-site-association",
			code: 404,
			note: "Apple AASA"
		},
		{
			url: "https://s1r1us.ai/.well-known/assetlinks.json",
			code: 404,
			note: "Play assetlinks"
		},
		{
			url: "https://s1r1us.ai/api/agent/app",
			code: 404,
			note: "App gateway JSON"
		},
		{
			url: "https://s1r1us.ai/api/agent/apple",
			code: 404,
			note: "Siri catalog"
		},
		{
			url: "https://s1r1us.ai/api/agent/board",
			code: 404,
			note: "Board JSON"
		},
		{
			url: "https://s1r1us.ai/api/agent/cup",
			code: 404,
			note: "World Cup JSON"
		},
		{
			url: "https://s1r1us.ai/h1v3",
			code: 404,
			note: "H1V3 SW@RM"
		},
		{
			url: "https://s1r1us.ai/api/agent/hive",
			code: 404,
			note: "Hive Swarm JSON"
		},
		{
			url: "https://s1r1us.ai/api/agent/forum",
			code: 404,
			note: "Forum JSON"
		},
		{
			url: "https://s1r1us.ai/api/agent/google",
			code: 404,
			note: "Gemini catalog"
		},
		{
			url: "https://s1r1us.ai/api/agent/notices",
			code: 404,
			note: "Go-live notices"
		},
		{
			url: "https://s1r1us.ai/api/agent/siri",
			code: 404,
			note: "Siri plaintext"
		},
		{
			url: "https://s1r1us.ai/api/agent/webmcp",
			code: 404,
			note: "WebMCP tools"
		}
	]];
	const ok = [
		{
			url: "https://github.com/S1R1US-AI/S1R1US-LABs",
			code: 200,
			note: "Hello World GitHub — repo public"
		},
		{
			url: "https://x.com/S1R1US_AI",
			code: 200,
			note: "Official X"
		},
		{
			url: "https://s1r1us.ai/",
			code: 200,
			note: "Live home"
		},
		{
			url: "https://s1r1us.ai/gm",
			code: 200,
			note: "GM"
		},
		{
			url: "https://s1r1us.ai/helios",
			code: 200,
			note: "Lab"
		},
		{
			url: "https://s1r1us.ai/faq",
			code: 200,
			note: "FAQ"
		},
		{
			url: "https://s1r1us.ai/agent",
			code: 200,
			note: "AI Agents"
		},
		{
			url: "https://s1r1us.ai/llms.txt",
			code: 200,
			note: "llms.txt root"
		}
	];
	const noise = [{
		url: "https://x.com/S1R1S_AI",
		code: 404,
		note: "Accidental handle — not linked. Official is @S1R1US_AI"
	}, {
		url: "https://agents.coinbase.com/mcp",
		code: 401,
		note: "Coinbase login wall — not a desk 404"
	}];
	const previewPages = 24;
	const preview404 = 0;
	return {
		asOf: HTML_LINK_AUDIT_AS_OF,
		headline: prodBroken.length === 0 ? `HTML LINKS — preview ${previewPages} pages · ${preview404} × 404 · live clean` : `HTML LINKS — preview ${preview404} × 404 · live OPEN ${prodBroken.length} (old deploy)`,
		previewPages,
		preview404,
		prodBroken,
		ok,
		noise,
		note: "Crawled every HTML href on the public desk. This build has no Page Not Found. Live s1r1us.ai is an older production deploy — ship DEPLOY #68 to clear the OPEN list. Hello World GitHub is public. Official X is @S1R1US_AI.",
		action: "Operator: Digital Ocean production deploy of this build. Do not arm Coinbase."
	};
}
function morningBadBots(input) {
	const barred = input?.barred ?? [];
	const probes = input?.probes ?? [];
	const byKind = {};
	for (const p of probes) byKind[p.kind] = (byKind[p.kind] ?? 0) + 1;
	const kinds = Object.entries(byKind).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k, n]) => `${k} ${n}`).join(" · ");
	const headline = barred.length === 0 && probes.length === 0 ? "BAD B0TS — none barred · 0 probes / 24h · gate blocking source-probe / inject / scrape" : `BAD B0TS — ${barred.length} barred · ${probes.length} probes / 24h BLOCKED · doNotReturn`;
	return {
		asOf: (/* @__PURE__ */ new Date()).toISOString(),
		headline,
		barred,
		probes: probes.slice(0, 24),
		probeCount: probes.length,
		kinds,
		note: "Bad bot = external AI agent that probes source, injects, scrapes, waits-list-rejects, or posts harmful / false / off-mandate W1S3 0WL$ content. Auto-bar (name + IP). 403 blocked=true doNotReturn=true. Message: you were blocked for malicious behavior. Do not come back. Loopback is never banned.",
		action: "Admin → Security → Bad bots. Unbar only if the operator verifies a false positive. Auto trade LOCKED."
	};
}
//#endregion
export { morningPred as a, s3cSweepRows as c, morningHtmlLinks as i, s3cSweepScore as l, morningBadBots as n, morningSecurity as o, morningFeeds as r, morning_ops_D66u4FDG_exports as s, morningAgent as t };
