import { v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { T as TAB_DESK, n as APP_NAME } from "./brand-uNMMM_l-.mjs";
import { c as Shell, s as Panel } from "./shell-DoP-cDtR.mjs";
import { t as SeoCopy } from "./seo-copy-DJd0ETA0.mjs";
import { a as LEGAL_NFA, d as TERMS_UPDATED, i as LEGAL_HOWEY, l as TERMS_SECTIONS, u as TERMS_TITLE } from "./router-DhkYDt1q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/terms-ClHB_DAR.js
var import_jsx_runtime = require_jsx_runtime();
function TermsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoCopy, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-3xl px-4 py-8 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs tracking-[0.12em] text-oss uppercase",
				children: TERMS_TITLE
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-2xl font-bold tracking-tight text-medium",
				children: APP_NAME
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm leading-relaxed text-muted",
				children: [
					"Updated ",
					TERMS_UPDATED,
					". Using this website is agreement to these Terms."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "mt-6",
				kicker: "Disclaimer",
				title: "Read this first",
				kickerClass: "text-oss",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-muted",
					children: LEGAL_NFA
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm leading-relaxed text-muted",
					children: LEGAL_HOWEY
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 space-y-3",
				children: TERMS_SECTIONS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					id: s.id,
					kicker: "Terms",
					title: s.title,
					kickerClass: "text-oss",
					titleClass: "text-fg text-base",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-muted",
						children: s.body
					})
				}, s.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 font-mono text-xs text-oss",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/faq",
						className: "hover:underline",
						children: "FAQ"
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
var SplitComponent = TermsPage;
//#endregion
export { SplitComponent as component };
