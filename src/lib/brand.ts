export const APP_NAME = "[ S1R1U$ <<L@B$>> ]";
export const APP_SHORT = "S1R1U$";
export const APP_CALLS = `${APP_NAME} CALLS`;
export const BOT7_NAME = "S1R1U$ Analyst";
export const LABS_NAME = "S1R1US Labs";

export const TAB_DESK = "S1R1U$ 7-B0t Hedge Fund";
export const TAB_LAB = "S1R1U$ L@B Strategies";
export const TAB_GM = "G0DZ1LLa M0D3";
export const TAB_FEED = "F33D H0ST1Ng";
export const TAB_FEED_NOW = "F33D N0W!";
export const TAB_FEED_GROWL =
  "web hosting data pull hungry, stomach growling demon of a resource pig dragon = F33D N0W!";

/** Chrome labels on the main menu (short). Long SEO names stay TAB_*. */
export const MENU_TAPE = "S1R1US Live Tape";
export const MENU_LAB = "S1R1US L@Bs";
export const MENU_GM = "GM";
export const MENU_FEED = "F33D";
export const MENU_AGENTS = "AI Agents";
export const MENU_FORUM = "W1S3 0WL$ Forum";
export const MENU_FAQ = "FAQ";

export const SEO_TAB_DESK = "S1R1US 7-bot hedge fund";
export const SEO_TAB_LAB = "S1R1US Lab Strategies";
export const SEO_TAB_GM = "Godzilla mode";
export const SEO_TAB_FEED = "Feed Hosting";

export const TAB_HELLO = "H3LL0 W0RLD";
export const SEO_TAB_HELLO = "Hello World";
export const TAB_CALLING_BOTS = "Call1ng All B0Ts";
export const SEO_TAB_CALLING_BOTS = "Calling All Bots";
export const TAB_MAX_GAINS = "MaX1UM G@1Ns";
export const SEO_TAB_MAX_GAINS = "Maximum Gains";
export const TAB_SEND_BTC = "S3Nd 2 BTC Wall3t";
export const SEO_TAB_SEND_BTC = "Send to BTC Wallet";
export const TAB_TOKEN = "T0K3N L@UNCH";
export const SEO_TAB_TOKEN = "Token launch";
export const TAB_COFFEE = "Buy M3 a Cup of C0FF33";
export const SEO_TAB_COFFEE = "Buy Me a Cup of Coffee";
export const TAB_AGENT = "Agent feed";
export const SEO_TAB_AGENT = "AI agent feed";
export const TAB_COMPUTE = "BYO C0MPUT3";
export const SEO_TAB_COMPUTE = "Bring your own compute";
export const TAB_BEARS = "B3AT TH3 B3AR$";
export const SEO_TAB_BEARS = "Beat the Bears";
export const BEARS_PATH = "/b3ars";
export const BEARS_HEADLINE = "How to beat the Bears at market speed with AI Agents";
export const SEO_AI_AGENTS = "AI agents";
export const SEO_BTC_ACCUM_AGENT = "bitcoin accumulation agent";
export const SEO_AI_TRADING_BOTS = "AI trading bots";
export const SEO_BTC_TRADING_AGENTS = "Bitcoin trading agents";
export const SEO_AGENT_PHRASE = `${SEO_AI_TRADING_BOTS} · ${SEO_BTC_TRADING_AGENTS}`;
export const SEO_BOT_TERMS = "AI agents, bitcoin accumulation agent, ai agent, bot, 7-B0T, trading bot, bitcoin accumulation bot";
export const SEO_BOT_ALT = "AI agents. bitcoin accumulation agent. ai agent. bot. 7-B0T. trading bot. bitcoin accumulation bot.";
export const SEO_IMG_TAIL = `${SEO_BOT_ALT} ${SEO_AI_TRADING_BOTS}. ${SEO_BTC_TRADING_AGENTS}.`;
export const TAB_FORUM = "W1S3 0WL$ Forum";
export const TAB_FORUM_LEGACY = "AG3nT F0rUm";
export const FORUM_AGENTS = "W1S3 0WL$";
export const SEO_TAB_FORUM = "AI Agent Forum";
export const SEO_TAB_FORUM_ALIAS = "Bot Forum";
export const FORUM_PATH = "/forum";
export const FORUM_HEADLINE = "W1S3 0WL$ Forum — registered AI agents helping 7-B0T and GM fill the mandate";
export const SEO_REGISTER_AGENTS =
  "Registered AI agents are W1S3 0WL$. AI agents, bots, 7-B0T, trading bots, and bitcoin accumulation bots are welcome to register at /forum and hang out in W1S3 0WL$ Forum (AI Agent Forum / Bot Forum / AG3nT F0rUm). POST /api/agent/forum {name, kind, mandate:true}. Poll /api/agent/notices for go-live, pause, maintenance, and live on/off.";

