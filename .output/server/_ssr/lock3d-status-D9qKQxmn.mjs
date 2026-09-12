import { o as __toESM } from "../_runtime.mjs";
import { ji as seoImgAlt } from "./brand-CDqF9nyU.mjs";
import { S as require_jsx_runtime, U as require_react, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { r as claimCopyAdmin, u as peekCopyAdmin, v as useOperator } from "./operator-B-83GDbl.mjs";
import { n as Button, s as cn } from "./renew-password-CgrcnRVg.mjs";
import { o as Radio } from "../_libs/lucide-react.mjs";
import { _ as Panel, a as GmRainbow, c as GoldCss } from "./shell-BOQjTMR4.mjs";
import { c as TAB_LOCK3D, d as lockGifSrc, i as LOCK_GIF_OPEN_NAME, n as LOCK_GIF_CLOSED, r as LOCK_GIF_OPEN, u as groupLockRows } from "./lock-status-A0BH-v5S.mjs";
import { r as APP_ADMIN_PATH } from "./tenancy-XVYWlKJ3.mjs";
import { S as setLockStatus, u as fetchLockStatus } from "./desk-rpc-DfPw_Ou_.mjs";
import { B as GM_BURST_MS, V as rainGmBurst } from "./router-DJmWpPR-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lock3d-status-D9qKQxmn.js
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
	const px = size === "lg" ? 28 : size === "sm" ? 16 : 22;
	const short = locked ? "LOCKED" : "UNLOCKED";
	const seo = seoImgAlt(locked ? "Closed padlock. LOCKED." : LOCK_GIF_OPEN_NAME);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: lockGifSrc(locked ? LOCK_GIF_CLOSED : LOCK_GIF_OPEN),
		alt: seo,
		title: short,
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
	if (css.includes("gold-css") || css.includes("pred-nav")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoldCss, {
		text: name,
		className: cn("font-semibold pred-nav gold-css", className)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("font-semibold", css, className),
		children: name
	});
}
function liveTapeClass(tape) {
	return tape === "TRUE LIVE" ? "live-tape-all" : "live-tape-half";
}
function LockCell({ row, canEdit, token, busy, showHint, showInclude, onAct }) {
	const gif = canEdit && onAct ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		disabled: busy || !token,
		onClick: () => onAct({
			op: "one",
			id: row.id,
			locked: !row.locked
		}),
		className: "lock-cell-gif inline-flex items-center justify-center rounded-md border border-rule bg-paper-raised transition-transform duration-150 ease-out active:scale-[0.96]",
		"aria-pressed": row.locked,
		"aria-label": `${row.name} ${row.label} — toggle`,
		title: row.hint,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockGif, { locked: row.locked })
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "lock-cell-gif inline-flex items-center justify-center",
		title: row.hint,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockGif, { locked: row.locked })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "lock-cell",
		children: [
			gif,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lock-cell-copy min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "lock-cell-line",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: row.to,
						hash: row.hash,
						className: cn("lock-cell-link", row.css),
						title: `${row.seo} — open view`,
						"aria-label": `Open ${row.name}`,
						onClick: () => {
							if (row.id === "gmAuto" || row.id === "gmManual") rainGmBurst(GM_BURST_MS);
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockName, {
							name: row.name,
							css: row.css
						})
					})
				}), showHint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "lock-cell-hint",
					children: row.hint
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
				className: cn("lock-cell-state", row.locked ? "text-sell" : "text-high"),
				children: row.locked ? "locked" : "unlocked"
			}),
			showInclude && canEdit && onAct ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "lock-cell-include",
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
	});
}
function LockColumn({ title, tone, rows, empty, canEdit, token, busy, showHint, showInclude, onAct }) {
	const closed = tone === "closed";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("lock-col", closed ? "lock-col-closed" : "lock-col-open"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "lock-col-h",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: closed ? "text-sell" : "text-high",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockGif, {
				locked: closed,
				size: "lg"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "lock-col-list",
			children: rows.length ? rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockCell, {
				row,
				canEdit,
				token,
				busy,
				showHint,
				showInclude,
				onAct
			}, row.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "lock-cell lock-cell-empty",
				children: empty
			})
		})]
	});
}
function LockBoard({ lock, canEdit = false, token = "", busy = false, compact = false, onAct }) {
	const grouped = groupLockRows(lock.rows);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "lock-status-board",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("lock-status-cols", compact && "lock-status-cols-stack"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockColumn, {
				title: "UNLOCKED",
				tone: "open",
				rows: grouped.unlocked,
				empty: "none unlocked",
				canEdit,
				token,
				busy,
				showHint: !compact,
				showInclude: !compact,
				onAct
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockColumn, {
				title: "LOCKED",
				tone: "closed",
				rows: grouped.locked,
				empty: "none locked",
				canEdit,
				token,
				busy,
				showHint: !compact,
				showInclude: !compact,
				onAct
			})]
		})
	});
}
function LockHead({ lock, masterLocked, expanded, onToggle }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "lock-status-head",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "lock-status-title",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockGif, {
					locked: masterLocked,
					size: "lg"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "legal-purple",
					children: TAB_LOCK3D
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
					className: masterLocked ? "text-sell" : "text-high",
					children: masterLocked ? "LOCKED" : "UNLOCKED"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "lock-status-mode",
					children: ["desk ", lock.mode]
				}),
				onToggle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "lock-status-expand text-expand",
					"aria-expanded": Boolean(expanded),
					onClick: onToggle,
					children: expanded ? "collapse" : "expand"
				}) : null
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: cn("lock-status-tape", liveTapeClass(lock.tape)),
			title: lock.tapeNote,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Lock Status" })]
		})]
	});
}
function LockControls({ lock, canEdit, token, busy, err, onAct, compact = false }) {
	const [open, setOpen] = (0, import_react.useState)(!compact);
	const included = lock.rows.filter((r) => r.include).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "lock-status-panel w-full min-w-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockHead, {
				lock,
				masterLocked: lock.masterLocked,
				expanded: open,
				onToggle: () => setOpen((v) => !v)
			}),
			open && canEdit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lock-status-actions",
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
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockBoard, {
					lock,
					canEdit,
					token,
					busy,
					compact,
					onAct
				}),
				err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-sell",
					children: err
				}) : null,
				compact ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-xs leading-relaxed text-muted",
					children: lock.notice
				})
			] }) : err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-sell",
				children: err
			}) : null
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
		title: TAB_LOCK3D,
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
	const ok = feedAudit?.ok ?? 0;
	const fail = feedAudit?.fail ?? 0;
	const total = ok + fail;
	const feedTone = total === 0 || ok === 0 ? "live-tape-none" : fail === 0 ? "live-tape-all" : ok > total / 2 ? "live-tape-most" : "live-tape-half";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "lock-status-rail mb-3 rounded-md border border-rule bg-paper-raised px-4 py-3 text-sm leading-snug text-muted sm:px-5",
		children: lock ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockControls, {
			lock,
			canEdit,
			token,
			busy,
			err,
			compact: true,
			onAct: (i) => void act(i)
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "lock-status-head",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lock-status-title",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockGif, {
					locked: masterLocked,
					size: "lg"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "legal-purple",
					children: TAB_LOCK3D
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: cn("lock-status-tape", feedTone),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "size-4 shrink-0" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Lock Status" }),
					feedAudit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "lock-status-tape-note",
						children: [
							ok,
							" live · ",
							fail,
							" down"
						]
					}) : null
				]
			})]
		})
	});
}
//#endregion
export { useAppAdmin as a, LockHead as i, Lock3dStatusPanel as n, LockBoard as r, Lock3dRail as t };
