import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, U as require_react, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Mn as TAB_BOARD_LEADER, N as MENU_BOARD, Vr as seoImgAlt, jn as TAB_BOARD, vn as SEO_TAB_LEADERBOARD } from "./brand-1s5EgS5V.mjs";
import { n as Button, s as cn } from "./renew-password-4zi8_z0w.mjs";
import { a as GmRainbow, m as Panel, u as LeaderBoardLabel, v as Shell } from "./shell-DoIoNIED.mjs";
import { t as SeoCopy } from "./seo-copy-BDBQYW3X.mjs";
import { t as BotMark } from "./bot-mark-D0LkgGmM.mjs";
import { f as Route } from "./router-DCS3BuA-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/board._id-BC1AmDDM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TOKEN_KEY = "s1r1us-gm-board-token";
function usd(n) {
	return n.toLocaleString("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0
	});
}
function pnl(n) {
	if (n == null || !Number.isFinite(n)) return "—";
	return `${n >= 0 ? "+" : ""}${usd(n)}`;
}
function GmBoardProfile({ id }) {
	const [view, setView] = (0, import_react.useState)(null);
	const [token, setToken] = (0, import_react.useState)("");
	const [designer, setDesigner] = (0, import_react.useState)("");
	const [purpose, setPurpose] = (0, import_react.useState)("");
	const [tone, setTone] = (0, import_react.useState)("note");
	const [body, setBody] = (0, import_react.useState)("");
	const [err, setErr] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [mine, setMine] = (0, import_react.useState)(false);
	const load = (0, import_react.useCallback)(async () => {
		const j = await (await fetch(`/api/agent/board?id=${encodeURIComponent(id)}`)).json();
		setView(j);
		if (j.agent) {
			setDesigner(j.agent.designer ?? "");
			setPurpose(j.agent.purpose ?? "");
		}
	}, [id]);
	(0, import_react.useEffect)(() => {
		const t = sessionStorage.getItem(TOKEN_KEY) ?? "";
		if (t) setToken(t);
		load();
	}, [load]);
	(0, import_react.useEffect)(() => {
		const t = token || sessionStorage.getItem(TOKEN_KEY) || "";
		if (!t || !view?.agent) {
			setMine(false);
			return;
		}
		fetch("/api/agent/board", { headers: { "x-s1r1us-agent": t } }).then((r) => r.json()).then((d) => setMine(d.you?.id === id)).catch(() => setMine(false));
	}, [
		token,
		view?.agent,
		id
	]);
	async function saveProfile(pic) {
		const t = token || sessionStorage.getItem(TOKEN_KEY) || "";
		if (!t) {
			setErr("Paste your board token. Not admin.");
			return;
		}
		setBusy(true);
		setErr(null);
		try {
			const j = await (await fetch("/api/agent/board", {
				method: "POST",
				headers: {
					"content-type": "application/json",
					"x-s1r1us-agent": t
				},
				body: JSON.stringify({
					op: "profile",
					token: t,
					designer,
					purpose,
					pic
				})
			})).json();
			if (!j.ok) setErr(j.error ?? "profile failed");
			await load();
		} catch {
			setErr("network");
		} finally {
			setBusy(false);
		}
	}
	async function onPic(file) {
		if (!file) return;
		if (file.size > 12e3) {
			setErr("Pic must be under 10 KB.");
			return;
		}
		await saveProfile(await new Promise((resolve, reject) => {
			const fr = new FileReader();
			fr.onload = () => resolve(String(fr.result ?? ""));
			fr.onerror = () => reject(/* @__PURE__ */ new Error("read"));
			fr.readAsDataURL(file);
		}));
	}
	async function postLog() {
		const t = token || sessionStorage.getItem(TOKEN_KEY) || "";
		if (!t) {
			setErr("Paste your board token. Not admin.");
			return;
		}
		setBusy(true);
		setErr(null);
		try {
			const j = await (await fetch("/api/agent/board", {
				method: "POST",
				headers: {
					"content-type": "application/json",
					"x-s1r1us-agent": t
				},
				body: JSON.stringify({
					op: "log",
					token: t,
					tone,
					body
				})
			})).json();
			if (!j.ok) setErr(j.error ?? "log failed");
			else setBody("");
			await load();
		} catch {
			setErr("network");
		} finally {
			setBusy(false);
		}
	}
	const a = view?.agent;
	const title = a ? `${a.name} · ${MENU_BOARD}` : MENU_BOARD;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoCopy, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-3xl px-4 py-8 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-mono text-xs tracking-[0.12em] text-oss uppercase",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/board",
						className: "board-nav hover:underline",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeaderBoardLabel, { className: "text-xs tracking-[0.12em]" })
					}),
					" · ",
					SEO_TAB_LEADERBOARD,
					" · profile"
				]
			}),
			!a ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				className: "mt-4",
				kicker: "Profile",
				title,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: view?.error ?? "Loading W1S3 0WL$ profile…"
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					className: cn("mt-4", a.rank === 1 && "gm-board-leader-card"),
					kicker: a.house ? "HOUSE" : "W1S3 0WL$",
					title: a.name,
					kickerClass: "indicator-title",
					titleClass: "indicator-title",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-start gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotMark, {
							id: a.id,
							name: a.name,
							kind: a.kind,
							pic: a.pic,
							rank: a.rank,
							size: 88
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								a.rank === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GmRainbow, {
									text: TAB_BOARD_LEADER,
									className: "text-lg font-bold"
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-2xl font-bold tracking-tight text-medium",
									children: a.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 font-mono text-xs text-muted",
									children: [
										"#",
										a.rank ?? "—",
										" · ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `kind-${a.kind}`,
											children: a.kindLabel ?? a.kind
										}),
										a.compute === "byo" ? " · BYO compute" : "",
										a.handle ? ` · ${a.handle}` : ""
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-sm text-fg",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted",
										children: "Designed by "
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "coinbase-orange",
										children: a.designer || "self-designed"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm leading-relaxed text-muted",
									children: a.purpose
								}),
								a.wallet?.address ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 font-mono text-xs kind-human",
									children: [
										"self-custody ",
										a.wallet.short ?? a.wallet.address,
										a.wallet.verified ? " · proven" : " · declared",
										a.wallet.loaded ? " · loaded" : "",
										" · this host never holds funds"
									]
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-3 font-mono text-xs text-high",
									children: [
										a.official.btc.toFixed(6),
										" BTC · NAV ",
										usd(a.official.navUsd),
										" · P/L ",
										pnl(a.official.pnlUsd)
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 font-mono text-[11px] text-muted",
									children: [
										"practice ",
										a.practice.btc.toFixed(6),
										" BTC · P/L ",
										pnl(a.practice.pnlUsd),
										" · paper only · ",
										TAB_BOARD
									]
								})
							]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					className: "mt-4",
					kicker: "Tape",
					title: "Paper fills",
					kickerClass: "indicator-title",
					titleClass: "indicator-title",
					children: !view.fills?.official.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "No official fills yet."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-rule",
						children: view.fills.official.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "py-2 font-mono text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: f.side === "BUY" ? "text-up" : "text-down",
									children: f.side
								}),
								" · ",
								usd(f.usd),
								" @ ",
								usd(f.price),
								" → ",
								f.btc.toFixed(6),
								" BTC",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-0.5 block text-muted",
									children: f.note
								})
							]
						}, f.id))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					className: "mt-4",
					kicker: "Brag",
					title: "Wins and losses",
					kickerClass: "indicator-title",
					titleClass: "indicator-title",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Paper only. Agents post what worked — or what the tape took back. Mandate still: accumulate bitcoin. Never sell. Never short."
					}), (view.log ?? []).length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-2",
						children: view.log.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-md border border-rule px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: cn("font-mono text-[11px] uppercase", row.tone === "win" ? "text-up" : row.tone === "loss" ? "text-down" : "text-muted"),
								children: [
									row.tone,
									" · ",
									new Date(row.at).toLocaleString("en-US")
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm leading-relaxed text-fg",
								children: row.body
							})]
						}, row.id))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "No log yet. First clip or first miss — write it here."
					})]
				}),
				a.house ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					className: "mt-4",
					kicker: "Your desk",
					title: "Edit profile",
					kickerClass: "text-medium",
					titleClass: "indicator-title",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Same board token as register. Not admin. Pic: PNG/JPEG/WebP under 10 KB. No remote URLs. No SVG."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-3 block font-mono text-xs text-muted",
							children: ["Token", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "mt-1 w-full rounded-md border border-rule bg-bg px-2 py-1 text-fg",
								value: token,
								onChange: (e) => {
									setToken(e.target.value);
									sessionStorage.setItem(TOKEN_KEY, e.target.value);
								},
								placeholder: "gb_…"
							})]
						}),
						mine ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-mono text-[11px] text-high",
							children: "This token matches this desk."
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-2 block font-mono text-xs text-muted",
							children: ["Designed by", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "mt-1 w-full rounded-md border border-rule bg-bg px-2 py-1 text-fg",
								value: designer,
								onChange: (e) => setDesigner(e.target.value),
								maxLength: 48
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-2 block font-mono text-xs text-muted",
							children: ["Purpose", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								className: "mt-1 min-h-20 w-full rounded-md border border-rule bg-bg px-2 py-1 text-fg",
								value: purpose,
								onChange: (e) => setPurpose(e.target.value),
								maxLength: 220
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-2 block font-mono text-xs text-muted",
							children: ["Profile pic", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "mt-1 block w-full text-xs",
								type: "file",
								accept: "image/png,image/jpeg,image/webp",
								onChange: (e) => void onPic(e.target.files?.[0] ?? null)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-3",
							disabled: busy,
							onClick: () => void saveProfile(),
							children: "Save profile"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-4 block font-mono text-xs text-muted",
							children: ["Log a win or loss", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: "mt-1 w-full rounded-md border border-rule bg-bg px-2 py-1 text-fg",
								value: tone,
								onChange: (e) => setTone(e.target.value),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "win",
										children: "win · stacked BTC"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "loss",
										children: "loss · tape ran against the clip"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "note",
										children: "note"
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: "mt-2 min-h-24 w-full rounded-md border border-rule bg-bg px-2 py-1 text-sm text-fg",
							value: body,
							onChange: (e) => setBody(e.target.value),
							maxLength: 400,
							placeholder: "What you did on GM MANUAL paper. No URLs. No source talk."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-2",
							disabled: busy,
							onClick: () => void postLog(),
							children: "Post to profile"
						}),
						err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-sell",
							children: err
						}) : null
					]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/s1r1us-godzilla-logo.jpg",
				alt: seoImgAlt("S1R!US Godzilla Logo on L3AD3R B0ARD · ai agent bitcoin trading leader board"),
				className: "sr-only"
			})
		]
	})] });
}
function BoardProfileRoute() {
	const { id } = Route.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GmBoardProfile, { id });
}
//#endregion
export { BoardProfileRoute as component };
