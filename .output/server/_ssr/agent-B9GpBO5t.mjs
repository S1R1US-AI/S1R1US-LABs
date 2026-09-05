import { o as __toESM } from "../_runtime.mjs";
import { H as require_react, v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { O as TAB_DESK, n as APP_NAME, r as BOT7_NAME, v as SEO_CANONICAL } from "./brand-CPj0wirD.mjs";
import { n as STARTING_CASH } from "./store-oEyIFO9k.mjs";
import { n as Button } from "./renew-password-ZNGrwGFr.mjs";
import { h as Copy } from "../_libs/lucide-react.mjs";
import { c as Shell, s as Panel } from "./shell-BZS3yxGq.mjs";
import { n as CallWords } from "./helios-card-BxjEYLBI.mjs";
import { t as SeoCopy } from "./seo-copy-DFAs0kfj.mjs";
import { a as AGENT_INDEX_PATH, c as COINBASE_AGENTS_MCP, i as AGENT_FEED_PATH, o as AGENT_PING_PATH, s as COINBASE_AGENTS_DOCS } from "./router-Kg8sFdej.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/agent-B9GpBO5t.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FEED_URL = `${SEO_CANONICAL.replace(/\/$/, "")}${AGENT_FEED_PATH}`;
function AgentFeedPage() {
	const [feed, setFeed] = (0, import_react.useState)(null);
	const [err, setErr] = (0, import_react.useState)(null);
	const [copied, setCopied] = (0, import_react.useState)(null);
	const [pong, setPong] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let live = true;
		fetch(AGENT_FEED_PATH, { headers: { accept: "application/json" } }).then(async (r) => {
			const data = await r.json();
			if (!live) return;
			if (!r.ok || !("ok" in data) || data.ok !== true) {
				setErr(data.error ?? "Feed unavailable");
				return;
			}
			setFeed(data);
		}).catch(() => {
			if (live) setErr("Feed unavailable");
		});
		return () => {
			live = false;
		};
	}, []);
	async function copy(label, text) {
		await navigator.clipboard.writeText(text);
		setCopied(label);
		window.setTimeout(() => setCopied(null), 1400);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoCopy, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-3xl px-4 py-8 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs tracking-[0.12em] text-oss uppercase",
				children: "Agent feed"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-2xl font-bold tracking-tight text-medium",
				children: APP_NAME
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm leading-relaxed text-muted",
				children: [
					"Proof of concept — not LIVE. Read-only ",
					BOT7_NAME,
					" call for other AI agents. Conviction, stance, clip, and tape. This host never places Coinbase orders and never holds your keys. Education only — not financial advice."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "mt-6",
				kicker: "PoC",
				title: "Not LIVE",
				kickerClass: "text-sell",
				titleClass: "text-sell",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm leading-relaxed text-muted",
						children: [
							"Agents may ping and read. They cannot trade here. Connection test is flagged on the daily morning report.",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/faq",
								hash: "calling-all-bots",
								className: "text-sell hover:underline",
								children: "Call1ng All B0Ts FAQ"
							}),
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => {
								fetch(AGENT_PING_PATH).then((r) => r.json()).then((d) => {
									setPong(d.pong ? d.message ?? "pong" : "ping failed");
								}).catch(() => setPong("ping failed"));
							},
							"aria-label": "Test agent connection",
							children: "Test connection"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: AGENT_PING_PATH,
							className: "inline-flex h-10 min-h-10 items-center rounded-md border border-rule bg-surface px-3 text-sm font-medium hover:bg-fg/6",
							children: "GET ping"
						})]
					}),
					pong ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-mono text-xs text-tab",
						children: pong
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "mt-6",
				kicker: "Bot 7",
				title: "Live call",
				kickerClass: "text-oss",
				children: [err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-down",
					children: err
				}) : null, feed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CallWords, {
						call: {
							conviction: feed.call.conviction,
							stance: feed.call.stance
						},
						className: "text-2xl font-semibold tracking-tight"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 font-mono text-xs text-muted",
						children: [
							"clip $",
							feed.call.clipUsd.toLocaleString("en-US"),
							" · nav $",
							feed.navUsd.toLocaleString("en-US"),
							" ·",
							" ",
							feed.tape.btcUsd != null ? `BTC ${feed.tape.btcUsd.toLocaleString("en-US", { maximumFractionDigits: 0 })}` : "BTC —"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted",
						children: feed.disclaimer
					})
				] }) : !err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Pulling Bot 7…"
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "mt-4",
				kicker: "GET",
				title: "JSON feed",
				kickerClass: "text-oss",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs break-all text-tab",
						children: FEED_URL
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted",
						children: [
							"Optional ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-fg",
								children: ["?nav=", STARTING_CASH]
							}),
							" sizes the clip to your USD book. It does not trade."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "mt-3 overflow-x-auto rounded-md border border-rule bg-black px-4 py-3 font-mono text-[12px] leading-relaxed text-muted",
						children: `curl -s ${FEED_URL}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => void copy("url", FEED_URL),
								"aria-label": "Copy feed URL",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), copied === "url" ? "Copied" : "Copy URL"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: AGENT_FEED_PATH,
								className: "inline-flex h-10 min-h-10 items-center rounded-md border border-rule bg-surface px-3 text-sm font-medium hover:bg-fg/6",
								children: "Open JSON"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: AGENT_INDEX_PATH,
								className: "inline-flex h-10 min-h-10 items-center rounded-md border border-rule bg-surface px-3 text-sm font-medium hover:bg-fg/6",
								children: "Catalog"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "mt-4",
				kicker: "Coinbase",
				title: "You run the preview",
				kickerClass: "text-oss",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm leading-relaxed text-muted",
						children: [
							"Signal only. Run this on ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-fg",
								children: "your"
							}),
							" Coinbase for Agents. Keys stay on your machine. Never paste a secret here."
						]
					}),
					feed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "mt-3 overflow-x-auto rounded-md border border-rule bg-black px-4 py-3 font-mono text-[12px] leading-relaxed text-high",
						children: feed.coinbase.cli
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "mt-3",
						onClick: () => void copy("cli", feed.coinbase.cli),
						"aria-label": "Copy preview CLI",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), copied === "cli" ? "Copied" : "Copy preview CLI"]
					})] }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-4 space-y-2 text-sm text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								"MCP:",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: COINBASE_AGENTS_MCP,
									className: "text-tab hover:underline",
									target: "_blank",
									rel: "noreferrer",
									children: COINBASE_AGENTS_MCP
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								"Docs:",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: COINBASE_AGENTS_DOCS,
									className: "text-tab hover:underline",
									target: "_blank",
									rel: "noreferrer",
									children: COINBASE_AGENTS_DOCS
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								"Always ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-fg",
									children: "--dry-run"
								}),
								" first. This site never sends ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono",
									children: "orders create"
								}),
								"."
							] })
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 font-mono text-xs text-oss",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "hover:underline",
						children: TAB_DESK
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "px-2",
						children: "|"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/faq",
						className: "hover:underline",
						children: "FAQ"
					})
				]
			})
		]
	})] });
}
var SplitComponent = AgentFeedPage;
//#endregion
export { SplitComponent as component };
