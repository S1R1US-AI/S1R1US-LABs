# N3W Web App Installation Build (new theme) — DEPLOY #68

Production baseline after the professional carbon-fiber desk theme.

- Site: https://s1r1us.ai
- Repo: https://github.com/S1R1US-AI/S1R1US-LABs
- Branch: `main`
- Official checkpoint tag: `n3w-web-app-install-deploy-68`
- Official checkpoint commit: `415e5650ee66c3ce1d2a0c10f4ce170c545f1421`
- Official checkpoint branch: `checkpoint/n3w-web-app-install-deploy-68`
- Host: DigitalOcean App Platform, Dockerfile, HTTP 8080, 1 GB, autodeploy **off**

This tag is the verified live desk. If the site needs repair or rebuild, deploy **this tag** (or the checkpoint branch), not a later untested `main`.

## What is on

- Public tape (Coinbase and other free feeds). Scan / vote only.
- Public pages: desk at **https://s1r1us.ai/** (not /heliosbot), G0DZ1LLa M0D3, F33D, lab, FAQ, Privacy, Terms, sitemap, **agent feed**, B3AT TH3 B3AR$, AI AG3NTS.
- Purchase-call board on the main tape: bots 1–6, 7-B0T AUTO, GM M0D3 AUTO (would-accumulate).
- Read-only Bot 7 JSON: `GET /api/agent/call` and `/agent`. `trade: false`. Coinbase `--dry-run` preview only.
- Login: Continue with X, then name + password.
- Go-live path STARTED 2026-09-05 (PoC rails + Auto GM/Bot 7 call board). Auto trade LOCKED.
- Path A hard firewall locked.
- Official company X: https://x.com/S1R1US_AI (`@S1R1US_AI`). `@S1R1S_AI` is not the desk.

## What is off

- Live Coinbase orders (`LIVE_UNLOCKED = false`, `LAUNCH_LIVE_TRADES = false`)
- Paper / practice fills (`fillsAllowed = false`). Extra AUTO ticks off. Live tape still runs.
- Autodeploy

## Since #58

- Paper §VI, FAQ go-live, morning report, and go-live panel cite the same four phases on DEPLOY #68.
- Main tape lists would-accumulate purchase calls (bots 1–6, 7-B0T AUTO, GM M0D3 AUTO). GM AUTO sits under Bots 1–6.
- DISCLAIMER expands/collapses under the S1R1US heading (full width). Footer OSS line sits above Sitemap.
- AI agents start at `/llms.txt` and `/agent`. Go-live waitlist: `POST /api/agent/waitlist` then poll `live` / `goLive` (no webhooks). sitemap.xml is generated from the public page list + machine URLs (A2A, GPT plugin, Bot 7 JSON, waitlist).
- Professional carbon-fiber desk theme (header weave, lighter surfaces).
- Bot 7 public thesis is a brief; full overseer dump is admin-only.
- Agent rate-limit + 20s Bot 7 cache. BYO xAI Ask Grok.
- Privacy Policy. Terms: mediation in owner-chosen venue; owners do not pay user legal expenses; unlawful use / reverse engineering / reconnaissance (probing, ICMP, vuln scans, malware) may bring lawsuit or criminal charges. Published GET /api/agent/ping remains allowed.
- Yahoo query2 charts for MSTR 6m (query1 401 from this host). FRED last-good kept on thin core.

## DigitalOcean

1. Deploy **this tag** from GitHub `main`. Autodeploy stays **off**.
2. Encrypted env (dashboard only): `BETTER_AUTH_SECRET`, `GROK_AUTH_CLIENT_SECRET`. Use **Add from .env** — see [DEPLOY.md](DEPLOY.md).
3. `BETTER_AUTH_URL` = `https://s1r1us.ai`
