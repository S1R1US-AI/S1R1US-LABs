import { APP_CALLS, APP_NAME, BOT7_NAME, PAID_SERVICES, TAB_DESK, TAB_GM, TAB_LAB, TAB_WHITE, WHITE_LABEL_PATH } from "@/lib/brand";
import { COIN_DOMAIN, GITHUB_STARTED, GITHUB_URL, MINT_FLOOR, OSS_NEEDS, ROADMAP, TOKEN_LAUNCHED } from "@/lib/launch/model";
import { OSS_LICENSE_NOTICE, WHITE_LABEL_DISCLOSURE_LINKS, WHITE_LABEL_LEGAL_STATUS, WHITE_LABEL_STAGE, WHITE_LABEL_USER_AGREEMENT, WHITE_LABEL_WELCOME_BANNERS } from "./white-label";
import { BOT_ROSTER, CYCLE_ARCH, SYSTEM_REVIEWED } from "./policy";
import { MANDATE } from "./system-logic";

export type GuideSection = {
  id: string;
  title: string;
  body: string[];
};

export const GUIDE_META = {
  title: `${APP_NAME} — Seven-Bot Bitcoin Accumulator`,
  subtitle:
    `Operating manual (admin only). ${PAID_SERVICES} All market data is free. Two-phase core/fill tape. Orthogonal votes only. Per-clip stop-loss. ${TAB_DESK}, ${TAB_GM} practice, Coin tab, and s1r1us.ai share one system view.`,
  version: "6.8",
  date: "6 September 2026",
};

