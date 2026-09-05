# Publish [ S1R1U$ <<L@B$>> ] — GitHub + DigitalOcean

Repo: https://github.com/S1R1US-AI/S1R1US-LABs  
Site: https://s1r1us.ai

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

| Key | Value | Scope |
|---|---|---|
| `NODE_ENV` | `production` | run time |
| `VITE_AUTH_ENABLED` | `true` | build + run |
| `BETTER_AUTH_URL` | `https://s1r1us.ai` | run time |
| `XAI_API_KEY` | only if Ask Grok should work in prod | run time — never commit |

No `DATABASE_URL` is required at start. PGLite migrates itself.

## iOS

Same URL. Safari → Share → Add to Home Screen.
