import { S as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as APP_NAME } from "./brand-D1W3F7j-.mjs";
import { r as MailboxRenewForm } from "./renew-password-dhV3CJgU.mjs";
import { r as Route } from "./router-D1mMBW2E.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/renew-BsXjZbp-.js
var import_jsx_runtime = require_jsx_runtime();
function RenewPage() {
	const { t } = Route.useSearch();
	const token = (t ?? "").trim();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-lg px-4 py-10 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-[0.08em] text-muted uppercase",
				children: "Password renew"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-2xl font-bold tracking-tight text-medium",
				children: APP_NAME
			}),
			token.length === 64 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed text-muted",
				children: "Set a new admin password. This link works once."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MailboxRenewForm, { token })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed text-muted",
				children: "This renew link is missing or incomplete. Sign in with X as the bound admin and request a new one."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin",
					className: "text-brand underline-offset-2 hover:underline",
					children: "login"
				})
			})
		]
	});
}
//#endregion
export { RenewPage as component };
