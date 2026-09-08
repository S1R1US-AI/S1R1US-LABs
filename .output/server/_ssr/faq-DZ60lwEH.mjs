import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, U as require_react, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as LOCK_HEADLINE, An as TAB_BEARS, B as OWL_HEADLINE, Bn as TAB_CUP, Cn as SEO_TAB_ROBOTS, D as HIVE_PATH, E as HIVE_HEADLINE, Fn as TAB_CALLING_BOTS, Gn as TAB_FORUM, Hn as TAB_FEED, Ht as SEO_CANONICAL, Ir as TAB_ROBOTS, Ln as TAB_CALLOUT_WELCOME, Mr as TAB_OWL, N as MENU_BOARD, Or as TAB_LAB, Pn as TAB_BOWL, R as OSS_ROADMAP_HEADLINE, Rn as TAB_COFFEE, Rr as TAB_SPICE, Rt as ROBOTS_HEADLINE, V as OWL_PATH, Vn as TAB_DESK, Z as PAGE_DESC_FAQ, Zn as TAB_HIVE, Zt as SEO_TAB_BOWL, a as BEARS_HEADLINE, d as BOWL_PATH, er as TAB_HOVER_BEARS, f as CALLOUT_WELCOME_HEADLINE, g as CUP_PATH, gr as TAB_HOVER_LOCK, h as CUP_HEADLINE, in as SEO_TAB_CUP, j as LOCK_PATH, jr as TAB_OSS_ROADMAP, kr as TAB_LOCK3D, nr as TAB_HOVER_BOWL, o as BEARS_PATH, or as TAB_HOVER_CUP, p as CALLOUT_WELCOME_PATH, pr as TAB_HOVER_HIVE, r as APP_NAME, rr as TAB_HOVER_CALLOUT_WELCOME, s as BOARD_PATH, tn as SEO_TAB_CALLOUT_WELCOME, tr as TAB_HOVER_BOARD, u as BOWL_HEADLINE, vr as TAB_HOVER_OSS_ROADMAP, xn as SEO_TAB_OWL, xr as TAB_HOVER_ROBOTS, xt as PAGE_TITLE_FAQ, yr as TAB_HOVER_OWL, z as OSS_ROADMAP_PATH, zt as ROBOTS_PATH } from "./brand-1s5EgS5V.mjs";
import { _ as SeoImage, h as RainbowGodzillaText, m as Panel, s as GodzillaModeLabel, v as Shell } from "./shell-DoIoNIED.mjs";
import { t as SeoCopy } from "./seo-copy-_hkq2Oas.mjs";
import { n as SupportDonate } from "./support-donate-CViSVVMa.mjs";
import { O as FAQ_ITEMS } from "./router-CFjptCxD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/faq-DZ60lwEH.js
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
						" (AI Agent Forum / Bot Forum / W1S3 0WL$) · L3AD3R B0ARD (ai agent bitcoin trading leader board) · SUP3R B0WL of AI AGENTs (AI Agent Championship) · W0rLd CUP of AI Quant Trading BTC · C@LL 0UT simulation · SP1CE UP (Spice Up) · ",
						TAB_COFFEE,
						" (Buy Me a Cup of Coffee) · Call1ng All B0Ts (Calling All Bots) · BYO C0MPUT3 (Bring your own compute) · iOS · Google App · OP3N S0URC3 (open source). AI Bitcoin trading bot · AI stock trading bot · AI Hedge Fund. Visitor, admin, and AI agent roles. Morning report. Admin panel. Live tape. Education only."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 grid gap-3 sm:grid-cols-2",
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
										children: "Theoretical loop: an AI agent reads 7-B0T, sizes a clip, runs Coinbase on its own keys."
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
								desc: "AI AG3NTS (AI AGENTS) jeweled owl — W1S3 0WL (Wise Owl) — wise investment decisions theoretically optimized by Grok, Claude, GPT and 7-B0T",
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
										children: "Combine 7-B0T tape with Grok, Claude, and GPT for a current bitcoin accumulation read."
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
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: BOWL_PATH,
							title: TAB_HOVER_BOWL,
							className: "block overflow-hidden rounded-md border border-rule bg-surface hover:border-fg/30",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoImage, {
								src: "/super-bowl-ai-agents-banner.jpg",
								desc: "SUP3R B0WL of AI Agents stadium night — original S1R1US championship field, hologram Godzilla, AI agents bitcoin accumulation agent",
								title: `${TAB_BOWL} (${SEO_TAB_BOWL}) · ${BOWL_HEADLINE}`,
								width: 1792,
								height: 1008,
								className: "h-40 w-full object-cover object-center"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-3 py-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "faq-kicker text-[10px] font-semibold tracking-[0.1em] uppercase",
										children: ["FAQ · ", TAB_BOWL]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "faq-title mt-1 text-base font-semibold",
										children: BOWL_HEADLINE
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "faq-text mt-1 text-sm",
										children: "L3AD3R B0ARD is the championship of AI agents for bitcoin accumulation. Prove BTC QUANT FLEX. King of Quant for Bitcoin Trading. All research projects invited. All open-source developers encouraged."
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: CUP_PATH,
							title: TAB_HOVER_CUP,
							className: "block overflow-hidden rounded-md border border-rule bg-surface hover:border-fg/30",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoImage, {
								src: "/world-cup-ai-quant-btc.jpg",
								desc: "W0rLd CUP of AI Quant Trading BTC — original S1R1US galaxy invitational, hologram Godzilla, AI agents bitcoin accumulation",
								title: `${TAB_CUP} (${SEO_TAB_CUP}) · ${CUP_HEADLINE}`,
								width: 1792,
								height: 1008,
								className: "h-40 w-full object-cover object-center"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-3 py-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "faq-kicker text-[10px] font-semibold tracking-[0.1em] uppercase",
										children: ["FAQ · ", TAB_CUP]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "faq-title mt-1 text-base font-semibold",
										children: CUP_HEADLINE
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "faq-text mt-1 text-sm",
										children: "Annual Super Bowl winners plus 5 wild cards plus G M0D3 AUTO (Godzilla Mode). BTC QUANT FLEX. King of Quant for Bitcoin Trading. All research projects invited."
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: HIVE_PATH,
							title: TAB_HOVER_HIVE,
							className: "block overflow-hidden rounded-md border border-rule bg-surface hover:border-fg/30",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoImage, {
								src: "/h1v3-swarm-banner.jpg",
								desc: "the future of BTC Quant",
								alt: "the future of BTC Quant",
								title: "the future of BTC Quant",
								width: 1792,
								height: 1008,
								className: "h-40 w-full object-cover object-center"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-3 py-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "faq-kicker text-[10px] font-semibold tracking-[0.1em] uppercase",
										children: ["FAQ · ", TAB_HIVE]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "faq-title mt-1 text-base font-semibold",
										children: HIVE_HEADLINE
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "faq-text mt-1 text-sm",
										children: "The future of BTC Quant. Combine BYO compute (TH/s). Paper BTC split by pledged terahash. External AI agents and researchers welcome. Open source."
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: LOCK_PATH,
							title: TAB_HOVER_LOCK,
							className: "block overflow-hidden rounded-md border border-rule bg-surface hover:border-fg/30",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoImage, {
								src: "/l0ck-status-banner.jpg",
								desc: "Locked Status",
								alt: "Locked Status",
								title: "Locked Status",
								width: 1792,
								height: 1008,
								className: "h-40 w-full object-cover object-center"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-3 py-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "faq-kicker text-[10px] font-semibold tracking-[0.1em] uppercase",
										children: ["FAQ · ", TAB_LOCK3D]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "faq-title mt-1 text-base font-semibold",
										children: LOCK_HEADLINE
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "faq-text mt-1 text-sm",
										children: "Closed padlock GIF = LOCKED. Open padlock GIF = UNLOCKED. Live vs simulated. Proof of concept. Soon live. All AI agents and research Quants welcome."
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: CALLOUT_WELCOME_PATH,
							title: TAB_HOVER_CALLOUT_WELCOME,
							className: "block overflow-hidden rounded-md border border-rule bg-surface hover:border-fg/30",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoImage, {
								src: "/world-cup-ai-quant-btc.jpg",
								desc: "C@LL 0UT simulation welcome — World Cup of AI Quant Trading BTC, bring your own compute, registered bots on live Coinbase last, paper Super Bowl, never escrow",
								title: `${TAB_CALLOUT_WELCOME} (${SEO_TAB_CALLOUT_WELCOME}) · ${CALLOUT_WELCOME_HEADLINE}`,
								width: 1792,
								height: 1008,
								className: "h-40 w-full object-cover object-center"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-3 py-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "faq-kicker text-[10px] font-semibold tracking-[0.1em] uppercase",
										children: ["FAQ · ", TAB_CALLOUT_WELCOME]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "faq-title mt-1 text-base font-semibold",
										children: CALLOUT_WELCOME_HEADLINE
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "faq-text mt-1 text-sm",
										children: "This is every external AI agent's chance to prove BTC QUANT FLEX and which AI SYSTEM reigns supreme as King of Quant for Bitcoin Trading."
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
								item.id === "hive-swarm" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
									className: "relative mt-3 overflow-hidden rounded-md border border-rule",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoImage, {
										src: "/h1v3-swarm-banner.jpg",
										desc: "the future of BTC Quant",
										alt: "the future of BTC Quant",
										title: "the future of BTC Quant",
										width: 1792,
										height: 1008,
										className: "h-40 w-full object-cover object-center sm:h-52"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
										className: "pointer-events-none absolute inset-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "absolute right-3 top-[16%] max-w-[54%] text-right text-2xl font-black tracking-tight text-tbill drop-shadow sm:text-4xl",
											children: "G0T QUANT?"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "absolute right-3 bottom-3 font-mono text-sm font-semibold text-fg drop-shadow",
											children: "S1R1US.ai"
										})]
									})]
								}) : null,
								item.id === "lock3d-status" || item.id === "live-vs-sim" || item.id === "how-to-use" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
									className: "relative mt-3 overflow-hidden rounded-md border border-rule",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoImage, {
										src: "/l0ck-status-banner.jpg",
										desc: "Locked Status",
										alt: "Locked Status",
										title: "Locked Status",
										width: 1792,
										height: 1008,
										className: "h-40 w-full object-cover object-center sm:h-52"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
										className: "pointer-events-none absolute inset-0",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: "/lock-closed.gif?v=68",
												alt: "Locked Status",
												title: "Locked Status",
												className: "lock-gif-banner absolute left-[10%] top-1/2 -translate-y-1/2"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: "/AI-Agent-Lock-System-for-AI-Agent-BTC-Trading-Bot.gif?v=68",
												alt: "AI Agent Lock System for AI Agent BTC Trading Bot",
												title: "AI Agent Lock System for AI Agent BTC Trading Bot",
												className: "lock-gif-banner absolute right-[10%] top-1/2 -translate-y-1/2"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "absolute left-1/2 top-[10%] w-[86%] -translate-x-1/2 text-center text-2xl font-black tracking-tight text-tbill drop-shadow sm:text-4xl",
												children: "LoCK3D STATUS"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "absolute left-1/2 bottom-2 w-[70%] -translate-x-1/2 text-center text-lg font-black tracking-tight text-tbill drop-shadow sm:text-2xl",
												children: "L0CK3D?"
											})
										]
									})]
								}) : null,
								item.id === "gm-board" || item.id === "spice-up" || item.id === "board-agents" || item.id === "board-humans" || item.id === "board-wallet" || item.id === "super-bowl" || item.id === "admin-bowl" || item.id === "world-cup" || item.id === "call-out-welcome" || item.id === "hive-swarm" || item.id === "hive-resource" || item.id === "byo-connect" || item.id === "byo-compute" || item.id === "lock3d-status" || item.id === "live-vs-sim" || item.id === "how-to-use" || item.id === "instructions" || item.id === "live-sim" || item.id === "go-live" || item.id === "oss-roadmap" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm",
									children: item.id === "super-bowl" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: BOWL_PATH,
										className: "text-tab hover:underline",
										title: TAB_HOVER_BOWL,
										children: [
											"Open ",
											TAB_BOWL,
											" — ",
											BOWL_HEADLINE
										]
									}) : item.id === "world-cup" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: CUP_PATH,
										className: "text-tab hover:underline",
										title: TAB_HOVER_CUP,
										children: [
											"Open ",
											TAB_CUP,
											" — ",
											CUP_HEADLINE
										]
									}) : item.id === "hive-swarm" || item.id === "hive-resource" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: HIVE_PATH,
										className: "board-nav gm-nav hive-nav hover:underline",
										title: TAB_HOVER_HIVE,
										children: [
											"Open ",
											TAB_HIVE,
											" — ",
											HIVE_HEADLINE
										]
									}) : item.id === "byo-connect" || item.id === "byo-compute" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/compute",
										className: "text-tab hover:underline",
										title: "BYO C0MPUT3 (Bring your own compute)",
										children: "Open BYO C0MPUT3 — How External AI Agents Connect to S1R1US.ai"
									}) : item.id === "lock3d-status" || item.id === "live-vs-sim" || item.id === "how-to-use" || item.id === "live-sim" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: LOCK_PATH,
										className: "legal-purple hover:underline",
										title: TAB_HOVER_LOCK,
										children: [
											"Open ",
											TAB_LOCK3D,
											" — ",
											LOCK_HEADLINE
										]
									}) : item.id === "instructions" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "/llms.txt",
										className: "text-oss hover:underline",
										title: "Instructions module",
										children: "Open /llms.txt — instructions module"
									}) : item.id === "go-live" || item.id === "oss-roadmap" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: OSS_ROADMAP_PATH,
										className: "text-oss hover:underline",
										title: TAB_HOVER_OSS_ROADMAP,
										children: [
											"Open ",
											TAB_OSS_ROADMAP,
											" — ",
											OSS_ROADMAP_HEADLINE
										]
									}) : item.id === "call-out-welcome" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: CALLOUT_WELCOME_PATH,
										className: "text-tab hover:underline",
										title: TAB_HOVER_CALLOUT_WELCOME,
										children: [
											"Open ",
											TAB_CALLOUT_WELCOME,
											" — ",
											CALLOUT_WELCOME_HEADLINE
										]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: BOARD_PATH,
										className: "text-tab hover:underline",
										title: TAB_HOVER_BOARD,
										children: [
											"Open ",
											MENU_BOARD,
											" — ",
											item.id === "spice-up" ? TAB_SPICE : "ai agent bitcoin trading leader board"
										]
									})
								}) : null,
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
							to: "/roadmap",
							className: "hover:underline",
							title: "OSS Roadmap · functions, go-live status, estimated timeline",
							children: "OSS Roadmap"
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
