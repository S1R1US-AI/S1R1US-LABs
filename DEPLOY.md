# Publish [ S1R1U$ <<L@B$>> ] — GitHub + DigitalOcean

Repo: https://github.com/S1R1US-AI/S1R1US-LABs  
Site: https://s1r1us.ai (attach the domain after the first green deploy)

## What this repo is

Node 22 web desk. Docker build uses `NITRO_PRESET=node-server` and listens on **8080**.  
Do **not** commit wallets, CDP secrets, Yubi seeds, `.env`, or `*.pass.txt`.

## DigitalOcean App Platform

1. Create app from **GitHub** → `S1R1US-AI/S1R1US-LABs` → branch **`main`**
2. Source directory **blank**
3. Autodeploy **off**
4. Resource: **Dockerfile** (not a guessed Node build)
5. HTTP port **8080**
6. Size: **1 vCPU / 1 GB / 1 container** to start
7. Create. Wait for a green deploy before DNS.

## Domain

After the app is live, DigitalOcean shows a hostname like `s1r1us-labs-xxxxx.ondigitalocean.app`.
Point `s1r1us.ai` at **that** hostname (not old Vercel values).

## Env on DigitalOcean (dashboard, not GitHub)

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `VITE_AUTH_ENABLED` | `true` |
| `XAI_API_KEY` | only if Ask Grok should work in prod — never commit it |

No `DATABASE_URL` is required at start. PGLite migrates itself.
