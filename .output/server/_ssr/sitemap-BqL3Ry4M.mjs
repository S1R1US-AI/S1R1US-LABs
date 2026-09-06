import { v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as APP_NAME, o as LABS_NAME, ot as TAB_DESK, z as SEO_CANONICAL } from "./brand-BKM5q_W_.mjs";
import { o as Panel, s as Shell } from "./shell-DL0EAAfV.mjs";
import { t as SeoCopy } from "./seo-copy-DuTtbdcl.mjs";
import { a as PUBLIC_PAGES, o as SITEMAP_MACHINE } from "./router-Clczj6X9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sitemap-BqL3Ry4M.js
var import_jsx_runtime = require_jsx_runtime();
function SitemapPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoCopy, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-3xl px-4 py-8 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs tracking-[0.12em] text-oss uppercase",
				children: "Sitemap"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-2xl font-bold tracking-tight text-medium",
				children: APP_NAME
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm leading-relaxed text-muted",
				children: [
					"Main menu: S1R1US Live Tape, S1R1US L@Bs, GM, F33D, AI Agents, FAQ, @S1R1US_AI. Public pages for ",
					LABS_NAME,
					": ",
					TAB_DESK,
					" (S1R1US 7-bot hedge fund), G0DZ1LLa M0D3 (Godzilla mode), B3AT TH3 B3AR$ (Beat the Bears), AI AG3NTS (AI AGENTS), W1S3 0WL (Wise Owl), F33D H0ST1Ng (Feed Hosting), Buy M3 a Cup of C0FF33 (Buy Me a Cup of Coffee), Call1ng All B0Ts (Calling All Bots). Home is",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "text-oss hover:underline",
						href: "https://s1r1us.ai/",
						children: "https://s1r1us.ai/"
					}),
					"— not /heliosbot. Official company X:",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "text-oss hover:underline",
						href: "https://x.com/S1R1US_AI",
						children: "@S1R1US_AI"
					}),
					". Machine sitemap:",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "text-oss hover:underline",
						href: "/sitemap.xml",
						children: "sitemap.xml"
					}),
					". AI agents start at",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "text-oss hover:underline",
						href: "/llms.txt",
						children: "/llms.txt"
					}),
					". Crawlers: ",
					SEO_CANONICAL
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				kicker: "Index",
				title: "Public URLs",
				className: "mt-6",
				kickerClass: "text-oss",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-3",
					children: PUBLIC_PAGES.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: p.path,
							className: "font-medium text-fg hover:underline",
							children: p.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs text-muted",
							children: p.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: p.hint
						})
					] }, p.path))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				kicker: "Agents",
				title: "Machine URLs",
				className: "mt-6",
				kickerClass: "text-tab",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-3",
					children: SITEMAP_MACHINE.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: p.loc,
							className: "font-medium text-fg hover:underline",
							children: p.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs text-muted",
							children: p.loc.replace(SEO_CANONICAL.replace(/\/$/, ""), "")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: p.hint
						})
					] }, p.loc))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 font-mono text-xs text-oss",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/faq",
						className: "hover:underline",
						children: "FAQ"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "px-2",
						children: "|"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "hover:underline",
						children: TAB_DESK
					})
				]
			})
		]
	})] });
}
var SplitComponent = SitemapPage;
//#endregion
export { SplitComponent as component };
