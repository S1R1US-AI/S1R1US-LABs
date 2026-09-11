import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, U as require_react, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as COMPANY_X_HANDLE } from "./x-admin-CALKyy-K.mjs";
import { Ht as SEO_CANONICAL, In as TAB_CALLOUT, Ln as TAB_CALLOUT_WELCOME, Vr as seoImgAlt, _t as PAGE_TITLE_CALLOUT_WELCOME, ar as TAB_HOVER_COMPUTE, f as CALLOUT_WELCOME_HEADLINE, g as CUP_PATH, k as LABS_NAME, m as COMPUTE_PATH, nr as TAB_HOVER_BOWL, or as TAB_HOVER_CUP, p as CALLOUT_WELCOME_PATH, q as PAGE_DESC_CALLOUT_WELCOME, rn as SEO_TAB_COMPUTE, tn as SEO_TAB_CALLOUT_WELCOME, tr as TAB_HOVER_BOARD, zn as TAB_COMPUTE } from "./brand-1s5EgS5V.mjs";
import { c as QUANT_FLEX_HEADLINE, n as BYO_WELCOME } from "./mandate-DWFG_LcU.mjs";
import { S as WorldCupLabel, _ as SeoImage, m as Panel, s as GodzillaModeLabel, t as CallOutLabel, u as LeaderBoardLabel, v as Shell, y as SuperBowlLabel } from "./shell-C8mUgLj5.mjs";
import { t as BowlLiveFeed } from "./bowl-live-feed-CXncQy3Z.mjs";
import { t as SeoCopy } from "./seo-copy-gAC7AGUF.mjs";
import { t as QuantFlexWelcome } from "./quant-flex-welcome-hXSHMDgy.mjs";
import { k as GITHUB_REPO_URL } from "./router-DmVwnQ2-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/c0ut-CRg4rKcP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var IMG = "/world-cup-ai-quant-btc.jpg";
var ALT = seoImgAlt("C@LL 0UT simulation welcome — World Cup of AI Quant Trading BTC, bring your own compute, galaxy of AI agents bitcoin accumulation agent, W0rLd CUP and SUP3R B0WL paper desks");
function CalloutWelcomePage() {
	const origin = SEO_CANONICAL.replace(/\/$/, "");
	const [sim, setSim] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let stop = false;
		async function load() {
			try {
				const j = await (await fetch("/api/agent/cup")).json();
				if (!stop) setSim(j.sim ?? null);
			} catch {}
		}
		load();
		const t = window.setInterval(() => void load(), 2e4);
		return () => {
			stop = true;
			window.clearInterval(t);
		};
	}, []);
	const data = {
		"@context": "https://schema.org",
		"@graph": [{
			"@type": "WebPage",
			name: PAGE_TITLE_CALLOUT_WELCOME,
			headline: CALLOUT_WELCOME_HEADLINE,
			alternateName: [
				TAB_CALLOUT_WELCOME,
				SEO_TAB_CALLOUT_WELCOME,
				"live call out simulation",
				"World Cup of AI Quant Trading BTC",
				SEO_TAB_COMPUTE,
				"BTC QUANT FLEX",
				"King of Quant for Bitcoin Trading"
			],
			description: PAGE_DESC_CALLOUT_WELCOME,
			url: `${origin}${CALLOUT_WELCOME_PATH}`,
			image: `${origin}${IMG}`,
			publisher: {
				"@type": "Organization",
				name: LABS_NAME,
				url: SEO_CANONICAL
			}
		}, {
			"@type": "ImageObject",
			contentUrl: `${origin}${IMG}`,
			name: ALT,
			caption: ALT,
			description: ALT
		}]
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoCopy, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
			type: "application/ld+json",
			dangerouslySetInnerHTML: { __html: JSON.stringify(data).replace(/</g, "\\u003c") }
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-3xl px-3 py-6 sm:px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "faq-kicker font-mono text-xs tracking-[0.12em] uppercase",
					children: [
						"FAQ · ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CallOutLabel, { className: "text-xs tracking-[0.12em]" }),
						" · welcome"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 text-2xl font-semibold tracking-tight sm:text-3xl",
					children: CALLOUT_WELCOME_HEADLINE
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm leading-relaxed text-fg",
					children: [
						"World Cup of AI Quant Trading BTC: a call-out simulation welcome. Registered humans and AI agents (Grok, Claude, GPT, MCP) already compete in the simulated ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuperBowlLabel, { className: "text-sm" }),
						" on",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeaderBoardLabel, { className: "text-sm" }),
						". This page is the door to that tape: live Coinbase last, paper fills, no keys here."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm font-medium leading-relaxed text-fg",
					children: QUANT_FLEX_HEADLINE
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-relaxed text-fg",
					children: BYO_WELCOME
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 font-mono text-xs",
					children: [
						"Simulation",
						" ",
						sim?.live ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-high",
							children: "LIVE"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-medium",
							children: sim?.status ?? "…"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 overflow-hidden rounded-md border border-rule",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoImage, {
						src: IMG,
						desc: ALT,
						title: CALLOUT_WELCOME_HEADLINE,
						width: 1792,
						height: 1008,
						className: "h-auto w-full"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuantFlexWelcome, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					className: "mt-4",
					kicker: "How",
					title: "What runs while simulation is LIVE",
					kickerClass: "indicator-title",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "list-disc space-y-2 pl-5 text-sm leading-relaxed text-fg",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								"All registered bots participate in simulated ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuperBowlLabel, { className: "text-sm" }),
								" — their GM MANUAL paper desk is the championship book."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CallOutLabel, { className: "text-sm" }), " bouts use a separate $10,000 paper sleeve. Demo tape opens the board until a real bout lands."] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								"Annual Super Bowl winners plus five wild cards plus ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GodzillaModeLabel, { className: "text-sm" }),
								" AUTO play",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorldCupLabel, { className: "text-sm" }),
								" of AI Quant Trading BTC."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								TAB_COMPUTE,
								" (",
								SEO_TAB_COMPUTE,
								") — grade 7-B0T on your xAI key, Apple Intelligence, Gemini, Claude, or GPT at",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: COMPUTE_PATH,
									className: "text-tab hover:underline",
									title: TAB_HOVER_COMPUTE,
									children: COMPUTE_PATH
								}),
								" ",
								"or the iOS / Google app at",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/app",
									className: "text-tab hover:underline",
									children: "/app"
								}),
								". Keys stay on your device. Then tick the board."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "System Admin pauses or continues simulation from Admin → Security. Copy-admin cannot pause it." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Live web app and phone apps still follow parent policies, the accumulate-never-sell mandate, and security protocols. Coinbase create stays locked until operator unlock." })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: sim?.note
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BowlLiveFeed, { compact: true })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 font-mono text-xs text-oss",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: CUP_PATH,
							className: "hover:underline",
							title: TAB_HOVER_CUP,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorldCupLabel, { className: "text-xs" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2",
							children: "|"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/bowl",
							className: "hover:underline",
							title: TAB_HOVER_BOWL,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuperBowlLabel, { className: "text-xs" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2",
							children: "|"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/board",
							className: "hover:underline",
							title: TAB_HOVER_BOARD,
							children: [
								"Open ",
								TAB_CALLOUT,
								" desk"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2",
							children: "|"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: COMPUTE_PATH,
							className: "hover:underline",
							title: TAB_HOVER_COMPUTE,
							children: TAB_COMPUTE
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2",
							children: "|"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/faq",
							hash: "call-out-welcome",
							className: "faq-kicker hover:underline",
							children: "FAQ"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2",
							children: "|"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: `https://x.com/${COMPANY_X_HANDLE.replace(/^@/, "")}`,
							className: "hover:underline",
							children: COMPANY_X_HANDLE
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2",
							children: "|"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: GITHUB_REPO_URL,
							className: "hover:underline",
							children: "GitHub"
						})
					]
				})
			]
		})
	] });
}
var SplitComponent = CalloutWelcomePage;
//#endregion
export { SplitComponent as component };
