# LAUNCH BUILD DEPLOY #57

Frozen production save. Next starting point after #39 for the live site, GitHub, and DigitalOcean.

- Site: https://s1r1us.ai
- Repo: https://github.com/S1R1US-AI/S1R1US-LABs
- Branch: `main`
- Tag: `launch-build-deploy-57`
- Host: DigitalOcean App Platform, Dockerfile, HTTP 8080, 1 GB, autodeploy **off**

## What is on

- Public tape (Coinbase and other free feeds). Scan / vote only.
- Public pages: desk at **https://s1r1us.ai/** (not /heliosbot), G0DZ1LLa M0D3, F33D H0ST1Ng (Feed Hosting), lab, FAQ, Terms, sitemap.

- Login: Continue with X, then name + password. Operator X is matched by **handle**, not display name.
- Path A hard firewall locked (desk gifts ≠ token ≠ F33D hosting).
- USDC gifts: Ethereum ERC-20 + Base, same `0x` address. Native Circle USDC only.

## What is off

- Live Coinbase orders (`LIVE_UNLOCKED = false`)
- Practice / test paper fills (`LAUNCH_FREEZE = true`)
- Autodeploy

## Since #39

- F33D tab renamed **F33D H0ST1Ng** (Feed Hosting).
- Gift receipt on F33D / FAQ / Terms: unconditional gift, no tokens, no upside, no tax advice.
- Operator X: broker UUID no longer blocks the real operator handle. After deploy: sign out, Continue with X again, then name + password.
- Path A standing order in the Coin tab and public copy.

## DigitalOcean

1. Deploy **this tag** from GitHub `main`. Autodeploy stays **off**.
2. Encrypted env (dashboard only): `BETTER_AUTH_SECRET`, `GROK_AUTH_CLIENT_SECRET`. Use **Add from .env** — see [DEPLOY.md](DEPLOY.md). Never commit a filled `.env`.
3. `GROK_AUTH_CLIENT_ID` = full `grok_a3389f926a0c42b3b1c95fec1287e3ef` (no ellipsis).
4. `BETTER_AUTH_URL` = `https://s1r1us.ai`
5. Domain: s1r1us.ai + www. Keep GoDaddy nameservers.
6. Do not compile on App Platform — `.output` is in the repo.

See [DEPLOY.md](DEPLOY.md).
