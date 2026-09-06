# Security policy

[ S1R1U$ <<L@B$>> ] is a bitcoin-accumulator desk. It is not a bank, not a broker, and not a token sale.

## Report a vulnerability

Email the operator privately. Do **not** open a public GitHub issue with:

- Coinbase CDP secrets, private keys, seeds, WIF, xprv
- YubiKey OTPs or public ids
- Admin passwords, session tokens, vault ciphertext
- Live portfolio UUIDs

We will rotate anything that leaked and credit a fix after it ships.

## What this codebase must never do

- Store a Coinbase API secret or wallet seed
- Place a live exchange order (preview `--dry-run` only)
- Trust a client-sent market tape for Ask Grok
- Store a visitor xAI key on disk
- Use Google Public DNS
- Fetch user-supplied URLs from the server

## Operator secrets (not in git)

| Item | Where it lives |
| --- | --- |
| Admin password (Argon2id) | Database `admin_lock` |
| YubiKeys | Database + YubiCloud |
| Treasury addresses / UUIDs | AES-256-GCM vault |
| SuperGrok | `XAI_API_KEY` server env |
| CDP / CLI | Operator machine only |
| Admin reset mailbox | `reset-mail.server.ts` only — never rendered |
| Snapshot passphrase | Sidecar `*.pass.txt` next to the `.gpg`, never inside the archive |

Public clones run on free feeds. SuperGrok is the operator Ask Grok path. Visitors Ask Grok with BYO compute (their xAI key, never stored). 7-B0T HTTP SaaS keys are hashed in `BOT7_FEED_KEY_HASHES`. Practice paper is not Coinbase. The public tree must never emit `orders create`. Admin / Yubi / vault stay out of the OSS how-to.

Encrypted project snapshots (`artifacts/*.tar.gz.gpg`) are AES-256. Do not pack `*.pass.txt`, `node_modules`, or prior `.gpg` files inside a new archive. Rotate the passphrase if a sidecar left the host.

## DNS

App lookups use Cloudflare DNS-over-HTTPS. Set `1.1.1.1` / `1.0.0.1` on the machine that runs Coinbase CLI. This app cannot lock OS DNS.


## Application firewall

Ingress is inspected in-process (OWASP CRS 4.28 paranoia level 1, not a full ModSecurity engine):

- SQLi, XSS, RCE, LFI, RFI, Log4j/JNDI, scanners, WordPress/phpMyAdmin/.env probes
- Vite `/@fs` and `?raw&import` / `?inline&import` (CVE-2025-31125 class)
- TRACE / TRACK / CONNECT denied
- CrowdSec-style local IP scoring: 8 strikes / 10 min → 30 min ban; 16 → 12 h (loopback never banned)
- Under attack: agent feed rate limits tighten for 15 minutes

Security headers set by this process: `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy` (payment=()), `X-DNS-Prefetch-Control: off`, HSTS on HTTPS. We do **not** set `X-Frame-Options: DENY` (live preview is iframed) or a blocking CSP (platform injects `https://grok.com`).

## Threat intel (free, no API key)

Admin Security tab pulls:

- [CISA KEV catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) JSON
- [OSV.dev](https://osv.dev) npm querybatch for react / vite / tanstack / better-auth / nitro

Hits that this process can virtual-patch (Vite `@fs`) are applied automatically. Node/OS patches remain operator work. Live Coinbase create stays locked.
