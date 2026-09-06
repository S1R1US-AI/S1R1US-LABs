import { APP_NAME, TAB_DESK, TAB_FEED, TAB_GM, TAB_LAB } from "@/lib/brand";
import { ADMIN_X_HANDLE, COMPANY_X_BIO, companyHandleSet, COMPANY_X_HANDLE } from "@/lib/desk/x-admin";
import { SUPPORT_GIFT_RECEIPT } from "@/lib/desk/support";

/** Token is s1r1us. Project/desk stays [ S1R1U$ <<L@B$>> ]. $ is not DNS or ticker. Domain is s1r1us.ai */
export const COIN_NAME = "s1r1us";
export const COIN_TICKER = "s1r1us";
export const COIN_DISPLAY = COIN_NAME;
export const COIN_DOMAIN = "s1r1us.ai";
export const COIN_STANDARD = "Solana SPL via pump.fun bonding curve · USDC pair";
export const COIN_CHAIN_REC =
  "pump.fun on Solana — $0 mint, USDC curve. Robinhood Chain (hood.fun / PONS / pools.trade) is the close #2, not too early.";
export const MINT_STEPS = [
  "Create a dedicated Solana wallet (Phantom / Backpack). Fund with a few dollars of SOL for tx fees only — not the $150k. Never put desk Yubi / Coinbase keys in this wallet.",
  "On pump.fun: create coin. Name s1r1us, ticker s1r1us. Do not set the website to s1r1us.ai (that host is the desk). No desk, bots, or BTC stack in the coin description.",
  "Do not seed a Uniswap/Raydium pool. Curve is the marketing market. Graduation LP locks. That LP is not the desk book.",
  "Gifts of BTC/USDC go to the desk Coinbase book and get nothing back — no s1r1us. Do not send desk gifts to the mint or the curve.",
  "Alt pad (hood.fun / PONS) is still a marketing mint, not a desk raise.",
  "Path A: s1r1us is a marketing ticker. It is not the 7-bot fund. Do not pitch buying it because the desk stacks BTC.",
] as const;

export const PLATFORM_ROWS = [
  {
    id: "pump",
    name: "pump.fun (Solana)",
    viral: "Best durable tape",
    launchUsd: "$0 mint · $0 seed LP",
    pair: "USDC or SOL",
    verdict: "Still pick. Deepest meme retail. Curve is not F33D and not the desk book.",
    pick: true,
  },
  {
    id: "rh",
    name: "Robinhood Chain — hood.fun / PONS / pools.trade",
    viral: "Hot now (CASHCAT, $1B weeks)",
    launchUsd: "$0 mint · curve, no seed LP",
    pair: "ETH / USDG (bridge USDC)",
    verdict: "Close #2. Pump.fun-style pads live. Pad churn (Noxa died). Convert USDC→USDG.",
    pick: false,
  },
  {
    id: "base",
    name: "Base (Coinbase L2)",
    viral: "Medium",
    launchUsd: "Gas + seed USDC LP or Clanker",
    pair: "USDC native",
    verdict: "Third. Coinbase onramp. Thinner new-meme tape than RH or pump.",
    pick: false,
  },
  {
    id: "sol",
    name: "Solana SPL / Raydium",
    viral: "High if listed",
    launchUsd: "~$5k–$25k seed LP",
    pair: "SOL / USDC",
    verdict: "Skip if pump exists — you pay for a pool pump gives free.",
    pick: false,
  },
  {
    id: "eth",
    name: "Ethereum ERC-20",
    viral: "Low for new tickers",
    launchUsd: "Gas + $25k–$100k+ LP",
    pair: "ETH / USDC",
    verdict: "PEPE/SHIB already won. New launches die on gas.",
    pick: false,
  },
  {
    id: "icp",
    name: "ICP ICRC-1",
    viral: "Near zero",
    launchUsd: "Cheap cycles, empty book",
    pair: "ICP / ckBTC",
    verdict: "Dropping it was correct. See ICP note.",
    pick: false,
  },
] as const;

export const ICP_NOTE =
  "ICP the coin still trades on big CEXes (~tens of $M/day). That is not retail for a new ICRC-1. ICPSwap/Sonic volumes are a rounding error next to pump.fun (peak days >$1B). Daily ICP app users are in the low thousands. A new s1r1us ledger would have no buyers, no meme UI, no USDC curve. Cheap to mint, impossible to go viral. Removal was not a bad decision.";

export const RH_NOTE =
  "Robinhood Chain mainnet July 1, 2026 is not 'too early.' hood.fun clones pump.fun (bonding curve, ~6.5 ETH graduation, LP lock). PONS printed thousands of tokens/day and has posted billion-dollar weeks; $PONS ran as the chain's largest ticker. Uniswap Labs pools.trade is $0 launchpad fee into locked Uniswap v4. Noxa (CASHCAT) went dark in days — pad risk is real. Chain gas is ETH; native stable is USDG (USDC bridges in via Across). Stock tokens are geo-restricted (not US); permissionless memes are not the same product. pump.fun's own app now routes some RH tokens in SOL with no bridge. For s1r1us, RH is the viral runner-up. Primary stays pump.fun because donations are USDC/BTC and the USDC curve needs no ETH/USDG hop.";

