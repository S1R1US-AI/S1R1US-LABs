# Publish [ S1R1U$ <<L@B$>> ] — GitHub + DigitalOcean

Repo: https://github.com/S1R1US-AI/S1R1US-LABs  
Site: https://s1r1us.ai (attach the domain after the first green deploy)

## What this repo is

Node 22 web desk. Docker build uses `NITRO_PRESET=node-server` and listens on **8080**.  
Do **not** commit wallets, CDP secrets, Yubi seeds, `.env`, or `*.pass.txt`.

## 1. Put this tree on `main`

GitHub → **Add file** → **Upload files** (or GitHub Desktop).  
Need at the **root** of `main`:

- `package.json`
- `package-lock.json`
- `Dockerfile`
- `src/`
- `public/`
- `scripts/`
- `server/`
- `migrations/`
- `vite.config.ts`

Replace the stub `package.json` (`echo skip`) with this one.

## 2. DigitalOcean App Platform

1. Create app from **GitHub** → `S1R1US-AI/S1R1US-LABs` → branch **`main`**
2. Source directory **blank**
3. Autodeploy **off**
4. Resource: **Dockerfile** (not a guessed Node build)
5. HTTP port **8080**
6. Size: **1 vCPU / 1 GB / 1 container** to start
7. Create. Wait for a green deploy before DNS.

If a deploy fails after “cloned repo” / “dockerfile build”: App Platform was skipping the compiler (`vite` is a devDependency). The Dockerfile now forces `npm install --include=dev` and skips Playwright browsers. Click **Deploy** again (autodeploy is off) after GitHub has the new Dockerfile + `package-lock.json`.

## 3. Domain (wait for the exact DNS)

After the app is live, DigitalOcean shows a hostname like `s1r1us-labs-xxxxx.ondigitalocean.app`.  
Then in GoDaddy, point `s1r1us.ai` at **that** hostname (not the old Vercel values).  
Paste the DigitalOcean DNS rows here when you have them — do not guess A/CNAME.

## 4. Env on DigitalOcean (dashboard, not GitHub)

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `VITE_AUTH_ENABLED` | `true` |
| `XAI_API_KEY` | only if Ask Grok should work in prod — never commit it |

No `DATABASE_URL` is required at start. PGLite migrates itself.

## 5. iOS

Same URL. Safari → Share → Add to Home Screen. No extra RAM plan.