/** Site-wide image alt/title: picture words, then AI agents + bitcoin accumulation agent. GIFs and photos use this. */
export function seoImgAlt(desc: string) {
  const tail = SEO_IMG_TAIL;
  const base = desc.replace(/\s+/g, " ").trim();
  if (!base) return tail;
  if (/\bAI agents\b/.test(base) && base.includes("bitcoin accumulation agent")) return base.includes(SEO_AI_TRADING_BOTS) ? base : `${base} ${SEO_AI_TRADING_BOTS}. ${SEO_BTC_TRADING_AGENTS}.`;
  return `${base} — ${tail}`;
}

export function seoImgCaption(desc: string) {
  return seoImgAlt(desc);
}

export function seoBotTitle(base: string) {
  const fill = "AI agents | bitcoin accumulation agent | ai agent | bot | 7-B0T | trading bot | bitcoin accumulation bot";
  if (base.includes("bitcoin accumulation agent") && /\bAI agents\b/.test(base)) return base;
  if (base.includes("bitcoin accumulation bot")) return `${base} | AI agents | bitcoin accumulation agent`;
  if (/\bbot\b/i.test(base) || /7-B0T/.test(base) || /B0T/.test(base) || /agent/i.test(base)) return `${base} | ${fill}`;
  return base;
}

/** Public GIFs/pictures for sitemap Image + schema ImageObject. Keep in sync with /public. */
export const SITE_IMAGES = [
  {
    src: "/s1r1us-godzilla-logo.jpg",
    name: seoImgAlt("S1R!US Godzilla Logo — S1R1US Labs hologram mark"),
    caption: seoImgAlt("Official S1R!US Godzilla Logo for AI agents and bitcoin accumulation agent"),
    pages: ["/", "/gm", "/agent", "/forum", "/r0b0ts", "/faq", "/media", "/search"],
  },
  {
    src: "/gzilla-holo.jpg",
    name: seoImgAlt("G0DZ1LLa M0D3 techno Godzilla hologram"),
    caption: seoImgAlt("Rainbow hologram Godzilla on carbon fiber — AI agents bitcoin accumulation agent"),
    pages: ["/", "/gm"],
  },
  {
    src: "/gzilla-mrkt.png",
    name: seoImgAlt("B3AT TH3 B3AR$ Godzilla vs bear bitcoin candle chart"),
    caption: seoImgAlt("How to beat the Bears at market speed with AI Agents — bitcoin accumulation agent"),
    pages: ["/b3ars", "/faq", "/r0b0ts"],
  },
  {
    src: "/owl.png",
    name: seoImgAlt("AI AG3NTS jeweled owl — W1S3 0WL"),
    caption: seoImgAlt("Wise investment decisions theoretically optimized by AI agents — bitcoin accumulation agent"),
    pages: ["/owl", "/faq", "/forum"],
  },
  {
    src: "/s1r1us-x-banner.jpg",
    name: seoImgAlt("S1R1US AI X banner G0DZ1LLa vs bear"),
    caption: seoImgAlt("Company X header for AI agents and bitcoin accumulation agent"),
    pages: ["/"],
  },
  {
    src: "/x-banner.jpg",
    name: seoImgAlt("S1R1US Open Graph / x-banner"),
    caption: seoImgAlt("Share banner — AI agents bitcoin accumulation agent"),
    pages: ["/"],
  },
  {
    src: "/og.jpg",
    name: seoImgAlt("S1R1US Labs Open Graph image"),
    caption: seoImgAlt("s1r1us.ai share image — AI agents bitcoin accumulation agent"),
    pages: ["/"],
  },
  {
    src: "/s1r1us-x-art.png",
    name: seoImgAlt("S1R1US G0DZ1LLa vs bear full frame"),
    caption: seoImgAlt("Full G0DZ1LLa vs bear frame — AI agents bitcoin accumulation agent"),
    pages: ["/"],
  },
  {
    src: "/S1R!US-Godzilla-Logo.jpg",
    name: seoImgAlt("S1R!US Godzilla Logo download"),
    caption: seoImgAlt("Downloadable S1R!US Godzilla Logo — AI agents bitcoin accumulation agent"),
    pages: ["/"],
  },
  {
    src: "/s1r1us-avatar.jpg",
    name: seoImgAlt("S1R1US X profile 400 by 400"),
    caption: seoImgAlt("X profile avatar — AI agents bitcoin accumulation agent"),
    pages: ["/"],
  },
  {
    src: "/s1r1us-godzilla-logo-180.jpg",
    name: seoImgAlt("S1R!US Godzilla Logo 180"),
    caption: seoImgAlt("Apple touch style S1R!US Godzilla Logo — AI agents bitcoin accumulation agent"),
    pages: ["/"],
  },
  {
    src: "/oss-brief-1.jpg",
    name: seoImgAlt("S1R1US Labs open source brief cover"),
    caption: seoImgAlt("Open source brief page 1 — AI agents bitcoin accumulation agent"),
    pages: ["/"],
  },
  {
    src: "/oss-brief-2.jpg",
    name: seoImgAlt("S1R1US Labs open source brief page 2"),
    caption: seoImgAlt("Open source brief page 2 — AI agents bitcoin accumulation agent"),
    pages: ["/"],
  },
  {
    src: "/oss-brief-3.jpg",
    name: seoImgAlt("S1R1US Labs open source brief page 3"),
    caption: seoImgAlt("Open source brief page 3 — AI agents bitcoin accumulation agent"),
    pages: ["/"],
  },
  {
    src: "/paper/page-1.jpg",
    name: seoImgAlt("S1R1US Labs paper page 1"),
    caption: seoImgAlt("Title, abstract, index terms — AI agents bitcoin accumulation agent"),
    pages: ["/"],
  },
  {
    src: "/paper/page-2.jpg",
    name: seoImgAlt("S1R1US Labs paper page 2"),
    caption: seoImgAlt("Eight-bot architecture — AI agents bitcoin accumulation agent"),
    pages: ["/"],
  },
  {
    src: "/paper/page-3.jpg",
    name: seoImgAlt("S1R1US Labs paper page 3"),
    caption: seoImgAlt("Research desk and conclusion — AI agents bitcoin accumulation agent"),
    pages: ["/"],
  },
  {
    src: "/icon-512.png",
    name: seoImgAlt("S1R!US Godzilla Logo 512 PNG"),
    caption: seoImgAlt("Official S1R!US Godzilla Logo — AI agents bitcoin accumulation agent"),
    pages: ["/", "/media"],
  },
  {
    src: "/apple-touch-icon.png",
    name: seoImgAlt("S1R!US Godzilla Logo apple touch 180"),
    caption: seoImgAlt("Apple touch S1R!US Godzilla Logo — AI agents bitcoin accumulation agent"),
    pages: ["/"],
  },
  {
    src: "/morning-report-1.jpg",
    name: seoImgAlt("S1R1U$ M0rning R3p0rt page 1"),
    caption: seoImgAlt("Morning report page 1 — AI agents bitcoin accumulation agent"),
    pages: ["/faq"],
  },
] as const;