export const TOKEN_LAUNCHED = true;

export type Milestone = {
  id: string;
  n: number;
  name: string;
  when: string;
  goal: string;
  minUsd: number;
  maxUsd: number;
  publicAfterMint: boolean;
  hold: string;
  started?: boolean;
  artifact?: { label: string; href: string };
};

/** Admin-only until TOKEN_LAUNCHED. Min/max cash to hit the goal — not a promise of proceeds. */
export const ROADMAP: Milestone[] = [
  {
    id: "m0",
    n: 0,
    name: "Stealth / Coin tab",
    when: "Pre-mint — done",
    goal: `Admin-only Coin tab, ${TAB_DESK} + ${TAB_LAB} + ${TAB_GM} + ${TAB_FEED} on the live tape. Mint how-to stays off the public tape.`,
    minUsd: 0,
    maxUsd: 400,
    publicAfterMint: false,
    hold: "s1r1us.ai is live. F33D is hosting/domain donate, not the token. Company X is @S1R1US_AI — never admin. @S1R1S_AI was accidental and is not the desk.",
    started: true,
  },
  {
    id: "m1",
    n: 1,
    name: "T0K3N L@UNCH / Token launch",
    when: "Company X @S1R1US_AI — pad screenshot posted",
    goal: "Cultural ticker s1r1us on a public pad (pump.fun). Not a sale of the desk. Not a claim on BTC. No buy CTA on s1r1us.ai.",
    minUsd: 5,
    maxUsd: 80,
    publicAfterMint: true,
    hold: "Path A firewall. This site does not sell tokens. Mint recipe stays admin-only. Do not pitch bots or BTC as the reason to buy.",
    started: true,
  },
  {
    id: "m2",
    n: 2,
    name: "Bonding curve",
    when: "Hours–days after mint",
    goal: "Retail buys the curve. No Uniswap seed. Do not put F33D or desk gifts on the curve.",
    minUsd: 0,
    maxUsd: 5000,
    publicAfterMint: false,
    hold: "Max is optional operator inventory, not F33D, not desk gifts. $0 still launches.",
  },
  {
    id: "m3",
    n: 3,
    name: "Graduate → PumpSwap",
    when: "Curve completes",
    goal: "0.015 SOL graduation, LP locks. Token is a normal SPL. Still not a sale of the book.",
    minUsd: 0,
    maxUsd: 2500,
    publicAfterMint: true,
    hold: "Graduation fee comes from curve. Max = optional extra USDC into locked LP.",
  },
  {
    id: "m4",
    n: 4,
    name: "Publish s1r1us.ai + X",
    when: "Domain attached — public tape live. Mint still gated.",
    goal: `s1r1us.ai + www on App Platform. Public chrome: S1R1US Live Tape + S1R1US L@Bs + GM + F33D + AI Agents + FAQ. ${TAB_DESK} tape + ${TAB_GM} + ${TAB_FEED} + ${TAB_LAB}. Hover titles use leet + plain SEO aliases. Official X @S1R1US_AI. No mint how-to on those pages.`,
    minUsd: 0,
    maxUsd: 2000,
    publicAfterMint: true,
    hold: "Site is live. F33D / FAQ wallets are hosting + app-store fees only — not the trading book and not the token. Max = polish / organic X. Do not put pump.fun on the tape.",
  },
  {
    id: "m5",
    n: 5,
    name: "Counsel posture",
    when: "Before any US person is invited to buy",
    goal: "Written memo confirming Path A (chosen): s1r1us is a marketing ticker, not the desk, not a raise for bot-7.",
    minUsd: 0,
    maxUsd: 40000,
    publicAfterMint: true,
    hold: "Min $0 if you never sell. Max is a real securities letter.",
  },
  {
    id: "m6",
    n: 6,
    name: "Fund the accumulator",
    when: "Operator cash + unconditional gifts (no token)",
    goal: `USDC into the Coinbase agent book so bot 7 accumulates BTC. No pad proceeds. No creator fees. No s1r1us. Token never trades on ${TAB_DESK}.`,
    minUsd: 10000,
    maxUsd: 150000,
    publicAfterMint: true,
    hold: "$150k is operator + gift treasury. Not pad proceeds. Not a token raise.",
  },
  {
    id: "m7",
    n: 7,
    name: "Hold / no CEX hunt",
    when: "90 days post graduate",
    goal: "Keep LP locked. No paid dump-KOL. No CEX listing fee. Bot 7 stays BTC-only.",
    minUsd: 0,
    maxUsd: 15000,
    publicAfterMint: true,
    hold: "Max = optional 90-day organic/X. CEX quotes stay $0.",
  },
  {
    id: "m8",
    n: 8,
    name: "Open source the desk",
    when: "STARTED 2026-09-04 — GitHub repository live",
    goal: `Public https://github.com/S1R1US-AI/S1R1US-LABs for ${TAB_DESK} + ${TAB_LAB} + ${TAB_GM} + ${TAB_FEED} practice: Apache-2.0, SECURITY.md, GitHub README PDF. Public Sitemap | FAQ | OP3N S0URC3 footer. No mint recipe until TOKEN_LAUNCHED. Operator vault/Yubi stay private.`,
    minUsd: 0,
    maxUsd: 2500,
    publicAfterMint: true,
    hold: "Repo started. Footer: Sitemap | FAQ | H3LP … OP3N S0URC3. Crawler sitemap.xml lists /, /gm, /f33d, /helios, /s1r1us, /faq, /sitemap. Upload README.md + LICENSE Apache-2.0. PDF: /S1R1US-GitHub-README.pdf. Do not commit admin name/password, Yubi, CDP, or mint steps.",
    started: true,
    artifact: { label: "GitHub README.pdf", href: "/S1R1US-GitHub-README.pdf" },
  },
];

