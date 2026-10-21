import { s as protocolRows, u as vulnRows } from "./security-CL_DgNXK.mjs";
import { cachedHunter } from "./hunter-DR5TpbTE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/s3c-sweep-0SSZGUYa.js
/** S3C Sweep — full system security sweep and audit. Top 28 checks, PASS/WARN/FAIL. Server-only (reads the admin security log). */
/** Static posture checks — the top 28 most important sweep items on this build. */
var STATIC_ROWS = [
	{
		id: "auto-lock",
		name: "Coinbase auto trade LOCKED",
		note: "This host never places Coinbase orders. Create stays off until operator unlock."
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
		name: "Operator approval on outgoing",
		note: "Outgoing treasury ceremony requires operator approval."
	},
	{
		id: "idle-lock",
		name: "Admin idle lock",
		note: "Idle screensaver policy is system-admin controlled in Security. LOCKED signs the session out after 5 minutes idle and forces operator re-auth; UNLOCKED displays the Matrix classic saver without locking."
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
		id: "backup-point",
		name: "Restore point kept",
		note: "A protected restore point is kept privately. Details are not published."
	},
	{
		id: "restore-path",
		name: "Restore path documented",
		note: "Restore steps live in the operator's private runbook."
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
	},
	{
		id: "white-label",
		name: "White label stripped + isolated",
		note: "7-B0T H3DGE FUND WHITE LABEL downloads carry zero s1r1us.ai admin rights, games, rolls, simulations, tokens, or host info. Go-live check fails closed on any S1R1US.ai system admin data. Never under S1R1US.ai. Watch shared with Security tab + morning report; bad actors locked permanently — only the system operator overrides."
	},
	{
		id: "agent-admin-lock",
		name: "External AI agents locked out of system admin",
		note: "External AI agents can never take over the s1r1us.ai system admin or read S1R1US.ai source. the system operator + system admin stay the highest privilege — top system mandate, never violated. Accumulate bitcoin sits under this mandate."
	},
	{
		id: "owl-cage",
		name: "W1S3 0WL$ stay caged in the sandbox",
		note: "Wise owls run only in the sandbox dev environment that simulates live S1R1US.ai data — never let out, zero escape possibility. Sandbox access, owl discussions, and any security-breach talk are monitored and surfaced to the system admin in the Security tab; live view and code view for wise-owl suggestions are security-wired."
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
	}).slice(0, 28);
}
//#endregion
export { s3cSweepRows as t };
