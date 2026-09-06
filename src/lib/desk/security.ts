import { TAB_DESK, TAB_LAB } from "@/lib/brand";

export const MCP_REMOTE = "https://agents.coinbase.com/mcp";
export const MCP_DOCS = "https://docs.cdp.coinbase.com/coinbase-for-agents/overview";
export const CDP_KEYS = "https://portal.cdp.coinbase.com/api-keys/secret";
export const CDP_REVOKE = "https://accounts.coinbase.com/security/connections";
export const SPARROW_SITE = "https://sparrowwallet.com/";

const SECRET_RE =
  /"privateKey"\s*:|BEGIN (EC |OPENSSH )?PRIVATE KEY|"organizations\/|"apiSecret"\s*:|cdp[_-]?api[_-]?key/i;
const XPRV_RE = /\b([xyz]prv|tprv)[a-zA-Z0-9]{20,}/;
const WIF_RE = /\b[5KL][1-9A-HJ-NP-Za-km-z]{50,52}\b/;
const HEX_KEY_RE = /\b[0-9a-fA-F]{64}\b/;

export function looksLikeCdpSecret(text: string): boolean {
  if (!text || text.length < 20) return false;
  return SECRET_RE.test(text);
}

export function looksLikeWalletSecret(text: string): boolean {
  if (!text) return false;
  const trimmed = text.trim();
  if (XPRV_RE.test(trimmed) || WIF_RE.test(trimmed)) return true;
  if (HEX_KEY_RE.test(trimmed) && !/\s/.test(trimmed) && trimmed.length === 64) return true;
  const words = trimmed.toLowerCase().split(/\s+/);
  if ([12, 15, 18, 21, 24].includes(words.length) && words.every((w) => /^[a-z]{3,8}$/.test(w))) {
    return true;
  }
  return false;
}

export function looksLikeSecret(text: string): boolean {
  return looksLikeCdpSecret(text) || looksLikeWalletSecret(text);
}

export function assertSafePayload(raw: string): string | null {
  if (raw.length > 80_000) return "Snapshot too large.";
  if (looksLikeSecret(raw)) return "Secret rejected. Never paste a key, seed, or xprv into this desk.";
  return null;
}

export function isEvmAddress(text: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(text.trim());
}

/** Base58 pubkey (Phantom / Base app Solana). Not USDC on Ethereum or Base. */
export function looksLikeSolanaAddress(text: string): boolean {
  const a = text.trim();
  if (!a || a.startsWith("0x") || a.startsWith("bc1")) return false;
  if (/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(a)) return false;
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(a);
}

export function usdcReceiveError(raw: string): string | null {
  const a = raw.trim();
  if (!a) return null;
  if (looksLikeSolanaAddress(a)) {
    return "That is a Solana address. Switch the Base app network to Base or Ethereum, then Receive native USDC. Need a 0x… address.";
  }
  if (!isEvmAddress(a)) {
    return "USDC staging must be 0x + 40 hex (same address on Ethereum and Base). Native USDC only.";
  }
  return null;
}

export function isBtcReceiveAddress(text: string): boolean {
  const a = text.trim();
  if (looksLikeSecret(a)) return false;
  if (/^(bc1[qp][a-z0-9]{25,90})$/.test(a)) return true;
  if (/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(a)) return true;
  return false;
}

const WINDOW_MS = 10 * 60_000;
const MAX_GROK = 6;
const grokHits: number[] = [];

export function grokRateLimit(): string | null {
  const now = Date.now();
  while (grokHits.length && now - grokHits[0]! > WINDOW_MS) grokHits.shift();
  if (grokHits.length >= MAX_GROK) return "Grok cap reached (6 / 10 min). Operator only, user-initiated.";
  grokHits.push(now);
  return null;
}

export function grokUsage() {
  const now = Date.now();
  while (grokHits.length && now - grokHits[0]! > WINDOW_MS) grokHits.shift();
  return { used: grokHits.length, max: MAX_GROK, windowMin: 10 };
}

