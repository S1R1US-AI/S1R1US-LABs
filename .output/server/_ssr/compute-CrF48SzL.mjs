import { v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { K as SEO_TAB_COMPUTE, L as PAID_SERVICES, at as TAB_COMPUTE } from "./brand-BKM5q_W_.mjs";
import { s as Shell } from "./shell-DL0EAAfV.mjs";
import { t as GoLivePanel } from "./go-live-panel-D8jQ6sMe.mjs";
import { t as SeoCopy } from "./seo-copy-DuTtbdcl.mjs";
import { t as AskGrokPanel } from "./ask-grok-panel-CyHm_ndS.mjs";
import { s as FEED_PLANS } from "./router-Clczj6X9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/compute-CrF48SzL.js
var import_jsx_runtime = require_jsx_runtime();
function ComputePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoCopy, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-3xl px-4 py-8 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-mono text-xs tracking-[0.12em] text-oss uppercase",
				children: [
					TAB_COMPUTE,
					" · ",
					SEO_TAB_COMPUTE
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-2xl font-bold tracking-tight text-medium",
				children: TAB_COMPUTE
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed text-muted",
				children: PAID_SERVICES
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoLivePanel, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AskGrokPanel, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 rounded-lg border border-rule bg-surface p-4 sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-[0.08em] text-muted uppercase",
						children: "Bot 7 HTTP SaaS"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 text-base font-semibold text-fg",
						children: "Pay for JSON — not conviction"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: [
							"Public GET /api/agent/call is free and rate-limited (poll 300s). A hashed key in BOT7_FEED_KEY_HASHES raises the cap. Same Bot 7 call. No extra HIGH. No BTC share. No token. Spec:",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "/api/agent/keys",
								className: "text-tab hover:underline",
								children: "/api/agent/keys"
							}),
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-1 font-mono text-xs text-muted",
						children: FEED_PLANS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							p.id,
							" · $",
							p.usdMonth,
							"/mo · poll ",
							p.pollSec,
							"s — ",
							p.note
						] }, p.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 rounded-lg border border-rule bg-surface p-4 sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-[0.08em] text-muted uppercase",
						children: "iOS / Play"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 text-base font-semibold text-fg",
						children: "Onboard compute"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: [
							"Future F33D apps keep your xAI / Grok key in the device keychain. They GET Bot 7 JSON from this host and run Ask Grok on-device. This host never receives spend keys. Gifts for those apps stay on",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/f33d",
								className: "text-tab hover:underline",
								children: "F33D H0ST1Ng"
							}),
							"."
						]
					})
				]
			})
		]
	})] });
}
//#endregion
export { ComputePage as component };
