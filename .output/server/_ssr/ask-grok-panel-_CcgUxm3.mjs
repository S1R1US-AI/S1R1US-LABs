import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, U as require_react, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Y as PAGE_DESC_COMPUTE, rn as SEO_TAB_COMPUTE, zn as TAB_COMPUTE } from "./brand-DGWej0Mj.mjs";
import { r as getBearerToken } from "./client-Dp7wcF1K.mjs";
import { m as useCurrentUserState, n as Button } from "./renew-password-SvIj_uPF.mjs";
import { f as LoaderCircle, r as ScanSearch } from "../_libs/lucide-react.mjs";
import { _ as Panel } from "./shell-CysRo7MU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ask-grok-panel-_CcgUxm3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KEY_SESSION = "s1r1us.byo-xai";
function loadKey() {
	if (typeof window === "undefined") return "";
	try {
		return window.sessionStorage.getItem(KEY_SESSION) ?? "";
	} catch {
		return "";
	}
}
function AskGrokPanel({ kicker = "Ask Grok" }) {
	const { user, isPending } = useCurrentUserState();
	const [key, setKey] = (0, import_react.useState)(loadKey);
	const [question, setQuestion] = (0, import_react.useState)("Grade 7-B0T on this tape. Accumulate BTC — never short.");
	const [text, setText] = (0, import_react.useState)(null);
	const [err, setErr] = (0, import_react.useState)(null);
	const [asking, setAsking] = (0, import_react.useState)(false);
	const [copyAdmin, setCopyAdmin] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			setCopyAdmin((window.sessionStorage.getItem("h3-app-token") ?? "").startsWith("app."));
		} catch {
			setCopyAdmin(false);
		}
	}, []);
	const identified = Boolean(user) || copyAdmin;
	async function onAsk() {
		setAsking(true);
		setErr(null);
		try {
			if (key) try {
				window.sessionStorage.setItem(KEY_SESSION, key);
			} catch {}
			const bearer = getBearerToken() ?? void 0;
			let appToken;
			try {
				const t = window.sessionStorage.getItem("h3-app-token") ?? "";
				if (t.startsWith("app.")) appToken = t;
			} catch {}
			const { askHeliosByo } = await import("./grok-sMB2NRH5.mjs").then((n) => n.r);
			const res = await askHeliosByo({ data: {
				xaiKey: key,
				question,
				bearer,
				appToken
			} });
			if (!res.ok) setErr(res.error);
			else setText(res.text);
		} catch (e) {
			setErr(e instanceof Error ? e.message : "Ask Grok failed");
		} finally {
			setAsking(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		kicker,
		title: TAB_COMPUTE,
		kickerClass: "text-tab",
		titleClass: "text-medium",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm leading-relaxed text-muted",
				children: [
					PAGE_DESC_COMPUTE,
					" Sign in with X for identity, or unlock Admin on the iOS / Google copy. Paste your xAI API key so Ask Grok spends",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-fg",
						children: "your"
					}),
					" compute, not the operator SuperGrok bill. The key stays in this browser session — this host never stores it. Combine with on-device Apple Intelligence / Gemini: both ACCUMULATE to ACCUMULATE, else WAIT. ",
					SEO_TAB_COMPUTE,
					"."
				]
			}),
			isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "Checking sign-in…"
			}) : null,
			!isPending && !identified ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "text-tab hover:underline",
						children: "Sign in with X"
					}),
					" · ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/app/admin",
						className: "text-tab hover:underline",
						children: "Unlock copy Admin"
					}),
					" ",
					"then return here."
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-4 block text-xs tracking-[0.12em] text-muted uppercase",
				children: ["xAI API key (your bill)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "password",
					autoComplete: "off",
					value: key,
					onChange: (e) => setKey(e.target.value),
					placeholder: "xai-…",
					className: "mt-1 w-full rounded-md border border-rule bg-bg px-3 py-2 font-mono text-sm text-fg"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-3 block text-xs tracking-[0.12em] text-muted uppercase",
				children: ["Strategy question", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: question,
					onChange: (e) => setQuestion(e.target.value),
					rows: 3,
					className: "mt-1 w-full rounded-md border border-rule bg-bg px-3 py-2 text-sm text-fg"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => void onAsk(),
					disabled: asking || !identified,
					children: [asking ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanSearch, { className: "size-4" }), "Ask Grok"]
				})
			}),
			err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-down",
				children: err
			}) : null,
			text ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 whitespace-pre-wrap border-t border-rule pt-3 text-sm leading-relaxed",
				children: text
			}) : null
		]
	});
}
//#endregion
export { AskGrokPanel as t };
