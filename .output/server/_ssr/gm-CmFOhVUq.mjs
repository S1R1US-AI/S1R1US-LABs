import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, U as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { Mn as TAB_BOARD_LEADER, S as GIF_AI_BTC_BOT_NAME, b as GIF_AI_BTC_BOT, jn as TAB_BOARD, qn as TAB_GM, x as GIF_AI_BTC_BOT_EQ } from "./brand-1s5EgS5V.mjs";
import { n as runBots, t as heliosCall } from "./signal-DNSRJrEz.mjs";
import { u as usePaper } from "./store-oEyIFO9k.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { b as gmCall, c as GM_CASH_MIN, d as GM_FUND_USDC, f as GM_NAME, h as GM_VAR_META, l as GM_CASH_STEP, m as GM_PROFIT_EXPLORER, p as GM_PROFIT_BTC, s as GM_CASH_MAX, u as GM_FUND_EXPLORER, y as dayTraderTf } from "./auto-window-DE1-Xqe3.mjs";
import { t as DESK_POLL_MS } from "./poll-ByA4PSVX.mjs";
import { r as useDeskTape } from "./tape-client-BE5FsWuO.mjs";
import { v as useOperator } from "./operator-pJ_wP6R3.mjs";
import { t as useGm } from "./gm-store-C2mvQfWZ.mjs";
import { f as rsiTone, i as USD_TONE, n as Button, s as cn, t as BTC_TONE } from "./renew-password-4zi8_z0w.mjs";
import { _ as SeoImage, a as GmRainbow, d as LoginCluster, m as Panel, o as GodzillaMark, u as LeaderBoardLabel, v as Shell } from "./shell-DoIoNIED.mjs";
import { c as callStanceClass, n as CallWords, s as bannerTone, t as CallInk, u as money } from "./helios-card-5BHzfoap.mjs";
import { t as rollBots } from "./roll-bots-DkxE5xXa.mjs";
import { t as SeoCopy } from "./seo-copy-_hkq2Oas.mjs";
import { t as LiveTracks } from "./live-tracks-BIu2Jbf6.mjs";
import { z as usePractice } from "./router-BPvmRr2S.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gm-CmFOhVUq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var getGmLive = createServerFn({ method: "GET" }).handler(createSsrRpc("3bb2b512072976cd3a86a22f8611883216c8291ee761c4550c25d6127801d639"));
var setGmLive = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("08afd2e285c9ae25b69be9b0b0689069cb0b951c9f4e04fb46b172d4fbefd0e7"));
function isGmAccumulate(call) {
	return Boolean(call && call.stance === "ACCUMULATE");
}
function GmDesk() {
	const snap = useDeskTape().snap;
	const admin = useOperator((s) => s.unlocked && s.role === "admin");
	const token = useOperator((s) => s.token);
	const pilot = useGm((s) => s.pilot);
	const setPilot = useGm((s) => s.setPilot);
	const view = useGm((s) => s.view);
	const setView = useGm((s) => s.setView);
	const risk = useGm((s) => s.risk);
	const setRisk = useGm((s) => s.setRisk);
	const bookUsd = useGm((s) => s.bookUsd);
	const setBookUsd = useGm((s) => s.setBookUsd);
	const dayHours = useGm((s) => s.dayHours);
	const setDayHours = useGm((s) => s.setDayHours);
	const vars = useGm((s) => s.vars);
	const setVar = useGm((s) => s.setVar);
	const applyBook = useGm((s) => s.applyBook);
	const resetBook = useGm((s) => s.resetBook);
	const lastTick = useGm((s) => s.lastTick);
	const ticks = useGm((s) => s.ticks);
	const error = useGm((s) => s.error);
	const busy = useGm((s) => s.busy);
	const liveUnlocked = useGm((s) => s.liveUnlocked);
	const setLiveUnlocked = useGm((s) => s.setLiveUnlocked);
	const practice = useGm((s) => s.practice);
	const live = useGm((s) => s.live);
	const bot7Ticks = usePractice((s) => s.ticks);
	const paper = usePaper();
	const [now, setNow] = (0, import_react.useState)(() => Date.now());
	const [liveAt, setLiveAt] = (0, import_react.useState)(null);
	const [liveErr, setLiveErr] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getGmLive().then((s) => {
			setLiveUnlocked(s.liveUnlocked);
			setLiveAt(s.at);
		});
	}, [setLiveUnlocked]);
	(0, import_react.useEffect)(() => {
		const apply = () => {
			const h = window.location.hash.replace(/^#/, "").toLowerCase();
			if (h === "manual") setPilot("MANUAL");
			if (h === "auto") setPilot("AUTO");
		};
		apply();
		window.addEventListener("hashchange", apply);
		return () => window.removeEventListener("hashchange", apply);
	}, [setPilot]);
	(0, import_react.useEffect)(() => {
		const id = window.setInterval(() => setNow(Date.now()), 1e3);
		return () => window.clearInterval(id);
	}, []);
	(0, import_react.useEffect)(() => {
		rollBots({
			force: true,
			admin
		});
		const id = window.setInterval(() => void rollBots({ admin }), DESK_POLL_MS);
		return () => window.clearInterval(id);
	}, [admin]);
	const book = view === "live" && liveUnlocked && admin ? live : practice;
	const px = snap?.btc.price ?? ticks[0]?.price ?? 0;
	const nav = book.cashUsd + book.btc * px;
	const last = ticks[0];
	const liveArmed = liveUnlocked && admin && view === "live";
	const call = snap ? gmCall(snap, nav || bookUsd, {
		pilot,
		risk,
		manual: vars,
		adminLive: liveArmed,
		dayHours
	}) : last?.call;
	const tf = snap ? dayTraderTf(snap, dayHours, nav || bookUsd) : call?.dayTf;
	const briefs = snap ? runBots(snap) : [];
	const bot7 = snap ? heliosCall(snap, briefs, nav || bookUsd) : null;
	async function toggleLive(on) {
		if (!token) {
			setLiveErr("Admin sign-in required to arm Live.");
			return;
		}
		const res = await setGmLive({ data: {
			token,
			liveUnlocked: on
		} });
		if (!res.ok) {
			setLiveErr(res.error ?? "Could not change Live.");
			return;
		}
		setLiveUnlocked(res.liveUnlocked);
		setLiveAt(res.at);
		setLiveErr(null);
		if (!res.liveUnlocked) setView("practice");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "gm-mode mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoCopy, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 text-high",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: GIF_AI_BTC_BOT,
							className: "shrink-0",
							title: GIF_AI_BTC_BOT_EQ,
							"aria-label": GIF_AI_BTC_BOT_EQ,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoImage, {
								src: GIF_AI_BTC_BOT,
								alt: GIF_AI_BTC_BOT_NAME,
								title: GIF_AI_BTC_BOT_EQ,
								desc: GIF_AI_BTC_BOT_EQ,
								width: 88,
								height: 132,
								className: "h-16 w-11 rounded-md object-cover object-center ring-1 ring-rule sm:h-[4.5rem] sm:w-12"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GodzillaMark, { className: "h-12 w-[5.5rem] shrink-0" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium tracking-[0.14em] uppercase",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GmRainbow, { text: TAB_GM })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								id: "auto",
								className: "text-2xl font-bold tracking-tight sm:text-3xl",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GmRainbow, { text: GM_NAME })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-mono text-[11px] text-muted",
								children: GIF_AI_BTC_BOT_EQ
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 font-mono text-[11px] text-muted",
								children: [
									"Compete on",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "/board",
										className: "board-nav hover:underline",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeaderBoardLabel, { className: "text-[11px]" })
									}),
									" · ",
									TAB_BOARD,
									" · ",
									TAB_BOARD_LEADER
								]
							})
						] })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "desk-tabs flex flex-wrap items-center gap-1",
					role: "tablist",
					"aria-label": "GM book",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: cn("inline-flex h-11 min-h-11 items-center rounded-md px-4 text-sm font-medium", view === "practice" && "is-on"),
						onClick: () => setView("practice"),
						children: "Practice"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: cn("inline-flex h-11 min-h-11 items-center rounded-md px-4 text-sm font-medium", view === "live" && "is-on"),
						onClick: () => setView("live"),
						children: "Live"
					})]
				})]
			}),
			view === "live" && !liveArmed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 rounded-md border border-rule bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs tracking-[0.14em] text-sell uppercase",
						children: "Live locked"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: admin ? "Unlock Live below. Autonomous GM then uses the live sleeve." : "Only the admin can arm Live. AUTO still reads the live tape."
					}),
					admin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-3",
						variant: "primary",
						onClick: () => void toggleLive(true),
						children: "Unlock Live for admin / autonomous"
					}) : null
				]
			}) : null,
			admin && liveUnlocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => void toggleLive(false),
					children: "Lock Live"
				}), liveAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 font-mono text-[11px] text-muted",
					children: ["Live armed ", new Date(liveAt).toLocaleString("en-US")]
				}) : null]
			}) : null,
			liveErr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-down",
				children: liveErr
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 desk-tabs flex flex-wrap gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					id: "auto",
					className: cn("inline-flex h-11 min-h-11 items-center rounded-md px-4 text-sm font-bold", pilot === "AUTO" && "is-on"),
					onClick: () => setPilot("AUTO"),
					children: "AUTO"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					id: "manual",
					className: cn("inline-flex h-11 min-h-11 items-center rounded-md px-4 text-sm font-bold", pilot === "MANUAL" && "is-on"),
					onClick: () => setPilot("MANUAL"),
					children: "MANUAL"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-muted",
				children: pilot === "AUTO" ? liveArmed ? "AUTO may turn on day-trader sleeve sells from the tape." : "AUTO accumulates. Day-trader sells stay off until admin Live." : "You pick variables. Admin can always toggle day-trader."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AutoLiveFeed, {
				call: call ?? null,
				bot7,
				px,
				lastTick,
				now,
				gmBook: book,
				gmTicks: ticks,
				bot7Ticks,
				paperCash: paper.cashUsd,
				paperBtc: paper.btc
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveTracks, {
				briefs,
				note: "Bots 1–6 from this Coinbase cycle. 7-B0T reads these lanes — it does not average them."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid gap-4 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						kicker: "GM call",
						title: isGmAccumulate(call) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GmRainbow, { text: `${call.conviction} ${call.stance}` }) : call ? `${call.conviction} ${call.stance}` : "Waiting on tape",
						kickerClass: bannerTone(call),
						titleClass: call && !isGmAccumulate(call) ? bannerTone(call) : call ? void 0 : "text-medium",
						children: [
							call ? isGmAccumulate(call) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-lg uppercase",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GmRainbow, { text: `${call.conviction} CONVICTION ${call.stance}` })
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CallWords, {
								call,
								className: "font-mono text-lg"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-lg text-muted",
								children: "—"
							}),
							call?.clipUsd ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: cn("font-mono text-sm", USD_TONE),
								children: money(call.clipUsd, 0)
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "mt-3",
								onClick: () => void rollBots({
									force: true,
									admin
								}),
								disabled: busy,
								children: "Roll 7-B0T + bots 1–6"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: cn("mt-2 text-sm leading-relaxed", call && (call.conviction === "LOW" || call.stance === "HOLD") ? "text-sell" : "text-muted"),
								children: call?.reason ?? "Pulling Coinbase tape…"
							}),
							call?.triggers?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 flex flex-wrap gap-1.5",
								children: call.triggers.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: cn("rounded-md border border-rule px-2 py-1 font-mono text-[11px]", call.sellSleeve ? "text-sell" : "text-high"),
									title: t.why,
									children: [t.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-1 text-muted",
										children: t.why
									})]
								}, t.id))
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 font-mono text-xs text-muted",
								children: [
									"7-B0T",
									" ",
									call ? isGmAccumulate(call.vsBot7) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GmRainbow, { text: `${call.vsBot7.conviction} ${call.vsBot7.stance}` }) : `${call.vsBot7.conviction} ${call.vsBot7.stance}` : "—",
									call?.vsBot7.clipUsd ? ` · ${money(call.vsBot7.clipUsd, 0)}` : ""
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 font-mono text-xs text-muted",
								children: [busy ? "scanning…" : lastTick ? `last ${new Date(lastTick).toLocaleTimeString("en-US")}` : "—", error ? ` · ${error}` : ""]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						kicker: "Sleeve",
						title: liveArmed ? "Live GM book" : "Practice GM book",
						kickerClass: "text-high",
						titleClass: "text-medium",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: cn("font-mono text-2xl tabular-nums", USD_TONE),
								children: money(nav, 0)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 font-mono text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: USD_TONE,
										children: money(book.cashUsd, 0)
									}),
									" · ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: BTC_TONE,
										children: [book.btc.toFixed(6), " BTC"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 font-mono text-xs text-muted",
								children: "Fund GM (USDC · Base / ETH)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 break-all font-mono text-[11px]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									className: USD_TONE,
									href: GM_FUND_EXPLORER,
									target: "_blank",
									rel: "noreferrer",
									children: GM_FUND_USDC
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 font-mono text-xs",
								children: [
									"Profit taken",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: BTC_TONE,
										children: [(book.profitBtc ?? 0).toFixed(6), " BTC"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 break-all font-mono text-[11px] text-muted",
								children: [
									"→",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										className: BTC_TONE,
										href: GM_PROFIT_EXPLORER,
										target: "_blank",
										rel: "noreferrer",
										children: GM_PROFIT_BTC
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mt-4 block text-sm",
								htmlFor: "gm-cash",
								children: ["Practice fund ", money(bookUsd, 0)]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "gm-cash",
								type: "range",
								min: GM_CASH_MIN,
								max: GM_CASH_MAX,
								step: GM_CASH_STEP,
								value: bookUsd,
								onChange: (e) => setBookUsd(Number(e.target.value)),
								className: "mt-1 w-full"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: applyBook,
									children: ["Set sleeve to ", money(bookUsd, 0)]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: resetBook,
									children: "Reset fills"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						kicker: "Risk",
						title: `Level ${risk} · ${risk * 20}%`,
						kickerClass: "text-high",
						titleClass: "text-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 1,
							max: 5,
							step: 1,
							value: risk,
							onChange: (e) => setRisk(Number(e.target.value)),
							className: "w-full",
							"aria-label": "GM risk 1 to 5"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: "1 = 20% of the sleeve at risk. 5 = 100%. Naked long/short needs 4–5."
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				className: "mt-4",
				kicker: "Variables",
				title: pilot === "AUTO" ? "AUTO mix (tape)" : "MANUAL mix",
				kickerClass: "text-high",
				titleClass: "text-medium",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid gap-3 sm:grid-cols-2",
					children: GM_VAR_META.map((m) => {
						const on = vars[m.id];
						const effect = call?.effects.find((e) => e.id === m.id);
						const locked = m.id === "naked" && risk < 4 && !on;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-md border border-rule bg-bg p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: on,
									disabled: pilot === "AUTO" || locked,
									onChange: (e) => setVar(m.id, e.target.checked),
									className: "mt-1 size-4"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-sm font-medium",
									children: m.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-0.5 block text-xs text-muted",
									children: m.hint
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: cn("mt-2 font-mono text-[11px]", on ? "text-high" : "text-muted"),
								children: [
									on ? "ON" : "OFF",
									" · ",
									effect?.effect ?? "—"
								]
							})]
						}, m.id);
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "mt-4",
				kicker: "Day-trader",
				title: `${dayHours}h candle`,
				kickerClass: "text-high",
				titleClass: "text-medium",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						htmlFor: "gm-tf",
						children: [
							"Trade RSI 30/70 on the ",
							dayHours,
							"-hour Coinbase candle"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "gm-tf",
						type: "range",
						min: 1,
						max: 24,
						step: 1,
						value: dayHours,
						onChange: (e) => setDayHours(Number(e.target.value)),
						className: "mt-1 w-full"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 font-mono text-[11px] text-muted",
						children: [
							"1h · 6h · 12h · 24h · ",
							tf?.bars ?? 0,
							" bars · RSI(",
							tf?.period ?? 14,
							")"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid gap-3 sm:grid-cols-3 font-mono text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-muted",
								children: [dayHours, "h RSI"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: rsiTone(tf?.rsi, tf?.rsiAvg),
								children: [tf?.rsi != null ? tf.rsi.toFixed(1) : "—", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 text-muted",
									children: tf?.now ?? ""
								})]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted",
								children: "1h RSI"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: rsiTone(tf?.rsi1h, 50),
								children: tf?.rsi1h != null ? tf.rsi1h.toFixed(1) : "—"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted",
								children: "vs 1h"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: tf?.vs1h ?? "—" })] })
						]
					}),
					tf ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted",
						children: [
							"On this ",
							tf.hours,
							"h tape, RSI 30/70 would have fired",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-high",
								children: [tf.sim.buys, " buys"]
							}),
							" and",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sell",
								children: [tf.sim.sells, " sleeve sells"]
							}),
							". Simulated NAV",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: USD_TONE,
								children: money(tf.sim.nav, 0)
							}),
							" vs buy-hold ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: USD_TONE,
								children: money(tf.sim.hold, 0)
							}),
							" (",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: tf.sim.deltaPct >= 0 ? "text-high" : "text-sell",
								children: [
									tf.sim.deltaPct >= 0 ? "+" : "",
									tf.sim.deltaPct.toFixed(1),
									"%"
								]
							}),
							"). 1h candle on the same window: ",
							tf.sim.buys1h,
							" buys / ",
							tf.sim.sells1h,
							" sells, NAV ",
							money(tf.sim.nav1h, 0),
							". This ",
							tf.hours,
							"h setting is",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: tf.sim.vs1hPct >= 0 ? "text-high" : "text-sell",
								children: [
									tf.sim.vs1hPct >= 0 ? "+" : "",
									tf.sim.vs1hPct.toFixed(1),
									"%"
								]
							}),
							" ",
							"vs 1h. Longer candles fire less often. Turn Classic day-trader ON to use this in the GM call."
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: "Waiting on Coinbase hourly candles to fold into this timeframe."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				className: "mt-4",
				kicker: "Fills",
				title: "GM sleeve history",
				kickerClass: "text-high",
				titleClass: "text-medium",
				children: book.fills.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-3",
					children: book.fills.slice(0, 12).map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: cn("rounded-md border p-3", i === 0 ? "border-tab bg-surface" : "border-rule bg-bg"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-baseline justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: cn("font-mono text-sm font-bold", f.side === "BUY" ? "text-high" : "text-sell"),
								children: [f.side === "BUY" ? "BUY" : f.kind === "trim" ? "SELL · profit BTC" : "SELL", i === 0 ? " · last" : ""]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: USD_TONE,
										children: money(f.usd, 0)
									}),
									" · ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: BTC_TONE,
										children: [f.btc.toFixed(6), " BTC"]
									})
								]
							})]
						}), f.triggers?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 flex flex-wrap gap-1.5",
							children: f.triggers.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: cn("rounded-md px-2 py-1 font-mono text-[11px]", f.side === "BUY" ? "bg-high/10 text-high" : "bg-sell/15 text-sell"),
								children: [t.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-1 text-muted",
									children: t.why
								})]
							}, `${f.id}-${t.label}`))
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted",
							children: f.note
						})]
					}, f.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "No GM fills yet. When a clip prints, the settings that fired it show here."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 flex justify-end pb-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoginCluster, {})
			})
		]
	}) });
}
function AutoLiveFeed({ call, bot7, px, lastTick, now, gmBook, gmTicks, bot7Ticks, paperCash, paperBtc }) {
	const age = lastTick ? Math.max(0, Math.floor((now - Date.parse(lastTick)) / 1e3)) : null;
	const gmNav = gmBook.cashUsd + gmBook.btc * px;
	const bot7Nav = paperCash + paperBtc * px;
	const liveRows = gmTicks.length ? gmTicks.slice(0, 8).map((t) => ({
		at: t.at,
		text: `${t.call.conviction} ${t.call.stance}`,
		filled: t.executed,
		usd: t.call.clipUsd,
		btc: t.btc
	})) : call ? [{
		at: (/* @__PURE__ */ new Date()).toISOString(),
		text: `${call.conviction} ${call.stance}`,
		filled: false,
		usd: call.clipUsd,
		btc: gmBook.btc
	}] : [];
	const bot7Rows = bot7Ticks.length ? bot7Ticks.slice(0, 8).map((t) => ({
		at: t.at,
		text: `${t.conviction} ${t.stance}`,
		filled: t.executed,
		usd: t.clipUsd,
		btc: t.btc
	})) : bot7 ? [{
		at: (/* @__PURE__ */ new Date()).toISOString(),
		text: `${bot7.conviction} ${bot7.stance}`,
		filled: false,
		usd: bot7.clipUsd,
		btc: paperBtc
	}] : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		className: "mt-5",
		kicker: "AUTO",
		title: "Live tape",
		kickerClass: "text-high",
		titleClass: "text-high",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Live Coinbase tape. G M0D3 AUTO reads it with 7-B0T. Coinbase orders stay off until Live is unlocked."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid gap-3 sm:grid-cols-4 font-mono text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted",
							children: "GM NAV"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: USD_TONE,
							children: money(gmNav, 0)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: BTC_TONE,
							children: [gmBook.btc.toFixed(6), " BTC"]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted",
							children: "7-B0T NAV"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: USD_TONE,
							children: money(bot7Nav, 0)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: BTC_TONE,
							children: [paperBtc.toFixed(6), " BTC"]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-muted",
						children: "Call"
					}), call ? isGmAccumulate(call) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GmRainbow, { text: `${call.conviction} ${call.stance}` }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "uppercase",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: call.conviction === "MEDIUM" ? "call-medium" : call.conviction === "HIGH" ? "text-high" : "text-sell",
								children: call.conviction
							}),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: callStanceClass(call.stance),
								children: call.stance
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted",
						children: "waiting tape"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted",
							children: "Tape"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: USD_TONE,
							children: px ? money(px, 0) : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted",
							children: age != null ? `${age}s ago` : "live"
						})
					] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TickList, {
					label: "GM sleeve",
					rows: liveRows
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TickList, {
					label: "7-B0T",
					rows: bot7Rows
				})]
			})
		]
	});
}
function TickList({ label, rows }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "font-mono text-[11px] tracking-[0.14em] text-medium uppercase",
		children: label
	}), rows.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "mt-2 space-y-1.5",
		children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex flex-wrap items-baseline justify-between gap-2 font-mono text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: r.filled ? "text-high" : "text-muted",
				children: [
					r.filled ? "FILL" : "scan",
					" ·",
					" ",
					/HIGH(\s+CONVICTION)?\s+ACCUMULATE/.test(r.text) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GmRainbow, { text: r.text }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CallInk, { text: r.text })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-muted",
				children: [new Date(r.at).toLocaleTimeString("en-US", {
					hour: "2-digit",
					minute: "2-digit",
					second: "2-digit"
				}), r.filled ? ` · ${money(r.usd, 0)}` : ""]
			})]
		}, r.at + r.text))
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-2 text-sm text-muted",
		children: "Waiting on live tape."
	})] });
}
var SplitComponent = GmDesk;
//#endregion
export { SplitComponent as component };
