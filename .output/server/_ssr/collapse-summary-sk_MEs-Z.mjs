import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, U as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as cn } from "./renew-password-BC1QtO22.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/collapse-summary-sk_MEs-Z.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Purple expand / collapse for summaries longer than two rows. Leader board + FAQ. */
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
				open ? "collapse" : "expand",
				" ",
				label
			]
		})]
	});
}
/** Purple expand / collapse for long ranked lists so two-column boards stay even. */
function CollapseMore({ open, onToggle, more, label, className }) {
	if (!open && more <= 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: cn("mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-expand hover:underline", className),
		"aria-expanded": open,
		onClick: onToggle,
		children: open ? `collapse ${label}` : `expand ${label} · ${more} more`
	});
}
//#endregion
export { CollapseSummary as n, CollapseMore as t };
