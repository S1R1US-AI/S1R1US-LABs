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

Public clones run on free feeds. SuperGrok is optional. Practice paper is not Coinbase.

Encrypted project snapshots (`artifacts/*.tar.gz.gpg`) are AES-256. Do not pack `*.pass.txt`, `node_modules`, or prior `.gpg` files inside a new archive. Rotate the passphrase if a sidecar left the host.

## DNS

App lookups use Cloudflare DNS-over-HTTPS. Set `1.1.1.1` / `1.0.0.1` on the machine that runs Coinbase CLI. This app cannot lock OS DNS.
