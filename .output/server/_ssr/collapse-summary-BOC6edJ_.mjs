import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, U as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as cn } from "./renew-password-CKVw-xpD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/collapse-summary-BOC6edJ_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Purple Expand for summaries longer than two rows. Leader board + FAQ. */
function CollapseSummary({ children, className, defaultOpen = false, label = "summary" }) {
	const [open, setOpen] = (0, import_react.useState)(defaultOpen);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("text-sm leading-relaxed text-muted", open ? "" : "line-clamp-2"),
			children
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-expand hover:underline",
			"aria-expanded": open,
			onClick: () => setOpen((v) => !v),
			children: [
				open ? "Collapse" : "Expand",
				" ",
				label
			]
		})]
	});
}
//#endregion
export { CollapseSummary as t };
