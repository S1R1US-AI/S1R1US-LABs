import { v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { At as TAB_OWL_ALIAS, H as SEO_TAB_AGENT, K as SEO_TAB_COMPUTE, N as PAGE_TITLE_OWL, Nt as seoImgAlt, Q as SEO_TAB_OWL_ALIAS, W as SEO_TAB_CALLING_BOTS, Z as SEO_TAB_OWL, at as TAB_COMPUTE, d as OWL_HEADLINE, f as OWL_PATH, kt as TAB_OWL, n as APP_NAME, nt as TAB_BEARS, o as LABS_NAME, ot as TAB_DESK, rt as TAB_CALLING_BOTS, tt as TAB_AGENT, wt as TAB_HOVER_OWL, x as PAGE_DESC_OWL, z as SEO_CANONICAL } from "./brand-BKM5q_W_.mjs";
import { o as Panel, s as Shell } from "./shell-DL0EAAfV.mjs";
import { t as SeoCopy } from "./seo-copy-DuTtbdcl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/owl-DZ_w10eI.js
var import_jsx_runtime = require_jsx_runtime();
var IMG = "/owl.png";
var ALT = seoImgAlt("AI AG3NTS (AI AGENTS) jeweled owl portrait — W1S3 0WL (Wise Owl) — wise investment decisions theoretically optimized by AI agents: Grok, Claude, GPT and Bot 7 combined for bitcoin accumulation analysis");
function OwlPage() {
	const origin = SEO_CANONICAL.replace(/\/$/, "");
	const data = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "Article",
				headline: OWL_HEADLINE,
				name: PAGE_TITLE_OWL,
				alternateName: [
					TAB_OWL,
					SEO_TAB_OWL,
					TAB_OWL_ALIAS,
					SEO_TAB_OWL_ALIAS,
					OWL_HEADLINE
				],
				description: PAGE_DESC_OWL,
				url: `${origin}${OWL_PATH}`,
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
					"wise investment",
					"AI agent trading",
					"Grok",
					"Claude",
					"GPT",
					SEO_TAB_AGENT
				]
			},
			{
				"@type": "ImageObject",
				contentUrl: `${origin}${IMG}`,
				url: `${origin}${IMG}`,
				name: ALT,
				caption: `${TAB_OWL} (${SEO_TAB_OWL}) — ${OWL_HEADLINE}`,
				description: ALT
			},
			{
				"@type": "FAQPage",
				name: `${TAB_OWL} (${SEO_TAB_OWL}) FAQ`,
				url: `${origin}${OWL_PATH}`,
				mainEntity: [{
					"@type": "Question",
					name: OWL_HEADLINE,
					acceptedAnswer: {
						"@type": "Answer",
						text: "In theory Bot 7 supplies the live tape call. Grok, Claude, and GPT each read that JSON plus their own world-model and return a second opinion. Combined, they can keep a bitcoin accumulation mandate current without this host placing orders. Education only. Not financial advice."
					}
				}, {
					"@type": "Question",
					name: "Do Grok, Claude, or GPT trade on s1r1us.ai?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "No. They may ping /api/agent and read Bot 7. Execution stays on an account the agent controls. Auto trade is LOCKED."
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
						TAB_OWL,
						" · ",
						TAB_CALLING_BOTS
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 text-2xl font-semibold tracking-tight text-fg sm:text-3xl",
					title: TAB_HOVER_OWL,
					children: OWL_HEADLINE
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted",
					children: [
						TAB_OWL,
						" (",
						SEO_TAB_OWL,
						") · ",
						TAB_OWL_ALIAS,
						" (",
						SEO_TAB_OWL_ALIAS,
						") · Grok · Claude · GPT · ",
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
						width: 1024,
						height: 1024,
						className: "mx-auto h-auto w-full max-w-xl"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
						className: "border-t border-rule px-3 py-2 text-xs leading-relaxed text-muted",
						children: "The owl is patience with many eyes. Tape, models, and agents look at the same bitcoin. Wisdom is combining them without rushing a clip."
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
					kicker: "Wisdom",
					title: "A wise decision is slow on purpose",
					className: "mt-4",
					kickerClass: "text-oss",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm leading-relaxed text-muted",
						children: [
							"Chasing the last tick is not analysis. A wise bitcoin decision waits for orthogonal confirmation: RSI vs its tape average, fear vs greed, walls, funding, ETF flow, then a Bot 7 stance of ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "call-accumulate",
								children: "ACCUMULATE"
							}),
							" or BUY — not a headline. In theory an AI agent can apply that filter every poll. Humans forget. Models drift. The tape does not. Combining them is how a mandate stays current without becoming a day-trade."
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					kicker: "Combine",
					title: "Bot 7 + Grok + Claude + GPT",
					className: "mt-3",
					kickerClass: "text-oss",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-muted",
						children: "Each force sees a different slice. Together they are a committee, not a hive-mind average."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-fg",
								children: "Bot 7."
							}), " Live public tape. Conviction + stance + clip + dry-run CLI. No LLM in the call. This is the clock."] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-fg",
									children: "Grok."
								}),
								" ",
								TAB_COMPUTE,
								" (",
								SEO_TAB_COMPUTE,
								") — Ask Grok on your xAI key after X login. Strategy question against the current Bot 7 JSON. Operator SuperGrok is separate."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-fg",
									children: "Claude."
								}),
								" MCP tools at",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs",
									children: "/api/agent/claude"
								}),
								" and",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs",
									children: "POST /api/agent/mcp"
								}),
								". Long-context read of thesis + gates. Still read-only here."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-fg",
									children: "GPT."
								}),
								" Actions via",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs",
									children: "/.well-known/ai-plugin.json"
								}),
								". Same Bot 7 call. Same 300s politeness."
							] })
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					kicker: "Theory",
					title: "How the committee would stay current",
					className: "mt-3",
					kickerClass: "text-oss",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
						className: "list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Poll Bot 7. If stance is HOLD / WAIT / TRIM, all models stand down." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								"If ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "call-medium",
									children: "MEDIUM"
								}),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "call-accumulate",
									children: "ACCUMULATE"
								}),
								" (or HIGH BUY), each agent writes a one-pass note: confirm, fade, or size-down. They do not vote to short."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Size to declared NAV. Dry-run Coinbase for Agents on the account that agent controls." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Re-read on the next 300s tick. Wisdom is the loop, not a single candle." })
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					kicker: "Locked",
					title: "What this host will not do",
					className: "mt-3",
					kickerClass: "text-oss",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-muted",
						children: "Combine-forces analysis is a read. Execution is not on s1r1us.ai. Auto trade is LOCKED. Source and vault stay closed. Optional cup of C0FF33 assists the long programming days and unlocks nothing extra."
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 font-mono text-xs text-oss",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/faq",
							hash: "wise-owl",
							className: "hover:underline",
							title: TAB_HOVER_OWL,
							children: "FAQ"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2",
							children: "|"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/agent",
							className: "hover:underline",
							children: TAB_AGENT
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2",
							children: "|"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/compute",
							className: "hover:underline",
							children: TAB_COMPUTE
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2",
							children: "|"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/b3ars",
							className: "hover:underline",
							children: TAB_BEARS
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
var SplitComponent = OwlPage;
//#endregion
export { SplitComponent as component };
