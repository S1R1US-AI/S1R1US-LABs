import { o as __toESM } from "../_runtime.mjs";
import { H as require_react, v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { h as TAB_LAB, i as LABS_NAME, m as TAB_GM, n as APP_NAME, o as SEO_CANONICAL, p as TAB_DESK } from "./brand-Bnp79fYI.mjs";
import { c as Shell, s as Panel } from "./shell-C-LkQ1jy.mjs";
import { t as SeoCopy } from "./seo-copy-CHYpA28N.mjs";
import { a as SUPPORT_BTC_EXPLORER, i as SUPPORT_BTC, o as SUPPORT_USDC, r as SUPPORT_BLURB, s as SUPPORT_USDC_EXPLORER, t as FAQ_ITEMS } from "./public-nav-DGj6wXJT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/faq-BHbIavRi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
async function copyText(value) {
	try {
		await navigator.clipboard.writeText(value);
		return true;
	} catch {
		return false;
	}
}
function AddrRow({ label, value, href }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3 rounded-md border border-rule p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[11px] tracking-[0.12em] text-muted uppercase",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 break-all font-mono text-sm text-fg",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "inline-flex h-10 min-h-10 items-center rounded-md border border-rule px-3 text-sm hover:bg-fg/6",
					onClick: () => {
						copyText(value).then((ok) => {
							if (!ok) return;
							setCopied(true);
							window.setTimeout(() => setCopied(false), 1600);
						});
					},
					children: copied ? "Copied" : "Copy"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					className: "inline-flex h-10 min-h-10 items-center rounded-md border border-rule px-3 text-sm hover:bg-fg/6",
					href,
					target: "_blank",
					rel: "noreferrer",
					children: "Explorer"
				})]
			})
		]
	});
}
function SupportDonate() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		className: "mt-4",
		kicker: "Support",
		title: "Hosting & app fees",
		kickerClass: "text-oss",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-relaxed text-muted",
				children: SUPPORT_BLURB
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddrRow, {
				label: "Bitcoin (BTC)",
				value: SUPPORT_BTC,
				href: SUPPORT_BTC_EXPLORER
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddrRow, {
				label: "USDC · Ethereum ERC-20",
				value: SUPPORT_USDC,
				href: SUPPORT_USDC_EXPLORER
			})
		]
	});
}
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
