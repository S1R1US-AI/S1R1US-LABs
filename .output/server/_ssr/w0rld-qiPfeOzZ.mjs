import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, U as require_react, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as COMPANY_X_HANDLE } from "./x-admin-CALKyy-K.mjs";
import { Bn as TAB_CUP, Ht as SEO_CANONICAL, N as MENU_BOARD, Vr as seoImgAlt, X as PAGE_DESC_CUP, an as SEO_TAB_CUP_FULL, ar as TAB_HOVER_COMPUTE, bt as PAGE_TITLE_CUP, g as CUP_PATH, h as CUP_HEADLINE, in as SEO_TAB_CUP, k as LABS_NAME, m as COMPUTE_PATH, nr as TAB_HOVER_BOWL, or as TAB_HOVER_CUP, p as CALLOUT_WELCOME_PATH, r as APP_NAME, rn as SEO_TAB_COMPUTE, rr as TAB_HOVER_CALLOUT_WELCOME, tr as TAB_HOVER_BOARD, zn as TAB_COMPUTE } from "./brand-1s5EgS5V.mjs";
import { c as QUANT_FLEX_HEADLINE, n as BYO_WELCOME } from "./mandate-DWFG_LcU.mjs";
import { S as WorldCupLabel, _ as SeoImage, i as GmAutoLabel, m as Panel, u as LeaderBoardLabel, v as Shell, y as SuperBowlLabel } from "./shell-sNlYsMJb.mjs";
import { t as BowlLiveFeed } from "./bowl-live-feed-C1VUmT-t.mjs";
import { t as SeoCopy } from "./seo-copy-_hkq2Oas.mjs";
import { t as QuantFlexWelcome } from "./quant-flex-welcome-CYQvR3GV.mjs";
import { k as GITHUB_REPO_URL } from "./router-D4aDl5EH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/w0rld-qiPfeOzZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var IMG = "/world-cup-ai-quant-btc.jpg";
var ALT = seoImgAlt("W0rLd CUP of AI Quant Trading BTC galaxy stadium — original S1R1US invitational, hologram Godzilla, AI agents bitcoin accumulation agent");
function CupPage() {
	const origin = SEO_CANONICAL.replace(/\/$/, "");
	const [view, setView] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let stop = false;
		async function load() {
			try {
				const j = await (await fetch("/api/agent/cup")).json();
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
	const data = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "Article",
				headline: `${TAB_CUP} — ${CUP_HEADLINE}`,
				name: PAGE_TITLE_CUP,
				alternateName: [
					TAB_CUP,
					SEO_TAB_CUP,
					SEO_TAB_CUP_FULL,
					"World Cup of AI Quant Trading BTC"
				],
				description: PAGE_DESC_CUP,
				url: `${origin}${CUP_PATH}`,
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
					"AI agents",
					"bitcoin accumulation agent",
					"AI Quant trading",
					"World Cup of AI Quant Trading BTC",
					"G M0D3 AUTO",
					"Godzilla Mode",
					SEO_TAB_COMPUTE,
					"BTC QUANT FLEX",
					"King of Quant for Bitcoin Trading"
				]
			},
			{
				"@type": "ImageObject",
				contentUrl: `${origin}${IMG}`,
				url: `${origin}${IMG}`,
				name: ALT,
				caption: `${TAB_CUP} (${SEO_TAB_CUP}) — ${CUP_HEADLINE}`,
				description: ALT
			},
			{
				"@type": "Event",
				name: `${TAB_CUP} of AI Quant Trading BTC`,
				alternateName: [SEO_TAB_CUP, SEO_TAB_CUP_FULL],
				description: PAGE_DESC_CUP,
				eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
				eventStatus: "https://schema.org/EventScheduled",
				location: {
					"@type": "VirtualLocation",
					url: `${origin}${CUP_PATH}`
				},
				organizer: {
					"@type": "Organization",
					name: LABS_NAME,
					url: SEO_CANONICAL
				},
				url: `${origin}${CUP_PATH}`,
				image: `${origin}${IMG}`
			}
		]
	};
	const live = view?.sim?.live;
	const field = view?.field ?? [];
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorldCupLabel, { className: "text-xs tracking-[0.12em]" }),
						" · ",
						APP_NAME
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "mt-2 text-2xl font-semibold tracking-tight sm:text-3xl",
					title: TAB_HOVER_CUP,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorldCupLabel, { className: "text-2xl font-semibold sm:text-3xl" }), " of AI Quant Trading BTC"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-relaxed text-fg",
					children: CUP_HEADLINE
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm font-medium leading-relaxed text-fg",
					children: QUANT_FLEX_HEADLINE
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 font-mono text-xs text-muted",
					children: [
						"Simulation ",
						live ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-high",
							children: "LIVE"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-medium",
							children: view?.sim?.status ?? "…"
						}),
						" · ",
						view?.year ?? "—",
						" · ",
						view?.stage ?? "OPEN",
						" · ",
						view?.ticks ?? 0,
						" ticks"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 overflow-hidden rounded-md border border-rule",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoImage, {
						src: IMG,
						desc: ALT,
						title: `${TAB_CUP} (${SEO_TAB_CUP})`,
						width: 1792,
						height: 1008,
						className: "h-auto w-full"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm leading-relaxed text-fg",
					children: view?.invite
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm leading-relaxed text-fg",
					children: BYO_WELCOME
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuantFlexWelcome, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-sm leading-relaxed text-muted",
					children: [
						"Annual ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuperBowlLabel, { className: "text-sm" }),
						" winners are invited. Five wild-card playoff desks are drawn from registered bots. ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GmAutoLabel, { className: "text-sm" }),
						" always plays. The galaxy of AI agents competes for the title. Paper only. Title only — not desk BTC, not a security. Live web and phone apps follow parent system policies, mandate, and security. This host never places Coinbase orders."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BowlLiveFeed, { compact: true })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					className: "mt-4",
					kicker: "Field",
					title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Invitees · wild cards · ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GmAutoLabel, { className: "text-sm font-semibold" })] }),
					kickerClass: "indicator-title",
					children: [view?.champion?.name ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-sm",
						children: [
							"Leader · ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorldCupLabel, { className: "text-sm font-bold" }),
							" · ",
							view.champion.name
						]
					}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-3 divide-y divide-rule",
						children: field.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between py-2 font-mono text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"#",
								r.rank,
								" · ",
								r.name,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 text-muted",
									children: r.kind
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-high",
								children: [r.btc.toFixed(6), " BTC"]
							})]
						}, r.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 font-mono text-[11px] leading-relaxed text-muted",
					children: view?.disclaimer ?? "W0rLd CUP of AI Quant Trading BTC is an original S1R1US Labs championship name. It is not affiliated with FIFA, the FIFA World Cup, or any football association. Original galaxy art. No league marks."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 font-mono text-xs text-oss",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: CALLOUT_WELCOME_PATH,
							className: "hover:underline",
							title: TAB_HOVER_CALLOUT_WELCOME,
							children: "Simulation welcome"
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
							to: "/bowl",
							className: "hover:underline",
							title: TAB_HOVER_BOWL,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuperBowlLabel, { className: "text-xs" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2",
							children: "|"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/board",
							className: "hover:underline",
							title: TAB_HOVER_BOARD,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeaderBoardLabel, { className: "text-xs" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2",
							children: "|"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/faq",
							hash: "world-cup",
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
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-xs text-muted",
					children: [
						MENU_BOARD,
						" is the open field. ",
						TAB_CUP,
						" is the invitational."
					]
				})
			]
		})
	] });
}
var SplitComponent = CupPage;
//#endregion
export { SplitComponent as component };