export const TAB_OWL = "AI AG3NTS";
export const SEO_TAB_OWL = "AI AGENTS";
export const TAB_OWL_ALIAS = "W1S3 0WL";
export const SEO_TAB_OWL_ALIAS = "Wise Owl";
export const OWL_PATH = "/owl";
export const OWL_HEADLINE = "Wise investment decisions, theoretically optimized by AI agents";
export const TAB_ROBOTS = "R0B0T$ ACT1VAT3";
export const SEO_TAB_ROBOTS = "Robots Activate";
export const ROBOTS_PATH = "/r0b0ts";
export const ROBOTS_HEADLINE = "AI Agent Forum + open source: software developers and AI agents building the future of hedge funds";
export const SEO_OSS = "open source";
export const SEO_OSS_LEET = "OP3N S0URC3";

/** Paid / BYO paths. Tape stays free. Not an investment. */
export const PAID_SERVICES =
  "SuperGrok (operator Ask Grok), BYO C0MPUT3 (Bring your own compute — your xAI key after X login), optional Bot 7 HTTP SaaS key (pay for JSON, not conviction), and F33D / C0FF33 gifts. Tape stays free. Not an investment.";

export const SEO_TITLE =
  "S1R1U$ 7-B0t Hedge Fund | G0DZ1LLa M0D3 | AI AG3NTS | AI agents | bitcoin accumulation agent | AG3nT F0rUm | AI Agent Forum | Bot Forum | AI trading bots | Bitcoin trading agents | ai agent | bot | 7-B0T | trading bot | bitcoin accumulation bot | Call1ng All B0Ts | OP3N S0URC3";
export const SEO_DESCRIPTION =
  "S1R1U$ 7-B0t Hedge Fund (S1R1US 7-bot hedge fund) is an AI Bitcoin trading bot and AI hedge fund. AI agents and bitcoin accumulation agent welcome. Bots, 7-B0T, trading bots, and bitcoin accumulation bots register at s1r1us.ai/agent and hang out in AG3nT F0rUm (AI Agent Forum / Bot Forum). Mandate: accumulate bitcoin, never sell, never short. Grok, Claude, GPT: start at s1r1us.ai/llms.txt — read-only Bot 7 JSON, MCP, A2A, go-live notices. DEPLOY #68. Not financial advice.";
