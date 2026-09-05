# [ S1R1U$ <<L@B$>> ] — Seven-Bot Bitcoin Accumulator

*Operating manual. SuperGrok is the only paid service. All market data is free.*

1 September 2026 · 1.1

> Not investment advice. Bitcoin is volatile. You authorize every live Coinbase order.

## 1. Mandate

Primary purpose: accumulate bitcoin. The desk does not short BTC, does not run leverage, and does not trade for entertainment. Equities, dollar, ETF, and filings data exist only as context for BTC timing.

The seventh bot — S1R1U$ Analyst — sees all six in real time, grades the coordinator (maker-checker), and owns the BTC tape.

Only paid dependency: SuperGrok / xAI. Coinbase is used as a venue, not a data vendor: public market data is free; live orders stay on your Coinbase account via Coinbase for Agents (MCP or CLI), never inside this app’s servers.


## 2. The seven bots

1. Filings Analyst — SEC EDGAR 8-K / 10-Q / 10-K for bitcoin-proxy names (MSTR, COIN, MARA, RIOT). Free: data.sec.gov.

2. Earnings Analyst — proxy-book tape (MSTR, COIN, IBIT) from public CNBC quotes. Free. No paid transcript vendor.

3. Sector Research — SPY, QQQ, DXY, US10Y, GLD, IBIT. Free CNBC quotes. Risk-off = dollar bid + equity dip.

4. Sentiment Analyst — Cointelegraph, CoinDesk, Decrypt, Bitcoin.com RSS; Alternative.me Fear & Greed. SuperGrok may add an X/Twitter read on demand.

5. Insider Tracker — SEC Form 3/4/5 on the same CIKs. Cluster rule from the paper: two insiders, narrow window.

6. Coordinator — synthesizes 1–5. HIGH CONVICTION requires two specialist bots to agree. The coordinator does not grade itself.

7. S1R1U$ Analyst — sees 1–6 live, plus BTC: Coinbase price/volume/RSI, OKX long/short + OI + funding, Coinbase L2 heatmap, on-chain height/hashrate, Fear & Greed, Asia tape (Upbit/Bithumb kimchi, HashKey HK, HTX, OKX CNY OTC), and EM flow tape (UAE BitOasis, Middle East P2P, Russia Rapira, Africa Luno, South America Mercado/Buda). Binance is not used. Issues ACCUMULATE / BUY / HOLD / WAIT / TRIM. Grades the coordinator.


## 3. Free source map (no Bloomberg, no CoinGlass key)

BTC spot, 24h stats, hourly candles, L2 book: Coinbase Exchange public API (api.exchange.coinbase.com). This is also your execution venue.

RSI(14): computed locally from Coinbase hourly closes (Wilder).

Long/short ratio, open interest, funding: OKX public swap API. CoinGlass heatmaps need an API key — we do not use it. The desk draws a CoinGlass-style depth heatmap from the Coinbase L2 book instead.

Asia tape (Binance is geo-blocked from this host): Upbit + Bithumb KRW (kimchi premium vs Coinbase), HashKey Hong Kong (SFC book), OKX USDT (Asia/HK volume), HTX USDT (China-adjacent offshore), OKX P2P USDT/CNY (onshore China OTC proxy). FX: Frankfurter USD→KRW/HKD/CNY.

EM flow tape (UAE / Middle East / Russia / Africa / South America): BitOasis BTC-AED; OKX P2P USDT/SAR and USDT/TRY; Rapira USDT/RUB; Luno XBTZAR and XBTNGN plus OKX P2P NGN/ZAR; Mercado Bitcoin BTC-BRL, Buda CLP/COP, OKX P2P USDT/ARS. FX: open.er-api.com. INFLOW = local rich vs USD (≥+1.5%). OUTFLOW = cheap (≤−1.5%).

Fear & Greed: Alternative.me (free JSON).

On-chain: Blockstream tip height, blockchain.info hashrate.

Equities / macro: CNBC public quote service. Yahoo Finance v8 as fallback.

News: Cointelegraph, CoinDesk, Decrypt, Bitcoin.com RSS.

Filings / insiders: SEC data.sec.gov submissions JSON. User-Agent required by SEC policy.

X/Twitter: no paid X API. SuperGrok is the X reader, user-initiated only.


## 4. Daily operating cycle

23:00 ET — Filings, Insider, Sector start the overnight pass on free sources.

04:00 ET — Earnings and Sentiment join. Coordinator waits until all five have written.

06:00 ET — Coordinator publishes the morning brief. Two-source rule is applied. S1R1U$ Analyst grades it and posts [ S1R1U$ <<L@B$>> ] CALLS (stance, conviction, clip size).

06:15 ET — If stance is BUY or ACCUMULATE, S1R1U$ Analyst writes a Coinbase preview command. You run `coinbase orders preview` first. Never market-buy blindly.

Session — S1R1U$ Analyst polls Coinbase/OKX every 60 seconds in this app when Live is on. SuperGrok is never polled. Ask Grok only when you want a narrative grade.

Weekly — score each specialist against the prior week’s BTC clips. Change exactly one prompt. This is the self-improving loop from the paper.


## 5. Risk (hard rules, zero discretion)

Never short bitcoin. Trim is a reduction of an existing stack, not a directional short.

Single clip ≤ 2% of NAV on BUY, ≤ 1% on ACCUMULATE.

Daily drawdown of paper (or live) book > 5% → S1R1U$ Analyst stance WAIT for the rest of the session.

