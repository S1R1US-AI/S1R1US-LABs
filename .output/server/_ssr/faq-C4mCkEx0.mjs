import { v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as TAB_GM, i as LABS_NAME, m as TAB_FEED, n as APP_NAME, o as SEO_CANONICAL, p as TAB_DESK, v as TAB_LAB } from "./brand-Cp1yHL3f.mjs";
import { c as Shell, s as Panel } from "./shell-BSNR85g1.mjs";
import { t as SeoCopy } from "./seo-copy-DSaMgCF_.mjs";
import { t as SupportDonate } from "./support-donate-Dv39d4NK.mjs";
import { t as FAQ_ITEMS } from "./public-nav-B3bA1CQD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/faq-C4mCkEx0.js
var import_jsx_runtime = require_jsx_runtime();
function FaqPage() {
	const data = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: FAQ_ITEMS.map((item) => ({
			"@type": "Question",
			name: item.q,
			acceptedAnswer: {
				"@type": "Answer",
				text: item.a
			}
		})),
		url: `${SEO_CANONICAL.replace(/\/$/, "")}/faq`,
		name: `FAQ · ${TAB_DESK} · ${TAB_GM} · ${TAB_LAB} · OP3N S0URC3`,
		description: `${LABS_NAME} FAQ: S1R1US 7-bot hedge fund, Godzilla mode, S1R1US Lab Strategies, open source, AI Bitcoin trading bot, AI stock trading bot, AI Hedge Fund. Not financial advice.`
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoCopy, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
			type: "application/ld+json",
			dangerouslySetInnerHTML: { __html: JSON.stringify(data).replace(/</g, "\\u003c") }
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-3xl px-4 py-8 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs tracking-[0.12em] text-oss uppercase",
					children: "FAQ"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 text-2xl font-bold tracking-tight text-medium",
					children: APP_NAME
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-sm leading-relaxed text-muted",
					children: [
						TAB_DESK,
						" (S1R1US 7-bot hedge fund) · ",
						TAB_GM,
						" (Godzilla mode) · ",
						TAB_LAB,
						" (S1R1US Lab Strategies) · OP3N S0URC3 (open source). AI Bitcoin trading bot · AI stock trading bot · AI Hedge Fund. Education only."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 space-y-3",
					children: FAQ_ITEMS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						kicker: "FAQ",
						title: item.q,
						kickerClass: "text-oss",
						titleClass: "text-fg text-base",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-relaxed text-muted",
							children: item.a
						})
					}, item.q))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupportDonate, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 font-mono text-xs text-oss",
					children: [
						"Same wallets as the",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/f33d",
							hash: "donate",
							className: "hover:underline",
							children: TAB_FEED
						}),
						" ",
						"tab."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 font-mono text-xs text-oss",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/sitemap",
							className: "hover:underline",
							children: "Sitemap"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2",
							children: "|"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "hover:underline",
							children: TAB_DESK
						})
					]
				})
			]
		})
	] });
}
var SplitComponent = FaqPage;
//#endregion
export { SplitComponent as component };
