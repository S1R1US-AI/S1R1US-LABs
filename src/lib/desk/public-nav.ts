import {
  APP_NAME,
  LABS_NAME,
  SEO_CANONICAL,
  SEO_TAB_DESK,
  SEO_TAB_FEED,
  SEO_TAB_GM,
  SEO_TAB_LAB,
  PAGE_TITLE_FAQ,
  PAGE_TITLE_FEED,
  PAGE_TITLE_GM,
  PAGE_TITLE_LAB,
  PAGE_TITLE_SITEMAP,
  SEO_TAB_TOKEN,
  TAB_DESK,
  TAB_FEED,
  TAB_GM,
  TAB_LAB,
  TAB_TOKEN,
} from "@/lib/brand";
import { COMPANY_X_HANDLE, companyHandleSet } from "@/lib/desk/x-admin";
import { SUPPORT_BLURB, SUPPORT_BTC, SUPPORT_USDC } from "@/lib/desk/support";
import { TERMS_PATH, TERMS_TITLE } from "@/lib/legal";

const origin = SEO_CANONICAL.replace(/\/$/, "");

export const PUBLIC_PAGES = [
  {
    path: "/",
    loc: `${origin}/`,
    label: "Home",
    title: `${TAB_DESK} (${SEO_TAB_DESK}) · ${APP_NAME}`,
    hint: `${SEO_TAB_DESK} · AI Bitcoin trading bot · AI Hedge Fund · H3LL0 W0RLD (Hello World)`,
    changefreq: "hourly",
    priority: "1.0",
  },
  {
    path: "/gm",
    loc: `${origin}/gm`,
    label: TAB_GM,
    title: PAGE_TITLE_GM,
    hint: `${SEO_TAB_GM} · Godzilla Mode · MaX1UM G@1Ns (Maximum Gains)`,
    changefreq: "hourly",
    priority: "0.9",
  },
  {
    path: "/f33d",
    loc: `${origin}/f33d`,
    label: TAB_FEED,
    title: PAGE_TITLE_FEED,
    hint: `${SEO_TAB_FEED} · S3Nd 2 BTC Wall3t (Send to BTC Wallet) · hosting · domain · iOS / Play apps`,
    changefreq: "weekly",
    priority: "0.7",
  },
  {
    path: "/helios",
    loc: `${origin}/helios`,
    label: TAB_LAB,
    title: PAGE_TITLE_LAB,
    hint: `${SEO_TAB_LAB} · what-if lab on the 7-bot tape`,
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
    label: "FAQ",
    title: PAGE_TITLE_FAQ,
    hint: `${SEO_TAB_GM}, ${SEO_TAB_DESK}, ${SEO_TAB_LAB}, ${SEO_TAB_FEED}, ${SEO_TAB_TOKEN}, open source`,
    changefreq: "weekly",
    priority: "0.7",
  },
  {
    path: TERMS_PATH,
    loc: `${origin}${TERMS_PATH}`,
    label: TERMS_TITLE,
    title: `${TERMS_TITLE} · ${TAB_TOKEN} (${SEO_TAB_TOKEN})`,
    hint: "Using this website is agreement. Not financial advice. Not an offer of securities.",
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
] as const;

export const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: `What is ${TAB_DESK} (S1R1US 7-bot hedge fund)?`,
    a: `${TAB_DESK} is also searched as ${SEO_TAB_DESK} and 7-B0T H3DGE FUND. It is an AI Bitcoin trading bot and AI hedge fund on s1r1us.ai. Seven orthogonal bots read free public tape. Bot 7 (${APP_NAME} Analyst) issues the accumulation call. SuperGrok is the only paid service. Education only — not financial advice.`,
  },
  {
    q: `What is ${TAB_GM} (Godzilla mode)?`,
    a: `${TAB_GM} is Godzilla mode (also Godzilla Mode). It is the aggressive sleeve of the S1R1US 7-bot hedge fund: AUTO or MANUAL, practice or live (live only if admin unlocks). It can day-trade a sleeve. The 7-bot stack is still built to accumulate bitcoin, not to short the book. Not financial advice.`,
  },
  {
    q: `What is ${TAB_LAB} (S1R1US Lab Strategies)?`,
    a: `${TAB_LAB} is also searched as ${SEO_TAB_LAB}. It is the what-if lab: sliders and presets overlay the last live pull so you can see how Bot 7 and bots 1–6 would call under different market structure. It does not write feeds and does not place live orders.`,
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
      ? `${LABS_NAME} on s1r1us.ai. Public company desk is ${COMPANY_X_HANDLE}. Operator identity is not published. Display names and lookalikes are not admin. Not an offer of securities.`
      : `${LABS_NAME} on s1r1us.ai. Operator identity is not published. Display names and lookalikes are not admin. Not an offer of securities.`,
  },
  {
    q: `What is ${TAB_TOKEN} (Token launch)?`,
    a: `${TAB_TOKEN} is also searched as ${SEO_TAB_TOKEN}. A cultural ticker named s1r1us may exist on a public pad such as pump.fun. Company desk on X is ${COMPANY_X_HANDLE}. This website does not sell tokens and does not take orders. The ticker is not shares of ${LABS_NAME}, not a claim on bitcoin, not a profit share, and not how the 7-bot book is funded. Do not buy any ticker because bots or a bitcoin stack exist. Not an offer of securities. Not financial advice. Seek a licensed professional. See Terms and Agreements.`,
  },
  {
    q: `What is H3LL0 W0RLD (Hello World)?`,
    a: `H3LL0 W0RLD is also searched as Hello World. It is the expand greeting on the public tape. It links to OP3N S0URC3 (open source) on GitHub. MaX1UM G@1Ns (Maximum Gains) opens G0DZ1LLa M0D3 (Godzilla mode). S3Nd 2 BTC Wall3t (Send to BTC Wallet) opens F33D G0dZiLLa M0D3 (Feed Godzilla mode).`,
  },
  {
    q: "Is this financial advice?",
    a: "No. s1r1us.ai, the desk, lab, G0DZ1LLa M0D3, F33D G0dZiLLa M0D3, T0K3N L@UNCH, and related systems are not licensed for financial advice and are not a broker or investment adviser. Education only. Seek a licensed professional. Invest at your own risk and only on the advice of a licensed advisor. Using this website is agreement to the Terms.",
  },
  {
    q: "What are the Terms and Agreements?",
    a: "The Terms and Agreements are at /terms. By accessing or using this website you agree to them. They state: not financial advice; seek a licensed professional; not an offer of securities; optional donations are gifts; software as-is. If you do not agree, do not use the site.",
  },
  {
    q: "Does the desk place live Coinbase orders by default?",
    a: "No. Practice and paper fills use the live Coinbase last price. Live Coinbase execution stays off until the operator unlocks it. You are responsible for any trade you authorize.",
  },
  {
    q: "What data does the 7-bot tape use?",
    a: "Free public sources only (Coinbase, FRED, mempool, public perps, ETF/DAT pages, and similar). SuperGrok is the only paid service. No CoinGlass key is required for the public long/short heatmap.",
  },
  {
    q: "How can I support hosting and the apps?",
    a: `${SUPPORT_BLURB} Bitcoin (BTC): ${SUPPORT_BTC}. USDC on Ethereum (ERC-20): ${SUPPORT_USDC}. Send only those assets to those addresses. Tab: F33D G0dZiLLa M0D3.`,
  },
];
