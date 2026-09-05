import { o as __toESM } from "../_runtime.mjs";
import { H as require_react, v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { M as TAB_GM, O as TAB_DESK, W as TAB_LAB, f as PAGE_TITLE_FAQ, k as TAB_FEED, n as APP_NAME, o as PAGE_DESC_FAQ, v as SEO_CANONICAL } from "./brand-CPj0wirD.mjs";
import { c as Shell, s as Panel } from "./shell-BZS3yxGq.mjs";
import { t as SeoCopy } from "./seo-copy-DFAs0kfj.mjs";
import { t as SupportDonate } from "./support-donate-D9u0rHrF.mjs";
import { t as FAQ_ITEMS } from "./public-nav-D2E9R1-h.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/faq-FoRTen2K.js
var import_react = /* @__PURE__ */ __toESM(require_react());
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
		name: PAGE_TITLE_FAQ,
		description: PAGE_DESC_FAQ
	};
	(0, import_react.useEffect)(() => {
		const id = window.location.hash.replace(/^#/, "");
		if (!id) return;
		document.getElementById(id)?.scrollIntoView({
			behavior: "smooth",
			block: "start"
		});
	}, []);
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
						TAB_FEED,
						" (Feed Hosting) · ",
						TAB_LAB,
						" (S1R1US Lab Strategies) · OP3N S0URC3 (open source). AI Bitcoin trading bot · AI stock trading bot · AI Hedge Fund. Education only."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 space-y-3",
					children: FAQ_ITEMS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						id: item.id,
						className: item.id ? "scroll-mt-24" : void 0,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
							kicker: "FAQ",
							title: item.q,
							kickerClass: "text-oss",
							titleClass: "text-fg text-base",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm leading-relaxed text-muted",
								children: item.a
							})
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
							to: "/terms",
							className: "hover:underline",
							children: "Terms and Agreements"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2",
							children: "|"
						}),
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