export const ROADMAP_TOTAL: [number, number] = ROADMAP.reduce<[number, number]>(
  (s, m) => [s[0] + m.minUsd, s[1] + m.maxUsd],
  [0, 0],
);

export const ROADMAP_STEALTH =
  `Do not put pump.fun / ticker / mint steps on the public ${TAB_DESK} tape. Coin tab stays admin-only. s1r1us.ai is the desk host. Snipe risk is the ticker, not the ${APP_NAME} brand.`;

/** Tight list for the Coin tab header — order is launch order. */
export const MINT_FLOOR = {
  minUsd: 5,
  maxUsd: 80,
  need: [
    "1. Fresh Phantom / Backpack. SOL dust for fees only — never desk Yubi or Coinbase keys.",
    "2. pump.fun create: name s1r1us, ticker s1r1us. Do not point the coin website at s1r1us.ai (desk host).",
    "3. Do not Publish, tweet the ticker from the desk account, or attach the domain until mint tx confirms.",
    "4. Path A locked: marketing ticker only. Not the 7-bot fund. Not a BTC-stack pitch.",
    "5. Curve/LP is marketing market. Locked LP cannot buy BTC. $150k is desk gifts + operator cash (M6).",
    "6. Gifts never receive s1r1us. Creator fees stay off the Coinbase book.",
    "7. GitHub: https://github.com/S1R1US-AI/S1R1US-LABs started 2026-09-04. README PDF on the timeline. No mint how-to until TOKEN_LAUNCHED.",
  ],
} as const;

export const GITHUB_ORG = "S1R1US-AI";
export const GITHUB_REPO = "S1R1US-LABs";
export const GITHUB_URL = "https://github.com/S1R1US-AI/S1R1US-LABs";
export const GITHUB_STARTED = true;
export const GITHUB_STARTED_ON = "2026-09-04";
export const README_PDF = "/S1R1US-GitHub-README.pdf";
export const OSS_LINK = GITHUB_URL;
export const OSS_LINK_LABEL = "H3LP 7-B0T H3DGE FUND [ S1R1U$ <<L@B$>> ] G0 >> OP3N S0URC3";

/** What OSS needs before the public GitHub is useful. Order = do first. */
export const OSS_NEEDS = [
  { id: "org", need: "GitHub repository started: https://github.com/S1R1US-AI/S1R1US-LABs (2026-09-04).", minUsd: 0, maxUsd: 0, done: true },
  { id: "readme-pdf", need: "GitHub README.pdf on the roadmap timeline (public/S1R1US-GitHub-README.pdf).", minUsd: 0, maxUsd: 0, done: true },
  { id: "license", need: "Apache-2.0 LICENSE in the repo root.", minUsd: 0, maxUsd: 0, done: true },
  { id: "security-md", need: "SECURITY.md: report vulns privately. No CDP/Yubi/vault in issues.", minUsd: 0, maxUsd: 0, done: true },
  { id: "no-secrets", need: "Strip factory passwords, live Argon2 hashes, Yubi public ids, portfolio UUIDs. Env-only.", minUsd: 0, maxUsd: 0 },
  { id: "stealth-readme", need: "README is the desk brand + how to run. No pump.fun create steps until mint tx.", minUsd: 0, maxUsd: 0, done: true },
  { id: "faq-sitemap", need: "Public FAQ + HTML sitemap + sitemap.xml. Footer Sitemap | FAQ | OP3N S0URC3. robots Allow /gm /helios /faq /sitemap. Disallow admin/login/launch/renew.", minUsd: 0, maxUsd: 0, done: true },
  { id: "config", need: "Operator config (X admin id, profit address, GitHub) via env, not hardcoded spend keys.", minUsd: 0, maxUsd: 400 },
  { id: "repro", need: "npm run dev / build / typecheck. SuperGrok optional. Free feeds work without keys.", minUsd: 0, maxUsd: 0, done: true },
  { id: "contrib", need: "CONTRIBUTING: PRs cannot add Google DNS, live Coinbase create, or client-held secrets.", minUsd: 0, maxUsd: 0, done: true },
  { id: "counsel", need: "Counsel if the public repo is used to solicit US buyers (M5). Code ≠ a sale.", minUsd: 0, maxUsd: 0 },
] as const;

