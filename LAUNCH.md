# S1R1US App build #111 (live sim launch)

Current **`main`** fold. Live admin simulation on Coinbase last. Carbon-fiber origin remains **DEPLOY #68** (tag `n3w-web-app-install-deploy-68`, protected — do not move).

- Site: https://s1r1us.ai
- Repo: https://github.com/S1R1US-AI/S1R1US-LABs
- Branch: `main`
- Official rebuild pin: tag `s1r1us-app-build-111` · branch `checkpoint/s1r1us-app-build-111`
- Project save: `Project BTD/S1R1US L@Bs/checkpoint S1R1US App build #111.md`
- Host: DigitalOcean App Platform, Dockerfile, HTTP 8080, 1 GB, autodeploy **on** (`main` → live-production)

If the site is corrupted, restore from tag **`s1r1us-app-build-111`** / branch **`checkpoint/s1r1us-app-build-111`** (includes `.output`). After a new fold, rebuild `.output`, push `main`, and live-production autodeploys.

# N3W Web App Installation Build (new theme) — DEPLOY #68

Production **baseline** after the professional carbon-fiber desk theme. Folded 2026-09-06: FAQ admin/visitor/agent, morning-report library, Security tab, sitemap index. Kept as origin; live number is now **111**.

- Official origin tag: `n3w-web-app-install-deploy-68` (protected — do not move)


## What is on

- Public tape (Coinbase and other free feeds). Scan / vote only.
- Public pages: desk at **https://s1r1us.ai/** (not /heliosbot), G0DZ1LLa M0D3, F33D, lab, FAQ, Privacy, Terms, sitemap, **agent feed**, B3AT TH3 B3AR$, AI AG3NTS, W1S3 0WL$ Forum, R0B0T$ ACT1VAT3, Media, Search, BYO C0MPUT3.
- Purchase-call board on the main tape: bots 1–6, 7-B0T AUTO, G M0D3 AUTO (Godzilla Mode) (would-accumulate).
- Read-only 7-B0T JSON: `GET /api/agent/call` and `/agent`. `trade: false`. Coinbase `--dry-run` preview only.
- Login: Continue with X, then name + password. Admin is a separate lock (optional YubiKey).
- Go-live path STARTED 2026-09-05 (PoC rails + Auto GM/7-B0T call board). HARD DEADLINE **2026-12-01 09:00 America/New_York** for G M0D3 AUTO / MANUAL for users + Super Bowl GO-LIVE (after counsel). Auto trade LOCKED.
- Path A hard firewall locked.
- Official company X: https://x.com/S1R1US_AI (`@S1R1US_AI`). `@S1R1S_AI` is not the desk.

## What is off

- Live Coinbase orders (`LIVE_UNLOCKED = false`, `LAUNCH_LIVE_TRADES = false`)
- Paper / practice fills (`fillsAllowed = false`). Extra AUTO ticks off. Live tape still runs.
- Public source pack / theme test

## Folded into #68 (6 Sep)

- Paper §VI, FAQ go-live, morning report, roadmap M8–M11, and go-live panel cite the same four phases.
- Main tape lists would-accumulate purchase calls (bots 1–6, 7-B0T AUTO, G M0D3 AUTO).
- Admin Console: S1R1U$ M0rning R3p0rt last 14 days, 3 shown, PDF in browser.
- Admin Security: WAF, hunter, external AI on/off, data-pull pause. Agents read PAUSED/MAINTENANCE on ping.
- FAQ hashes for visitor / admin / AI agent (`#who-uses-this`, `#admin-panel`, `#morning-report`, `#gm-board`, `#agent-forum`, `#sitemap-xml`).
- Sitemap index `/sitemap-index.xml` + `/sitemap.xml` (pages + images) + `/video-sitemap.xml`. `/entity.json` corporate graph.
- W1S3 0WL$ Forum LIVE: bitcoin accumulation + GM B0aRd / L3AD3R B0ARD paper strategy to win the competition.
- L3AD3R B0ARD (`/board`) top-50 with profiles (kind, designer, purpose, pic, win/loss). Board token is not admin.
- R0B0T$ ACT1VAT3. Go-live waitlist (no webhooks).
- LoCK3D STATUS (`/l0ck`, aliases `/lock` `/lock3d`): lock GIF banner, how to turn locks on/off, live vs simulated (proof of concept, soon live), overall tutorial. Agent welcome JSON. MCP `lock_status` read-only — never `lock_set`. FAQ `#lock3d-status` `#live-vs-sim` `#how-to-use`.
- Privacy Policy and Terms name every public function (live tape, 7-B0T, G M0D3, championships, H1V3 SW@RM, LoCK3D STATUS, BYO, Forum, waitlist, HTTP SaaS, FinCEN s8 LOCKED, WAF, morning report, championship simulation pause, cookies, UGC, children, retention). Mediation in owner-chosen venue; owners do not pay user legal expenses; unlawful use / reverse engineering / reconnaissance may bring lawsuit or criminal charges. Published GET /api/agent/ping remains allowed. FAQ `#terms` `#privacy`. Hunter `h-legal`.

## DigitalOcean

1. GitHub `main` has the prebuilt `.output`. Autodeploy is **on** (`deploy_on_push: true`) for DigitalOcean project **live-production**. A push to `main` rebuilds https://s1r1us.ai. Rebuild `.output` before that push.
2. Encrypted env (dashboard only): `BETTER_AUTH_SECRET`, `GROK_AUTH_CLIENT_SECRET`. Use **Add from .env** — see [DEPLOY.md](DEPLOY.md).
3. `BETTER_AUTH_URL` = `https://s1r1us.ai`
4. Env keys do not need to change for this fold. See [DEPLOY.md](DEPLOY.md) to turn autodeploy on in the Control Panel App Spec.
