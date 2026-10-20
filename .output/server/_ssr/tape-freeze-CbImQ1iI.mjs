import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, X as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as fetchTapeMeta } from "./desk-rpc-GAflCaAJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tape-freeze-CbImQ1iI.js
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
//#endregion
export { TapeFreezeBanner as t };
