import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, U as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as fetchTapeMeta, w as setTapeFreeze } from "./desk-rpc-DfPw_Ou_.mjs";
import { v as useOperator } from "./operator-Bi5PjJBI.mjs";
import { n as Button } from "./renew-password-DgmoQopP.mjs";
import { o as Play, s as Pause } from "../_libs/lucide-react.mjs";
import { _ as Panel } from "./shell-C0cyFbMt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tape-freeze-X4oZ95tF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TapeFreezeBanner() {
	const [frozen, setFrozen] = (0, import_react.useState)(false);
	const [at, setAt] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		fetchTapeMeta().then((m) => {
			setFrozen(m.frozen);
			setAt(m.at);
		});
	}, []);
	if (!frozen) return null;
	const when = at ? new Date(at).toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit"
	}) : "last good";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "mb-3 font-mono text-xs text-medium",
		children: [
			"Data pulls paused · last good ",
			when,
			" · desk uses this snapshot. Free market APIs idle. Mandate unchanged."
		]
	});
}
function TapeFreezePanel({ onChange }) {
	const token = useOperator((s) => s.token);
	const [frozen, setFrozen] = (0, import_react.useState)(false);
	const [at, setAt] = (0, import_react.useState)(null);
	const [pausedAt, setPausedAt] = (0, import_react.useState)(null);
	const [price, setPrice] = (0, import_react.useState)(null);
	const [err, setErr] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		fetchTapeMeta().then((m) => {
			setFrozen(m.frozen);
			setAt(m.at);
			setPausedAt(m.pausedAt ?? null);
			setPrice(m.price);
		});
	}, []);
	async function toggle() {
		if (!token) return;
		setErr(null);
		setBusy(true);
		try {
			const res = await setTapeFreeze({ data: {
				token,
				frozen: !frozen
			} });
			if (!res.ok) {
				setErr(res.error ?? "Could not change data-pull pause");
				return;
			}
			setFrozen(res.frozen);
			setAt(res.at);
			setPausedAt(res.pausedAt ?? null);
			setPrice(res.price);
			onChange?.(res.frozen);
		} finally {
			setBusy(false);
		}
	}
	const when = at ? new Date(at).toLocaleString("en-US") : "none yet";
	const pausedWhen = pausedAt ? pausedAt.slice(0, 19).replace("T", " ") : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		className: "mt-4",
		kicker: "Data pulls",
		title: frozen ? "Paused · last good snapshot" : "Live 5-minute clock",
		kickerClass: frozen ? "text-medium" : "text-high",
		titleClass: frozen ? "text-medium" : "text-high",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-relaxed text-muted",
				children: "Pause suspends Coinbase, FRED, mempool, ETF, and other tape fetches so you can test UI, Lab, Security, and agents on the last validated snapshot. External AI agents read ops.status PAUSED on ping and must not trade on that snapshot. Resume stamps waitlist invites (invite.status SENT). It does not unlock live Coinbase, does not sell bitcoin, does not change 7-B0T's accumulate mandate, does not green errors, and does not close the external AI gate. Resume restores the 5-minute pull clock."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 font-mono text-xs text-muted",
				children: [
					"Last good ",
					when,
					price != null ? ` · $${Math.round(price).toLocaleString("en-US")}` : "",
					frozen && pausedWhen ? ` · paused ${pausedWhen}Z` : ""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "mt-3",
				variant: "primary",
				onClick: () => void toggle(),
				disabled: busy || !token,
				children: [frozen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-4" }), busy ? frozen ? "Resuming…" : "Pausing…" : frozen ? "Resume data pulls" : "Pause data pulls"]
			}),
			err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-down",
				children: err
			}) : null
		]
	});
}
//#endregion
export { TapeFreezePanel as n, TapeFreezeBanner as t };
