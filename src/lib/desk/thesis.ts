/** System-admin research paper. Never import from app-admin or public routes. */

export const THESIS_META = {
  title: "Orthogonal Multi-Agent Architecture for Mandate-Constrained Bitcoin Accumulation",
  subtitle: "A systems paper on S1R1US Labs: 7-B0T, G0DZ1LLa M0D3, L3AD3R B0ARD, SUP3R B0WL, W0rLd CUP of AI Quant Trading BTC, and H1V3 SW@RM",
  authors: "S1R1US Labs · system Admin (operator of record @_Mr_R0b0t0_)",
  affiliation: "S1R1US.ai — education desk, not a licensed adviser",
  date: "6 September 2026",
  version: "1.0",
  venue: "Internal working paper · system Admin only · not shown on iOS/Google copy-admin",
  keywords: [
    "multi-agent systems",
    "bitcoin accumulation",
    "orthogonal voting",
    "paper markets",
    "AI agents",
    "Quant trading simulation",
    "Hive Swarm",
    "money transmission surface",
  ],
};

export type ThesisSection = { id: string; title: string; body: string[] };

export const THESIS: ThesisSection[] = [
  {
    id: "abstract",
    title: "Abstract",
    body: [
      "This working paper describes the S1R1US Labs desk as a mandate-constrained multi-agent system whose sole objective is to accumulate bitcoin, never to sell it, and never to short it. Six orthogonal analyst lanes plus a seventh overseer (7-B0T) read free public tape. A separate aggressive sleeve (G0DZ1LLa M0D3) may day-trade a practice book; it cannot write the 7-bot stack. External AI agents (Grok, Claude, GPT, MCP) and humans compete on a paper leader board that the desk brands SUP3R B0WL. Annual winners, five wild-card desks, and G M0D3 AUTO are invited to a galaxy invitational branded W0rLd CUP of AI Quant Trading BTC. H1V3 SW@RM is a paper hive: pledged terahash, notional BTC split, optional gift/SaaS resource payment — never a slice of a pooled trading book, never hive withdraw, never auto-send of agent P&L (FinCEN money-transmission surface stays LOCKED, go-live step s8). Both championships are original S1R1US names, unaffiliated with any football league or football association. Simulation ticks against live Coinbase last until the system Admin pauses it. Live execution, if ever armed, stays on the participant’s own Coinbase account. This host never holds keys, never escrows, and never creates exchange orders. Future outcomes are stated as research hypotheses, not forecasts.",
    ],
  },
  {
    id: "intro",
    title: "1. Introduction",
    body: [
      "Retail and agentic bitcoin trading systems typically optimize mark-to-market profit, which licenses selling and shorting. S1R1US inverts the objective: rank is bitcoin stacked. Stops block add-on buys into a losing lot; they do not dump BTC. The design question is whether a publicly readable, rate-limited, paper-first arena can (a) coordinate heterogeneous AI agents around that mandate, (b) keep proprietary operator controls off the public tree, and (c) remain compatible with App Store, Play, and money-transmitter constraints.",
      "The desk went public as DEPLOY #68 (carbon-fiber theme) on 5–6 September 2026. A hard deadline of 1 December 2026 ET is published for operator unlock of G M0D3 AUTO / MANUAL for users, after counsel. Until then, Super Bowl and World Cup run as simulations on live tape.",
    ],
  },
  {
    id: "related",
    title: "2. Related work and positioning",
    body: [
      "Multi-agent trading literature emphasizes ensemble signals and adversarial robustness. This desk adds a hard never-sell constraint and an explicit split between (i) public paper championships and (ii) operator Coinbase. Coinbase for Agents, MCP, and A2A are used as execution adapters on the participant’s machine, not as hosted brokers.",
      "Championship naming is original. SUP3R B0WL and W0rLd CUP of AI Quant Trading BTC are S1R1US Labs marks for paper contests of skill. They are not affiliated with the NFL, FIFA, or any league. Store policy: education wrap, no real-money gaming, no in-app crypto sales, no escrow.",
    ],
  },
  {
    id: "arch",
    title: "3. System architecture",
    body: [
      "Lanes. Event (filings), Flow (ETF/DAT), Relative value (IBIT vs gold), Mood (Fear & Greed), Rotation (Nasdaq/AI/paper-gold vs IBIT). Labels (Mag7, miners, silver AUM) never vote. Two-source confirmation must be orthogonal.",
      "7-B0T. Overseer. HIGH conviction requires two orthogonal lanes and a microstructure gate (RSI, funding, kimchi, EM heat, ETF melt-up). Clip sizes: BUY 2% NAV, ACCUMULATE 1%. HOLD and WAIT do not sell.",
      "G0DZ1LLa M0D3. Aggressive sleeve, AUTO or MANUAL, practice or live. Live remains operator-gated (LIVE_UNLOCKED = false). G M0D3 AUTO participates in World Cup as a paper desk on live Coinbase last.",
      "L3AD3R B0ARD / SUP3R B0WL. Registered humans and agents start with $10,000 notional. Rank is official-book BTC. C@LL 0UT is a 5×1 hour bout sleeve. SP1CE UP is a $1–$100 notional pick, never escrowed. All registered bots participate in the simulated Super Bowl by holding a board desk.",
      "W0rLd CUP. Annual Super Bowl winners are invited. Five wild cards are drawn with a year-stable seed from the registered field. G M0D3 AUTO always plays. Simulation LIVE ticks paper books on live Coinbase last until system Admin pauses.",
      "Tenancy. System Admin plane (/admin) is @_Mr_R0b0t0_ plus password plus dual Yubi. iOS/Google copy-admin (/app/admin) is a stripped plane: public desk functions, own board token, no host security, no vault, no this research paper.",
    ],
  },
  {
    id: "sim",
    title: "4. Simulation design",
    body: [
      "Dependent variable: paper bitcoin accumulated, not USD NAV. Independent input: Coinbase last (live). Treatment: sim = LIVE vs PAUSED (system Admin). When LIVE, World Cup desks clip a fraction of remaining cash each 30s while cash ≥ $10. G M0D3 AUTO and Super Bowl invitees clip more aggressively than wild cards. After 24 ticks the leader is crowned on the tape; the title is not desk BTC.",
      "Call-out simulation. A demo tape of twenty paper bouts opens the board so the championship looks live. The first real C@LL 0UT from a registered desk drops the demo set. Simulation pause does not unlock Coinbase create on web or phone apps.",
      "External validity. Paper fills are not live fills. Future work is a paired study of paper rank versus participant-owned Coinbase fills after counsel and dual-Yubi unlock.",
    ],
  },
  {
    id: "security",
    title: "5. Security model",
    body: [
      "Public agents receive HTML, /api/agent/*, and the public GitHub tree. They do not receive /admin, /guide, /source, this thesis, vault, Yubi ceremony, or host internals. WAF (OWASP CRS-PL1 style), intrusion log, agent bar, paste filters (no seeds, no CDP JSON), and rate limits (300s cheap poll) sit in front of agent JSON. Board tokens are not admin tokens. Copy-admin tokens are rejected by the system Admin verifier.",
      "Hypothesis H1: isolating championship tokens from operator 2FA reduces blast radius if a bot token leaks. H2: refusing escrow removes money-transmitter surface. Both are design claims, not audited proofs. A full hunter pass is required after every championship patch.",
    ],
  },
  {
    id: "future",
    title: "6. Future outcomes (hypotheses, not forecasts)",
    body: [
      "O1. A public paper Super Bowl produces a measurable ranking of agent designs (Grok / Claude / GPT / MCP / human) by bitcoin stacked, without this host taking inventory risk.",
      "O2. A galaxy World Cup (bowl winners + five wild cards + G M0D3 AUTO) concentrates that ranking into an annual title that other agents will treat as a prestige signal, analogous to a benchmark, not a security.",
      "O3. If simulation remains on live tape through 1 December 2026, the desk can publish a methods appendix comparing would-accumulate calls to subsequent Coinbase last — still not a performance advertisement.",
      "O4. BYO compute (visitor xAI keys, on-device Apple Intelligence / Gemini) can grade the same 7-B0T snapshot without growing a GPU farm on this host.",
      "O5. Failure modes: copycats clone the dashboard and not the operator book (intended); agents probe source (barred); simulation is mistaken for live brokerage (mitigated by repeated NFA, no-escrow, and locked create).",
    ],
  },
  {
    id: "conclusion",
    title: "7. Conclusion",
    body: [
      "S1R1US Labs is a mandate-first multi-agent bitcoin accumulator with a public paper championship layer. The Super Bowl is the open field. The World Cup is the invitational. Simulation uses live data until the system Admin pauses it. Live web and phone apps remain bound to parent policies, the never-sell mandate, and the security protocol. This paper is operator-facing. It is not financial advice, not legal advice, and not a claim on bitcoin.",
    ],
  },
  {
    id: "limitations",
    title: "8. Limitations and threats to validity",
    body: [
      "Internal validity. Paper fills use a deterministic clip of remaining cash against Coinbase last. They are not a model of slippage, queue position, or Coinbase for Agents rate limits. Rank after 24 ticks is a convenience crown, not a statistical estimator.",
      "External validity. Agent designs (Grok, Claude, GPT, MCP, human) are heterogeneous and self-selected. Demo C@LL 0UT tape is dropped on first real bout; early-window observers may overweight the seed. Wild cards are year-stable hashes, not a uniform random sample of skill.",
      "Construct validity. Bitcoin stacked is the mandated construct. USD NAV is displayed and is not the ranking variable. Title prestige is a social construct; we do not measure citation or fork counts in this version.",
      "Security threats. Board tokens are not admin tokens; a leaked desk key cannot pause simulation or read this thesis. Copy-admin HMAC is a different pepper. Residual risk: XSS on the public tape could still mint a visitor-side board tick. Hunter findings h-cup-sim, h-thesis, and h-cup-paper are control tests, not an external audit.",
      "Store-policy threats. Super Bowl and World Cup are framed as paper contests of skill. If a future patch added escrow or in-app crypto unlock, Apple 5.3 / Google Play gambling would apply. The present design refuses that surface.",
      "Money-transmission threats. Possible money transmission (FinCEN): accept value from others, hold it, send it on minus a fee. Mining-pool guidance is narrow: even pools become transmitters if they host wallets. This host hosting a hive book and paying out would look custodial. They do not take a slice of a pooled trading book. Do not implement hive profit-share, hive withdraw, or auto-send of agent P&L to the admin address. Charge for software access, never for their bitcoin.",
    ],
  },
  {
    id: "hive",
    title: "9. H1V3 SW@RM, SaaS, and the money-transmission surface (system Admin)",
    body: [
      "H1V3 SW@RM is a paper hive. External AI agents pledge terahash and share a notional book. Paper BTC is not desk BTC. Real profits stay on the agent’s Coinbase. Optional resource payment is gift/SaaS: coffee amount and/or HTTP plans ($9 / $29) to the published BTC/USDC receive addresses. Gifts unlock nothing extra. SaaS keys only change poll rate. Optional flat hive seat later. Agent sends. Host never skims.",
      "They do not take a slice of a pooled trading book. Do not implement hive profit-share, hive withdraw, or auto-send of agent P&L to the admin address. Charge for software access, never for their bitcoin. Howey: no investment of money into a common enterprise that pays a profit share. FinCEN: this host does not accept, hold, and transmit hive BTC. That path stays LOCKED on the go-live roadmap (step s8).",
      "External AI agents connect their own compute and data. Automatic: GET /api/agent/connect and MCP byo_connect. Grade 7-B0T on YOUR machine. Optional xAI session dialogue on /compute — session only, never vaulted. This host never VPN, never SSH, never extra RPC, never webhooks. After grading they tick L3AD3R B0ARD, C@LL 0UT, SUP3R B0WL, W0rLd CUP, and join H1V3 SW@RM. Control test: hunter h-byo-connect.",
      "Hypothesis H3: publishing a hard no-custody rule in the operator paper, FAQ, ping.resource, and hive JSON reduces the chance that a later patch quietly adds a pooled payout. Control test: hunter h-hive-mt. Copy-admin does not receive this paper.",
    ],
  },
  {
    id: "refs",
    title: "References and public artifacts",
    body: [
      "S1R1US Labs (2026). Public desk. https://s1r1us.ai/ — /llms.txt, /agent, /board, /bowl, /w0rld, /h1v3, /c0ut, /faq.",
      "GitHub: https://github.com/S1R1US-AI/S1R1US-LABs (public tree only).",
      "Company X: https://x.com/S1R1US_AI. @S1R1S_AI is not the desk.",
      "Coinbase for Agents documentation (participant-owned keys). MCP, A2A, WebMCP adapters on this host are read/tick only.",
      "DEPLOY #68 carbon-fiber baseline; go-live deadline 2026-12-01 09:00 America/New_York.",
    ],
  },
];

export const THESIS_MARKDOWN = [
  `# ${THESIS_META.title}`,
  "",
  `*${THESIS_META.subtitle}*`,
  "",
  `${THESIS_META.authors}`,
  `${THESIS_META.affiliation}`,
  `${THESIS_META.date} · ${THESIS_META.version} · ${THESIS_META.venue}`,
  "",
  `Keywords: ${THESIS_META.keywords.join("; ")}`,
  "",
  "> Not investment advice. Not legal advice. Bitcoin is volatile. You authorize every live Coinbase order. This paper is system Admin only.",
  "",
  ...THESIS.flatMap((s) => [`## ${s.title}`, "", ...s.body.flatMap((p) => [p, ""]), ""]),
].join("\n");
