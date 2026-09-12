import { Bt as PAGE_DESC_SPONSOR, Cr as TAB_COFFEE, Dr as TAB_FEED, Ei as TAB_SPONSOR, Er as TAB_DESK, G as GIF_SPONSOR_HEART, J as GIF_SPONSOR_LARGE_NAME, K as GIF_SPONSOR_HEART_NAME, U as GIF_SPONSOR_GOAL, W as GIF_SPONSOR_GOAL_NAME, dr as SPONSOR_HEADLINE, or as SEO_TAB_SPONSOR, q as GIF_SPONSOR_LARGE } from "./brand-CDqF9nyU.mjs";
import { S as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as SUPPORT_GIFT_RECEIPT, t as FUNDING_PLATFORMS } from "./support-w0TmEm7L.mjs";
import { S as Shell, _ as Panel, x as SeoImage } from "./shell-DhzBcQbb.mjs";
import { t as SeoCopy } from "./seo-copy-DPXIBeSr.mjs";
import { n as SupportDonate } from "./support-donate-mA5y63O1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sponsor-ai-bitcoin-trading-bot-DllFv-jm.js
var import_jsx_runtime = require_jsx_runtime();
function SponsorPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoCopy, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-3xl px-4 py-8 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-mono text-xs tracking-[0.12em] text-oss uppercase",
				children: [
					TAB_SPONSOR,
					" · ",
					SEO_TAB_SPONSOR
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-2xl font-bold tracking-tight text-high",
				children: TAB_SPONSOR
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted",
				children: [SEO_TAB_SPONSOR, " · every FUNDING.yml donation type as a direct BTC / USDC gift"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm leading-relaxed text-muted",
				children: [SPONSOR_HEADLINE, "."]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoImage, {
				src: GIF_SPONSOR_LARGE,
				alt: GIF_SPONSOR_LARGE_NAME,
				title: GIF_SPONSOR_LARGE_NAME,
				desc: GIF_SPONSOR_LARGE_NAME,
				width: 480,
				height: 270,
				className: "mt-4 h-auto w-full max-w-[480px] rounded-md border border-rule"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed text-muted",
				children: PAGE_DESC_SPONSOR
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm font-medium text-fg",
				children: SUPPORT_GIFT_RECEIPT
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				id: "funding-map",
				className: "mt-4 scroll-mt-24",
				kicker: "FUNDING.yml",
				title: "Every donation platform type → an s1r1us.ai gift page",
				kickerClass: "text-high",
				titleClass: "text-high",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm leading-relaxed text-muted",
					children: [
						"S1R1US L@Bs holds no third-party funding platform accounts. The GitHub",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "https://github.com/S1R1US-AI/S1R1US-LABs/blob/main/.github/FUNDING.yml",
							target: "_blank",
							rel: "noreferrer",
							className: "text-tab hover:underline",
							children: "FUNDING.yml"
						}),
						" ",
						"maps each supported platform to the closest on-site donation page. All gifts are direct on-chain Bitcoin (BTC) or native Circle USDC — never tokens, never upside."
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[560px] border-collapse text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-rule font-mono text-[11px] tracking-[0.12em] text-muted uppercase",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 pr-3",
									children: "Platform"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 pr-3",
									children: "Donation type"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2",
									children: "s1r1us.ai fit"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: FUNDING_PLATFORMS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-rule/60 align-top",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 pr-3 font-mono text-xs text-fg",
									children: p.platform
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 pr-3 text-muted",
									children: p.type
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: p.path,
										className: "text-tab hover:underline",
										children: p.fit
									})
								})
							]
						}, p.key)) })]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
					className: "rounded-md border border-rule p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoImage, {
						src: GIF_SPONSOR_HEART,
						alt: GIF_SPONSOR_HEART_NAME,
						title: GIF_SPONSOR_HEART_NAME,
						desc: GIF_SPONSOR_HEART_NAME,
						width: 200,
						height: 200,
						loading: "lazy",
						className: "mx-auto h-auto w-full max-w-[200px]"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
						className: "mt-2 text-center text-xs text-muted",
						children: "GitHub Sponsors / Patreon / Polar donation type — a sponsor heart, settled as a BTC gift."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
					className: "rounded-md border border-rule p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoImage, {
						src: GIF_SPONSOR_GOAL,
						alt: GIF_SPONSOR_GOAL_NAME,
						title: GIF_SPONSOR_GOAL_NAME,
						desc: GIF_SPONSOR_GOAL_NAME,
						width: 200,
						height: 200,
						loading: "lazy",
						className: "mx-auto h-auto w-full max-w-[200px]"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
						className: "mt-2 text-center text-xs text-muted",
						children: "Community Bridge / LFX / IssueHunt crowdfund + bounty donation type — one transparent goal."
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupportDonate, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 font-mono text-xs text-oss",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/f33d",
						className: "hover:underline",
						children: TAB_FEED
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
						to: "/faq",
						hash: "sponsor-the-bots",
						className: "hover:underline",
						children: "FAQ"
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
	})] });
}
var SplitComponent = SponsorPage;
//#endregion
export { SplitComponent as component };
