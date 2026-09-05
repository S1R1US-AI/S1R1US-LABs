import { o as __toESM } from "../_runtime.mjs";
import { H as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { g as createSsrRpc, h as useOperator } from "./operator-Mf8Bhxch.mjs";
import { g as setTapeFreeze, l as fetchTapeMeta } from "./store-CmU31tUT.mjs";
import { n as Button } from "./renew-password-CkoXvjlb.mjs";
import { s as Panel } from "./shell-ORcVF3D4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/grok-SzEUGxaV.js
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
			"Tape frozen · ",
			when,
			" · Lab and tests use this snapshot. Free APIs idle."
		]
	});
}
function TapeFreezePanel() {
	const token = useOperator((s) => s.token);
	const [frozen, setFrozen] = (0, import_react.useState)(false);
	const [at, setAt] = (0, import_react.useState)(null);
	const [price, setPrice] = (0, import_react.useState)(null);
	const [err, setErr] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		fetchTapeMeta().then((m) => {
			setFrozen(m.frozen);
			setAt(m.at);
			setPrice(m.price);
		});
	}, []);
	async function toggle() {
		setErr(null);
		const res = await setTapeFreeze({ data: {
			token,
			frozen: !frozen
		} });
		if (!res.ok) {
			setErr(res.error ?? "Could not change tape freeze");
			return;
		}
		setFrozen(res.frozen);
		setAt(res.at);
		setPrice(res.price);
	}
	const when = at ? new Date(at).toLocaleString("en-US") : "none yet";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		className: "mt-4",
		kicker: "Tape",
		title: frozen ? "Frozen · last good" : "Live 5-minute",
		titleClass: frozen ? "text-medium" : "text-high",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Frozen = tests and Lab use the last validated snapshot. No Coinbase / mempool / FRED pulls until you unfreeze. Live = one pull every 5 minutes. That is the mandate clock."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 font-mono text-xs text-muted",
				children: [
					"Last good ",
					when,
					price != null ? ` · $${Math.round(price).toLocaleString("en-US")}` : ""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-3",
				variant: "primary",
				onClick: () => void toggle(),
				children: frozen ? "Unfreeze — live 5-minute pulls" : "Freeze tape — test without APIs"
			}),
			err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-down",
				children: err
			}) : null
		]
	});
}
var askHelios = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("70e9587696840a33b344a5ecd8706e3aa8526f9c1a9462bcac2625207915aa78"));
var adminStatus = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("7426936e6524e949f61ef1414e1b7b92054624acddd912f28187bda0b5b11380"));
//#endregion
export { askHelios as i, TapeFreezePanel as n, adminStatus as r, TapeFreezeBanner as t };
