import { S as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Fr as TAB_QUANT_FLEX, Tr as TAB_KING_QUANT, mn as SEO_TAB_KING_QUANT } from "./brand-DK5ykudh.mjs";
import { c as QUANT_FLEX_HEADLINE, l as QUANT_FLEX_INVITE, u as QUANT_FLEX_TITLES } from "./mandate-DWFG_LcU.mjs";
import { h as RainbowGodzillaText, m as Panel } from "./shell-BI4PWBcX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/quant-flex-welcome-Dsa8DJ6k.js
var import_jsx_runtime = require_jsx_runtime();
function QuantFlexWelcome({ compact = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		className: compact ? "mt-3" : "mt-4",
		kicker: TAB_QUANT_FLEX,
		title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "gm-rainbow",
			children: [
				TAB_KING_QUANT,
				" · ",
				SEO_TAB_KING_QUANT
			]
		}),
		kickerClass: "gm-rainbow",
		titleClass: "faq-title",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-medium leading-relaxed text-fg",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RainbowGodzillaText, { text: QUANT_FLEX_HEADLINE })
		}), compact ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-relaxed text-fg",
				children: QUANT_FLEX_TITLES
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-relaxed text-muted",
				children: QUANT_FLEX_INVITE
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 font-mono text-xs text-oss",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/board",
						className: "hover:underline",
						children: "L3AD3R B0ARD"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "px-2",
						children: "|"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/c0ut",
						className: "hover:underline",
						children: "C@LL 0UT welcome"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "px-2",
						children: "|"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/w0rld",
						className: "hover:underline",
						children: "W0rLd CUP"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "px-2",
						children: "|"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/compute",
						className: "hover:underline",
						children: "BYO C0MPUT3"
					})
				]
			})
		] })]
	});
}
//#endregion
export { QuantFlexWelcome as t };
