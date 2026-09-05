import { o as __toESM } from "../_runtime.mjs";
import { H as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { O as TAB_FEED_NOW } from "./brand-iv-XZ0o2.mjs";
import { s as Panel } from "./shell-ORcVF3D4.mjs";
import { a as SUPPORT_USDC_EXPLORER, i as SUPPORT_USDC, n as SUPPORT_BTC, r as SUPPORT_BTC_EXPLORER, t as SUPPORT_BLURB } from "./support-DWxQ4XSQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/support-donate-BqLttmAb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
async function copyText(value) {
	try {
		await navigator.clipboard.writeText(value);
		return true;
	} catch {
		return false;
	}
}
function AddrRow({ label, value, href, payHref }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3 rounded-md border border-rule p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[11px] tracking-[0.12em] text-muted uppercase",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 break-all font-mono text-sm text-fg",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "inline-flex h-10 min-h-10 items-center rounded-md border border-high/50 bg-high/10 px-3 text-sm font-bold text-high hover:bg-high/16",
						href: payHref,
						children: TAB_FEED_NOW
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "inline-flex h-10 min-h-10 items-center rounded-md border border-rule px-3 text-sm hover:bg-fg/6",
						onClick: () => {
							copyText(value).then((ok) => {
								if (!ok) return;
								setCopied(true);
								window.setTimeout(() => setCopied(false), 1600);
							});
						},
						children: copied ? "Copied" : "Copy"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "inline-flex h-10 min-h-10 items-center rounded-md border border-rule px-3 text-sm hover:bg-fg/6",
						href,
						target: "_blank",
						rel: "noreferrer",
						children: "Explorer"
					})
				]
			})
		]
	});
}
function SupportDonate() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		id: "donate",
		className: "mt-4 scroll-mt-24",
		kicker: TAB_FEED_NOW,
		title: "Hosting & app wallets",
		kickerClass: "text-high",
		titleClass: "text-high",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-relaxed text-muted",
				children: SUPPORT_BLURB
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddrRow, {
				label: "Bitcoin (BTC)",
				value: SUPPORT_BTC,
				href: SUPPORT_BTC_EXPLORER,
				payHref: `bitcoin:${SUPPORT_BTC}`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddrRow, {
				label: "USDC · Ethereum ERC-20",
				value: SUPPORT_USDC,
				href: SUPPORT_USDC_EXPLORER,
				payHref: SUPPORT_USDC_EXPLORER
			})
		]
	});
}
//#endregion
export { SupportDonate as t };
