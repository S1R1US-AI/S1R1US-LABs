# Publish [ S1R1U$ <<L@B$>> ] — GitHub + DigitalOcean

**LAUNCH BUILD DEPLOY #58** — frozen save. Tag `launch-build-deploy-58`. Live tape on. Live trades off. Practice paused. Read-only agent feed on.

Repo: https://github.com/S1R1US-AI/S1R1US-LABs  
Site: https://s1r1us.ai

See [LAUNCH.md](LAUNCH.md).

## What this repo is

Node 22 web desk. Docker build uses `NITRO_PRESET=node-server` and listens on **8080**.  
Do **not** commit wallets, CDP secrets, Yubi seeds, `.env`, or `*.pass.txt`.

## DigitalOcean App Platform

1. GitHub `S1R1US-AI/S1R1US-LABs` branch **`main`**
2. Source directory **blank** (never `/`)
3. Dockerfile at repo root, HTTP **8080**
4. Autodeploy **off**
5. Size: **1 vCPU / 1 GB**
6. App spec: use `.do/app.yaml` (service name `web`, no buildpack stack)
7. `NODE_ENV=production` **run time only**. No `NODE_OPTIONS`. No database.
The Docker image is **runtime-only** (copies `.output`, no `npm install` on DigitalOcean). A 1 GB App Platform box was killing the compile in ~1 minute. After a source change, the desk must be rebuilt here and `.output` pushed before you click Deploy.


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
5. Save, then Deploy tag `launch-build-deploy-58`.

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

After env is saved: **Redeploy**. Sign in as the operator X account, then name + password. Other X accounts are users only.

Do not add Google DNS. No `DATABASE_URL` required (PGLite).

## iOS

Same URL. Safari → Share → Add to Home Screen.
