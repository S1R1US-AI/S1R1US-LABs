# Contributing

Company GitHub: https://github.com/S1R1US-AI/S1R1US-LABs

This desk accumulates bitcoin. PRs that fight that mandate will be closed.

## Rules

1. No secrets in git. No admin hashes, Yubi ids, CDP JSON, seeds.
2. No live Coinbase `orders create`. Preview `--dry-run` only.
3. No Google DNS (`dns.google`, 8.8.8.8). Cloudflare DoH only.
4. No `dangerouslySetInnerHTML` of RSS or Grok text.
5. New hosts must be added to the outbound allowlist in `src/lib/desk/net-guard.ts`.
6. Bots 1–6 stay orthogonal. Labels (Mag 7, NVDA, silver pies) do not vote.
7. Do not put pump.fun mint steps in README until the mint tx is confirmed.
8. SuperGrok is the only paid feed. Do not add paid market-data keys as required.
9. Public tabs keep leet + plain SEO titles (S1R1U$ 7-B0t Hedge Fund / S1R1US 7-bot hedge fund, G0DZ1LLa M0D3 / Godzilla mode, F33D H0ST1Ng / Feed Hosting, S1R1U$ L@B Strategies / S1R1US Lab Strategies, OP3N S0URC3 / open source).
10. F33D / FAQ wallets are hosting fees only. Do not mix them with the trading book or a token.
12. Production autodeploys from `main`. Rebuild `.output` (`npm run build:do`) and commit it with the source before you push, or live s1r1us.ai will keep the last image.

## Checks

`npm run typecheck` and `npm run build` must pass. Keep the public desk usable without auth.
