# LAUNCH BUILD DEPLOY #39

Frozen production save. First starting point for the live site, GitHub, and DigitalOcean.

- Site: https://s1r1us.ai
- Repo: https://github.com/S1R1US-AI/S1R1US-LABs
- Branch: `main`
- Tag: `launch-build-deploy-39`
- Host: DigitalOcean App Platform, Dockerfile, port 8080, 1 GB, autodeploy **off**

## What is on

- Public tape (Coinbase and other free feeds). Scan / vote only.
- Public pages: desk, G0DZ1LLa M0D3, F33D, lab, FAQ, Terms, sitemap.
- Login form (X + name/password). Operator X then password for admin.

## What is off

- Live Coinbase orders (`LIVE_UNLOCKED = false`)
- Practice / test paper fills (`LAUNCH_FREEZE = true`)
- Autodeploy

## DigitalOcean (one time)

1. Create app from this repo, branch `main`, Dockerfile, HTTP 8080, 1 GB.
2. Use `.do/app.yaml`. Do not turn autodeploy on.
3. Encrypted env (dashboard only): `BETTER_AUTH_SECRET`, `GROK_AUTH_CLIENT_SECRET`.
4. Domain: s1r1us.ai + www already on the spec. Keep GoDaddy nameservers.
5. Deploy this tag. Do not compile on App Platform — `.output` is in the repo.

See [DEPLOY.md](DEPLOY.md).
