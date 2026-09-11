# Official checkpoint — S1R1US App build #113 (live sim launch)

Updated 2026-09-11. Checkpoint 101 is finalized, **renamed**, and **pinned** for rebuild as build #111. Build **#113** folds in the 7-B0T H3DGE FUND "WHITE LABEL" download, both Matrix screensavers, and the security update. The rebuild pin stays **#111** — tag and branch do **not** move. Carbon-fiber origin tag `n3w-web-app-install-deploy-68` stays protected and is **not** moved.

| | |
|---|---|
| Name | S1R1US App build #113 (live sim launch) |
| Project | Project BTD · sub-folder S1R1US L@Bs |
| Save path | [`Project BTD/S1R1US L@Bs/checkpoint S1R1US App build #113.md`](Project%20BTD/S1R1US%20L@Bs/checkpoint%20S1R1US%20App%20build%20%23113.md) |
| Number | **113** (`CHECKPOINT_BUILD_N`) |
| Baseline | DEPLOY #68 (carbon-fiber N3W Web App Installation Build) |
| Rebuild pin | **#111** — tag **`s1r1us-app-build-111`** (pinned — do not move) |
| Git branch | `checkpoint/s1r1us-app-build-111` (pinned) **and** `main` |
| Pin commit | `d7cb6fe30b91d733662a3c870cd819e6bb0d20ac` |
| Release | https://github.com/S1R1US-AI/S1R1US-LABs/releases/tag/s1r1us-app-build-111 |
| Repo | https://github.com/S1R1US-AI/S1R1US-LABs |
| Origin tag | `n3w-web-app-install-deploy-68` (protected 6 Sep snapshot — do not move) |
| Runtime | prebuilt `.output` · `NITRO_PRESET=node-server` |
| Host | DigitalOcean App Platform · Dockerfile · HTTP 8080 · 1 GB · autodeploy **on** (`main` → live-production) |

## What this fold includes

- **7-B0T H3DGE FUND "WHITE LABEL"** (`/wh1t3`): any phone app or website user downloads the stripped OSS system and relaunches as system admin under a domain THEY control — never under S1R1US.ai. All s1r1us.ai admin rights, games, rolls, simulations, tokens, and host info stripped. Config dialog boxes (domain, menus, x accounts, webhost/DNS, encrypted token id + secret pairs, GitHub repo + admin — never S1R1US-AI/S1R1US-LABs). Go-live check fails closed on any S1R1US.ai admin data and reports on screen. Grok / Claude / GitHub Copilot builder links. OSS license notice everywhere.
- **Screensavers**: `/gm` plays a 2.5 s Matrix rain burst on open. Matrix classic runs after 5 min idle site-wide and does not lock. System admin locks/unlocks all savers in Security (LOCKED = sign out + require login).
- Top-level menu tab highlight color now matches each tab's text color (predictions tab untouched).
- Security: S3C Sweep grows to 28 checks (white-label isolation, external-AI-agent admin lockdown, W1S3 0WL$ sandbox cage). Sweep, Security tab, and morning report stay linked and share data. @_Mr_R0b0t0_ + system admin remain highest privilege — top system mandate; accumulate bitcoin sits under it. Yubi slots 1–2 next to change password.
- Live admin simulation stays **launched** on Coinbase last (or last-good tape). Carbon-fiber public tape. Live Coinbase **off**. Auto trade **LOCKED**. PR3D1CT10N$ stays paper. This host never takes bets.
- Unified DISCLAIMER (education / PoC / 100% own risk / NFA / never Coinbase / no offer of securities / **NO LEGAL FEES**). Terms and Privacy pages stay as published.
- SEO, search schema, XML sitemap, website sitemap, OSS Roadmap, instruction module (guide), research paper, and morning report updated for the fold.

## Repair / rebuild if live is corrupt

The pin is tag **`s1r1us-app-build-111`** and branch **`checkpoint/s1r1us-app-build-111`**. Both include `.output`. Do not compile on the 1 GB box.

1. Keep encrypted env (`BETTER_AUTH_SECRET`, `GROK_AUTH_CLIENT_SECRET`). `BETTER_AUTH_URL` = `https://s1r1us.ai`.
2. DigitalOcean project **live-production**. App Spec `github.deploy_on_push` may stay on. Set `github.branch` to **`checkpoint/s1r1us-app-build-111`**. Wait Healthy. Hard-refresh https://s1r1us.ai.
3. After restore, set `github.branch` back to `main` only when `main` matches commit `d7cb6fe`.
4. Do not move the tag. Do not merge empty `rebuild-output-*` PRs over this pin.

See [LAUNCH.md](LAUNCH.md) and [DEPLOY.md](DEPLOY.md).
