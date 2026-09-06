import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, U as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as APP_ADMIN_PATH } from "./tenancy-XVYWlKJ3.mjs";
import { Dr as seoImgAlt } from "./brand-Cg47htkS.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { c as fetchLockStatus, y as setLockStatus } from "./desk-rpc-P5xEwTr-.mjs";
import { r as claimCopyAdmin, u as peekCopyAdmin, v as useOperator } from "./operator-BWHXtJvm.mjs";
import { n as Button, s as cn } from "./renew-password-CKVw-xpD.mjs";
import { a as Radio } from "../_libs/lucide-react.mjs";
import { a as GmRainbow, p as Panel } from "./shell-BgY-wW2B.mjs";
import { n as LOCK_GIF_CLOSED, r as LOCK_GIF_OPEN, s as TAB_LOCK3D } from "./lock-status-Da6B71U7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lock3d-status-DiEAg4w9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Client store for iOS / Google copy-admin. Never writes h3-op-token. */
var TOKEN_KEY = "h3-app-token";
function readToken() {
	try {
		return sessionStorage.getItem(TOKEN_KEY) ?? "";
	} catch {
		return "";
	}
}
function writeToken(token) {
	try {
		if (token && token.startsWith("app.")) sessionStorage.setItem(TOKEN_KEY, token);
		else sessionStorage.removeItem(TOKEN_KEY);
	} catch {}
}
var useAppAdmin = create()(persist((set, get) => ({
	token: "",
	unlocked: false,
	you: null,
	path: APP_ADMIN_PATH,
	claim: async (input) => {
		const res = await claimCopyAdmin({ data: {
			kind: input.kind,
			handle: input.handle,
			label: input.label,
			mandate: input.mandate
		} });
		if (!res.ok) return res.error;
		writeToken(res.token);
		set({
			token: res.token,
			unlocked: true,
			you: res.you,
			path: res.public.path
		});
		return null;
	},
	refresh: async () => {
		const token = get().token || readToken();
		if (!token.startsWith("app.")) {
			writeToken("");
			set({
				token: "",
				unlocked: false,
				you: null
			});
			return;
		}
		const res = await peekCopyAdmin({ data: { token } });
		if (!res.ok) {
			writeToken("");
			set({
				token: "",
				unlocked: false,
				you: null
			});
			return;
		}
		set({
			token,
			unlocked: true,
			you: res.you,
			path: res.public.path
		});
	},
	lock: () => {
		writeToken("");
		set({
			token: "",
			unlocked: false,
			you: null
		});
	}
}), {
	name: "h3-app-admin-lock",
	partialize: (s) => ({ you: s.you }),
	onRehydrateStorage: () => (state) => {
		if (!state) return;
		const token = readToken();
		if (!token.startsWith("app.")) {
			state.token = "";
			state.unlocked = false;
			state.you = null;
			return;
		}
		state.token = token;
		state.unlocked = true;
	}
}));
var POLL_MS = 2e4;
function useLockAdmin() {
	const sysTok = useOperator((s) => s.unlocked && s.role === "admin" ? s.token : "");
	const appTok = useAppAdmin((s) => s.unlocked ? s.token : "");
	const token = sysTok || (appTok.startsWith("app.") ? appTok : "");
	return {
		token,
		canEdit: Boolean(token),
		plane: sysTok ? "system" : token ? "app-admin" : null
	};
}
function useLockView() {
	const [lock, setLock] = (0, import_react.useState)(null);
	const [err, setErr] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function load() {
		try {
			const next = await fetchLockStatus();
			setLock(next);
			setErr(null);
		} catch (e) {
			setErr(e instanceof Error ? e.message : "Could not read LoCK3D STATUS");
		}
	}
	(0, import_react.useEffect)(() => {
		load();
		const t = window.setInterval(() => void load(), POLL_MS);
		return () => window.clearInterval(t);
	}, []);
	return {
		lock,
		setLock,
		err,
		setErr,
		busy,
		setBusy,
		load
	};
}
function LockGif({ locked, size = "md", className }) {
	const px = size === "lg" ? 32 : size === "sm" ? 20 : 24;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: locked ? LOCK_GIF_CLOSED : LOCK_GIF_OPEN,
		alt: seoImgAlt(locked ? "Closed padlock. LOCKED." : "Open padlock. UNLOCKED."),
		width: px,
		height: px,
		className: cn("lock-gif", locked ? "lock-gif-closed" : "lock-gif-open", size === "lg" && "lock-gif-lg", className)
	});
}
function LockName({ name, css, className }) {
	if (css === "gm-rainbow" || css === "hive-nav") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GmRainbow, {
		text: name,
		className: cn("font-semibold", className)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("font-semibold", css, className),
		children: name
	});
}
function liveTapeClass(tape) {
	return tape === "TRUE LIVE" ? "live-tape-all" : "live-tape-half";
}
function LockControls({ lock, canEdit, token, busy, err, onAct }) {
	const included = lock.rows.filter((r) => r.include).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "lock-status-panel w-full min-w-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-rule pb-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: cn("inline-flex items-center gap-1.5 font-semibold", liveTapeClass(lock.tape)),
						title: lock.tapeNote,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "size-4" }),
							"Live tape",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "font-semibold",
								children: lock.tape
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted",
						children: "status only · not a lock · not user-adjusted"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-[11px] text-muted",
						children: [
							"desk ",
							lock.mode,
							lock.by ? ` · ${lock.by}` : ""
						]
					})
				]
			}),
			canEdit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: lock.mode === "SIM" ? "primary" : "outline",
						disabled: busy || !token,
						onClick: () => onAct({
							op: "mode",
							mode: "SIM"
						}),
						children: "SIM"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: lock.mode === "LIVE" ? "primary" : "outline",
						disabled: busy || !token,
						onClick: () => onAct({
							op: "mode",
							mode: "LIVE"
						}),
						children: "LIVE"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						disabled: busy || !token || included === 0,
						onClick: () => onAct({
							op: "master",
							locked: true
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockGif, {
							locked: true,
							size: "sm"
						}), "Lock selected"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "primary",
						disabled: busy || !token || included === 0,
						onClick: () => onAct({
							op: "master",
							locked: false
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockGif, {
							locked: false,
							size: "sm"
						}), "Unlock selected"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: busy || !token,
						onClick: () => onAct({
							op: "includeAll",
							include: true
						}),
						children: "Include all"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: busy || !token,
						onClick: () => onAct({
							op: "includeAll",
							include: false
						}),
						children: "Include none"
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 divide-y divide-rule",
				children: lock.rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-wrap items-center gap-x-3 gap-y-2 py-2.5",
					children: [
						canEdit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: busy || !token,
							onClick: () => onAct({
								op: "one",
								id: row.id,
								locked: !row.locked
							}),
							className: "inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border border-rule bg-paper-raised px-2 transition-transform duration-150 ease-out active:scale-[0.96]",
							"aria-pressed": row.locked,
							"aria-label": `${row.name} ${row.locked ? "LOCKED" : "UNLOCKED"} — toggle`,
							title: row.hint,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockGif, { locked: row.locked })
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "inline-flex min-h-10 min-w-10 items-center justify-center",
							title: row.hint,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockGif, { locked: row.locked })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex flex-wrap items-baseline gap-x-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockName, {
										name: row.name,
										css: row.css
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: row.locked ? "text-sell" : "text-high",
										children: row.label
									}),
									!row.include ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] tracking-[0.08em] text-muted uppercase",
										children: "off master"
									}) : null
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-xs leading-relaxed text-muted",
								children: row.hint
							})]
						}),
						canEdit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "inline-flex min-h-10 items-center gap-2 text-xs text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: row.include,
								disabled: busy || !token,
								onChange: () => onAct({
									op: "include",
									id: row.id,
									include: !row.include
								})
							}), "include"]
						}) : null
					]
				}, row.id))
			}),
			err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-sell",
				children: err
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs leading-relaxed text-muted",
				children: lock.notice
			})
		]
	});
}
function Lock3dStatusPanel({ className }) {
	const { token, canEdit, plane } = useLockAdmin();
	const { lock, setLock, err, setErr, busy, setBusy } = useLockView();
	async function act(input) {
		if (!token) return;
		setBusy(true);
		setErr(null);
		try {
			const res = await setLockStatus({ data: {
				token,
				...input
			} });
			if (!res.ok || !res.lock) {
				setErr(res.error ?? "Admin session required");
				return;
			}
			setLock(res.lock);
		} catch (e) {
			setErr(e instanceof Error ? e.message : "Could not change LoCK3D STATUS");
		} finally {
			setBusy(false);
		}
	}
	const masterLocked = lock?.masterLocked ?? true;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		className: cn("mt-4", className),
		kicker: TAB_LOCK3D,
		title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "inline-flex items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockGif, { locked: masterLocked }),
				masterLocked ? "LOCKED" : "UNLOCKED",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-[11px] font-normal text-muted",
					children: lock?.mode ?? "SIM"
				})
			]
		}),
		kickerClass: "legal-purple",
		titleClass: masterLocked ? "text-sell" : "text-high",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm leading-relaxed text-muted",
			children: ["System Admin and phone-app Admin share this board. Optional unlocks pick which rails the master lock hits. Live tape is status only. Championship pause stays system Admin. Unlock is live-intent — execute on YOUR Coinbase. This host never places orders.", plane ? ` Signed in as ${plane}.` : " Sign in as Admin to lock or unlock."]
		}), lock ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockControls, {
				lock,
				canEdit,
				token,
				busy,
				err,
				onAct: (i) => void act(i)
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-muted",
			children: err ?? "Reading locks…"
		})]
	});
}
function Lock3dRail({ feedAudit }) {
	const { token, canEdit } = useLockAdmin();
	const { lock, setLock, err, setErr, busy, setBusy } = useLockView();
	const [open, setOpen] = (0, import_react.useState)(false);
	async function act(input) {
		if (!token) return;
		setBusy(true);
		setErr(null);
		try {
			const res = await setLockStatus({ data: {
				token,
				...input
			} });
			if (!res.ok || !res.lock) {
				setErr(res.error ?? "Admin session required");
				return;
			}
			setLock(res.lock);
		} catch (e) {
			setErr(e instanceof Error ? e.message : "Could not change LoCK3D STATUS");
		} finally {
			setBusy(false);
		}
	}
	const tape = lock?.tape ?? "SIMULATED";
	const masterLocked = lock?.masterLocked ?? true;
	const ok = feedAudit?.ok ?? 0;
	const fail = feedAudit?.fail ?? 0;
	const total = ok + fail;
	const feedTone = total === 0 || ok === 0 ? "live-tape-none" : fail === 0 ? "live-tape-all" : ok > total / 2 ? "live-tape-most" : "live-tape-half";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "lock-status-rail mb-3 rounded-md border border-rule bg-paper-raised px-5 py-3 text-[1.08rem] leading-snug text-muted",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-x-6 gap-y-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: cn("inline-flex items-center gap-1.5 font-semibold", lock ? liveTapeClass(tape) : feedTone),
					title: lock?.tapeNote ?? (feedAudit ? `Live tape · ${ok} live · ${fail} down` : "Live tape"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "size-4" }),
						"Live tape",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "font-semibold",
							children: tape
						})
					]
				}),
				(lock?.rows ?? []).map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1.5",
					title: row.hint,
					children: [
						canEdit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: busy || !token,
							onClick: () => void act({
								op: "one",
								id: row.id,
								locked: !row.locked
							}),
							className: "inline-flex min-h-10 min-w-10 items-center justify-center rounded-md transition-transform duration-150 ease-out active:scale-[0.96]",
							"aria-label": `${row.name} ${row.label}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockGif, {
								locked: row.locked,
								size: "lg"
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockGif, {
							locked: row.locked,
							size: "lg"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockName, {
							name: row.name,
							css: row.css
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: row.locked ? "text-sell" : "text-high",
							children: row.locked ? "locked" : "unlocked"
						})
					]
				}, row.id)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					"aria-expanded": open,
					onClick: () => setOpen((v) => !v),
					className: cn("inline-flex min-h-10 items-center gap-1.5 font-bold tracking-[0.08em] uppercase", masterLocked ? "legal-purple" : "text-high"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockGif, {
						locked: masterLocked,
						size: "lg"
					}), TAB_LOCK3D]
				})
			]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 w-full border-t border-rule pt-3",
			children: lock ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockControls, {
				lock,
				canEdit,
				token,
				busy,
				err,
				onAct: (i) => void act(i)
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: err ?? "Reading locks…"
			})
		}) : null]
	});
}
//#endregion
export { useAppAdmin as a, LockName as i, Lock3dStatusPanel as n, LockGif as r, Lock3dRail as t };
