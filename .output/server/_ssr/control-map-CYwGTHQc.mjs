//#region node_modules/.nitro/vite/services/ssr/assets/control-map-CYwGTHQc.js
function owaspRows() {
	return [
		{
			id: "a01",
			framework: "OWASP",
			code: "A01",
			title: "Broken Access Control (SSRF folded in)",
			status: "PASS",
			control: "Admin AND lock. Roles. Egress allowlist. No user URLs. WAF SSRF/LFI/CMS probes."
		},
		{
			id: "a02",
			framework: "OWASP",
			code: "A02",
			title: "Security Misconfiguration",
			status: "MITIGATED",
			control: "nosniff / referrer / permissions / HSTS-on-HTTPS. CSP is OPERATOR (grok.com injector). TRACE denied."
		},
		{
			id: "a03",
			framework: "OWASP",
			code: "A03",
			title: "Software Supply Chain Failures",
			status: "OPERATOR",
			control: "OSV.dev query on React/Vite/TanStack/better-auth. CISA KEV stack filter. Operator still patches Node."
		},
		{
			id: "a04",
			framework: "OWASP",
			code: "A04",
			title: "Cryptographic Failures",
			status: "PASS",
			control: "Argon2id admin. AES-256-GCM vault. HMAC sessions. HTTPS egress only."
		},
		{
			id: "a05",
			framework: "OWASP",
			code: "A05",
			title: "Injection",
			status: "PASS",
			control: "CRS-PL1 SQLi/XSS/RCE/SSTI-adjacent. Agent injection inspect (ASI01/LLM01). Parameterized SQL. No innerHTML of agent JSON."
		},
		{
			id: "a06",
			framework: "OWASP",
			code: "A06",
			title: "Insecure Design",
			status: "PASS",
			control: "No spend keys. Dry-run only. Dual Yubi on outgoing. Path A mint firewall."
		},
		{
			id: "a07",
			framework: "OWASP",
			code: "A07",
			title: "Authentication Failures",
			status: "PASS",
			control: "X AND password. Two YubiKeys. Idle wipe. Throttle 8/10m. Fail2ban after 8 strikes. Copy-admin tokens never satisfy verifyAccessToken."
		},
		{
			id: "a08",
			framework: "OWASP",
			code: "A08",
			title: "Software or Data Integrity Failures",
			status: "PASS",
			control: "Snapshots exclude pass.txt. JSON-LD escaped. Tape is server-sourced for Grok."
		},
		{
			id: "a09",
			framework: "OWASP",
			code: "A09",
			title: "Security Logging & Alerting Failures",
			status: "PASS",
			control: "Intrusion ring + WAF hits + auto-defend actions. Morning headline cannot skip OPEN."
		},
		{
			id: "a10",
			framework: "OWASP",
			code: "A10",
			title: "Mishandling of Exceptional Conditions",
			status: "PASS",
			control: "Spinner cap, core/fill split, no auto-green, semaphore misses ≠ host dead."
		}
	];
}
function pciRows() {
	return [
		{
			id: "pci-624",
			framework: "PCI",
			code: "6.2.4",
			title: "Public-facing web apps protected by WAF",
			status: "PASS",
			control: "In-process CRS-PL1 + auto-ban. Not a hardware Fortinet — same requirement class."
		},
		{
			id: "pci-643",
			framework: "PCI",
			code: "6.4.3",
			title: "Inventory of payment-page scripts",
			status: "PASS",
			control: "This host is not a card page. Permissions-Policy payment=(). Donate rails are links, not a PCI checkout."
		},
		{
			id: "pci-83",
			framework: "PCI",
			code: "8.3 / 8.4",
			title: "MFA + strong authentication",
			status: "PASS",
			control: "Operator X + password. Optional YubiKey panel lock (Yubico FIDO2/OTP, default OFF). Dual Yubi on BTC/USDC CLI copy. Argon2id."
		},
		{
			id: "pci-102",
			framework: "PCI",
			code: "10.2",
			title: "Audit logs for access and failures",
			status: "PASS",
			control: "Auth fail, throttle, WAF, source probe, waitlist URL, secret paste, agent-inject, MCP deny — admin-only ring."
		},
		{
			id: "pci-35",
			framework: "PCI",
			code: "3.5 / 4.2",
			title: "Protect stored account data / TLS in transit",
			status: "MITIGATED",
			control: "No PAN/CHD. Vault is addresses/UUIDs. Egress HTTPS. HSTS on HTTPS. Edge TLS is OPERATOR (s1r1us.ai)."
		},
		{
			id: "pci-72",
			framework: "PCI",
			code: "7.2",
			title: "Least privilege",
			status: "PASS",
			control: "Public / fund-user / admin. CDP scopes stay on CLI. This image has no spend key."
		}
	];
}
/** Free 2026 plugin / WAF inventory we actually emulate in-process. */
function pluginInventory() {
	return [
		{
			id: "crs",
			name: "OWASP CRS 4.28.0",
			kind: "WAF ruleset",
			license: "Apache-2.0",
			what: "SQLi, XSS, RCE, LFI, RFI, protocol, scanner. Anomaly threshold 5 (PL1).",
			how: "Ported PL1 signatures in this process. Not a full ModSecurity engine.",
			status: "ARMED"
		},
		{
			id: "modsec",
			name: "OWASP ModSecurity / Coraza",
			kind: "WAF engine",
			license: "Apache-2.0",
			what: "Reference engine for CRS. Coraza is the Go successor.",
			how: "Behavior matched in TypeScript. No native module.",
			status: "ARMED"
		},
		{
			id: "wordfence",
			name: "Wordfence 8.2 (free tier model)",
			kind: "Endpoint firewall + login",
			license: "GPLv3 (plugin)",
			what: "WAF, brute-force, 2FA, malware-style scan, blocklist.",
			how: "Same jobs: CRS WAF, 8/10m throttle, Yubi, hunter, auto-ban. Not the Wordfence binary.",
			status: "ARMED"
		},
		{
			id: "aiois",
			name: "All-In-One Security 5.4",
			kind: "Hardening + firewall",
			license: "GPLv2+",
			what: "Login lockdown, headers, file/firewall rules, strength meter.",
			how: "Idle lock, headers, CMS-probe deny, security tab scores.",
			status: "ARMED"
		},
		{
			id: "kadence",
			name: "Kadence Security 10 (ex-iThemes)",
			kind: "Login hardening",
			license: "GPLv2+",
			what: "2FA, brute-force, user-action log.",
			how: "AND lock + dual Yubi + optional panel FIDO2 + intrusion kinds.",
			status: "ARMED"
		},
		{
			id: "owasp-asi",
			name: "OWASP Agentic Top 10 2026 v2.01",
			kind: "Agent threat taxonomy",
			license: "CC-BY-SA 4.0",
			what: "ASI01–10: goal hijack, tool misuse, identity, supply chain, RCE, memory, A2A, cascade, trust, rogue agents.",
			how: "inspectAgentInput + MCP allowlist + no sampling/webhooks + least agency. Security → Agentic tab.",
			status: "ARMED"
		},
		{
			id: "owasp-llm",
			name: "OWASP LLM Top 10 2026",
			kind: "LLM application risks",
			license: "CC-BY-SA 4.0",
			what: "Prompt injection, disclosure, excessive agency, unbounded consumption, hidden context.",
			how: "Containment: even a fooled model cannot trade or read source on this host.",
			status: "ARMED"
		},
		{
			id: "mcp-sec",
			name: "MCP security 2026-07-28",
			kind: "Protocol hardening",
			license: "Spec (Anthropic / MCP)",
			what: "No confused-deputy webhooks, no token passthrough, no sampling-as-auth, treat tool annotations untrusted.",
			how: "JSON-RPC allowlist, 32KB / 8-batch, pushNotifications false, structuredContent only.",
			status: "ARMED"
		},
		{
			id: "crowdsec",
			name: "CrowdSec WAF (community)",
			kind: "Behavior + IP reputation",
			license: "MIT",
			what: "Scenarios, local then shareable bans.",
			how: "Local scoring only (no community blocklist without an API key). 8/10m → 30m, 16 → 12h.",
			status: "ARMED"
		},
		{
			id: "wafris",
			name: "Wafris",
			kind: "In-framework WAF",
			license: "MIT",
			what: "Middleware WAF inside the app, not DNS.",
			how: "Vite + Nitro middleware on every request.",
			status: "ARMED"
		},
		{
			id: "kev",
			name: "CISA KEV catalog",
			kind: "Threat intel",
			license: "USGov public",
			what: "Known exploited CVEs. BOD 26-04 patch windows.",
			how: "HTTPS JSON, no key. Stack-filtered. Virtual-patch Vite @fs.",
			status: "FEED"
		},
		{
			id: "osv",
			name: "OSV.dev",
			kind: "Supply-chain intel",
			license: "public API",
			what: "npm ecosystem advisories.",
			how: "querybatch for react, vite, tanstack, better-auth, nitro.",
			status: "FEED"
		},
		{
			id: "cf",
			name: "Cloudflare WAF / 1.1.1.1",
			kind: "Edge + DNS",
			license: "free tier",
			what: "Managed WAF + DoH.",
			how: "DoH is ARMED here. Edge WAF is OPERATOR on the domain.",
			status: "OPERATOR"
		}
	];
}
//#endregion
export { pciRows as n, pluginInventory as r, owaspRows as t };