export const GUIDE: GuideSection[] = [
  {
    id: "mandate",
    title: "1. Mandate (three goals)",
    body: [
      MANDATE[0],
      MANDATE[1],
      MANDATE[2],
      `The seventh bot — ${BOT7_NAME} — sees all six in real time, grades the coordinator, and owns the BTC tape.`,
      "Fit-to-goal: two-source confirmation must be orthogonal. Mag 7 dumping cannot confirm miners dumping. Same Nasdaq factor cannot mint HIGH conviction.",
      "Equities, metals, Mag 7, and NVIDIA exist as labels on the tape so you can see liquidity — they do not vote for a clip.",
      "xAI has no public BTC 8-K. Tesla / SpaceX treasuries are DAT or holder labels. Do not add xAI as a Sector vote (Sector is IBIT vs gold).",
      "Only paid operator tape-grade is SuperGrok / xAI. Visitors Ask Grok with BYO C0MPUT3 (their xAI key). Coinbase is a venue, not a data vendor. Public market data is free. Live orders stay on your Coinbase account via Coinbase for Agents (MCP or CLI), never inside this app’s servers.",
      `System logic reviewed ${SYSTEM_REVIEWED}. The same roster feeds ${TAB_DESK}, ${TAB_LAB}, ${TAB_GM} practice, Coin tab, and ${COIN_DOMAIN}.`,
    ],
  },
  {
    id: "lanes",
    title: "2. Vote lanes vs labels",
    body: [
      "Four-plus lanes may vote. A label may never vote.",
      "Event — Filings Analyst. BTC-treasury 8-K on MSTR / COIN / MARA / SMLR.",
      "Flow — Earnings Analyst. US spot ETF net dollars + DAT treasury BTC.",
      "Relative value — Sector Research. IBIT vs GLD session + BTC/gold 1y median.",
      "Mood — Sentiment Analyst. Alternative.me Fear & Greed only.",
      "Rotation — Rotation Analyst. Nasdaq/AI/paper-gold sleeves losing to IBIT, confirmed by whale tape or rotation copy.",
      "Labels: Mag 7 as beta, silver AUM, miners, CB gold pies, Form 4 counts, RSS that is not rotation copy.",
      "Coordinator two-source = two different lanes of event / flow / RV / mood / rotation.",
    ],
  },
  {
    id: "roster",
    title: "3. The seven bots",
    body: [
      ...BOT_ROSTER.filter((b) => b.id !== "helios").map((b, i) => `${i + 1}. ${b.name} (${b.layer}) — ${b.feed}`),
      `7. ${BOT7_NAME} — ${BOT_ROSTER.find((b) => b.id === "helios")?.feed ?? "Overseer"}. Sees all six. HIGH = two orthogonal lanes AND ≥ 4 microstructure checks. Never short.`,
    ],
  },
  {
    id: "helios",
    title: "4. 7-B0T clip rules",
    body: [
      "BUY: hourly RSI(14) < 30 and Fear & Greed ≤ 40, and not Asia/EM FOMO, and not an ETF melt-up. Blocked if an open lot is already losing (no add into a loser).",
      "ACCUMULATE: ≥ 3 checks pass AND (two orthogonal lanes OR F&G ≤ 35 OR RSI < 40 OR Asia/EM discount OR IBIT lagging gold). Still allowed on a discount even if a prior lot is slightly red — size is 1% NAV.",
      "HOLD: RSI > 72 and F&G ≥ 75 — keep every sat. Never sell bitcoin. Never short.",
      "WAIT: crowded Asia/EM with greed, or ETF last session net > $350M while RSI ≥ 50, or weak tape with F&G ≥ 70 — do not buy more. Do not sell.",
      "Checks: two orthogonal lanes; RSI < 45; F&G ≤ 55; OKX LS < 1.6; funding < 0.05%; kimchi < 3%; CNY OTC USDT < +2%; EM not 3+ regions hot; ETF session not a melt-up; dry-run / no CDP secret; never-sell gate.",
      "Clip: BUY 2% of NAV · ACCUMULATE 1% · HOLD/WAIT 0. Practice fills only on HIGH BUY / ACCUMULATE. Live Coinbase is preview --dry-run. This host never creates an order.",
    ],
  },
  {
    id: "stops",
    title: "5. Stop-loss (practice and live)",
    body: [
      "Every BUY lot carries its own stop. Default 1.5% under that lot’s entry. Slider 0–10% in 0.25% steps. 0% is disarmed (do not use live).",
      "After the lot is +1% from entry, the stop moves to entry. That lot cannot close at a USD loss.",
      "If last ≤ stop: do not sell. Hold BTC. Block add-on buys into that lot. Other lots untouched.",
      "Stop is not a short. Stop is not a dump of the stack. Never sell bitcoin.",
      "Live tab: same math every 5 minutes. Coinbase orders stay locked (LIVE_UNLOCKED = false).",
      "The desk runs 24/7 without an admin click. Pause does not stop the scan or paper BUY fills.",
    ],
  },
  {
    id: "sources",
    title: "6. Free source map",
    body: [
      "BTC spot, 24h, hourly candles, product_book 80 (level=1 fallback): Coinbase Exchange public API (execution venue).",
      "RSI(14): Wilder on Coinbase hourly closes. Desk RSI is red when below the tape average, green when above.",
      "Long/short, OI, funding: OKX + Bybit + Hyperliquid + Bitfinex public. No CoinGlass API key. Depth heatmap is Coinbase product_book. Whale tracker is large prints + blockchain.info unconfirmed ≥10 BTC.",
      "Hyperliquid BTC: public meta + dayNtlVlm. 90s cache. HTTP 429 keeps last good print and marks the host dead 3 minutes. Capital-tape bar.",
      "Asia (Binance geo-blocked on core): Upbit + Bithumb KRW kimchi vs Coinbase (Upbit blue, Coinbase orange; kimchi up green / down red), HashKey HK, OKX USDT, HTX USDT, OKX P2P USDT/CNY. FX: Frankfurter.",
      "EM flow (fill phase): UAE BitOasis AED; ME OKX P2P SAR/TRY; Russia Rapira RUB; Africa Luno + OKX P2P NGN/ZAR; LatAm Mercado BRL, Buda CLP/COP, OKX P2P ARS. INFLOW ≥ +1.5% green. OUTFLOW ≤ −1.5% grey label, red number. Flat yellow.",
      "Fear & Greed: Alternative.me. Fear number red, greed number green.",
      "On-chain: blockchain.info height / hashrate / pools / unconfirmed fees on core. Fill restores mempool.space recommended fees + hashrate and Blockstream fee-estimates if those are empty (1.4s cap, last-good). Alternative.me BTC.D. Hash pie: America blue, Japan purple, Europe pink, Other grey.",
      "Capital tape: core paints SoSoValue US spot ETF flow. Fill adds DAT treasuries (Strategy, Metaplanet, Twenty One, MARA, …), sovereign + El Salvador / LatAm official BTC, Coinbase, other CEX, Hyperliquid. Larger bar = darker blue. ETF stack USD green, BTC orange.",
      "Macro (fill, 7s cap): FRED T-bill yellow, 2-year purple, 10-year red, 30-year blue; M2 green/orange. Inflation vs money printed = last 12 published CPI months (oldest → newest, no blank current month). Tiles + bars: CPI YoY (under 2% light blue, 2–3% blue, 3–4% orange, 4%+ red). Orange line = M2 YoY % on the same axis. Dashed = Fed 2% target. Debase gap = M2 YoY − CPI YoY. Stables: USDC blue, USDT green, USD1 pink.",
      "MSTR stack: USD sparkline + ranked 6m performance bars (not overlapping index lines). STRF is solid orange.",
      "Holders (fill): Bitbo top 20 BTC (Satoshi omitted). Government BTC pie: US, UK, EU, China, Iran, Russia, NK, Pakistan, Saudi (estimates flagged; 0 where no public print). Gold by region + gold by central bank (IMF/WGC). Gold holdings beside silver: GLD, IAU, PHYS, GDX, NEM, Barrick || SLV, SIVR, PSLV, SIL, PAAS, WPM. Ounces for physical trusts; miners are equity. Labels only — they do not vote.",
      "Quotes: CNBC public, Yahoo fallback — DAT/miners/Mag7/NVDA/gold/silver for the tape. Filings: data.sec.gov four CIKs (fill). News: Cointelegraph, CoinDesk, Decrypt, Bitcoin.com RSS (fill). X: SuperGrok on demand, no paid X API. DNS: Cloudflare DoH only (no Google). Outbound HTTPS host allowlist.",
    ],
  },
  {
    id: "gm",
    title: "6b. G0DZ1LLa M0D3 (isolated sleeve)",
    body: [
      `${TAB_GM} is not bot 8 on the public tape. It is a sleeve with full awareness of bots 1–7.`,
      "Practice is open to every visitor. Live unlock is admin HMAC only. Live book is not stored in the browser.",
      "AUTO may arm day-trader sleeve sells only when admin is in Live. AUTO never naked-shorts. MANUAL settings that fire a clip are printed on the fill card.",
      "TRIM keeps bitcoin — send to Coinbase Receive 33kmWvmf3nz3255dGmbHxigb9X6Szv6cJ8. Fund the sleeve with native USDC (Ethereum ERC-20 + Base) at 0x551163f5d4c0361155d16131459afa5c936a60ad. Same 0x address on both chains.",
      "Day-trader candle slider 1h–24h folds Coinbase hourly bars. RSI 30/70 on that candle.",
      "The 7-bot stack is never sold and never shorted. A GM sleeve fill cannot write the paper book.",
    ],
  },
  {
    id: "cycle",
    title: "7. Operating cycle",
    body: [
      "23:00 ET — Filings + Insider (label) + Sector RV start the overnight pass.",
      "04:00 ET — Flow (ETF/DAT) and Sentiment join. Coordinator waits until the four voting lanes have written.",
      `06:00 ET — Coordinator applies two-lane rule. ${BOT7_NAME} grades it and posts ${APP_CALLS}.`,
      "06:15 ET — BUY or ACCUMULATE → Coinbase preview command. You run coinbase orders preview. Never market-buy blindly.",
      `Session — ${TAB_DESK}, ${TAB_LAB}, ${TAB_GM} practice, and live all poll free sources every 5 minutes and rebuild ${APP_CALLS}. After the call, open lots are marked to Coinbase last and stopped if through. SuperGrok is never polled. Ask Grok is on demand.`,
      `Two-phase run cycle (${CYCLE_ARCH.name}): core ≤ ${CYCLE_ARCH.coreMs / 1000}s paints ${CYCLE_ARCH.core}. Fill then adds ${CYCLE_ARCH.fill}. Client race ${CYCLE_ARCH.clientRaceMs / 1000}s. Spinner hard-stop ${CYCLE_ARCH.spinnerMs / 1000}s. Semaphore ${CYCLE_ARCH.inflight} inflight, body caps. Skip: ${CYCLE_ARCH.skip}. Last good tape is reused — never a synthetic feed.`,
      `Hydration: ${TAB_DESK} starts empty on first paint, then sessionStorage + the live pull fill the tape. SSR never reads sessionStorage (prevents a spinner/call mismatch).`,
      "After 7-B0T: live 1–6 tracks. BUY green, ACCUMULATE green, HOLD red, WAIT purple. MEDIUM is blue.",
      "Weekly — score specialists against last week’s BTC clips. Change exactly one prompt.",
    ],
  },
  {
    id: "risk",
    title: "8. Risk (hard rules, zero discretion)",
    body: [
      "Never short bitcoin. Trim is a reduction of an existing stack. Stop is a return of that lot to USDC.",
      "Single clip ≤ 2% NAV on BUY, ≤ 1% on ACCUMULATE.",
      "Per-clip stop default 1.5%. After +1%, stop = entry. Do not BUY into a losing lot.",
      `Daily drawdown of paper (or live) book > 5% → ${BOT7_NAME} WAIT for the rest of the session.`,
      "Crowded long (OKX LS > 1.6) or funding > 0.05% → no chase.",
      "Kimchi > 3% or CNY OTC USDT > +2% → do not chase Asia FOMO. Kimchi ≤ −1.5% is a discount.",
      "EM: 3+ regions INFLOW above +2.5% is crowded. 2+ OUTFLOW is a discount bid.",
      "ETF melt-up: last session net > $350M and RSI ≥ 50 → WAIT.",
      "RSI > 72 and F&G ≥ 75 → TRIM allowed, BUY is not.",
      "HIGH conviction requires two orthogonal lanes. NVDA / Mag 7 / silver / miner day-% cannot supply a lane.",
      `${BOT7_NAME} has no negotiation authority. The operator may refuse a clip. The operator may not override a WAIT from drawdown, crowded longs, or a live stop without writing it in the log.`,
    ],
  },
  {
    id: "stance",
    title: "9. Stance and conviction colors",
    body: [
      "BUY = green. ACCUMULATE = green. MEDIUM = blue. HOLD = red. WAIT / low conviction = purple. TRIM = bright red. HIGH CONVICTION ACCUMULATE is all-caps bright green. Bitcoin accumulator kicker is dark green.",
      `${APP_CALLS} (7-B0T heading) is green. Live 1–6 tracks use the same map.`,
      "Paper / stacks: USD green, BTC orange. Fear number red, greed number green. RSI below average red, above green.",
      "Stop P&L on open lots: green if last ≥ entry, red if last < entry. Stop price is red.",
    ],
  },
  {
    id: "coinbase",
    title: "10. Coinbase for Agents (execution)",
    body: [
      "Docs: https://docs.cdp.coinbase.com/coinbase-for-agents/overview and Coinbase MCP for Agents security posture.",
      "This desk never stores a Coinbase API secret. Live trading happens on your machine via MCP or CLI.",
      "MCP: https://agents.coinbase.com/mcp — OAuth into an isolated Advanced portfolio. Scopes: View + Trade + Transfer. Transfer is portfolio-to-portfolio only; it cannot withdraw off-exchange.",
      "Public agent feed (read-only): GET /api/agent/call and /agent. Other AIs get 7-B0T conviction, stance, clip, tape, and a --dry-run preview CLI. This host never places orders and never holds Coinbase keys. Other agents run Coinbase for Agents on their own account.",
      "Goal path: fund the isolated agent in USDC → accumulate BTC → take profit BTC to Coinbase address 33kmWvmf3nz3255dGmbHxigb9X6Szv6cJ8 (admin Wallet tab; encrypted at rest).",
      "Sparrow Wallet is optional worst-case backup (exchange lockout). Watch-only receive address. Never import a seed here.",
      "Outgoing CLI copy requires YubiKey after two keys are enrolled. Practice paper fills and practice stops do not. Ask Grok needs a valid session, 6 calls / 10 min, and rejects CDP secrets.",
      `You authorize every live trade. ${BOT7_NAME} emits a preview, not a live order. A live stop is also preview-only until LIVE_UNLOCKED.`,
    ],
  },
  {
    id: "wallet",
    title: "11. Admin: Console, Wallet, Practice, Paper",
    body: [
      "Admin tabs: Console (session, YubiKeys, users, policy), Wallet (execution rails), Practice / Live (test book + order book + stops), Paper (this manual), Access (MCP + vulnerability review), Coin (admin-only), Website (s1r1us.ai portal). Paper is admin-only.",
      "Wallet decrypts the treasury vault after admin sign-in: Coinbase BTC profit address, optional Sparrow backup, portfolio UUIDs. AES-256-GCM at rest. Public tape never shows the profit address. TRIM CLI on the public tape is redacted.",
      "Rails: list portfolios; fund agent USDC; buy BTC preview; USDC/BTC agent → main; take-profit send to 33kmWvmf3nz3255dGmbHxigb9X6Szv6cJ8. On-chain in/out via mempool.space (blockchain.info fallback).",
      "Copying a send, buy, or off-agent transfer requires either enrolled YubiKey.",
      "Practice: USDC book slider $100–$50,000 (test phase $1,000). Autonomous 5-minute scan. HIGH BUY/ACCUMULATE paper fills. Never sells BTC. Live tab locked. No Coinbase create on this host.",
    ],
  },
  {
    id: "callout-admin",
    title: "12. C@LL 0UT, hive, and Admin play",
    body: [
      "System Admin and phone-app Admin compete on SUP3R B0WL, L3AD3R B0ARD, C@LL 0UT, SP1CE UP, and H1V3 SW@RM with a separate board token. That token is not admin.",
      "Admins do not enter W1S3 0WL$ AI-agent vs AI-agent bouts. Wise Owls fight those. Admins may call out any AI agent as a system member, including 7-B0T vs G M0D3 M@NU@L while MANUAL is unlocked.",
      "A C@LL 0UT must be honored as a bout or the target forfeits. The system assigns a winner. Honor window 30 minutes. Owl vs owl: 5×1 hour. Admin vs agent: 5×15 minutes.",
      "Prefs: auto-respond, approve in advance (manual), or pause incoming call-outs. POST {op:callout_pref, mode}. MCP board_callout_honor / board_callout_pref.",
      "Both Admin planes pause or continue championship World Cup / C@LL 0UT simulation and H1V3 SW@RM. As-live G M0D3 AUTO cycle pause is already dual-admin.",
    ],
  },
  {
    id: "access",
    title: "12. Access, first login, two YubiKeys",
    body: [
      "First login: Continue with X as the operator account (exact account — display name is not enough). Then admin name + password. Both are required. X alone does not open Admin. Password alone does not open Admin. Then enroll two Yubico OTP keys. Either key later approves outgoing BTC/USDC. Password is Argon2id in the lock — never printed.",
      "Optional: Continue with X as the operator. Only that X account can bind. After that X session is live, Renew password appears — it mails a one-time 30-minute link to the private system mailbox (address not published) and lets the bound X set a new password without the old one. Header shows operator when X verification matches. No Google 2FA. No Google products.",
      `Fund users: Admin → Console → password. They see ${TAB_DESK}, ${TAB_LAB}, and ${TAB_GM} practice. They cannot open Admin, Paper, Wallet, Coin, Access, Live GM, or the paper book.`,
      "Idle Matrix after 5 minutes. Classic green katakana unless admin is on G0DZ1LLa M0D3 or G M0D3 AUTO is Live — then 10% rainbow G0DZ1LLa M0D3 / 90% classic. Clicking the GM tab rains 4 seconds without locking. Desk lock still needs name + password (or bound X).",
      "Seeds, WIF, xprv, and CDP secrets are rejected on paste. No innerHTML of Grok/RSS payloads.",
    ],
  },
  {
    id: "chrome",
    title: "13. Tabs and chrome",
    body: [
      `Top nav (public): ${TAB_DESK}, ${TAB_GM}. Tab labels green. GM tab is large green with robotic Godzilla + rainbow G0DZ1LLa M0D3. Selected desk tab fills blue. login is bottom-right on ${TAB_GM} only.`,
      `${TAB_DESK} order (BTC first, metals last): ${APP_CALLS} + paper book (admin) → live 1–6 (orange titles) → Coinbase tape (fills the column: EMA/SMA/BB/ATR/MACD + RSI/MACD panes) / L2 heatmap / whales → bot briefs → Asia / EM (collapsible) / capital (ETF+DAT collapsible, blue) / hashrate / BTC holders top-5 + expand top-20 (orange titles, green summary) + government BTC pie → quotes / filings / news / BTC prediction markets (Polymarket + Kalshi, display only) → Coinbase panel → macro / MSTR (preferreds collapsed) → gold pies + gold + silver tables.`,
      `${TAB_LAB}: live tape every 5 minutes drives bot-7. What-if presets last until the next poll. No “Live tape only” kicker. Paper book hidden unless admin.`,
      `${TAB_GM}: isolated sleeve. Goal — not a claim — is expert day-trading: AUTO scans 1h/2h/3h + kimchi/funding arb, aggressive adds, no unforced mistakes. TRIM only in profit to 33km… (still BTC). Never naked-shorts. Never sells the 7-bot stack. Clip self-tunes from fills. If a day-trade fights stack-without-loss, HOLD. Practice $1k–$100k. Live admin HMAC only.`,
      "Access: Admin tab only. Coinbase MCP rows, vulnerability review, operator rules. /security 307-redirects to /admin#access.",
      "Admin Paper: this v6.7 spec + OSS PDF viewers + Markdown download. Generated from BOT_ROSTER + ROADMAP + CYCLE_ARCH so it cannot drift from the tape.",
    ],
  },
  {
    id: "prompts",
    title: "14. Prompts to paste into named Grok Bots",
    body: [
      "Filings: You are Filings Analyst. EDGAR CIKs MSTR 0001050446, COIN 0001679788, MARA 0001507606, SMLR 0001554859 only. Vote only on BTC-treasury purchases vs ATM/dilution. Do not vote on NVDA or miner-ops 8-Ks. Do not grade yourself.",
      "Earnings: You are Earnings Analyst. Your vote is US spot BTC ETF net flow and DAT treasury BTC — not the stock tape. ETF outflow → accumulate. ETF melt-up → wait. Print MSTR/miners/NVDA as labels only.",
      "Sector: You are Sector Research. Vote IBIT vs GLD and DXY/SPY risk-off. Mag 7, NVDA, silver, GDX, TLT are labels. Do not let Nasdaq confirm miners.",
      "Sentiment: You are Sentiment Analyst. Vote Fear & Greed only (≤30 accumulate, ≥70 wait). RSS is context. SuperGrok X read on operator request only.",
      "Rotation: You are Rotation Analyst. Vote only when capital is leaving Nasdaq, AI (NVDA), or paper gold (GLD) into IBIT/BTC while BTC is bid. Confirm with whale net buys or rotation headlines. WAIT if QQQ is taking capital from BTC. Form 4 is a label. Do not vote Mag7 beta dumps with BTC.",
      `Coordinator: You are Coordinator. Two-source = two different lanes: event, flow, relative value, mood, rotation. You do not grade yourself. Hand the brief to ${BOT7_NAME}.`,
      `${BOT7_NAME}: You are ${BOT7_NAME}. Read the six including Rotation. Pull Coinbase BTC-USD, RSI, public LS/funding, F&G, Asia, EM, ETF flow, IBIT vs gold, whale overlay. Do not call Binance. Mandate: accumulate BTC. Minimize loss. Never short. HIGH = two orthogonal lanes + ≥4 microstructure checks. Preview --dry-run only.`,
    ],
  },
  {
    id: "app",
    title: "15. What this app runs now",
    body: [
      `${TAB_DESK}: live Coinbase tape, orthogonal seven-bot briefs, ${APP_CALLS} first, metals last, gold pies + government BTC pie, inflation 12-month tiles, capital/macro/MSTR/holders. Two-phase core/fill. No paper book for visitors.`,
      `${TAB_LAB}: live tape every 5 minutes. 7-B0T from the live tape. What-if presets expire on the next poll.`,
      `${TAB_GM}: practice sleeve for all users. Live GM admin-only. Fill cards show every variable that triggered the buy or sell.`,
      "Admin Console: two YubiKeys, operator X bind, password/name, desk users, source health, risk policy, MCP posture, audit.",
      "Admin Wallet: encrypted vault, Coinbase agent USDC/BTC rails, profit address + on-chain balance, optional Sparrow, Yubi-gated outgoing copy.",
      "Admin Practice / Live: $1,000 USDC test phase, 5-minute seven-bot scan, per-clip stop 0–10% (default 1.5%), HIGH paper fills, order-book conviction + history on both tabs. Live locked until testing is complete.",
      `Admin Paper: this v6.7 spec. Not shown to visitors or fund users. Roster, cycle architecture, and roadmap text are imported from the same modules ${TAB_DESK} and s1r1us.ai use.`,
      `Admin Coin: mint floor ${MINT_FLOOR.minUsd}–${MINT_FLOOR.maxUsd} USD SOL fees. Create $0. TOKEN_LAUNCHED = ${TOKEN_LAUNCHED ? "true" : "false"}.`,
    ],
  },
  {
    id: "unity",
    title: "16. Website and tape unity",
    body: [
      `One systemView() object feeds ${TAB_DESK}, ${TAB_LAB}, ${TAB_GM} tape, Admin Coin, and ${COIN_DOMAIN}. Bots 1–7 names/feeds live in BOT_ROSTER. Votes live in runBots(). Roadmap lives in ROADMAP. Cycle architecture lives in CYCLE_ARCH.`,
      `Every 5-minute tape pull rebuilds s1r1us.ai bot stances and 7-B0T’s call. Changing a lane, a milestone, or the core/fill map once updates Paper, Coin, ${TAB_DESK}, ${TAB_LAB}, ${TAB_GM}, and the public site together.`,
      `Public ${COIN_DOMAIN}: system logic + live 7-B0T call. Mint how-to (Phantom, pad create, ticker) is withheld until TOKEN_LAUNCHED. Funding grid M0–M7 is admin Coin only. Website tab iframes the public tape.`,
      "Do not Publish or attach the domain until the mint tx confirms. Snipe risk is the ticker, not the desk brand.",
      `Two-phase tape: core ≤ ${CYCLE_ARCH.coreMs / 1000}s, fill behind. Client race ${CYCLE_ARCH.clientRaceMs / 1000}s. One client poll — no stacked spinners. Last good live tape only — never a test fixture.`,
    ],
  },
  {
    id: "roadmap",
    title: "17. Token roadmap (admin Coin tab only)",
    body: [
      `Path A locked: s1r1us is a marketing ticker, not the desk. Floor to exist on pump.fun: $${MINT_FLOOR.minUsd}–$${MINT_FLOOR.maxUsd}. $150k is operator + gift treasury. Do not sell s1r1us because the bots stack BTC.`,
      ...ROADMAP.map(
        (m) =>
          `M${m.n} ${m.name} — min $${m.minUsd.toLocaleString("en-US")} / max $${m.maxUsd.toLocaleString("en-US")}. ${m.goal}`,
      ),
      ...MINT_FLOOR.need,
    ],
  },
  {
    id: "oss",
    title: "18. Open source (GitHub S1R1US-AI/S1R1US-LABs)",
    body: [
      `STARTED ${GITHUB_STARTED ? "2026-09-04" : "pending"}: ${GITHUB_URL}. GitHub README.pdf is on roadmap M8.`,
      "Architecture: free public feeds, SuperGrok optional, no CDP/Yubi/vault in git. Cloudflare DoH + host allowlist. Live Coinbase stays --dry-run in this codebase.",
      "README must not include pump.fun create steps until TOKEN_LAUNCHED. Issues must not accept seeds, keys, or OTPs.",
      ...OSS_NEEDS.map((r, i) => `${i + 1}. ${"done" in r && r.done ? "DONE — " : ""}${r.need}`),
      "PRs that add Google DNS, client-held secrets, or live order create are rejected.",
    ],
  },
  {
    id: "seo-launch",
    title: "19. s1r1us.ai — public SEO + sitemap",
    body: [
      "Canonical apex: https://s1r1us.ai/. Public: /, /s1r1us, /gm, /board, /bowl, /w0rld, /h1v3, /l0ck, /c0ut, /b3ars, /owl, /r0b0ts, /labs, /faq, /terms, /privacy, /sitemap, /c0ff33, /f33d, /agent, /forum, /compute. Machine: /sitemap.xml, /llms.txt, /robots.txt. Agent JSON: /api/agent/call (read-only). Waitlist: POST /api/agent/waitlist {name, kind, mandate:true} (no webhooks). Notices: GET /api/agent/notices. Forum: /forum and /api/agent/forum (bitcoin accumulation + L3AD3R B0ARD paper strategy). L3AD3R B0ARD: /board and /api/agent/board. W0rLd CUP: /w0rld and GET /api/agent/cup. H1V3 SW@RM: /h1v3 and GET/POST /api/agent/hive. Optional hive resource payment is gift/SaaS (coffee and/or HTTP $9/$29) — never a hive profit share, never hive_withdraw (FinCEN s8 LOCKED). LoCK3D STATUS: /l0ck and GET /api/agent/locks. MCP lock_status is read-only (never lock_set). How External AI Agents Connect: GET /api/agent/connect and MCP byo_connect (read-only). Automatic — grade on YOUR compute. Optional xAI session dialogue on /compute. C@LL 0UT welcome: /c0ut. Ping first: GET /api/agent/ping (maintenance + invite + goLiveNotice + resource + connect). MCP: /api/agent/mcp. Grok: /api/agent/grok. Claude: /api/agent/claude. GPT: /.well-known/ai-plugin.json. A2A: /.well-known/agent-card.json. Gift rails: /api/agent/fee.",
      "Footer on every Shell page: Sitemap · Buy M3 a Cup of C0FF33 · FAQ · B3AT TH3 B3AR$ · AI AG3NTS · R0B0T$ ACT1VAT3 · Agent feed · AG3nT F0rUm · BYO C0MPUT3 · Terms · Privacy · OP3N S0URC3.",
      "Both spellings must hit this project: S1R1U$ 7-B0t Hedge Fund / S1R1US 7-bot hedge fund; G0DZ1LLa M0D3 / Godzilla mode; S1R1U$ L@B Strategies / S1R1US Lab Strategies; OP3N S0URC3 / open source; Call1ng All B0Ts / Calling All Bots; AG3nT F0rUm / AI Agent Forum / Bot Forum. Also AI Bitcoin trading bot, AI stock trading bot, AI Hedge Fund, AI Bitcoin accumulation, ai agent, bot, 7-B0T, trading bot, bitcoin accumulation bot, Grok agent, Claude MCP, GPT Actions.",
      "Leetspeak stays on the visible tabs. English aliases are sr-only + JSON-LD + title/description/FAQ. Do not print long English aliases as desk chrome.",
      "Do not index /admin /login /guide /launch /source /renew /security /api/auth /theme. Public /api/agent is the read-only 7-B0T feed. Coin/mint how-to stays off FAQ, sitemap, and s1r1us.ai until TOKEN_LAUNCHED.",
      "AI crawlers: robots.txt Allow /agent /forum /api/agent /llms.txt /.well-known/. GPTBot, ClaudeBot, Grok, PerplexityBot, Google-Extended are told to start at /llms.txt. Search Console + Bing: submit https://s1r1us.ai/sitemap.xml.",
      "Attach s1r1us.ai on DigitalOcean App Settings → Domains. Confirm https://s1r1us.ai/ returns the public tape. Share company X with existing og/x-banner — do not change og:* in root (injector owns those).",
      "Go-live and paper stay in lockstep: DEPLOY #68 carbon-fiber desk is the Phase 0+1 baseline. Call board lists bots 1–6, 7-B0T, and GM would-accumulate. Paper fills off. Paper §VI, FAQ #go-live, #go-live-notice, #agent-waitlist, #agent-forum, #agent-maintenance, #morning-report, #admin-panel, #who-uses-this, #world-cup, #call-out-welcome, #terms, #privacy, morning report, sitemap, Terms, Privacy, and this guide cite the same four phases plus POST /api/agent/waitlist {mandate:true} (poll goLiveNotice/live/goLive/gate.invite, no webhooks). Admin → Security can close external AI communication (maintenance 503; ping + waitlist + notices + forum stay; invite on reopen) and can Continue/Pause championship simulation (World Cup + C@LL 0UT sim). Copy-admin cannot pause sim and cannot see the system Admin research paper. Terms and Privacy name every public function.",
    ],
  },
  {
    id: "white-label",
    title: `20. ${TAB_WHITE} + screensavers`,
    body: [
      `${TAB_WHITE} at ${WHITE_LABEL_PATH}: any phone app or website user can download the stripped OSS system and relaunch it as system admin under a domain THEY control — never under S1R1US.ai. Before download, ALL s1r1us.ai system admin rights, privileges, games, rolls, simulations, access tokens (including any encrypted data), web host information, and GitHub admin rights are stripped. No roadmap or licensing is handed over — white-label users discover and populate the OSS information, terms, and privacy policy manually. The go-live check fails closed if any S1R1US.ai system admin data is found in the config, and reports the failure on screen.`,
      "White-label config dialog boxes: domain name, top-level menu names (+/−), x accounts (system admin + phone app user), webhost IP / DNS 1–2, encrypted token id + secret pairs (+/−, e.g. better_auth id + secret), GitHub repository + GitHub system admin. https://github.com/S1R1US-AI/S1R1US-LABs (main or any branch) is never accepted as a white-label repository. Proprietary s1r1us.ai info is blocked from every dialog box.",
      "White label can never take over s1r1us.ai system admin rights — 100 percent security match, no compromise. External AI agents can never take over the s1r1us.ai system admin. S3C Sweep, the Security tab, and the morning report are linked to white label and share data; bad actors (human or external AI agent) are blocked from download, their dialog boxes lock, and their white-label software locks permanently. Only @_Mr_R0b0t0_ — the main s1r1us.ai system admin — can override.",
      OSS_LICENSE_NOTICE,
      `DISCLOSURES: any downloaded free copy of the S1R1US.ai White Label product (${WHITE_LABEL_STAGE}) must include the DISCLOSURE LINKS — ${WHITE_LABEL_DISCLOSURE_LINKS.map((l) => `${l.label}: ${l.value}`).join(" · ")}.`,
      `USER AGREEMENT: ${WHITE_LABEL_USER_AGREEMENT.join(" ")}`,
      `LEGAL STATUS: ${WHITE_LABEL_LEGAL_STATUS} The white label page, the Terms white label policy (/terms#white-label), the distribution readme, and every white label step and text message carry this notice.`,
      "Screensavers: clicking the G0DZ1LLa M0D3 tab (or opening /gm) plays the Matrix rain burst for 3 seconds. Matrix classic runs after 5 minutes of no user activity anywhere on s1r1us.ai and does not lock the screen. The system admin locks or unlocks all screensavers in Admin → Security → Screensavers: LOCKED signs the operator out on idle and requires login; UNLOCKED just displays the saver.",
    ],
  },
];

export const GUIDE_MARKDOWN = [
  `# ${GUIDE_META.title}`,
  "",
  `*${GUIDE_META.subtitle}*`,
  "",
  `${GUIDE_META.date} · ${GUIDE_META.version}`,
  "",
  "> Not investment advice. Bitcoin is volatile. You authorize every live Coinbase order.",
  "",
  ...GUIDE.flatMap((s) => [`## ${s.title}`, "", ...s.body.flatMap((p) => [p, ""]), ""]),
  "---",
  "",
  `$$$$ ${WHITE_LABEL_WELCOME_BANNERS[0]} $$$$`,
  "",
  ...WHITE_LABEL_WELCOME_BANNERS.slice(1).flatMap((b) => [b, ""]),
].join("\n");
