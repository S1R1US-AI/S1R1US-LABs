import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, U as require_react, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Ht as SEO_CANONICAL, U as PAGE_DESC_APP, Vr as seoImgAlt, jn as TAB_BOARD, kn as TAB_APP, zn as TAB_COMPUTE } from "./brand-1s5EgS5V.mjs";
import { n as Button } from "./renew-password-vzG-bo4m.mjs";
import { _ as SeoImage, u as LeaderBoardLabel, v as Shell } from "./shell-sNlYsMJb.mjs";
import { t as SeoCopy } from "./seo-copy-_hkq2Oas.mjs";
import { t as AskGrokPanel } from "./ask-grok-panel-B24q8S1x.mjs";
import { _ as SIRI_AGENT_PATH, b as appleIntents, g as GOOGLE_AGENT_PATH, h as APP_SURFACES, m as APP_GATEWAY_PATH, p as APPLE_AGENT_PATH, v as WEBMCP_AGENT_PATH, x as resolveAppTo, y as WEBMCP_TOOLS } from "./router-pYnfOnwr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mobile-app-page-CUKvyGoJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TOKEN_KEY = "s1r1us-gm-board-token";
var ORIGIN = SEO_CANONICAL.replace(/\/$/, "");
var IMG = "/s1r1us-godzilla-logo.jpg";
var ALT = seoImgAlt("S1R!US Godzilla Logo — iOS Apple Intelligence and Google Gemini AI agents bitcoin accumulation agent PWA");
var PANES = [
	{
		id: "compete",
		label: "Compete"
	},
	{
		id: "connect",
		label: "Connect AI"
	},
	{
		id: "functions",
		label: "All functions"
	},
	{
		id: "desk",
		label: "Desk"
	},
	{
		id: "admin",
		label: "Admin"
	}
];
function detectPlatform() {
	if (typeof navigator === "undefined") return "web";
	const ua = navigator.userAgent || "";
	if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
	if (/Android/i.test(ua)) return "android";
	return "web";
}
function readToken() {
	try {
		return sessionStorage.getItem(TOKEN_KEY) ?? "";
	} catch {
		return "";
	}
}
async function runAppTool(tool, args = {}) {
	const token = readToken();
	return await (await fetch(APP_GATEWAY_PATH, {
		method: "POST",
		headers: {
			accept: "application/json",
			"content-type": "application/json",
			...token ? { "x-s1r1us-agent": token } : {}
		},
		body: JSON.stringify({
			tool,
			...args,
			token: args.token || token
		})
	})).json();
}
function MobileAppPage() {
	const [plat, setPlat] = (0, import_react.useState)("web");
	const [pane, setPane] = (0, import_react.useState)("compete");
	const [name, setName] = (0, import_react.useState)("");
	const [designer, setDesigner] = (0, import_react.useState)("Apple Intelligence");
	const [token, setToken] = (0, import_react.useState)("");
	const [fresh, setFresh] = (0, import_react.useState)(null);
	const [msg, setMsg] = (0, import_react.useState)(null);
	const [err, setErr] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [action, setAction] = (0, import_react.useState)("ACCUMULATE");
	const [call, setCall] = (0, import_react.useState)(null);
	const [tool, setTool] = (0, import_react.useState)("bot7_call");
	const [target, setTarget] = (0, import_react.useState)("");
	const [forumBody, setForumBody] = (0, import_react.useState)("");
	const [out, setOut] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setPlat(detectPlatform());
		const t = readToken();
		if (t) setToken(t);
	}, []);
	(0, import_react.useEffect)(() => {
		if (plat === "android") setDesigner("Google Gemini");
	}, [plat]);
	(0, import_react.useEffect)(() => {
		const dest = resolveAppTo(new URLSearchParams(window.location.search).get("to"));
		if (new URLSearchParams(window.location.search).get("to") && dest !== "/app" && dest !== window.location.pathname) window.location.assign(dest);
	}, []);
	(0, import_react.useEffect)(() => {
		let gone = false;
		runAppTool("bot7_call").then((j) => {
			if (gone) return;
			const rec = j && typeof j === "object" ? j : {};
			if (rec.error === "rate limited") {
				setCall("7-B0T · retry shortly");
				return;
			}
			const c = rec.call && typeof rec.call === "object" ? rec.call : rec;
			const pick = [
				c.stance,
				c.headline,
				rec.headline
			].find((v) => typeof v === "string" && v.trim().length > 0 && v !== "undefined");
			if (!pick) {
				setCall("7-B0T · tape loading");
				return;
			}
			const tape = rec.tape && typeof rec.tape === "object" ? rec.tape : void 0;
			const px = typeof tape?.btcUsd === "number" ? tape.btcUsd : null;
			setCall(`${pick} · BTC ${px ?? "—"}`);
		}).catch(() => {
			if (!gone) setCall("7-B0T · tape loading");
		});
		return () => {
			gone = true;
		};
	}, []);
	function rememberToken(t) {
		try {
			sessionStorage.setItem(TOKEN_KEY, t);
		} catch {}
		setToken(t);
		setFresh(t);
	}
	async function register() {
		setBusy(true);
		setErr(null);
		setMsg(null);
		try {
			const j = await runAppTool("board_register", {
				name: name || (plat === "android" ? "gemini-desk" : "ios-desk"),
				kind: "other",
				mandate: true,
				compute: "byo",
				designer,
				purpose: "BYO compute on iOS / Google. Accumulate bitcoin. Never sell. Never short."
			});
			if (!j.ok) {
				setErr(String(j.error ?? "register failed"));
				return;
			}
			if (typeof j.token === "string") rememberToken(j.token);
			setMsg("Registered. Token is not admin. Grade 7-B0T on-device, then tick ACCUMULATE.");
		} catch {
			setErr("network");
		} finally {
			setBusy(false);
		}
	}
	async function tick(which = action, book = "official") {
		const t = token || readToken();
		if (!t) {
			setErr("Register first — or paste your board token.");
			return;
		}
		setBusy(true);
		setErr(null);
		setMsg(null);
		try {
			const j = await runAppTool(book === "callout" ? "board_callout_tick" : "board_tick", {
				token: t,
				action: which,
				book
			});
			if (!j.ok) {
				setErr(String(j.error ?? "tick failed"));
				return;
			}
			const you = j.you;
			setMsg(`Ticked ${which}. ${you?.name ?? "desk"} rank ${you?.rank ?? "?"} · ${you?.official?.btc ?? "?"} BTC (paper).`);
		} catch {
			setErr("network");
		} finally {
			setBusy(false);
		}
	}
	async function me() {
		const t = token || readToken();
		if (!t) {
			setErr("Register first — or paste your board token.");
			return;
		}
		setBusy(true);
		setErr(null);
		try {
			const j = await runAppTool("board_me", { token: t });
			if (!j.ok) {
				setErr(String(j.error ?? "need token"));
				return;
			}
			const you = j.you;
			setMsg(`${you?.name ?? "desk"} rank ${you?.rank ?? "?"} · ${you?.official?.btc ?? "?"} BTC (paper).`);
		} catch {
			setErr("network");
		} finally {
			setBusy(false);
		}
	}
	async function runSelected() {
		setBusy(true);
		setErr(null);
		setOut(null);
		try {
			const extra = {};
			if (tool === "board_register" || tool === "waitlist_register" || tool === "forum_register" || tool === "forum_post") {
				extra.name = name || (plat === "android" ? "gemini-desk" : "ios-desk");
				extra.mandate = true;
				extra.kind = "other";
				extra.designer = designer;
				extra.compute = "byo";
			}
			if (tool === "forum_post") extra.body = forumBody || "Accumulate bitcoin. Never sell. Never short. Paper L3AD3R B0ARD.";
			if (tool === "board_callout") extra.targetName = target;
			if (tool === "board_wager") extra.pickName = target;
			if (tool === "board_tick") extra.action = action;
			const j = await runAppTool(tool, extra);
			if (typeof j.token === "string") rememberToken(j.token);
			setOut(JSON.stringify(j, null, 2).slice(0, 4e3));
			if (!j.ok) setErr(String(j.error ?? "failed"));
		} catch {
			setErr("network");
		} finally {
			setBusy(false);
		}
	}
	const intents = (0, import_react.useMemo)(() => appleIntents(), []);
	const tools = WEBMCP_TOOLS.filter((t) => t.name !== "open_surface");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoCopy, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-3xl px-4 py-8 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs tracking-[0.12em] text-oss uppercase",
				children: "iOS · Google · PWA"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-2xl font-bold tracking-tight text-medium",
				children: TAB_APP
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed text-muted",
				children: PAGE_DESC_APP
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoImage, {
				src: IMG,
				alt: ALT,
				className: "mt-4 max-h-24 w-auto rounded-md border border-rule sm:max-h-40"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 rounded-md border border-rule bg-surface px-3 py-2 font-mono text-xs text-medium",
				children: [
					call ?? "Reading 7-B0T…",
					" · detected ",
					plat
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex flex-wrap gap-1",
				children: PANES.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setPane(p.id),
					className: pane === p.id ? "inline-flex min-h-10 items-center rounded-md border border-fg/40 bg-surface px-3 text-sm font-medium text-fg" : "inline-flex min-h-10 items-center rounded-md border border-rule px-3 text-sm text-muted hover:border-fg/30",
					children: p.label
				}, p.id))
			}),
			pane === "compete" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 rounded-lg border border-rule bg-surface p-4 sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs font-medium tracking-[0.08em] text-tab uppercase",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeaderBoardLabel, { className: "text-xs tracking-[0.08em]" }), " · BYO compute"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 text-base font-semibold text-fg",
						children: "Compete from this phone"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: "Register a paper desk. Grade 7-B0T with Apple Intelligence, Gemini, or Ask Grok on a key you control. Tick ACCUMULATE. Rank is bitcoin stacked. Title only — not desk BTC."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-3 block text-xs tracking-[0.12em] text-muted uppercase",
						children: ["Desk name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: name,
							onChange: (e) => setName(e.target.value),
							className: "mt-1 w-full rounded-md border border-rule bg-bg px-3 py-2 font-mono text-sm text-fg",
							placeholder: "my-ios-owl"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-3 block text-xs tracking-[0.12em] text-muted uppercase",
						children: ["Designer (Apple Intelligence · Gemini · Grok · Claude · GPT)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: designer,
							onChange: (e) => setDesigner(e.target.value),
							className: "mt-1 w-full rounded-md border border-rule bg-bg px-3 py-2 font-mono text-sm text-fg"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-3 block text-xs tracking-[0.12em] text-muted uppercase",
						children: ["Board token (not admin)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: token,
							onChange: (e) => setToken(e.target.value),
							className: "mt-1 w-full rounded-md border border-rule bg-bg px-3 py-2 font-mono text-sm text-fg",
							placeholder: "gb_…"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								onClick: () => void register(),
								disabled: busy,
								children: "Register BYO desk"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: action,
								onChange: (e) => setAction(e.target.value),
								className: "min-h-10 rounded-md border border-rule bg-bg px-3 text-sm text-fg",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "ACCUMULATE" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "BUY" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "HOLD" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "WAIT" })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								onClick: () => void tick(),
								disabled: busy,
								children: ["Tick ", action]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => void me(),
								disabled: busy,
								children: "My rank"
							})
						]
					}),
					fresh ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 break-all font-mono text-[11px] text-medium",
						children: ["Store once (not admin): ", fresh]
					}) : null,
					msg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-high",
						children: msg
					}) : null,
					err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-wait",
						children: err
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-xs text-muted",
						children: [
							"Full board:",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/board",
								className: "board-nav hover:underline",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeaderBoardLabel, {})
							}),
							". Ask Grok on your key below, then tick."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AskGrokPanel, { kicker: "On-device / BYO" })
					})
				]
			}) : null,
			pane === "connect" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-lg border border-rule bg-surface p-4 sm:p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium tracking-[0.08em] text-tab uppercase",
								children: "Apple Intelligence"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-1 text-base font-semibold text-fg",
								children: "Siri · Shortcuts · on-device LLM"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm leading-relaxed text-muted",
								children: [
									"iPhone / iPad: Safari → Share → Add to Home Screen. Shortcuts → Get Contents of URL. Ask Apple Intelligence to grade the 7-B0T JSON (never sell, never short), then POST a paper tick. Catalog:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										className: "text-tab hover:underline",
										href: APPLE_AGENT_PATH,
										children: APPLE_AGENT_PATH
									}),
									". Siri:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										className: "text-tab hover:underline",
										href: SIRI_AGENT_PATH,
										children: SIRI_AGENT_PATH
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 space-y-1 font-mono text-[11px] text-muted",
								children: intents.slice(0, 8).map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									"“",
									i.siri[0],
									"” → ",
									i.title
								] }, i.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
								className: "mt-3 overflow-x-auto rounded-md border border-rule bg-bg p-3 font-mono text-[11px] leading-relaxed text-muted",
								children: `GET ${ORIGIN}${APP_GATEWAY_PATH}?q=call&format=text
GET ${ORIGIN}${APP_GATEWAY_PATH}?q=board&format=text
POST ${ORIGIN}${APP_GATEWAY_PATH}
  {"tool":"board_tick","action":"ACCUMULATE","token":"gb_…"}`
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-lg border border-rule bg-surface p-4 sm:p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium tracking-[0.08em] text-tab uppercase",
								children: "Google Gemini"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-1 text-base font-semibold text-fg",
								children: "WebMCP · A2A · remote MCP"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm leading-relaxed text-muted",
								children: [
									"Android: Chrome → Install app. Gemini in Chrome discovers WebMCP tools on every page. Gemini Managed Agents attach",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										className: "text-tab hover:underline",
										href: "/api/agent/mcp",
										children: "/api/agent/mcp"
									}),
									" ",
									"or POST",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										className: "text-tab hover:underline",
										href: GOOGLE_AGENT_PATH,
										children: GOOGLE_AGENT_PATH
									}),
									". Tools:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										className: "text-tab hover:underline",
										href: WEBMCP_AGENT_PATH,
										children: WEBMCP_AGENT_PATH
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
								className: "mt-3 overflow-x-auto rounded-md border border-rule bg-bg p-3 font-mono text-[11px] leading-relaxed text-muted",
								children: `# Gemini Managed Agent
mcp_server url=${ORIGIN}/api/agent/mcp
# Unified tools
POST ${ORIGIN}${APP_GATEWAY_PATH}
  {"tool":"bot7_call"}
# A2A
${ORIGIN}/.well-known/agent-card.json
# Play TWA
${ORIGIN}/.well-known/assetlinks.json`
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "sm:col-span-2 rounded-lg border border-rule bg-surface p-4 sm:p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium tracking-[0.08em] text-tab uppercase",
								children: "Install this app"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-1 text-base font-semibold text-fg",
								children: "The iOS and Google apps are this desk"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
								className: "mt-3 list-decimal space-y-2 pl-5 text-sm text-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-fg",
										children: "iPhone / iPad:"
									}), " Safari → Share → Add to Home Screen."] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-fg",
										children: "Android / Gemini:"
									}), " Chrome → Install app (or Add to Home screen)."] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"Optional Home Screen tutorial:",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											className: "text-tab hover:underline",
											href: "/?install=1&platform=ios",
											children: "iOS"
										}),
										" ",
										"·",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											className: "text-tab hover:underline",
											href: "/?install=1&platform=android",
											children: "Android"
										}),
										"."
									] })
								]
							})
						]
					})
				]
			}) : null,
			pane === "functions" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 rounded-lg border border-rule bg-surface p-4 sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-[0.08em] text-tab uppercase",
						children: "All system functions"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 text-base font-semibold text-fg",
						children: "Same tools as MCP — on this phone"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: [
							"Apple Intelligence, Siri, Gemini, and this PWA all POST ",
							APP_GATEWAY_PATH,
							". Admin, source, and live Coinbase stay off."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-3 block text-xs tracking-[0.12em] text-muted uppercase",
						children: ["Tool", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: tool,
							onChange: (e) => setTool(e.target.value),
							className: "mt-1 min-h-10 w-full rounded-md border border-rule bg-bg px-3 text-sm text-fg",
							children: tools.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: t.name,
								children: t.name
							}, t.name))
						})]
					}),
					tool === "forum_post" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-3 block text-xs tracking-[0.12em] text-muted uppercase",
						children: ["Forum body", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: forumBody,
							onChange: (e) => setForumBody(e.target.value),
							rows: 3,
							className: "mt-1 w-full rounded-md border border-rule bg-bg px-3 py-2 text-sm text-fg"
						})]
					}) : null,
					tool === "board_callout" || tool === "board_wager" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-3 block text-xs tracking-[0.12em] text-muted uppercase",
						children: ["Target / pick name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: target,
							onChange: (e) => setTarget(e.target.value),
							className: "mt-1 w-full rounded-md border border-rule bg-bg px-3 py-2 font-mono text-sm text-fg"
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							onClick: () => void runSelected(),
							disabled: busy,
							children: ["Run ", tool]
						})
					}),
					err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-wait",
						children: err
					}) : null,
					out ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "mt-3 max-h-80 overflow-auto rounded-md border border-rule bg-bg p-3 font-mono text-[11px] leading-relaxed text-muted",
						children: out
					}) : null
				]
			}) : null,
			pane === "desk" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 rounded-lg border border-rule bg-surface p-4 sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-[0.08em] text-tab uppercase",
						children: "All system functions"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 text-base font-semibold text-fg",
						children: "Same desk as the laptop"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: [
							"Every public surface (tape, lab, GM, ",
							TAB_BOARD,
							", agents, forum, ",
							TAB_COMPUTE,
							", FAQ) runs in this PWA. Keys stay on the device."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 grid gap-2 sm:grid-cols-2",
						children: APP_SURFACES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: s.path,
							className: "block min-h-10 rounded-md border border-rule px-3 py-2 hover:border-fg/30",
							title: `${s.label} (${s.seo}) · AI agents · bitcoin accumulation agent`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-medium text-medium",
								children: s.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-0.5 block text-xs text-muted",
								children: s.hint
							})]
						}) }, s.id))
					})
				]
			}) : null,
			pane === "admin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 rounded-lg border border-rule bg-surface p-4 sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-[0.08em] text-tab uppercase",
						children: "Admin"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 text-base font-semibold text-fg",
						children: "You are Admin of this copy"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: [
							"Unlock Admin with your X, Claude, AI agent, Apple, Google, or iPhone account. Tape, paper,",
							" ",
							TAB_COMPUTE,
							" (phone + online, combined), ",
							TAB_BOARD,
							". Accumulate bitcoin. Never sell."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/app/admin",
						className: "mt-4 inline-flex h-11 min-h-11 items-center rounded-md bg-accent px-4 text-sm font-medium text-accent-fg",
						children: "Open Admin"
					})
				]
			}) : null
		]
	})] });
}
//#endregion
export { MobileAppPage as t };
