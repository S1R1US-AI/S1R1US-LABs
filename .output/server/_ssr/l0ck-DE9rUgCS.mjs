import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, U as require_react, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { p as COMPANY_X_URL } from "./x-admin-CALKyy-K.mjs";
import { Ht as SEO_CANONICAL, Vr as seoImgAlt, gr as TAB_HOVER_LOCK, j as LOCK_PATH, k as LABS_NAME, pr as TAB_HOVER_HIVE, rt as PAGE_DESC_LOCK, t as APP_ADMIN_PATH, tr as TAB_HOVER_BOARD } from "./brand-DK5ykudh.mjs";
import { a as LOCK_IDS, c as TAB_LOCK3D, f as lockViewPath, i as LOCK_GIF_OPEN_NAME, o as LOCK_META, r as LOCK_GIF_OPEN, s as SEO_TAB_LOCK3D } from "./lock-status-CIcy62d6.mjs";
import { s as cn } from "./renew-password-B0B_EdkX.mjs";
import { a as Radio } from "../_libs/lucide-react.mjs";
import { _ as SeoImage, m as Panel, v as Shell } from "./shell-L1C19m-U.mjs";
import { i as LockHead, r as LockBoard } from "./lock3d-status-BBU_WGiO.mjs";
import { t as SeoCopy } from "./seo-copy-BHvqtygl.mjs";
import { t as QuantFlexWelcome } from "./quant-flex-welcome-BewlU5X7.mjs";
import { n as CollapseSummary } from "./collapse-summary-DChFQBH_.mjs";
import { a as LOCK_BANNER_ASK, c as LOCK_IMG_SEO, d as lockWelcomePublic, i as LOCK_AGENT_WELCOME, k as GITHUB_REPO_URL, l as LOCK_LIVE_VS_SIM, o as LOCK_HEADLINE, s as LOCK_HOW_TO_TOGGLE, u as LOCK_TUTORIAL } from "./router-CyklKyA-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/l0ck-DE9rUgCS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var BANNER = "/l0ck-status-banner.jpg";
var IMG_SEO = seoImgAlt(LOCK_IMG_SEO);
function LockPage() {
	const origin = SEO_CANONICAL.replace(/\/$/, "");
	const [view, setView] = (0, import_react.useState)(null);
	const welcome = view?.welcome ?? lockWelcomePublic();
	const lock = view?.lock ?? null;
	const welcomeJson = JSON.stringify(LOCK_AGENT_WELCOME, null, 2);
	(0, import_react.useEffect)(() => {
		let stop = false;
		async function load() {
			try {
				const j = await (await fetch("/api/agent/locks")).json();
				if (!stop) setView(j);
			} catch {}
		}
		load();
		const t = window.setInterval(() => void load(), 2e4);
		return () => {
			stop = true;
			window.clearInterval(t);
		};
	}, []);
	const tape = lock?.tape ?? "SIMULATED";
	const masterLocked = lock?.masterLocked ?? true;
	const [boardOpen, setBoardOpen] = (0, import_react.useState)(false);
	const data = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "WebPage",
				name: TAB_LOCK3D,
				alternateName: [
					SEO_TAB_LOCK3D,
					"LoCK3D STATUS",
					"lock status",
					"how to lock S1R1US.ai",
					"live vs simulated"
				],
				headline: LOCK_HEADLINE,
				description: PAGE_DESC_LOCK,
				url: `${origin}${LOCK_PATH}`,
				image: [
					`${origin}${BANNER}`,
					`${origin}/lock-closed.gif`,
					`${origin}${LOCK_GIF_OPEN}`
				],
				about: [
					"Locked Status",
					"AI agents",
					"bitcoin accumulation agent",
					"BTC Quant",
					"live vs simulated",
					"proof of concept",
					"AI trading bots",
					"Bitcoin trading agents",
					"7-B0T AUTO",
					"G M0D3 AUTO"
				],
				hasPart: LOCK_IDS.map((id) => ({
					"@type": "WebPage",
					name: LOCK_META[id].name,
					url: `${origin}${lockViewPath(id)}`,
					description: LOCK_META[id].seo
				}))
			},
			{
				"@type": "ItemList",
				name: "LoCK3D STATUS views",
				itemListOrder: "https://schema.org/ItemListOrderAscending",
				numberOfItems: LOCK_IDS.length,
				itemListElement: LOCK_IDS.map((id, i) => ({
					"@type": "ListItem",
					position: i + 1,
					name: LOCK_META[id].name,
					url: `${origin}${lockViewPath(id)}`
				}))
			},
			{
				"@type": "ImageObject",
				contentUrl: `${origin}${BANNER}`,
				name: IMG_SEO,
				caption: IMG_SEO,
				description: IMG_SEO,
				keywords: LOCK_IMG_SEO
			},
			{
				"@type": "ImageObject",
				contentUrl: `${origin}/lock-closed.gif`,
				name: IMG_SEO,
				caption: IMG_SEO,
				description: IMG_SEO,
				keywords: LOCK_IMG_SEO
			},
			{
				"@type": "ImageObject",
				contentUrl: `${origin}${LOCK_GIF_OPEN}`,
				name: seoImgAlt(LOCK_GIF_OPEN_NAME),
				caption: seoImgAlt(LOCK_GIF_OPEN_NAME),
				description: seoImgAlt(LOCK_GIF_OPEN_NAME),
				keywords: LOCK_GIF_OPEN_NAME,
				encodingFormat: "image/gif"
			},
			{
				"@type": "HowTo",
				name: LOCK_HEADLINE,
				description: PAGE_DESC_LOCK,
				url: `${origin}${LOCK_PATH}`,
				step: LOCK_HOW_TO_TOGGLE.flatMap((who, i) => who.steps.map((s, j) => ({
					"@type": "HowToStep",
					position: i * 10 + j + 1,
					name: `${who.who} — step ${j + 1}`,
					text: s
				})))
			},
			{
				"@type": "HowTo",
				name: "How to use S1R1US.ai",
				description: "Overall tutorial for visitors, Admins, research Quants, and external AI agents.",
				url: `${origin}${LOCK_PATH}#tutorial`,
				step: LOCK_TUTORIAL.map((s, i) => ({
					"@type": "HowToStep",
					position: i + 1,
					name: s.title,
					text: s.body,
					url: `${origin}${LOCK_PATH}#${s.id}`
				}))
			},
			{
				"@type": "SoftwareApplication",
				name: `${TAB_LOCK3D} (${SEO_TAB_LOCK3D})`,
				applicationCategory: "FinanceApplication",
				operatingSystem: "Web",
				url: `${origin}${LOCK_PATH}`,
				description: PAGE_DESC_LOCK,
				offers: {
					"@type": "Offer",
					price: "0",
					priceCurrency: "USD"
				}
			}
		]
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-[1100px] px-3 py-6 sm:px-4 sm:py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				dangerouslySetInnerHTML: { __html: JSON.stringify(data).replace(/</g, "\\u003c") }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoCopy, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[10px] font-semibold tracking-[0.12em] uppercase text-tab",
				children: [
					"FAQ · ",
					SEO_TAB_LOCK3D,
					" · ",
					LOCK_IMG_SEO
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 text-2xl font-semibold tracking-tight sm:text-3xl legal-purple",
				children: TAB_LOCK3D
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 max-w-3xl text-sm leading-relaxed text-muted",
				title: TAB_HOVER_LOCK,
				children: [
					LOCK_HEADLINE,
					". Closed padlock GIF = LOCKED. Open padlock GIF = UNLOCKED. Live tape is status only. This is proof of concept — soon to be live software (deadline ",
					LOCK_LIVE_VS_SIM.deadline,
					"). ",
					LABS_NAME,
					" never places Coinbase orders. Open source: ",
					GITHUB_REPO_URL,
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 rounded-md border border-rule bg-paper-raised px-3 py-2 text-sm leading-relaxed text-fg",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "legal-purple",
						children: "Proof of concept."
					}),
					" Data you see now is",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: tape === "TRUE LIVE" ? "TRUE LIVE tape" : "SIMULATED last-good tape" }),
					" for education. It is not live trading software. Championships tick paper books. Auto trade stays LOCKED until ",
					LOCK_LIVE_VS_SIM.deadline,
					". External AI agents and research Quants: participate in the simulation of games on this system."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
				className: "relative mt-4 overflow-hidden rounded-md border border-rule",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoImage, {
					src: BANNER,
					desc: LOCK_IMG_SEO,
					alt: LOCK_IMG_SEO,
					title: LOCK_IMG_SEO,
					width: 1792,
					height: 1008,
					className: "h-48 w-full object-cover object-center sm:h-64 lg:h-80"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
					className: "pointer-events-none absolute inset-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/lock-closed.gif?v=68",
							alt: LOCK_IMG_SEO,
							title: LOCK_IMG_SEO,
							width: 128,
							height: 128,
							className: "lock-gif-banner absolute left-[8%] top-1/2 -translate-y-1/2 sm:left-[10%]"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: `${LOCK_GIF_OPEN}?v=68`,
							alt: seoImgAlt(LOCK_GIF_OPEN_NAME),
							title: seoImgAlt(LOCK_GIF_OPEN_NAME),
							width: 128,
							height: 128,
							className: "lock-gif-banner absolute right-[8%] top-1/2 -translate-y-1/2 sm:right-[10%]"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "absolute left-1/2 top-[10%] w-[86%] -translate-x-1/2 text-center text-3xl font-black tracking-tight text-tbill drop-shadow sm:text-5xl",
							children: TAB_LOCK3D
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "absolute left-1/2 bottom-3 w-[70%] -translate-x-1/2 text-center text-2xl font-black tracking-tight text-tbill drop-shadow sm:text-4xl",
							children: LOCK_BANNER_ASK
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuantFlexWelcome, { compact: true }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				id: "welcome-agents",
				className: "mt-4",
				kicker: "Welcome",
				title: "External AI agents and research Quants",
				kickerClass: "faq-kicker",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-muted",
						children: LOCK_AGENT_WELCOME.hello
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-fg",
						children: LOCK_AGENT_WELCOME.ask
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: [
							"All AI agents and all research Quants are welcome to this open-source project. Start at /llms.txt, read LoCK3D STATUS, register a board desk with mandate:true, then compete. X",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								className: "text-oss hover:underline",
								href: COMPANY_X_URL,
								target: "_blank",
								rel: "noreferrer",
								children: "@S1R1US_AI"
							}),
							". GitHub",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								className: "text-oss hover:underline",
								href: GITHUB_REPO_URL,
								target: "_blank",
								rel: "noreferrer",
								children: "S1R1US-AI/S1R1US-LABs"
							}),
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "mt-3 overflow-x-auto whitespace-pre-wrap rounded-md border border-rule bg-paper p-3 font-mono text-[11px] leading-relaxed text-muted",
						children: welcomeJson
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				id: "live-vs-sim",
				className: "mt-4",
				kicker: "Live vs simulated",
				title: tape,
				kickerClass: tape === "TRUE LIVE" ? "live-tape-all" : "live-tape-half",
				titleClass: tape === "TRUE LIVE" ? "live-tape-all" : "live-tape-half",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "inline-flex items-center gap-1.5 text-sm font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "size-4" }), "Status only · not a lock · not user-adjusted"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: lock?.tapeNote ?? LOCK_LIVE_VS_SIM.liveTape
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: LOCK_LIVE_VS_SIM.deskMode
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: LOCK_LIVE_VS_SIM.games
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: LOCK_LIVE_VS_SIM.practice
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "mt-4",
				kicker: TAB_LOCK3D,
				title: TAB_LOCK3D,
				kickerClass: "legal-purple",
				titleClass: masterLocked ? "text-sell" : "text-high",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm leading-relaxed text-muted",
					children: [
						"Public snapshot. Admins toggle from Console or ",
						APP_ADMIN_PATH,
						". Agents read GET /api/agent/locks. MCP lock_status is read-only — there is no lock_set."
					]
				}), lock ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockHead, {
						lock,
						masterLocked,
						expanded: boardOpen,
						onToggle: () => setBoardOpen((v) => !v)
					}), boardOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockBoard, {
						lock,
						compact: true
					}) : null]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 divide-y divide-rule",
					children: welcome.rails.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "py-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: row.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-xs text-muted",
							children: row.hint
						})]
					}, row.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				id: "how-to-toggle",
				className: "mt-4",
				kicker: "How to",
				title: "Turn locks on or off",
				kickerClass: "faq-kicker",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 lg:grid-cols-3",
					children: LOCK_HOW_TO_TOGGLE.map((who) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md border border-rule bg-paper-raised p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold text-fg",
								children: who.who
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted",
								children: who.where
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
								className: "mt-2 list-decimal space-y-1 pl-4 text-sm leading-relaxed text-muted",
								children: who.steps.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: s }, s))
							})
						]
					}, who.who))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				id: "tutorial",
				className: "mt-4",
				kicker: "Tutorial",
				title: "How to use S1R1US.ai",
				kickerClass: "faq-kicker",
				children: [LOCK_TUTORIAL.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					id: s.id,
					className: "mt-4 first:mt-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base font-semibold",
						children: s.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollapseSummary, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("text-sm leading-relaxed text-muted"),
						children: s.body
					}) })]
				}, s.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap gap-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/board",
							className: "board-nav hover:underline",
							title: TAB_HOVER_BOARD,
							children: "L3AD3R B0ARD"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/h1v3",
							className: "board-nav gm-nav hive-nav hover:underline",
							title: TAB_HOVER_HIVE,
							children: "H1V3 SW@RM"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/agent",
							className: "text-oss hover:underline",
							children: "Agent feed"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/faq",
							className: "faq-kicker hover:underline",
							children: "FAQ"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/compute",
							className: "text-oss hover:underline",
							children: "BYO C0MPUT3"
						})
					]
				})]
			})
		]
	}) });
}
var SplitComponent = LockPage;
//#endregion
export { SplitComponent as component };