export type FundLane = {
  id: string;
  name: string;
  kind: "grant" | "invest" | "gift" | "fee" | "self" | "no";
  size: string;
  odds: string;
  mapsTo: string;
  how: string;
  url?: string;
};

export const FUND_LANES: FundLane[] = [
  {
    id: "self",
    name: "Operator treasury (SOL dust + USDC)",
    kind: "self",
    size: "$5–$5k",
    odds: "You control it",
    mapsTo: "M0–M2, M4",
    how: "Phantom for mint fees. Optional USDC onto the curve. Never desk Yubi / Coinbase keys.",
  },
  {
    id: "gifts",
    name: "BTC / USDC gifts (not a sale)",
    kind: "gift",
    size: "$0–$150k",
    odds: "Ask, don't promise tokens",
    mapsTo: "M6 desk book. Not the ticker.",
    how: "Unconditional gifts. No s1r1us in return. Do not put token copy on the gift ask.",
  },
  {
    id: "curve",
    name: "pump.fun bonding curve (other people's USDC/SOL)",
    kind: "fee",
    size: "~$50k–$100k into the pool if it graduates",
    odds: "<2% of coins graduate",
    mapsTo: "M2–M3",
    how: "Retail buys the curve. At ~$69k–$100k mcap / ~85 SOL historically, LP migrates to PumpSwap and locks. You do not seed this.",
    url: "https://pump.fun/docs/bonding-curve",
  },
  {
    id: "creator-fee",
    name: "pump.fun creator rewards → bot-7 sweep",
    kind: "fee",
    size: "~0.3% of curve volume, only if it trades",
    odds: "Zero until volume",
    mapsTo: "Not M6. Off the Coinbase book unless Path D.",
    how: "Leave unused, burn, or OSS. Sweeping pad fees into BTC clips is the Howey cash flow. Do not count in M1.",
  },
  {
    id: "boost",
    name: "PumpSwap BOOST (auto)",
    kind: "fee",
    size: "~17.6 SOL / ~$2.5k diverted at migrate",
    odds: "Automatic if eligible",
    mapsTo: "M3 first minutes after graduate",
    how: "Hardcoded. No apply. Brief anti-dump window, not 90-day stability.",
  },
  {
    id: "pump-fund",
    name: "Pump Fund (Build in Public)",
    kind: "invest",
    size: "$250k at $10M val · 12 slots · $3M pool",
    odds: "Hackathon, not a grant. Must launch a token and keep ≥10%.",
    mapsTo: "M4–M6 if selected",
    how: "Investment arm (Jan 2026). Market traction is the filter. Counsel before taking it — this is closer to a sale than a gift.",
  },
  {
    id: "sf-grant",
    name: "Solana Foundation standard / convertible grant",
    kind: "grant",
    size: "Milestone; Superteam micro ~$1k–$10k typical; Foundation larger for public goods",
    odds: "Near zero for a ticker LP. Apply only as OSS public good.",
    mapsTo: "Not M2. Maybe M0/M4 if you open-source the desk as Solana tooling.",
    how: "They fund censorship-resistance, Solana Pay, RFPs, open-source. A bitcoin accumulator meme is commercial, not a public good. Convertible grant is for public goods with a commercial side — still not 'pay our LP'. Do not write 'liquidity for s1r1us' on the form.",
    url: "https://solana.org/grants-funding",
  },
  {
    id: "superteam",
    name: "Superteam Earn microgrants",
    kind: "grant",
    size: "Up to ~$10k USDG (regional; Ukraine avg ~$3.4k)",
    odds: "Low unless you are in their region and shipping Solana OSS",
    mapsTo: "M0/M4 polish — not LP",
    how: "https://earn.superteam.fun/grants/ — emerging markets. Meetup fund is $200. Wrong tool for a US meme LP.",
    url: "https://earn.superteam.fun/grants/",
  },
  {
    id: "colosseum",
    name: "Colosseum / Frontier hackathon",
    kind: "invest",
    size: "$10k–$30k prizes; $250k pre-seed if accelerator",
    odds: "Need a Solana product, not a ticker",
    mapsTo: "M4–M6 only if the desk is the product",
    how: "solana.com/hackathon. Pitch the 7-bot tape, not the coin.",
    url: "https://colosseum.com/frontier",
  },
  {
    id: "otc",
    name: "Friends / OTC / 'strategic'",
    kind: "no",
    size: "Any",
    odds: "Howey if they buy expecting the book",
    mapsTo: "Blocked without M5 memo",
    how: "Do not sell bot-7 PnL or 'funds the desk'. Gift or don't take it.",
  },
];

export type LiqBand = {
  id: string;
  name: string;
  launchUsd: string;
  stabilizeUsd: string;
  note: string;
};

