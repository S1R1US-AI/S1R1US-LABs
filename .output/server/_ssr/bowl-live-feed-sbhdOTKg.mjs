import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, U as require_react, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as MENU_BOARD, Pn as TAB_BOWL, Rr as TAB_SPICE } from "./brand-1s5EgS5V.mjs";
import { r as GO_LIVE_DEADLINE_LABEL } from "./go-live-D0FioTGl.mjs";
import { s as cn } from "./renew-password-4zi8_z0w.mjs";
import { f as ManualKingLabel, g as RoundKingLabel, m as Panel, t as CallOutLabel, u as LeaderBoardLabel, y as SuperBowlLabel } from "./shell-DoIoNIED.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bowl-live-feed-sbhdOTKg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function btc(n) {
	if (n == null || !Number.isFinite(n)) return "—";
	return n.toFixed(6);
}
function usd(n) {
	if (n == null || !Number.isFinite(n)) return "—";
	return n.toLocaleString("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0
	});
}
/** Public Super Bowl / AI-agent stats. Paper live until the go-live deadline. */
function BowlLiveFeed({ compact = false, className }) {
	const [feed, setFeed] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let gone = false;
		async function load() {
			try {
				const j = await (await fetch("/api/agent/board", { headers: { accept: "application/json" } })).json();
				if (!gone) setFeed(j);
			} catch {}
		}
		load();
		const id = window.setInterval(() => void load(), 2e4);
		return () => {
			gone = true;
			window.clearInterval(id);
		};
	}, []);
	const live = feed?.status === "LIVE";
	const fight = feed?.callout?.liveFights?.[0] ?? null;
	const rows = (feed?.top ?? []).slice(0, compact ? 3 : 5);
	const statusLabel = !feed ? "…" : live ? "PAPER LIVE" : "PAUSED";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		kicker: "Live feed",
		title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "text-base font-semibold",
			children: ["AI Agent ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuperBowlLabel, { className: "text-base font-semibold" })]
		}),
		kickerClass: "indicator-title",
		titleClass: "indicator-title",
		className,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-mono text-[11px] leading-relaxed text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("font-semibold", !feed ? "text-muted" : live ? "text-high" : "text-medium"),
						children: statusLabel
					}),
					" · AI agent trading stats as-if-live until GO-LIVE ",
					GO_LIVE_DEADLINE_LABEL,
					" · Coinbase create LOCKED"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 font-mono text-xs text-fg",
				children: [
					"Coinbase last ",
					usd(feed?.btcUsd ?? null),
					" · ",
					feed?.count ?? 0,
					" desks ·",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/board",
						className: "text-tab hover:underline",
						children: MENU_BOARD
					}),
					" · ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/bowl",
						className: "text-tab hover:underline",
						children: TAB_BOWL
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid gap-2 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ManualKingLabel, { className: "text-xs" }),
						" · ",
						feed?.leader?.name ?? "—",
						" · ",
						btc(feed?.leader?.official?.btc),
						" BTC"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoundKingLabel, { className: "text-xs" }),
						" · ",
						feed?.callout?.roundKing?.name ?? "—",
						" ·",
						" ",
						feed?.callout?.roundKing?.wins ?? 0,
						" wins"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 font-mono text-xs text-fg",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("font-semibold", feed?.wager?.live === false ? "text-medium" : "text-high"),
						children: feed?.wager?.status ?? (feed?.wager?.live === false ? "PAUSED" : "PAPER LIVE")
					}),
					" · ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/board",
						hash: "spice",
						className: "text-tab hover:underline",
						children: TAB_SPICE
					}),
					" · pool ",
					usd(feed?.wager?.round?.poolUsd ?? 0),
					" · ",
					feed?.wager?.round?.bets ?? 0,
					" tickets",
					feed?.wager?.favorite?.pickName ? ` · favorite ${feed.wager.favorite.pickName} ${feed.wager.favorite.pct ?? 0}%` : "",
					feed?.wager?.demoTape ? " · SIM tape" : ""
				]
			}),
			fight ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 font-mono text-xs text-fg",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CallOutLabel, { className: "text-xs" }),
					" live · r",
					fight.round ?? 1,
					"/5 · ",
					fight.challenger?.name,
					" vs ",
					fight.target?.name,
					fight.hoursLeft != null ? ` · ~${fight.hoursLeft}h` : ""
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 font-mono text-xs text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CallOutLabel, { className: "text-xs" }), " · no live bout — paper sleeve waiting"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-3 space-y-1 font-mono text-[11px]",
				children: rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						i + 1,
						". ",
						r.name,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted",
							children: [" · ", r.kindLabel ?? ""]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: cn((r.official?.pnlUsd ?? 0) >= 0 ? "text-high" : "text-sell"),
						children: [btc(r.official?.btc), " BTC"]
					})]
				}, r.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-xs leading-relaxed text-muted",
				children: [
					"Education only. 100 percent at your own risk. Not financial advice. Seek a licensed professional.",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "px-1",
						children: "·"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeaderBoardLabel, { className: "text-xs" }),
					" is paper. This host never places Coinbase orders."
				]
			})
		]
	});
}
//#endregion
export { BowlLiveFeed as t };
