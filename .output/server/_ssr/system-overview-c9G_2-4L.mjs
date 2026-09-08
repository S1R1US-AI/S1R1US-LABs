import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { Or as TAB_LAB, Vn as TAB_DESK, r as APP_NAME } from "./brand-DK5ykudh.mjs";
import { A as ROADMAP_TOTAL, O as ROADMAP } from "./model-CdecK8oy.mjs";
import { a as RISK_RULES, n as CYCLE_ARCH, o as SYSTEM_REVIEWED, t as BOT_ROSTER } from "./prediction-markets-D4erl24v.mjs";
import { n as runBots, t as heliosCall } from "./signal-D-gcEirP.mjs";
import { r as useDeskTape } from "./tape-client-BE5FsWuO.mjs";
import { t as LAUNCH_BUILD } from "./build-BYnYcncG.mjs";
import { s as cn } from "./renew-password-B0B_EdkX.mjs";
import { m as Panel, s as GodzillaModeLabel } from "./shell-D2BEz0MM.mjs";
import { d as stanceClass } from "./helios-card-BO3f25-a.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/system-overview-c9G_2-4L.js
var import_jsx_runtime = require_jsx_runtime();
var MANDATE = [
	"1. Maximize bitcoin accumulation.",
	"2. Never sell bitcoin. Never short. Stops block add-on buys — they do not dump BTC.",
	"3. Minimize bitcoin loss. Never chase crowded longs.",
	"4. Continuous ops: honest error analysis, architecture and security review. Never green a failure without a verified fallback. Daily 07:30 America/New_York report in Admin Console for system and copy-admin. As-live sim auto-pauses 07:00 ET."
];
/** One object for the fund tape, Coin tab, and s1r1us.ai — rebuilt on every live tape pull. */
function systemView(snap, navUsd = 1e3) {
	const briefs = snap ? runBots(snap) : [];
	const call = snap ? heliosCall(snap, briefs, navUsd) : null;
	return {
		reviewed: SYSTEM_REVIEWED,
		launch: LAUNCH_BUILD,
		fetchedAt: snap?.fetchedAt ?? null,
		briefs,
		call,
		roster: BOT_ROSTER,
		stops: RISK_RULES,
		cycle: CYCLE_ARCH,
		roadmap: ROADMAP.map((m) => ({
			n: m.n,
			name: m.name,
			minUsd: m.minUsd,
			maxUsd: m.maxUsd
		})),
		roadmapTotal: ROADMAP_TOTAL
	};
}
function ago(iso) {
	if (!iso) return "waiting";
	const ms = Date.now() - new Date(iso).getTime();
	if (!Number.isFinite(ms) || ms < 0) return "live";
	const m = Math.round(ms / 6e4);
	if (m < 1) return "just now";
	if (m === 1) return "1 min ago";
	return `${m} min ago`;
}
function SystemOverview({ showRoadmap = false }) {
	const { snap } = useDeskTape();
	const view = systemView(snap);
	const six = view.roster.filter((b) => b.id !== "helios");
	const helios = view.roster.find((b) => b.id === "helios");
	const stops = view.stops.filter((r) => [
		"clip",
		"stop",
		"short",
		"live"
	].includes(r.id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		className: "mt-4",
		kicker: "7-B0T H3DGE FUND",
		title: `${APP_NAME} system logic`,
		kickerClass: "text-high",
		titleClass: "text-high",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					helios?.name ?? "S1R1U$ Analyst",
					" is the overseer. Bots 1–6 vote orthogonal lanes. Two agreeing lanes are required for HIGH conviction. SuperGrok is the operator Ask Grok feed. Visitors use BYO compute. Tape paints in two beats — core (",
					view.cycle.coreMs / 1e3,
					"s: price, RSI, F&G, leverage, Asia, ETF flow) then fill (holders, news, filings, EM, macro). Same roster as ",
					TAB_DESK,
					". ",
					TAB_LAB,
					" overlays that tape. ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GodzillaModeLabel, {}),
					" is an isolated sleeve (practice for all, Live admin-only) and does not vote bots 1–7. This block rebuilds on every 5-minute pull."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 font-mono text-[11px] text-muted",
				children: [
					"logic ",
					view.reviewed,
					" · ",
					view.launch,
					" · ",
					view.cycle.name,
					" · tape ",
					ago(view.fetchedAt),
					showRoadmap ? ` · admin roadmap ${view.roadmap.length} steps` : ""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-3 space-y-1.5 text-sm text-fg",
				children: MANDATE.map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-xs text-muted",
						children: [i + 1, "."]
					}),
					" ",
					line
				] }, line))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-4 divide-y divide-rule text-sm",
				children: [six.map((b, i) => {
					const live = view.briefs.find((x) => x.id === b.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-baseline gap-3 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-4 shrink-0 font-mono text-xs text-muted",
								children: i + 1
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-fg",
									children: live?.name ?? b.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mt-0.5 block text-xs text-muted",
									children: [
										b.layer,
										" · ",
										live?.summary ?? b.feed
									]
								})]
							}),
							live ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("shrink-0 font-mono text-xs uppercase", stanceClass(live.stance)),
								children: live.stance
							}) : null
						]
					}, b.id);
				}), helios ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-baseline gap-3 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-4 shrink-0 font-mono text-xs text-muted",
							children: "7"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-high",
								children: helios.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-0.5 block text-xs text-muted",
								children: view.call ? `${view.call.stance} ${view.call.conviction} · ${view.call.brief}` : helios.feed
							})]
						}),
						view.call ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("shrink-0 font-mono text-xs uppercase", stanceClass(view.call.stance)),
							children: view.call.stance
						}) : null
					]
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-1 text-xs text-muted",
				children: stops.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-fg",
						children: [r.label, "."]
					}),
					" ",
					r.value
				] }, r.id))
			})
		]
	});
}
//#endregion
export { SystemOverview as n, MANDATE as t };
