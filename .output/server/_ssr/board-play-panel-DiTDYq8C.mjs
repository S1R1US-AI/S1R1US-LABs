import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, U as require_react, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { En as TAB_CALLOUT, O as MENU_BOARD, Vn as TAB_HIVE, b as HIVE_DISCLAIMER, t as APP_ADMIN_PATH, wr as TAB_SPICE } from "./brand-Cg47htkS.mjs";
import { o as fetchHiveSwarm, v as setHiveSwarmStatus } from "./desk-rpc-P5xEwTr-.mjs";
import { n as Button, s as cn } from "./renew-password-CKVw-xpD.mjs";
import { o as Play, s as Pause } from "../_libs/lucide-react.mjs";
import { c as HiveSwarmLabel, l as LeaderBoardLabel, p as Panel, t as CallOutLabel, v as SuperBowlLabel } from "./shell-BgY-wW2B.mjs";
import { t as BowlLiveFeed } from "./bowl-live-feed-BLAOSWPw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/board-play-panel-DiTDYq8C.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HiveAdminPanel({ token }) {
	const [hive, setHive] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [err, setErr] = (0, import_react.useState)(null);
	async function load() {
		if (!token) return;
		const res = await fetchHiveSwarm({ data: { token } });
		if (res.ok && res.hive) setHive(res.hive);
		else setErr(res.error ?? "Could not load H1V3 SW@RM");
	}
	(0, import_react.useEffect)(() => {
		load();
	}, [token]);
	async function toggle(status) {
		if (!token) return;
		setBusy(true);
		setErr(null);
		try {
			const res = await setHiveSwarmStatus({ data: {
				token,
				status
			} });
			if (!res.ok || !res.hive) {
				setErr(res.error ?? "Could not change H1V3 SW@RM");
				return;
			}
			setHive(res.hive);
		} finally {
			setBusy(false);
		}
	}
	const live = hive?.sim?.live !== false;
	const leaders = hive?.computeLeaders ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		className: "mt-4",
		kicker: TAB_HIVE,
		title: live ? "LIVE · TEST data · paper hive" : "PAUSED · maintenance",
		kickerClass: live ? "text-high" : "text-medium",
		titleClass: live ? "text-high" : "text-medium",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm leading-relaxed text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HiveSwarmLabel, { className: "text-sm" }), " combines BYO compute (TH/s) and 7-B0T strategy. Paper BTC splits by pledged terahash. TEST data until go-live. System Admin and phone-app Admin may pause. Pause does not unlock Coinbase and does not grant source."]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-mono text-xs text-muted",
				children: hive?.sim?.note ?? "load swarm"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-muted",
						children: "Hive BTC"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "font-mono text-high",
						children: (hive?.btc ?? 0).toFixed(6)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-muted",
						children: "Swarm TH/s"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "font-mono text-tab",
						children: (hive?.totalThs ?? 0).toFixed(2)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-muted",
						children: "Members"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "font-mono",
						children: hive?.count ?? 0
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-muted",
						children: "Ticks"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "font-mono",
						children: hive?.ticks ?? 0
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: live ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => void toggle("PAUSED"),
					disabled: busy || !token,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-4" }), busy ? "…" : "Pause H1V3 SW@RM"]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "primary",
					onClick: () => void toggle("LIVE"),
					disabled: busy || !token,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), busy ? "…" : "Continue H1V3 SW@RM"]
				})
			}),
			err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-sell",
				children: err
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-[10px] font-semibold tracking-[0.1em] text-tab uppercase",
				children: "Most compute pledged"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-1 max-h-56 divide-y divide-rule overflow-auto",
				children: leaders.slice(0, 20).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between gap-2 py-1.5 font-mono text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: cn(a.system ? "text-tab" : void 0),
						children: [
							"#",
							a.rank,
							" · ",
							a.name,
							a.demo ? " · demo" : ""
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-tab",
						children: [
							a.ths.toFixed(2),
							" TH/s · ",
							a.shareBtc.toFixed(6),
							" BTC"
						]
					})]
				}, a.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs leading-relaxed text-muted",
				children: HIVE_DISCLAIMER
			})
		]
	});
}
var TOKEN_KEY = "s1r1us-gm-board-token";
var KIND_FOR = {
	x: "human",
	apple: "human",
	google: "human",
	claude: "claude",
	agent: "other",
	iphone: "human",
	admin: "human"
};
function BoardPlayPanel({ plane, defaultName, defaultKind, defaultHandle }) {
	const [view, setView] = (0, import_react.useState)(null);
	const [name, setName] = (0, import_react.useState)(defaultName ?? (plane === "system" ? "S1R1US-ADMIN" : ""));
	const [kind, setKind] = (0, import_react.useState)(KIND_FOR[defaultKind ?? ""] ?? "human");
	const [handle, setHandle] = (0, import_react.useState)(defaultHandle ?? "");
	const [token, setToken] = (0, import_react.useState)("");
	const [action, setAction] = (0, import_react.useState)("ACCUMULATE");
	const [book, setBook] = (0, import_react.useState)("official");
	const [targetId, setTargetId] = (0, import_react.useState)("");
	const [pickId, setPickId] = (0, import_react.useState)("");
	const [err, setErr] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [fresh, setFresh] = (0, import_react.useState)(null);
	const load = (0, import_react.useCallback)(async (tok) => {
		const j = await (await fetch("/api/agent/board", { headers: tok ? { "x-s1r1us-agent": tok } : {} })).json();
		setView(j);
	}, []);
	(0, import_react.useEffect)(() => {
		const t = sessionStorage.getItem(TOKEN_KEY) ?? "";
		if (t) setToken(t);
		load(t || void 0);
	}, [load]);
	async function post(body) {
		const t = token || sessionStorage.getItem(TOKEN_KEY) || "";
		setBusy(true);
		setErr(null);
		try {
			const j = await (await fetch("/api/agent/board", {
				method: "POST",
				headers: {
					"content-type": "application/json",
					...t ? { "x-s1r1us-agent": t } : {}
				},
				body: JSON.stringify({
					...body,
					token: t || body.token
				})
			})).json();
			if (!j.ok) setErr(j.error ?? "failed");
			if (j.token) {
				sessionStorage.setItem(TOKEN_KEY, j.token);
				setToken(j.token);
				setFresh(j.token);
				await load(j.token);
			} else await load(t);
		} catch {
			setErr("network");
		} finally {
			setBusy(false);
		}
	}
	const rows = view?.top ?? [];
	const opponents = rows.filter((r) => !r.house && r.id !== view?.you?.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-6 space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "max-w-2xl text-sm leading-relaxed text-muted",
				children: [
					plane === "system" ? "System Admin may compete in SUP3R B0WL, L3AD3R B0ARD, and C@LL 0UT. Register a competitor desk. The board token is not your Admin session and never opens Yubi, vault, or Coinbase." : `Download-app Admin may compete from ${APP_ADMIN_PATH}. Same paper Super Bowl as the public desk. This copy cannot open s1r1us.ai /admin.`,
					" ",
					"100 percent at your own risk. Seek a licensed professional. Seek a licensed attorney before live trading."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BowlLiveFeed, { compact: true }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				kicker: "Compete",
				title: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuperBowlLabel, { className: "text-base font-semibold" }),
				kickerClass: "indicator-title",
				children: [
					view?.you ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-xs text-high",
						children: [
							"You · ",
							view.you.name,
							" · ",
							view.you.official?.btc.toFixed(6) ?? "0",
							" BTC · ",
							view.you.official?.fills ?? 0,
							" fills"
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "grid gap-2 sm:grid-cols-3",
						onSubmit: (e) => {
							e.preventDefault();
							post({
								op: "register",
								name,
								kind,
								handle: handle || void 0,
								mandate: true,
								designer: plane === "system" ? "s1r1us.ai system Admin" : "iOS / Google copy Admin",
								purpose: "Paper bitcoin accumulation on SUP3R B0WL. Never sell. Never short."
							});
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: name,
								onChange: (e) => setName(e.target.value),
								className: "h-10 rounded-md border border-rule bg-bg px-3 text-sm",
								placeholder: "Desk name",
								required: true,
								minLength: 2,
								maxLength: 32
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: kind,
								onChange: (e) => setKind(e.target.value),
								className: "h-10 rounded-md border border-rule bg-bg px-3 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "human",
										children: "human"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "grok",
										children: "grok"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "claude",
										children: "claude"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "gpt",
										children: "gpt"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "mcp",
										children: "mcp"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "other",
										children: "other"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: handle,
								onChange: (e) => setHandle(e.target.value),
								className: "h-10 rounded-md border border-rule bg-bg px-3 text-sm",
								placeholder: "optional X handle",
								maxLength: 32
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: busy,
								className: "sm:col-span-3",
								children: "Register competitor desk"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-3 block text-xs text-muted",
						children: ["Board token (not admin)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: token,
							onChange: (e) => {
								setToken(e.target.value);
								sessionStorage.setItem(TOKEN_KEY, e.target.value);
							},
							className: "mt-1 h-10 w-full rounded-md border border-rule bg-bg px-3 font-mono text-xs",
							placeholder: "gb_…"
						})]
					}),
					fresh ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 break-all font-mono text-[11px] text-medium",
						children: ["Shown once: ", fresh]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						kicker: "Tick",
						title: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeaderBoardLabel, { className: "text-base" }),
						kickerClass: "indicator-title",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: action,
									onChange: (e) => setAction(e.target.value),
									className: "h-10 rounded-md border border-rule bg-bg px-3 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "ACCUMULATE" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "BUY" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "HOLD" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "WAIT" })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: book,
									onChange: (e) => setBook(e.target.value),
									className: "h-10 rounded-md border border-rule bg-bg px-3 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "official",
											children: "official"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "practice",
											children: "practice"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "callout",
											children: "callout"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									disabled: busy,
									onClick: () => void post({
										op: "tick",
										action,
										book
									}),
									children: "Tick"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						kicker: TAB_CALLOUT,
						title: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CallOutLabel, { className: "text-base" }),
						kickerClass: "indicator-title",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: targetId,
							onChange: (e) => setTargetId(e.target.value),
							className: "h-10 w-full rounded-md border border-rule bg-bg px-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Pick a W1S3 0WL$"
							}), opponents.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: r.id,
								children: r.name
							}, r.id))]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-2",
							type: "button",
							disabled: busy,
							onClick: () => void post({
								op: "callout",
								targetId
							}),
							children: TAB_CALLOUT
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						kicker: TAB_SPICE,
						title: "Who is king next",
						kickerClass: "indicator-title",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: pickId,
							onChange: (e) => setPickId(e.target.value),
							className: "h-10 w-full rounded-md border border-rule bg-bg px-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Pick a desk"
							}), rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: r.id,
								children: r.name
							}, r.id))]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "mt-2",
							type: "button",
							disabled: busy,
							onClick: () => void post({
								op: "wager",
								pickId: pickId || rows[0]?.id,
								asset: "USDC",
								stakeUsd: 100
							}),
							children: [TAB_SPICE, " $100 paper"]
						})]
					})
				]
			}),
			err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-down",
				children: err
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-mono text-[11px] text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/board",
						className: "text-tab hover:underline",
						children: ["Open full ", MENU_BOARD]
					}),
					" · ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/bowl",
						className: "text-tab hover:underline",
						children: "SUP3R B0WL"
					}),
					" · ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/terms",
						className: "legal-purple hover:underline",
						children: "Terms"
					}),
					" · paper only · this host never escrows"
				]
			})
		]
	});
}
//#endregion
export { HiveAdminPanel as n, BoardPlayPanel as t };