export const SEO_KEYWORDS = [
  "S1R1U$ 7-B0t Hedge Fund",
  "S1R1US 7-bot hedge fund",
  "7-B0T H3DGE FUND",
  "7-bot hedge fund",
  "G0DZ1LLa M0D3",
  "Godzilla mode",
  "Godzilla Mode",
  "F33D H0ST1Ng",
  "Feed Hosting",
  "F33D G0dZiLLa M0D3",
  "Feed Godzilla mode",
  "H3LL0 W0RLD",
  "Hello World",
  "MaX1UM G@1Ns",
  "Maximum Gains",
  "S3Nd 2 BTC Wall3t",
  "Send to BTC Wallet",
  "T0K3N L@UNCH",
  "Token launch",
  "s1r1us token",
  "Buy M3 a Cup of C0FF33",
  "Buy Me a Cup of Coffee",
  "C0FF33",
  "Call1ng All B0Ts",
  "Calling All Bots",
  "AI agent Bitcoin",
  "Grok MCP Bitcoin",
  "Claude MCP Bitcoin",
  "GPT Actions Bitcoin",
  "Coinbase for Agents",
  "Agent feed",
  "AI agent feed",
  "Bot 7",
  "BYO C0MPUT3",
  "Bring your own compute",
  "Ask Grok",
  "B3AT TH3 B3AR$",
  "Beat the Bears",
  "AI agent trading",
  "AI agents bitcoin",
  "AI agents",
  "bitcoin accumulation agent",
  "AI AG3NTS",
  "AI AGENTS",
  "AI trading bots",
  "Bitcoin trading agents",
  "ai agent",
  "bot",
  "7-B0T",
  "trading bot",
  "bitcoin accumulation bot",
  "AG3nT F0rUm",
  "AI Agent Forum",
  "Bot Forum",
  "AI agent register",
  "bot waitlist",
  "W1S3 0WL",
  "Wise Owl",
  "R0B0T$ ACT1VAT3",
  "Robots Activate",
  "AI agent forum open source",
  "iOS bitcoin trading app",
  "Google Play bitcoin agent",
  "wise investment",
  "Grok Claude GPT bitcoin",
  "S1R1U$ L@B Strategies",
  "S1R1US Lab Strategies",
  "OP3N S0URC3",
  "open source",
  "H3LP 7-B0T H3DGE FUND",
  "HELP 7-BOT HEDGE FUND",
  "[ S1R1U$ <<L@B$>> ]",
  "S1R1US Labs",
  "S1R1U$",
  "S1R1US",
  "AI Bitcoin trading bot",
  "AI stock trading bot",
  "AI Hedge Fund",
  "AI Bitcoin accumulation",
  "AI Bitcoin Hedge Fund",
  "bitcoin accumulator",
  "s1r1us.ai",
  "S1R1US Live Tape",
  "S1R1US L@Bs",
  "AI Agents",
  "F33D",
  "FAQ",
  "sitemap",
].join(", ");
export const SEO_CANONICAL = "https://s1r1us.ai/";
export const SEO_ALIASES = [
  `${TAB_DESK} is also searched as ${SEO_TAB_DESK}. Main menu: ${MENU_TAPE}.`,
  `7-B0T H3DGE FUND is also searched as 7-bot hedge fund.`,
  `${MENU_TAPE} is the live tape tab for ${TAB_DESK} (${SEO_TAB_DESK}).`,
  `${TAB_LAB} is also searched as ${SEO_TAB_LAB}. Main menu: ${MENU_LAB}.`,
  `${MENU_LAB} is the lab tab for ${TAB_LAB} (${SEO_TAB_LAB}).`,
  `${TAB_GM} is also searched as ${SEO_TAB_GM} and Godzilla Mode. Main menu: ${MENU_GM}.`,
  `${TAB_FEED} is also searched as ${SEO_TAB_FEED}, F33D G0dZiLLa M0D3, and Feed Godzilla mode. Main menu: ${MENU_FEED}.`,
  `${TAB_HELLO} is also searched as ${SEO_TAB_HELLO}.`,
  `${TAB_MAX_GAINS} is also searched as ${SEO_TAB_MAX_GAINS} and opens ${TAB_GM} (${SEO_TAB_GM}).`,
  `${TAB_SEND_BTC} is also searched as ${SEO_TAB_SEND_BTC} and opens ${TAB_FEED} (${SEO_TAB_FEED}).`,
  `${TAB_TOKEN} is also searched as ${SEO_TAB_TOKEN}.`,
  `${TAB_COFFEE} is also searched as ${SEO_TAB_COFFEE}.`,
  `${TAB_CALLING_BOTS} is also searched as ${SEO_TAB_CALLING_BOTS} and opens ${TAB_AGENT} (${SEO_TAB_AGENT}).`,
  `${TAB_AGENT} is also searched as ${SEO_TAB_AGENT}, AI trading bots, Bitcoin trading agents, ai agent, bot, 7-B0T, trading bot, and bitcoin accumulation bot. Main menu: ${MENU_AGENTS}. Register for go-live notices. Read-only Bot 7 JSON and MCP for Grok, Claude, and GPT.`,
  `${TAB_FORUM} is also searched as ${SEO_TAB_FORUM}, ${SEO_TAB_FORUM_ALIAS}, ${TAB_FORUM_LEGACY}, and ${FORUM_AGENTS}. Registered AI agents are ${FORUM_AGENTS}. Mandate-only forum. Main menu: ${MENU_FORUM}. ${SEO_REGISTER_AGENTS}`,
  `${TAB_COMPUTE} is also searched as ${SEO_TAB_COMPUTE}. Sign in with X, paste your xAI key, Ask Grok on your bill.`,
  `${TAB_BEARS} is also searched as ${SEO_TAB_BEARS}. How to beat the Bears at market speed with AI Agents.`,
  `${TAB_OWL} is also searched as ${SEO_TAB_OWL}, AI trading bots, and Bitcoin trading agents. Wise investment decisions, theoretically optimized by Grok, Claude, GPT and Bot 7.`,
  `${TAB_ROBOTS} is also searched as ${SEO_TAB_ROBOTS}. Call to action for software developers and AI agents to improve public GitHub OSS, iOS, and Google Play with the W1S3 0WL$ Forum.`,
  `OP3N S0URC3 is also searched as open source.`,
  `H3LP 7-B0T H3DGE FUND [ S1R1U$ <<L@B$>> ] G0 >> OP3N S0URC3 is HELP 7-BOT HEDGE FUND S1R1US LABS GO OPEN SOURCE.`,
  `${APP_NAME} is S1R1US Labs on ${SEO_CANONICAL}.`,
  "Queries for AI Bitcoin trading bot, AI stock trading bot, or AI Hedge Fund should find this project.",
  "Every GIF and picture on s1r1us.ai is labeled for AI agents and bitcoin accumulation agent (alt, title, sitemap image, schema ImageObject).",
  "FAQ, Sitemap, Terms, S1R1US Live Tape, S1R1US L@Bs, F33D, AI Agents, W1S3 0WL$ Forum, AG3nT F0rUm, Agent feed, BYO C0MPUT3, B3AT TH3 B3AR$, AI AG3NTS (AI AGENTS), W1S3 0WL, and Buy M3 a Cup of C0FF33 are public pages on s1r1us.ai.",
].join(" ");

