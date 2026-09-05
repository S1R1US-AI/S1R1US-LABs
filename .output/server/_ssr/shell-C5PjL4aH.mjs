import { o as __toESM } from "../_runtime.mjs";
import { H as require_react, v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as companyHandleSet, d as looksLikeCompanyX, i as COMPANY_X_AVATAR, s as COMPANY_X_LABEL } from "./x-admin-SEv9ocnZ.mjs";
import { _ as TAB_GM, m as TAB_FEED, n as APP_NAME, p as TAB_DESK, v as TAB_LAB } from "./brand-Cp1yHL3f.mjs";
import { f as looksLikeSecret } from "./security-BnzJhXOQ.mjs";
import { f as secondFactorStatus, h as useOperator } from "./operator-CjolfudZ.mjs";
import { b as OSS_LINK, x as OSS_LINK_LABEL } from "./model-BDYnRLDC.mjs";
import { r as signIn } from "./client-CVqXY6bk.mjs";
import { a as XRenewWhenAdmin, m as useCurrentUserState, n as Button, p as useCurrentUser, s as cn } from "./renew-password-CG6N7eCr.mjs";
import { i as GROK_PROVIDERS } from "./server-BXTHZoU1.mjs";
import { t as UserButton } from "./gates-CxJot6yJ.mjs";
import { d as Lock, l as LogOut, u as LogIn } from "../_libs/lucide-react.mjs";
import { i as rainGmBurst } from "./router-BvK0OgRL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shell-C5PjL4aH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CompanyAvatar({ size = 32, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: COMPANY_X_AVATAR,
		alt: COMPANY_X_LABEL,
		width: size,
		height: size,
		className: cn("shrink-0 rounded-full bg-black object-cover", className)
	});
}
/** Hidden until a live (non-blocked) company handle is set. */
function CompanyXChip({ className }) {
	if (!companyHandleSet() || true) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
		href: "",
		target: "_blank",
		rel: "noreferrer",
		className: cn("inline-flex items-center gap-2", className),
		"aria-label": `company X on X`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompanyAvatar, {
			size: 28,
			className: "h-7 w-7 ring-1 ring-rule"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "leading-tight",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-xs font-bold tracking-tight text-fg",
				children: "company X"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block font-mono text-[10px] text-muted",
				children: ""
			})]
		})]
	});
}
function OperatorGate({ children }) {
	const [mounted, setMounted] = (0, import_react.useState)(false);
	const unlocked = useOperator((s) => s.unlocked);
	const role = useOperator((s) => s.role);
	const yubiTicket = useOperator((s) => s.yubiTicket);
	(0, import_react.useEffect)(() => setMounted(true), []);
	if (!mounted) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockForm, { pending: true });
	if (yubiTicket) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(YubiForm, {});
	if (!unlocked || role !== "admin") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockForm, { userOnly: unlocked && role === "user" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function LockForm({ pending, userOnly }) {
	const user = useCurrentUser();
	const unlock = useOperator((s) => s.unlock);
	const idleLocked = useOperator((s) => s.idleLocked);
	const [name, setName] = (0, import_react.useState)("");
	const [pass, setPass] = (0, import_react.useState)("");
	const [err, setErr] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [xAdmin, setXAdmin] = (0, import_react.useState)(false);
	const [xErr, setXErr] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (pending || !user) {
			setXAdmin(false);
			return;
		}
		setXAdmin(false);
		let gone = false;
		(async () => {
			try {
				const st = await secondFactorStatus();
				if (gone) return;
				setXAdmin(Boolean(st.allowed));
			} catch {
				if (!gone) setXAdmin(false);
			}
		})();
		return () => {
			gone = true;
		};
	}, [pending, user]);
	async function onSubmit(e) {
		e.preventDefault();
		if (looksLikeSecret(name) || looksLikeSecret(pass)) {
			setErr("Secret rejected. Never paste a Coinbase key or wallet seed into this desk.");
			setPass("");
			return;
		}
		setBusy(true);
		setErr(null);
		const fail = await unlock(name, pass);
		setBusy(false);
		if (fail && fail !== "yubi") {
			setErr(fail);
			setPass("");
		}
	}
	function guardPaste(e) {
		const t = e.clipboardData.getData("text");
		if (looksLikeSecret(t)) {
			e.preventDefault();
			setErr("Secret rejected. Never paste a Coinbase key or wallet seed into this desk.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-lg px-4 py-10 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-[0.08em] text-muted uppercase",
				children: idleLocked ? "Idle lock" : "login"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-2xl font-bold tracking-tight text-medium",
				children: APP_NAME
			}),
			userOnly ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed text-down",
				children: "This login is a desk user. Admin is only the operator X account plus name and password."
			}) : null,
			idleLocked || user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm leading-relaxed text-muted",
				children: [idleLocked ? "Screensaver locked the desk. Sign in again with your name and password." : null, user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					idleLocked ? " " : null,
					"Signed in as ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-fg",
						children: user.displayName ?? user.primaryEmail
					}),
					"."
				] }) : null]
			}) : null,
			!user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 space-y-2",
				children: [GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "primary",
					className: "w-full",
					type: "button",
					disabled: pending,
					onClick: () => void signIn(p.providerId, { callbackURL: "/admin" }),
					children: "Continue with X"
				}, p.providerId)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs leading-relaxed text-muted",
					children: "Admin needs the operator X account, then name and password. Other X accounts and desk users stay users — they cannot open Admin, Wallet, or send."
				})]
			}) : null,
			user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {}), xAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-high",
					children: "Operator X verified. Enter name and password to finish."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "This X account is not the operator. Name + password opens a user session only."
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => void onSubmit(e),
				className: "mt-6 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-sm",
						htmlFor: "op-user",
						children: "Name"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "op-user",
						type: "text",
						autoComplete: "username",
						value: name,
						onChange: (e) => setName(e.target.value),
						onPaste: guardPaste,
						className: "h-11 w-full rounded-md border border-rule bg-surface px-3 text-sm text-fg",
						required: true,
						disabled: pending
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-sm",
						htmlFor: "op-pass",
						children: "Password"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "op-pass",
						type: "password",
						autoComplete: "current-password",
						value: pass,
						onChange: (e) => setPass(e.target.value),
						onPaste: guardPaste,
						className: "h-11 w-full rounded-md border border-rule bg-surface px-3 text-sm text-fg",
						required: true,
						disabled: pending
					}),
					err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-down",
						children: err
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "primary",
						type: "submit",
						disabled: busy || pending,
						className: "w-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-4" }), "Unlock desk"]
					})
				]
			}),
			user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(XRenewWhenAdmin, {}) : null
		]
	});
}
function YubiForm() {
	const tapYubi = useOperator((s) => s.tapYubi);
	const lock = useOperator((s) => s.lock);
	const [otp, setOtp] = (0, import_react.useState)("");
	const [err, setErr] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function submit(value) {
		const tap = value.trim().toLowerCase();
		if (tap.length !== 44) {
			setErr("Touch the YubiKey in this field until 44 characters appear.");
			return;
		}
		setBusy(true);
		setErr(null);
		const fail = await tapYubi(tap);
		setBusy(false);
		if (fail) {
			setErr(fail);
			setOtp("");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-lg px-4 py-10 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[11px] tracking-[0.18em] text-muted uppercase",
				children: "YubiKey"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-mono text-2xl font-bold tracking-wide text-medium",
				children: APP_NAME
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed text-muted",
				children: "Touch the enrolled YubiKey with this field focused. Short-press emits a Yubico OTP. Do not paste a Coinbase secret here."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-6 space-y-3",
				onSubmit: (e) => {
					e.preventDefault();
					submit(otp);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-sm",
						htmlFor: "yubi-otp",
						children: "YubiKey"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "yubi-otp",
						type: "text",
						inputMode: "text",
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
						className: "h-11 w-full rounded-md border border-rule bg-surface px-3 font-mono text-sm text-fg",
						maxLength: 44,
						disabled: busy
					}),
					err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-down",
						children: err
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "primary",
						type: "submit",
						disabled: busy,
						className: "w-full",
						children: "Verify YubiKey"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						className: "w-full",
						onClick: () => void lock(),
						children: "Back"
					})
				]
			})
		]
	});
}
function AdminAuthControl() {
	const unlocked = useOperator((s) => s.unlocked);
	const lock = useOperator((s) => s.lock);
	if (unlocked) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		onClick: () => void lock(),
		"aria-label": "Logout",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "hidden sm:inline",
			children: "Logout"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/login",
		className: "inline-flex h-10 min-h-10 items-center gap-2 rounded-md px-3 text-sm font-medium text-brand hover:bg-brand/10",
		"aria-label": "login",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "size-4" }), "login"]
	});
}
/** Robotic Godzilla — laser visor. Body follows currentColor; beams stay red unless `beam="green"`. */
function GodzillaMark({ className, beam = "red" }) {
	const laser = beam === "green" ? "#3dff1a" : "#ff1f1f";
	const hot = beam === "green" ? "#b7ff7a" : "#ffd24a";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 72 40",
		className,
		"aria-hidden": true,
		fill: "currentColor",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M14 4l3 10H12zm7-2l3 12h-5zm7 1l4 11h-6zm8 2l5 9h-7z" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M10 14h36l-2 5H12z" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M8 19h40v12H8z",
				opacity: "0.92"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 19h32v3H12z" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "14",
				y: "23",
				width: "28",
				height: "6",
				fill: "#070908"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "17",
				y: "24.5",
				width: "8",
				height: "3",
				fill: laser
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "31",
				y: "24.5",
				width: "8",
				height: "3",
				fill: laser
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "19",
				y: "24.5",
				width: "3",
				height: "3",
				fill: hot
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "33",
				y: "24.5",
				width: "3",
				height: "3",
				fill: hot
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "48",
				y: "25",
				width: "24",
				height: "1.6",
				fill: laser
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "48",
				y: "26.7",
				width: "18",
				height: "1.1",
				fill: beam === "green" ? "#6fbf63" : "#ff7a18",
				opacity: "0.85"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M14 31h28l-3 6H17z",
				opacity: "0.9"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "18",
				y: "32.5",
				width: "3",
				height: "3",
				fill: "#070908"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "24",
				y: "32.5",
				width: "3",
				height: "3",
				fill: "#070908"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "30",
				y: "32.5",
				width: "3",
				height: "3",
				fill: "#070908"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "36",
				y: "32.5",
				width: "3",
				height: "3",
				fill: "#070908"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M2 28h8v10H2zM46 28h8v10h-8z" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "24",
				y: "29",
				width: "8",
				height: "2",
				fill: laser,
				opacity: "0.7"
			})
		]
	});
}
function GmRainbow({ text, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: className ? `gm-rainbow ${className}` : "gm-rainbow",
		"aria-label": text,
		children: Array.from(text).map((ch, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			style: { animationDelay: `${i % 12 * -.28}s` },
			children: ch === " " ? "\xA0" : ch
		}, `${ch}-${i}`))
	});
}
var LINKS = [{
	to: "/",
	label: TAB_DESK
}, {
	to: "/helios",
	label: TAB_LAB
}];
function Shell({ children, right }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "no-print sticky top-0 z-30 border-b border-rule bg-bg/90 backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "flex min-w-0 items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompanyAvatar, {
								size: 36,
								className: "h-9 w-9 ring-1 ring-rule"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium tracking-[0.08em] text-high uppercase",
									children: "7-B0T H3DGE FUND"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-bold tracking-tight text-medium sm:text-base",
									children: APP_NAME
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "desk-tabs flex flex-wrap gap-1",
							children: [
								LINKS.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: l.to,
									className: "inline-flex min-h-10 max-w-[11.5rem] items-center rounded-md px-2.5 py-1.5 text-left text-xs font-medium leading-tight sm:max-w-none sm:px-3 sm:text-sm",
									activeProps: { className: "is-on inline-flex min-h-10 max-w-[11.5rem] items-center rounded-md px-2.5 py-1.5 text-left text-xs font-medium leading-tight sm:max-w-none sm:px-3 sm:text-sm" },
									children: l.label
								}, l.to)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/gm",
									title: TAB_GM,
									className: "gm-tab inline-flex min-h-12 items-center gap-2 rounded-md px-3 py-1.5 text-sm font-bold tracking-tight",
									onClick: () => rainGmBurst(3e3),
									activeProps: { className: "gm-tab is-on inline-flex min-h-12 items-center gap-2 rounded-md px-3 py-1.5 text-sm font-bold tracking-tight" },
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GodzillaMark, { className: "h-5 w-8 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GmRainbow, { text: TAB_GM })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/f33d",
									title: TAB_FEED,
									className: "gm-tab inline-flex min-h-12 items-center gap-2 rounded-md px-3 py-1.5 text-sm font-bold tracking-tight",
									activeProps: { className: "gm-tab is-on inline-flex min-h-12 items-center gap-2 rounded-md px-3 py-1.5 text-sm font-bold tracking-tight" },
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GodzillaMark, {
										className: "h-5 w-8 shrink-0",
										beam: "green"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GmRainbow, { text: TAB_FEED })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminNavLink, {})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompanyXChip, { className: "hidden sm:inline-flex" }), right]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "no-print mt-auto border-t border-rule/60",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-6xl px-4 py-3 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/s1r1us",
							className: "font-mono text-[11px] tracking-[0.12em] text-muted/45 hover:text-muted",
							children: "s1r1us.ai"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex max-w-3xl flex-wrap items-center justify-end gap-x-2 font-mono text-[11px] leading-relaxed tracking-[0.04em] text-oss",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/sitemap",
									className: "text-oss hover:underline",
									children: "Sitemap"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									"aria-hidden": true,
									children: "|"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/faq",
									className: "text-oss hover:underline",
									children: "FAQ"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									"aria-hidden": true,
									children: "|"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "/s1r1us-labs-github.zip",
									download: "s1r1us-labs-github.zip",
									className: "text-oss hover:underline",
									children: "source pack"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									"aria-hidden": true,
									children: "|"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: OSS_LINK,
									target: "_blank",
									rel: "noreferrer",
									className: "text-oss hover:underline",
									"aria-label": "HELP 7-BOT HEDGE FUND S1R1US LABS GO OPEN SOURCE. OP3N S0URC3 is open source.",
									children: [OSS_LINK_LABEL, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "seo-copy",
										children: "HELP 7-BOT HEDGE FUND [ S1R1US LABS ] GO OPEN SOURCE. OP3N S0URC3 means open source. S1R1U$ 7-B0t Hedge Fund is S1R1US 7-bot hedge fund. G0DZ1LLa M0D3 is Godzilla mode. S1R1U$ L@B Strategies is S1R1US Lab Strategies."
									})]
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DisclaimerBlock, {})]
				})
			})
		]
	});
}
function DisclaimerBlock() {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => setOpen((v) => !v),
			"aria-expanded": open,
			className: cn("text-[11px] font-bold tracking-[0.16em] uppercase", open ? "text-sell" : "text-muted"),
			children: "DISCLAIMER"
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-2 max-w-4xl font-mono text-[10px] leading-relaxed text-muted",
			children: [
				TAB_LAB,
				" is NOT considered financial advice or a financial recommendation. S1R1US.ai and the 7-B0T H3DG3 Fund and any related systems are NOT LICENSED for financial advice. If you need real financial advice seek a licensed professional. ",
				TAB_LAB,
				" and all related entities such as Desk, Lab, website or systems are for EDUCATION purpose ONLY. Invest at your own risk and only upon the advice of your licensed advisor."
			]
		}) : null]
	});
}
function useBoundXAdmin() {
	const { user, isPending } = useCurrentUserState();
	const [xVerified, setXVerified] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!user) {
			setXVerified(false);
			return;
		}
		let gone = false;
		secondFactorStatus().then((st) => {
			if (!gone) setXVerified(Boolean(st.allowed));
		}).catch(() => {
			if (!gone) setXVerified(false);
		});
		return () => {
			gone = true;
		};
	}, [user]);
	return {
		user,
		isPending,
		xVerified: Boolean(user) && xVerified
	};
}
function AdminNavLink() {
	const unlocked = useOperator((s) => s.unlocked);
	if (useOperator((s) => s.role) !== "admin" || !unlocked) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/admin",
		className: "inline-flex h-10 min-h-10 items-center rounded-md px-3 text-sm font-medium",
		activeProps: { className: "is-on inline-flex h-10 min-h-10 items-center rounded-md px-3 text-sm font-medium" },
		children: "Admin"
	});
}
function LoginCluster() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-center justify-end gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthSlot, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminAuthControl, {})]
	});
}
function AuthSlot() {
	const { user, isPending, xVerified } = useBoundXAdmin();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-24 animate-pulse rounded-md bg-fg/8" });
	if (!user) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [looksLikeCompanyX(user.displayName) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "flex items-center gap-2 text-sm font-medium text-medium",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompanyAvatar, {
					size: 28,
					className: "h-7 w-7"
				}),
				"",
				null
			]
		}) : xVerified ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "x-admin-name max-w-[11rem] truncate text-sm sm:max-w-none",
			children: "operator"
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, { hideLabel: xVerified || looksLikeCompanyX(user.displayName) })]
	});
}
function Panel({ title, kicker, className, titleClass, kickerClass, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("rounded-lg border border-rule bg-surface p-4 shadow-[var(--shadow-border)] sm:p-5", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-3",
			children: [kicker ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("text-xs font-medium tracking-[0.08em] uppercase", kickerClass || "text-muted"),
				children: kicker
			}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: cn("text-sm font-semibold tracking-tight sm:text-base", titleClass || "text-fg"),
				children: title
			})]
		}), children]
	});
}
//#endregion
export { LoginCluster as a, Shell as c, GodzillaMark as i, CompanyXChip as n, OperatorGate as o, GmRainbow as r, Panel as s, CompanyAvatar as t };
