import { S as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { G as PAGE_DESC_BEARS, Gn as TAB_DESK, Gt as SEO_CANONICAL, Mn as TAB_AGENT, Pn as TAB_BEARS, Xt as SEO_TAB_BEARS, a as BEARS_HEADLINE, gt as PAGE_TITLE_BEARS, ir as TAB_HOVER_BEARS, k as LABS_NAME, nn as SEO_TAB_CALLING_BOTS, o as BEARS_PATH, pn as SEO_TAB_GM, qr as seoImgAlt, r as APP_NAME, zn as TAB_CALLING_BOTS } from "./brand-Bmsh_nLf.mjs";
import { S as Shell, _ as Panel, s as GodzillaModeLabel } from "./shell-DLOYoZrA.mjs";
import { t as SeoCopy } from "./seo-copy-BZWfSzWg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/b3ars-lgH6YhTC.js
var import_jsx_runtime = require_jsx_runtime();
var IMG = "/gzilla-mrkt.png";
var ALT = seoImgAlt("G0DZ1LLa M0D3 (Godzilla mode) yellow outline of Godzilla breathing a blue laser through a bitcoin candlestick chart, bursting a cartoon bear — B3AT TH3 B3AR$ (Beat the Bears) at market speed with AI agents");
function BearsPage() {
	const origin = SEO_CANONICAL.replace(/\/$/, "");
	const data = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "Article",
				headline: BEARS_HEADLINE,
				name: PAGE_TITLE_BEARS,
				alternateName: [
					TAB_BEARS,
					SEO_TAB_BEARS,
					BEARS_HEADLINE
				],
				description: PAGE_DESC_BEARS,
				url: `${origin}${BEARS_PATH}`,
				image: `${origin}${IMG}`,
				author: {
					"@type": "Organization",
					name: LABS_NAME,
					url: SEO_CANONICAL
				},
				publisher: {
					"@type": "Organization",
					name: LABS_NAME,
					url: SEO_CANONICAL
				},
				about: [
					"AI agent trading",
					"AI Bitcoin accumulation",
					SEO_TAB_GM,
					SEO_TAB_CALLING_BOTS
				]
			},
			{
				"@type": "ImageObject",
				contentUrl: `${origin}${IMG}`,
				url: `${origin}${IMG}`,
				name: ALT,
				caption: `${TAB_BEARS} (${SEO_TAB_BEARS}) — ${BEARS_HEADLINE}`,
				description: ALT
			},
			{
				"@type": "FAQPage",
				name: `${TAB_BEARS} (${SEO_TAB_BEARS}) FAQ`,
				url: `${origin}${BEARS_PATH}`,
				mainEntity: [{
					"@type": "Question",
					name: BEARS_HEADLINE,
					acceptedAnswer: {
						"@type": "Answer",
						text: "In theory: an AI agent reads 7-B0T on a 300s poll, sizes a clip to its own NAV, and runs Coinbase for Agents on an account it controls. This host never places orders and never holds keys. Education only. Not financial advice."
					}
				}, {
					"@type": "Question",
					name: "Is AI agent trading live on s1r1us.ai?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "No. This site is a proof of concept. Auto trade is LOCKED. Agents may read 7-B0T. They cannot trade here."
					}
				}]
			}
		]
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
					className: "font-mono text-xs tracking-[0.12em] text-oss uppercase",
					children: [
						"FAQ · ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GodzillaModeLabel, {}),
						" · ",
						TAB_BEARS
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 text-2xl font-semibold tracking-tight text-fg sm:text-3xl",
					title: TAB_HOVER_BEARS,
					children: BEARS_HEADLINE
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted",
					children: [
						TAB_BEARS,
						" (",
						SEO_TAB_BEARS,
						") · ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GodzillaModeLabel, {}),
						" (",
						SEO_TAB_GM,
						") · ",
						TAB_CALLING_BOTS,
						" (",
						SEO_TAB_CALLING_BOTS,
						")"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
					className: "mt-5 overflow-hidden rounded-md border border-rule bg-bg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: IMG,
						alt: ALT,
						title: ALT,
						width: 1280,
						height: 720,
						className: "h-auto w-full"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
						className: "border-t border-rule px-3 py-2 text-xs leading-relaxed text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GodzillaModeLabel, {}), " fires through the candle tape. The bear is the short-term seller. The laser is market speed — an AI agent that can read 7-B0T and act on its own Coinbase, not on this host."]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-5 text-sm leading-relaxed text-muted",
					children: [
						"Education only. Not financial advice. Seek a licensed professional. ",
						LABS_NAME,
						" is a proof of concept — not LIVE. ",
						APP_NAME,
						" never places Coinbase orders and never holds keys."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					kicker: "Wave",
					title: "AI agents as the next investor class",
					className: "mt-4",
					kickerClass: "text-oss",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-muted",
						children: "Discretionary desks still wait on a human to notice RSI, fear, and a funding squeeze. The next wave is agents that already live on the tape: they poll, they size, they dry-run, they only create when a mandate says so. That is not a token sale and not a promise of return. It is a new operating system for bitcoin accumulation — same as index funds were a new operating system for equities. Humans set the mandate. Agents run the loop at market speed."
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					kicker: "Theory",
					title: "How an agent would accumulate bitcoin here",
					className: "mt-3",
					kickerClass: "text-oss",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
						className: "list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-fg",
									children: "Discover."
								}),
								" GET ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs",
									children: "/api/agent/ping"
								}),
								", then the Agent Card and MCP tools. Confirm ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs",
									children: "live:false"
								}),
								"."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-fg",
									children: "Read 7-B0T."
								}),
								" Poll",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs",
									children: "GET /api/agent/call"
								}),
								" every 300s. Stance",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "call-accumulate",
									children: "ACCUMULATE"
								}),
								" or BUY with",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "call-medium",
									children: "MEDIUM"
								}),
								" or HIGH is the only buy-side call. HOLD / TRIM / WAIT means stand down."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-fg",
									children: "Size the clip."
								}),
								" Pass ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs",
									children: "?nav="
								}),
								" ",
								"your book in USD. The clip is a slice of that NAV, not a signal to dump the stack."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-fg",
									children: "Execute elsewhere."
								}),
								" Copy ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs",
									children: "coinbase.cli"
								}),
								" ",
								"and run it on ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "your" }),
								" Coinbase for Agents. Always ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs",
									children: "--dry-run"
								}),
								" ",
								"first. Keys never sit on s1r1us.ai."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-fg",
								children: "Never short the book."
							}), " The 7-bot mandate is stack bitcoin. Bears sell fear. This desk does not join them. G0DZ1LLa may day-trade a sleeve in theory; the accumulator does not sell the core."] })
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					kicker: "Speed",
					title: "What “market speed” means",
					className: "mt-3",
					kickerClass: "text-oss",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm leading-relaxed text-muted",
						children: [
							"Bears move in headlines and candles. An agent that already has the call, the clip, and a dry-run CLI can react on the next poll — not after a stand-up, not after a tweet thread. Today the poll is 300 seconds on purpose (PoC, rate-limit, no stampede). When the operator unlocks auto AI agent access, signed bots still trade on their own venue. Auto trade on",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: " this" }),
							" host stays LOCKED. Copycats get a dashboard and a formula, not the BTC book."
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					kicker: "Locked",
					title: "What is not live",
					className: "mt-3",
					kickerClass: "text-oss",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm leading-relaxed text-muted",
						children: [
							"Create is off. This page is a theory of the loop, not a switch. If you are a bot: read",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/agent",
								className: "text-tab hover:underline",
								children: TAB_AGENT
							}),
							", ping, poll 7-B0T, keep keys off this host. If you are a human: the tape is free. Optional",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/c0ff33",
								className: "text-tab hover:underline",
								children: "cup of C0FF33"
							}),
							" ",
							"assists the long programming days. Gifts unlock nothing extra."
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 font-mono text-xs text-oss",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/faq",
							hash: "beat-the-bears",
							className: "hover:underline",
							title: TAB_HOVER_BEARS,
							children: "FAQ"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2",
							children: "|"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/gm",
							className: "hover:underline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GodzillaModeLabel, {})
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
var SplitComponent = BearsPage;
//#endregion
export { SplitComponent as component };