/** Cash YOU spend vs pool that OTHER buyers create. Stabilize = 90 days post-graduate. */
export const LIQ_BANDS: LiqBand[] = [
  {
    id: "exist",
    name: "Token exists (M1)",
    launchUsd: "$5–$80",
    stabilizeUsd: "$0 (curve is the market)",
    note: "Create is $0. Dust SOL. No seed LP.",
  },
  {
    id: "grad",
    name: "Graduate to PumpSwap (M3)",
    launchUsd: "$0 of yours if retail fills ~$69k–$100k mcap",
    stabilizeUsd: "Locked curve LP (~$50k–$90k of buyer funds)",
    note: "<2% of coins get here. BOOST skims ~$2.5k for the first minutes.",
  },
  {
    id: "thin",
    name: "Survive 90 days (thin book)",
    launchUsd: "Graduation LP only",
    stabilizeUsd: "$5k–$25k extra USDC inventory or real volume",
    note: "Most graduates die here. Creator fees + small treasury adds.",
  },
  {
    id: "tight",
    name: "1% book / not a dead pool",
    launchUsd: "Graduation LP + $25k–$80k own inventory",
    stabilizeUsd: "$50k–$150k standing USDC+token",
    note: "This is market-making inventory, recoverable if you exit. Separate from M6 bot-7 book.",
  },
  {
    id: "cex",
    name: "CEX-like tightness",
    launchUsd: "$100k–$400k+",
    stabilizeUsd: "$200k–$1M book + MM",
    note: "Skip. Conflicts with M7. Not required to fund BTC accumulation.",
  },
];

export const FUND_INTEGRATION =
  "Path A locked. Desk book = operator cash + unconditional gifts (no token). s1r1us is a separate marketing ticker. Curve/LP never enters Coinbase. Creator fees never enter Coinbase. Do not say the token funds the bots.";

/** Path A: marketing project, not the desk. */
export const HOWEY_CHOSEN = "firewall" as const;

export const TOKEN_UTILITY = {
  notMemeOnly: false,
  oneLiner:
    "s1r1us is a marketing ticker. It is not the 7-bot fund, not a share of bitcoin, and not how the desk is funded.",
  canSpendOnBtc: [
    "Operator USDC you deposited yourself",
    "BTC / USDC gifts with no token and no upside",
  ],
  cannotSpendOnBtc: [
    "Anything from selling or trading s1r1us",
    "Creator fees from the pad",
    "Locked LP / bonding-curve USDC",
    "GoFundMe / angel / 'utility raise'",
  ],
  holdersGet: "Nothing from the desk. No BTC, no PnL, no vote, no fee share.",
  howey:
    "Chosen: Path A firewall. Marketing project ≠ accumulator. If copy ever says buy s1r1us because the bots stack BTC, you left Path A.",
  mapsTo: "M5 confirms A. M6 is gifts + operator only. Token mint is a separate marketing event.",
} as const;

/**
 * How to NOT be Howey. Not a safe harbor — counsel still required.
 * Break at least one Howey prong in economic reality, not in the footer.
 */
export const HOWEY_POSTURE = {
  chosen: "firewall" as const,
  chosenLabel: "A · Hard firewall — LOCKED",
  problem:
    "Investment of money + common enterprise + profit expected from the 7-bot's work = the fact pattern Path A exists to avoid.",
  cannotFix: [
    "Calling it utility, education, or meme",
    "DISCLAIMER in the footer",
    "Holders have no legal claim on BTC (courts look at marketing + economic reality)",
    "Geo-filter theater (US person includes VPNs, green cards, thinking they are abroad)",
  ],
  paths: [
    {
      id: "firewall",
      name: "A · Hard firewall — LOCKED",
      does: "Two stories, two pots, never mixed. Desk buys BTC from operator + gifts that get nothing back. s1r1us, if it exists, is a separate cultural ticker. No site, tweet, Coin tab, or roadmap may say the bots, the treasury, or BTC stack are why to buy the token. Creator fees stay off the Coinbase book (OSS, burn, or unused). No 'backed by', no NAV, no 'utility funds clips'.",
      breaks: "Expectation of profit from your efforts — because you do not sell that story or that cash flow.",
    },
    {
      id: "nosale",
      name: "B · Do not sell",
      does: "Mint if you must. Do not promote buying. No US invite. Gifts only, and gifts never receive s1r1us. Pump.fun still lets strangers buy — treat that as uncontrolled secondary, not a raise.",
      breaks: "You are not offering an investment (you still do not control the pad).",
    },
    {
      id: "consume",
      name: "C · Real use, no BTC link",
      does: "Token is spent/burned today for a thing that already works (e.g. extra L@B runs, paper PDF). Posted fee, consumptive. Desk remains free. Token docs never mention BTC stack, treasury, or clips. Do not invent a gate just to look like utility.",
      breaks: "Consumptive use, if it is real and primary — not a fig leaf on a BTC treasury.",
    },
    {
      id: "security",
      name: "D · Admit it is a security",
      does: "Reg D / Reg CF / registered offer of the entity. Token is then equity-like on purpose. Lawyer, cap, disclosures. This is a company round, not a meme pad.",
      breaks: "Nothing — you comply instead of avoiding Howey.",
    },
  ],
  forbiddenPitch: [
    "utility funds the 7-bot",
    "treasury buys bitcoin so the token is backed",
    "holders benefit when the desk stacks",
    "buy s1r1us to be part of the accumulator",
    "liquidity pairs so we can trade",
  ],
  ops: [
    "Separate legal entities or at least separate Coinbase / Phantom / bank. No commingling of pad proceeds into the BTC book.",
    "Gift receipt: 'unconditional gift, no tokens, no upside, no tax advice.'",
    "Public s1r1us.ai = desk + education. Coin mechanics stay admin until mint, and post-mint copy still must not be the forbidden pitch.",
    "M5 confirms Path A is locked. Do not reopen B/C/D in public copy.",
  ],
} as const;

