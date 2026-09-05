import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as COMPANY_X_URL } from "./x-admin-Dt29NgIk.mjs";
import { E as TAB_FEED, L as TAB_LAB, S as SEO_TAB_LAB, T as TAB_DESK, _ as SEO_DESCRIPTION, b as SEO_TAB_FEED, g as SEO_CANONICAL, h as SEO_ALIASES, i as LABS_NAME, k as TAB_GM, n as APP_NAME, x as SEO_TAB_GM, y as SEO_TAB_DESK } from "./brand-iv-XZ0o2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/seo-copy-BYIzP5_n.js
var import_jsx_runtime = require_jsx_runtime();
function SeoCopy() {
	const data = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "Organization",
				name: LABS_NAME,
				alternateName: [
					APP_NAME,
					"S1R1US Labs",
					"S1R1US Bot Hedge Fund",
					TAB_DESK,
					SEO_TAB_DESK
				],
				url: SEO_CANONICAL,
				description: SEO_DESCRIPTION,
				sameAs: [COMPANY_X_URL, "https://github.com/S1R1US-AI/S1R1US-LABs"].filter(Boolean)
			},
			{
				"@type": "WebSite",
				name: LABS_NAME,
				alternateName: [
					APP_NAME,
					"AI Bitcoin trading bot",
					"AI Hedge Fund",
					TAB_DESK,
					TAB_GM,
					TAB_LAB
				],
				url: SEO_CANONICAL,
				description: SEO_DESCRIPTION,
				potentialAction: {
					"@type": "SearchAction",
					target: `${SEO_CANONICAL}?q={search_term_string}`,
					"query-input": "required name=search_term_string"
				}
			},
			{
				"@type": "SoftwareApplication",
				name: TAB_DESK,
				alternateName: [
					SEO_TAB_DESK,
					APP_NAME,
					LABS_NAME,
					"S1R1US Bot Hedge Fund",
					"AI Bitcoin trading bot",
					"AI stock trading bot",
					"AI Hedge Fund"
				],
				applicationCategory: "FinanceApplication",
				operatingSystem: "Web",
				description: SEO_DESCRIPTION,
				url: SEO_CANONICAL
			},
			{
				"@type": "SoftwareApplication",
				name: TAB_GM,
				alternateName: [
					SEO_TAB_GM,
					"Godzilla Mode",
					"Godzilla mode"
				],
				applicationCategory: "FinanceApplication",
				operatingSystem: "Web",
				description: `${TAB_GM} is Godzilla mode, the aggressive AI bitcoin sleeve of S1R1US Labs.`,
				url: `${SEO_CANONICAL}gm`
			},
			{
				"@type": "WebPage",
				name: TAB_FEED,
				alternateName: [SEO_TAB_FEED, "F33D N0W"],
				description: `${TAB_FEED} is ${SEO_TAB_FEED}. Optional donations for hosting, domain, and open-source apps.`,
				url: `${SEO_CANONICAL}f33d`
			},
			{
				"@type": "SoftwareApplication",
				name: TAB_LAB,
				alternateName: [SEO_TAB_LAB, "S1R1US Lab Strategies"],
				applicationCategory: "FinanceApplication",
				operatingSystem: "Web",
				description: `${TAB_LAB} is S1R1US Lab Strategies, the what-if overlay on the 7-bot tape.`,
				url: `${SEO_CANONICAL}helios`
			},
			{
				"@type": "SoftwareSourceCode",
				name: "OP3N S0URC3",
				alternateName: [
					"open source",
					"H3LP 7-B0T H3DGE FUND [ S1R1U$ <<L@B$>> ] G0 >> OP3N S0URC3",
					"HELP 7-BOT HEDGE FUND GO OPEN SOURCE"
				],
				codeRepository: "https://github.com/S1R1US-AI/S1R1US-LABs",
				description: "OP3N S0URC3 is open source. GitHub repository started 2026-09-04: S1R1US-AI/S1R1US-LABs.",
				url: "https://github.com/S1R1US-AI/S1R1US-LABs"
			},
			{
				"@type": "FAQPage",
				name: `FAQ · ${TAB_DESK} · ${TAB_GM} · ${TAB_FEED} · ${TAB_LAB}`,
				url: `${SEO_CANONICAL}faq`,
				description: "FAQ for S1R1US 7-bot hedge fund, Godzilla mode, S1R1US Lab Strategies, Token launch, open source. Not financial advice. Not an offer of securities."
			},
			{
				"@type": "WebPage",
				name: "Terms and Agreements",
				url: `${SEO_CANONICAL}terms`,
				description: "Using this website constitutes agreement. Not financial advice. Seek a licensed professional. Not an offer of securities."
			},
			{
				"@type": "WebPage",
				name: "Sitemap",
				url: `${SEO_CANONICAL}sitemap`
			}
		]
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "seo-copy",
		children: SEO_ALIASES
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
		type: "application/ld+json",
		dangerouslySetInnerHTML: { __html: JSON.stringify(data).replace(/</g, "\\u003c") }
	})] });
}
//#endregion
export { SeoCopy as t };
