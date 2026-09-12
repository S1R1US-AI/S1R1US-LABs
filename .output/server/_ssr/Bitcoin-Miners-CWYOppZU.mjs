import { $ as LABS_NAME, B as GIF_MINERS_LARGE_NAME, H as GIF_MINERS_SWARM_NAME, L as GIF_MINERS_HASH, Nt as PAGE_DESC_MINERS, R as GIF_MINERS_HASH_NAME, Sn as SEO_CANONICAL, V as GIF_MINERS_SWARM, _i as TAB_MINERS, dt as MINERS_PATH, er as SEO_TAB_MINERS, ji as seoImgAlt, ki as WHITE_LABEL_PATH, lt as MINERS_DISCLAIMER, on as PAGE_TITLE_MINERS, ut as MINERS_HEADLINE, z as GIF_MINERS_LARGE } from "./brand-CDqF9nyU.mjs";
import { a as MINERS_FAQ_ITEMS, c as MINERS_STRATUM_SCHEME, f as ckpoolStatsUrl, i as MINERS_DEFAULT_STRATUM, n as MINERS_DEFAULT_ADDRESS, o as MINERS_INSTRUCTIONS, r as MINERS_DEFAULT_BACKUP, s as MINERS_PASSWORD_NOTE, t as CKPOOL_DOCS } from "./btc-miners-C_ITq4f_.mjs";
import { S as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as Shell, _ as Panel, x as SeoImage } from "./shell-DhzBcQbb.mjs";
import { t as SeoCopy } from "./seo-copy-DPXIBeSr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Bitcoin-Miners-CWYOppZU.js
var import_jsx_runtime = require_jsx_runtime();
var ALT_LARGE = seoImgAlt(GIF_MINERS_LARGE_NAME);
var ALT_SWARM = seoImgAlt(GIF_MINERS_SWARM_NAME);
var ALT_HASH = seoImgAlt(GIF_MINERS_HASH_NAME);
/** /Bitcoin-Miners — BTC M1N3Rz (BTC Miners View): Bitcoin Miner for accumulation system. */
function BitcoinMinersPage() {
	const origin = SEO_CANONICAL.replace(/\/$/, "");
	const statsUrl = ckpoolStatsUrl(MINERS_DEFAULT_ADDRESS);
	const data = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "Article",
				headline: MINERS_HEADLINE,
				name: PAGE_TITLE_MINERS,
				alternateName: [
					TAB_MINERS,
					SEO_TAB_MINERS,
					MINERS_HEADLINE,
					"Bitcoin Miners"
				],
				description: PAGE_DESC_MINERS,
				url: `${origin}${MINERS_PATH}`,
				image: [
					`${origin}${GIF_MINERS_LARGE}`,
					`${origin}${GIF_MINERS_SWARM}`,
					`${origin}${GIF_MINERS_HASH}`
				],
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
					"bitcoin miner",
					"solo CKPool",
					"CKPool stratum",
					"miner hash power graph",
					SEO_TAB_MINERS
				]
			},
			{
				"@type": "ImageObject",
				contentUrl: `${origin}${GIF_MINERS_LARGE}`,
				url: `${origin}${GIF_MINERS_LARGE}`,
				name: ALT_LARGE,
				caption: `${TAB_MINERS} (${SEO_TAB_MINERS}) — ${MINERS_HEADLINE}`,
				description: ALT_LARGE
			},
			{
				"@type": "ImageObject",
				contentUrl: `${origin}${GIF_MINERS_SWARM}`,
				url: `${origin}${GIF_MINERS_SWARM}`,
				name: ALT_SWARM,
				caption: seoImgAlt("connecting bitcoin miners to an AI hive swarm"),
				description: ALT_SWARM
			},
			{
				"@type": "ImageObject",
				contentUrl: `${origin}${GIF_MINERS_HASH}`,
				url: `${origin}${GIF_MINERS_HASH}`,
				name: ALT_HASH,
				caption: seoImgAlt("solo CKPool bitcoin miner hash power graph"),
				description: ALT_HASH
			},
			{
				"@type": "HowTo",
				name: `${TAB_MINERS} (${SEO_TAB_MINERS}) — how to connect a bitcoin miner`,
				description: `Point any SHA-256 bitcoin miner at solo CKPool and watch free public stats in the ${TAB_MINERS} desk view.`,
				url: `${origin}${MINERS_PATH}`,
				step: MINERS_INSTRUCTIONS.map((text, i) => ({
					"@type": "HowToStep",
					position: i + 1,
					text
				}))
			},
			{
				"@type": "FAQPage",
				name: `${TAB_MINERS} (${SEO_TAB_MINERS}) FAQ`,
				url: `${origin}${MINERS_PATH}`,
				mainEntity: MINERS_FAQ_ITEMS.map((f) => ({
					"@type": "Question",
					name: f.q,
					acceptedAnswer: {
						"@type": "Answer",
						text: f.a
					}
				}))
			}
		]
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
			type: "application/ld+json",
			dangerouslySetInnerHTML: { __html: JSON.stringify(data) }
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto w-full max-w-[1100px] space-y-4 px-3 py-6 sm:px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					kicker: `${TAB_MINERS} · ${SEO_TAB_MINERS}`,
					title: MINERS_HEADLINE,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-3 text-sm text-muted",
							children: "Free public solo CKPool (ckpool.org) miner stats in a pro trading desk view — hash power by hour, day, month, and year. Connecting bitcoin miners to an AI hive swarm."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoImage, {
							src: GIF_MINERS_LARGE,
							alt: ALT_LARGE,
							title: GIF_MINERS_LARGE_NAME,
							width: 480,
							height: 270,
							loading: "eager",
							className: "mx-auto h-auto w-full max-w-[480px] rounded-lg"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 grid gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoImage, {
								src: GIF_MINERS_SWARM,
								alt: ALT_SWARM,
								title: GIF_MINERS_SWARM_NAME,
								width: 200,
								height: 200,
								loading: "lazy",
								className: "mx-auto h-auto w-full max-w-[200px] rounded-lg"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoImage, {
								src: GIF_MINERS_HASH,
								alt: ALT_HASH,
								title: GIF_MINERS_HASH_NAME,
								width: 200,
								height: 200,
								loading: "lazy",
								className: "mx-auto h-auto w-full max-w-[200px] rounded-lg"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 text-sm text-muted",
							children: [
								TAB_MINERS,
								" (",
								SEO_TAB_MINERS,
								") lives in the S1R1US.ai system admin console and in every",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: WHITE_LABEL_PATH,
									className: "underline",
									children: "White Label"
								}),
								" ",
								"download — miner information is never stripped. Live public stats for the S1R1US.ai system admin miner:",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: statsUrl,
									target: "_blank",
									rel: "noreferrer",
									className: "underline",
									children: statsUrl
								}),
								"."
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					kicker: "1NSTRUCT10NS",
					title: `How ${TAB_MINERS} is used`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-3 text-sm text-muted",
							children: "Only the most basic information is required."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "list-decimal space-y-2 pl-5 text-sm",
							children: MINERS_INSTRUCTIONS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: s }, s))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 grid gap-2 text-sm sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-md border border-rule p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted",
										children: MINERS_STRATUM_SCHEME
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-mono",
										children: MINERS_DEFAULT_STRATUM
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-md border border-rule p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted",
										children: "backup pool"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-mono",
										children: MINERS_DEFAULT_BACKUP
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-md border border-rule p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted",
										children: "BTC receive address (default)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "break-all font-mono",
										children: MINERS_DEFAULT_ADDRESS
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs text-muted",
							children: MINERS_PASSWORD_NOTE
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted",
							children: [
								"Solo CKPool docs:",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: CKPOOL_DOCS,
									target: "_blank",
									rel: "noreferrer",
									className: "underline",
									children: CKPOOL_DOCS
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					kicker: "FAQ",
					title: `${TAB_MINERS} FAQ`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-4 text-sm",
						children: MINERS_FAQ_ITEMS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							id: f.id,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold",
								children: f.q
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-muted",
								children: f.a
							})]
						}, f.id))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-xs text-muted",
						children: MINERS_DISCLAIMER
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoCopy, {})
	] });
}
var SplitComponent = BitcoinMinersPage;
//#endregion
export { SplitComponent as component };
