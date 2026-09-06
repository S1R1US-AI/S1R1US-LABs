import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, U as require_react, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Ct as TAB_COFFEE, Et as TAB_FEED, Kt as TAB_HOVER_OWL, L as PAGE_TITLE_FAQ, Pt as TAB_HOVER_BEARS, Qt as TAB_OWL, St as TAB_CALLING_BOTS, Tt as TAB_DESK, X as ROBOTS_HEADLINE, Xt as TAB_LAB, Z as ROBOTS_PATH, en as TAB_ROBOTS, et as SEO_CANONICAL, g as OWL_PATH, gt as SEO_TAB_ROBOTS, h as OWL_HEADLINE, i as BEARS_PATH, kt as TAB_FORUM, mt as SEO_TAB_OWL, n as APP_NAME, qt as TAB_HOVER_ROBOTS, r as BEARS_HEADLINE, x as PAGE_DESC_FAQ, xt as TAB_BEARS } from "./brand-ByvcTltq.mjs";
import { a as GodzillaModeLabel, c as Panel, d as Shell, l as RainbowGodzillaText, u as SeoImage } from "./shell-CiBE4AkH.mjs";
import { t as SeoCopy } from "./seo-copy-DyZ5NBmz.mjs";
import { n as SupportDonate } from "./support-donate-CL0OaaKE.mjs";
import { a as FAQ_ITEMS } from "./router-BPIVbtNv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/faq-Cvtv8qA8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FaqPage() {
	const data = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		"@id": `${SEO_CANONICAL.replace(/\/$/, "")}/faq#faq`,
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
					className: "faq-kicker font-mono text-xs tracking-[0.12em] uppercase",
					children: "FAQ"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "faq-title mt-2 text-2xl font-bold tracking-tight",
					children: APP_NAME
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "faq-text mt-3 text-sm leading-relaxed",
					children: [
						TAB_DESK,
						" (S1R1US 7-bot hedge fund) · ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GodzillaModeLabel, {}),
						" (Godzilla mode) · ",
						TAB_BEARS,
						" (Beat the Bears) · ",
						TAB_OWL,
						" (Wise Owl) · ",
						TAB_ROBOTS,
						" (Robots Activate) · ",
						TAB_FEED,
						" (Feed Hosting) · ",
						TAB_LAB,
						" (S1R1US Lab Strategies) · ",
						TAB_FORUM,
						" (AI Agent Forum / Bot Forum / W1S3 0WL$) · ",
						TAB_COFFEE,
						" (Buy Me a Cup of Coffee) · Call1ng All B0Ts (Calling All Bots) · BYO C0MPUT3 (Bring your own compute) · OP3N S0URC3 (open source). AI Bitcoin trading bot · AI stock trading bot · AI Hedge Fund. Visitor, admin, and AI agent roles. Morning report. Admin panel. Live tape. Education only."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: BEARS_PATH,
							title: TAB_HOVER_BEARS,
							className: "block overflow-hidden rounded-md border border-rule bg-surface hover:border-fg/30",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoImage, {
								src: "/gzilla-mrkt.png",
								desc: "G0DZ1LLa M0D3 yellow outline breathing a blue laser through a bitcoin candle chart, bursting a cartoon bear — B3AT TH3 B3AR$ (Beat the Bears) at market speed with AI agents",
								title: `${TAB_BEARS} (${BEARS_HEADLINE})`,
								width: 1280,
								height: 720,
								className: "h-40 w-full object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-3 py-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "faq-kicker text-[10px] font-semibold tracking-[0.1em] uppercase",
										children: ["FAQ · ", TAB_BEARS]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "faq-title mt-1 text-base font-semibold",
										children: BEARS_HEADLINE
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "faq-text mt-1 text-sm",
										children: "Theoretical loop: an AI agent reads Bot 7, sizes a clip, runs Coinbase on its own keys."
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: OWL_PATH,
							title: TAB_HOVER_OWL,
							className: "block overflow-hidden rounded-md border border-rule bg-surface hover:border-fg/30",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoImage, {
								src: "/owl.png",
								desc: "AI AG3NTS (AI AGENTS) jeweled owl — W1S3 0WL (Wise Owl) — wise investment decisions theoretically optimized by Grok, Claude, GPT and Bot 7",
								title: `${TAB_OWL} (${SEO_TAB_OWL}) · ${OWL_HEADLINE}`,
								width: 1024,
								height: 1024,
								className: "h-40 w-full object-cover object-top"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-3 py-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "faq-kicker text-[10px] font-semibold tracking-[0.1em] uppercase",
										children: ["FAQ · ", TAB_OWL]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "faq-title mt-1 text-base font-semibold",
										children: OWL_HEADLINE
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "faq-text mt-1 text-sm",
										children: "Combine Bot 7 tape with Grok, Claude, and GPT for a current bitcoin accumulation read."
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: ROBOTS_PATH,
							title: TAB_HOVER_ROBOTS,
							className: "block overflow-hidden rounded-md border border-rule bg-surface hover:border-fg/30",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoImage, {
								src: "/s1r1us-godzilla-logo.jpg",
								desc: "R0B0T$ ACT1VAT3 techno Godzilla logo — AI agents and software developers improving open source for bitcoin accumulation",
								title: `${TAB_ROBOTS} (${SEO_TAB_ROBOTS}) · ${ROBOTS_HEADLINE}`,
								width: 512,
								height: 512,
								className: "h-40 w-full object-cover object-center"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-3 py-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "faq-kicker text-[10px] font-semibold tracking-[0.1em] uppercase",
										children: ["FAQ · ", TAB_ROBOTS]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "faq-title mt-1 text-base font-semibold",
										children: ROBOTS_HEADLINE
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "faq-text mt-1 text-sm",
										children: "Invite software developers and W1S3 0WL$ to improve public GitHub for 7-B0T and GM."
									})
								]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 space-y-3",
					children: FAQ_ITEMS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						id: item.id,
						className: item.id ? "scroll-mt-24" : void 0,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
							kicker: "FAQ",
							title: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RainbowGodzillaText, { text: item.q }),
							kickerClass: "faq-kicker",
							titleClass: "faq-title text-base",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "faq-text text-sm leading-relaxed",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RainbowGodzillaText, { text: item.a })
								}),
								item.id === "beat-the-bears" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: BEARS_PATH,
										className: "text-tab hover:underline",
										title: TAB_HOVER_BEARS,
										children: [
											"Open ",
											TAB_BEARS,
											" — ",
											BEARS_HEADLINE
										]
									})
								}) : null,
								item.id === "wise-owl" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: OWL_PATH,
										className: "text-tab hover:underline",
										title: TAB_HOVER_OWL,
										children: [
											"Open ",
											TAB_OWL,
											" — ",
											OWL_HEADLINE
										]
									})
								}) : null,
								item.id === "robots-activate" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: ROBOTS_PATH,
										className: "text-tab hover:underline",
										title: TAB_HOVER_ROBOTS,
										children: [
											"Open ",
											TAB_ROBOTS,
											" — ",
											ROBOTS_HEADLINE
										]
									})
								}) : null
							]
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
							className: "legal-purple hover:underline",
							children: "Terms and Agreements"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2",
							children: "|"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/privacy",
							className: "legal-purple hover:underline",
							children: "Privacy Policy"
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
							to: BEARS_PATH,
							className: "hover:underline",
							title: TAB_HOVER_BEARS,
							children: TAB_BEARS
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2",
							children: "|"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: OWL_PATH,
							className: "hover:underline",
							title: TAB_HOVER_OWL,
							children: TAB_OWL
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2",
							children: "|"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: ROBOTS_PATH,
							className: "hover:underline",
							title: TAB_HOVER_ROBOTS,
							children: TAB_ROBOTS
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2",
							children: "|"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/c0ff33",
							className: "hover:underline",
							children: TAB_COFFEE
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2",
							children: "|"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "hover:underline",
							children: TAB_DESK
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2",
							children: "|"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/faq",
							hash: "who-uses-this",
							className: "hover:underline",
							children: "visitor · admin · AI agent"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2",
							children: "|"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/faq",
							hash: "admin-panel",
							className: "hover:underline",
							children: "Admin panel"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2",
							children: "|"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/faq",
							hash: "morning-report",
							className: "hover:underline",
							children: "morning report"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2",
							children: "|"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/faq",
							hash: "live-tape",
							className: "hover:underline",
							children: "live tape"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2",
							children: "|"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/agent",
							className: "hover:underline",
							children: TAB_CALLING_BOTS
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2",
							children: "|"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "hover:underline",
							children: "login"
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
