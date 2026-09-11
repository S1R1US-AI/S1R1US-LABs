import { S as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Vn as TAB_DESK, r as APP_NAME } from "./brand-DGWej0Mj.mjs";
import { m as GITHUB_URL } from "./model-DHQh0XOO.mjs";
import { a as LEGAL_OSS, c as PRIVACY_PATH, g as TERMS_UPDATED, h as TERMS_TITLE, i as LEGAL_NOT_ATTORNEY, m as TERMS_SECTIONS, n as LEGAL_HOWEY, o as LEGAL_OWN_RISK, r as LEGAL_NFA, t as LEGAL_BOTS, u as PRIVACY_TITLE } from "./legal-Crl7Zn4f.mjs";
import { S as Shell, _ as Panel } from "./shell-BehmArVu.mjs";
import { t as SeoCopy } from "./seo-copy-CLuVRRvj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/terms-CM1LGEnD.js
var import_jsx_runtime = require_jsx_runtime();
function TermsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoCopy, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-3xl px-4 py-8 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "legal-purple font-mono text-xs tracking-[0.12em] uppercase",
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
				kickerClass: "legal-purple",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-muted",
						children: LEGAL_NFA
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted",
						children: LEGAL_OWN_RISK
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted",
						children: LEGAL_NOT_ATTORNEY
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted",
						children: LEGAL_HOWEY
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted",
						children: LEGAL_BOTS
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted",
						children: LEGAL_OSS
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 space-y-3",
				children: TERMS_SECTIONS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					id: s.id,
					kicker: "Terms",
					title: s.title,
					kickerClass: "legal-purple",
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
						to: PRIVACY_PATH,
						className: "legal-purple hover:underline",
						children: PRIVACY_TITLE
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "px-2",
						children: "|"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/faq",
						className: "faq-kicker hover:underline",
						children: "FAQ"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "px-2",
						children: "|"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: GITHUB_URL,
						className: "hover:underline",
						target: "_blank",
						rel: "noreferrer",
						children: "Open source"
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
