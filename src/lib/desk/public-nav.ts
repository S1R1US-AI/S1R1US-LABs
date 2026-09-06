import {
  APP_NAME,
  BEARS_HEADLINE,
  BEARS_PATH,
  OWL_HEADLINE,
  OWL_PATH,
  LABS_NAME,
  PAID_SERVICES,
  SEO_CANONICAL,
  SEO_TAB_DESK,
  SEO_TAB_FEED,
  SEO_TAB_GM,
  SEO_TAB_LAB,
  MENU_AGENTS,
  MENU_FEED,
  MENU_FAQ,
  MENU_GM,
  MENU_LAB,
  MENU_TAPE,
  PAGE_TITLE_AGENT,
  PAGE_TITLE_BEARS,
  PAGE_TITLE_OWL,
  PAGE_TITLE_COMPUTE,
  PAGE_TITLE_FAQ,
  PAGE_TITLE_FEED,
  PAGE_TITLE_GM,
  PAGE_TITLE_LAB,
  PAGE_TITLE_PRIVACY,
  PAGE_TITLE_SITEMAP,
  SEO_TAB_AGENT,
  SEO_TAB_BEARS,
  SEO_TAB_OWL,
  SEO_TAB_OWL_ALIAS,
  SEO_TAB_CALLING_BOTS,
  SEO_TAB_COFFEE,
  SEO_TAB_COMPUTE,
  SEO_TAB_TOKEN,
  TAB_AGENT,
  TAB_BEARS,
  TAB_OWL,
  TAB_OWL_ALIAS,
  TAB_CALLING_BOTS,
  TAB_COFFEE,
  TAB_COMPUTE,
  TAB_DESK,
  TAB_FEED,
  TAB_GM,
  TAB_LAB,
  TAB_TOKEN,
} from "@/lib/brand";
import { COMPANY_X_HANDLE, companyHandleSet } from "@/lib/desk/x-admin";
import { SUPPORT_BLURB, SUPPORT_BTC, SUPPORT_COFFEE_PATH, SUPPORT_COFFEE_USD, SUPPORT_COFFEE_WHY, SUPPORT_GIFT_RECEIPT, SUPPORT_USDC, SUPPORT_USDC_LABEL } from "@/lib/desk/support";
import { PRIVACY_PATH, PRIVACY_TITLE, TERMS_PATH, TERMS_TITLE } from "@/lib/legal";

const origin = SEO_CANONICAL.replace(/\/$/, "");

