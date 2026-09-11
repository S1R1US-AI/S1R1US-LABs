# Publish [ S1R1U$ <<L@B$>> ] — GitHub + DigitalOcean

**Official checkpoint:** [CHECKPOINT.md](CHECKPOINT.md) — **S1R1US App build #113 (live sim launch)**. Pin: tag `s1r1us-app-build-111` · branch `checkpoint/s1r1us-app-build-111`. Carbon-fiber origin tag `n3w-web-app-install-deploy-68` stays protected.

**S1R1US App build #113 (live sim launch)** — live admin simulation on Coinbase last. G M0D3 AUTO, AI agents, and PR3D1CT10N$ paper tick while LIVE. Live trades off. Auto trade LOCKED. Carbon-fiber baseline DEPLOY #68.

Repo: https://github.com/S1R1US-AI/S1R1US-LABs  
Site: https://s1r1us.ai

See [LAUNCH.md](LAUNCH.md).

## What this repo is

Node 22 web desk. Docker build uses `NITRO_PRESET=node-server` and listens on **8080**.  
Do **not** commit wallets, CDP secrets, Yubi seeds, `.env`, or `*.pass.txt`.

## DigitalOcean App Platform — live production

| | |
|---|---|
| Site | https://s1r1us.ai |
| GitHub | `S1R1US-AI/S1R1US-LABs` (never `s1r1us.ai/your-repo`) |
| Branch | `main` |
| Autodeploy | **on** (`deploy_on_push: true`) — a push to `main` rebuilds live |
| Spec | [`.do/app.yaml`](.do/app.yaml) |
| App name | `s1r1us-labs` |
| Live project | **live-production** (`b0289cfa-8b5c-4661-b433-b8470a1fb120`) |
| Staging project | **first-project** (leave it; do not point this spec at staging) |
| Dockerfile | root · HTTP **8080** · copies prebuilt `.output` · **1 GB** |
| Source directory | blank (never `/`) |

The 1 GB box cannot compile. The image copies `.output`. After a source change, rebuild `.output` (`npm run build:do`) and **commit it with the source** before you push `main`. Then DigitalOcean deploys by itself.

Only **one** App Platform app may own `S1R1US-AI/S1R1US-LABs`. If staging in `first-project` already uses that repo, disconnect it or move it off `main` before live-production takes the repo.

### Turn autodeploy on (one Control Panel pass)

DigitalOcean cannot change the GitHub repo from a button — you edit the App Spec. Encrypted env stays on the dashboard. **Change only the `github` block.** Do not delete SECRET rows.

1. Open project **live-production** (not first-project).
2. Open the **s1r1us-labs** app that serves s1r1us.ai. If the app still lives in first-project, Settings → move it into live-production first.
3. **Settings → App Spec → Edit**.
4. Set the `github` block to exactly:

```yaml
github:
  repo: S1R1US-AI/S1R1US-LABs
  branch: main
  deploy_on_push: true
```

5. Save / **Upload File**. The app rebuilds.
6. If DigitalOcean asks to authorize GitHub, approve the DigitalOcean GitHub App on org **S1R1US-AI** for repo **S1R1US-LABs**.
7. Confirm encrypted **`BETTER_AUTH_SECRET`** and **`GROK_AUTH_CLIENT_SECRET`** are still there after save.

New app (only if live-production has none): Create App → GitHub → `S1R1US-AI/S1R1US-LABs` → branch `main` → Autodeploy **on** → Dockerfile · HTTP 8080 · 1 GB → then **Add from .env** (below) and attach s1r1us.ai.

### Optional GitHub Action (manual backup)

Native autodeploy is the live path. Do **not** also run the Action on every push (that double-deploys).

[`.github/workflows/digitalocean-live.yml`](.github/workflows/digitalocean-live.yml) is **Run workflow** only. Add GitHub secret `DIGITALOCEAN_ACCESS_TOKEN` (DigitalOcean personal access token, write). Then Actions → **Deploy live-production** → Run workflow.

## GoDaddy DNS (already set)

Nameservers stay on GoDaddy. Do not change them.

| Type | Name | Value | TTL |
|---|---|---|---|
| A | `@` | `162.159.140.98` | ½ hour |
| A | `@` | `172.66.0.96` | ½ hour |
| A | `www` | `162.159.140.98` | ½ hour |
| A | `www` | `172.66.0.96` | ½ hour |

Delete leftover Vercel A `76.76.21.21` and `cname.vercel-dns.com`.

Then DigitalOcean **Settings → Domains → add s1r1us.ai** (and www). TLS issues only after a **green** deploy + that attach.

## Env on DigitalOcean (dashboard, not GitHub)

**Add from .env:** Settings → **web** → Environment Variables → Edit → **Add from .env**. Paste the filled `.env` (never GitHub). After import:

1. Encrypt **`BETTER_AUTH_SECRET`** and **`GROK_AUTH_CLIENT_SECRET`**.
2. Replace `PASTE_GROK_APP_SETTINGS_CLIENT_SECRET` with the real secret from **Grok App Settings → Auth**.
3. Confirm `GROK_AUTH_CLIENT_ID` is the full `grok_a3389f926a0c42b3b1c95fec1287e3ef` (no ellipsis). Do not encrypt the client id so you can read it.
4. If `BETTER_AUTH_SECRET` is already encrypted on the host, keep that row — do not overwrite it.
5. Save. Autodeploy on `main` picks up later pushes.

Template in git: [`.env.example`](.env.example). Filled `.env` is gitignored.

| Key | Value | Scope |
|---|---|---|
| `NODE_ENV` | `production` | run time |
| `VITE_AUTH_ENABLED` | `true` | run time (also baked in the image) |
| `BETTER_AUTH_URL` | `https://s1r1us.ai` | run time |
| `BETTER_AUTH_SECRET` | long random hex (32+ bytes) | run time — **encrypted** |
| `GROK_AUTH_ISSUER` | `https://auth.grok.me` | run time |
| `GROK_AUTH_CLIENT_ID` | `grok_a3389f926a0c42b3b1c95fec1287e3ef` | run time |
| `GROK_AUTH_CLIENT_SECRET` | from Grok App Settings → Auth (encrypted) | run time — **never GitHub** |
| `XAI_API_KEY` | only if Ask Grok should work in prod | run time — never commit |

X sign-in on https://s1r1us.ai/login uses **Continue with X** (Grok broker → X). The preview OAuth client only allows `*.grok-sandbox.com`. Production needs the `GROK_AUTH_*` pair above so the callback `https://s1r1us.ai/api/auth/oauth2/callback/grok-x` is accepted.

Sign in as the operator X account, then name + password. Other X accounts are users only.

Do not add Google DNS. No `DATABASE_URL` required (PGLite).

## iOS

Same URL. Safari → Share → Add to Home Screen.
