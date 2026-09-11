import { r as __exportAll } from "../_runtime.mjs";
import { t as __exportAll$1 } from "./agent-ping-BXZGzZ_N.mjs";
import { Or as TAB_LAB, Vn as TAB_DESK } from "./brand-zDAneT0C.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/security-CMyXz6XE.js
var security_CMyXz6XE_exports = /* @__PURE__ */ __exportAll({
	a: () => MCP_REMOTE,
	c: () => grokRateLimit,
	d: () => isEvmAddress,
	f: () => looksLikeSecret,
	g: () => vulnRows,
	h: () => usdcReceiveError,
	i: () => MCP_DOCS,
	l: () => grokUsage,
	m: () => security_exports,
	n: () => CDP_KEYS,
	o: () => SPARROW_SITE,
	p: () => protocolRows,
	r: () => CDP_REVOKE,
	s: () => assertSafePayload,
	t: () => ANALYSIS_AS_OF,
	u: () => isBtcReceiveAddress
});
var security_exports = /* @__PURE__ */ __exportAll$1({
	ANALYSIS_AS_OF: () => ANALYSIS_AS_OF,
	CDP_KEYS: () => CDP_KEYS,
	CDP_REVOKE: () => CDP_REVOKE,
	MCP_DOCS: () => MCP_DOCS,
	MCP_REMOTE: () => MCP_REMOTE,
	SPARROW_SITE: () => SPARROW_SITE,
	assertSafePayload: () => assertSafePayload,
	grokRateLimit: () => grokRateLimit,
	grokUsage: () => grokUsage,
	isBtcReceiveAddress: () => isBtcReceiveAddress,
	isEvmAddress: () => isEvmAddress,
	looksLikeCdpSecret: () => looksLikeCdpSecret,
	looksLikeSecret: () => looksLikeSecret,
	looksLikeSolanaAddress: () => looksLikeSolanaAddress,
	looksLikeWalletSecret: () => looksLikeWalletSecret,
	protocolRows: () => protocolRows,
	usdcReceiveError: () => usdcReceiveError,
	vulnRows: () => vulnRows
});
var MCP_REMOTE = "https://agents.coinbase.com/mcp";
var MCP_DOCS = "https://docs.cdp.coinbase.com/coinbase-for-agents/overview";
var CDP_KEYS = "https://portal.cdp.coinbase.com/api-keys/secret";
var CDP_REVOKE = "https://accounts.coinbase.com/security/connections";
var SPARROW_SITE = "https://sparrowwallet.com/";
var SECRET_RE = /"privateKey"\s*:|BEGIN (EC |OPENSSH )?PRIVATE KEY|"organizations\/|"apiSecret"\s*:|cdp[_-]?api[_-]?key/i;
var XPRV_RE = /\b([xyz]prv|tprv)[a-zA-Z0-9]{20,}/;
var WIF_RE = /\b[5KL][1-9A-HJ-NP-Za-km-z]{50,52}\b/;
var HEX_KEY_RE = /\b[0-9a-fA-F]{64}\b/;
function looksLikeCdpSecret(text) {
	if (!text || text.length < 20) return false;
	return SECRET_RE.test(text);
}
function looksLikeWalletSecret(text) {
	if (!text) return false;
	const trimmed = text.trim();
	if (XPRV_RE.test(trimmed) || WIF_RE.test(trimmed)) return true;
	if (HEX_KEY_RE.test(trimmed) && !/\s/.test(trimmed) && trimmed.length === 64) return true;
	const words = trimmed.toLowerCase().split(/\s+/);
	if ([
		12,
		15,
		18,
		21,
		24
	].includes(words.length) && words.every((w) => /^[a-z]{3,8}$/.test(w))) return true;
	return false;
}
function looksLikeSecret(text) {
	return looksLikeCdpSecret(text) || looksLikeWalletSecret(text);
}
function assertSafePayload(raw) {
	if (raw.length > 8e4) return "Snapshot too large.";
	if (looksLikeSecret(raw)) return "Secret rejected. Never paste a key, seed, or xprv into this desk.";
	return null;
}
function isEvmAddress(text) {
	return /^0x[a-fA-F0-9]{40}$/.test(text.trim());
}
/** Base58 pubkey (Phantom / Base app Solana). Not USDC on Ethereum or Base. */
function looksLikeSolanaAddress(text) {
	const a = text.trim();
	if (!a || a.startsWith("0x") || a.startsWith("bc1")) return false;
	if (/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(a)) return false;
	return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(a);
}
function usdcReceiveError(raw) {
	const a = raw.trim();
	if (!a) return null;
	if (looksLikeSolanaAddress(a)) return "That is a Solana address. Switch the Base app network to Base or Ethereum, then Receive native USDC. Need a 0x… address.";
	if (!isEvmAddress(a)) return "USDC staging must be 0x + 40 hex (same address on Ethereum and Base). Native USDC only.";
	return null;
}
function isBtcReceiveAddress(text) {
	const a = text.trim();
	if (looksLikeSecret(a)) return false;
	if (/^(bc1[qp][a-z0-9]{25,90})$/.test(a)) return true;
	if (/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(a)) return true;
	return false;
}
var WINDOW_MS = 6e5;
var MAX_GROK = 6;
var grokHits = [];
function grokRateLimit() {
	const now = Date.now();
	while (grokHits.length && now - grokHits[0] > WINDOW_MS) grokHits.shift();
	if (grokHits.length >= MAX_GROK) return "Grok cap reached (6 / 10 min). Operator only, user-initiated.";
	grokHits.push(now);
	return null;
}
function grokUsage() {
	const now = Date.now();
	while (grokHits.length && now - grokHits[0] > WINDOW_MS) grokHits.shift();
	return {
		used: grokHits.length,
		max: MAX_GROK,
		windowMin: 10
	};
}
function protocolRows() {
	return [
		{
			id: "dns",
			title: "Cloudflare DNS only (app layer)",
			status: "PASS",
			detail: "Explicit DNS uses Cloudflare DoH (cloudflare-dns.com). dns.google is blocked. Outbound fetch is HTTPS + host allowlist (no IP literals, no user URLs). This is not an OS firewall — set 1.1.1.1 / 1.0.0.1 on the CLI machine."
		},
		{
			id: "secret",
			title: "No CDP secret on this host",
			status: "PASS",
			detail: "[ S1R1U$ <<L@B$>> ] never stores, uploads, or forwards a Coinbase API key. Secret is shown once in CDP Portal."
		},
		{
			id: "seed",
			title: "No wallet seed on this host",
			status: "PASS",
			detail: "Seeds, WIF, xprv, and 64-hex keys are rejected at paste. Sparrow backup is a receive address only. USDC staging is a 0x EOA (Ethereum + Base). Solana and Coinbase-swept Receive 0x are rejected."
		},
		{
			id: "live",
			title: "No live orders from this app",
			status: "PASS",
			detail: "7-B0T / Wallet emit `coinbase orders preview --dry-run` and `send --dry-run` only. Paper clip is simulated at Coinbase last. You run create on CLI/MCP."
		},
		{
			id: "hitl",
			title: "Human-in-the-loop + two YubiKeys",
			status: "PASS",
			detail: "Outgoing BTC/USDC CLI copy (buy, sweep, take-profit, HIGH conviction) requires a tap from either of two enrolled admin YubiKeys. Fewer than two keys = blocked. YubiCloud + local OTP replay check."
		},
		{
			id: "session",
			title: "Admin session",
			status: "OPERATOR",
			detail: "HMAC-signed token, 12h TTL, generation epoch. Lives in sessionStorage (OWASP 2026: do not store session IDs there — XSS can read it). Mitigations: epoch bump on lock/idle, live operator X required on every admin RPC, idle lock clears the token before the overlay paints. HttpOnly cookie not implemented — OPEN until a cookie session ships."
		},
		{
			id: "2fa",
			title: "First door + hardware",
			status: "PASS",
			detail: "Admin is AND: exact operator X account (id or handle — display name is not enough) plus admin name + password. X alone or password alone cannot mint an admin token. Any other X is a user at most. Optional: lock Admin behind a physical YubiKey (Yubico OTP or FIDO2, default OFF). Outgoing BTC/USDC still needs either enrolled OTP YubiKey."
		},
		{
			id: "vault",
			title: "Encrypted treasury vault",
			status: "PASS",
			detail: "AES-256-GCM: Coinbase BTC profit Receive (33km…), optional USDC staging 0x, Sparrow, portfolio UUIDs. Decrypt only after admin session. No spend keys on this host. GM tab shows operator receive addresses only (USDC fund 0x, BTC profit 33km) — never a private key."
		},
		{
			id: "rails",
			title: "USDC / BTC rails",
			status: "PASS",
			detail: "Trading USDC/BTC sit in the Coinbase agent portfolio. Profit TRIM is Coinbase BTC Receive (sweep OK — we track incoming). Staging is Base app / Coinbase Wallet 0x (self-custody, not swept). Solana is a wrong-chain paste, not a sweep test. Desk does not mint keys."
		},
		{
			id: "idle",
			title: "Idle screensaver",
			status: "PASS",
			detail: "5-minute idle: token cleared first, epoch bumped, X signed out, overlay cannot be dismissed in-place. Any key/click sends /login. Burst rain on GM tab does not lock. Overlay is not mounted on /login."
		},
		{
			id: "roles",
			title: "Admin vs desk user vs public",
			status: "PASS",
			detail: `Public: ${TAB_DESK} dashboard only. Fund user: ${TAB_DESK} + ${TAB_LAB} + GM practice. They cannot open Admin, Paper, Wallet, Coin, Access, Security, or Live GM. Admin: Console + Wallet + Paper + Practice + Coin + Website + Access + Security + GM Live unlock. Coin and launch notes never render on the public tape or s1r1us.ai.`
		},
		{
			id: "gm",
			title: "G0DZ1LLa M0D3 sleeve",
			status: "PASS",
			detail: "Practice for everyone. Live unlock is admin HMAC only (not localStorage). Live book is not persisted. AUTO never naked-shorts. TRIM keeps BTC at 33km…. Fund 0x is receive-only. No GM spend keys."
		},
		{
			id: "pw-reset",
			title: "Admin password renew",
			status: "PASS",
			detail: "Renew password is offered only after the bound X admin session. One-time token is hashed at rest, 30 minutes, single use. Destination mailbox is server-only and never rendered on the tape, Paper, website, or Coin tab. Bound X may set a new password without the old one. 3 requests / hour."
		},
		{
			id: "portfolio",
			title: "Isolated agent portfolio",
			status: "OPERATOR",
			detail: "CDP Portal: Trade + Transfer on one Advanced portfolio funded with USDC you can lose. $100 test book is paper until you transfer on Coinbase."
		},
		{
			id: "oauth",
			title: "MCP OAuth / CLI",
			status: "OPERATOR",
			detail: `Remote MCP: ${MCP_REMOTE}. 24/7 execution belongs on CLI on a locked machine — not this browser.`
		},
		{
			id: "scopes",
			title: "Least privilege",
			status: "OPERATOR",
			detail: "View + Trade + Transfer. MCP Transfer is portfolio-to-portfolio only — it cannot send BTC off-exchange. Take-profit is Coinbase Send."
		},
		{
			id: "ip",
			title: "IP allowlist",
			status: "OPERATOR",
			detail: "Restrict the CDP secret to the machine that runs CLI, or explicitly opt out."
		},
		{
			id: "short",
			title: "Never short bitcoin",
			status: "PASS",
			detail: "7-bot stack: accumulate. Never sell bitcoin. Never short. A stop does not dump the stack. GM sleeve TRIM sends BTC to 33km… (still bitcoin). GM SHORT/naked is Live-admin, isolated paper/preview only — never the stack."
		},
		{
			id: "oss",
			title: "Open-source ready",
			status: "PASS",
			detail: "Apache-2.0, SECURITY.md, stealth README. GitHub org s1r1us. No CDP/Yubi/vault in git. Mint recipe stays admin until TOKEN_LAUNCHED. Public tree never emits orders create. Agent UAs cannot fetch /src, zips, /guide, /admin."
		},
		{
			id: "agent-rate",
			title: "Agent feed rate-limit + cache",
			status: "PASS",
			detail: "GET /api/agent/* limited per IP+UA. Free poll 300s (1 / 25s retry). Scrapers 1 / 60s → 429. 7-B0T JSON cached 20s so 15 bots are not rebuilt every GET. SaaS key raises cap — pay for HTTP, not conviction."
		},
		{
			id: "byo",
			title: "BYO compute — visitor Ask Grok",
			status: "PASS",
			detail: "Signed-in X users Ask Grok with their xAI key. Key is never written to disk. Operator XAI_API_KEY is not spent on visitors. X OAuth is identity only — it cannot drain SuperGrok."
		},
		{
			id: "crs",
			title: "OWASP CRS-PL1 application firewall",
			status: "PASS",
			detail: "In-process WAF modeled on OWASP CRS 4.28.0 (2 Jul 2026) paranoia level 1. Blocks SQLi, XSS, RCE, LFI, RFI, Log4j, scanners, WordPress/phpMyAdmin/.env probes, Vite @fs raw+import (CVE-2025-31125 class). Anomaly threshold 5. TRACE/TRACK/CONNECT denied."
		},
		{
			id: "intel",
			title: "CISA KEV + OSV.dev intel",
			status: "PASS",
			detail: "Free feeds, no API key. Security tab pulls the KEV catalog and npm advisories, stack-filters Node/React/Vite, and virtual-patches what this process can (Vite @fs). Operator still patches the OS/Node runtime."
		},
		{
			id: "headers",
			title: "HTTP security headers",
			status: "PASS",
			detail: "nosniff, Referrer-Policy, Permissions-Policy (payment=()), HSTS on HTTPS, X-DNS-Prefetch-Control off. X-Frame-Options not set (preview is iframed). CSP not set here — grok.com injector + Vite. Put CSP on the edge."
		}
	];
}
var ANALYSIS_AS_OF = "6 September 2026 · Security tab · hunter v2 · OWASP CRS 4.28 / CISA KEV";
function vulnRows() {
	return [
		{
			id: "saver-dismiss",
			title: "Screensaver dismissed without re-auth",
			severity: "HIGH",
			status: "FIXED",
			detail: "Lock overlay used to hide on click/key while the desk stayed in view. Idle now clears the token first, signs out X, and any interaction goes to /login. Overlay is not shown on the login page."
		},
		{
			id: "x-admin-tab",
			title: "Admin tab on X-only session",
			severity: "MED",
			status: "FIXED",
			detail: "Admin nav showed when X matched the operator without name+password. Nav now requires a full admin unlock."
		},
		{
			id: "session-xss",
			title: "Admin HMAC in sessionStorage",
			severity: "MED",
			status: "OPERATOR",
			detail: "OWASP Session Management 2026: tokens in sessionStorage are readable by XSS. I cannot honestly call this closed. Need your OK to move the HMAC into an HttpOnly; Secure; SameSite=Strict cookie. Until then: epoch + X AND + idle wipe."
		},
		{
			id: "admin-and",
			title: "X-only or password-only admin",
			severity: "HIGH",
			status: "FIXED",
			detail: "Admin unlock requires live operator X (that account on grok-x/twitter/x) AND admin name+password. Email local-part, display name, idToken screen_name, company/dead handles, and desk-user sessions cannot become admin. verifyAccessToken re-checks the X session. OperatorGate hides admin chrome unless role is admin."
		},
		{
			id: "slot-dead",
			title: "Semaphore miss marked Coinbase dead",
			severity: "HIGH",
			status: "FIXED",
			detail: "slot timeout matched /timeout/ and put Coinbase/OKX in the dead host map for 2 minutes. Semaphore misses no longer mark a host dead. Inflight 12."
		},
		{
			id: "gm-persist",
			title: "GM Live flag in localStorage",
			severity: "MED",
			status: "FIXED",
			detail: "s1r1us-gm-v1 persisted liveUnlocked and the live book. v2 persist is practice-only. Live unlock is HMAC admin GET/POST."
		},
		{
			id: "reset-false-ok",
			title: "Password renew claimed mail when transport was off",
			severity: "MED",
			status: "FIXED",
			detail: "requestAdminReset returned ok even if Resend/SMTP was unset. It now reports mailed=false; the UI still lets the operator X set a new password in-session and does not claim a letter went out."
		},
		{
			id: "cycle-hmr",
			title: "Cycle logs triggered full page reload",
			severity: "MED",
			status: "FIXED",
			detail: "desk-cycle.json / feed-audit wrote into /workspace/artifacts, Vite watched them, the preview remounted, and the tape pulled again. Logs go to /tmp; Vite ignores artifacts/screenshots. Poll skips hidden tabs and 45s-fresh tape."
		},
		{
			id: "snap-pass",
			title: "Snapshot passphrase stored next to ciphertext",
			severity: "MED",
			status: "MITIGATED",
			detail: "Prior .pass.txt files sat beside the .gpg in artifacts. New archives exclude *.pass.txt, *.gpg, node_modules, and the database. Sidecar passphrase is not packed. Rotate if an old pass.txt left the host."
		},
		{
			id: "jsonld",
			title: "JSON-LD script injection",
			severity: "LOW",
			status: "FIXED",
			detail: "Static schema.org graph only; stringify now escapes < so a future field cannot break out of the script tag."
		},
		{
			id: "yubi-leak",
			title: "Yubi inventory on any Grok session",
			severity: "MED",
			status: "FIXED",
			detail: "secondFactorStatus returned key count and masked public IDs to every signed-in visitor. Non-admin X now gets allowed=false and empty yubi fields."
		},
		{
			id: "public-chrome",
			title: "Practice engine + idle lock on s1r1us.ai",
			severity: "MED",
			status: "FIXED",
			detail: "Public coin host and /s1r1us no longer mount MatrixSaver (X sign-out) or PracticeEngine (paper fills + extra tape pulls). Apex on s1r1us.ai renders the public tape, not the desk."
		},
		{
			id: "dns-orphan",
			title: "s1r1us.ai TLS until DigitalOcean domain attach",
			severity: "MED",
			status: "OPERATOR",
			detail: "Apex A is DigitalOcean 162.159.140.98 / 172.66.0.96. Handshake fails until the domain is added on the App Platform app and a deploy is green. Do not click through a cert warning. Do not log in on that host until HTTPS is real."
		},
		{
			id: "revoke-unauth",
			title: "Unauthenticated session + Yubi wipe",
			severity: "HIGH",
			status: "FIXED",
			detail: "revokeDeskSessions was a public POST that deleted X sessions, 2FA bind, and both YubiKeys. Now requires a live admin token and only bumps the session epoch. Does not wipe hardware keys."
		},
		{
			id: "token-store",
			title: "Admin token in localStorage",
			severity: "HIGH",
			status: "FIXED",
			detail: "Token lives in sessionStorage. Tab close ends the session. Audit events stay local."
		},
		{
			id: "token-epoch",
			title: "Password change did not kill sessions",
			severity: "HIGH",
			status: "FIXED",
			detail: "Tokens carry a generation. Rotate password, idle lock, and admin lock increment it; old tokens fail verify."
		},
		{
			id: "seed-paste",
			title: "Mnemonic / WIF / xprv / CDP JSON paste",
			severity: "HIGH",
			status: "FIXED",
			detail: "Forms reject seeds, WIF, xprv, 64-hex, and CDP secret shapes. Only BTC receive, 0x USDC, and portfolio UUIDs may be stored."
		},
		{
			id: "live-keys",
			title: "24/7 agent keys in the web app",
			severity: "HIGH",
			status: "MITIGATED",
			detail: "This host cannot hold a CDP secret or Sparrow seed. Live execution is CLI/MCP on your machine. HIGH conviction copies a dry-run after Yubi; it never broadcasts."
		},
		{
			id: "vault-key",
			title: "Vault key derived from DB HMAC pepper",
			severity: "MED",
			status: "MITIGATED",
			detail: "AES-256-GCM uses HKDF-style HMAC of the server pepper. A leaked DATABASE_URL can decrypt the vault. Protect the database. No seed is in the vault — addresses and UUIDs only."
		},
		{
			id: "stolen-admin",
			title: "Stolen admin session can read the vault",
			severity: "MED",
			status: "MITIGATED",
			detail: "Admin token + 12h TTL can load profit BTC, USDC 0x, UUIDs. Copying a spend CLI still needs a live Yubi tap. Idle lock + tab close cut the window. Rotate password if a session is suspect."
		},
		{
			id: "xss-session",
			title: "XSS could steal the session token",
			severity: "MED",
			status: "MITIGATED",
			detail: "No innerHTML / dangerouslySetInnerHTML of Grok or RSS. Token not in localStorage. Do not install untrusted extensions on the operator browser."
		},
		{
			id: "default-hash",
			title: "Factory password hash in source",
			severity: "MED",
			status: "OPERATOR",
			detail: "Factory SHA-256 hash is revoked in source (all-zero). Live unlock is Argon2id (m=16384) in admin_lock after Credentials rotate. Lock persists on disk in preview."
		},
		{
			id: "admin-reset-x",
			title: "Admin password reset without X",
			severity: "HIGH",
			status: "MITIGATED",
			detail: "Mailbox renew and in-session renew both require the operator X account. Bound-X fallback no longer counts as admin. Logout bumps token epoch and signs out X."
		},
		{
			id: "yubi-client",
			title: "YubiCloud client id 1",
			severity: "LOW",
			status: "OPERATOR",
			detail: "Default Yubico API client is the public demo id. Replay is blocked by YubiCloud + last_otp. HMAC-SHA1 request/response signatures apply when YUBICO_API_SECRET is set (OTP Validation Protocol 2.0). For production, set YUBICO_CLIENT_ID and YUBICO_API_SECRET from yubico.com."
		},
		{
			id: "paper-fill",
			title: "Paper clip without YubiKey",
			severity: "LOW",
			status: "ACCEPT",
			detail: "Desk/L@B paper BUY/TRIM does not tap Yubi. It cannot move Coinbase funds. Live CLI copy on Wallet does."
		},
		{
			id: "fund-copy",
			title: "Fund-agent USDC CLI copy is not Yubi-gated",
			severity: "LOW",
			status: "ACCEPT",
			detail: "Main → agent USDC is inbound funding. Outbound (buy, sweep, take-profit, HIGH) is Yubi-gated. You still run the CLI."
		},
		{
			id: "rate-limit",
			title: "Sign-in / Grok rate limit is per instance",
			severity: "LOW",
			status: "ACCEPT",
			detail: "8 sign-in tries / 10 min and 6 Grok calls / 10 min live in memory. Serverless replicas do not share the counter."
		},
		{
			id: "argon",
			title: "Argon2 memory cost is modest",
			severity: "LOW",
			status: "ACCEPT",
			detail: "t=3, m=4096 KiB — sized for serverless. Fine after a long unique password. Not a substitute for Yubi on spend."
		},
		{
			id: "addr-privacy",
			title: "Receive addresses are not spend keys",
			severity: "INFO",
			status: "ACCEPT",
			detail: "Profit P2SH and USDC 0x are encrypted for privacy. They cannot spend. Live send is still Coinbase/CLI after preview."
		},
		{
			id: "os-dns",
			title: "OS / visitor DNS cannot be locked from this app",
			severity: "INFO",
			status: "ACCEPT",
			detail: "A web app cannot pin Windows/macOS resolvers or the visitor browser. Quad9/OpenDNS/AdGuard are listed as respected public recursor inventory only. This desk uses Cloudflare DoH for its own lookups. Operator: 1.1.1.1 and 1.0.0.1 on the machine that runs CLI."
		},
		{
			id: "google-dns",
			title: "Google Public DNS used for domain probes",
			severity: "MED",
			status: "FIXED",
			detail: "probeLaunch and site-health called dns.google. Replaced with Cloudflare DoH. Host allowlist rejects dns.google and 8.8.8.8. HTTP cleartext health probe removed."
		},
		{
			id: "practice-autofill",
			title: "Practice engine auto-fills without Yubi",
			severity: "LOW",
			status: "ACCEPT",
			detail: "5-minute HIGH BUY/ACCUMULATE writes the paper book only. Never sells BTC. Live fills stay empty while LIVE_UNLOCKED is false. No Coinbase order is sent."
		},
		{
			id: "lab-test-tape",
			title: "L@B charts used synthetic FRED/MSTR/holders",
			severity: "MED",
			status: "FIXED",
			detail: "L@B polls fetchDesk every 5 minutes. 7-B0T call uses the live tape. What-if presets last until the next poll. HTTP + snapshot cache (25s/40s) stops desk/practice/L@B/admin from stampeding the same sources."
		},
		{
			id: "fetch-stampede",
			title: "Five clients pulled the full tape in parallel",
			severity: "MED",
			status: "FIXED",
			detail: "One shared client poll. Two-phase server: core ≤2.4s (price/RSI/F&G/leverage/Asia/ETF) then fill (holders/news/macro). Client race 4s. Spinner 4.5s hard-stop. Public refresh cannot force a rebuild without an admin token."
		},
		{
			id: "rebuild-unauth",
			title: "Unauthenticated full-tape rebuild",
			severity: "MED",
			status: "FIXED",
			detail: "rebuildDesk POST required no session and could stampede free APIs. It now requires a live admin token; otherwise it returns the stale tape. Public poll uses GET fetchDesk only."
		},
		{
			id: "probe-unauth",
			title: "Public DNS / site-health probes",
			severity: "MED",
			status: "FIXED",
			detail: "probeLaunch and probeSiteHealth were open POSTs (Google DNS + fetch of s1r1us.ai). Admin token required. Unauth returns empty / 401."
		},
		{
			id: "grok-client-tape",
			title: "Ask Grok trusted a client snapshot",
			severity: "MED",
			status: "FIXED",
			detail: "A desk session could send a fake tape and spend SuperGrok quota. Ask Grok now grades getLiveSnapshot() on the server. Client snapshot/briefs/call are ignored. Visitor Ask Grok uses BYO xAI key only."
		},
		{
			id: "byo-session-key",
			title: "Visitor xAI key in sessionStorage",
			severity: "LOW",
			status: "MITIGATED",
			detail: "BYO key is kept in this browser session so Ask Grok can call xAI from the server (CORS). It is never written to disk, never logged, never in git. XSS could read it — same class as the admin token. Do not Ask Grok on a shared kiosk."
		},
		{
			id: "usdc-solana",
			title: "Solana paste vs Coinbase Receive sweep",
			severity: "MED",
			status: "FIXED",
			detail: "Solana (7YmS…) is the wrong Base-app network — reject, not a sweep. Coinbase.com Advanced Receive may be swept after credit — do not use as the watch-only book. Base app Ethereum/Base 0x is an EOA; USDC stays until the operator sends. ETH RPC now uses publicnode + User-Agent (cloudflare-eth was 403)."
		},
		{
			id: "public-launch",
			title: "Launch roadmap on public tape",
			severity: "MED",
			status: "FIXED",
			detail: "SystemOverview on s1r1us.ai /s1r1us no longer prints M0–M7. Coin tab (admin) still has the launch desk. Website tab iframes the public tape only."
		},
		{
			id: "user-paper-fill",
			title: "Desk-user paper fill via executeClip",
			severity: "LOW",
			status: "FIXED",
			detail: "UI hid fill for non-admin, but executeClip only checked unlocked. Desk and L@B now require role === admin."
		},
		{
			id: "cycle-hang",
			title: "Run cycle spinner never stopped",
			severity: "HIGH",
			status: "FIXED",
			detail: "80 parallel fetches + 2MB llama + Coinbase L2 + hung TCP made core never return. Two-phase core/fill, MAX_INFLIGHT=8, body caps, skip mempool.space, 4s client race, 4.5s spinner cap. Verified live: ~5.7s, price painted, spinner off."
		},
		{
			id: "hydrate-session",
			title: "SSR vs sessionStorage hydration mismatch",
			severity: "MED",
			status: "FIXED",
			detail: "useDeskTape read sessionStorage in useState, so SSR had no tape and the client first paint did. Spinner class, 7-B0T headline, and ‘just now’ vs ‘waiting’ diverged. Tape now starts empty on both trees; sessionStorage hydrates in useEffect."
		},
		{
			id: "hl-429",
			title: "Hyperliquid / Blockstream 429 on the hot path",
			severity: "LOW",
			status: "MITIGATED",
			detail: "HL meta 429 no longer blanks the capital bar — last good 90s cache, host dead 3 min. Blockstream fee API is unused (blockchain.info unconfirmed fees). Core voters do not depend on either host."
		},
		{
			id: "stop-loss",
			title: "Per-clip stop-loss",
			severity: "INFO",
			status: "FIXED",
			detail: "Each practice BUY lot carries a stop (default 1.5% under entry; moves to entry after +1%). Stop returns USDC. TRIM still keeps BTC. Live stop is preview-only while Coinbase is locked. Never shorts."
		},
		{
			id: "oss-pdf-bundle",
			title: "Open-source PDF is embedded as base64",
			severity: "INFO",
			status: "ACCEPT",
			detail: "Paper download is a blob from the JS bundle so the Grok preview cannot 404 a static file. No secrets in the PDF."
		},
		{
			id: "unowned-db",
			title: "Password hash is an unowned row",
			severity: "LOW",
			status: "MITIGATED",
			detail: "Rotate requires a valid admin session and the current password. No public reset endpoint."
		},
		{
			id: "no-waf",
			title: "No application firewall on ingress",
			severity: "HIGH",
			status: "FIXED",
			detail: "CRS-PL1 now inspects every non-HMR request in Vite and Nitro. Hits land in the intrusion ring. Repeated CRITICAL probes ban the IP (CrowdSec-style)."
		},
		{
			id: "vite-fs",
			title: "Vite --host exposes @fs / raw+import (CISA KEV class)",
			severity: "HIGH",
			status: "MITIGATED",
			detail: "Preview contract binds 0.0.0.0:8080. WAF 961100 blocks /@fs to /etc, .env, keys, and ?raw&import / ?inline&import on non-src paths (CVE-2025-31125 class). Do not expose the dev server on a public IP."
		},
		{
			id: "headers-missing",
			title: "HTTP security headers were not set by this app",
			severity: "LOW",
			status: "MITIGATED",
			detail: "nosniff / referrer / permissions / HSTS-on-HTTPS now ship from this process. CSP and X-Frame-Options stay off so the preview iframe and grok.com injector keep working."
		}
	];
}
//#endregion
export { MCP_REMOTE as a, grokRateLimit as c, isEvmAddress as d, looksLikeSecret as f, vulnRows as g, usdcReceiveError as h, MCP_DOCS as i, grokUsage as l, security_CMyXz6XE_exports as m, CDP_KEYS as n, SPARROW_SITE as o, protocolRows as p, CDP_REVOKE as r, assertSafePayload as s, ANALYSIS_AS_OF as t, isBtcReceiveAddress as u };
