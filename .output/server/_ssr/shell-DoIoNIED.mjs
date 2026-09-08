import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, U as require_react, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as looksLikeCompanyX, c as COMPANY_X_HANDLE, d as COMPANY_X_LOGO_NAME, f as COMPANY_X_NAME, i as COMPANY_X_AVATAR, l as COMPANY_X_LABEL, m as companyHandleSet, p as COMPANY_X_URL } from "./x-admin-CALKyy-K.mjs";
import { $n as TAB_HOVER_APP, An as TAB_BEARS, Bn as TAB_CUP, Cr as TAB_HOVER_SITEMAP, Dr as TAB_KING_UNI, Er as TAB_KING_ROUND, F as MENU_FORUM, I as MENU_LAB, In as TAB_CALLOUT, Ir as TAB_ROBOTS, Jn as TAB_GM_AUTO, L as MENU_TAPE, M as MENU_AGENTS, Mr as TAB_OWL, N as MENU_BOARD, On as TAB_AGENT, Or as TAB_LAB, P as MENU_FEED, Pn as TAB_BOWL, Qn as TAB_HOVER_AGENT, Rn as TAB_COFFEE, Vr as seoImgAlt, Zn as TAB_HIVE, _ as FORUM_AGENTS, ar as TAB_HOVER_COMPUTE, cr as TAB_HOVER_FAQ, dn as SEO_TAB_GM_AUTO, dr as TAB_HOVER_GM, er as TAB_HOVER_BEARS, fn as SEO_TAB_HIVE, hr as TAB_HOVER_LAB, ir as TAB_HOVER_COFFEE, k as LABS_NAME, kn as TAB_APP, lr as TAB_HOVER_FEED, mr as TAB_HOVER_HOME, pr as TAB_HOVER_HIVE, qn as TAB_GM, r as APP_NAME, sr as TAB_HOVER_DESK, tr as TAB_HOVER_BOARD, un as SEO_TAB_GM, ur as TAB_HOVER_FORUM, wr as TAB_KING_MANUAL, xr as TAB_HOVER_ROBOTS, yr as TAB_HOVER_OWL, zn as TAB_COMPUTE } from "./brand-1s5EgS5V.mjs";
import { f as looksLikeSecret } from "./security-C5jp0dl0.mjs";
import { S as OSS_LINK_LABEL, x as OSS_LINK } from "./model-DhC-vhtl.mjs";
import { c as PRIVACY_HOVER, d as PRIVACY_TITLE, g as TERMS_TITLE, l as PRIVACY_PATH, m as TERMS_PATH, p as TERMS_HOVER, r as LEGAL_NFA, s as LEGAL_USE_IS_AGREEMENT } from "./legal-CheSLPf3.mjs";
import { a as signOut, i as signIn } from "./client-Gq2WFxue.mjs";
import { m as secondFactorStatus, v as useOperator } from "./operator-pJ_wP6R3.mjs";
import { a as XRenewWhenAdmin, m as useCurrentUserState, n as Button, p as useCurrentUser, s as cn } from "./renew-password-4zi8_z0w.mjs";
import { i as GROK_PROVIDERS } from "./server-DrYSoF3f.mjs";
import { d as Lock, l as LogOut, u as LogIn } from "../_libs/lucide-react.mjs";
import { B as rainGmBurst } from "./router-BPvmRr2S.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shell-DoIoNIED.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of).
*/
function UserButton({ hideLabel }) {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: `${label} avatar`,
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			hideLabel ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
/** Every GIF/picture posted on the desk: alt + title carry AI agents / bitcoin accumulation agent. */
function SeoImage({ desc, alt, title, ...rest }) {
	const label = seoImgAlt(String(alt || desc || ""));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		...rest,
		alt: label,
		title: title ? seoImgAlt(String(title)) : label,
		itemProp: "image"
	});
}
function CompanyAvatar({ size = 32, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoImage, {
		src: COMPANY_X_AVATAR,
		desc: `${COMPANY_X_LOGO_NAME} · ${COMPANY_X_LABEL} · ${LABS_NAME} ${APP_NAME} · G0DZ1LLa M0D3 hologram`,
		width: size,
		height: size,
		className: cn("shrink-0 rounded-full bg-black object-cover", className)
	});
}
/** Official far-right X chip only. */
function CompanyXChip({ className }) {
	if (!companyHandleSet() || false) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
		href: COMPANY_X_URL,
		target: "_blank",
		rel: "noreferrer",
		"data-x-chip": "1",
		className: cn("inline-flex items-center gap-2", className),
		"aria-label": `S1R1US AI on X · ${LABS_NAME} ${APP_NAME} · AI agents · bitcoin accumulation agent`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompanyAvatar, {
			size: 28,
			className: "h-7 w-7 ring-1 ring-rule"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "leading-tight",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-xs font-bold tracking-tight text-fg",
				children: "S1R1US AI"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block font-mono text-[10px] text-muted",
				children: COMPANY_X_HANDLE
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
				children: "This login is a desk user. Admin on s1r1us.ai is only @_Mr_R0b0t0_ plus name and password (two YubiKeys). iOS / Google copy Admin is on the downloaded app."
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
				}, p.providerId)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs leading-relaxed text-muted",
					children: [
						"Admin needs the operator X account @_Mr_R0b0t0_, then name and password. Two physical YubiKeys (primary + backup) are the 2FA backup. Other X accounts and desk users stay users — they cannot open s1r1us.ai Admin, Wallet, or send. iOS / Google download Admin is a separate lock on the",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/app/admin",
							className: "text-tab hover:underline",
							children: "downloaded app"
						}),
						"."
					]
				})]
			}) : null,
			user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {}), xAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-high",
					children: "Operator X verified. Enter name and password to finish."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "This X account is not the operator. Name + password opens a user session only. Download-app Admin is on the iOS / Google copy, not this page."
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
	const tapWebauthn = useOperator((s) => s.tapWebauthn);
	const lock = useOperator((s) => s.lock);
	const [otp, setOtp] = (0, import_react.useState)("");
	const [err, setErr] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [fidoOk, setFidoOk] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		import("./webauthn-client-wWVK9Jpi.mjs").then((m) => setFidoOk(m.webauthnAvailable()));
	}, []);
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
	async function fido() {
		setBusy(true);
		setErr(null);
		const fail = await tapWebauthn();
		setBusy(false);
		if (fail) setErr(fail);
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
				children: "Admin locked the panel behind a physical YubiKey (Yubico). Short-press this field for a Yubico OTP, or use FIDO2 (touch + PIN). Do not paste a Coinbase secret here."
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
						children: "Yubico OTP"
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
						children: "Verify Yubico OTP"
					}),
					fidoOk ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						className: "w-full",
						disabled: busy,
						onClick: () => void fido(),
						children: "Use YubiKey FIDO2"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "This browser has no WebAuthn. Use Yubico OTP."
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
/** Menu paint is PR3D1CT10N$. brand.ts TAB_PRED should be S1R1US.ai Predictions. */
var TAB_PRED = "PR3D1CT10N$";
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("title", { children: "G0DZ1LLa M0D3 (Godzilla Mode) — AI agents bitcoin accumulation agent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("desc", { children: "S1R1US Labs Godzilla mark. AI agents. bitcoin accumulation agent. AI trading bots. Bitcoin trading agents." }),
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
		className: className ? `godzilla-mode gm-rainbow ${className}` : "godzilla-mode gm-rainbow",
		"aria-label": text,
		children: Array.from(text).map((ch, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			style: { animationDelay: `${i % 12 * -.28}s` },
			children: ch === " " ? "\xA0" : ch
		}, `${ch}-${i}`))
	});
}
function GoldCss({ text, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: className ? `gold-css ${className}` : "gold-css",
		"aria-label": text,
		children: Array.from(text).map((ch, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			style: { animationDelay: `${i % 12 * -.28}s` },
			children: ch === " " ? "\xA0" : ch
		}, `${ch}-${i}`))
	});
}
/** Sitewide / systemwide label: G0DZ1LLa M0D3 always rainbow. SEO = Godzilla Mode. */
function GodzillaModeLabel({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		title: `${TAB_GM} (${SEO_TAB_GM})`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GmRainbow, {
			text: TAB_GM,
			className
		})
	});
}
/** Sitewide / systemwide label: G M0D3 AUTO always rainbow. SEO = Godzilla Mode. */
function GmAutoLabel({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		title: `${TAB_GM_AUTO} (${SEO_TAB_GM_AUTO})`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GmRainbow, {
			text: TAB_GM_AUTO,
			className
		})
	});
}
/** Sitewide / systemwide label: L3AD3R B0ARD always rainbow. */
function LeaderBoardLabel({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GmRainbow, {
		text: MENU_BOARD,
		className
	});
}
function CallOutLabel({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GmRainbow, {
		text: TAB_CALLOUT,
		className
	});
}
function ManualKingLabel({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GmRainbow, {
		text: TAB_KING_MANUAL,
		className
	});
}
function RoundKingLabel({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GmRainbow, {
		text: TAB_KING_ROUND,
		className
	});
}
function UniversalKingLabel({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GmRainbow, {
		text: TAB_KING_UNI,
		className
	});
}
function SuperBowlLabel({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GmRainbow, {
		text: TAB_BOWL,
		className
	});
}
function WorldCupLabel({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GmRainbow, {
		text: TAB_CUP,
		className
	});
}
/** Sitewide / systemwide label: H1V3 SW@RM always rainbow. SEO = Hive Swarm. */
function HiveSwarmLabel({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		title: `${TAB_HIVE} (${SEO_TAB_HIVE})`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GmRainbow, {
			text: TAB_HIVE,
			className
		})
	});
}
var RAINBOW_BITS = [
	TAB_GM,
	TAB_GM_AUTO,
	"G M0D3 M@NU@L",
	MENU_BOARD,
	TAB_CALLOUT,
	TAB_KING_MANUAL,
	TAB_KING_ROUND,
	TAB_KING_UNI,
	TAB_BOWL,
	TAB_CUP,
	TAB_HIVE
];
var GOLD_BITS = ["S1R1US Pr3d1ctions", "Pr3d1ctions"];
/** Paint branded titles rainbow in running text. Prediction market names are gold. */
function RainbowGodzillaText({ text }) {
	const parts = text.split(/(S1R1US Pr3d1ctions|Pr3d1ctions|G0DZ1LLa M0D3|G M0D3 AUTO|G M0D3 M@NU@L|L3AD3R B0ARD|C@LL 0UT|GM M@NU@L K1Ng|B0t R0Und K1Ng|Un1v3rs@L K1Ng|SUP3R B0WL|W0rLd CUP|H1V3 SW@RM)/g);
	if (parts.length === 1) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: text });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: parts.map((p, i) => GOLD_BITS.includes(p) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoldCss, { text: p }, i) : RAINBOW_BITS.includes(p) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GmRainbow, { text: p }, i) : p) });
}
/** Menu / page title: W1S3 0WL$ + rainbow bold Forum. */
function ForumTitle({ className, size = "nav" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("forum-title", size === "hero" && "forum-title-hero", className),
		title: TAB_HOVER_FORUM,
		"aria-label": MENU_FORUM,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "forum-owls",
				children: FORUM_AGENTS
			}),
			"\xA0",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "forum-rainbow",
				"aria-label": "Forum",
				children: Array.from("Forum").map((ch, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					style: { animationDelay: `${i % 12 * -.28}s` },
					children: ch
				}, `${ch}-${i}`))
			})
		]
	});
}
function LegalBar() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "mt-2 w-full max-w-none text-justify font-mono text-[10px] leading-relaxed tracking-[0.02em] text-muted/80",
		children: [
			LEGAL_USE_IS_AGREEMENT,
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: TERMS_PATH,
				className: "legal-purple underline-offset-2 hover:underline",
				title: TERMS_HOVER,
				children: TERMS_TITLE
			}),
			" · ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: PRIVACY_PATH,
				className: "legal-purple underline-offset-2 hover:underline",
				title: PRIVACY_HOVER,
				children: PRIVACY_TITLE
			}),
			". ",
			LEGAL_NFA
		]
	});
}
var LINKS = [{
	to: "/",
	label: MENU_TAPE,
	title: TAB_HOVER_DESK
}, {
	to: "/helios",
	label: MENU_LAB,
	title: TAB_HOVER_LAB
}];
function Shell({ children, right }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh w-full min-w-0 flex-col overflow-x-hidden bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "desk-nav-fiber no-print sticky top-0 z-30 border-b border-rule",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2 sm:px-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "desk-tabs flex flex-wrap gap-1",
						children: [
							LINKS.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: l.to,
								title: l.title,
								"aria-label": l.title,
								className: "coinbase-orange inline-flex min-h-10 max-w-[11.5rem] items-center rounded-md px-2.5 py-1.5 text-left text-[0.825rem] font-medium leading-tight sm:max-w-none sm:px-3 sm:text-[0.9625rem]",
								activeProps: { className: "coinbase-orange is-on inline-flex min-h-10 max-w-[11.5rem] items-center rounded-md px-2.5 py-1.5 text-left text-[0.825rem] font-medium leading-tight sm:max-w-none sm:px-3 sm:text-[0.9625rem]" },
								children: l.label
							}, l.to)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/gm",
								title: TAB_HOVER_GM,
								"aria-label": TAB_HOVER_GM,
								className: "gm-tab gm-nav inline-flex min-h-10 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[0.825rem] font-medium sm:text-[0.9625rem]",
								onClick: () => rainGmBurst(3e3),
								activeProps: { className: "gm-tab gm-nav is-on inline-flex min-h-10 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[0.825rem] font-medium sm:text-[0.9625rem]" },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GodzillaMark, { className: "gm-mark-rainbow h-[1.1rem] w-[1.65rem] shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GodzillaModeLabel, { className: "text-[0.825rem] font-medium sm:text-[0.9625rem]" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/f33d",
								hash: "donate",
								title: TAB_HOVER_FEED,
								"aria-label": TAB_HOVER_FEED,
								className: "gm-tab coinbase-orange inline-flex min-h-10 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[0.825rem] font-medium sm:text-[0.9625rem]",
								activeProps: { className: "gm-tab coinbase-orange is-on inline-flex min-h-10 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[0.825rem] font-medium sm:text-[0.9625rem]" },
								children: MENU_FEED
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/agent",
								title: TAB_HOVER_AGENT,
								"aria-label": TAB_HOVER_AGENT,
								className: "coinbase-orange inline-flex min-h-10 items-center rounded-md px-2.5 py-1.5 text-[0.825rem] font-medium sm:text-[0.9625rem]",
								activeProps: { className: "coinbase-orange is-on inline-flex min-h-10 items-center rounded-md px-2.5 py-1.5 text-[0.825rem] font-medium sm:text-[0.9625rem]" },
								children: MENU_AGENTS
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/board",
								title: TAB_HOVER_BOARD,
								"aria-label": TAB_HOVER_BOARD,
								className: "board-nav gm-nav inline-flex min-h-10 items-center rounded-md px-2.5 py-1.5 text-[0.825rem] font-medium sm:text-[0.9625rem]",
								activeProps: { className: "board-nav gm-nav is-on inline-flex min-h-10 items-center rounded-md px-2.5 py-1.5 text-[0.825rem] font-medium sm:text-[0.9625rem]" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeaderBoardLabel, { className: "text-[0.825rem] font-semibold sm:text-[0.9625rem]" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/h1v3",
								title: TAB_HOVER_HIVE,
								"aria-label": TAB_HOVER_HIVE,
								className: "board-nav gm-nav hive-nav inline-flex min-h-10 items-center rounded-md px-2.5 py-1.5 text-[0.825rem] font-medium sm:text-[0.9625rem]",
								activeProps: { className: "board-nav gm-nav hive-nav is-on inline-flex min-h-10 items-center rounded-md px-2.5 py-1.5 text-[0.825rem] font-medium sm:text-[0.9625rem]" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HiveSwarmLabel, { className: "text-[0.825rem] font-semibold sm:text-[0.9625rem]" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/pr3d",
								title: "AI Agent Prediction Market",
								"aria-label": "PR3D1CT10N$ AI Agent Prediction Market",
								className: "board-nav gm-nav pred-nav inline-flex min-h-10 items-center rounded-md px-2.5 py-1.5 text-[0.825rem] font-medium sm:text-[0.9625rem]",
								activeProps: { className: "board-nav gm-nav pred-nav is-on inline-flex min-h-10 items-center rounded-md px-2.5 py-1.5 text-[0.825rem] font-medium sm:text-[0.9625rem]" },
								children: TAB_PRED
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/forum",
								title: TAB_HOVER_FORUM,
								"aria-label": TAB_HOVER_FORUM,
								className: "forum-nav inline-flex min-h-10 items-center rounded-md px-2.5 py-1.5 text-[0.825rem] font-medium sm:text-[0.9625rem]",
								activeProps: { className: "forum-nav is-on inline-flex min-h-10 items-center rounded-md px-2.5 py-1.5 text-[0.825rem] font-medium sm:text-[0.9625rem]" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ForumTitle, {})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/faq",
								title: TAB_HOVER_FAQ,
								"aria-label": TAB_HOVER_FAQ,
								className: "faq-kicker inline-flex min-h-10 items-center rounded-md px-2.5 py-1.5 text-[0.825rem] font-medium sm:text-[0.9625rem]",
								activeProps: { className: "faq-kicker is-on inline-flex min-h-10 items-center rounded-md px-2.5 py-1.5 text-[0.825rem] font-medium sm:text-[0.9625rem]" },
								children: "FAQ"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminNavLink, {})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompanyXChip, { className: "hidden sm:inline-flex" }), right]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DisclaimerBlock, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "no-print mt-auto border-t border-rule carbon-fiber",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-[1400px] px-3 py-3 sm:px-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/s1r1us",
								className: "font-mono text-[11px] tracking-[0.12em] text-muted/45 hover:text-muted",
								title: TAB_HOVER_HOME,
								"aria-label": TAB_HOVER_HOME,
								children: "s1r1us.ai"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: OSS_LINK,
								target: "_blank",
								rel: "noreferrer",
								className: "block text-center text-oss hover:underline",
								title: OSS_LINK_LABEL,
								"aria-label": "HELP 7-BOT HEDGE FUND S1R1US LABS GO OPEN SOURCE. OP3N S0URC3 is open source.",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-mono text-[11px] leading-snug tracking-[0.04em]",
									children: OSS_LINK_LABEL
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "seo-copy",
									children: "HELP 7-BOT HEDGE FUND [ S1R1US LABS ] GO OPEN SOURCE. OP3N S0URC3 means open source."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
								className: "flex w-full flex-wrap items-center justify-evenly gap-x-4 gap-y-2 text-center font-mono text-[11px] leading-snug tracking-[0.04em]",
								"aria-label": "Footer",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/sitemap",
										className: "shrink-0 text-oss hover:underline",
										title: TAB_HOVER_SITEMAP,
										children: "Sitemap"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "/media",
										className: "shrink-0 text-oss hover:underline",
										title: "Official X, GitHub, YouTube, Rumble, TikTok",
										children: "Media"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/c0ff33",
										className: "shrink-0 text-oss hover:underline",
										title: TAB_HOVER_COFFEE,
										children: TAB_COFFEE
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/faq",
										className: "faq-kicker shrink-0 hover:underline",
										title: TAB_HOVER_FAQ,
										children: "FAQ"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/b3ars",
										className: "shrink-0 text-oss hover:underline",
										title: TAB_HOVER_BEARS,
										children: TAB_BEARS
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/owl",
										className: "shrink-0 text-oss hover:underline",
										title: TAB_HOVER_OWL,
										children: TAB_OWL
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/r0b0ts",
										className: "shrink-0 text-oss hover:underline",
										title: TAB_HOVER_ROBOTS,
										children: TAB_ROBOTS
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/agent",
										className: "shrink-0 text-oss hover:underline",
										title: TAB_HOVER_AGENT,
										children: TAB_AGENT
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/board",
										className: "board-nav gm-nav shrink-0 hover:underline",
										title: TAB_HOVER_BOARD,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeaderBoardLabel, { className: "text-[11px] font-semibold" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/h1v3",
										className: "board-nav gm-nav hive-nav shrink-0 hover:underline",
										title: TAB_HOVER_HIVE,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HiveSwarmLabel, { className: "text-[11px] font-semibold" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/pr3d",
										className: "board-nav gm-nav pred-nav shrink-0 hover:underline",
										title: "PR3D1CT10N$ · AI Agent Prediction Market",
										children: TAB_PRED
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/l0ck",
										className: "legal-purple shrink-0 hover:underline",
										title: "LoCK3D STATUS (Locked Status) · how to lock and unlock",
										children: "LoCK3D STATUS"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/roadmap",
										className: "shrink-0 text-oss hover:underline",
										title: "OSS Roadmap · functions, go-live status, estimated timeline",
										children: "OSS Roadmap"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/forum",
										className: "forum-nav shrink-0 hover:underline",
										title: TAB_HOVER_FORUM,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ForumTitle, {})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/compute",
										className: "shrink-0 text-oss hover:underline",
										title: TAB_HOVER_COMPUTE,
										children: TAB_COMPUTE
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/app",
										className: "shrink-0 text-oss hover:underline",
										title: TAB_HOVER_APP,
										children: TAB_APP
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: TERMS_PATH,
										className: "legal-purple shrink-0 hover:underline",
										title: TERMS_HOVER,
										children: TERMS_TITLE
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: PRIVACY_PATH,
										className: "legal-purple shrink-0 hover:underline",
										title: PRIVACY_HOVER,
										children: PRIVACY_TITLE
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/login",
										className: "shrink-0 text-oss hover:underline",
										title: "login",
										children: "login"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/roadmap",
									className: "font-semibold text-oss hover:underline",
									title: "OSS Roadmap · functions, go-live status, estimated timeline",
									children: "OSS Roadmap"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted",
									children: " · functions · go-live status · full live estimated 2026-12-01"
								})]
							})
						]
					})
				})
			})
		]
	});
}
function DisclaimerBlock() {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "w-full border-b border-rule carbon-fiber",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full px-3 py-2 sm:px-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setOpen((v) => !v),
				"aria-expanded": open,
				"aria-controls": "disclaimer-full",
				className: "legal-purple flex w-full items-center justify-between gap-3 text-left text-[11px] font-bold tracking-[0.16em] uppercase",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "DISCLAIMER" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-[10px] tracking-[0.08em]",
					children: open ? "collapse −" : "expand +"
				})]
			}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				id: "disclaimer-full",
				className: "mt-2 w-full max-w-none space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "w-full text-justify font-mono text-[10px] leading-relaxed text-muted",
					children: [
						TAB_LAB,
						" is NOT considered financial advice or a financial recommendation. S1R1US.ai and the 7-B0T H3DG3 Fund and any related systems are NOT LICENSED for financial advice. If you need real financial advice seek a licensed professional. ",
						TAB_LAB,
						" and all related entities such as Desk, Lab, website or systems are for EDUCATION purpose ONLY. Invest at your own risk and only upon the advice of your licensed advisor. Using this website is agreement to the Terms and Agreements. Nothing here is an offer of securities. A cultural ticker, if one exists, is not a claim on bitcoin and is not how the desk is funded. No bot may retain system information or reverse engineer source without S1R1US.ai authorization.",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: PRIVACY_PATH,
							className: "legal-purple hover:underline",
							title: PRIVACY_HOVER,
							children: PRIVACY_TITLE
						}),
						"."
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegalBar, {})]
			}) : null]
		})
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
		title: `Admin · ${APP_NAME}`,
		className: "coinbase-orange inline-flex h-10 min-h-10 items-center rounded-md px-3 text-sm font-medium",
		activeProps: { className: "coinbase-orange is-on inline-flex h-10 min-h-10 items-center rounded-md px-3 text-sm font-medium" },
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
				COMPANY_X_NAME,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-1 font-mono text-xs text-muted",
					children: COMPANY_X_HANDLE
				})
			]
		}) : xVerified ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "x-admin-name max-w-[11rem] truncate text-sm sm:max-w-none",
			children: "operator"
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, { hideLabel: xVerified || looksLikeCompanyX(user.displayName) })]
	});
}
function Panel({ title, kicker, className, titleClass, kickerClass, id, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id,
		className: cn("min-w-0 max-w-full rounded-md border border-rule bg-surface/95 p-3 sm:p-4", className),
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
export { YubiForm as C, WorldCupLabel as S, SeoImage as _, GmRainbow as a, UniversalKingLabel as b, GoldCss as c, LoginCluster as d, ManualKingLabel as f, RoundKingLabel as g, RainbowGodzillaText as h, GmAutoLabel as i, HiveSwarmLabel as l, Panel as m, CompanyAvatar as n, GodzillaMark as o, OperatorGate as p, ForumTitle as r, GodzillaModeLabel as s, CallOutLabel as t, LeaderBoardLabel as u, Shell as v, UserButton as x, SuperBowlLabel as y };
