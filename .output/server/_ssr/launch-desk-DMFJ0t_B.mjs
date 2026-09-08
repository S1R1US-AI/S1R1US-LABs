import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, U as require_react, v as Link, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { a as COMPANY_X_AVATAR_X400, c as COMPANY_X_HANDLE, d as COMPANY_X_LOGO_NAME, l as COMPANY_X_LABEL, n as ADMIN_X_LABEL, o as COMPANY_X_BANNER, p as COMPANY_X_URL, r as COMPANY_X_ART, t as ADMIN_X_HANDLE, u as COMPANY_X_LOGO_FILE } from "./x-admin-CALKyy-K.mjs";
import { Or as TAB_LAB, Vn as TAB_DESK, r as APP_NAME } from "./brand-1s5EgS5V.mjs";
import { A as ROADMAP_TOTAL, C as OSS_NEEDS, D as RH_NOTE, E as PLATFORM_ROWS, M as TOKEN_UTILITY, O as ROADMAP, T as PATH_A_ORDER, _ as ICP_NOTE, a as COIN_NAME_NOTE, b as MINT_STEPS, c as COMPANY_X_STEPS, d as FUND_INTEGRATION, f as FUND_LANES, g as HOWEY_POSTURE, h as GODADDY_IO, i as COIN_DOMAIN, j as TIERS, k as ROADMAP_STEALTH, l as DNS_STEPS, m as GITHUB_URL, n as CHECKLIST, o as COIN_STANDARD, p as GIFT_RECEIPT, r as COIN_CHAIN_REC, s as COIN_TICKER, t as BUDGET, u as DOMAINS, v as LIQ_BANDS, w as PATH_A_NAME, y as MINT_FLOOR } from "./model-DhC-vhtl.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { l as loadDeskVault, m as secondFactorStatus, v as useOperator } from "./operator-Dxg9KVrW.mjs";
import { i as USD_TONE, n as Button, s as cn, t as BTC_TONE } from "./renew-password-vzG-bo4m.mjs";
import { _ as SeoImage, m as Panel, n as CompanyAvatar, v as Shell } from "./shell-sNlYsMJb.mjs";
import { u as money } from "./helios-card-DBL0i0dt.mjs";
import { n as GODADDY_DNS_ROWS, r as GODADDY_DNS_SKIP } from "./godaddy-dns-DCMIOqdf.mjs";
import { n as SystemOverview } from "./system-overview-Br8z1cWJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/launch-desk-DMFJ0t_B.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DONATE_GOAL_USD = 15e4;
var DONATE_ASK = "Please donate Bitcoin or USDC to support the 7-bot desk. This is a gift — not a sale of tokens, not a share of the book, not s1r1us. [ S1R1U$ <<L@B$>> ] thanks you for your support.";
var fetchDonate = createServerFn({ method: "GET" }).handler(createSsrRpc("ee22c7fb43caf7a85cab1e93c385f89578a27439ee4627d25f82af6f48a4983b"));
function DonateTrack({ compact }) {
	const [d, setD] = (0, import_react.useState)(null);
	const [copied, setCopied] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		fetchDonate().then(setD).catch(() => setD(null));
		const id = window.setInterval(() => {
			fetchDonate().then(setD).catch(() => void 0);
		}, 6e4);
		return () => window.clearInterval(id);
	}, []);
	async function copy(label, text) {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(label);
			window.setTimeout(() => setCopied(null), 1600);
		} catch {
			setCopied(null);
		}
	}
	const raised = d?.raisedUsd ?? 0;
	const pct = d?.pct ?? 0;
	const usdcReady = Boolean(d?.usdcAddress);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("rounded-lg border border-rule bg-surface p-4 sm:p-5", !compact && "mt-8"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs tracking-[0.14em] text-muted uppercase",
				children: "Desk gifts"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "mt-1 text-lg font-semibold tracking-tight text-high sm:text-xl",
				children: ["7-B0T DESK GIFT GOAL ", money(DONATE_GOAL_USD, 0)]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-2xl text-sm leading-relaxed text-fg",
				children: DONATE_ASK
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline justify-between gap-3 font-mono text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: USD_TONE,
							children: [money(raised, 0), " raised"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted",
							children: [
								pct.toFixed(1),
								"% of ",
								money(DONATE_GOAL_USD, 0)
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 h-3 overflow-hidden rounded-sm bg-rule",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-[#ffd24a] transition-[width]",
							style: { width: `${Math.max(pct > 0 ? 2 : 0, pct)}%` }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 font-mono text-xs text-muted",
						children: [
							"BTC ",
							d?.btc != null ? `${d.btc.toFixed(6)} · ${d.btcUsd != null ? money(d.btcUsd, 0) : "—"}` : "—",
							" · ",
							"USDC ",
							d?.usdc != null ? money(d.usdc, 0) : usdcReady ? "0" : "address not published"
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Addr, {
					kicker: "Bitcoin",
					kickerClass: BTC_TONE,
					value: d?.btcAddress ?? "",
					hint: "On-chain BTC · P2SH",
					explorer: d?.btcExplorer,
					copied: copied === "btc",
					onCopy: () => d && void copy("btc", d.btcAddress)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Addr, {
					kicker: "USDC",
					kickerClass: USD_TONE,
					value: usdcReady ? d.usdcAddress : "Save Coinbase USDC receive in Admin → Wallet",
					hint: usdcReady ? `${d?.usdcNetwork} · native USDC only` : "No 0x published yet — BTC donations are live",
					explorer: usdcReady ? d?.usdcExplorer : void 0,
					copied: copied === "usdc",
					onCopy: usdcReady && d ? () => void copy("usdc", d.usdcAddress) : void 0,
					disabled: !usdcReady
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-xs leading-relaxed text-muted",
				children: ["Send only BTC to the Bitcoin address and only native USDC to the 0x (Base preferred). Do not send other tokens, wrapped BTC, or seeds. Gifts are not s1r1us and do not buy the trading book.", d?.source ? ` Balance: ${d.source}.` : ""]
			})
		]
	});
}
function Addr({ kicker, kickerClass, value, hint, explorer, copied, onCopy, disabled }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cn("font-mono text-[11px] tracking-[0.12em] uppercase", kickerClass),
			children: kicker
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 break-all font-mono text-xs text-fg",
			children: value
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-[11px] text-muted",
			children: hint
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-2 flex flex-wrap gap-2",
			children: [onCopy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				size: "sm",
				variant: "outline",
				className: "h-9 px-3 text-xs",
				onClick: onCopy,
				disabled,
				children: copied ? "Copied" : "Copy"
			}) : null, explorer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: explorer,
				target: "_blank",
				rel: "noreferrer",
				className: "inline-flex h-9 items-center rounded-md border border-rule px-3 text-xs hover:bg-fg/6",
				children: "Explorer"
			}) : null]
		})
	] });
}
function usd$1(n) {
	if (n >= 1e3) return `$${(n / 1e3).toFixed(n >= 1e4 ? 0 : 1)}k`;
	return `$${n}`;
}
function usdRange$1(a) {
	if (a[0] === 0 && a[1] === 0) return "—";
	return a[0] === a[1] ? usd$1(a[0]) : `${usd$1(a[0])}–${usd$1(a[1])}`;
}
function MintLaunchPanel({ publicSite = false }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	if (publicSite) return null;
	const rows = ROADMAP;
	const phases = [...new Set(CHECKLIST.map((c) => c.phase))];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		className: "mt-4",
		kicker: "pump.fun",
		title: "Minimum to mint and launch",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-fg",
				children: [
					"Floor to exist on pump.fun:",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: USD_TONE,
						children: [
							usd$1(MINT_FLOOR.minUsd),
							"–",
							usd$1(MINT_FLOOR.maxUsd)
						]
					}),
					" ",
					"(SOL fees). Create is $0. Curve and PumpSwap graduate at $0 extra. ",
					usd$1(15e4),
					" is bot-7 treasury (M6), not a Uniswap seed."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-3 space-y-1.5 text-sm text-muted",
				children: MINT_FLOOR.need.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: line }, line))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4",
				children: rows.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-md border border-rule px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-[11px] text-muted",
						children: [
							"M",
							m.n,
							" · ",
							m.name
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: cn("mt-1 font-mono text-sm tabular-nums", USD_TONE),
						children: [
							usd$1(m.minUsd),
							"–",
							usd$1(m.maxUsd)
						]
					})]
				}, m.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setOpen((o) => !o),
				"aria-expanded": open,
				className: "mt-4 flex w-full items-baseline justify-between gap-3 rounded-md py-1 text-left hover:bg-fg/4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-medium tracking-[0.08em] expand-ctl uppercase",
					children: "Full roadmap + ordered requirements"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-[11px] expand-ctl",
					children: open ? "collapse" : "expand"
				})]
			}),
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-sm text-muted",
					children: [
						"Order is launch order. Amounts are cash you may spend — not a raise target.",
						" ",
						ROADMAP_STEALTH
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[44rem] text-left text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-rule text-xs font-medium tracking-[0.08em] text-muted uppercase",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-3",
										children: "Step"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-3",
										children: "Goal"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-3",
										children: "When"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: cn("py-2 pr-3 text-right", USD_TONE),
										children: "Min"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: cn("py-2 pr-3 text-right", USD_TONE),
										children: "Max"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-3",
										children: "Public?"
									})
								]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-rule/70 align-top",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-2 pr-3 font-mono text-xs text-muted",
										children: ["M", m.n]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-2 pr-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium text-fg",
												children: m.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mt-0.5 block text-xs text-muted",
												children: m.goal
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mt-0.5 block text-[11px] text-muted",
												children: m.hold
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-3 text-xs text-muted",
										children: m.when
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: cn("py-2 pr-3 text-right font-mono text-xs tabular-nums", USD_TONE),
										children: usd$1(m.minUsd)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: cn("py-2 pr-3 text-right font-mono text-xs tabular-nums", USD_TONE),
										children: usd$1(m.maxUsd)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-3 font-mono text-[11px] uppercase text-muted",
										children: m.publicAfterMint ? "after mint" : "admin"
									})
								]
							}, m.id)) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tfoot", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 pr-3 font-mono text-xs",
									colSpan: 3,
									children: "Sum of ranges (do not add every max — M5+M6 are optional)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: cn("py-2 pr-3 text-right font-mono text-xs", USD_TONE),
									children: usdRange$1([ROADMAP_TOTAL[0], ROADMAP_TOTAL[0]])
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: cn("py-2 pr-3 text-right font-mono text-xs", USD_TONE),
									children: usdRange$1([ROADMAP_TOTAL[1], ROADMAP_TOTAL[1]])
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {})
							] }) })
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-xs font-medium tracking-[0.08em] text-muted uppercase",
					children: ["Open source · ", GITHUB_URL.replace("https://", "")]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-2 space-y-1.5 text-sm text-muted",
					children: OSS_NEEDS.map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-xs text-muted",
							children: [i + 1, "."]
						}),
						" ",
						row.need
					] }, row.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-xs font-medium tracking-[0.08em] text-muted uppercase",
					children: "Requirements in order of need"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-2 space-y-3",
					children: phases.map((phase) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-fg",
						children: phase
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-1 space-y-1 text-sm text-muted",
						children: CHECKLIST.filter((c) => c.phase === phase).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: c.required ? "text-fg" : "",
							children: [c.required ? "Required · " : "Optional · ", c.label]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-0.5 block text-xs",
							children: c.detail
						})] }, c.id))
					})] }, phase))
				})] })
			] }) : null
		]
	});
}
var probeLaunch = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("5e1297c3c46a34d5383344d4744427836346a714cac56b3c8b95fc2b8e31450d"));
var probeSiteHealth = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("bd29d0b6bb34b0f97cb375088f5253f65373a39cffb50760d3afefd56a5a4669"));
var useLaunchChecks = create()(persist((set, get) => ({
	done: {},
	toggle: (id) => set({ done: {
		...get().done,
		[id]: !get().done[id]
	} }),
	reset: () => set({ done: {} })
}), { name: "s1rius-launch-checks-v1" }));
function usd(n) {
	if (n >= 1e3) return `$${(n / 1e3).toFixed(n >= 1e4 ? 0 : 1)}k`;
	return `$${n}`;
}
function usdRange(a) {
	if (a[0] === 0 && a[1] === 0) return "—";
	return a[0] === a[1] ? usd(a[0]) : `${usd(a[0])}–${usd(a[1])}`;
}
function sumRange(pick) {
	return BUDGET.reduce((s, r) => [s[0] + r[pick][0], s[1] + r[pick][1]], [0, 0]);
}
function LaunchPage() {
	const role = useOperator((s) => s.role);
	if (!useOperator((s) => s.unlocked) || role !== "admin") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LaunchDesk, {}) });
}
function LaunchDesk() {
	const role = useOperator((s) => s.role);
	const unlocked = useOperator((s) => s.unlocked);
	const done = useLaunchChecks((s) => s.done);
	const toggle = useLaunchChecks((s) => s.toggle);
	const reset = useLaunchChecks((s) => s.reset);
	const [probes, setProbes] = (0, import_react.useState)([]);
	const [at, setAt] = (0, import_react.useState)(null);
	const [err, setErr] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [yubiCount, setYubiCount] = (0, import_react.useState)(0);
	const [vaultOk, setVaultOk] = (0, import_react.useState)(false);
	const [health, setHealth] = (0, import_react.useState)(null);
	async function refresh() {
		setBusy(true);
		setErr(null);
		try {
			const token = useOperator.getState().token;
			if (!token) {
				setErr("Admin session required.");
				return;
			}
			const [p, y, v, h] = await Promise.all([
				probeLaunch({ data: { token } }),
				secondFactorStatus().catch(() => null),
				loadDeskVault({ data: { token } }).catch(() => null),
				probeSiteHealth({ data: { token } }).catch(() => null)
			]);
			setProbes(p.domains);
			setAt(p.at);
			if (h) setHealth(h);
			if (y) setYubiCount(y.yubiCount ?? 0);
			setVaultOk(Boolean(v && v.ok && v.vault.profitAddress));
		} catch (e) {
			setErr(e instanceof Error ? e.message : "Launch probe failed");
		} finally {
			setBusy(false);
		}
	}
	(0, import_react.useEffect)(() => {
		if (unlocked) refresh();
	}, [unlocked]);
	const auto = (0, import_react.useMemo)(() => {
		return {
			by: new Map(probes.map((d) => [d.name, d])),
			yubi: yubiCount >= 2,
			vault: vaultOk,
			lock: true
		};
	}, [
		probes,
		yubiCount,
		vaultOk
	]);
	function itemOn(c) {
		if (c.kind === "auto-domain" && c.domain) {
			const d = auto.by.get(c.domain);
			return d ? d.available === false : false;
		}
		if (c.kind === "auto-yubi") return auto.yubi;
		if (c.kind === "auto-vault") return auto.vault;
		if (c.kind === "auto-lock") return auto.lock;
		return Boolean(done[c.id]);
	}
	const req = CHECKLIST.filter((c) => c.required);
	const reqOn = req.filter(itemOn).length;
	const allOn = CHECKLIST.filter(itemOn).length;
	if (!unlocked || role !== "admin") return null;
	const phases = [...new Set(CHECKLIST.map((c) => c.phase))];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-[0.08em] text-muted uppercase",
				children: "Marketing ticker · Path A"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 text-2xl font-semibold tracking-tight text-brand sm:text-3xl",
				children: "s1r1us — not the desk"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MintLaunchPanel, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SystemOverview, { showRoadmap: true }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 max-w-3xl text-sm leading-relaxed text-muted",
				children: [
					"Path A is locked. ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-fg",
						children: COIN_TICKER
					}),
					" is a marketing ticker — not",
					" ",
					APP_NAME,
					", not ",
					TAB_DESK,
					", not how 7-B0T buys bitcoin. Desk book = operator cash + gifts that get nothing back. Same admin door. 7-B0T never trades this ticker. TOKEN_LAUNCHED =",
					" ",
					"true",
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DonateTrack, { compact: true })
			}),
			err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-down",
				children: err
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => void refresh(),
					disabled: busy,
					children: busy ? "Probing…" : "Refresh live checks"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: at ? `DNS ${new Date(at).toLocaleString()}` : "Waiting on Cloudflare DNS…"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, {
						k: "Token",
						v: COIN_TICKER,
						hint: "lowercase name + ticker"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, {
						k: "Domain",
						v: COIN_DOMAIN,
						hint: "GoDaddy .ai"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, {
						k: "Tape",
						v: TAB_DESK,
						hint: TAB_LAB
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, {
						k: "Standard",
						v: "pump.fun",
						hint: COIN_CHAIN_REC
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, {
						k: "Go-live",
						v: `${reqOn}/${req.length}`,
						hint: `${allOn}/${CHECKLIST.length} all boxes · required`,
						tone: reqOn === req.length ? "text-up" : "text-medium"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "mt-4",
				kicker: "Funding",
				title: "Path A — desk gifts vs marketing ticker",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-medium text-high",
						children: [
							PATH_A_NAME,
							" · ",
							"LOCKED — standing order in force"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-fg",
						children: GIFT_RECEIPT
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted",
						children: PATH_A_ORDER.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: line }, line))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: FUND_INTEGRATION
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-fg",
						children: TOKEN_UTILITY.oneLiner
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs leading-relaxed text-muted",
						children: TOKEN_UTILITY.howey
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm font-medium text-fg",
						children: HOWEY_POSTURE.problem
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 space-y-3",
						children: HOWEY_POSTURE.paths.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: cn("text-sm", p.id === HOWEY_POSTURE.chosen ? "font-medium text-high" : "text-muted"),
							children: p.id === HOWEY_POSTURE.chosen ? p.name : `${p.name} · not chosen`
						}), p.id === HOWEY_POSTURE.chosen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs leading-relaxed text-muted",
							children: p.does
						}) : null] }, p.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-xs leading-relaxed text-muted",
						children: [
							"Do not say: ",
							HOWEY_POSTURE.forbiddenPitch.join(" · "),
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[44rem] text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-rule text-xs font-medium tracking-[0.08em] text-muted uppercase",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-3",
										children: "Lane"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-3",
										children: "Kind"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-3",
										children: "Size"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-3",
										children: "Maps to"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-3",
										children: "Honest odds"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: FUND_LANES.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-rule/70 align-top",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-2 pr-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-fg",
											children: f.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mt-0.5 block text-xs text-muted",
											children: f.how
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-3 font-mono text-[11px] uppercase text-muted",
										children: f.kind
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-3 font-mono text-xs",
										children: f.size
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-3 text-xs",
										children: f.mapsTo
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-3 text-xs text-muted",
										children: f.odds
									})
								]
							}, f.id)) })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm font-medium text-fg",
						children: "Liquidity to launch vs stabilize (90 days)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[40rem] text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-rule text-xs font-medium tracking-[0.08em] text-muted uppercase",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-3",
										children: "Band"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-3",
										children: "Launch (you spend)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-3",
										children: "Stabilize"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-3",
										children: "Note"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: LIQ_BANDS.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-rule/70 align-top",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-3 font-medium",
										children: b.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: cn("py-2 pr-3 font-mono text-xs", USD_TONE),
										children: b.launchUsd
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: cn("py-2 pr-3 font-mono text-xs", USD_TONE),
										children: b.stabilizeUsd
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-3 text-xs text-muted",
										children: b.note
									})
								]
							}, b.id)) })]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "mt-4",
				kicker: "Mint",
				title: "How the marketing ticker is created — not the desk book",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-fg",
						children: [
							"Pick ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: "pump.fun on Solana, USDC curve"
							}),
							". Create is $0. Retail buys the curve. You do not deposit $150k to open a book. Do not tell anyone the token funds BTC clips. Desk stacks from operator cash and gifts with nothing back. Locked LP stays LP."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-4 list-decimal space-y-2 pl-5 text-sm",
						children: MINT_STEPS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-fg",
							children: s
						}, s.slice(0, 40)))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[40rem] text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-rule text-xs font-medium tracking-[0.08em] text-muted uppercase",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-3",
										children: "Venue"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-3",
										children: "Retail / viral"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-3",
										children: "Launch cost"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-3",
										children: "Pair with USDC/BTC"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-3",
										children: "Call"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: PLATFORM_ROWS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-rule/70 align-top",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: cn("py-2 pr-3 font-medium", r.pick && "text-up"),
										children: r.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-3",
										children: r.viral
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-3 font-mono text-xs",
										children: r.launchUsd
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-3 text-xs",
										children: r.pair
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-3 text-xs text-muted",
										children: r.verdict
									})
								]
							}, r.id)) })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-xs leading-relaxed text-muted",
						children: RH_NOTE
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs leading-relaxed text-muted",
						children: ICP_NOTE
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "mt-4",
				kicker: "Identity",
				title: "Name + domains",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							"Token: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-fg",
								children: COIN_TICKER
							}),
							". ",
							COIN_NAME_NOTE,
							" ",
							COIN_STANDARD,
							". Canonical host ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-fg",
								children: COIN_DOMAIN
							}),
							". S1R1U$.io is not a legal hostname."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[36rem] text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-rule text-xs font-medium tracking-[0.08em] text-muted uppercase",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-3",
										children: "Domain"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-3",
										children: "Role"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-3",
										children: "Live DNS"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-3",
										children: "GoDaddy"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: DOMAINS.map((d) => {
								const p = probes.find((x) => x.name === d.name);
								const avail = p?.available;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b border-rule/70",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 pr-3 font-mono text-fg",
											children: d.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 pr-3 text-muted",
											children: d.role
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: cn("py-2 pr-3 font-mono text-xs", avail === true && "text-up", avail === false && "text-down", avail == null && "text-muted"),
											children: p ? p.status : "…"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 pr-3 text-xs text-muted",
											children: d.name.endsWith(".ai") || d.name.endsWith(".xyz") || d.name.endsWith(".io") ? avail === true ? `Register ~$${GODADDY_IO.renewalUsd}/yr` : avail === false ? "Taken — aftermarket" : "—" : avail === false ? "Taken (NS live)" : "—"
										})
									]
								}, d.name);
							}) })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-xs text-muted",
						children: [
							GODADDY_IO.promoNote,
							". Renewal $",
							GODADDY_IO.renewalUsd,
							". ",
							GODADDY_IO.privacy,
							".",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								className: "underline",
								href: GODADDY_IO.buy,
								target: "_blank",
								rel: "noreferrer",
								children: "GoDaddy .ai"
							}),
							". Probe: NXDOMAIN = not in DNS yet; Registered = you own it (refresh after nameservers publish). Premium carts can still lie — you already bought s1r1us.ai."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "mt-4",
				kicker: "DNS",
				title: "Lock the name — do not Airo the site",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Set DNS/lock first. Do not build the public site with GoDaddy AI. I can ship a static s1r1us.ai page in this project when you want it — disclaimer, ticker, X, deposit watch-only. Not the admin desk."
					}),
					health ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 rounded-md border border-rule p-3 font-mono text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-fg",
								children: health.verdict
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-muted",
								children: ["A ", health.apexA.join(" ") || "—"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-muted",
								children: ["www A ", health.wwwA?.join(" ") || "—"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-muted",
								children: ["www CNAME ", health.wwwCname.join(" ") || "—"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-muted",
								children: [
									"HTTP ",
									health.http.status,
									" ",
									health.http.body.slice(0, 80)
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-muted",
								children: ["TLS ", health.tls]
							})
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-fg",
						children: "GoDaddy A records already point at DigitalOcean. HTTPS stays down until the app deploy is green and s1r1us.ai is added under App Settings → Domains (that is what issues TLS). Do not change nameservers."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-4 list-decimal space-y-2 pl-5 text-sm",
						children: DNS_STEPS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-fg",
							children: s
						}, s.slice(0, 48)))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 font-mono text-xs tracking-[0.12em] text-muted uppercase",
						children: "GoDaddy → s1r1us.ai → DNS → Records"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[36rem] text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-rule text-xs font-medium tracking-[0.08em] text-muted uppercase",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-3",
										children: "Type"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-3",
										children: "Name"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-3",
										children: "Value"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-3",
										children: "TTL"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-3",
										children: "Use"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: GODADDY_DNS_ROWS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-rule/70 align-top",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-3 font-mono",
										children: r.type
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-3 font-mono",
										children: r.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-3 font-mono text-fg",
										children: r.value
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-3 font-mono",
										children: r.ttl
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-3 text-xs text-muted",
										children: r.why
									})
								]
							}, `${r.type}-${r.name}-${r.value}`)) })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 list-disc space-y-1 pl-5 text-xs text-muted",
						children: GODADDY_DNS_SKIP.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: s }, s))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-xs text-muted",
						children: ["Public page path after DNS works: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-fg",
							children: "https://s1r1us.ai/s1r1us"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/s1r1us",
						className: "mt-4 inline-flex h-10 min-h-10 items-center rounded-md border border-rule px-3 text-sm hover:bg-fg/6",
						children: "Open s1r1us.ai page"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "mt-4",
				kicker: "X",
				title: `${COMPANY_X_LABEL} account`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-start gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompanyAvatar, {
								size: 96,
								className: "h-24 w-24 ring-1 ring-rule"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[11px] text-muted",
								children: "profile pic"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted",
									children: [
										"New company account under ",
										ADMIN_X_LABEL,
										". You pick display and handle. Do not use",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-fg",
											children: "@S1R1US"
										}),
										" (blocked) or",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-fg",
											children: "@_S1R1US_"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [". Live handle ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-fg",
											children: COMPANY_X_HANDLE
										})] }),
										". This login cannot open Admin, Wallet, or copy outgoing BTC/USDC. Operator stays ",
										ADMIN_X_HANDLE,
										"."
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoImage, {
									src: COMPANY_X_BANNER,
									desc: "S1R1US AI (@S1R1US_AI) · G0DZ1LLa M0D3 (Godzilla mode) company X header · S1R1US Labs",
									className: "mt-3 w-full max-w-xl rounded-md border border-rule object-cover"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex flex-wrap gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: COMPANY_X_LOGO_FILE,
											download: "S1R!US-Godzilla-Logo.jpg",
											className: "inline-flex h-10 min-h-10 items-center rounded-md border border-rule px-3 text-sm hover:bg-fg/6",
											children: ["Download ", COMPANY_X_LOGO_NAME]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: COMPANY_X_AVATAR_X400,
											download: "S1R!US-Godzilla-Logo-400.jpg",
											className: "inline-flex h-10 min-h-10 items-center rounded-md border border-rule px-3 text-sm hover:bg-fg/6",
											children: "X profile 400×400"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: COMPANY_X_BANNER,
											download: "S1R1US-banner.jpg",
											className: "inline-flex h-10 min-h-10 items-center rounded-md border border-rule px-3 text-sm hover:bg-fg/6",
											children: "Download header"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: COMPANY_X_ART,
											download: "S1R1US-art.png",
											className: "inline-flex h-10 min-h-10 items-center rounded-md border border-rule px-3 text-sm hover:bg-fg/6",
											children: "Full frame"
										})
									]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-4 list-decimal space-y-2 pl-5 text-sm",
						children: COMPANY_X_STEPS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-fg",
							children: s
						}, s))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-xs text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								"After you create it, open",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									className: "underline",
									href: COMPANY_X_URL,
									target: "_blank",
									rel: "noreferrer",
									children: COMPANY_X_URL
								}),
								". Upload the avatar (400×400) and header (1500×500) on X.",
								" "
							] }),
							"Tick the Identity boxes when the handle is live and the parent has pinned it. This desk cannot create the X account — only ",
							ADMIN_X_HANDLE,
							" can."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "mt-4",
				kicker: "Capital",
				title: "What it actually costs to fund the book",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-3 sm:grid-cols-3",
						children: TIERS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md border border-rule p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] font-medium tracking-[0.08em] text-muted uppercase",
									children: t.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: cn("mt-1 font-mono text-lg tabular-nums", USD_TONE),
									children: t.range
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted",
									children: t.netToBook
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-fg",
									children: t.verdict
								})
							]
						}, t.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[40rem] text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-rule text-xs font-medium tracking-[0.08em] text-muted uppercase",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-3",
										children: "Line"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-3 text-right",
										children: "Survive"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-3 text-right",
										children: "Fund $25k book"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-3 text-right",
										children: "TGE"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-3",
										children: "Note"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [BUDGET.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-rule/70 align-top",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-2 pr-3",
										children: [r.item, r.recoverable ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-[11px] text-muted",
											children: "inventory"
										}) : null]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-3 text-right font-mono tabular-nums",
										children: usdRange(r.surviveUsd)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: cn("py-2 pr-3 text-right font-mono tabular-nums", USD_TONE),
										children: usdRange(r.fundUsd)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-3 text-right font-mono tabular-nums",
										children: usdRange(r.tgeUsd)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-3 text-xs text-muted",
										children: r.note
									})
								]
							}, r.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "font-medium",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-3",
										children: "Total committed"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-3 text-right font-mono",
										children: usdRange(sumRange("surviveUsd"))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: cn("py-2 pr-3 text-right font-mono", USD_TONE),
										children: usdRange(sumRange("fundUsd"))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-3 text-right font-mono",
										children: usdRange(sumRange("tgeUsd"))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-3 text-xs text-muted",
										children: "LP is held, not spent — until it dumps."
									})
								]
							})] })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs text-muted",
						children: "Figures are 2026 street ranges. pump.fun mint is $0 — do not budget $150k as seed LP. SuperGrok remains the operator Ask Grok path. Visitors use BYO compute. Token legal is a different bill."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "mt-4",
				kicker: "Go live",
				title: "Checklist — live on refresh",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-4 h-2 overflow-hidden rounded-full bg-rule",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-high",
							style: { width: `${Math.round(reqOn / Math.max(req.length, 1) * 100)}%` }
						})
					}),
					phases.map((phase) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] font-medium tracking-[0.08em] text-muted uppercase",
							children: phase
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 space-y-2",
							children: CHECKLIST.filter((c) => c.phase === phase).map((c) => {
								const on = itemOn(c);
								const auto = c.kind !== "manual";
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "rounded-md border border-rule px-3 py-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex cursor-pointer items-start gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											className: "mt-1",
											checked: on,
											disabled: auto,
											onChange: () => toggle(c.id)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex flex-wrap items-baseline gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: cn("text-sm font-medium", on ? "text-up" : "text-fg"),
													children: c.label
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[11px] text-muted",
													children: [auto ? "live probe" : "operator", c.required ? " · required" : ""]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mt-0.5 block text-xs text-muted",
												children: c.detail
											})]
										})]
									})
								}, c.id);
							})
						})]
					}, phase)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: reset,
						children: "Clear operator ticks"
					})
				]
			})
		]
	});
}
function Kicker({ k, v, hint, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border border-rule p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-medium tracking-[0.08em] text-muted uppercase",
				children: k
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("mt-1 font-mono text-lg tabular-nums", tone),
				children: v
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 line-clamp-2 text-[11px] text-muted",
				children: hint
			})
		]
	});
}
//#endregion
export { LaunchPage as n, probeSiteHealth as r, LaunchDesk as t };