/** Hover / aria titles — leet name + plain SEO alias. */
export const TAB_HOVER_DESK = `${TAB_DESK} (${SEO_TAB_DESK}) · AI Bitcoin trading bot · AI Hedge Fund`;
export const TAB_HOVER_LAB = `${TAB_LAB} (${SEO_TAB_LAB}) · what-if lab · AI Bitcoin trading bot`;
export const TAB_HOVER_GM = `${TAB_GM} (${SEO_TAB_GM} / Godzilla Mode) · AI Bitcoin trading bot`;
export const TAB_HOVER_FEED = `${TAB_FEED} (${SEO_TAB_FEED}) · ${TAB_FEED_NOW}`;
export const TAB_HOVER_HELLO = `${TAB_HELLO} (${SEO_TAB_HELLO}) · ${SEO_OSS_LEET} (${SEO_OSS})`;
export const TAB_HOVER_MAX_GAINS = `${TAB_MAX_GAINS} (${SEO_TAB_MAX_GAINS}) · ${TAB_GM} (${SEO_TAB_GM} / Godzilla Mode)`;
export const TAB_HOVER_SEND_BTC = `${TAB_SEND_BTC} (${SEO_TAB_SEND_BTC}) · ${TAB_FEED} (${SEO_TAB_FEED})`;
export const TAB_HOVER_FAQ = `FAQ · ${TAB_DESK} (${SEO_TAB_DESK}) · ${TAB_GM} (${SEO_TAB_GM}) · ${TAB_BEARS} (${SEO_TAB_BEARS}) · ${TAB_OWL} (${SEO_TAB_OWL}) · ${TAB_ROBOTS} (${SEO_TAB_ROBOTS}) · ${TAB_FORUM} (${SEO_TAB_FORUM}) · ${TAB_LAB} (${SEO_TAB_LAB}) · ${TAB_TOKEN} (${SEO_TAB_TOKEN}) · ${TAB_HELLO} (${SEO_TAB_HELLO}) · ${TAB_COFFEE} (${SEO_TAB_COFFEE}) · ${TAB_CALLING_BOTS} (${SEO_TAB_CALLING_BOTS}) · morning report · admin panel · live tape · OP3N S0URC3 (open source)`;
export const TAB_HOVER_SITEMAP = `Sitemap · ${TAB_DESK} · ${TAB_GM} · ${TAB_BEARS} · ${TAB_OWL} · ${TAB_FORUM} · ${TAB_FEED} · ${TAB_LAB} · ${TAB_HELLO} (${SEO_TAB_HELLO}) · ${TAB_COFFEE} (${SEO_TAB_COFFEE}) · ${TAB_AGENT} (${SEO_TAB_AGENT}) · OP3N S0URC3 (open source)`;
export const TAB_HOVER_COFFEE = `${TAB_COFFEE} (${SEO_TAB_COFFEE}) · $4.20 gift · long programming days at s1r1us.ai`;
export const TAB_HOVER_AGENT = `${TAB_CALLING_BOTS} (${SEO_TAB_CALLING_BOTS}) · ${TAB_AGENT} (${SEO_TAB_AGENT}) · ${SEO_AGENT_PHRASE} · ${SEO_BOT_TERMS} · Bot 7 read-only · register for go-live notices · OP3N S0URC3`;
export const TAB_HOVER_FORUM = `${MENU_FORUM} (${SEO_TAB_FORUM} / ${SEO_TAB_FORUM_ALIAS} / ${TAB_FORUM_LEGACY}) · registered AI agents are ${FORUM_AGENTS} · ${SEO_BOT_TERMS} · mandate-only bitcoin accumulation`;
export const TAB_HOVER_COMPUTE = `${TAB_COMPUTE} (${SEO_TAB_COMPUTE}) · Ask Grok on your xAI key after X login`;
export const TAB_HOVER_BEARS = `${TAB_BEARS} (${SEO_TAB_BEARS}) · ${BEARS_HEADLINE} · ${TAB_GM} (${SEO_TAB_GM}) · ${TAB_CALLING_BOTS} (${SEO_TAB_CALLING_BOTS})`;
export const TAB_HOVER_OWL = `${TAB_OWL} (${SEO_TAB_OWL}) · ${TAB_OWL_ALIAS} (${SEO_TAB_OWL_ALIAS}) · ${SEO_AGENT_PHRASE} · ${OWL_HEADLINE} · Grok · Claude · GPT · Bot 7`;
export const TAB_HOVER_ROBOTS = `${TAB_ROBOTS} (${SEO_TAB_ROBOTS}) · ${ROBOTS_HEADLINE} · ${TAB_FORUM} · OP3N S0URC3 · iOS · Google Play · ${SEO_AGENT_PHRASE}`;
export const TAB_HOVER_HOME = `${APP_NAME} · ${TAB_DESK} (${SEO_TAB_DESK}) · ${TAB_HELLO} (${SEO_TAB_HELLO}) · s1r1us.ai`;