export type ProtocolRow = {
  id: string;
  title: string;
  status: "PASS" | "OPERATOR" | "FAIL";
  detail: string;
};

export function protocolRows(): ProtocolRow[] {
  return [
    {
      id: "dns",
      title: "Cloudflare DNS only (app layer)",
      status: "PASS",
      detail: "Explicit DNS uses Cloudflare DoH (cloudflare-dns.com). dns.google is blocked. Outbound fetch is HTTPS + host allowlist (no IP literals, no user URLs). This is not an OS firewall — set 1.1.1.1 / 1.0.0.1 on the CLI machine.",
    },
    {
      id: "secret",
      title: "No CDP secret on this host",
      status: "PASS",
      detail: "[ S1R1U$ <<L@B$>> ] never stores, uploads, or forwards a Coinbase API key. Secret is shown once in CDP Portal.",
    },
    {
      id: "seed",
      title: "No wallet seed on this host",
      status: "PASS",
      detail: "Seeds, WIF, xprv, and 64-hex keys are rejected at paste. Sparrow backup is a receive address only. USDC staging is a 0x EOA (Ethereum + Base). Solana and Coinbase-swept Receive 0x are rejected.",
    },
    {
      id: "live",
      title: "No live orders from this app",
      status: "PASS",
      detail: "Bot 7 / Wallet emit `coinbase orders preview --dry-run` and `send --dry-run` only. Paper clip is simulated at Coinbase last. You run create on CLI/MCP.",
    },
    {
      id: "hitl",
      title: "Human-in-the-loop + two YubiKeys",
      status: "PASS",
      detail: "Outgoing BTC/USDC CLI copy (buy, sweep, take-profit, HIGH conviction) requires a tap from either of two enrolled admin YubiKeys. Fewer than two keys = blocked. YubiCloud + local OTP replay check.",
    },
    {
      id: "session",
      title: "Admin session",
      status: "OPERATOR",
      detail: "HMAC-signed token, 12h TTL, generation epoch. Lives in sessionStorage (OWASP 2026: do not store session IDs there — XSS can read it). Mitigations: epoch bump on lock/idle, live operator X required on every admin RPC, idle lock clears the token before the overlay paints. HttpOnly cookie not implemented — OPEN until a cookie session ships.",
    },
    {
      id: "2fa",
      title: "First door + hardware",
      status: "PASS",
      detail: "Admin is AND: exact operator X account (id or handle — display name is not enough) plus admin name + password. X alone or password alone cannot mint an admin token. Any other X is a user at most. Outgoing BTC/USDC still needs either enrolled YubiKey.",
    },
    {
      id: "vault",
      title: "Encrypted treasury vault",
      status: "PASS",
      detail: "AES-256-GCM: Coinbase BTC profit Receive (33km…), optional USDC staging 0x, Sparrow, portfolio UUIDs. Decrypt only after admin session. No spend keys on this host. GM tab shows operator receive addresses only (USDC fund 0x, BTC profit 33km) — never a private key.",
    },
    {
      id: "rails",
      title: "USDC / BTC rails",
      status: "PASS",
      detail: "Trading USDC/BTC sit in the Coinbase agent portfolio. Profit TRIM is Coinbase BTC Receive (sweep OK — we track incoming). Staging is Base app / Coinbase Wallet 0x (self-custody, not swept). Solana is a wrong-chain paste, not a sweep test. Desk does not mint keys.",
    },
    {
      id: "idle",
      title: "Idle screensaver",
      status: "PASS",
      detail: "5-minute idle: token cleared first, epoch bumped, X signed out, overlay cannot be dismissed in-place. Any key/click sends /login. Burst rain on GM tab does not lock. Overlay is not mounted on /login.",
    },
    {
      id: "roles",
      title: "Admin vs desk user vs public",
      status: "PASS",
      detail: `Public: ${TAB_DESK} dashboard only. Fund user: ${TAB_DESK} + ${TAB_LAB} + GM practice. They cannot open Admin, Paper, Wallet, Coin, Access, or Live GM. Admin: Console + Wallet + Paper + Practice + Coin + Website + Access + GM Live unlock. Coin and launch notes never render on the public tape or s1r1us.ai.`,
    },
    {
      id: "gm",
      title: "G0DZ1LLa M0D3 sleeve",
      status: "PASS",
      detail: "Practice for everyone. Live unlock is admin HMAC only (not localStorage). Live book is not persisted. AUTO never naked-shorts. TRIM keeps BTC at 33km…. Fund 0x is receive-only. No GM spend keys.",
    },
    {
      id: "pw-reset",
      title: "Admin password renew",
      status: "PASS",
      detail: "Renew password is offered only after the bound X admin session. One-time token is hashed at rest, 30 minutes, single use. Destination mailbox is server-only and never rendered on the tape, Paper, website, or Coin tab. Bound X may set a new password without the old one. 3 requests / hour.",
    },
    {
      id: "portfolio",
      title: "Isolated agent portfolio",
      status: "OPERATOR",
      detail: "CDP Portal: Trade + Transfer on one Advanced portfolio funded with USDC you can lose. $100 test book is paper until you transfer on Coinbase.",
    },
    {
      id: "oauth",
      title: "MCP OAuth / CLI",
      status: "OPERATOR",
      detail: `Remote MCP: ${MCP_REMOTE}. 24/7 execution belongs on CLI on a locked machine — not this browser.`,
    },
    {
      id: "scopes",
      title: "Least privilege",
      status: "OPERATOR",
      detail: "View + Trade + Transfer. MCP Transfer is portfolio-to-portfolio only — it cannot send BTC off-exchange. Take-profit is Coinbase Send.",
    },
    {
      id: "ip",
      title: "IP allowlist",
      status: "OPERATOR",
      detail: "Restrict the CDP secret to the machine that runs CLI, or explicitly opt out.",
    },
    {
      id: "short",
      title: "Never short bitcoin",
      status: "PASS",
      detail: "7-bot stack: accumulate. Never sell bitcoin. Never short. A stop does not dump the stack. GM sleeve TRIM sends BTC to 33km… (still bitcoin). GM SHORT/naked is Live-admin, isolated paper/preview only — never the stack.",
    },
    {
      id: "oss",
      title: "Open-source ready",
      status: "PASS",
      detail: "Apache-2.0, SECURITY.md, stealth README. GitHub org s1r1us. No CDP/Yubi/vault in git. Mint recipe stays admin until TOKEN_LAUNCHED. Public tree never emits orders create. Agent UAs cannot fetch /src, zips, /guide, /admin.",
    },
    {
      id: "agent-rate",
      title: "Agent feed rate-limit + cache",
      status: "PASS",
      detail: "GET /api/agent/* limited per IP+UA. Free poll 300s (1 / 25s retry). Scrapers 1 / 60s → 429. Bot 7 JSON cached 20s so 15 bots are not rebuilt every GET. SaaS key raises cap — pay for HTTP, not conviction.",
    },
    {
      id: "byo",
      title: "BYO compute — visitor Ask Grok",
      status: "PASS",
      detail: "Signed-in X users Ask Grok with their xAI key. Key is never written to disk. Operator XAI_API_KEY is not spent on visitors. X OAuth is identity only — it cannot drain SuperGrok.",
    },
  ];
}

