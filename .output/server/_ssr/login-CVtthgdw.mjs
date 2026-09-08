import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, U as require_react, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as APP_NAME } from "./brand-DK5ykudh.mjs";
import { f as looksLikeSecret } from "./security-CIRBAp9G.mjs";
import { i as signIn } from "./client-Gq2WFxue.mjs";
import { m as secondFactorStatus, v as useOperator } from "./operator-UeKr_8KN.mjs";
import { a as XRenewWhenAdmin, m as useCurrentUserState, n as Button, p as useCurrentUser } from "./renew-password-B0B_EdkX.mjs";
import { i as GROK_PROVIDERS } from "./server-DrYSoF3f.mjs";
import { d as Lock } from "../_libs/lucide-react.mjs";
import { C as YubiForm, d as LoginCluster, v as Shell, x as UserButton } from "./shell-D2BEz0MM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-CVtthgdw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
		if (new URLSearchParams(window.location.search).get("error")) setXErr("X sign-in did not finish. Add GROK_AUTH_CLIENT_SECRET on the host, redeploy, then Continue with X again.");
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
	if (yubiTicket) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {
		right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoginCluster, {}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(YubiForm, {})
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
								signIn(p.providerId, {
									callbackURL: "/login",
									errorCallbackURL: "/login"
								}).catch(() => {
									setXErr("X sign-in failed. Try again.");
								});
							},
							children: "Continue with X"
						}, p.providerId)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs leading-relaxed text-muted",
							children: "Admin needs the operator X account @_Mr_R0b0t0_, then name and password. Two physical YubiKeys (primary + backup) are the 2FA backup. Other X accounts stay users. They cannot open s1r1us.ai Admin. iOS / Google copy Admin is on the downloaded app."
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
				})
			]
		})
	});
}
//#endregion
export { Login as component };
