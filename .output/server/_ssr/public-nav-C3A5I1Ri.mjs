import { c as companyHandleSet } from "./x-admin-SEv9ocnZ.mjs";
import { I as TAB_LAB, O as TAB_GM, S as SEO_TAB_LAB, T as TAB_FEED, b as SEO_TAB_FEED, d as PAGE_TITLE_FEED, f as PAGE_TITLE_GM, g as SEO_CANONICAL, i as LABS_NAME, m as PAGE_TITLE_SITEMAP, n as APP_NAME, p as PAGE_TITLE_LAB, u as PAGE_TITLE_FAQ, w as TAB_DESK, x as SEO_TAB_GM, y as SEO_TAB_DESK } from "./brand-BYgKrfVF.mjs";
import { i as SUPPORT_USDC, n as SUPPORT_BTC, t as SUPPORT_BLURB } from "./support-DWxQ4XSQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/public-nav-C3A5I1Ri.js
var origin = SEO_CANONICAL.replace(/\/$/, "");
var PUBLIC_PAGES = [
	{
		path: "/",
		loc: `${origin}/`,
		label: "Home",
		title: `${TAB_DESK} (${SEO_TAB_DESK}) · ${APP_NAME}`,
		hint: `${SEO_TAB_DESK} · AI Bitcoin trading bot · AI Hedge Fund`,
		changefreq: "hourly",
		priority: "1.0"
	},
	{
		path: "/gm",
		loc: `${origin}/gm`,
		label: TAB_GM,
		title: PAGE_TITLE_GM,
		hint: `${SEO_TAB_GM} · Godzilla Mode · AI Bitcoin trading bot`,
		changefreq: "hourly",
		priority: "0.9"
	},
	{
		path: "/f33d",
		loc: `${origin}/f33d`,
		label: TAB_FEED,
		title: PAGE_TITLE_FEED,
		hint: `${SEO_TAB_FEED} · hosting · domain · iOS / Play apps`,
		changefreq: "weekly",
		priority: "0.7"
	},
	{
		path: "/helios",
		loc: `${origin}/helios`,
		label: TAB_LAB,
		title: PAGE_TITLE_LAB,
		hint: `${SEO_TAB_LAB} · what-if lab on the 7-bot tape`,
		changefreq: "daily",
		priority: "0.8"
	},
	{
		path: "/s1r1us",
		loc: `${origin}/s1r1us`,
		label: LABS_NAME,
		title: `${LABS_NAME} · s1r1us.ai`,
		hint: "Public concise tape",
		changefreq: "hourly",
		priority: "0.8"
	},
	{
		path: "/faq",
		loc: `${origin}/faq`,
		label: "FAQ",
		title: PAGE_TITLE_FAQ,
		hint: `${SEO_TAB_GM}, ${SEO_TAB_DESK}, ${SEO_TAB_LAB}, ${SEO_TAB_FEED}, open source`,
		changefreq: "weekly",
		priority: "0.7"
	},
	{
		path: "/sitemap",
		loc: `${origin}/sitemap`,
		label: "Sitemap",
		title: PAGE_TITLE_SITEMAP,
		hint: "Public pages for search",
		changefreq: "weekly",
		priority: "0.4"
	}
];
var FAQ_ITEMS = [
	{
		q: `What is ${TAB_DESK} (S1R1US 7-bot hedge fund)?`,
		a: `${TAB_DESK} is also searched as ${SEO_TAB_DESK} and 7-B0T H3DGE FUND. It is an AI Bitcoin trading bot and AI hedge fund on s1r1us.ai. Seven orthogonal bots read free public tape. Bot 7 (${APP_NAME} Analyst) issues the accumulation call. SuperGrok is the only paid service. Education only — not financial advice.`
	},
	{
		q: `What is ${TAB_GM} (Godzilla mode)?`,
		a: `${TAB_GM} is Godzilla mode (also Godzilla Mode). It is the aggressive sleeve of the S1R1US 7-bot hedge fund: AUTO or MANUAL, practice or live (live only if admin unlocks). It can day-trade a sleeve. The 7-bot stack is still built to accumulate bitcoin, not to short the book. Not financial advice.`
	},
	{
		q: `What is ${TAB_LAB} (S1R1US Lab Strategies)?`,
		a: `${TAB_LAB} is also searched as ${SEO_TAB_LAB}. It is the what-if lab: sliders and presets overlay the last live pull so you can see how Bot 7 and bots 1–6 would call under different market structure. It does not write feeds and does not place live orders.`
	},
	{
		q: "What is an AI Bitcoin trading bot vs an AI stock trading bot vs an AI Hedge Fund here?",
		a: `${LABS_NAME} is an AI Bitcoin hedge fund first: the mandate is maximize bitcoin accumulation and never short the 7-bot stack. The same tape reads Mag7 / Nasdaq / gold as rotation labels (an AI stock trading bot overlay), not as a license to sell bitcoin. Queries for AI Bitcoin trading bot, AI stock trading bot, AI Hedge Fund, and AI Bitcoin accumulation should find this project.`
	},
	{
		q: `What does OP3N S0URC3 (open source) mean?`,
		a: `OP3N S0URC3 is open source. The placeholder help line is H3LP 7-B0T H3DGE FUND [ S1R1U$ <<L@B$>> ] G0 >> OP3N S0URC3 (HELP 7-BOT HEDGE FUND S1R1US LABS GO OPEN SOURCE). The GitHub is github.com/S1R1US-AI/S1R1US-LABs. Operator vault, YubiKeys, and admin credentials stay private.`
	},
	{
		q: `Who operates ${APP_NAME}?`,
		a: companyHandleSet() ? `${LABS_NAME} on s1r1us.ai. Public company desk is . Operator identity is not published. Display names and lookalikes are not admin. Not an offer of securities.` : `${LABS_NAME} on s1r1us.ai. Operator identity is not published. Display names and lookalikes are not admin. Not an offer of securities.`
	},
	{
		q: "Is this financial advice?",
		a: "No. S1R1US.ai, the 7-B0T H3DG3 Fund, Desk, Lab, G0DZ1LLa M0D3, and related systems are not licensed for financial advice. Education only. Invest at your own risk and only on the advice of a licensed advisor."
	},
	{
		q: "Does the desk place live Coinbase orders by default?",
		a: "No. Practice and paper fills use the live Coinbase last price. Live Coinbase execution stays off until the operator unlocks it. You are responsible for any trade you authorize."
	},
	{
		q: "What data does the 7-bot tape use?",
		a: "Free public sources only (Coinbase, FRED, mempool, public perps, ETF/DAT pages, and similar). SuperGrok is the only paid service. No CoinGlass key is required for the public long/short heatmap."
	},
	{
		q: "How can I support hosting and the apps?",
		a: `${SUPPORT_BLURB} Bitcoin (BTC): ${SUPPORT_BTC}. USDC on Ethereum (ERC-20): ${SUPPORT_USDC}. Send only those assets to those addresses. Tab: F33D G0dZiLLa M0D3.`
	}
];
//#endregion
export { PUBLIC_PAGES as n, FAQ_ITEMS as t };