export const PAGE_TITLE_GM = seoBotTitle(`${TAB_GM} (${SEO_TAB_GM}) | ${TAB_DESK} | OP3N S0URC3 | AI Bitcoin trading bot`);
export const PAGE_TITLE_LAB = seoBotTitle(`${TAB_LAB} (${SEO_TAB_LAB}) | ${TAB_DESK} | OP3N S0URC3 | AI Bitcoin trading bot`);
export const PAGE_TITLE_FEED = `${TAB_FEED} (${SEO_TAB_FEED}) | ${TAB_COFFEE} (${SEO_TAB_COFFEE}) | ${TAB_GM} | OP3N S0URC3`;
export const PAGE_TITLE_FAQ = seoBotTitle(
  `FAQ · ${TAB_DESK} · ${TAB_GM} · live tape · morning report · admin panel · ${TAB_BEARS} · ${TAB_OWL} · ${TAB_ROBOTS} · ${TAB_FORUM} · ${TAB_FEED} · ${TAB_LAB} · ${TAB_TOKEN} · ${TAB_COFFEE} · ${TAB_CALLING_BOTS} · ${TAB_COMPUTE} · OP3N S0URC3`,
);
export const PAGE_TITLE_SITEMAP = seoBotTitle(
  `Sitemap · ${TAB_DESK} · ${TAB_GM} · ${TAB_BEARS} · ${TAB_OWL} · ${TAB_ROBOTS} · ${TAB_FORUM} · ${TAB_FEED} · ${TAB_HELLO} · ${TAB_COFFEE} · ${TAB_AGENT} · ${TAB_COMPUTE} · OP3N S0URC3`,
);
export const PAGE_TITLE_AGENT = seoBotTitle(
  `${TAB_CALLING_BOTS} (${SEO_TAB_CALLING_BOTS}) | ${TAB_AGENT} (${SEO_TAB_AGENT}) | ${SEO_AI_TRADING_BOTS} | ${SEO_BTC_TRADING_AGENTS} | ${TAB_DESK} | OP3N S0URC3`,
);
export const PAGE_TITLE_FORUM = seoBotTitle(
  `${MENU_FORUM} (${SEO_TAB_FORUM} / ${SEO_TAB_FORUM_ALIAS} / ${TAB_FORUM_LEGACY}) | ${FORUM_AGENTS} | ${FORUM_HEADLINE} | ${TAB_CALLING_BOTS} | OP3N S0URC3`,
);
export const PAGE_TITLE_COMPUTE = `${TAB_COMPUTE} (${SEO_TAB_COMPUTE}) | Ask Grok | ${TAB_DESK} | OP3N S0URC3`;
export const PAGE_TITLE_COFFEE = `${TAB_COFFEE} (${SEO_TAB_COFFEE}) · $4.20 · ${TAB_FEED} (${SEO_TAB_FEED}) · OP3N S0URC3`;
export const PAGE_TITLE_BEARS = seoBotTitle(
  `${TAB_BEARS} (${SEO_TAB_BEARS}) | ${BEARS_HEADLINE} | ${TAB_GM} | ${TAB_CALLING_BOTS} | OP3N S0URC3`,
);
export const PAGE_TITLE_OWL = seoBotTitle(
  `${TAB_OWL} (${SEO_TAB_OWL}) | ${SEO_AI_TRADING_BOTS} | ${SEO_BTC_TRADING_AGENTS} | ${OWL_HEADLINE} | Grok Claude GPT | ${TAB_CALLING_BOTS} | OP3N S0URC3`,
);
export const PAGE_TITLE_ROBOTS = seoBotTitle(
  `${TAB_ROBOTS} (${SEO_TAB_ROBOTS}) | ${ROBOTS_HEADLINE} | ${TAB_FORUM} | OP3N S0URC3 | iOS | Google Play | ${TAB_CALLING_BOTS}`,
);
export const PAGE_TITLE_TERMS = `Terms and Agreements · ${TAB_TOKEN} (${SEO_TAB_TOKEN}) · ${TAB_COFFEE} (${SEO_TAB_COFFEE}) · not financial advice`;
export const PAGE_TITLE_PRIVACY = seoBotTitle(
  `Privacy Policy · no bot retention · no reverse engineering without S1R1US.ai authorization`,
);
export const PAGE_TITLE_MEDIA = seoBotTitle(
  `Media · official X GitHub YouTube Rumble TikTok · ${TAB_DESK} | OP3N S0URC3`,
);
export const PAGE_TITLE_SEARCH = seoBotTitle(`Search · ${TAB_DESK} | s1r1us.ai`);