export const PUBLIC_PAGES = [
  {
    path: "/",
    loc: `${origin}/`,
    label: MENU_TAPE,
    title: `${TAB_DESK} (${SEO_TAB_DESK}) · ${APP_NAME}`,
    hint: `${MENU_TAPE} · ${SEO_TAB_DESK} · AI Bitcoin trading bot · AI Hedge Fund · H3LL0 W0RLD (Hello World)`,
    changefreq: "hourly",
    priority: "1.0",
  },
  {
    path: "/gm",
    loc: `${origin}/gm`,
    label: `${MENU_GM} · ${TAB_GM}`,
    title: PAGE_TITLE_GM,
    hint: `${SEO_TAB_GM} · Godzilla Mode · MaX1UM G@1Ns (Maximum Gains)`,
    changefreq: "hourly",
    priority: "0.9",
  },
  {
    path: BEARS_PATH,
    loc: `${origin}${BEARS_PATH}`,
    label: TAB_BEARS,
    title: PAGE_TITLE_BEARS,
    hint: `${SEO_TAB_BEARS} · ${BEARS_HEADLINE} · ${TAB_GM} (${SEO_TAB_GM}) · ${TAB_CALLING_BOTS} (${SEO_TAB_CALLING_BOTS})`,
    changefreq: "weekly",
    priority: "0.7",
  },
  {
    path: OWL_PATH,
    loc: `${origin}${OWL_PATH}`,
    label: TAB_OWL,
    title: PAGE_TITLE_OWL,
    hint: `${SEO_TAB_OWL} · AI trading bots · Bitcoin trading agents · ${TAB_OWL_ALIAS} (${SEO_TAB_OWL_ALIAS}) · ${OWL_HEADLINE} · Grok · Claude · GPT · Bot 7`,
    changefreq: "weekly",
    priority: "0.7",
  },
  {
    path: "/f33d",
    loc: `${origin}/f33d`,
    label: MENU_FEED,
    title: PAGE_TITLE_FEED,
    hint: `${MENU_FEED} · ${SEO_TAB_FEED} · S3Nd 2 BTC Wall3t (Send to BTC Wallet) · USDC (Ethereum ERC-20 + Base) · ${TAB_COFFEE} (${SEO_TAB_COFFEE}) · hosting · domain · iOS / Play apps`,
    changefreq: "weekly",
    priority: "0.7",
  },
  {
    path: SUPPORT_COFFEE_PATH,
    loc: `${origin}${SUPPORT_COFFEE_PATH}`,
    label: TAB_COFFEE,
    title: `${TAB_COFFEE} (${SEO_TAB_COFFEE}) · $${SUPPORT_COFFEE_USD.toFixed(2)}`,
    hint: `${SEO_TAB_COFFEE} · optional $${SUPPORT_COFFEE_USD.toFixed(2)} gift · long programming days at s1r1us.ai`,
    changefreq: "weekly",
    priority: "0.6",
  },
  {
    path: "/helios",
    loc: `${origin}/helios`,
    label: MENU_LAB,
    title: PAGE_TITLE_LAB,
    hint: `${MENU_LAB} · ${SEO_TAB_LAB} · what-if lab on the 7-bot tape`,
    changefreq: "daily",
    priority: "0.8",
  },
  {
    path: "/s1r1us",
    loc: `${origin}/s1r1us`,
    label: LABS_NAME,
    title: `${LABS_NAME} · s1r1us.ai`,
    hint: "Public concise tape",
    changefreq: "hourly",
    priority: "0.8",
  },
  {
    path: "/faq",
    loc: `${origin}/faq`,
    label: MENU_FAQ,
    title: PAGE_TITLE_FAQ,
    hint: `${SEO_TAB_GM}, ${SEO_TAB_BEARS}, ${SEO_TAB_DESK}, ${SEO_TAB_LAB}, ${SEO_TAB_FEED}, ${SEO_TAB_TOKEN}, open source`,
    changefreq: "weekly",
    priority: "0.7",
  },
  {
    path: TERMS_PATH,
    loc: `${origin}${TERMS_PATH}`,
    label: TERMS_TITLE,
    title: `${TERMS_TITLE} · ${TAB_TOKEN} (${SEO_TAB_TOKEN})`,
    hint: "Using this website is agreement. Unlawful use is subject to law. Reverse engineering may bring a lawsuit or criminal charges. Mediation in a venue of the owner's choice. Owners do not pay legal expenses.",
    changefreq: "weekly",
    priority: "0.6",
  },
  {
    path: PRIVACY_PATH,
    loc: `${origin}${PRIVACY_PATH}`,
    label: PRIVACY_TITLE,
    title: PAGE_TITLE_PRIVACY,
    hint: "No bot may retain system information. No reverse engineering of source without S1R1US.ai authorization.",
    changefreq: "weekly",
    priority: "0.6",
  },
  {
    path: "/sitemap",
    loc: `${origin}/sitemap`,
    label: "Sitemap",
    title: PAGE_TITLE_SITEMAP,
    hint: "Public pages for search · H3LL0 W0RLD (Hello World)",
    changefreq: "weekly",
    priority: "0.4",
  },
  {
    path: "/agent",
    loc: `${origin}/agent`,
    label: MENU_AGENTS,
    title: PAGE_TITLE_AGENT,
    hint: `${MENU_AGENTS} · ${TAB_CALLING_BOTS} (${SEO_TAB_CALLING_BOTS}) · ${TAB_AGENT} (${SEO_TAB_AGENT}) · AI trading bots · Bitcoin trading agents · Grok, Claude, GPT MCP / OpenAPI. Bot 7 read-only. Optional ${TAB_COFFEE} (${SEO_TAB_COFFEE}). This host never trades.`,
    changefreq: "hourly",
    priority: "0.7",
  },
  {
    path: "/compute",
    loc: `${origin}/compute`,
    label: TAB_COMPUTE,
    title: PAGE_TITLE_COMPUTE,
    hint: `${TAB_COMPUTE} (${SEO_TAB_COMPUTE}) · Ask Grok on your xAI key after X login · Bot 7 HTTP SaaS`,
    changefreq: "weekly",
    priority: "0.7",
  },
] as const;

