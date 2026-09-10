import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as cn } from "./renew-password-Byk1mW0v.mjs";
import { m as Panel } from "./shell-CsOEYJtj.mjs";
import { d as stanceClass } from "./helios-card--GP53itI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/live-tracks-B25MeZCG.js
var import_jsx_runtime = require_jsx_runtime();
var ORDER = [
	"filings",
	"earnings",
	"sector",
	"sentiment",
	"rotation",
	"coordinator"
];
function LiveTracks({ briefs, kicker = "B0TS 1–6", title = "Live Hedge Fund analysts", note = "Visual summary of bots 1–6. Each stance is an independent lane 7-B0T reads." }) {
	const six = ORDER.map((id) => briefs.find((b) => b.id === id)).filter(Boolean);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		className: "mt-4",
		kicker,
		title,
		kickerClass: "bots-1-6",
		titleClass: "text-medium",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-3 text-xs text-muted",
			children: note
		}), six.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
			children: six.map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-md border border-rule bg-bg/60 p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mr-1.5 font-mono text-[11px] text-muted",
								children: i + 1
							}), b.name]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("shrink-0 font-mono text-[11px] uppercase", stanceClass(b.stance)),
							children: b.stance
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[11px] tracking-[0.08em] text-muted uppercase",
						children: b.layer
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("inline-block size-1.5 rounded-full", b.status === "live" ? "bg-high" : "bg-muted") }),
							b.status,
							" · ",
							b.sources.join(" · ")
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed",
						children: b.summary
					}),
					b.bullets[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 truncate text-xs text-muted",
						children: b.bullets[0]
					}) : null
				]
			}, b.id))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Waiting for the first cycle from bots 1–6…"
		})]
	});
}
//#endregion
export { LiveTracks as t };
