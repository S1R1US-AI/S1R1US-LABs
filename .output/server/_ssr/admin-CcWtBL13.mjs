import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, X as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as useOperator } from "./operator-DMHmffk2.mjs";
import { S as Shell, p as OperatorGate } from "./shell-C653Z4G2.mjs";
import { d as grantAdminAssets } from "./desk-rpc-tjKfVyKd.mjs";
import { H as useIsClient } from "./router-CmoEKDka.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-CcWtBL13.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Admin page code loads only after the server confirms the admin session. */
var AdminPanel = () => null;
function Opening({ failed }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto max-w-lg px-4 py-10 sm:px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: failed ? "Could not open Admin. Refresh, or sign in again." : "Opening Admin…"
		})
	});
}
function AdminEntry() {
	const mounted = useIsClient();
	const token = useOperator((s) => s.token);
	const unlocked = useOperator((s) => s.unlocked);
	const role = useOperator((s) => s.role);
	const [granted, setGranted] = (0, import_react.useState)(null);
	const [failed, setFailed] = (0, import_react.useState)(false);
	const admin = mounted && unlocked && role === "admin" && Boolean(token);
	(0, import_react.useEffect)(() => {
		if (!admin) {
			if (granted) grantAdminAssets({ data: { token: "" } }).catch(() => void 0).then(() => setGranted(null));
			return;
		}
		if (granted === token) return;
		let gone = false;
		grantAdminAssets({ data: { token } }).then((res) => {
			if (gone) return;
			setGranted(res.ok ? token : null);
			setFailed(!res.ok);
		}).catch(() => {
			if (!gone) setFailed(true);
		});
		return () => {
			gone = true;
		};
	}, [
		admin,
		token,
		granted
	]);
	if (admin && granted === token) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
		fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Opening, {}) }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPanel, {})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OperatorGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Opening, { failed }) }) });
}
var SplitComponent = AdminEntry;
//#endregion
export { SplitComponent as component };
