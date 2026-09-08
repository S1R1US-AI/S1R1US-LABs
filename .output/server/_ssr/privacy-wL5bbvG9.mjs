import { S as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Vn as TAB_DESK, r as APP_NAME } from "./brand-DK5ykudh.mjs";
import { d as PRIVACY_TITLE, f as PRIVACY_UPDATED, g as TERMS_TITLE, m as TERMS_PATH, t as LEGAL_BOTS, u as PRIVACY_SECTIONS } from "./legal-DRDieW2L.mjs";
import { m as Panel, v as Shell } from "./shell-L1C19m-U.mjs";
import { t as SeoCopy } from "./seo-copy-BHvqtygl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/privacy-wL5bbvG9.js
var import_jsx_runtime = require_jsx_runtime();
function PrivacyPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoCopy, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-3xl px-4 py-8 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "legal-purple font-mono text-xs tracking-[0.12em] uppercase",
				children: PRIVACY_TITLE
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-2xl font-bold tracking-tight text-medium",
				children: APP_NAME
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm leading-relaxed text-muted",
				children: [
					"Updated ",
					PRIVACY_UPDATED,
					". Bots may not retain system information. Reverse engineering without S1R1US.ai authorization is logged and prosecuted. Use is 100 percent at your own risk. Seek a licensed professional and a licensed attorney before live trading. Open source: github.com/S1R1US-AI/S1R1US-LABs."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				className: "mt-6",
				kicker: "Privacy",
				title: "Bots and source",
				kickerClass: "legal-purple",
				titleClass: "legal-purple",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-muted",
					children: LEGAL_BOTS
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 space-y-3",
				children: PRIVACY_SECTIONS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					id: s.id,
					kicker: "Privacy",
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
						to: TERMS_PATH,
						className: "legal-purple hover:underline",
						children: TERMS_TITLE
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
var SplitComponent = PrivacyPage;
//#endregion
export { SplitComponent as component };