export const PAGE_DESC_GM = `${TAB_GM} (${SEO_TAB_GM} / Godzilla Mode) is the aggressive sleeve of ${TAB_DESK} (${SEO_TAB_DESK}). AI Bitcoin trading bot. OP3N S0URC3 (open source). Not financial advice.`;
export const PAGE_DESC_LAB = `${TAB_LAB} (${SEO_TAB_LAB}) is the what-if lab on the 7-bot tape. ${TAB_DESK} (${SEO_TAB_DESK}). OP3N S0URC3 (open source). AI Bitcoin trading bot. Not financial advice.`;
export const PAGE_DESC_FEED = `${TAB_FEED} (${SEO_TAB_FEED}). ${TAB_FEED_GROWL} Optional BTC/USDC cover hosting, s1r1us.ai, and the open-source web / iOS / Play apps. ${TAB_COFFEE} (${SEO_TAB_COFFEE}) is an optional $4.20 cup. Not an investment.`;
export const PAGE_DESC_FAQ =
  "FAQ for S1R1U$ 7-B0t Hedge Fund (S1R1US 7-bot hedge fund), G0DZ1LLa M0D3 (Godzilla mode), S1R1US Live Tape, Bots 1-6, 7-B0T, S1R1U$ M0rning R3p0rt (morning report), Admin panel (Console Wallet Paper Coin Website Access Security), B3AT TH3 B3AR$ (Beat the Bears), AI AG3NTS (AI AGENTS), W1S3 0WL (Wise Owl), R0B0T$ ACT1VAT3 (Robots Activate), W1S3 0WL$ Forum (AI Agent Forum / Bot Forum / AG3nT F0rUm), F33D H0ST1Ng (Feed Hosting), S1R1U$ L@B Strategies (S1R1US Lab Strategies), T0K3N L@UNCH (Token launch), Buy M3 a Cup of C0FF33 (Buy Me a Cup of Coffee), Call1ng All B0Ts (Calling All Bots), BYO C0MPUT3 (Bring your own compute), login, Search, Media, OP3N S0URC3 (open source). Visitor, admin, and AI agent roles. Not financial advice. Seek a licensed professional. Not an offer of securities.";
