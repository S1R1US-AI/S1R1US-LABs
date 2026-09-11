import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, U as require_react, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as GO_LIVE_HEADLINE, o as GO_LIVE_START, r as GO_LIVE_DEADLINE_LABEL, s as GO_LIVE_STEPS, t as GO_LIVE } from "./go-live-D0FioTGl.mjs";
import { h as RainbowGodzillaText } from "./shell-H0c_rMBI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/go-live-panel-ynZql9Md.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var tone = {
	STARTED: "text-high",
	NEXT: "text-tab",
	QUEUED: "text-muted",
	LOCKED: "text-sell",
	DONE: "text-high",
	NOW: "text-tab"
};
function GoLivePanel() {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "min-w-0 max-w-full rounded-lg border border-rule bg-surface p-4 shadow-[var(--shadow-border)] sm:p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setOpen((o) => !o),
			"aria-expanded": open,
			className: "block w-full rounded-md text-left hover:bg-fg/4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs font-medium tracking-[0.08em] text-tab uppercase",
					children: ["Started ", GO_LIVE_START]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold tracking-tight text-medium sm:text-base",
					children: "Go-live path"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 font-mono text-[11px] text-sell",
					children: ["HARD DEADLINE ", GO_LIVE_DEADLINE_LABEL]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 font-mono text-[11px] text-oss",
					children: [
						"Full public list:",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/roadmap",
							className: "hover:underline",
							children: "OSS Roadmap"
						})
					]
				})
			]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs text-high",
					children: GO_LIVE_HEADLINE
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Baseline: N3W Web App Installation Build (new theme) DEPLOY #68. Users, system Admin, and iOS/Google copy-admin compete on SUP3R B0WL with a separate board token. Live Super Bowl stats run as-if-live until the deadline. Auto GM practice next. Auto AI agent access queued. Auto trade LOCKED — this host never creates Coinbase orders. Use is 100 percent at your own risk. Seek a licensed professional. Seek a licensed attorney before live trading. Copycats get a dashboard and a formula, not the BTC book."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-3 space-y-2",
					children: GO_LIVE.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `font-mono text-xs ${tone[p.status] ?? "text-muted"}`,
								children: p.status
							}),
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-xs leading-relaxed text-muted",
								children: p.goal
							})
						]
					}, p.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-xs font-medium tracking-[0.08em] text-tab uppercase",
					children: "Missing steps to launch live"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-2 space-y-2",
					children: GO_LIVE_STEPS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `font-mono text-xs ${tone[s.status] ?? "text-muted"}`,
								children: s.status
							}),
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-xs leading-relaxed text-muted",
								children: s.need
							})
						]
					}, s.id))
				})
			]
		}) : null]
	});
}
//#endregion
export { GoLivePanel as t };
