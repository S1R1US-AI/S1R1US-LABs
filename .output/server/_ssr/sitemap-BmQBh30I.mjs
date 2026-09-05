import { v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as LABS_NAME, n as APP_NAME, o as SEO_CANONICAL, p as TAB_DESK } from "./brand-Cp1yHL3f.mjs";
import { c as Shell, s as Panel } from "./shell-C5PjL4aH.mjs";
import { t as SeoCopy } from "./seo-copy-DSaMgCF_.mjs";
import { n as PUBLIC_PAGES } from "./public-nav-B3bA1CQD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sitemap-BmQBh30I.js
var import_jsx_runtime = require_jsx_runtime();
function SitemapPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoCopy, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-3xl px-4 py-8 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs tracking-[0.12em] text-oss uppercase",
				children: "Sitemap"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-2xl font-bold tracking-tight text-medium",
				children: APP_NAME
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm leading-relaxed text-muted",
				children: [
					"Public pages for ",
					LABS_NAME,
					". Machine sitemap:",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "text-oss hover:underline",
						href: "/sitemap.xml",
						children: "sitemap.xml"
					}),
					". Crawlers: ",
					SEO_CANONICAL
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				kicker: "Index",
				title: "Public URLs",
				className: "mt-6",
				kickerClass: "text-oss",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-3",
					children: PUBLIC_PAGES.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: p.path,
							className: "font-medium text-fg hover:underline",
							children: p.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs text-muted",
							children: p.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: p.hint
						})
					] }, p.path))
				})
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
var SplitComponent = SitemapPage;
//#endregion
export { SplitComponent as component };