/** Standing order — Path A is the only live funding/token posture. */
export const PATH_A_LOCKED = true;
export const PATH_A_NAME = "Path A · Hard firewall";
export const GIFT_RECEIPT = SUPPORT_GIFT_RECEIPT;
export const PATH_A_ORDER = [
  "Pot 1 — desk BTC: operator cash + gifts that get nothing back. Never pad proceeds or creator fees.",
  "Pot 2 — F33D H0ST1Ng: hosting, domain, iOS/Play only. Not the book. Not the ticker.",
  "Pot 3 — s1r1us on pump.fun: cultural ticker. Curve, LP, and creator fees stay off Coinbase.",
  "No buy CTA on s1r1us.ai. Do not pitch bots, treasury, or a bitcoin stack as why to buy.",
  "Print the gift receipt on every donate surface.",
  "Do not reopen Path B, C, or D in public copy.",
  "M5 counsel memo before any US-person invite to buy. Copy is not a safe harbor.",
] as const;


export const COIN_NAME_NOTE =
  "Token name/ticker: s1r1us (ASCII, no $). Distinct from the desk brand S1R1U$. Ledgers may uppercase the symbol; the canonical name is lowercase s1r1us. Not SIRIUS, not @S1r1u5_.";


export const COMPANY_X_STEPS = [
  `On X, stay logged in as ${ADMIN_X_HANDLE}. Open Accounts → Add an existing account → Sign up (new). Do not give the company account admin on this desk.`,
  "You pick display and handle. $ is not allowed in an X handle. Official company desk is @S1R1US_AI (https://x.com/S1R1US_AI). Do not use @S1R1US (blocked), @_S1R1US_, or accidental @S1R1S_AI.",
  `Bio: ${COMPANY_X_BIO}`,
  `Location / website: s1r1us.ai once registered. Pin a post: “Company account of ${ADMIN_X_HANDLE}. Token / desk updates only. No seed, no DMs for keys.”`,
  `On ${ADMIN_X_HANDLE}: pin the new company handle. Follow each other. Optional: X Organizations affiliate (needs org verification on the parent).`,
  "This account is marketing only. Continue-with-X admin remains the operator account. Company login is a desk user at most.",
] as const;

export const DNS_STEPS = [
  "Nameservers stay on GoDaddy. Do not transfer them to DigitalOcean.",
  "Apex and www A records: 162.159.140.98 and 172.66.0.96 (both). TTL ½ hour is fine.",
  "Delete any leftover Vercel A (76.76.21.21) or cname.vercel-dns.com.",
  "DigitalOcean app: Settings → Domains → add s1r1us.ai (and www). TLS issues only after a green deploy + domain attach.",
  `Never put Wallet, seeds, Yubi, or Coinbase keys on the public hostname. s1r1us.ai is the public tape. ${TAB_DESK} and ${TAB_LAB} stay gated.`,
] as const;

export const DOMAINS = [
  { name: "s1r1us.ai", role: "Canonical coin site — $ cannot be in DNS", prefer: true },
  { name: "s1rius.ai", role: "Phonetic catch-all", prefer: true },
  { name: "s1r1uslab.ai", role: `${TAB_LAB} / docs park`, prefer: false },
  { name: "s1r1us.xyz", role: "Cheap park if .ai cart is premium", prefer: false },
  { name: "s1r1us.com", role: "Aftermarket only — already registered", prefer: false },
] as const;

/** GoDaddy public .ai shelf, Sep 2026. .ai is usually a 2-year term. */
export const GODADDY_AI = {
  firstYearPromoUsd: 194.98,
  promoNote: "GoDaddy .ai first two years ~$194.98 (2-year minimum)",
  renewalUsd: 144.99,
  threeYearCommitUsd: 434.97,
  privacy: "WHOIS privacy included on new GoDaddy regs",
  buy: "https://www.godaddy.com/tlds/ai-domain",
};
export const GODADDY_IO = GODADDY_AI;

export type BudgetLine = {
  id: string;
  item: string;
  surviveUsd: [number, number];
  fundUsd: [number, number];
  tgeUsd: [number, number];
  note: string;
  recoverable: boolean;
};