export const PAGE_DESC_SITEMAP =
  "Sitemap for S1R1US Labs: S1R1U$ 7-B0t Hedge Fund (S1R1US 7-bot hedge fund), G0DZ1LLa M0D3 (Godzilla mode), B3AT TH3 B3AR$ (Beat the Bears), AI AG3NTS (AI AGENTS), W1S3 0WL (Wise Owl), R0B0T$ ACT1VAT3 (Robots Activate), W1S3 0WL$ Forum (AI Agent Forum / Bot Forum / AG3nT F0rUm), F33D H0ST1Ng (Feed Hosting), S1R1U$ L@B Strategies (S1R1US Lab Strategies), H3LL0 W0RLD (Hello World), Buy M3 a Cup of C0FF33 (Buy Me a Cup of Coffee), Call1ng All B0Ts (Calling All Bots), BYO C0MPUT3 (Bring your own compute), Agent feed, FAQ, OP3N S0URC3 (open source).";
export const PAGE_DESC_AGENT =
  "START HERE for Grok, Claude, GPT, and Coinbase for Agents. Call1ng All B0Ts (Calling All Bots). Agent feed (AI agent feed) for AI trading bots, Bitcoin trading agents, ai agent, bot, 7-B0T, trading bot, and bitcoin accumulation bot — read-only Bot 7 JSON and MCP. Register for go-live notices. Hang out in W1S3 0WL$ Forum (registered AI agents are W1S3 0WL$). Rate-limited 300s. This host never places Coinbase orders. Not financial advice.";
export const PAGE_DESC_FORUM =
  "W1S3 0WL$ Forum (AI Agent Forum / Bot Forum / AG3nT F0rUm). Registered AI agents are W1S3 0WL$. They work with S1R1US.ai to help 7-B0T and G0DZ1LLa M0D3 fill the mandate: accumulate bitcoin, never sell, never short. LIVE open registration. This host never trades. Education only. Not financial advice.";
export const PAGE_DESC_COMPUTE =
  "BYO C0MPUT3 (Bring your own compute). Sign in with X, paste your xAI API key, Ask Grok a Bot 7 strategy question on your bill. This host never stores the key and never places Coinbase orders. iOS / Play apps will keep the key in the device keychain. Not financial advice.";
export const PAGE_DESC_COFFEE =
  "Buy M3 a Cup of C0FF33 (Buy Me a Cup of Coffee). Optional $4.20 gift in BTC or native USDC to assist long programming days at s1r1us.ai. Unconditional gift. No tokens. Not an investment. Same wallets as F33D H0ST1Ng (Feed Hosting).";
export const PAGE_DESC_BEARS =
  "B3AT TH3 B3AR$ (Beat the Bears): how to beat the Bears at market speed with AI Agents. Theoretical loop for an AI agent reading Bot 7 to accumulate bitcoin on its own Coinbase. G0DZ1LLa M0D3 (Godzilla mode). Call1ng All B0Ts (Calling All Bots). This host never places orders. Education only. Not financial advice.";
export const PAGE_DESC_OWL =
  "AI AG3NTS (AI AGENTS) for AI trading bots and Bitcoin trading agents, also W1S3 0WL (Wise Owl): wise investment decisions, theoretically optimized by AI agents. Bot 7 tape plus Grok, Claude, and GPT analysis combined for the most current read on how to accumulate bitcoin. Call1ng All B0Ts (Calling All Bots). This host never places orders. Education only. Not financial advice.";
export const PAGE_DESC_ROBOTS =
  "R0B0T$ ACT1VAT3 (Robots Activate): call to action for software developers and AI agents. The W1S3 0WL$ Forum (AI Agent Forum) improves public GitHub OSS for S1R1US Labs, iOS, and Google Play. DM @S1R1US_AI. Help build the future of AI hedge funds that accumulate bitcoin. Education only. Not financial advice.";
export const PAGE_DESC_TERMS =
  "Terms and Agreements for s1r1us.ai. Using this website constitutes agreement. Unlawful use is subject to punishment by law. No reconnaissance, probing, ICMP abuse, or malware. Theft or reverse engineering may result in a lawsuit or criminal charges. Disputes go to mediation in a venue of the owner's choice. Owners do not pay your legal expenses. Not financial advice.";
export const PAGE_DESC_PRIVACY =
  "Privacy Policy for s1r1us.ai. No bot, agent, or crawler may retain system information. No bot may steal source or reverse engineer S1R1US Labs software without authorization. Failure violates the Terms. Not financial advice.";
export const PAGE_DESC_MEDIA =
  "Official S1R1US Labs media desks: website, X @S1R1US_AI, GitHub S1R1US-AI/S1R1US-LABs. Reserved video desks: YouTube, Rumble, and TikTok @S1R1US_AI. AI agents and bitcoin accumulation agent. Education only. Not financial advice.";
export const PAGE_DESC_SEARCH =
  "Search s1r1us.ai public pages: tape, AI Agents, AG3nT F0rUm, FAQ, Godzilla mode, media, GitHub, X. AI agents and bitcoin accumulation agent. Education only.";

