# S1R1US-LABs

**LAUNCH BUILD DEPLOY #58** — frozen production save. Tag `launch-build-deploy-58`. Live data pulls on. Live trades off. Practice/test runs paused. Read-only agent feed on. See [LAUNCH.md](LAUNCH.md).

**[ S1R1U$ <<L@B$>> ]** — S1R1US Labs. Open-source AI Bitcoin hedge fund desk.

Site (live): https://s1r1us.ai

Repo: https://github.com/S1R1US-AI/S1R1US-LABs

License: Apache License 2.0

Search names (both spellings index this project):

- S1R1U$ 7-B0t Hedge Fund = S1R1US 7-bot hedge fund
- G0DZ1LLa M0D3 = Godzilla mode = Godzilla Mode
- F33D H0ST1Ng = Feed Hosting
- T0K3N L@UNCH = Token launch
- S1R1U$ L@B Strategies = S1R1US Lab Strategies
- OP3N S0URC3 = open source
- AI Bitcoin trading bot · AI stock trading bot · AI Hedge Fund

Not financial advice. Not licensed. Not a broker. Not an investment adviser. Not an offer of securities. Education only. Seek a licensed professional. Invest at your own risk and only on the advice of a licensed advisor. Using https://s1r1us.ai is agreement to the Terms and Agreements.

## Mandate

1. Maximize bitcoin accumulation.
2. Minimize bitcoin loss. Never short the 7-bot stack. Never sell the stack as a day-trader.
3. Per-clip stop on add-on buys.

SuperGrok is the only paid service. All market tape is free/public.

## Tabs

Hover titles use the leet name plus the plain alias.

| Tab | Also searched as | What it is |
|---|---|---|
| S1R1U$ 7-B0t Hedge Fund | S1R1US 7-bot hedge fund | Live tape. Bots 1-6 vote orthogonal lanes. Bot 7 (S1R1U$ Analyst) issues BUY / ACCUMULATE / HOLD / WAIT / TRIM. |
| S1R1U$ L@B Strategies | S1R1US Lab Strategies | What-if lab. Sliders overlay the last validated pull. They never write a live feed. |
| G0DZ1LLa M0D3 | Godzilla mode | Isolated sleeve. Practice for everyone. Live only if an operator unlocks it. AUTO may day-trade the sleeve only, never the 7-bot stack. |
| F33D H0ST1Ng | Feed Hosting | Hosting / domain / iOS / Play app fees. Same wallets as FAQ. Not the trading book. Not a token. |

Public URLs: https://s1r1us.ai/ · `/gm` · `/f33d` · `/helios` · `/faq` · `/terms` · `/sitemap`

Company desk on X: [@S1R1S_AI](https://x.com/S1R1S_AI) — brand account, not admin.

## T0K3N L@UNCH (Token launch)

A cultural ticker named s1r1us may exist on a public pad such as pump.fun. This repo and s1r1us.ai do not sell it, do not take orders for it, and do not promise profit from the 7-bot's work. It is not shares of the desk, not a claim on bitcoin, and not how the book is funded. Do not buy any ticker because bots or a bitcoin stack exist. Path A (hard firewall) is locked.

## Support (optional)

Donations cover web hosting, s1r1us.ai registration, and operation of the open-source web app, iOS app, and Google Play app. Unconditional gift. No tokens. No upside. No tax advice. Not an investment.

- BTC: `33kmWvmf3nz3255dGmbHxigb9X6Szv6cJ8`
- USDC (Ethereum ERC-20 + Base): `0x551163f5d4c0361155d16131459afa5c936a60ad` — same 0x on both chains; native Circle USDC only

## Publish (GitHub + DigitalOcean)

See [DEPLOY.md](DEPLOY.md). App Platform: **Dockerfile**, HTTP **8080**, **1 GB RAM**, autodeploy **off**. Custom domain **s1r1us.ai** is attached. Keep GoDaddy nameservers; A records to DigitalOcean ingress IPs.

Node 22. Host: DigitalOcean App Platform. No Google DNS.

    npm install
    npm run dev

Optional env: XAI_API_KEY for Ask Grok. Tape still works without it.

    npm run typecheck
    npm run build

Coinbase for Agents is dry-run in this repo. Never commit CDP JSON, seeds, admin hashes, or Yubi ids.

## Disclaimer

s1r1us.ai and this desk are not licensed for financial advice and are not a recommendation to buy or sell bitcoin or any token. Education only. Seek a licensed professional. Using the website is agreement to /terms.