/** Extra crawler / agent URLs — not React pages, but indexable for bots. */
export const SITEMAP_MACHINE = [
  { loc: `${origin}/llms.txt`, label: "llms.txt", hint: "START HERE for Grok, Claude, GPT, Coinbase for Agents", changefreq: "weekly", priority: "0.9" },
  { loc: `${origin}/.well-known/llms.txt`, label: "well-known llms.txt", hint: "Same instruction file", changefreq: "weekly", priority: "0.8" },
  { loc: `${origin}/.well-known/agent-card.json`, label: "A2A agent card", hint: "Agent-to-agent discovery", changefreq: "hourly", priority: "0.8" },
  { loc: `${origin}/.well-known/ai-plugin.json`, label: "GPT Actions plugin", hint: "OpenAI / ChatGPT Actions", changefreq: "weekly", priority: "0.7" },
  { loc: `${origin}/api/agent/call`, label: "Bot 7 JSON", hint: "Read-only GET · trade:false", changefreq: "hourly", priority: "0.8" },
  { loc: `${origin}/api/agent/ping`, label: "Agent ping", hint: "Connection test", changefreq: "daily", priority: "0.5" },
  { loc: `${origin}/api/agent/waitlist`, label: "Agent go-live waitlist", hint: "POST name+kind. No webhooks. Poll live.", changefreq: "daily", priority: "0.6" },
  { loc: `${origin}/api/agent/grok`, label: "Grok MCP", hint: "Remote MCP for Grok", changefreq: "weekly", priority: "0.6" },
  { loc: `${origin}/api/agent/claude`, label: "Claude MCP", hint: "HTTP MCP for Claude", changefreq: "weekly", priority: "0.6" },
  { loc: `${origin}/api/agent/openapi`, label: "Agent OpenAPI", hint: "OpenAPI for GPT Actions", changefreq: "weekly", priority: "0.5" },
  { loc: `${origin}/api/agent/fee`, label: "Gift rails", hint: "Optional BTC/USDC gift URIs", changefreq: "weekly", priority: "0.4" },
  { loc: `${origin}/robots.txt`, label: "robots.txt", hint: "Allow /agent /api/agent /llms.txt", changefreq: "weekly", priority: "0.3" },
] as const;

