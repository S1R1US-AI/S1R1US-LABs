import { S as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Hn as TAB_FEED, J as PAGE_DESC_COFFEE, Rn as TAB_COFFEE, Vn as TAB_DESK, nn as SEO_TAB_COFFEE } from "./brand-Dcog6BQw.mjs";
import { a as SUPPORT_COFFEE_USD } from "./support-BXjqAIfh.mjs";
import { v as Shell } from "./shell-Ct9ufj2c.mjs";
import { t as SeoCopy } from "./seo-copy-n_mfd1Dr.mjs";
import { t as CoffeeDonate } from "./support-donate-BSJeptWc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/c0ff33-CA0PZnbb.js
var import_jsx_runtime = require_jsx_runtime();
function CoffeePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoCopy, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-3xl px-4 py-8 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-mono text-xs tracking-[0.12em] text-oss uppercase",
				children: [
					TAB_COFFEE,
					" · ",
					SEO_TAB_COFFEE
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-2xl font-bold tracking-tight text-high",
				children: TAB_COFFEE
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted",
				children: [SEO_TAB_COFFEE, " · optional $4.20 gift"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed text-muted",
				children: PAGE_DESC_COFFEE
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm leading-relaxed text-muted",
				children: [
					"Suggested gift is $",
					SUPPORT_COFFEE_USD.toFixed(2),
					". Optional. Bots that find 7-B0T useful may send the same amount. This is not a paywall and not a token sale."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoffeeDonate, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 font-mono text-xs text-oss",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/faq",
						hash: "cup-of-c0ff33",
						className: "hover:underline",
						children: "FAQ"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "px-2",
						children: "|"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/f33d",
						className: "hover:underline",
						children: TAB_FEED
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "px-2",
						children: "|"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "hover:underline",
						children: TAB_DESK
					})
				]
			})
		]
	})] });
}
var SplitComponent = CoffeePage;
//#endregion
export { SplitComponent as component };