export type VulnRow = {
  id: string;
  title: string;
  severity: "HIGH" | "MED" | "LOW" | "INFO";
  status: "FIXED" | "MITIGATED" | "OPERATOR" | "ACCEPT";
  detail: string;
};

export const ANALYSIS_AS_OF = "5 September 2026 · 12:51 ET · v14 · go-live path started";

export function vulnRows(): VulnRow[] {
  return [
    {
      id: "saver-dismiss",
      title: "Screensaver dismissed without re-auth",
      severity: "HIGH",
      status: "FIXED",
      detail: "Lock overlay used to hide on click/key while the desk stayed in view. Idle now clears the token first, signs out X, and any interaction goes to /login. Overlay is not shown on the login page.",
    },
    {
      id: "x-admin-tab",
      title: "Admin tab on X-only session",
      severity: "MED",
      status: "FIXED",
      detail: "Admin nav showed when X matched the operator without name+password. Nav now requires a full admin unlock.",
    },
    {
      id: "session-xss",
      title: "Admin HMAC in sessionStorage",
      severity: "MED",
      status: "OPERATOR",
      detail: "OWASP Session Management 2026: tokens in sessionStorage are readable by XSS. I cannot honestly call this closed. Need your OK to move the HMAC into an HttpOnly; Secure; SameSite=Strict cookie. Until then: epoch + X AND + idle wipe.",
    },
    {
      id: "admin-and",
      title: "X-only or password-only admin",
      severity: "HIGH",
      status: "FIXED",
      detail: "Admin unlock requires live operator X (that account on grok-x/twitter/x) AND admin name+password. Email local-part, display name, idToken screen_name, company/dead handles, and desk-user sessions cannot become admin. verifyAccessToken re-checks the X session. OperatorGate hides admin chrome unless role is admin.",
    },
    {
      id: "slot-dead",
      title: "Semaphore miss marked Coinbase dead",
      severity: "HIGH",
      status: "FIXED",
      detail: "slot timeout matched /timeout/ and put Coinbase/OKX in the dead host map for 2 minutes. Semaphore misses no longer mark a host dead. Inflight 12.",
    },
    {
      id: "gm-persist",
      title: "GM Live flag in localStorage",
      severity: "MED",
      status: "FIXED",
      detail: "s1r1us-gm-v1 persisted liveUnlocked and the live book. v2 persist is practice-only. Live unlock is HMAC admin GET/POST.",
    },
    {
      id: "reset-false-ok",
      title: "Password renew claimed mail when transport was off",
      severity: "MED",
      status: "FIXED",
      detail: "requestAdminReset returned ok even if Resend/SMTP was unset. It now reports mailed=false; the UI still lets the operator X set a new password in-session and does not claim a letter went out.",
    },
    {
      id: "cycle-hmr",
      title: "Cycle logs triggered full page reload",
      severity: "MED",
      status: "FIXED",
      detail: "desk-cycle.json / feed-audit wrote into /workspace/artifacts, Vite watched them, the preview remounted, and the tape pulled again. Logs go to /tmp; Vite ignores artifacts/screenshots. Poll skips hidden tabs and 45s-fresh tape.",
    },
    {
      id: "snap-pass",
      title: "Snapshot passphrase stored next to ciphertext",
      severity: "MED",
      status: "MITIGATED",
      detail: "Prior .pass.txt files sat beside the .gpg in artifacts. New archives exclude *.pass.txt, *.gpg, node_modules, and the database. Sidecar passphrase is not packed. Rotate if an old pass.txt left the host.",
    },
    {
      id: "jsonld",
      title: "JSON-LD script injection",
      severity: "LOW",
      status: "FIXED",
      detail: "Static schema.org graph only; stringify now escapes < so a future field cannot break out of the script tag.",
    },
    {
      id: "yubi-leak",
      title: "Yubi inventory on any Grok session",
      severity: "MED",
      status: "FIXED",
      detail: "secondFactorStatus returned key count and masked public IDs to every signed-in visitor. Non-admin X now gets allowed=false and empty yubi fields.",
    },
    {
      id: "public-chrome",
      title: "Practice engine + idle lock on s1r1us.ai",
      severity: "MED",
      status: "FIXED",
      detail: "Public coin host and /s1r1us no longer mount MatrixSaver (X sign-out) or PracticeEngine (paper fills + extra tape pulls). Apex on s1r1us.ai renders the public tape, not the desk.",
    },
    {
      id: "dns-orphan",
      title: "s1r1us.ai TLS until DigitalOcean domain attach",
      severity: "MED",
      status: "OPERATOR",
      detail: "Apex A is DigitalOcean 162.159.140.98 / 172.66.0.96. Handshake fails until the domain is added on the App Platform app and a deploy is green. Do not click through a cert warning. Do not log in on that host until HTTPS is real.",
    },
    {
      id: "revoke-unauth",
      title: "Unauthenticated session + Yubi wipe",
      severity: "HIGH",
      status: "FIXED",
      detail: "revokeDeskSessions was a public POST that deleted X sessions, 2FA bind, and both YubiKeys. Now requires a live admin token and only bumps the session epoch. Does not wipe hardware keys.",
    },
    {
      id: "token-store",
      title: "Admin token in localStorage",
      severity: "HIGH",
      status: "FIXED",
      detail: "Token lives in sessionStorage. Tab close ends the session. Audit events stay local.",
    },
    {
      id: "token-epoch",
      title: "Password change did not kill sessions",
      severity: "HIGH",
      status: "FIXED",
      detail: "Tokens carry a generation. Rotate password, idle lock, and admin lock increment it; old tokens fail verify.",
    },
    {
      id: "seed-paste",
      title: "Mnemonic / WIF / xprv / CDP JSON paste",
      severity: "HIGH",
      status: "FIXED",
      detail: "Forms reject seeds, WIF, xprv, 64-hex, and CDP secret shapes. Only BTC receive, 0x USDC, and portfolio UUIDs may be stored.",
    },
    {
      id: "live-keys",
      title: "24/7 agent keys in the web app",
      severity: "HIGH",
      status: "MITIGATED",
      detail: "This host cannot hold a CDP secret or Sparrow seed. Live execution is CLI/MCP on your machine. HIGH conviction copies a dry-run after Yubi; it never broadcasts.",
    },
    {
      id: "vault-key",
      title: "Vault key derived from DB HMAC pepper",
      severity: "MED",
      status: "MITIGATED",
      detail: "AES-256-GCM uses HKDF-style HMAC of the server pepper. A leaked DATABASE_URL can decrypt the vault. Protect the database. No seed is in the vault — addresses and UUIDs only.",
    },
    {
      id: "stolen-admin",
      title: "Stolen admin session can read the vault",
      severity: "MED",
      status: "MITIGATED",
      detail: "Admin token + 12h TTL can load profit BTC, USDC 0x, UUIDs. Copying a spend CLI still needs a live Yubi tap. Idle lock + tab close cut the window. Rotate password if a session is suspect.",
    },
    {
      id: "xss-session",
      title: "XSS could steal the session token",
      severity: "MED",
      status: "MITIGATED",
      detail: "No innerHTML / dangerouslySetInnerHTML of Grok or RSS. Token not in localStorage. Do not install untrusted extensions on the operator browser.",
    },
    {
      id: "default-hash",
      title: "Factory password hash in source",
      severity: "MED",
      status: "OPERATOR",
      detail: "Factory SHA-256 hash is revoked in source (all-zero). Live unlock is Argon2id (m=16384) in admin_lock after Credentials rotate. Lock persists on disk in preview.",
    },
    {
      id: "admin-reset-x",
      title: "Admin password reset without X",
      severity: "HIGH",
      status: "MITIGATED",
      detail: "Mailbox renew and in-session renew both require the operator X account. Bound-X fallback no longer counts as admin. Logout bumps token epoch and signs out X.",
    },
    {
      id: "yubi-client",
      title: "YubiCloud client id 1",
      severity: "LOW",
      status: "OPERATOR",
      detail: "Default Yubico API client is the public demo id. Replay is blocked by YubiCloud + last_otp. For production, set your own YUBICO_CLIENT_ID (and HMAC secret if you use signed verify).",
    },
    {
      id: "paper-fill",
      title: "Paper clip without YubiKey",
      severity: "LOW",
      status: "ACCEPT",
      detail: "Desk/L@B paper BUY/TRIM does not tap Yubi. It cannot move Coinbase funds. Live CLI copy on Wallet does.",
    },
    {
      id: "fund-copy",
      title: "Fund-agent USDC CLI copy is not Yubi-gated",
      severity: "LOW",
      status: "ACCEPT",
      detail: "Main → agent USDC is inbound funding. Outbound (buy, sweep, take-profit, HIGH) is Yubi-gated. You still run the CLI.",
    },
    {
      id: "rate-limit",
      title: "Sign-in / Grok rate limit is per instance",
      severity: "LOW",
      status: "ACCEPT",
      detail: "8 sign-in tries / 10 min and 6 Grok calls / 10 min live in memory. Serverless replicas do not share the counter.",
    },
    {
      id: "argon",
      title: "Argon2 memory cost is modest",
      severity: "LOW",
      status: "ACCEPT",
      detail: "t=3, m=4096 KiB — sized for serverless. Fine after a long unique password. Not a substitute for Yubi on spend.",
    },
    {
      id: "addr-privacy",
      title: "Receive addresses are not spend keys",
      severity: "INFO",
      status: "ACCEPT",
      detail: "Profit P2SH and USDC 0x are encrypted for privacy. They cannot spend. Live send is still Coinbase/CLI after preview.",
    },
    {
      id: "os-dns",
      title: "OS / visitor DNS cannot be locked from this app",
      severity: "INFO",
      status: "ACCEPT",
      detail: "A web app cannot pin Windows/macOS resolvers or the visitor browser. Quad9/OpenDNS/AdGuard are listed as respected public recursor inventory only. This desk uses Cloudflare DoH for its own lookups. Operator: 1.1.1.1 and 1.0.0.1 on the machine that runs CLI.",
    },
    {
      id: "google-dns",
      title: "Google Public DNS used for domain probes",
      severity: "MED",
      status: "FIXED",
      detail: "probeLaunch and site-health called dns.google. Replaced with Cloudflare DoH. Host allowlist rejects dns.google and 8.8.8.8. HTTP cleartext health probe removed.",
    },
    {
      id: "practice-autofill",
      title: "Practice engine auto-fills without Yubi",
      severity: "LOW",
      status: "ACCEPT",
      detail: "5-minute HIGH BUY/ACCUMULATE writes the paper book only. Never sells BTC. Live fills stay empty while LIVE_UNLOCKED is false. No Coinbase order is sent.",
    },
    {
      id: "lab-test-tape",
      title: "L@B charts used synthetic FRED/MSTR/holders",
      severity: "MED",
      status: "FIXED",
      detail: "L@B polls fetchDesk every 5 minutes. Bot-7 call uses the live tape. What-if presets last until the next poll. HTTP + snapshot cache (25s/40s) stops desk/practice/L@B/admin from stampeding the same sources.",
    },
    {
      id: "fetch-stampede",
      title: "Five clients pulled the full tape in parallel",
      severity: "MED",
      status: "FIXED",
      detail: "One shared client poll. Two-phase server: core ≤2.4s (price/RSI/F&G/leverage/Asia/ETF) then fill (holders/news/macro). Client race 4s. Spinner 4.5s hard-stop. Public refresh cannot force a rebuild without an admin token.",
    },
    {
      id: "rebuild-unauth",
      title: "Unauthenticated full-tape rebuild",
      severity: "MED",
      status: "FIXED",
      detail: "rebuildDesk POST required no session and could stampede free APIs. It now requires a live admin token; otherwise it returns the stale tape. Public poll uses GET fetchDesk only.",
    },
    {
      id: "probe-unauth",
      title: "Public DNS / site-health probes",
      severity: "MED",
      status: "FIXED",
      detail: "probeLaunch and probeSiteHealth were open POSTs (Google DNS + fetch of s1r1us.ai). Admin token required. Unauth returns empty / 401.",
    },
    {
      id: "grok-client-tape",
      title: "Ask Grok trusted a client snapshot",
      severity: "MED",
      status: "FIXED",
      detail: "A desk session could send a fake tape and spend SuperGrok quota. Ask Grok now grades getLiveSnapshot() on the server. Client snapshot/briefs/call are ignored. Visitor Ask Grok uses BYO xAI key only.",
    },
    {
      id: "byo-session-key",
      title: "Visitor xAI key in sessionStorage",
      severity: "LOW",
      status: "MITIGATED",
      detail: "BYO key is kept in this browser session so Ask Grok can call xAI from the server (CORS). It is never written to disk, never logged, never in git. XSS could read it — same class as the admin token. Do not Ask Grok on a shared kiosk.",
    },
    {
      id: "usdc-solana",
      title: "Solana paste vs Coinbase Receive sweep",
      severity: "MED",
      status: "FIXED",
      detail: "Solana (7YmS…) is the wrong Base-app network — reject, not a sweep. Coinbase.com Advanced Receive may be swept after credit — do not use as the watch-only book. Base app Ethereum/Base 0x is an EOA; USDC stays until the operator sends. ETH RPC now uses publicnode + User-Agent (cloudflare-eth was 403).",
    },
    {
      id: "public-launch",
      title: "Launch roadmap on public tape",
      severity: "MED",
      status: "FIXED",
      detail: "SystemOverview on s1r1us.ai /s1r1us no longer prints M0–M7. Coin tab (admin) still has the launch desk. Website tab iframes the public tape only.",
    },
    {
      id: "user-paper-fill",
      title: "Desk-user paper fill via executeClip",
      severity: "LOW",
      status: "FIXED",
      detail: "UI hid fill for non-admin, but executeClip only checked unlocked. Desk and L@B now require role === admin.",
    },
    {
      id: "cycle-hang",
      title: "Run cycle spinner never stopped",
      severity: "HIGH",
      status: "FIXED",
      detail: "80 parallel fetches + 2MB llama + Coinbase L2 + hung TCP made core never return. Two-phase core/fill, MAX_INFLIGHT=8, body caps, skip mempool.space, 4s client race, 4.5s spinner cap. Verified live: ~5.7s, price painted, spinner off.",
    },
    {
      id: "hydrate-session",
      title: "SSR vs sessionStorage hydration mismatch",
      severity: "MED",
      status: "FIXED",
      detail: "useDeskTape read sessionStorage in useState, so SSR had no tape and the client first paint did. Spinner class, Bot 7 headline, and ‘just now’ vs ‘waiting’ diverged. Tape now starts empty on both trees; sessionStorage hydrates in useEffect.",
    },
    {
      id: "hl-429",
      title: "Hyperliquid / Blockstream 429 on the hot path",
      severity: "LOW",
      status: "MITIGATED",
      detail: "HL meta 429 no longer blanks the capital bar — last good 90s cache, host dead 3 min. Blockstream fee API is unused (blockchain.info unconfirmed fees). Core voters do not depend on either host.",
    },
    {
      id: "stop-loss",
      title: "Per-clip stop-loss",
      severity: "INFO",
      status: "FIXED",
      detail: "Each practice BUY lot carries a stop (default 1.5% under entry; moves to entry after +1%). Stop returns USDC. TRIM still keeps BTC. Live stop is preview-only while Coinbase is locked. Never shorts.",
    },
    {
      id: "oss-pdf-bundle",
      title: "Open-source PDF is embedded as base64",
      severity: "INFO",
      status: "ACCEPT",
      detail: "Paper download is a blob from the JS bundle so the Grok preview cannot 404 a static file. No secrets in the PDF.",
    },
    {
      id: "unowned-db",
      title: "Password hash is an unowned row",
      severity: "LOW",
      status: "MITIGATED",
      detail: "Rotate requires a valid admin session and the current password. No public reset endpoint.",
    },
  ];
}

export const OPERATOR_RULES = [
  "First door: admin name + password. Enroll two YubiKeys in Admin after you are in. X is optional.",
  "CDP key: Trade + Transfer, that portfolio only. Secret shown once — never paste it here.",
  "MCP Transfer cannot withdraw off-exchange. Take-profit BTC is a Coinbase.com Send to the profit address.",
  "Sparrow is optional worst-case backup (exchange lockout). Never import a seed into [ S1R1U$ <<L@B$>> ].",
  "Outgoing BTC or USDC requires either of the two enrolled admin YubiKeys. Enroll both in Admin first.",
  "This desk does not place live Coinbase orders. You are responsible for any trade you authorize.",
];
