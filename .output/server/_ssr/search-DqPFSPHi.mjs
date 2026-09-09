import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, U as require_react, b as useSearch } from "../_libs/@tanstack/react-router+[...].mjs";
import { Nt as PAGE_TITLE_SEARCH, lt as PAGE_DESC_SEARCH } from "./brand-1s5EgS5V.mjs";
import { m as Panel, v as Shell } from "./shell-ClCx_L5Z.mjs";
import { t as SeoCopy } from "./seo-copy-CWb7FcyH.mjs";
import { A as OFFICIAL_PROPERTIES, j as PUBLIC_PAGES } from "./router-BF2TKr1D.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-DqPFSPHi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SearchPage() {
	const q = String(useSearch({ strict: false }).q ?? "").trim();
	const needle = q.toLowerCase();
	const hits = (0, import_react.useMemo)(() => {
		return {
			pages: PUBLIC_PAGES.filter((p) => {
				if (!needle) return true;
				return `${p.label} ${p.title} ${p.hint} ${p.path}`.toLowerCase().includes(needle);
			}),
			props: OFFICIAL_PROPERTIES.filter((p) => {
				if (!needle) return p.live;
				return `${p.name} ${p.label} ${p.url} ${p.hint}`.toLowerCase().includes(needle);
			})
		};
	}, [needle]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoCopy, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-3xl px-4 py-8 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs tracking-[0.12em] text-oss uppercase",
				children: "Search"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-2xl font-bold tracking-tight text-medium",
				children: PAGE_TITLE_SEARCH
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: PAGE_DESC_SEARCH
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				method: "get",
				action: "/search",
				className: "mt-5 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					name: "q",
					defaultValue: q,
					placeholder: "Search public pages",
					className: "h-10 min-w-0 flex-1 rounded-md border border-rule bg-surface px-3 text-sm text-fg",
					"aria-label": "Search s1r1us.ai"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					className: "h-10 rounded-md border border-rule px-3 text-sm text-fg hover:bg-fg/6",
					children: "Search"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				kicker: "Pages",
				title: q ? `Results for “${q}”` : "Public index",
				className: "mt-6",
				kickerClass: "text-oss",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-3",
					children: hits.pages.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: p.path,
						className: "font-medium text-fg hover:underline",
						children: p.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-0.5 block text-xs text-muted",
						children: p.hint
					})] }, p.path))
				}), hits.pages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "No public pages matched."
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				kicker: "Desks",
				title: "Official properties",
				className: "mt-4",
				kickerClass: "text-oss",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-3",
					children: hits.props.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: p.url,
						className: "font-medium text-oss hover:underline",
						target: p.kind === "site" ? void 0 : "_blank",
						rel: "noreferrer",
						children: [
							p.name,
							" · ",
							p.label,
							" ",
							p.live ? "" : "(reserved)"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-0.5 block text-xs text-muted",
						children: p.hint
					})] }, p.url))
				})
			})
		]
	})] });
}
var SplitComponent = SearchPage;
//#endregion
export { SplitComponent as component };
