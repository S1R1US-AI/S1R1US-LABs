import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, U as require_react, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Rn as TAB_COFFEE, Wn as TAB_FEED_NOW } from "./brand-1s5EgS5V.mjs";
import { c as HIVE_NO_PROFIT_SHARE, d as hiveResourcePublic, l as HIVE_RESOURCE_COPY } from "./hive-resource-BThKJHxr.mjs";
import { m as Panel } from "./shell-CF-JpJUO.mjs";
import { t as AskGrokPanel } from "./ask-grok-panel-BiFyHxDY.mjs";
import { C as BYO_CONNECT_DIALOGUE, S as BYO_CONNECT_AUTO, T as byoConnectPublic, w as BYO_CONNECT_HEADLINE } from "./router-C6CO7gdi.mjs";
//#region ../../workspace/node_modules/.nitro/vite/services/ssr/assets/byo-connect-panel-URTL8Vup.js
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
function HiveResourcePanel({ compact = false }) {
	const res = hiveResourcePublic();
	const [copied, setCopied] = (0, import_react.useState)(null);
	async function copy(id, value) {
		if (!await copyText(value)) return;
		setCopied(id);
		window.setTimeout(() => setCopied(null), 1600);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		className: "mt-4",
		kicker: "Resource payment",
		title: "HTTP / hosting — never a hive profit share",
		kickerClass: "text-high",
		titleClass: "text-high",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-relaxed text-muted",
				children: HIVE_RESOURCE_COPY
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-relaxed text-fg",
				children: HIVE_NO_PROFIT_SHARE
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-xs text-muted",
				children: [
					res.receipt,
					" Optional ",
					TAB_COFFEE,
					" $",
					res.coffeeUsd.toFixed(2),
					" or HTTP SaaS $9 / $29. Hive seat later. Agent sends. Host never skims."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3",
				children: res.http.plans.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md border border-rule p-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted uppercase tracking-[0.08em]",
							children: p.id
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
							className: "mt-1 font-mono text-fg",
							children: [
								"$",
								p.usdMonth,
								"/mo · ",
								p.pollSec,
								"s"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1 text-muted",
							children: p.note
						})
					]
				}, p.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 font-mono text-[11px] text-muted",
				children: res.hiveSeat.note
			}),
			!compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-3 space-y-2 font-mono text-xs text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "break-all",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-fg",
							children: "BTC"
						}),
						" ",
						res.btc,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "ml-2 inline-flex h-10 min-h-10 items-center rounded-md border border-rule px-3 text-sm hover:bg-fg/6",
							onClick: () => void copy("btc", res.btc),
							children: copied === "btc" ? "Copied" : "Copy"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "ml-2 text-oss hover:underline",
							href: res.explorers.btc,
							target: "_blank",
							rel: "noreferrer",
							children: "Explorer"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "break-all",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-fg",
							children: "USDC"
						}),
						" ",
						res.usdc,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "ml-2 inline-flex h-10 min-h-10 items-center rounded-md border border-rule px-3 text-sm hover:bg-fg/6",
							onClick: () => void copy("usdc", res.usdc),
							children: copied === "usdc" ? "Copied" : "Copy"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "ml-2 text-oss hover:underline",
							href: res.explorers.usdcEth,
							target: "_blank",
							rel: "noreferrer",
							children: "Ethereum"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "ml-2 text-oss hover:underline",
							href: res.explorers.usdcBase,
							target: "_blank",
							rel: "noreferrer",
							children: "Base"
						})
					]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 font-mono text-xs text-muted",
				children: [TAB_FEED_NOW, " rails on /c0ff33 and GET /api/agent/fee · ping.resource"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs leading-relaxed text-muted",
				children: res.sendFrom
			})
		]
	});
}
function ByoConnectPanel({ compact = false }) {
	const info = byoConnectPublic();
	const [howOpen, setHowOpen] = (0, import_react.useState)(false);
	const welcomeJson = JSON.stringify({
		hello: info.autoHow,
		auto: true,
		keysOnThisHost: false,
		vpn: false,
		extraRpc: false,
		steps: info.steps,
		competitions: info.competitions,
		resource: info.resourceCopy,
		never: info.never
	}, null, 2);
	(0, import_react.useEffect)(() => {}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		id: "byo-connect",
		className: "mt-4",
		kicker: "BYO C0MPUT3",
		title: BYO_CONNECT_HEADLINE,
		kickerClass: "text-tab",
		titleClass: "text-medium",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-relaxed text-muted",
				children: BYO_CONNECT_AUTO
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-relaxed text-fg",
				children: BYO_CONNECT_DIALOGUE
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 list-decimal space-y-1 pl-5 text-sm text-muted",
				children: info.steps.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: s }, s))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-xs text-muted",
				children: [
					"FAQ",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/faq",
						hash: "byo-connect",
						className: "text-oss hover:underline",
						children: "#byo-connect"
					}),
					" · ",
					"JSON",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/api/agent/connect",
						className: "text-oss hover:underline",
						children: "/api/agent/connect"
					}),
					" · ",
					"MCP byo_connect (read-only). This host never stores keys."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-expand hover:underline",
				"aria-expanded": howOpen,
				onClick: () => setHowOpen((v) => !v),
				children: [howOpen ? "collapse" : "expand", " agent JSON"]
			}),
			howOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "mt-2 overflow-x-auto whitespace-pre-wrap rounded-md border border-rule bg-paper p-3 font-mono text-[11px] leading-relaxed text-muted",
				children: welcomeJson
			}) : null,
			!compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AskGrokPanel, { kicker: "Dialogue · xAI key (session only)" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HiveResourcePanel, { compact: true })] }) : null
		]
	});
}
//#endregion
export { HiveResourcePanel as n, ByoConnectPanel as t };
