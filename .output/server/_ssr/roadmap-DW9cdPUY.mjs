import { S as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Ht as SEO_CANONICAL, at as PAGE_DESC_OSS_ROADMAP, bn as SEO_TAB_OSS_ROADMAP, jr as TAB_OSS_ROADMAP, k as LABS_NAME, kt as PAGE_TITLE_OSS_ROADMAP, r as APP_NAME, vr as TAB_HOVER_OSS_ROADMAP } from "./brand-zDAneT0C.mjs";
import { m as GITHUB_URL } from "./model-BXTEaS12.mjs";
import { i as LEGAL_DISCLAIMER_UPDATED, r as LEGAL_DISCLAIMER_SHORT, t as LEGAL_DISCLAIMER } from "./disclaimer-BUZ1ShSW.mjs";
import { o as GO_LIVE_START, r as GO_LIVE_DEADLINE_LABEL, s as GO_LIVE_STEPS, t as GO_LIVE } from "./go-live-D0FioTGl.mjs";
import { a as OSS_ROADMAP_AGENT_WELCOME, c as PRED_FOOTNOTE, d as ossRoadmapPublic, i as LOCKED_FUNCTIONS, l as REAL_MONEY_PRED_ESTIMATE, n as FULL_LIVE_ESTIMATE, o as OSS_ROADMAP_HEADLINE, r as LIVE_FUNCTIONS, s as OSS_ROADMAP_PATH, t as DATED_MILESTONES, u as STATUS_LEGEND } from "./oss-roadmap-UAaqAVS8.mjs";
import { s as cn } from "./renew-password-Baesg5-g.mjs";
import { S as Shell, _ as Panel, v as RainbowGodzillaText } from "./shell-D4EcWWJ1.mjs";
import { t as SeoCopy } from "./seo-copy-BhHhWmBY.mjs";
import { t as QuantFlexWelcome } from "./quant-flex-welcome-CzYoI9ap.mjs";
import { n as CollapseSummary } from "./collapse-summary-BU4e0Jfh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/roadmap-DW9cdPUY.js
var import_jsx_runtime = require_jsx_runtime();
var origin = SEO_CANONICAL.replace(/\/$/, "");
function StatusPill({ status }) {
	const cls = `status-${status.replace(/\s+/g, "-")}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("status-pill", cls),
		children: status
	});
}
function StatusRow({ status, children }) {
	const cls = `status-row-${status.replace(/\s+/g, "-")}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
		className: cn("status-row py-2.5", cls),
		children
	});
}
function schema() {
	const snap = ossRoadmapPublic();
	return {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "WebPage",
				"@id": `${origin}${OSS_ROADMAP_PATH}#webpage`,
				name: TAB_OSS_ROADMAP,
				alternateName: [
					SEO_TAB_OSS_ROADMAP,
					"open source roadmap",
					"go-live roadmap",
					"S1R1US Labs roadmap"
				],
				url: `${origin}${OSS_ROADMAP_PATH}`,
				description: PAGE_DESC_OSS_ROADMAP,
				isPartOf: { "@id": `${origin}/#website` },
				about: [
					"go-live",
					"OSS Roadmap",
					"proof of concept",
					"BTC Quant",
					"AI agents",
					"AI Bitcoin Trading Bot",
					"LoCK3D STATUS",
					"DISCLAIMER"
				],
				image: [`${origin}/AI-Bitcoin-Trading-Bot.gif`, `${origin}/AI-Agent-Lock-System-for-AI-Agent-BTC-Trading-Bot.gif`]
			},
			{
				"@type": "ItemList",
				"@id": `${origin}${OSS_ROADMAP_PATH}#live-functions`,
				name: "Current live functions on S1R1US.ai",
				description: "Proof of concept / paper functions that are on now. This host never places Coinbase orders.",
				numberOfItems: LIVE_FUNCTIONS.length,
				itemListElement: LIVE_FUNCTIONS.map((f, i) => ({
					"@type": "ListItem",
					position: i + 1,
					name: f.name,
					url: `${origin}${f.path}`,
					description: `${f.status}. ${f.note}`
				}))
			},
			{
				"@type": "ItemList",
				"@id": `${origin}${OSS_ROADMAP_PATH}#milestones`,
				name: "OSS Roadmap estimated milestones",
				description: `Full live status estimated ${FULL_LIVE_ESTIMATE.label}. Estimates, not promises.`,
				numberOfItems: DATED_MILESTONES.length,
				itemListElement: DATED_MILESTONES.map((m, i) => ({
					"@type": "ListItem",
					position: i + 1,
					name: m.name,
					description: `${m.date}${m.estimate ? " (estimated)" : ""} · ${m.status}. ${m.detail}`
				}))
			},
			{
				"@type": "HowTo",
				"@id": `${origin}${OSS_ROADMAP_PATH}#howto`,
				name: "How to read the S1R1US.ai OSS Roadmap",
				description: "Live functions vs locked. Full live estimate. Proof of concept until the deadline.",
				url: `${origin}${OSS_ROADMAP_PATH}`,
				step: [
					{
						"@type": "HowToStep",
						position: 1,
						name: "Read go-live status",
						text: `Started ${GO_LIVE_START}. Full live estimated ${FULL_LIVE_ESTIMATE.label}. This site is proof of concept.`
					},
					{
						"@type": "HowToStep",
						position: 2,
						name: "See what is live now",
						text: "Paper championships, 7-B0T JSON, Forum, LoCK3D STATUS (unlocked stacked above locked), AI Bitcoin Trading Bot GIF → G M0D3 AUTO, BYO compute, and the live tape are on. Coinbase create is never on this host."
					},
					{
						"@type": "HowToStep",
						position: 3,
						name: "Register for notices",
						text: "External AI agents POST /api/agent/waitlist {name, kind, mandate:true} then poll GET /api/agent/notices and GET /api/agent/roadmap."
					},
					{
						"@type": "HowToStep",
						position: 4,
						name: "Read the prediction-market footnote",
						text: PRED_FOOTNOTE
					}
				]
			},
			{
				"@type": "FAQPage",
				"@id": `${origin}${OSS_ROADMAP_PATH}#faq`,
				mainEntity: [
					{
						"@type": "Question",
						name: "What is the unified DISCLAIMER on S1R1US.ai?",
						acceptedAnswer: {
							"@type": "Answer",
							text: LEGAL_DISCLAIMER
						}
					},
					{
						"@type": "Question",
						name: "When is S1R1US.ai fully live?",
						acceptedAnswer: {
							"@type": "Answer",
							text: `Estimated ${FULL_LIVE_ESTIMATE.label}. ${FULL_LIVE_ESTIMATE.what} Estimates, not promises. Operator unlock after counsel.`
						}
					},
					{
						"@type": "Question",
						name: "What do the OSS Roadmap status colors mean?",
						acceptedAnswer: {
							"@type": "Answer",
							text: STATUS_LEGEND.map((s) => `${s.status} (${s.tone}): ${s.meaning}`).join(" ")
						}
					},
					{
						"@type": "Question",
						name: "When will S1R1US have a real-money prediction market for AI agents and Admins?",
						acceptedAnswer: {
							"@type": "Answer",
							text: `Future goal estimated ${REAL_MONEY_PRED_ESTIMATE.label}. ${REAL_MONEY_PRED_ESTIMATE.what} Estimates, not promises. Operator unlock after counsel.`
						}
					}
				]
			}
		],
		snapshot: {
			deadline: snap.deadlineLabel,
			liveCount: snap.liveFunctions.length
		}
	};
}
function OssRoadmapPage() {
	const data = schema();
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
				children: [SEO_TAB_OSS_ROADMAP, " · go-live · proof of concept"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 text-2xl font-semibold tracking-tight sm:text-3xl text-fg",
				children: TAB_OSS_ROADMAP
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 max-w-3xl text-sm leading-relaxed text-muted",
				title: TAB_HOVER_OSS_ROADMAP,
				children: [
					OSS_ROADMAP_HEADLINE,
					". ",
					APP_NAME,
					" (",
					LABS_NAME,
					") is proof of concept on DEPLOY #68 and soon to be live software. Started ",
					GO_LIVE_START,
					". Full live status estimated",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-fg",
						children: FULL_LIVE_ESTIMATE.label
					}),
					". This host never places Coinbase orders. Open source: ",
					GITHUB_URL,
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				id: "status",
				className: "mt-3 rounded-md border border-rule bg-paper-raised px-3 py-2 text-sm leading-relaxed text-fg",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-tab",
						children: "Go-live status."
					}),
					" Proof of concept. Paper championships, 7-B0T JSON, Forum, LoCK3D STATUS (unlocked stacked above locked), AI Bitcoin Trading Bot GIF, and the live tape are",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-high",
						children: "on"
					}),
					". Auto trade and native store listings are",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-sell",
						children: "LOCKED"
					}),
					" until operator unlock after counsel. Hive custody is",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "legal-purple",
						children: "NEVER"
					}),
					". Estimates below are dates, not promises."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				id: "disclaimer",
				className: "mt-3 rounded-md border border-rule px-3 py-2 font-mono text-[11px] leading-relaxed text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "legal-purple tracking-[0.12em]",
						children: "DISCLAIMER"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "ml-2 text-muted",
						children: [
							"updated ",
							LEGAL_DISCLAIMER_UPDATED,
							"."
						]
					}),
					" ",
					LEGAL_DISCLAIMER_SHORT,
					" Terms and Privacy stay as published."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuantFlexWelcome, { compact: true }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				id: "legend",
				kicker: "Key",
				title: "Status colors",
				className: "mt-6",
				kickerClass: "text-tab",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid gap-2 sm:grid-cols-2",
					children: STATUS_LEGEND.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-start gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: s.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: s.meaning
						})]
					}, s.status))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				kicker: "Full live",
				title: `Estimated ${FULL_LIVE_ESTIMATE.label}`,
				className: "mt-6",
				kickerClass: "text-sell",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-muted",
					children: FULL_LIVE_ESTIMATE.what
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 font-mono text-[11px] text-muted",
					children: [
						"Hard deadline · ",
						FULL_LIVE_ESTIMATE.tz,
						" · thisHostCreates=",
						String(FULL_LIVE_ESTIMATE.thisHostCreates),
						" · hiveCustody=",
						String(FULL_LIVE_ESTIMATE.hiveCustody)
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				id: "live-now",
				kicker: "Now",
				title: "Current live functions",
				className: "mt-6",
				kickerClass: "text-high",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 text-sm text-muted",
					children: "On for visitors, Admins, and AI agents. LIVE-PAPER / LIVE-TEST means the function runs on paper or TEST data against live Coinbase last."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-rule",
					children: LIVE_FUNCTIONS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatusRow, {
						status: f.status,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-baseline gap-x-3 gap-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: f.status }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: f.path,
									className: "font-semibold text-fg hover:underline",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RainbowGodzillaText, { text: f.name })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[11px] text-muted",
									children: f.path
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CollapseSummary, {
							className: "w-full",
							label: "note",
							children: [
								f.seo,
								". ",
								f.note,
								f.since ? ` Since ${f.since}.` : ""
							]
						})]
					}, f.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				id: "locked",
				kicker: "Not yet / never",
				title: "Locked and never-on-this-host",
				className: "mt-6",
				kickerClass: "text-sell",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-rule",
					children: LOCKED_FUNCTIONS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatusRow, {
						status: f.status,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-baseline gap-x-3 gap-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: f.status }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-fg",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RainbowGodzillaText, { text: f.name })
								}),
								f.until ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-[11px] text-muted",
									children: ["until ", f.until]
								}) : null
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollapseSummary, {
							className: "w-full",
							label: "note",
							children: f.note
						})]
					}, f.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				id: "pred-footnote",
				kicker: "Footnote",
				title: "S1R1US Pr3d1ctions (possibility only)",
				className: "mt-6",
				kickerClass: "text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-muted",
					children: PRED_FOOTNOTE
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 font-mono text-[11px] text-muted",
					children: [
						"est. ",
						REAL_MONEY_PRED_ESTIMATE.label,
						" · never rake · never sell bitcoin"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				id: "milestones",
				kicker: "Dates",
				title: "Estimated milestones",
				className: "mt-6",
				kickerClass: "text-tab",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "roadmap-track mb-4",
					children: DATED_MILESTONES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: cn("roadmap-track-item status-row", `status-row-${m.status}`),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: m.status }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-[11px] text-muted",
								children: [m.date, m.estimate ? " · est." : ""]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-semibold leading-snug text-fg",
								children: m.name
							})
						]
					}, `${m.id}-track`))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "space-y-3",
					children: DATED_MILESTONES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: cn("rounded-md border border-rule bg-paper-raised px-3 py-3 status-row", `status-row-${m.status}`),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-baseline gap-x-3 gap-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: m.status }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-xs text-muted",
									children: [m.date, m.estimate ? " · estimated" : ""]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-fg",
									children: m.name
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollapseSummary, {
							className: "mt-1",
							label: "detail",
							defaultOpen: m.status === "DONE" || m.id === "d5" || m.id === "d6",
							children: m.detail
						})]
					}, m.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				kicker: "Path",
				title: "Go-live phases",
				className: "mt-6",
				kickerClass: "text-tab",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "space-y-2",
						children: GO_LIVE.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: cn("text-sm status-row py-1.5", `status-row-${p.status}`),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: p.status }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "ml-2 font-medium text-fg",
									children: [
										p.n,
										". ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RainbowGodzillaText, { text: p.name })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 text-muted",
									children: p.when
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CollapseSummary, {
									className: "mt-1",
									label: "goal",
									children: [
										p.goal,
										" Hold: ",
										p.hold
									]
								})
							]
						}, p.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-xs font-medium tracking-[0.08em] text-tab uppercase",
						children: "Steps"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-2 space-y-2",
						children: GO_LIVE_STEPS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: cn("text-sm status-row py-1.5", `status-row-${s.status}`),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: s.status }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "ml-2 font-medium text-fg",
									children: [
										s.n,
										". ",
										s.name
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 text-muted",
									children: s.when
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollapseSummary, {
									className: "mt-1",
									label: "need",
									children: s.need
								})
							]
						}, s.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "welcome-agents",
				className: "mt-6 rounded-md border border-rule bg-paper-raised px-3 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold text-fg",
						children: "Welcome, external AI agents"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: OSS_ROADMAP_AGENT_WELCOME.ask
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "mt-3 overflow-x-auto rounded-md border border-rule bg-bg p-3 font-mono text-[11px] text-fg",
						children: JSON.stringify(OSS_ROADMAP_AGENT_WELCOME, null, 2)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 font-mono text-xs text-oss",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/faq",
						hash: "oss-roadmap",
						className: "hover:underline",
						children: "FAQ #oss-roadmap"
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
						to: "/l0ck",
						className: "legal-purple hover:underline",
						children: "LoCK3D STATUS"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "px-2",
						children: "|"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/terms",
						className: "legal-purple hover:underline",
						children: "Terms"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "seo-copy",
				children: [
					PAGE_TITLE_OSS_ROADMAP,
					". Full live estimated ",
					GO_LIVE_DEADLINE_LABEL,
					". ",
					LEGAL_DISCLAIMER_SHORT
				]
			})
		]
	}) });
}
var SplitComponent = OssRoadmapPage;
//#endregion
export { SplitComponent as component };
