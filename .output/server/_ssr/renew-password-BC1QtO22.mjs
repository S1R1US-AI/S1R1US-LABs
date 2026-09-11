import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, U as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as looksLikeSecret } from "./security-Cp6DEZcn.mjs";
import { t as authClient } from "./client-Dp7wcF1K.mjs";
import { m as secondFactorStatus, v as useOperator } from "./operator-C_QgBN0h.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/renew-password-BC1QtO22.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var BTC_TONE = "text-medium";
var USD_TONE = "text-high";
/** RSI below tape average = red; above average = green. */
function rsiTone(rsi, avg) {
	if (rsi == null) return "rsi-flat";
	const mid = avg ?? 50;
	if (rsi < mid) return "rsi-below";
	if (rsi > mid) return "rsi-above";
	return "rsi-flat";
}
function rsiHex(rsi, avg) {
	const tone = rsiTone(rsi, avg);
	if (tone === "rsi-below") return "#ff1f1f";
	if (tone === "rsi-above") return "#3dff1a";
}
/** Kimchi Upbit vs Coinbase: premium up = green, discount down = red. */
function kimchiTone(pct) {
	if (pct == null) return "rsi-flat";
	if (pct >= 0) return "rsi-above";
	return "rsi-below";
}
function kimchiHex(pct) {
	if (pct == null) return void 0;
	if (pct >= 0) return "#3dff1a";
	return "#ff1f1f";
}
/** Alternative.me: Fear / Extreme Fear = red, Greed / Extreme Greed = green. */
function fgTone(value, label) {
	const l = (label ?? "").toLowerCase();
	if (l.includes("fear") || value != null && value < 50) return "text-sell";
	if (l.includes("greed") || value != null && value > 50) return "text-high";
	return "text-muted";
}
/**
* Size → blue: smallest = ice, largest = navy.
* Uses log so ETF vs El Salvador still separate; gamma so mids aren't washed out.
*/
function barBlue(value, max, min) {
	const a = Math.abs(value);
	let t = 0;
	if (min != null && min > 0 && max > min) {
		const lo = Math.log(min);
		const hi = Math.log(max);
		t = hi > lo ? (Math.log(Math.max(a, min)) - lo) / (hi - lo) : 1;
	} else if (max > 0) t = a / max;
	t = Math.min(1, Math.max(0, t));
	t = t ** .55;
	const l = [
		210,
		241,
		252
	];
	const d = [
		0,
		16,
		56
	];
	const r = Math.round(l[0] + (d[0] - l[0]) * t);
	const g = Math.round(l[1] + (d[1] - l[1]) * t);
	const b = Math.round(l[2] + (d[2] - l[2]) * t);
	const h = (n) => n.toString(16).padStart(2, "0");
	return `#${h(r)}${h(g)}${h(b)}`;
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans text-sm font-medium transition-[opacity,background-color,color,border-color,box-shadow] duration-[var(--motion-quick)] ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:pointer-events-none disabled:opacity-40", {
	variants: {
		variant: {
			primary: "bg-fg text-bg hover:bg-fg/90",
			ghost: "bg-transparent text-fg hover:bg-fg/8",
			outline: "border border-rule bg-surface text-fg hover:bg-fg/6"
		},
		size: {
			sm: "h-10 min-h-10 rounded-md px-3",
			md: "h-11 min-h-11 rounded-md px-4"
		}
	},
	defaultVariants: {
		variant: "outline",
		size: "sm"
	}
});
function Button({ className, variant, size, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
function XRenewWhenAdmin() {
	const { user, isPending } = useCurrentUserState();
	const [allowed, setAllowed] = (0, import_react.useState)(false);
	const [adminName, setAdminName] = (0, import_react.useState)("");
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (isPending) return;
		if (!user) {
			setAllowed(false);
			setReady(true);
			return;
		}
		let gone = false;
		secondFactorStatus().then((st) => {
			if (gone) return;
			setAllowed(Boolean(st.allowed));
			setAdminName(st.adminName ?? "");
			setReady(true);
		}).catch(() => {
			if (!gone) {
				setAllowed(false);
				setReady(true);
			}
		});
		return () => {
			gone = true;
		};
	}, [user, isPending]);
	if (isPending || !ready || !user || !allowed) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(XRenewBlock, {
		allowed: true,
		adminName
	});
}
function XRenewBlock({ allowed = false, adminName = "", xErr }) {
	const renewWithX = useOperator((s) => s.renewWithX);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [nextName, setNextName] = (0, import_react.useState)(adminName);
	const [next, setNext] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [err, setErr] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (adminName && !nextName) setNextName(adminName);
	}, [adminName, nextName]);
	if (!allowed) return xErr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-4 text-sm text-down",
		children: xErr
	}) : null;
	function guardPaste(e) {
		const t = e.clipboardData.getData("text");
		if (looksLikeSecret(t)) {
			e.preventDefault();
			setErr("Secret rejected. Never paste a Coinbase key or wallet seed here.");
		}
	}
	async function onSet(e) {
		e.preventDefault();
		if (looksLikeSecret(next) || looksLikeSecret(confirm) || looksLikeSecret(nextName)) {
			setErr("Secret rejected. Never paste a Coinbase key or wallet seed here.");
			return;
		}
		setBusy(true);
		setErr(null);
		const fail = await renewWithX(next, confirm, nextName.trim() || void 0);
		setBusy(false);
		if (fail) {
			setErr(fail);
			setNext("");
			setConfirm("");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 rounded-md border border-brand/40 bg-brand/8 p-3",
		children: [!open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			type: "button",
			variant: "primary",
			className: "w-full",
			onClick: () => setOpen(true),
			children: "Renew admin password"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: (e) => void onSet(e),
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-muted",
					children: "Operator X is signed in. This sets the name and password for the second login (admin door). X stays this account."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-sm",
					htmlFor: "renew-name",
					children: "Admin name"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "renew-name",
					type: "text",
					autoComplete: "username",
					value: nextName,
					onChange: (e) => setNextName(e.target.value),
					className: "h-11 w-full rounded-md border border-rule bg-surface px-3 text-sm text-fg",
					minLength: 3,
					maxLength: 32,
					required: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-sm",
					htmlFor: "renew-next",
					children: "New password"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "renew-next",
					type: "password",
					autoComplete: "new-password",
					value: next,
					onChange: (e) => setNext(e.target.value),
					onPaste: guardPaste,
					className: "h-11 w-full rounded-md border border-rule bg-surface px-3 text-sm text-fg",
					minLength: 12,
					maxLength: 128,
					required: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-sm",
					htmlFor: "renew-confirm",
					children: "Confirm new password"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "renew-confirm",
					type: "password",
					autoComplete: "new-password",
					value: confirm,
					onChange: (e) => setConfirm(e.target.value),
					onPaste: guardPaste,
					className: "h-11 w-full rounded-md border border-rule bg-surface px-3 text-sm text-fg",
					minLength: 12,
					maxLength: 128,
					required: true
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
					children: "Set admin name and password"
				})
			]
		}), xErr && !open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-down",
			children: xErr
		}) : null]
	});
}
function MailboxRenewForm({ token }) {
	const completeReset = useOperator((s) => s.completeReset);
	const [next, setNext] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [err, setErr] = (0, import_react.useState)(null);
	const [ok, setOk] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	function guardPaste(e) {
		const t = e.clipboardData.getData("text");
		if (looksLikeSecret(t)) {
			e.preventDefault();
			setErr("Secret rejected. Never paste a Coinbase key or wallet seed here.");
		}
	}
	async function onSet(e) {
		e.preventDefault();
		setBusy(true);
		setErr(null);
		const fail = await completeReset(token, next, confirm);
		setBusy(false);
		if (fail) {
			setErr(fail);
			return;
		}
		setOk(true);
		setNext("");
		setConfirm("");
	}
	if (ok) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-up",
		children: "Password updated. Sign in with the admin name and the new password."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: (e) => void onSet(e),
		className: "mt-6 space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "block text-sm",
				htmlFor: "mail-next",
				children: "New password"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id: "mail-next",
				type: "password",
				autoComplete: "new-password",
				value: next,
				onChange: (e) => setNext(e.target.value),
				onPaste: guardPaste,
				className: "h-11 w-full rounded-md border border-rule bg-surface px-3 text-sm text-fg",
				minLength: 12,
				maxLength: 128,
				required: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "block text-sm",
				htmlFor: "mail-confirm",
				children: "Confirm new password"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id: "mail-confirm",
				type: "password",
				autoComplete: "new-password",
				value: confirm,
				onChange: (e) => setConfirm(e.target.value),
				onPaste: guardPaste,
				className: "h-11 w-full rounded-md border border-rule bg-surface px-3 text-sm text-fg",
				minLength: 12,
				maxLength: 128,
				required: true
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
				children: "Set new password"
			})
		]
	});
}
//#endregion
export { XRenewWhenAdmin as a, fgTone as c, rsiHex as d, rsiTone as f, USD_TONE as i, kimchiHex as l, useCurrentUserState as m, Button as n, barBlue as o, useCurrentUser as p, MailboxRenewForm as r, cn as s, BTC_TONE as t, kimchiTone as u };
