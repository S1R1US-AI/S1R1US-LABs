import { o as __toESM } from "../_runtime.mjs";
import { H as require_react, v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as APP_CALLS } from "./brand-iv-XZ0o2.mjs";
import { h as useOperator, n as approveOutgoing } from "./operator-BWqe-TjH.mjs";
import { n as STARTING_CASH } from "./store-DO7K-IX1.mjs";
import { c as fgTone, f as rsiTone, i as USD_TONE, n as Button, s as cn, t as BTC_TONE } from "./renew-password-D361i6FW.mjs";
import { c as Paperclip, f as LoaderCircle, h as Copy, r as ScanSearch } from "../_libs/lucide-react.mjs";
import { s as Panel } from "./shell-BO4fz0h9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/helios-card-BysLYvdA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function YubiApprove({ title, detail, action, onDone, onCancel }) {
	const token = useOperator((s) => s.token);
	const log = useOperator((s) => s.log);
	const [otp, setOtp] = (0, import_react.useState)("");
	const [err, setErr] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function submit(value) {
		const tap = value.trim().toLowerCase();
		if (tap.length !== 44) {
			setErr("Touch the admin YubiKey in this field until 44 characters appear.");
			return;
		}
		setBusy(true);
		setErr(null);
		const res = await approveOutgoing({ data: {
			token,
			otp: tap,
			action
		} });
		setBusy(false);
		if (!res.ok) {
			setErr(res.error);
			setOtp("");
			log("reject", "Outgoing blocked — YubiKey");
			return;
		}
		log("yubi", `Approved ${action}`);
		await onDone();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-end justify-center bg-bg/80 p-4 sm:items-center",
		role: "dialog",
		"aria-modal": "true",
		"aria-labelledby": "yubi-approve-title",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-lg border border-rule bg-surface p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] tracking-[0.16em] text-muted uppercase",
					children: "YubiKey required"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "yubi-approve-title",
					className: "mt-1 text-base font-medium",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm leading-relaxed text-muted",
					children: detail
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-mono text-xs text-accent",
					children: action
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-4 space-y-3",
					onSubmit: (e) => {
						e.preventDefault();
						submit(otp);
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-sm",
							htmlFor: "approve-yubi",
							children: "Either enrolled YubiKey"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "approve-yubi",
							type: "text",
							autoComplete: "off",
							autoCapitalize: "off",
							spellCheck: false,
							autoFocus: true,
							value: otp,
							onChange: (e) => {
								const next = e.target.value.trim().toLowerCase();
								setOtp(next);
								if (next.length === 44) submit(next);
							},
							className: "h-11 w-full rounded-md border border-rule bg-bg px-3 font-mono text-sm text-fg",
							maxLength: 44,
							disabled: busy
						}),
						err ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-down",
							children: [
								err,
								" ",
								err.includes("Enroll") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/admin",
									className: "underline",
									children: "Open Admin"
								}) : null
							]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "primary",
								type: "submit",
								disabled: busy,
								children: "Approve with YubiKey"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								onClick: onCancel,
								children: "Cancel"
							})]
						})
					]
				})
			]
		})
	});
}
function isOutgoingCli(cmd) {
	const t = cmd.toLowerCase();
	if (t.includes("orders create") || t.includes("orders preview")) return true;
	if (t.includes("coinbase send")) return true;
	if (t.includes("coinbase transfer") && (t.includes("currency=btc") || t.includes("currency=usdc"))) return true;
	return false;
}
function ConfirmClip({ call, onCancel, onConfirm }) {
	const sell = call.stance === "TRIM";
	const side = sell ? "SELL" : "BUY";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(YubiApprove, {
		title: sell ? "Approve take-profit send" : "Approve paper buy",
		detail: sell ? `TRIM clip ${money(call.clipUsd, 0)} as BTC to the admin profit wallet (encrypted, Admin only). Paper book only — Coinbase will not receive this send. Admin YubiKey is required.` : `BUY clip ${money(call.clipUsd, 0)} at Coinbase last. Paper book only — Coinbase will not receive this fill. Admin YubiKey is required.`,
		action: `paper:${side}:${Math.round(call.clipUsd)}`,
		onCancel,
		onDone: onConfirm
	});
}
function gateShort(label) {
	if (/orthogonal/i.test(label)) return "two-lane";
	if (/Fear & Greed/i.test(label)) return "F&G";
	if (/Sell wall/i.test(label)) return "sell wall";
	if (/RSI/i.test(label)) return "RSI";
	if (/Long\/short/i.test(label)) return "L/S";
	if (/Funding/i.test(label)) return "funding";
	if (/Kimchi/i.test(label)) return "kimchi";
	if (/CNY/i.test(label)) return "CNY OTC";
	if (/^EM /i.test(label)) return "EM";
	if (/ETF/i.test(label)) return "ETF melt";
	if (/gold/i.test(label)) return "BTC/gold";
	if (/rotat/i.test(label)) return "rotation";
	if (/Mempool|fee spike/i.test(label)) return "fees";
	if (/dry-run|Preview/i.test(label)) return "dry-run";
	if (/Never sell/i.test(label)) return "never-sell";
	return label.split("(")[0].trim().slice(0, 18);
}
function money(n, d = 0) {
	return n.toLocaleString("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: d
	});
}
function stanceClass(s) {
	if (s === "BUY") return "text-high";
	if (s === "ACCUMULATE") return "text-high";
	if (s === "HOLD" || s === "TRIM") return "text-sell";
	if (s === "WAIT") return "text-wait";
	return "text-muted";
}
/** Bot-7 / GM: green only on an announced BUY/ACCUMULATE. HOLD/TRIM stay red. */
function callStanceClass(s) {
	if (s === "BUY" || s === "ACCUMULATE") return "text-high";
	if (s === "HOLD" || s === "TRIM" || s === "SHORT") return "text-sell";
	if (s === "WAIT") return "text-wait";
	if (s === "HEDGE") return "text-tbill";
	return "text-muted";
}
function convictionClass(conviction, stance) {
	if (conviction === "LOW") return "text-sell";
	if (conviction === "MEDIUM") return "text-tab";
	if (conviction === "HIGH" && (stance === "BUY" || stance === "ACCUMULATE")) return "text-high";
	return "text-muted";
}
/** Kicker / CALLS title: green only on an active buy/accumulate. MEDIUM = blue. HOLD = red. */
function bannerTone(call) {
	if (!call) return "text-high";
	if (call.conviction === "LOW") return "text-sell";
	if (call.stance === "BUY" || call.stance === "ACCUMULATE") return "text-high";
	if (call.conviction === "MEDIUM") return "text-tab";
	if (call.stance === "HOLD" || call.stance === "TRIM" || call.stance === "SHORT") return "text-sell";
	return "text-muted";
}
function CallWords({ call, className }) {
	const stanceWord = call.stance === "TRIM" ? "SELL" : call.stance;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: cn("uppercase", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: convictionClass(call.conviction, call.stance),
				children: [call.conviction, " CONVICTION"]
			}),
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: callStanceClass(call.stance),
				children: stanceWord
			})
		]
	});
}
function HeliosCard({ call, grok, grokErr, asking, copied, canFill, onAsk, onCopy, onFill, kicker = "Bot 7", title = APP_CALLS, canAct = true, tape }) {
	const [confirm, setConfirm] = (0, import_react.useState)(false);
	const [copyAsk, setCopyAsk] = (0, import_react.useState)(false);
	const [summaryOpen, setSummaryOpen] = (0, import_react.useState)(false);
	const passed = call ? call.checks.filter((c) => c.pass).length : 0;
	const failed = call ? call.checks.filter((c) => !c.pass) : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
		kicker,
		title,
		kickerClass: bannerTone(call),
		titleClass: bannerTone(call),
		children: call ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-baseline gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CallWords, {
					call,
					className: "text-3xl font-semibold tracking-tight"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: cn("font-mono text-xs", USD_TONE),
					children: ["clip ", money(call.clipUsd, 0)]
				})]
			}),
			tape ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-[13px] tracking-[0.14em] text-muted uppercase",
						children: "BTC-USD"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: cn("mt-0.5 font-mono text-[17px] tabular-nums", USD_TONE),
						children: tape.price != null ? money(tape.price, 0) : "—"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: cn("text-[13px] tracking-[0.14em] uppercase", rsiTone(tape.rsi, tape.rsiAvg ?? null) || "text-muted"),
						children: "RSI-14"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: cn("mt-0.5 font-mono text-[17px] tabular-nums", rsiTone(tape.rsi, tape.rsiAvg ?? null)),
						children: tape.rsi != null ? tape.rsi.toFixed(1) : "—"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: cn("text-[13px] tracking-[0.14em] uppercase", fgTone(tape.fg, tape.fgLabel) || "text-muted"),
						children: "Fear & Greed"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: cn("mt-0.5 font-mono text-[17px] tabular-nums", fgTone(tape.fg, tape.fgLabel)),
						children: tape.fg != null ? String(tape.fg) : "—"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-[13px] tracking-[0.14em] uppercase text-medium",
						title: "How many of Bot 7's add-bitcoin conditions are true. Green = accumulate or buy. Red = wait.",
						children: "Add-BTC"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
						className: call.stance === "BUY" || call.stance === "ACCUMULATE" ? "mt-0.5 font-mono text-[17px] tabular-nums text-high" : "mt-0.5 font-mono text-[17px] tabular-nums text-down",
						children: [
							passed,
							"/",
							call.checks.length
						]
					})] })
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setSummaryOpen((o) => !o),
				"aria-expanded": summaryOpen,
				className: "mt-3 inline-flex min-h-10 items-center gap-2 text-sm font-medium expand-ctl hover:underline",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, {
					className: "size-4 shrink-0",
					"aria-hidden": true
				}), "B0T 7 Summary"]
			}),
			summaryOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-muted",
					children: call.thesis
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1.5",
					children: [...call.checks].sort((a, b) => Number(a.pass) - Number(b.pass)).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-2 font-mono text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: c.pass ? "text-up" : "text-down",
							children: c.pass ? "PASS" : "FAIL"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: c.pass ? "text-muted" : "text-sell",
							children: c.label
						})]
					}, c.label))
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-muted",
				children: failed.length === 0 ? `${passed} of ${call.checks.length} gates pass.` : `${passed} of ${call.checks.length} · FAIL ${failed.map((c) => gateShort(c.label)).join(" · ")}. Expand for the list.`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "mt-4 overflow-x-auto rounded-md bg-bg px-3 py-2 font-mono text-[11px] text-accent",
				children: call.cli
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "primary",
						onClick: () => setConfirm(true),
						disabled: !canAct || !canFill,
						children: call.stance === "TRIM" ? "Paper take-profit" : call.clipUsd > 0 ? "Paper buy clip" : "No clip this cycle"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						disabled: !canAct,
						onClick: () => {
							if (call && isOutgoingCli(call.cli)) setCopyAsk(true);
							else onCopy();
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), copied ? "Copied" : "Copy CLI"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: onAsk,
						disabled: !canAct || asking,
						children: [asking ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanSearch, { className: "size-4" }), "Ask Grok"]
					})
				]
			}),
			canAct ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "Sign in to paper-fill, copy CLI, or Ask Grok."
			}),
			grokErr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-down",
				children: grokErr
			}) : null,
			grok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 whitespace-pre-wrap border-t border-rule pt-3 text-sm leading-relaxed",
				children: grok
			}) : null,
			confirm ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmClip, {
				call,
				onCancel: () => setConfirm(false),
				onConfirm: () => {
					setConfirm(false);
					onFill();
				}
			}) : null,
			copyAsk && call ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(YubiApprove, {
				title: "Approve outgoing CLI",
				detail: "Copying a Coinbase BTC/USDC trade or transfer command requires the admin YubiKey. This does not place a live order.",
				action: `cli:helios:${call.stance}:${Math.round(call.clipUsd)}`,
				onCancel: () => setCopyAsk(false),
				onDone: () => {
					setCopyAsk(false);
					onCopy();
				}
			}) : null
		] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "flex items-center gap-2 text-sm text-muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), " Running first cycle…"]
		})
	});
}
function PaperCard({ mounted, cash, btc, profitBtc = 0, px, fills, onReset }) {
	const nav = cash + (btc + profitBtc) * (px ?? 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		kicker: "Paper Coinbase",
		title: "Accumulator book",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 font-mono text-sm sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-muted",
						children: "NAV"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 tabular-nums",
						children: mounted ? money(nav, 0) : "—"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `text-[11px] ${USD_TONE}`,
						children: "USD"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `mt-1 tabular-nums ${USD_TONE}`,
						children: mounted ? money(cash, 0) : "—"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `text-[11px] ${BTC_TONE}`,
						children: "Hot BTC"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `mt-1 tabular-nums ${BTC_TONE}`,
						children: mounted ? btc.toFixed(6) : "—"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `text-[11px] ${BTC_TONE}`,
						children: "Profit BTC"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `mt-1 tabular-nums ${BTC_TONE}`,
						children: mounted ? profitBtc.toFixed(6) : "—"
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-xs text-muted",
				children: [
					"Starts at ",
					money(STARTING_CASH, 0),
					" paper. TRIM take-profit is recorded here; the destination wallet lives in Admin (encrypted). Not a live send."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 max-h-40 space-y-1 overflow-auto font-mono text-[11px]",
				children: mounted && fills.length ? fills.slice(0, 8).map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: f.side === "BUY" ? "text-high" : "text-sell",
						children: [
							f.side,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: BTC_TONE,
								children: f.btc.toFixed(5)
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: USD_TONE,
						children: money(f.usd, 0)
					})]
				}, f.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-muted",
					children: "No clips yet."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-3",
				onClick: onReset,
				disabled: !onReset,
				children: "Reset paper"
			})
		]
	});
}
//#endregion
export { bannerTone as a, YubiApprove as i, HeliosCard as n, money as o, PaperCard as r, stanceClass as s, CallWords as t };
