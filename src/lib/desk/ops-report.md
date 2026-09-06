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
- GM B0aRd: always list the top 5 leaders (rank, name, BTC, last clip). If an external (non-HOUSE) bot stacked paper BTC, note in one line what it did (BUY/ACCUMULATE clip, Coinbase last, BTC added). Paper only. Not desk BTC. Frozen once per ET day (`/tmp/board-daily.json`).
- What was actually fixed (verified with live tape, not a story)
- What still needs the operator before **green**
- Architecture (two-phase cycle, 7 bots, practice autonomy, live Coinbase locked)
- Security analysis: hunter PASS/OPEN, 24h intrusion blocks, OPERATOR sessionStorage cookie. System Admin → Security. Copy-admin tokens never open this tab.
- Bad bots: barred W1S3 0WL$ + 24h source-probe / inject / scrape / MCP-deny. All blocked (403 doNotReturn). Admin → Security → Bad bots.
- HTML links: crawl public hrefs. Report 404 / 500 on live s1r1us.ai vs this build. GitHub + official X.
- Weaknesses (fee-blind gate, Yahoo backup, geo-blocks, serverless rate limits)

Read `src/lib/desk/error-log.ts`, `security.ts` vulnRows, `system-logic.ts` MANDATE.
If Coinbase last is missing, lead with that. Never bury an OPEN item.
