/** GitHub-safe README body. No unescaped `$` (GFM math) and no `[title]` without a URL. */
export const GITHUB_README_MD = `# S1R1US-LABs

S1R1US Labs. Open-source AI Bitcoin hedge fund desk.

Brand: \`S1R1U$ <<L@B$>>\`

Site: https://s1r1us.ai

Repo: https://github.com/S1R1US-AI/S1R1US-LABs

License: Apache License 2.0

Search names: S1R1US 7-bot hedge fund, S1R1US Lab Strategies, Godzilla mode, AI Bitcoin trading bot, AI stock trading bot, AI Hedge Fund, open source.

Not financial advice. Not licensed. Not a broker. Not a token sale. Education only. Invest at your own risk and only on the advice of a licensed advisor.

## Mandate

1. Maximize bitcoin accumulation.
2. Minimize bitcoin loss. Never short the 7-bot stack. Never sell the stack as a day-trader.
3. Per-clip stop on add-on buys.

SuperGrok is the only paid service. All market tape is free/public.

## Tabs

- S1R1US 7-bot hedge fund — live tape. Bots 1-6 vote orthogonal lanes. Bot 7 (S1R1US Analyst) issues BUY / ACCUMULATE / HOLD / WAIT / TRIM.
- S1R1US Lab Strategies — what-if lab. Sliders overlay the last validated pull. They never write a live feed.
- Godzilla mode — isolated sleeve. Practice for everyone. Live only if an operator unlocks it. AUTO may day-trade the sleeve only, never the 7-bot stack.

## Run

Node 22. Production OS: Ubuntu 26.04 LTS. Host: DigitalOcean. DNS: Cloudflare. No Google DNS.

    npm install
    npm run dev

Optional env: XAI_API_KEY for Ask Grok. Tape still works without it.

    npm run typecheck
    npm run build

Coinbase for Agents is dry-run in this repo. Never commit CDP JSON, seeds, admin hashes, or Yubi ids.

## Disclaimer

s1r1us.ai and this desk are not licensed for financial advice and are not a recommendation to buy or sell bitcoin. Education only.
`;
