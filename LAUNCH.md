# N3W Web App Installation Build (new theme) — DEPLOY #68

Production baseline after the professional carbon-fiber desk theme. Folded 2026-09-06: FAQ admin/visitor/agent, morning-report library, Security tab, sitemap index.

- Site: https://s1r1us.ai
- Repo: https://github.com/S1R1US-AI/S1R1US-LABs
- Branch: `main`
- Official checkpoint tag: `n3w-web-app-install-deploy-68`
- Official checkpoint branch: `checkpoint/n3w-web-app-install-deploy-68`
- Host: DigitalOcean App Platform, Dockerfile, HTTP 8080, 1 GB, autodeploy **off**

This tag is the verified live desk. If the site needs repair or rebuild, deploy **this tag** (or the checkpoint branch). After a fold, rebuild `.output` here, push GitHub, then click **Deploy** on DigitalOcean.

## What is on

- Public tape (Coinbase and other free feeds). Scan / vote only.
- Public pages: desk at **https://s1r1us.ai/** (not /heliosbot), G0DZ1LLa M0D3, F33D, lab, FAQ, Privacy, Terms, sitemap, **agent feed**, B3AT TH3 B3AR$, AI AG3NTS, W1S3 0WL$ Forum, R0B0T$ ACT1VAT3, Media, Search, BYO C0MPUT3.
- Purchase-call board on the main tape: bots 1–6, 7-B0T AUTO, GM M0D3 AUTO (would-accumulate).
- Read-only Bot 7 JSON: `GET /api/agent/call` and `/agent`. `trade: false`. Coinbase `--dry-run` preview only.
- Login: Continue with X, then name + password. Admin is a separate lock (optional YubiKey).
- Go-live path STARTED 2026-09-05 (PoC rails + Auto GM/Bot 7 call board). Auto trade LOCKED.
- Path A hard firewall locked.
- Official company X: https://x.com/S1R1US_AI (`@S1R1US_AI`). `@S1R1S_AI` is not the desk.

## What is off

- Live Coinbase orders (`LIVE_UNLOCKED = false`, `LAUNCH_LIVE_TRADES = false`)
- Paper / practice fills (`fillsAllowed = false`). Extra AUTO ticks off. Live tape still runs.
- Autodeploy
- Public source pack / theme test

## Folded into #68 (6 Sep)

- Paper §VI, FAQ go-live, morning report, roadmap M8–M10, and go-live panel cite the same four phases.
- Main tape lists would-accumulate purchase calls (bots 1–6, 7-B0T AUTO, GM M0D3 AUTO).
- Admin Console: S1R1U$ M0rning R3p0rt last 14 days, 3 shown, PDF in browser.
- Admin Security: WAF, hunter, external AI on/off, data-pull pause. Agents read PAUSED/MAINTENANCE on ping.
- FAQ hashes for visitor / admin / AI agent (`#who-uses-this`, `#admin-panel`, `#morning-report`, `#sitemap-xml`).
- Sitemap index `/sitemap-index.xml` + `/sitemap.xml` (pages + images) + `/video-sitemap.xml`. `/entity.json` corporate graph.
- W1S3 0WL$ Forum LIVE. R0B0T$ ACT1VAT3. Go-live waitlist (no webhooks).
- Privacy Policy. Terms: mediation in owner-chosen venue; owners do not pay user legal expenses; unlawful use / reverse engineering / reconnaissance may bring lawsuit or criminal charges. Published GET /api/agent/ping remains allowed.

## DigitalOcean

1. GitHub `main` (or tag `n3w-web-app-install-deploy-68`) has the prebuilt `.output`. Autodeploy stays **off**.
2. Encrypted env (dashboard only): `BETTER_AUTH_SECRET`, `GROK_AUTH_CLIENT_SECRET`. Use **Add from .env** — see [DEPLOY.md](DEPLOY.md).
3. `BETTER_AUTH_URL` = `https://s1r1us.ai`
4. Click **Deploy** after this fold lands on GitHub. Do not compile on the 1 GB box.
