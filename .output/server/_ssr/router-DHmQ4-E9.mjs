import { o as __toESM, r as __exportAll } from "../_runtime.mjs";
import { H as require_react, _ as createRootRoute, b as useRouter, d as useRouterState, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, x as require_jsx_runtime, z as redirect } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { s as COMPANY_X_HANDLE } from "./x-admin-Dt29NgIk.mjs";
import { E as TAB_FEED, T as TAB_DESK, V as TAB_LAB, _ as SEO_DESCRIPTION, a as PAGE_DESC_FAQ, c as PAGE_DESC_LAB, d as PAGE_TITLE_FEED, f as PAGE_TITLE_GM, g as SEO_CANONICAL, i as LABS_NAME, k as TAB_GM, l as PAGE_DESC_SITEMAP, m as PAGE_TITLE_SITEMAP, n as APP_NAME, o as PAGE_DESC_FEED, p as PAGE_TITLE_LAB, s as PAGE_DESC_GM, u as PAGE_TITLE_FAQ, v as SEO_KEYWORDS, w as SEO_TITLE } from "./brand-uNMMM_l-.mjs";
import { _ as clampGmTf, a as DEFAULT_GM_VARS, g as clampGmRisk, h as clampGmCash, y as gmCall } from "./auto-window-BbpylLkY.mjs";
import { g as createSsrRpc, h as useOperator } from "./operator-Be3_TEkH.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { p as peekDeskTape } from "./store-CmU31tUT.mjs";
import { i as usePractice, r as useAutoRun } from "./practice-Ba1wrwhg.mjs";
import { L as string, N as number, P as object, R as union, j as literal } from "../_libs/@better-auth/core+[...].mjs";
import { i as signOut } from "./client-CVqXY6bk.mjs";
import { t as auth } from "./server-D397yBRC.mjs";
import { t as TriangleAlert } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gm-store-CqwDE6Ui.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function emptyBook(cash) {
	return {
		cashUsd: cash,
		btc: 0,
		profitBtc: 0,
		fills: []
	};
}
function navOf(book, px) {
	return book.cashUsd + book.btc * (px ?? 0);
}
var useGm = create()(persist((set, get) => ({
	pilot: "AUTO",
	view: "practice",
	risk: 2,
	bookUsd: 1e4,
	dayHours: 1,
	vars: { ...DEFAULT_GM_VARS },
	practice: emptyBook(1e4),
	live: emptyBook(1e4),
	ticks: [],
	lastTick: null,
	running: false,
	busy: false,
	error: null,
	liveUnlocked: false,
	setPilot: (pilot) => set({ pilot }),
	setView: (view) => {
		if (view === "live" && !get().liveUnlocked) {
			set({ view: "live" });
			return;
		}
		set({ view });
	},
	setRisk: (n) => set({ risk: clampGmRisk(n) }),
	setBookUsd: (n) => set({ bookUsd: clampGmCash(n) }),
	setDayHours: (n) => set({ dayHours: clampGmTf(n) }),
	setVar: (id, on) => set((s) => ({ vars: {
		...s.vars,
		[id]: on
	} })),
	applyBook: () => {
		const cash = clampGmCash(get().bookUsd);
		set({
			bookUsd: cash,
			practice: emptyBook(cash),
			ticks: [],
			lastTick: null,
			error: null
		});
	},
	resetBook: () => {
		set({
			practice: emptyBook(clampGmCash(get().bookUsd)),
			ticks: [],
			lastTick: null,
			error: null
		});
	},
	setLiveUnlocked: (on) => set({
		liveUnlocked: on,
		view: on ? get().view : get().view === "live" ? "live" : "practice"
	}),
	start: () => {
		set({
			running: false,
			liveUnlocked: false,
			error: "Practice paused — LAUNCH BUILD DEPLOY #39"
		});
	},
	tick: async ({ admin }) => {
		if (get().running || get().liveUnlocked) set({
			running: false,
			liveUnlocked: false
		});
		if (get().busy) return;
		try {
			let snap = peekDeskTape();
			if (!snap) {
				set({ lastTick: (/* @__PURE__ */ new Date()).toISOString() });
				return;
			}
			const liveOn = false;
			const bookKey = "practice";
			const book = get()[bookKey];
			const px = snap.btc.price;
			const nav = navOf(book, px);
			const call = gmCall(snap, nav || get().bookUsd, {
				pilot: get().pilot,
				risk: get().risk,
				manual: get().vars,
				adminLive: liveOn,
				dayHours: get().dayHours
			});
			let next = book;
			const tick = {
				at: (/* @__PURE__ */ new Date()).toISOString(),
				call,
				executed: false,
				price: px,
				cash: next.cashUsd,
				btc: next.btc,
				nav: navOf(next, px),
				book: bookKey
			};
			set({
				practice: next,
				ticks: [tick, ...get().ticks].slice(0, 40),
				lastTick: tick.at,
				busy: false,
				error: null,
				vars: get().pilot === "AUTO" ? call.vars : get().vars
			});
		} catch (e) {
			set({
				busy: false,
				error: `gm: ${e instanceof Error ? e.message : "tick failed"}`,
				lastTick: (/* @__PURE__ */ new Date()).toISOString()
			});
		}
	}
}), {
	name: "s1r1us-gm-off-20260904",
	partialize: (s) => ({
		pilot: s.pilot,
		view: "practice",
		risk: s.risk,
		bookUsd: s.bookUsd,
		dayHours: s.dayHours,
		vars: s.vars,
		practice: s.practice,
		ticks: s.ticks,
		running: s.running
	})
}));
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/legal-BtraLwKJ.js
var IDLE_MS = 3e5;
var BURST_MS = 3e3;
var GM_SEQ = "G0DZ1LLa M0D3";
var CLASSIC = "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789";
var RAINBOW = [
	"#ff1f1f",
	"#ff8a1f",
	"#f4e14b",
	"#3dff1a",
	"#5eb3e4",
	"#9b6bdb",
	"#e879b0"
];
var burstFns = /* @__PURE__ */ new Set();
/** 3s Matrix rain on the GM tab — does not lock the session. */
function rainGmBurst(ms = BURST_MS) {
	for (const fn of burstFns) fn(ms);
}
function rainbowAt(tMs, col, row) {
	const cycle = 3600;
	const i = (tMs + col * 90 + row * 220) % cycle / cycle * RAINBOW.length;
	return RAINBOW[Math.floor(i) % RAINBOW.length] ?? "#3dff1a";
}
/** GM rain only on the G0DZ1LLa M0D3 tab. Every other view uses classic rain. */
function gmRainActive() {
	const path = typeof window !== "undefined" ? window.location.pathname : "";
	return path === "/gm" || path.startsWith("/gm/");
}
function MatrixSaver() {
	const canvasRef = (0, import_react.useRef)(null);
	const [mode, setMode] = (0, import_react.useState)("off");
	const [rain, setRain] = (0, import_react.useState)("classic");
	const modeRef = (0, import_react.useRef)("off");
	(0, import_react.useEffect)(() => {
		modeRef.current = mode;
	}, [mode]);
	(0, import_react.useEffect)(() => {
		let idleTimer = window.setTimeout(trip, IDLE_MS);
		let burstTimer = 0;
		async function trip() {
			const useGmRain = gmRainActive();
			const session = useOperator.getState();
			if (!session.unlocked) {
				setRain(useGmRain ? "gm" : "classic");
				setMode("burst");
				window.clearTimeout(burstTimer);
				burstTimer = window.setTimeout(() => {
					if (modeRef.current === "burst") setMode("off");
				}, 8e3);
				idleTimer = window.setTimeout(trip, IDLE_MS);
				return;
			}
			session.lockFromIdle();
			try {
				signOut("/login");
			} catch {
				try {
					sessionStorage.removeItem("grok-auth.bearer-token");
				} catch {}
			}
			setRain(useGmRain ? "gm" : "classic");
			setMode("lock");
		}
		function burst(ms) {
			if (modeRef.current === "lock") return;
			setRain("gm");
			setMode("burst");
			window.clearTimeout(burstTimer);
			burstTimer = window.setTimeout(() => {
				if (modeRef.current === "burst") setMode("off");
			}, ms);
		}
		burstFns.add(burst);
		function goLogin() {
			window.location.assign("/login");
		}
		function poke(ev) {
			if (modeRef.current === "lock") {
				if (!useOperator.getState().unlocked) {
					setMode("off");
					idleTimer = window.setTimeout(trip, IDLE_MS);
					return;
				}
				if (ev.type === "pointermove" || ev.type === "wheel" || ev.type === "scroll") return;
				goLogin();
				return;
			}
			window.clearTimeout(idleTimer);
			idleTimer = window.setTimeout(trip, IDLE_MS);
		}
		const events = [
			"pointerdown",
			"pointermove",
			"keydown",
			"wheel",
			"touchstart",
			"scroll"
		];
		for (const e of events) window.addEventListener(e, poke, { passive: true });
		return () => {
			window.clearTimeout(idleTimer);
			window.clearTimeout(burstTimer);
			burstFns.delete(burst);
			for (const e of events) window.removeEventListener(e, poke);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (mode === "off") return;
		const raw = canvasRef.current;
		const rawCtx = raw?.getContext("2d") ?? null;
		if (!raw || !rawCtx) return;
		const surface = raw;
		const g = rawCtx;
		const gmTheme = rain === "gm";
		const burstFall = mode === "burst";
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		let columns = [];
		let size = 16;
		let pitch = 16;
		let rowGap = 28;
		let raf = 0;
		let running = true;
		const t0 = performance.now();
		function resize() {
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			const w = window.innerWidth;
			const h = window.innerHeight;
			surface.width = Math.floor(w * dpr);
			surface.height = Math.floor(h * dpr);
			surface.style.width = `${w}px`;
			surface.style.height = `${h}px`;
			g.setTransform(dpr, 0, 0, dpr, 0, 0);
			g.imageSmoothingEnabled = false;
			size = w < 480 ? 20 : 24;
			pitch = size / 1.875;
			rowGap = Math.round(size * 1.78);
			const count = Math.ceil(w / pitch);
			const rows = Math.max(1, h / rowGap);
			const fall = burstFall ? rows / 180 : (reduced ? .28 + Math.random() * .2 : .5 + Math.random() * .8) * .5419;
			columns = Array.from({ length: count }, (_, i) => ({
				y: burstFall ? -Math.random() * rows * .35 : Math.random() * rows,
				speed: burstFall ? fall * (.92 + Math.random() * .16) : fall,
				gm: gmTheme ? i % 12 === 0 : Math.random() < .05,
				seq: Math.floor(Math.random() * 13),
				hold: 18 + Math.floor(Math.random() * 12),
				glyphs: Array.from({ length: 11 }, () => CLASSIC[Math.floor(Math.random() * 97)] ?? "0")
			}));
			g.fillStyle = "#000";
			g.fillRect(0, 0, w, h);
		}
		function glyph() {
			return CLASSIC[Math.floor(Math.random() * 97)] ?? "0";
		}
		let frame = 0;
		function tick(now) {
			if (!running) return;
			if (document.hidden) {
				raf = window.requestAnimationFrame(tick);
				return;
			}
			frame += 1;
			const w = window.innerWidth;
			const h = window.innerHeight;
			const tMs = now - t0;
			g.fillStyle = reduced ? "rgba(0,0,0,0.28)" : "rgba(0,0,0,0.2)";
			g.fillRect(0, 0, w, h);
			g.font = `700 ${size}px "IBM Plex Mono", Consolas, monospace`;
			g.textBaseline = "top";
			g.textAlign = "left";
			const classicPx = Math.round(size * 1.08);
			const gmPx = Math.round(size * .92);
			for (let i = 0; i < columns.length; i++) {
				const col = columns[i];
				const x = Math.round(i * pitch);
				const flip = frame % col.hold === 0;
				if (col.gm) {
					g.font = `600 ${gmPx}px "IBM Plex Mono", Consolas, monospace`;
					if (flip) col.seq = (col.seq + 1) % 13;
					const trail = 13;
					for (let k = 0; k < trail; k++) {
						const yy = Math.round((col.y - k) * rowGap);
						if (yy < -rowGap || yy > h) continue;
						const ch = GM_SEQ[(col.seq + k) % 13] ?? "G";
						g.fillStyle = rainbowAt(tMs, i, Math.floor(col.y) - k);
						g.fillText(ch === " " ? "·" : ch, x, yy);
					}
				} else {
					g.font = `800 ${classicPx}px "IBM Plex Mono", Consolas, monospace`;
					if (flip) {
						col.glyphs.pop();
						col.glyphs.unshift(glyph());
					}
					const y = Math.round(col.y * rowGap);
					const greens = [
						"#d8ff9a",
						"#b6ff7a",
						"#4dff3a",
						"#3dff1a",
						"#32c428",
						"#2f9e2c",
						"#268528",
						"#1d7a22",
						"#17661a",
						"#125214",
						"#0d3f10"
					];
					for (let k = 0; k < col.glyphs.length; k++) {
						const yy = y - k * rowGap;
						if (yy < -rowGap || yy > h) continue;
						const ch = col.glyphs[k] ?? "0";
						g.strokeStyle = "#031208";
						g.lineWidth = 1.35;
						g.strokeText(ch, x, yy);
						g.fillStyle = greens[k] ?? "#17661a";
						g.fillText(ch, x, yy);
					}
				}
				col.y += col.speed;
				if (!burstFall && col.y * rowGap > h && Math.random() > (reduced ? .992 : .975)) col.y = 0;
			}
			g.fillStyle = "#2f7d34";
			g.fillText(APP_NAME, 16, h - size * 2);
			raf = window.requestAnimationFrame(tick);
		}
		resize();
		window.addEventListener("resize", resize);
		raf = window.requestAnimationFrame(tick);
		return () => {
			running = false;
			window.cancelAnimationFrame(raf);
			window.removeEventListener("resize", resize);
		};
	}, [mode, rain]);
	if (mode === "off") return null;
	const burst = mode === "burst";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: burst ? "pointer-events-none fixed inset-0 z-[90] bg-bg/80" : "fixed inset-0 z-[90] bg-bg",
		role: "presentation",
		"aria-label": burst ? "G0DZ1LLa M0D3" : "Locked. Sign in again to continue.",
		onPointerDown: burst ? void 0 : () => window.location.assign("/login"),
		onKeyDown: burst ? void 0 : () => window.location.assign("/login"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
			ref: canvasRef,
			className: "block h-full w-full"
		})
	});
}
var TERMS_PATH = "/terms";
var TERMS_TITLE = "Terms and Agreements";
var TERMS_HOVER = `${TERMS_TITLE} · using this website is agreement · not financial advice`;
var LEGAL_NFA = "Not financial advice. Not licensed. Not a broker-dealer. Not an investment adviser. Not a recommendation to buy, sell, or hold bitcoin, any token, or any other asset. Education only. Seek a licensed professional. Invest only on the advice of a licensed advisor. You can lose all funds.";
var LEGAL_HOWEY = "Nothing on this website is an offer to sell or a solicitation to buy a security. A cultural ticker, if one exists on a public pad, is not shares of the desk, not a claim on bitcoin, not a share of profit, and not how the trading book is funded. The desk is funded only by operator cash and unconditional gifts that receive nothing back. Do not buy any ticker because bots, a treasury, or a bitcoin stack exist.";
var LEGAL_USE_IS_AGREEMENT = "By accessing or using this website you agree to the Terms and Agreements. If you do not agree, do not use the site.";
var TERMS_UPDATED = "2026-09-05";
var TERMS_SECTIONS = [
	{
		id: "accept",
		title: "1. Acceptance by use",
		body: `These Terms and Agreements (the "Terms") are a binding agreement between you and ${LABS_NAME} (${APP_NAME}) for https://s1r1us.ai and related pages. Accessing, browsing, or otherwise using the website constitutes your agreement to these Terms and to the disclaimer below. If you do not agree, leave the site.`
	},
	{
		id: "nfa",
		title: "2. Not financial advice — seek a licensed professional",
		body: LEGAL_NFA
	},
	{
		id: "howey",
		title: "3. No offer of securities",
		body: `${LEGAL_HOWEY} Company public desk on X is ${COMPANY_X_HANDLE}. That account is not an invitation to purchase a security. This site does not sell tokens.`
	},
	{
		id: "token",
		title: "4. T0K3N L@UNCH (Token launch)",
		body: `A cultural ticker named s1r1us may appear on a public meme pad such as pump.fun. T0K3N L@UNCH is also searched as Token launch. It is not ${TAB_DESK} (S1R1US 7-bot hedge fund). It is not equity, debt, a profit share, a vote, or a claim on any bitcoin, USDC, or other asset held by the desk. Creator fees, bonding-curve inventory, and locked LP (if any) are not the Coinbase book and are not used to buy bitcoin for holders. This website does not take orders for that ticker and does not promise price, liquidity, or profit from anyone's efforts.`
	},
	{
		id: "desk",
		title: "5. The desk, lab, and sleeves",
		body: `${TAB_DESK} (S1R1US 7-bot hedge fund), ${TAB_LAB} (S1R1US Lab Strategies), ${TAB_GM} (Godzilla mode), and ${TAB_FEED} (Feed Godzilla mode) are educational tools and open-source software. Practice and paper fills are not live orders. Live execution, if ever unlocked, is the operator's own risk. You are responsible for any action you take.`
	},
	{
		id: "gifts",
		title: "6. Donations and gifts",
		body: `${TAB_FEED} wallets, if used, are optional gifts to help pay hosting, domain, and app-store fees. Gifts buy no ticker, no equity, no profit share, and no service level. Do not send anything except the stated asset to the stated address. Wrong-network sends can be lost.`
	},
	{
		id: "risk",
		title: "7. Risk of loss",
		body: "Cryptocurrency, bitcoin, tokens, and software can fail, be hacked, fork, halt, or go to zero. Past tape is not future results. You can lose all money you put at risk. No warranty of uptime, accuracy, or fitness. Software is provided as-is."
	},
	{
		id: "third",
		title: "8. Third-party sites",
		body: "Links to X, GitHub, pump.fun, explorers, or other sites are for reference. We do not control those sites. Their terms apply there. A screenshot or post about a pad is not a sale by this website."
	},
	{
		id: "ip",
		title: "9. Open source and marks",
		body: `${APP_NAME} source is offered under Apache License 2.0 where stated on GitHub. Brand marks stay with ${LABS_NAME}. Do not imply we endorse your trades.`
	},
	{
		id: "conduct",
		title: "10. Prohibited use",
		body: "Do not use the site to commit crime, to scrape in a way that harms the service, or to market an unregistered security as if it were this desk. Do not paste seeds, Coinbase keys, or one-time codes into any form."
	},
	{
		id: "changes",
		title: "11. Changes",
		body: `We may update these Terms. The date at the top of the Terms page is the current version. Continued use after a change is agreement to the new Terms. Last updated ${TERMS_UPDATED}. Canonical: ${SEO_CANONICAL.replace(/\/$/, "")}${TERMS_PATH}.`
	}
];
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/renew-BNc5PMLb.js
var $$splitComponentImporter$12 = () => import("./renew-jokLxDKe.mjs");
var Route$16 = createFileRoute("/renew")({
	validateSearch: (s) => ({ t: typeof s.t === "string" ? s.t : "" }),
	head: () => ({ meta: [{ title: `${APP_NAME} renew` }, {
		name: "robots",
		content: "noindex,nofollow"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/routes-JoPwY7ZW.js
var isMarketingHost = createServerFn({ method: "GET" }).handler(createSsrRpc("b78068c75690078e5a681d6804197292c06c5c9a8df7947d062d4d2a7ebd9393"));
var $$splitComponentImporter$11 = () => import("./routes-B2z_LBKR.mjs");
var Route$15 = createFileRoute("/")({
	beforeLoad: async () => isMarketingHost(),
	head: () => ({
		meta: [
			{ title: SEO_TITLE },
			{
				name: "description",
				content: SEO_DESCRIPTION
			},
			{
				name: "keywords",
				content: SEO_KEYWORDS
			},
			{
				name: "robots",
				content: "index,follow"
			}
		],
		links: [{
			rel: "canonical",
			href: SEO_CANONICAL
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-DHmQ4-E9.js
var router_DHmQ4_E9_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
/**
* Client AUTO ticks were the refresh loop (pull + paper setState on a timer).
* 24h paper fills run on the server after each tape fill. This engine does not poll.
*/
function PracticeEngine() {
	(0, import_react.useEffect)(() => {
		function kickoff() {
			if (!useAutoRun.persist.hasHydrated()) return;
			const auto = useAutoRun.getState();
			if (!auto.paused) auto.pauseUntilNotice();
			usePractice.setState({
				running: false,
				ticks: [],
				lastTick: null,
				busy: false
			});
			useGm.setState({
				running: false,
				liveUnlocked: false,
				ticks: [],
				lastTick: null,
				busy: false
			});
		}
		kickoff();
		const unsub = useAutoRun.persist.onFinishHydration(kickoff);
		return () => unsub();
	}, []);
	return null;
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var styles_default = "/assets/styles-b0HeCQqT.css";
/** Hostname suitable for absolute og / x-banner URLs. Skip Vercel system hosts. */
function publicAppHost(hostHeader) {
	const host = String(hostHeader ?? "").split(",")[0].trim().split(":")[0].toLowerCase();
	if (!host || !/^[a-z0-9.-]+$/.test(host) || !host.includes(".")) return "";
	if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) return "";
	if (host === "vercel.app" || host.endsWith(".vercel.app") || host === "vercel.com" || host.endsWith(".vercel.com")) return "";
	return host;
}
function resolvePublicHost(hostHeader) {
	return publicAppHost(typeof process !== "undefined" ? String(process.env?.VITE_PUBLIC_HOSTNAME ?? "") : "") || publicAppHost(hostHeader);
}
/** Absolute X feed banner URL, same host guard as og:image. */
function xBannerAbsUrl(hostHeader) {
	const host = resolvePublicHost(hostHeader);
	if (!host) return void 0;
	return `https://${host}/x-banner.jpg`;
}
var Route$14 = createRootRoute({
	head: () => {
		const xBanner = xBannerAbsUrl();
		return {
			meta: [
				{ charSet: "utf-8" },
				{
					name: "viewport",
					content: "width=device-width, initial-scale=1"
				},
				{ title: SEO_TITLE },
				{
					name: "description",
					content: SEO_DESCRIPTION
				},
				{
					name: "keywords",
					content: SEO_KEYWORDS
				},
				{
					name: "robots",
					content: "index,follow"
				},
				{
					name: "author",
					content: "S1R1US Labs"
				},
				{
					name: "theme-color",
					content: "#000000"
				},
				...xBanner ? [{
					property: "x:game:image",
					content: xBanner
				}] : []
			],
			links: [
				{
					rel: "icon",
					type: "image/svg+xml",
					href: "/favicon.svg?v=gz1"
				},
				{
					rel: "stylesheet",
					href: styles_default
				},
				{
					rel: "manifest",
					href: "/__grok/manifest.webmanifest"
				},
				{
					rel: "apple-touch-icon",
					href: "/__grok/icon-180.png"
				},
				{
					rel: "sitemap",
					type: "application/xml",
					href: "/sitemap.xml"
				},
				{
					rel: "preconnect",
					href: "https://fonts.bunny.net",
					crossOrigin: "anonymous"
				},
				{
					rel: "stylesheet",
					href: "https://fonts.bunny.net/css?family=ibm-plex-sans:400,500,600,400i|ibm-plex-mono:400,500,600,700&display=swap"
				}
			]
		};
	},
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-bg font-sans text-fg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskChrome, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	})
});
function publicHost(host) {
	const h = host.split(":")[0]?.toLowerCase() ?? "";
	return h === "s1r1us.ai" || h === "www.s1r1us.ai";
}
function DeskChrome() {
	const path = useRouterState({ select: (s) => s.location.pathname });
	const [host, setHost] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => setHost(window.location.hostname), []);
	if (path.startsWith("/s1r1us") || path.startsWith("/renew") || path.startsWith("/login") || publicHost(host)) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatrixSaver, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PracticeEngine, {})] });
}
var $$splitComponentImporter$10 = () => import("./admin-LyTT2Ne8.mjs");
var Route$13 = createFileRoute("/admin")({
	component: lazyRouteComponent($$splitComponentImporter$10, "component"),
	head: () => ({ meta: [{ title: `Admin · ${APP_NAME}` }, {
		name: "robots",
		content: "noindex,nofollow"
	}] })
});
var $$splitComponentImporter$9 = () => import("./f33d-B1_-Rbhw.mjs");
var Route$12 = createFileRoute("/f33d")({
	component: lazyRouteComponent($$splitComponentImporter$9, "component"),
	head: () => ({
		meta: [
			{ title: PAGE_TITLE_FEED },
			{
				name: "description",
				content: PAGE_DESC_FEED
			},
			{
				name: "keywords",
				content: SEO_KEYWORDS
			},
			{
				name: "robots",
				content: "index,follow"
			}
		],
		links: [{
			rel: "canonical",
			href: "https://s1r1us.ai/f33d"
		}]
	})
});
var $$splitComponentImporter$8 = () => import("./faq-B8sS82cA.mjs");
var Route$11 = createFileRoute("/faq")({
	component: lazyRouteComponent($$splitComponentImporter$8, "component"),
	head: () => ({
		meta: [
			{ title: PAGE_TITLE_FAQ },
			{
				name: "description",
				content: PAGE_DESC_FAQ
			},
			{
				name: "keywords",
				content: SEO_KEYWORDS
			},
			{
				name: "robots",
				content: "index,follow"
			}
		],
		links: [{
			rel: "canonical",
			href: "https://s1r1us.ai/faq"
		}]
	})
});
var $$splitComponentImporter$7 = () => import("./gm-B78Q-BVe.mjs");
var Route$10 = createFileRoute("/gm")({
	component: lazyRouteComponent($$splitComponentImporter$7, "component"),
	head: () => ({
		meta: [
			{ title: PAGE_TITLE_GM },
			{
				name: "description",
				content: PAGE_DESC_GM
			},
			{
				name: "keywords",
				content: SEO_KEYWORDS
			},
			{
				name: "robots",
				content: "index,follow"
			}
		],
		links: [{
			rel: "canonical",
			href: "https://s1r1us.ai/gm"
		}]
	})
});
var Route$9 = createFileRoute("/guide")({ beforeLoad: () => {
	throw redirect({ to: "/admin" });
} });
var $$splitComponentImporter$6 = () => import("./helios-CcgvC1M7.mjs");
var Route$8 = createFileRoute("/helios")({
	component: lazyRouteComponent($$splitComponentImporter$6, "component"),
	head: () => ({
		meta: [
			{ title: PAGE_TITLE_LAB },
			{
				name: "description",
				content: PAGE_DESC_LAB
			},
			{
				name: "keywords",
				content: SEO_KEYWORDS
			},
			{
				name: "robots",
				content: "index,follow"
			}
		],
		links: [{
			rel: "canonical",
			href: "https://s1r1us.ai/helios"
		}]
	})
});
var $$splitComponentImporter$5 = () => import("./launch-Bs80wiUs.mjs");
var Route$7 = createFileRoute("/launch")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./login-TnrkyiSs.mjs");
var Route$6 = createFileRoute("/login")({
	component: lazyRouteComponent($$splitComponentImporter$4, "component"),
	head: () => ({ meta: [{ title: `Sign in · ${APP_NAME}` }, {
		name: "robots",
		content: "noindex,nofollow"
	}] })
});
var $$splitComponentImporter$3 = () => import("./s1r1us-ncuZaWgn.mjs");
var Route$5 = createFileRoute("/s1r1us")({
	component: lazyRouteComponent($$splitComponentImporter$3, "component"),
	head: () => ({
		meta: [
			{ title: SEO_TITLE },
			{
				name: "description",
				content: SEO_DESCRIPTION
			},
			{
				name: "keywords",
				content: SEO_KEYWORDS
			},
			{
				name: "robots",
				content: "index,follow"
			}
		],
		links: [{
			rel: "canonical",
			href: SEO_CANONICAL
		}]
	})
});
var Route$4 = createFileRoute("/security")({ beforeLoad: () => {
	throw redirect({
		to: "/admin",
		hash: "access"
	});
} });
var $$splitComponentImporter$2 = () => import("./sitemap-DTma4EPc.mjs");
var Route$3 = createFileRoute("/sitemap")({
	component: lazyRouteComponent($$splitComponentImporter$2, "component"),
	head: () => ({
		meta: [
			{ title: PAGE_TITLE_SITEMAP },
			{
				name: "description",
				content: PAGE_DESC_SITEMAP
			},
			{
				name: "keywords",
				content: SEO_KEYWORDS
			},
			{
				name: "robots",
				content: "index,follow"
			}
		],
		links: [{
			rel: "canonical",
			href: "https://s1r1us.ai/sitemap"
		}]
	})
});
var $$splitComponentImporter$1 = () => import("./source-B_th8c6I.mjs");
var Route$2 = createFileRoute("/source")({
	beforeLoad: () => {
		throw redirect({ to: "/admin" });
	},
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./terms-ClHB_DAR.mjs");
var Route$1 = createFileRoute("/terms")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	head: () => ({
		meta: [
			{ title: `${TERMS_TITLE} · T0K3N L@UNCH (Token launch) · not financial advice` },
			{
				name: "description",
				content: `Terms and Agreements for s1r1us.ai. Using this website constitutes agreement. ${LEGAL_NFA}`
			},
			{
				name: "keywords",
				content: SEO_KEYWORDS
			},
			{
				name: "robots",
				content: "index,follow"
			}
		],
		links: [{
			rel: "canonical",
			href: "https://s1r1us.ai/terms"
		}]
	})
});
function loginErrorRedirect(request) {
	const url = new URL("/login", request.url);
	url.searchParams.set("error", "x");
	return Response.redirect(url, 302);
}
async function handleAuth(request) {
	try {
		const res = await auth.handler(request);
		if (res.status >= 500 && request.method === "GET") return loginErrorRedirect(request);
		return res;
	} catch (err) {
		console.error("[auth]", err instanceof Error ? err.message : err);
		if (request.method === "GET") return loginErrorRedirect(request);
		return Response.json({ error: "X sign-in failed" }, { status: 500 });
	}
}
var Route = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => handleAuth(request),
	POST: ({ request }) => handleAuth(request)
} } });
var rootRouteChildren = {
	IndexRoute: Route$15.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$14
	}),
	AdminRoute: Route$13.update({
		id: "/admin",
		path: "/admin",
		getParentRoute: () => Route$14
	}),
	F33dRoute: Route$12.update({
		id: "/f33d",
		path: "/f33d",
		getParentRoute: () => Route$14
	}),
	FaqRoute: Route$11.update({
		id: "/faq",
		path: "/faq",
		getParentRoute: () => Route$14
	}),
	GmRoute: Route$10.update({
		id: "/gm",
		path: "/gm",
		getParentRoute: () => Route$14
	}),
	GuideRoute: Route$9.update({
		id: "/guide",
		path: "/guide",
		getParentRoute: () => Route$14
	}),
	HeliosRoute: Route$8.update({
		id: "/helios",
		path: "/helios",
		getParentRoute: () => Route$14
	}),
	LaunchRoute: Route$7.update({
		id: "/launch",
		path: "/launch",
		getParentRoute: () => Route$14
	}),
	LoginRoute: Route$6.update({
		id: "/login",
		path: "/login",
		getParentRoute: () => Route$14
	}),
	RenewRoute: Route$16.update({
		id: "/renew",
		path: "/renew",
		getParentRoute: () => Route$14
	}),
	S1r1usRoute: Route$5.update({
		id: "/s1r1us",
		path: "/s1r1us",
		getParentRoute: () => Route$14
	}),
	SecurityRoute: Route$4.update({
		id: "/security",
		path: "/security",
		getParentRoute: () => Route$14
	}),
	SitemapRoute: Route$3.update({
		id: "/sitemap",
		path: "/sitemap",
		getParentRoute: () => Route$14
	}),
	SourceRoute: Route$2.update({
		id: "/source",
		path: "/source",
		getParentRoute: () => Route$14
	}),
	TermsRoute: Route$1.update({
		id: "/terms",
		path: "/terms",
		getParentRoute: () => Route$14
	}),
	ApiAuthSplatRoute: Route.update({
		id: "/api/auth/$",
		path: "/api/auth/$",
		getParentRoute: () => Route$14
	})
};
var routeTree = Route$14._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { LEGAL_NFA as a, TERMS_PATH as c, TERMS_UPDATED as d, rainGmBurst as f, getRouter, LEGAL_HOWEY as i, TERMS_SECTIONS as l, Route$15 as n, LEGAL_USE_IS_AGREEMENT as o, useGm as p, Route$16 as r, TERMS_HOVER as s, router_DHmQ4_E9_exports as t, TERMS_TITLE as u };
