import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, U as require_react, v as Link, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as APP_NAME } from "./brand-1s5EgS5V.mjs";
import { f as looksLikeSecret } from "./security-C5jp0dl0.mjs";
import { i as signIn } from "./client-Gq2WFxue.mjs";
import { m as secondFactorStatus, v as useOperator } from "./operator-Dxg9KVrW.mjs";
import { a as XRenewWhenAdmin, m as useCurrentUserState, n as Button, p as useCurrentUser } from "./renew-password-vzG-bo4m.mjs";
import { i as GROK_PROVIDERS } from "./server-DrYSoF3f.mjs";
import { d as Lock } from "../_libs/lucide-react.mjs";
import { C as YubiForm, d as LoginCluster, v as Shell, x as UserButton } from "./shell-ClCx_L5Z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-CDEcSr4S.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ResetPwordExpand({ plane }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 rounded-md border border-rule p-3 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "legal-purple font-medium",
			onClick: () => setOpen((v) => !v),
			children: [open ? "collapse" : "expand", " reset p-word"]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 space-y-2 text-muted",
			children: plane === "system" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "System admin username is the bound operator name after X verifies. This page never shows the live password." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Reset: Continue with X as the bound admin → request a one-time mailbox link → open /renew?t=… and set a new password. Then Yubi." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/renew",
					className: "underline",
					children: "Open /renew"
				}) })
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Phone-app admin is a device session, not the host password. This page never shows a host password." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Reset that copy: open /app/admin, lock the session, claim again with a new handle label. Host /admin Yubi stays system-only." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/app/admin",
					className: "underline",
					children: "Open /app/admin"
				}) })
			] })
		}) : null]
	});
}
function YubiSuggest() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-3 text-sm font-semibold",
		style: { color: "#facc15" },
		children: "YubiKey IS HIGHLY SUGG3ST3D"
	});
}
function Login() {
	const { user, isPending } = useCurrentUserState();
	const me = useCurrentUser();
	const unlocked = useOperator((s) => s.unlocked);
	const idleLocked = useOperator((s) => s.idleLocked);
	const role = useOperator((s) => s.role);
	const yubiTicket = useOperator((s) => s.yubiTicket);
	const unlock = useOperator((s) => s.unlock);
	const [name, setName] = (0, import_react.useState)("");
	const [pass, setPass] = (0, import_react.useState)("");
	const [err, setErr] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [xAdmin, setXAdmin] = (0, import_react.useState)(false);
	const [xErr, setXErr] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		if (new URLSearchParams(window.location.search).get("error")) setXErr("X sign-in did not finish. Allow popups for s1r1us.ai, use @_Mr_R0b0t0_, then try again.");
	}, []);
	(0, import_react.useEffect)(() => {
		if (!me) {
			setXAdmin(false);
			return;
		}
		let gone = false;
		(async () => {
			try {
				const st = await secondFactorStatus();
				if (gone) return;
				setXAdmin(Boolean(st.allowed));
			} catch {
				setXAdmin(false);
			}
		})();
		return () => {
			gone = true;
		};
	}, [me]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-lg px-4 py-10 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-[0.08em] text-muted uppercase",
				children: "login"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-2xl font-bold tracking-tight text-medium",
				children: APP_NAME
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-6 h-11 animate-pulse rounded-md bg-fg/8" })
		]
	}) });
	if (unlocked) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: role === "user" ? "/" : "/admin" });
	if (yubiTicket) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
		right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoginCluster, {}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YubiSuggest, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(YubiForm, {})]
	});
	async function onSubmit(e) {
		e.preventDefault();
		if (looksLikeSecret(name) || looksLikeSecret(pass)) {
			setErr("Secret rejected. Never paste a Coinbase key or wallet seed here.");
			setPass("");
			return;
		}
		setBusy(true);
		setErr(null);
		const fail = await Promise.race([unlock(name, pass), new Promise((resolve) => setTimeout(() => resolve("Login timed out. Refresh and try again."), 2e4))]);
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
			setErr("Secret rejected. Never paste a Coinbase key or wallet seed here.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {
		right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoginCluster, {}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YubiSuggest, {}),
				idleLocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm leading-relaxed text-muted",
					children: "Screensaver locked the desk. Sign in again with your name and password."
				}) : null,
				!user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 space-y-2",
					children: [
						GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "primary",
							className: "w-full",
							type: "button",
							onClick: () => {
								setXErr(null);
								Promise.race([signIn(p.providerId, {
									callbackURL: "/login",
									errorCallbackURL: "/login"
								}), new Promise((_, reject) => setTimeout(() => reject(/* @__PURE__ */ new Error("x-timeout")), 9e4))]).catch(() => {
									setXErr("X is still waiting. Allow popups, finish X as @_Mr_R0b0t0_, or use the X chip at the far right of the menu.");
								});
							},
							children: "Continue with X"
						}, p.providerId)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs leading-relaxed text-muted",
							children: "Required: system admin name + password. YubiKey is optional. Operator X @_Mr_R0b0t0_ is still used to bind the session. Other X accounts stay users. iOS / Google copy Admin is on the downloaded app."
						}),
						xErr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-down",
							children: xErr
						}) : null
					]
				}) : user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {}),
						xAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-high",
							children: "Operator X verified. Enter name and password to finish."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "This X session is not the operator account. Sign out, then Continue with X again as the operator handle @_Mr_R0b0t0_ — the desk reads the handle from X, not the display name. iOS / Google copy Admin is a separate lock on the downloaded app."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XRenewWhenAdmin, {})
					]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => void onSubmit(e),
					className: "mt-6 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-sm",
							htmlFor: "login-user",
							children: "Name"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "login-user",
							type: "text",
							autoComplete: "username",
							value: name,
							onChange: (e) => setName(e.target.value),
							onPaste: guardPaste,
							className: "h-11 w-full rounded-md border border-rule bg-surface px-3 text-sm text-fg",
							required: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-sm",
							htmlFor: "login-pass",
							children: "Password"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "login-pass",
							type: "password",
							autoComplete: "current-password",
							value: pass,
							onChange: (e) => setPass(e.target.value),
							onPaste: guardPaste,
							className: "h-11 w-full rounded-md border border-rule bg-surface px-3 text-sm text-fg",
							required: true
						}),
						err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-down",
							children: err
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "primary",
							type: "submit",
							disabled: busy,
							className: "w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-4" }), xAdmin ? "Unlock admin" : "Unlock"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResetPwordExpand, { plane: "system" })
			]
		})
	});
}
//#endregion
export { Login as component };
