import { o as __toESM } from "../_runtime.mjs";
import { H as require_react, v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { Dt as TAB_LAB, Nt as seoImgAlt, Z as SEO_TAB_OWL, _ as PAGE_DESC_FAQ, d as OWL_HEADLINE, f as OWL_PATH, i as BEARS_PATH, it as TAB_COFFEE, k as PAGE_TITLE_FAQ, kt as TAB_OWL, n as APP_NAME, nt as TAB_BEARS, ot as TAB_DESK, pt as TAB_HOVER_BEARS, r as BEARS_HEADLINE, st as TAB_FEED, ut as TAB_GM, wt as TAB_HOVER_OWL, z as SEO_CANONICAL } from "./brand-BKM5q_W_.mjs";
import { o as Panel, s as Shell } from "./shell-DL0EAAfV.mjs";
import { t as SeoCopy } from "./seo-copy-DuTtbdcl.mjs";
import { n as SupportDonate } from "./support-donate-kmvox4-l.mjs";
import { i as FAQ_ITEMS } from "./router-Clczj6X9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/faq-BLU4wL8N.js
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
						TAB_GM,
						" (Godzilla mode) · ",
						TAB_BEARS,
						" (Beat the Bears) · ",
						TAB_OWL,
						" (Wise Owl) · ",
						TAB_FEED,
						" (Feed Hosting) · ",
						TAB_LAB,
						" (S1R1US Lab Strategies) · ",
						TAB_COFFEE,
						" (Buy Me a Cup of Coffee) · Call1ng All B0Ts (Calling All Bots) · BYO C0MPUT3 (Bring your own compute) · OP3N S0URC3 (open source). AI Bitcoin trading bot · AI stock trading bot · AI Hedge Fund. Education only."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 grid gap-3 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: BEARS_PATH,
						title: TAB_HOVER_BEARS,
						className: "block overflow-hidden rounded-md border border-rule bg-surface hover:border-fg/30",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/gzilla-mrkt.png",
							alt: seoImgAlt("G0DZ1LLa M0D3 yellow outline breathing a blue laser through a bitcoin candle chart, bursting a cartoon bear — B3AT TH3 B3AR$ (Beat the Bears) at market speed with AI agents"),
							title: seoImgAlt(`${TAB_BEARS} (${BEARS_HEADLINE})`),
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
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: OWL_PATH,
						title: TAB_HOVER_OWL,
						className: "block overflow-hidden rounded-md border border-rule bg-surface hover:border-fg/30",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/owl.png",
							alt: seoImgAlt("AI AG3NTS (AI AGENTS) jeweled owl — W1S3 0WL (Wise Owl) — wise investment decisions theoretically optimized by Grok, Claude, GPT and Bot 7"),
							title: seoImgAlt(`${TAB_OWL} (${SEO_TAB_OWL}) · ${OWL_HEADLINE}`),
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
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 space-y-3",
					children: FAQ_ITEMS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						id: item.id,
						className: item.id ? "scroll-mt-24" : void 0,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
							kicker: "FAQ",
							title: item.q,
							kickerClass: "faq-kicker",
							titleClass: "faq-title text-base",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "faq-text text-sm leading-relaxed",
									children: item.a
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
