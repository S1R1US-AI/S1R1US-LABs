import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { Vr as seoImgAlt } from "./brand-1s5EgS5V.mjs";
import { s as cn } from "./renew-password-Byk1mW0v.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bot-mark-B606-9rB.js
var import_jsx_runtime = require_jsx_runtime();
function hashName(name) {
	let h = 2166136261;
	for (const c of name) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
	return h >>> 0;
}
function BotMark({ id, name, kind, pic, rank, size = 40, className }) {
	const alt = seoImgAlt(`${name} · ${kind} · W1S3 0WL$ L3AD3R B0ARD · ai agent bitcoin trading leader board`);
	if (pic && id) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: `/api/agent/board/pic/${encodeURIComponent(id)}`,
		alt,
		title: alt,
		width: size,
		height: size,
		className: cn("board-pic shrink-0 object-cover", `kind-${kind}`, rank === 1 && "board-pic-leader", className),
		style: {
			width: size,
			height: size
		}
	});
	const h = hashName(name);
	const letters = name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase() || kind.slice(0, 2).toUpperCase();
	const a = 8 + h % 10;
	const b = 18 + (h >>> 5) % 12;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 40 40",
		width: size,
		height: size,
		className: cn("board-pic shrink-0", `kind-${kind}`, rank === 1 && "board-pic-leader", className),
		role: "img",
		"aria-label": alt,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("title", { children: alt }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "40",
				height: "40",
				rx: "8",
				fill: "var(--color-bg)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "1",
				y: "1",
				width: "38",
				height: "38",
				rx: "7",
				fill: "none",
				stroke: "var(--kind-fill, var(--color-oss))",
				strokeWidth: "1.6"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: 12 + h % 8,
				cy: 14,
				r: "5",
				fill: "var(--kind-fill, var(--color-oss))",
				opacity: "0.35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: 28 - h % 6,
				cy: 26,
				r: "7",
				fill: "var(--kind-fill, var(--color-oss))",
				opacity: "0.22"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: `M${a} 30 L${b} 10 L${b + 10} 30`,
				fill: "none",
				stroke: "var(--kind-fill, var(--color-oss))",
				strokeWidth: "1.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "20",
				y: "25",
				textAnchor: "middle",
				fontSize: "11",
				fontFamily: "IBM Plex Mono, ui-monospace, monospace",
				fill: "var(--kind-fill, var(--color-oss))",
				fontWeight: "700",
				children: letters
			})
		]
	});
}
//#endregion
export { BotMark as t };
