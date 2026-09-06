import { o as __toESM } from "../_runtime.mjs";
import { H as require_react, v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as runBots, t as heliosCall } from "./signal-5Nu7fOCC.mjs";
import { t as DESK_POLL_MS } from "./poll-ByA4PSVX.mjs";
import { l as useDeskTape } from "./tape-client-B1bBbHwr.mjs";
import { s as Shell } from "./shell-DL0EAAfV.mjs";
import { t as rollBots } from "./roll-bots-DKE-Mefn.mjs";
import { t as DeskWorkspace } from "./desk-workspace-CEd4vZ1n.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/theme-CumipMR0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ThemeTest() {
	const { snap } = useDeskTape();
	const [copied] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		rollBots({ force: true });
		const id = window.setInterval(() => void rollBots(), DESK_POLL_MS);
		return () => window.clearInterval(id);
	}, []);
	const briefs = (0, import_react.useMemo)(() => snap ? runBots(snap) : [], [snap]);
	const call = (0, import_react.useMemo)(() => snap ? heliosCall(snap, briefs, 1e3) : null, [snap, briefs]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-[1400px] px-3 py-4 sm:px-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mb-3 text-xs text-muted",
			children: [
				"This chrome is live on the desk.",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "text-tab hover:underline",
					children: "Open tape"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskWorkspace, {
			snap,
			briefs,
			call,
			canAct: false,
			canFill: false,
			asking: false,
			copied,
			grok: null,
			grokErr: null,
			onAsk: () => {
				window.location.assign("/compute");
			},
			onCopy: () => void 0,
			onFill: () => void 0
		})]
	}) });
}
//#endregion
export { ThemeTest as component };
