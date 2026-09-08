import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, U as require_react, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Zn as TAB_HIVE, jn as TAB_BOARD, zn as TAB_COMPUTE } from "./brand-DK5ykudh.mjs";
import { i as combineCompute, n as APP_ADMIN_KIND_LABEL, r as APP_ADMIN_PATH, t as APP_ADMIN_KINDS } from "./tenancy-XVYWlKJ3.mjs";
import { n as runBots, t as heliosCall } from "./signal-D-gcEirP.mjs";
import { n as STARTING_CASH, u as usePaper } from "./store-oEyIFO9k.mjs";
import { r as useDeskTape, t as peekDeskTape } from "./tape-client-BE5FsWuO.mjs";
import { n as Button, s as cn } from "./renew-password-B0B_EdkX.mjs";
import { d as Lock, i as RefreshCw, l as LogOut } from "../_libs/lucide-react.mjs";
import { l as HiveSwarmLabel, v as Shell } from "./shell-B935WSiB.mjs";
import { a as MorningReportPdf, i as LiveSimPanel, n as ChampionshipSimPanel, r as HiveAdminPanel, t as BoardPlayPanel } from "./board-play-panel-C_mIVVvx.mjs";
import { n as CallWords, u as money } from "./helios-card-B6v2ZTyH.mjs";
import { a as useAppAdmin, n as Lock3dStatusPanel } from "./lock3d-status-BkI_0EwD.mjs";
import { t as AskGrokPanel } from "./ask-grok-panel-DeRRDdqQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app_.admin-BDeZq-Kz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AppAdminPanel() {
	const unlocked = useAppAdmin((s) => s.unlocked);
	const you = useAppAdmin((s) => s.you);
	const token = useAppAdmin((s) => s.token);
	const refresh = useAppAdmin((s) => s.refresh);
	const lock = useAppAdmin((s) => s.lock);
	const [mounted, setMounted] = (0, import_react.useState)(false);
	const [tab, setTab] = (0, import_react.useState)("console");
	(0, import_react.useEffect)(() => setMounted(true), []);
	(0, import_react.useEffect)(() => {
		if (mounted) refresh();
	}, [mounted, refresh]);
	if (!mounted) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-lg px-4 py-10 sm:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-medium tracking-[0.08em] text-muted uppercase",
			children: "login"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-2 text-2xl font-bold tracking-tight text-medium",
			children: "Admin"
		})]
	}) });
	if (!unlocked || !you) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClaimForm, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {
		right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			onClick: () => lock(),
			"aria-label": "Logout",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "hidden sm:inline",
				children: "Logout"
			})]
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-[0.08em] text-muted uppercase",
					children: "Your desk"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 text-2xl font-semibold tracking-tight text-brand sm:text-3xl",
					children: "Admin"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 max-w-2xl text-sm leading-relaxed text-muted",
					children: [
						you.label,
						" · ",
						APP_ADMIN_KIND_LABEL[you.kind],
						" @",
						you.handle,
						". Tape, paper, ",
						TAB_COMPUTE,
						", ",
						TAB_BOARD,
						", SUP3R B0WL, ",
						TAB_HIVE,
						". Accumulate bitcoin. Never sell. Never short."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "desk-tabs mt-5 flex flex-wrap gap-1",
					"aria-label": "Admin sections",
					children: [
						["console", "Console"],
						["wallet", "Wallet"],
						["paper", "Paper"],
						["coin", "Coin"],
						["website", "Website"],
						["access", "Access"],
						["security", "Security"],
						["bowl", "SUP3R B0WL"],
						["hive", "H1V3 SW@RM"]
					].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: cn("inline-flex h-10 min-h-10 items-center rounded-md px-3 text-sm font-medium", tab === id && "is-on", id === "hive" && "hive-nav"),
						onClick: () => setTab(id),
						children: id === "hive" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HiveSwarmLabel, { className: "text-sm" }) : label
					}, id))
				}),
				tab === "console" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConsolePane, {}) : null,
				tab === "wallet" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalletPane, {}) : null,
				tab === "paper" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaperPane, {}) : null,
				tab === "coin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoinPane, {}) : null,
				tab === "website" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WebsitePane, {}) : null,
				tab === "access" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessPane, {}) : null,
				tab === "security" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecurityPane, {}) : null,
				tab === "bowl" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BoardPlayPanel, {
					plane: "app",
					defaultName: you.handle,
					defaultKind: you.kind,
					defaultHandle: you.handle,
					adminToken: token
				}) : null,
				tab === "hive" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HivePane, {}) : null
			]
		})
	});
}
function ClaimForm() {
	const claim = useAppAdmin((s) => s.claim);
	const [kind, setKind] = (0, import_react.useState)("iphone");
	const [handle, setHandle] = (0, import_react.useState)("");
	const [label, setLabel] = (0, import_react.useState)("");
	const [mandate, setMandate] = (0, import_react.useState)(false);
	const [err, setErr] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		setErr(null);
		const fail = await claim({
			kind,
			handle,
			label,
			mandate
		});
		setBusy(false);
		if (fail) setErr(fail);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-lg px-4 py-10 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-[0.08em] text-muted uppercase",
				children: "login"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-2xl font-bold tracking-tight text-medium",
				children: "Admin"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed text-muted",
				children: "Unlock Admin on this downloaded desk. Use your X, Claude, AI agent, Apple, Google, or iPhone name. Mandate: accumulate bitcoin. Never sell. Never short."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => void onSubmit(e),
				className: "mt-6 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-sm",
						htmlFor: "aa-kind",
						children: "Account"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						id: "aa-kind",
						value: kind,
						onChange: (e) => setKind(e.target.value),
						className: "h-11 w-full rounded-md border border-rule bg-surface px-3 text-sm text-fg",
						children: APP_ADMIN_KINDS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: k,
							children: APP_ADMIN_KIND_LABEL[k]
						}, k))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-sm",
						htmlFor: "aa-handle",
						children: "Name or handle"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "aa-handle",
						type: "text",
						autoComplete: "username",
						value: handle,
						onChange: (e) => setHandle(e.target.value),
						className: "h-11 w-full rounded-md border border-rule bg-surface px-3 text-sm text-fg",
						required: true,
						minLength: 2,
						maxLength: 32
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-sm",
						htmlFor: "aa-label",
						children: "Desk label"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "aa-label",
						type: "text",
						value: label,
						onChange: (e) => setLabel(e.target.value),
						className: "h-11 w-full rounded-md border border-rule bg-surface px-3 text-sm text-fg",
						placeholder: "My desk",
						maxLength: 40
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-start gap-2 text-sm text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: mandate,
							onChange: (e) => setMandate(e.target.checked),
							className: "mt-1"
						}), "I will accumulate bitcoin. I will never sell bitcoin. I will never short bitcoin."]
					}),
					err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-down",
						children: err
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "primary",
						type: "submit",
						disabled: busy || !mandate,
						className: "w-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-4" }), "Unlock Admin"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-xs leading-relaxed text-muted",
				children: [
					"This is Admin of ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-fg",
						children: "your"
					}),
					" iOS / Google copy at ",
					APP_ADMIN_PATH,
					". Same tape, paper, and ",
					TAB_COMPUTE,
					" as the main desk."
				]
			})
		]
	}) });
}
function ConsolePane() {
	const token = useAppAdmin((s) => s.token);
	const { snap, refresh } = useDeskTape();
	const cash = usePaper((s) => s.cashUsd);
	const btc = usePaper((s) => s.btc);
	const profitBtc = usePaper((s) => s.profitBtc);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [phone, setPhone] = (0, import_react.useState)("ACCUMULATE");
	const [online, setOnline] = (0, import_react.useState)("ACCUMULATE");
	const combined = combineCompute(phone, online);
	const px = snap?.btc.price ?? 0;
	const nav = cash + (btc + (profitBtc ?? 0)) * px;
	const call = snap ? heliosCall(snap, runBots(snap), nav || 1e3) : null;
	async function reload() {
		setLoading(true);
		try {
			await refresh();
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		if (!snap) peekDeskTape();
	}, [snap]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-6 grid gap-4 lg:grid-cols-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "lg:col-span-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock3dStatusPanel, { className: "mt-0" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveSimPanel, { token }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChampionshipSimPanel, { token }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MorningReportPdf, {
						token,
						canPauseLibrary: false
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-rule bg-surface p-4 sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium tracking-[0.08em] text-muted uppercase",
							children: "7-B0T tape"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => void reload(),
							disabled: loading,
							"aria-label": "Refresh tape",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: cn("size-4", loading && "animate-spin") }), "Refresh"]
						})]
					}),
					call ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CallWords, { call: {
								stance: call.stance,
								conviction: call.conviction
							} }),
							" · clip ",
							money(call.clipUsd)
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: "Reading tape…"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 font-mono text-sm text-fg",
						children: [
							"BTC ",
							px ? money(px) : "—",
							" · paper NAV ",
							money(nav)
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-rule bg-surface p-4 sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs font-medium tracking-[0.08em] text-muted uppercase",
						children: [TAB_COMPUTE, " · combine"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 text-base font-semibold text-fg",
						children: "Phone + online"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: "Grade 7-B0T on this phone (Apple Intelligence / Gemini) and with your online key. Both must ACCUMULATE to ACCUMULATE. Else WAIT. Never sell."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-xs tracking-[0.12em] text-muted uppercase",
							children: ["Phone", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: phone,
								onChange: (e) => setPhone(e.target.value),
								className: "mt-1 min-h-10 w-full rounded-md border border-rule bg-bg px-3 text-sm text-fg",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "ACCUMULATE" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "BUY" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "HOLD" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "WAIT" })
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-xs tracking-[0.12em] text-muted uppercase",
							children: ["Online", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: online,
								onChange: (e) => setOnline(e.target.value),
								className: "mt-1 min-h-10 w-full rounded-md border border-rule bg-bg px-3 text-sm text-fg",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "ACCUMULATE" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "BUY" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "HOLD" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "WAIT" })
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm font-medium text-medium",
						children: ["Combined: ", combined]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "lg:col-span-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AskGrokPanel, { kicker: "BYO online" })
			})
		]
	});
}
function WalletPane() {
	const cash = usePaper((s) => s.cashUsd);
	const btc = usePaper((s) => s.btc);
	const profitBtc = usePaper((s) => s.profitBtc);
	const fills = usePaper((s) => s.fills);
	const reset = usePaper((s) => s.reset);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-6 rounded-lg border border-rule bg-surface p-4 sm:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-[0.08em] text-muted uppercase",
				children: "Wallet"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-1 text-base font-semibold text-fg",
				children: "Your paper book"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm leading-relaxed text-muted",
				children: [
					"Paper cash ",
					money(cash),
					" · BTC ",
					btc.toFixed(6),
					" · profit BTC ",
					(profitBtc ?? 0).toFixed(6),
					". Starting cash",
					" ",
					money(STARTING_CASH),
					". Live Coinbase create stays off. Keys stay on your phone or online service — never here."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted",
				children: [fills.length, " paper fills on this device."]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-4",
				type: "button",
				onClick: () => reset(),
				children: "Reset paper"
			})
		]
	});
}
function PaperPane() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-6 rounded-lg border border-rule bg-surface p-4 sm:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-[0.08em] text-muted uppercase",
				children: "Paper"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-1 text-base font-semibold text-fg",
				children: "Operating mandate"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: "mt-3 list-decimal space-y-2 pl-5 text-sm text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Maximize bitcoin accumulation." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Never sell bitcoin. Never short." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						"Grade 7-B0T on your phone and/or your online key, then tick ",
						TAB_BOARD,
						"."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Paper fills use Coinbase last. This desk never places a live order." })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-xs leading-relaxed text-muted",
				children: [
					"Device paper book only. The host research paper stays on s1r1us.ai system Admin. Championship World Cup / C@LL 0UT pause is on this copy and on system Admin. Pause championship World Cup / C@LL 0UT simulation, the as-live G M0D3 AUTO cycle, and ",
					TAB_HIVE,
					" from Console / Security / ",
					TAB_HIVE,
					"."
				]
			})
		]
	});
}
function CoinPane() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-6 rounded-lg border border-rule bg-surface p-4 sm:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-[0.08em] text-muted uppercase",
				children: "Coin"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-1 text-base font-semibold text-fg",
				children: "Ticker notes"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-relaxed text-muted",
				children: "7-B0T never trades a cultural ticker. Notes stay educational. Your book is bitcoin only."
			})
		]
	});
}
function WebsitePane() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-6 rounded-lg border border-rule bg-surface p-4 sm:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-[0.08em] text-muted uppercase",
				children: "Website"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-1 text-base font-semibold text-fg",
				children: "Public tape"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-relaxed text-muted",
				children: "Same public surfaces as the laptop desk. Open them from this phone."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex h-10 items-center rounded-md border border-rule px-3 text-sm text-tab hover:underline",
						children: "Live Tape"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/board",
						className: "inline-flex h-10 items-center rounded-md border border-rule px-3 text-sm text-tab hover:underline",
						children: TAB_BOARD
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/compute",
						className: "inline-flex h-10 items-center rounded-md border border-rule px-3 text-sm text-tab hover:underline",
						children: TAB_COMPUTE
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/app",
						className: "inline-flex h-10 items-center rounded-md border border-rule px-3 text-sm text-tab hover:underline",
						children: "iOS · Google app"
					})
				]
			})
		]
	});
}
function AccessPane() {
	const you = useAppAdmin((s) => s.you);
	if (!you) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-6 rounded-lg border border-rule bg-surface p-4 sm:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-[0.08em] text-muted uppercase",
				children: "Access"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-1 text-base font-semibold text-fg",
				children: "Your Admin identity"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-3 grid gap-2 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-muted",
						children: "Account"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
						className: "font-mono text-fg",
						children: [
							APP_ADMIN_KIND_LABEL[you.kind],
							" · @",
							you.handle
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-muted",
						children: "Desk"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "text-fg",
						children: you.label
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-muted",
						children: "Opened"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "font-mono text-fg",
						children: you.at
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "Session lives in this browser. BYO compute keys stay in sessionStorage on this device."
			})
		]
	});
}
function SecurityPane() {
	const lock = useAppAdmin((s) => s.lock);
	const token = useAppAdmin((s) => s.token);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-6 rounded-lg border border-rule bg-surface p-4 sm:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-[0.08em] text-muted uppercase",
				children: "Security"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-1 text-base font-semibold text-fg",
				children: "Your copy"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm leading-relaxed text-muted",
				children: [
					"Lock this Admin session. Paper only. Never paste Coinbase keys or wallet seeds. Combine phone compute with an online key — both ACCUMULATE or WAIT. Copy-admin is a device-bound HMAC session (12h) plus mandate — not system 2FA. Host Yubi / FIDO2 stay on s1r1us.ai /admin. Compete on SUP3R B0WL from the SUP3R B0WL tab with a separate board token. Pause ",
					TAB_HIVE,
					", the as-live G M0D3 AUTO / AI agents cycle, and the championship World Cup / C@LL 0UT simulation from this panel. Copy-admin cannot open s1r1us.ai /admin, Yubi, or vault."
				]
			}),
			token ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChampionshipSimPanel, { token }) : null,
			token ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HiveAdminPanel, { token }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "mt-4",
				type: "button",
				onClick: () => lock(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), "Lock Admin"]
			})
		]
	});
}
function HivePane() {
	const token = useAppAdmin((s) => s.token);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-[0.08em] text-muted uppercase",
				children: TAB_HIVE
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-1 text-base font-semibold text-fg",
				children: "Combine BYO compute"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-2xl text-sm leading-relaxed text-muted",
				children: "Phone-app Admin may pause or continue the paper hive. TEST data until go-live. Most TH/s pledged is listed below. This copy cannot open s1r1us.ai /admin, Yubi, or vault."
			}),
			token ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HiveAdminPanel, { token }) : null
		]
	});
}
var SplitComponent = AppAdminPanel;
//#endregion
export { SplitComponent as component };