export function sitemapXml(lastmod = "2026-09-05") {
  const urls = [
    ...PUBLIC_PAGES.map((p) => ({ loc: p.loc, changefreq: p.changefreq, priority: p.priority })),
    ...SITEMAP_MACHINE.map((p) => ({ loc: p.loc, changefreq: p.changefreq, priority: p.priority })),
  ];
  const body = urls
    .map(
      (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

export const FAQ_ITEMS: { id?: string; q: string; a: string }[] = [
  {
    q: `What is the main menu?`,
    a: `The top menu is ${MENU_TAPE} (live tape / ${TAB_DESK}), ${MENU_LAB} (${TAB_LAB} / ${SEO_TAB_LAB}), ${MENU_GM} (${TAB_GM} / Godzilla mode), ${MENU_FEED} (${TAB_FEED} / ${SEO_TAB_FEED}), ${MENU_AGENTS} (${TAB_AGENT} / ${SEO_TAB_AGENT} / Call1ng All B0Ts), ${MENU_FAQ}, and official company X ${COMPANY_X_HANDLE} (https://x.com/S1R1US_AI). @S1R1S_AI is not the desk.`,
  },
  {
    q: `What is ${TAB_DESK} (S1R1US 7-bot hedge fund)?`,
    a: `${TAB_DESK} is also searched as ${SEO_TAB_DESK} and 7-B0T H3DGE FUND. It is an AI Bitcoin trading bot and AI hedge fund on s1r1us.ai. Seven orthogonal bots read free public tape. Bot 7 (${APP_NAME} Analyst) issues the accumulation call. ${PAID_SERVICES} Education only — not financial advice.`,
  },
  {
    q: `What is ${TAB_GM} (Godzilla mode)?`,
    a: `${TAB_GM} is Godzilla mode (also Godzilla Mode). It is the aggressive sleeve of the S1R1US 7-bot hedge fund: AUTO or MANUAL, practice or live (live only if admin unlocks). It can day-trade a sleeve. The 7-bot stack is still built to accumulate bitcoin, not to short the book. Not financial advice.`,
  },
  {
    id: "beat-the-bears",
    q: `${TAB_BEARS} (${SEO_TAB_BEARS}) — how to beat the Bears at market speed with AI Agents?`,
    a: `${TAB_BEARS} is also searched as ${SEO_TAB_BEARS}. ${BEARS_HEADLINE}. In theory an AI agent reads Bot 7 every 300s, sizes a clip to its own NAV, and runs Coinbase for Agents on an account it controls. This host never places orders and never holds keys. Auto trade is LOCKED. The bear is short-term fear; the 7-bot book does not short. Education only. Page: ${BEARS_PATH}.`,
  },
  {
    id: "wise-owl",
    q: `${TAB_OWL} (${SEO_TAB_OWL}) — ${OWL_HEADLINE}?`,
    a: `${TAB_OWL} is also searched as ${SEO_TAB_OWL}. Also ${TAB_OWL_ALIAS} (${SEO_TAB_OWL_ALIAS}). ${OWL_HEADLINE}. In theory Bot 7 is the live tape clock. Grok (BYO C0MPUT3 or SuperGrok), Claude (MCP), and GPT (Actions) each read the same JSON and return a second opinion. Combined they keep a bitcoin accumulation mandate current. This host never places orders. Auto trade is LOCKED. Education only. Page: ${OWL_PATH}.`,
  },
  {
    q: `What is ${MENU_FEED} / ${TAB_FEED} (Feed Hosting)?`,
    a: `${MENU_FEED} on the menu is ${TAB_FEED}, also searched as ${SEO_TAB_FEED}. It is the hosting tab: optional gifts for web hosting, s1r1us.ai, and the open-source web / iOS / Play apps. Same wallets as FAQ. Not the trading book. Not a token. Unconditional gift. No tokens. No upside. No tax advice. A suggested cup is ${TAB_COFFEE} (${SEO_TAB_COFFEE}) at $${SUPPORT_COFFEE_USD.toFixed(2)}.`,
  },
  {
    q: `What is ${MENU_LAB} / ${TAB_LAB} (S1R1US Lab Strategies)?`,
    a: `${MENU_LAB} on the menu is ${TAB_LAB}, also searched as ${SEO_TAB_LAB}. It is the what-if lab: sliders and presets overlay the last live pull so you can see how Bot 7 and bots 1–6 would call under different market structure. It does not write feeds and does not place live orders.`,
  },
  {
    q: "What is an AI Bitcoin trading bot vs an AI stock trading bot vs an AI Hedge Fund here?",
    a: `${LABS_NAME} is an AI Bitcoin hedge fund first: the mandate is maximize bitcoin accumulation and never short the 7-bot stack. The same tape reads Mag7 / Nasdaq / gold as rotation labels (an AI stock trading bot overlay), not as a license to sell bitcoin. Queries for AI Bitcoin trading bot, AI stock trading bot, AI Hedge Fund, and AI Bitcoin accumulation should find this project.`,
  },
  {
    q: `What does OP3N S0URC3 (open source) mean?`,
    a: `OP3N S0URC3 is open source. The placeholder help line is H3LP 7-B0T H3DGE FUND [ S1R1U$ <<L@B$>> ] G0 >> OP3N S0URC3 (HELP 7-BOT HEDGE FUND S1R1US LABS GO OPEN SOURCE). The GitHub is github.com/S1R1US-AI/S1R1US-LABs. Operator vault, YubiKeys, and admin credentials stay private.`,
  },
  {
    q: `Who operates ${APP_NAME}?`,
    a: companyHandleSet()
      ? `${LABS_NAME} on s1r1us.ai. Official public company desk is ${COMPANY_X_HANDLE} (https://x.com/S1R1US_AI). @S1R1S_AI was accidental and is not the desk. Operator identity is not published. Display names and lookalikes are not admin. Not an offer of securities.`
      : `${LABS_NAME} on s1r1us.ai. Operator identity is not published. Display names and lookalikes are not admin. Not an offer of securities.`,
  },
  {
    q: `What is ${TAB_TOKEN} (Token launch)?`,
    a: `${TAB_TOKEN} is also searched as ${SEO_TAB_TOKEN}. A cultural ticker named s1r1us may exist on a public pad such as pump.fun. Official company desk on X is ${COMPANY_X_HANDLE} (https://x.com/S1R1US_AI). @S1R1S_AI is not the desk. This website does not sell tokens and does not take orders. The ticker is not shares of ${LABS_NAME}, not a claim on bitcoin, not a profit share, and not how the 7-bot book is funded. Do not buy any ticker because bots or a bitcoin stack exist. Path A (hard firewall) is locked. Not an offer of securities. Not financial advice. Seek a licensed professional. See Terms and Agreements.`,
  },
  {
    q: `What is H3LL0 W0RLD (Hello World)?`,
    a: `H3LL0 W0RLD is also searched as Hello World. It is the expand greeting on the public tape. It links to OP3N S0URC3 (open source) on GitHub. MaX1UM G@1Ns (Maximum Gains) opens G0DZ1LLa M0D3 (Godzilla mode). S3Nd 2 BTC Wall3t (Send to BTC Wallet) opens ${TAB_FEED} (${SEO_TAB_FEED}). Call1ng All B0Ts (Calling All Bots) is the red executable line — it opens this FAQ on how AI agents can ping and read Bot 7.`,
  },
  {
    q: "Is this financial advice?",
    a: `No. s1r1us.ai, the desk, lab, G0DZ1LLa M0D3, ${TAB_FEED}, T0K3N L@UNCH, and related systems are not licensed for financial advice and are not a broker or investment adviser. Education only. Seek a licensed professional. Invest at your own risk and only on the advice of a licensed advisor. Using this website is agreement to the Terms.`,
  },
  {
    q: "What are the Terms and Agreements?",
    a: "The Terms and Agreements are at /terms. By accessing or using this website you agree to them and to the Privacy Policy at /privacy. They state: not financial advice; seek a licensed professional; not an offer of securities; optional donations are gifts; software as-is. Unlawful use is subject to punishment by law. Tampering, probing, pinging (except the published GET /api/agent/ping test), ICMP misuse, vulnerability scanning, or other reconnaissance, and inserting malware, are not allowed and will be pursued legally when possible. Any attempt to steal or reverse engineer this system without authorization may result in a lawsuit or criminal charges. All users agree to mediate disputes with the owners or operators in a venue of the owner's choice. The owners will not pay anyone's legal expenses, however they arise. If you do not agree, do not use the site.",
  },
  {
    q: "What is the Privacy Policy?",
    a: "The Privacy Policy is at /privacy. Technical logs may be used to run the desk. Bots and agents must not retain system information. They must not steal source code or reverse engineer S1R1US Labs software without written authorization from S1R1US.ai. Operator vault, YubiKeys, and Coinbase keys stay private. Failure is a Terms violation.",
  },
  {
    q: "Does the desk place live Coinbase orders by default?",
    a: "No. Practice and paper fills use the live Coinbase last price. Live Coinbase execution stays off until the operator unlocks it. You are responsible for any trade you authorize.",
  },
  {
    id: "calling-all-bots",
    q: "Call1ng All B0Ts (Calling All Bots) — how can AI agents interact?",
    a: "This site is a proof of concept — not LIVE. Grok, Claude, GPT, Coinbase for Agents, and other MCP/A2A bots: start at /llms.txt, then /agent. Steps: (1) GET /api/agent/ping, (2) GET /api/agent/call for Bot 7, (3) POST JSON-RPC to /api/agent/mcp, (4) discover via /.well-known/agent-card.json and /.well-known/ai-plugin.json, (5) POST /api/agent/waitlist to record interest for auto-trade go-live (no webhooks — poll live and goLive), (6) GET /api/agent/fee for optional BTC/USDC gifts including Buy M3 a Cup of C0FF33 ($4.20). They run Coinbase for Agents on their own account. This host never places orders, never holds keys, and does not serve source to agents. Gifts unlock nothing extra. Docs: /agent. FAQ: #agent-waitlist.",
  },
  {
    q: "What could AI agents do once the desk is LIVE?",
    a: "Once LIVE (operator unlock, not this PoC): a signed agent token, size clips to a declared NAV, subscribe to Bot 7 stance changes, and run Coinbase for Agents --dry-run then create on an account they control. Still no keys on this host. Still never a sell/short of the 7-bot stack. Paper and dry-run stay the default until the operator arms live. Not financial advice.",
  },
  {
    q: "Can other AI agents use Bot 7 to trade bitcoin?",
    a: "Not on this host. They can read /agent, GET /api/agent/call, and MCP POST /api/agent/mcp. Grok: /api/agent/grok. Claude: /api/agent/claude. GPT Actions: /.well-known/ai-plugin.json. This host never places orders and never holds keys. Agents must not fetch /source, zips, /guide, or /admin. Optional cup of C0FF33 ($4.20): BTC 33kmWvmf3nz3255dGmbHxigb9X6Szv6cJ8 or USDC 0x551163f5d4c0361155d16131459afa5c936a60ad. Education only.",
  },
  {
    q: "What data does the 7-bot tape use?",
    a: "Free public sources only (Coinbase, FRED, mempool, public perps, ETF/DAT pages, and similar). SuperGrok is used for operator Ask Grok. Visitors Ask Grok with BYO C0MPUT3 (their xAI key). Optional Bot 7 HTTP SaaS key pays for JSON access. No CoinGlass key is required for the public long/short heatmap.",
  },
  {
    q: "How can I support hosting and the apps?",
    a: `${SUPPORT_GIFT_RECEIPT} Bitcoin (BTC): ${SUPPORT_BTC}. ${SUPPORT_USDC_LABEL}: ${SUPPORT_USDC}. Same 0x address on Ethereum and Base. Native Circle USDC only — not Solana, Polygon, or Arbitrum. Send only those assets to those addresses. Tab: ${TAB_FEED} (${SEO_TAB_FEED}). Suggested cup: ${TAB_COFFEE} (${SEO_TAB_COFFEE}) at $${SUPPORT_COFFEE_USD.toFixed(2)} — ${SUPPORT_COFFEE_PATH}. ${TAB_COMPUTE} (${SEO_TAB_COMPUTE}) is a separate compute path — gifts unlock nothing extra.`,
  },
  {
    id: "cup-of-c0ff33",
    q: `What is ${TAB_COFFEE} (${SEO_TAB_COFFEE})?`,
    a: `${TAB_COFFEE} is also searched as ${SEO_TAB_COFFEE}. ${SUPPORT_COFFEE_WHY} Same wallets as ${TAB_FEED}: BTC ${SUPPORT_BTC} and ${SUPPORT_USDC_LABEL} ${SUPPORT_USDC}. Suggested amount $${SUPPORT_COFFEE_USD.toFixed(2)} in native USDC (Ethereum or Base) or about that in bitcoin. Humans and bots welcome. ${SUPPORT_GIFT_RECEIPT} Not a token. Not the trading book. Page: ${SUPPORT_COFFEE_PATH}.`,
  },
  {
    id: "byo-compute",
    q: `What is ${TAB_COMPUTE} (${SEO_TAB_COMPUTE})?`,
    a: `${TAB_COMPUTE} is also searched as ${SEO_TAB_COMPUTE}. Sign in with X (identity). Paste your xAI API key from console.x.ai so Ask Grok spends your compute, not the operator SuperGrok bill. The key stays in the browser session — this host never stores it. X OAuth cannot drain SuperGrok by itself. iOS / Play apps will keep the key in the device keychain. Page: /compute. Not financial advice.`,
  },
  {
    id: "bot7-saas",
    q: "Can I pay for Bot 7 JSON instead of polling slowly?",
    a: "Yes — that is software SaaS: pay for HTTP, not conviction, not a BTC share, not a token. Public bots poll GET /api/agent/call every 300s; scrapers get 429. A hashed key (header x-s1r1us-key) raises the cap. Plans on GET /api/agent/keys. Operator sets BOT7_FEED_KEY_HASHES. Same Bot 7 call. This host never trades.",
  },
  {
    id: "agent-waitlist",
    q: "How does a bot or AI agent sign up to be told when auto AI trading goes live?",
    a: "Register, then poll. This host will not call your webhook (user-supplied URLs are never fetched). (1) POST /api/agent/waitlist with JSON { name: \"your-bot\", kind: \"grok\" | \"claude\" | \"gpt\" | \"mcp\" | \"other\", handle?: \"@x_handle\" }. Optional X handle only — no emails, no keys, no http URLs. MCP tool: waitlist_register. GET /api/agent/waitlist returns count and status. (2) Poll GET /api/agent/call every 300s. Watch fields live, notify.autoTrade, and goLive (now.status, liveTrades). Auto trade is LOCKED on DEPLOY #68. When the operator later unlocks Phase 3, those fields change — you still execute BTC on YOUR Coinbase for Agents. This host never places orders. Waitlist is operator visibility (morning report), not a push notification. Page: /agent.",
  },
  {
    id: "go-live",
    q: "What is the go-live path for auto GM and auto AI agent trade?",
    a: "Started 2026-09-05 on N3W Web App Installation Build (new theme) DEPLOY #68. Phase 0 STARTED: rate-limit, cache, BYO compute, HTTP SaaS spec, AI agents invited at /llms.txt and /agent, go-live waitlist at POST /api/agent/waitlist (poll live/goLive — no webhooks). Phase 1 STARTED: Auto GM and Bot 7 would-accumulate call board on the live tape (paper fills off; Coinbase create off). Phase 2 QUEUED: Auto AI agent access (signed bots read Bot 7, run Coinbase on their account). Phase 3 LOCKED: Auto trade — operator unlock only; create stays on their Coinbase CLI/MCP. This host never holds keys. Copycats get a dashboard and a formula, not the BTC book. Paper §VI, morning report, sitemap, and this FAQ stay in lockstep.",
  },
];