export const BUDGET: BudgetLine[] = [
  {
    id: "legal",
    item: "Entity + securities memo (not a public ICO)",
    surviveUsd: [0, 0],
    fundUsd: [15000, 40000],
    tgeUsd: [75000, 300000],
    note: "US Howey risk if you sell “funds the trading bot.” Counsel letter or do not sell.",
    recoverable: false,
  },
  {
    id: "audit",
    item: "Contract review (ICRC-1 or OpenZeppelin ERC-20)",
    surviveUsd: [0, 2500],
    fundUsd: [8000, 25000],
    tgeUsd: [60000, 200000],
    note: "Token-creator websites are not an audit. Two firms for TGE.",
    recoverable: false,
  },
  {
    id: "domain",
    item: "GoDaddy s1r1us.ai + catch-alls + email",
    surviveUsd: [195, 290],
    fundUsd: [200, 600],
    tgeUsd: [400, 2000],
    note: ".ai is usually a 2-year term. GoDaddy ~$195 first two years, ~$145/yr after. Confirm cart is not premium.",
    recoverable: false,
  },
  {
    id: "site",
    item: "Launch site, docs, Blockscout/ICP ledger verify",
    surviveUsd: [0, 400],
    fundUsd: [800, 4000],
    tgeUsd: [5000, 25000],
    note: "Static site on the .io. No seeds. No live keys.",
    recoverable: false,
  },
  {
    id: "gas",
    item: "Deploy + LP tx fees (ETH on RH chain or ICP cycles)",
    surviveUsd: [20, 150],
    fundUsd: [100, 400],
    tgeUsd: [500, 3000],
    note: "Noise next to legal and LP.",
    recoverable: false,
  },
  {
    id: "lp",
    item: "Optional curve / PumpSwap inventory (not a Uniswap seed)",
    surviveUsd: [0, 500],
    fundUsd: [0, 5000],
    tgeUsd: [0, 25000],
    note: "pump.fun create is $0. This line is optional USDC on the curve — recoverable inventory, not a listing fee.",
    recoverable: true,
  },
  {
    id: "mm",
    item: "Market making 90 days",
    surviveUsd: [0, 0],
    fundUsd: [10000, 40000],
    tgeUsd: [50000, 200000],
    note: "Without this the book is one-wallet thick.",
    recoverable: false,
  },
  {
    id: "mkt",
    item: "Marketing (X, no Google, no dump-KOL)",
    surviveUsd: [0, 1500],
    fundUsd: [5000, 25000],
    tgeUsd: [25000, 200000],
    note: `Organic from the operator X account and ${APP_NAME}. Paid KOLs usually extract LP.`,
    recoverable: false,
  },
  {
    id: "cex",
    item: "CEX listing",
    surviveUsd: [0, 0],
    fundUsd: [0, 0],
    tgeUsd: [0, 500000],
    note: "Robinhood in-app listing is not for sale. Skip CEX until the book is real.",
    recoverable: false,
  },
];

export const TIERS = [
  {
    id: "survive",
    name: "Survive a week",
    range: "$6k–$20k",
    netToBook: "Often $0. LP is the raise.",
    verdict: "Do not use this to fund bot 7.",
  },
  {
    id: "fund",
    name: "Net ~$25k into the USDC book",
    range: "$80k–$150k committed",
    netToBook: "$15k–$40k if the token does not die; else salvage LP.",
    verdict: "Minimum serious path. Access token only — no PnL share.",
  },
  {
    id: "tge",
    name: "Competent TGE",
    range: "$200k–$1M+",
    netToBook: "Unknown. This is a second company.",
    verdict: "Overkill vs a bitcoin accumulator. Don't.",
  },
] as const;

export type CheckKind = "auto-domain" | "auto-yubi" | "auto-vault" | "auto-lock" | "manual";

export type LaunchCheck = {
  id: string;
  phase: string;
  label: string;
  detail: string;
  kind: CheckKind;
  domain?: string;
  required: boolean;
};