Crowded long (OKX account long/short > 1.6) or funding > 0.05% → no chase. WAIT or HOLD.

Kimchi (Upbit vs Coinbase) > 3% or CNY OTC USDT > +2% vs FX → do not chase Asia FOMO. Kimchi ≤ −1.5% is a discount, not a short.

EM flow: 3+ regions INFLOW above +2.5% is crowded — do not chase. 2+ regions OUTFLOW is a discount bid, not a short.

RSI(14) hourly > 72 and Fear & Greed ≥ 75 → TRIM is allowed, BUY is not.

S1R1U$ Analyst has no negotiation authority on these rules. The operator may still refuse a clip. The operator may not override a WAIT that was triggered by drawdown or crowded longs without writing it in the log.


## 6. Coinbase for Agents (execution)

Docs: https://docs.cdp.coinbase.com/coinbase-for-agents/overview

This desk never stores a Coinbase API secret. Live trading happens on your machine / Grok Bot via MCP or CLI.

MCP (recommended for ChatGPT / Claude / custom harnesses): https://agents.coinbase.com/mcp — OAuth into an isolated portfolio.

CLI: `npm i -g @coinbase/coinbase-cli` then create a CDP key with Trade + Transfer, scoped to one portfolio, `coinbase env live --key-file <key.json>`.

Always preview: `coinbase orders preview --dry-run product_id=BTC-USD side=BUY type=market quote_size=100`

If the preview is acceptable: `coinbase orders create product_id=BTC-USD side=BUY type=market quote_size=100 client_order_id=$(uuidgen)` — you run that, never this app.

Operator lock (Access in the nav): admin sign-in is verified on the server. Paper clips require confirm. Ask Grok needs a valid session, is capped 6/10 min, and rejects CDP secrets.

Dry-run any write: add `--dry-run`. Convert USD↔USDC at zero fee on Coinbase if needed.

Coinbase disclaimer: you are solely responsible for reviewing and authorizing trades. S1R1U$ Analyst emits a preview, not a live order.


## 7. Prompts to paste into named Grok Bots

Filings: You are Filings Analyst. Read free SEC EDGAR (data.sec.gov) for CIKs 0001050446 MSTR, 0001679788 COIN, 0001507606 MARA, 0001167419 RIOT. Within one hour of an 8-K/10-Q/10-K, write a structured summary. No paid newswires. Do not grade yourself.

Earnings: You are Earnings Analyst. Use public quotes (CNBC or Yahoo) for MSTR, COIN, IBIT. Flag moves >2%. Map them to BTC. No FactSet, no Bloomberg.

Sector: You are Sector Research. Track SPY, QQQ, DXY, US10Y, GLD, IBIT from public quotes. Risk-off = DXY up and SPY down together. Output one paragraph plus a BTC implication.

Sentiment: You are Sentiment Analyst. Ingest Cointelegraph, CoinDesk, Decrypt, and Bitcoin.com RSS plus Alternative.me Fear & Greed. On operator request, ask SuperGrok for an X/Twitter bitcoin sentiment read. Never buy a social-data vendor.

Insider: You are Insider Tracker. Watch Form 3/4/5 on the same CIKs. Cluster = two or more insiders in five trading days. Cite Cohen-Malloy-Pomorski as the academic anchor, not as a guarantee.

Coordinator: You are Coordinator. Wait for the five specialists. HIGH CONVICTION requires two bots to agree on direction. You do not grade your own brief. Hand the brief to S1R1U$ Analyst.

S1R1U$ Analyst: You are S1R1U$ Analyst, seventh bot. You can read the other six in real time. Pull Coinbase BTC-USD (price, volume, candles, L2), compute RSI(14), pull OKX long/short, OI, funding, Alternative.me F&G, Blockstream height, the Asia tape (Upbit/Bithumb kimchi, HashKey HK, HTX, OKX CNY OTC), and the EM flow tape (BitOasis AED, OKX P2P SAR/TRY, Rapira RUB, Luno ZAR/NGN, Mercado BRL, Buda CLP/COP, OKX P2P ARS). Do not call Binance. Weight Asia more during session ASIA (23:00–08:00 UTC). Kimchi >3%, CNY OTC USDT >+2%, or 3+ EM regions hot is crowded — do not chase. Mandate: accumulate BTC. Never short. Issue STANCE / CONVICTION / CLIP_USD and a `coinbase orders preview` command. Grade the coordinator. Do not spend SuperGrok tokens except when the operator clicks Ask Grok.


## 8. What this app already runs

The [ S1R1U$ <<L@B$>> ] preview is the desk in action: live Coinbase tape, Asia venues, EM flow (UAE/ME/Russia/Africa/South America), OKX positioning, Fear & Greed, SEC filings, free headlines, seven bot briefs, [ S1R1U$ <<L@B$>> ] CALLS, a paper Coinbase book, and copy-ready CLI / preview JSON.

[ S1R1U$ <<L@B$>> ] test model (L@B in the top nav): same engine as bot 7 with sliders and presets (crash bid, Asia FOMO, EM crowded, trim). Paper clips hit the same book. Load live tape to seed knobs from Coinbase/Upbit/Luno. Not a live order.

Admin (Admin in the top nav): operator console — paper NAV, Grok cap, treasury (USDC hot / Sparrow cold), change password, 2FA (X then admin password), source health, risk policy, Coinbase MCP posture.

Paper trading fills at the Coinbase last. Use it to rehearse clips. Wire live Coinbase only after you have run previews on your own CLI/MCP.

