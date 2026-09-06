# Daily ops report — 08:00 America/New_York

Do not skip a section. Do not auto-green. If unsure, keep it OPEN and say so.

## Mandates (score each 1–10, then one overall)

1. Maximize bitcoin accumulation.
2. Never sell bitcoin. Never short.
3. Minimize loss (no add into a loser; no crowded chase).
4. Honest ops: architecture, security, unresolved errors.

## Always include

- Last 24h unique errors from `/tmp/desk-errors.json` and `/tmp/desk-cycle.json`
- AGENT flags from `/tmp/agent-pings.json` (PING / BUSY / REJECT / NONE). Connection tests only. PoC — not LIVE. No trades.
- What was actually fixed (verified with live tape, not a story)
- What still needs the operator before **green**
- Architecture (two-phase cycle, 7 bots, practice autonomy, live Coinbase locked)
- Security analysis: hunter PASS/OPEN, 24h intrusion blocks, OPERATOR sessionStorage cookie. Admin → Security.
- Weaknesses (fee-blind gate, Yahoo backup, geo-blocks, serverless rate limits)

Read `src/lib/desk/error-log.ts`, `security.ts` vulnRows, `system-logic.ts` MANDATE.
If Coinbase last is missing, lead with that. Never bury an OPEN item.