export const CHECKLIST: LaunchCheck[] = [
  {
    id: "stealth",
    phase: "0 · Counsel",
    label: "No public mint / ticker until pump.fun tx",
    detail: "Coin tab admin-only. Do not Publish. Do not put pump.fun, ticker, or mint steps on s1r1us.ai. Flip TOKEN_LAUNCHED only after mint.",
    kind: "manual",
    required: true,
  },
  {
    id: "counsel",
    phase: "0 · Counsel",
    label: "Securities memo in writing",
    detail: "Path A locked. Memo confirms s1r1us is a marketing ticker, not the desk, not a raise for bot-7. No memo → do not promote buying.",
    kind: "manual",
    required: true,
  },
  {
    id: "utility-split",
    phase: "0 · Counsel",
    label: "Path A: marketing ticker ≠ desk",
    detail: "s1r1us is a marketing project. It is not tied to bot-7, the Coinbase book, or BTC stacked. Gifts get no s1r1us. Pad proceeds never enter the book.",
    kind: "manual",
    required: true,
  },
  {
    id: "entity",
    phase: "0 · Counsel",
    label: "Separate wallets: marketing mint ≠ Coinbase book",
    detail: "Phantom for s1r1us only. Coinbase + Yubi for the desk. Never sweep pad proceeds or creator fees into the book.",
    kind: "manual",
    required: true,
  },
  {
    id: "lp-donate",
    phase: "1 · Identity",
    label: "Desk gift rails ($150k ambition)",
    detail: "BTC receive for unconditional gifts to the desk. Not token LP. Not s1r1us. Save USDC 0x in Wallet. Gifts get nothing back.",
    kind: "manual",
    required: true,
  },
  {
    id: "dom-io",
    phase: "1 · Identity",
    label: "Register s1r1us.ai at GoDaddy",
    detail: "Canonical host for the s1r1us token. $ cannot be in a domain. .ai ~2-year term, ~$195 first term.",
    kind: "auto-domain",
    domain: "s1r1us.ai",
    required: true,
  },
  {
    id: "dns-lock",
    phase: "1 · Identity",
    label: "Lock s1r1us.ai + auto-renew + registrar 2FA",
    detail: "Do this now. Do not move nameservers to an AI site builder.",
    kind: "manual",
    required: true,
  },
  {
    id: "dns-ns",
    phase: "1 · Identity",
    label: "Keep GoDaddy nameservers until the public page is ready",
    detail: "No Airo. CNAME only when we publish the token site. www parks to apex.",
    kind: "manual",
    required: true,
  },
  {
    id: "dom-alt",
    phase: "1 · Identity",
    label: "Register s1rius.ai catch-all",
    detail: "People will type Sirius. Park it to s1r1us.ai.",
    kind: "auto-domain",
    domain: "s1rius.ai",
    required: false,
  },
  {
    id: "x",
    phase: "1 · Identity",
    label: companyHandleSet()
      ? `Create ${COMPANY_X_HANDLE} as the company X account`
      : "Create a new company X account (not @S1R1US)",
    detail: `Under ${ADMIN_X_HANDLE}. Bio must name the parent. Company X never unlocks Admin / Wallet / Coinbase send.`,
    kind: "manual",
    required: true,
  },
  {
    id: "x-parent",
    phase: "1 · Identity",
    label: `${ADMIN_X_HANDLE} pins the company handle`,
    detail: "Parent post + follow. Affiliate badge only if X org-verifies the operator later.",
    kind: "manual",
    required: true,
  },
  {
    id: "yubi",
    phase: "2 · Security",
    label: "Two YubiKeys enrolled on this desk",
    detail: "Same protocol as Wallet. Token deployer key never lives here.",
    kind: "auto-yubi",
    required: true,
  },
  {
    id: "vault",
    phase: "2 · Security",
    label: "Profit BTC + USDC rails encrypted",
    detail: "Proceeds convert to USDC → agent, then HIGH clips to BTC, TRIM to 33km…",
    kind: "auto-vault",
    required: true,
  },
  {
    id: "live-lock",
    phase: "2 · Security",
    label: "Live Coinbase create still locked",
    detail: "Do not unlock live trading to “support” a token. Practice until the book is boring.",
    kind: "auto-lock",
    required: true,
  },
  {
    id: "standard",
    phase: "3 · Token",
    label: "Pick ICRC-1 (rec) or RH-chain ERC-20",
    detail: "Recommendation: ICRC-1 capped, no mint, no tax. ckBTC as inbound BTC rail. Not a Robinhood meme.",
    kind: "manual",
    required: true,
  },
  {
    id: "cap",
    phase: "3 · Token",
    label: "Cap + vest + LP lock written",
    detail: "Example: 100M cap. 40% LP locked 12–24 mo. 30% treasury vest. 20% team 12/36. 10% community. No PnL share.",
    kind: "manual",
    required: true,
  },
  {
    id: "audit-sign",
    phase: "3 · Token",
    label: "Audit PDF published on s1r1us.ai",
    detail: "Template deployers are not this box.",
    kind: "manual",
    required: true,
  },
  {
    id: "lp",
    phase: "4 · Liquidity",
    label: "LP inventory funded (not the bot-7 book)",
    detail: "Separate wallet. Lock LP NFT / canister. Bot 7 never trades S1R1US.",
    kind: "manual",
    required: true,
  },
  {
    id: "site",
    phase: "5 · Site",
    label: "s1r1us.ai live with disclaimer + deposit addresses",
    detail: "Watch-only USDC + BTC (+ later ckBTC). No seed paste. No “guaranteed BTC.”",
    kind: "manual",
    required: true,
  },
  {
    id: "mkt",
    phase: "6 · Market",
    label: "90-day X plan, no Google ads, no dump KOLs",
    detail: "Mandate is accumulate BTC. Marketing that pumps the ticker fights the desk.",
    kind: "manual",
    required: false,
  },
  {
    id: "convert",
    phase: "7 · Go live",
    label: "Proceeds path: ETH/ICP/USDG → USDC → Coinbase agent",
    detail: "Publish hashes. Yubi to copy any outgoing. Stop-loss still on each BTC clip.",
    kind: "manual",
    required: true,
  },
  {
    id: "oss-org",
    phase: "8 · Open source",
    label: "GitHub organization s1r1us exists",
    detail: "Company org. Not the operator X account. Public desk only. No vault, no Yubi, no CDP.",
    kind: "manual",
    required: true,
  },
  {
    id: "oss-license",
    phase: "8 · Open source",
    label: "Apache-2.0 + SECURITY.md + stealth README",
    detail: "No pump.fun create steps in README until TOKEN_LAUNCHED. Issues cannot request seeds or keys.",
    kind: "manual",
    required: true,
  },
];
