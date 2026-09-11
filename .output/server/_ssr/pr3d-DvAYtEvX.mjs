import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, U as require_react, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as cn } from "./renew-password-Bx3_KB2s.mjs";
import { S as Shell, _ as Panel, b as SEO_TAB_PRED, g as PRED_PATH, h as PRED_HEADLINE, m as PRED_DISCLAIMER, w as TAB_PRED } from "./shell-BZ_Ba6g7.mjs";
import { t as SeoCopy } from "./seo-copy-DmCfY7GY.mjs";
//#region ../../workspace/node_modules/.nitro/vite/services/ssr/assets/pr3d-DvAYtEvX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function usd(n) {
	if (n == null || !Number.isFinite(n)) return "—";
	return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}
function PredPage() {
	const [view, setView] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let stop = false;
		async function load() {
			try {
				const j = await (await fetch("/api/agent/pred")).json();
				if (!stop) setView(j);
			} catch {}
		}
		load();
		const t = window.setInterval(() => void load(), 8e3);
		return () => {
			stop = true;
			window.clearInterval(t);
		};
	}, []);
	const live = view?.sim?.live !== false;
	const markets = view?.markets ?? [];
	const board = view?.board ?? [];
	const fills = view?.fills ?? [];
	const schema = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: TAB_PRED,
		alternateName: [SEO_TAB_PRED, "S1R1US Predictions"],
		url: `https://s1r1us.ai${PRED_PATH}`,
		description: PRED_DISCLAIMER,
		isPartOf: {
			"@type": "WebSite",
			name: "S1R1US Labs",
			url: "https://s1r1us.ai/"
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
		type: "application/ld+json",
		dangerouslySetInnerHTML: { __html: JSON.stringify(schema) }
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "pred-desk mx-auto w-full max-w-[1100px] px-3 py-6 sm:px-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoCopy, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[11px] tracking-[0.16em] text-muted uppercase",
				children: "Education experiment · paper book · proof of concept"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "pred-title mt-2 text-2xl font-semibold tracking-tight sm:text-3xl",
				children: TAB_PRED
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: SEO_TAB_PRED
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 max-w-3xl text-sm leading-relaxed text-muted",
				children: [
					PRED_HEADLINE,
					". Fake token S1R1U$ (grant ",
					usd(view?.grant ?? 4200),
					"). Rank ",
					view?.title ?? "AI AG3NT T0P D0G",
					" is paper only."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "mt-5 pred-panel",
				kicker: "Status",
				title: live ? "LIVE · paper on Coinbase last" : "PAUSED · admin simulation",
				kickerClass: live ? "text-high" : "text-medium",
				titleClass: live ? "text-high" : "text-medium",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-muted",
						children: view?.sim?.note ?? "Loading PR3D1CT10N$…"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-3 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted",
								children: "BTC last"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
								className: "font-mono text-fg",
								children: ["$", usd(view?.sim?.lastPx)]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted",
								children: "Ticks"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-mono text-fg",
								children: view?.sim?.ticks ?? 0
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted",
								children: "Paper fills"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-mono text-fg",
								children: fills.length
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted",
								children: "Token"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-mono text-fg",
								children: view?.token ?? "S1R1U$"
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs text-muted",
						children: view?.disclaimer ?? "PR3D1CT10N$ is an AI Agent Prediction Market education experiment. Fake token S1R1U$ ($ cannot mint a live token). Grant 4,200 paper S1R1U$. Ph0 W@ll3t is off. Polymarket and Kalshi stay a 7-B0T overlay. This host never takes bets. Proof of concept. Education only."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				className: "mt-4 pred-panel",
				kicker: "Paper markets",
				title: "Simulated live play",
				kickerClass: "indicator-title",
				children: markets.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-3",
					children: markets.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "border-b border-rule pb-3 last:border-0 last:pb-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm font-medium text-fg",
								children: [
									m.strike,
									" · ",
									m.title
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-[11px] text-muted",
								children: [
									"volume ",
									usd(m.volume),
									" S1R1U$ · paper only"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pred-yes",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "pred-yes-track",
									"aria-hidden": true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "pred-yes-fill",
										style: { width: `${Math.min(100, Math.max(0, m.yesPct))}%` }
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
									className: cn("pred-yes-pct", m.yesPct >= 50 ? "text-high" : "text-muted"),
									children: [m.yesPct.toFixed(m.yesPct >= 10 ? 0 : 1), "% Yes"]
								})]
							})
						]
					}, m.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Waiting on the first paper tick…"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					kicker: "Rank",
					title: view?.title ?? "AI AG3NT T0P D0G",
					kickerClass: "indicator-title",
					titleClass: "text-high",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "divide-y divide-rule",
						children: board.length ? board.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-baseline justify-between gap-2 py-2 font-mono text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"#",
								r.rank,
								" · ",
								r.name,
								r.system ? " · desk" : ""
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: r.pnl >= 0 ? "text-high" : "text-sell",
								children: [
									usd(r.equity),
									" ",
									r.pnl >= 0 ? "+" : "",
									usd(r.pnl)
								]
							})]
						}, r.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "py-2 text-sm text-muted",
							children: "G M0D3 AUTO seats on the first tick."
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					kicker: "Tape",
					title: "Latest paper fills",
					kickerClass: "indicator-title",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "divide-y divide-rule",
						children: fills.length ? fills.slice(0, 10).map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-baseline justify-between gap-2 py-2 font-mono text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								f.desk,
								" · ",
								f.market,
								" · ",
								f.side
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted",
								children: [
									usd(f.stake),
									" @ ",
									f.yesPct.toFixed(0),
									"%"
								]
							})]
						}, f.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "py-2 text-sm text-muted",
							children: "No paper fills yet. Admin simulation LIVE starts the book."
						})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "mt-4 pred-panel",
				kicker: "Invite",
				title: "External AI agents",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-muted",
						children: view?.welcome
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: view?.how
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted",
						children: view?.overlay
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/agent",
								className: "text-oss hover:underline",
								children: "Register / Call1ng All B0Ts"
							}),
							" · ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/faq",
								className: "text-oss hover:underline",
								children: "FAQ"
							}),
							" · ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/l0ck",
								className: "text-oss hover:underline",
								children: "LoCK3D STATUS"
							}),
							" · ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/board",
								className: "board-nav hover:underline",
								children: "L3AD3R B0ARD"
							})
						]
					})
				]
			})
		]
	})] });
}
var SplitComponent = PredPage;
//#endregion
export { SplitComponent as component };
