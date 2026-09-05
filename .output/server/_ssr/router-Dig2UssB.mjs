import { o as __toESM, r as __exportAll } from "../_runtime.mjs";
import { H as require_react, _ as createRootRoute, b as useRouter, d as useRouterState, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, x as require_jsx_runtime, z as redirect } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { c as SEO_KEYWORDS, f as SEO_TITLE, h as TAB_LAB, i as LABS_NAME, m as TAB_GM, n as APP_NAME, o as SEO_CANONICAL, p as TAB_DESK, s as SEO_DESCRIPTION, t as APP_CALLS } from "./brand-Bnp79fYI.mjs";
import { n as runBots, t as heliosCall } from "./signal-BbI_UzeG.mjs";
import { _ as clampGmTf, a as DEFAULT_GM_VARS, f as GM_PROFIT_BTC, g as clampGmRisk, h as clampGmCash, i as AUTO_RUN_UNTIL_MS, n as AUTO_RUN_ID, t as AUTO_RUN_CASH, y as gmCall } from "./auto-window-DdJ51QSX.mjs";
import { t as DESK_POLL_MS } from "./poll-ByA4PSVX.mjs";
import { g as createSsrRpc, h as useOperator } from "./operator-DlNxL-ml.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { _ as usePaper, a as clampCash, d as lotsThroughStop, f as openLots, o as clampStop, p as peekDeskTape, r as STOP_DEFAULT, u as initialStop } from "./store-DO7K-IX1.mjs";
import { L as string, N as number, P as object, R as union, j as literal } from "../_libs/@better-auth/core+[...].mjs";
import { i as signOut } from "./client-CVqXY6bk.mjs";
import { t as auth } from "./server-BXTHZoU1.mjs";
import { t as TriangleAlert } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/practice-R2d9bJVF.js
({ ...DEFAULT_GM_VARS });
var useAutoRun = create()(persist((set, get) => ({
	id: AUTO_RUN_ID,
	armed: false,
	paused: true,
	pausedAt: (/* @__PURE__ */ new Date()).toISOString(),
	until: AUTO_RUN_UNTIL_MS,
	cash: AUTO_RUN_CASH,
	days: [],
	windowOpen: () => false,
	fillsAllowed: () => false,
	markArmed: () => set({
		id: AUTO_RUN_ID,
		armed: true,
		paused: false,
		pausedAt: null,
		until: AUTO_RUN_UNTIL_MS,
		cash: AUTO_RUN_CASH
	}),
	recordDay: (snap) => set((s) => ({ days: [...s.days.filter((d) => d.day !== snap.day), snap].sort((a, b) => a.day - b.day) })),
	pauseUntilNotice: () => set({
		paused: true,
		pausedAt: (/* @__PURE__ */ new Date()).toISOString()
	})
}), { name: "s1r1us-auto-run-paused-20260904" }));
var PRACTICE_MS = DESK_POLL_MS;
var TEST_PHASE = "usdc-1000-v1";
var TEST_PHASE_USDC = 1e3;
function bookNav(price) {
	const { cashUsd, btc, profitBtc } = usePaper.getState();
	return cashUsd + (btc + (profitBtc ?? 0)) * (price ?? 0);
}
var usePractice = create()(persist((set, get) => ({
	running: false,
	view: "practice",
	bookUsd: TEST_PHASE_USDC,
	lastTick: null,
	error: null,
	busy: false,
	ticks: [],
	liveFills: [],
	testPhase: null,
	stopPct: STOP_DEFAULT,
	start: () => set({
		running: true,
		view: "practice",
		error: null
	}),
	stop: () => set({
		running: false,
		error: null
	}),
	setView: (view) => {
		if (view === "live" && true) {
			set({ view: "live" });
			return;
		}
		set({ view });
	},
	setBookUsd: (n) => set({ bookUsd: clampCash(n) }),
	setStopPct: (n) => set({ stopPct: clampStop(n) }),
	applyBookUsd: () => {
		const n = get().bookUsd;
		usePaper.getState().setCash(n);
	},
	resetBook: () => {
		usePaper.getState().reset(get().bookUsd);
		set({
			ticks: [],
			lastTick: null,
			error: null
		});
	},
	beginTestPhase: () => {
		usePaper.getState().reset(TEST_PHASE_USDC);
		set({
			bookUsd: TEST_PHASE_USDC,
			running: true,
			view: "practice",
			ticks: [],
			lastTick: null,
			error: null,
			testPhase: TEST_PHASE
		});
	},
	tick: async () => {
		if (get().busy) return;
		set({
			busy: true,
			error: null
		});
		try {
			const snap = peekDeskTape();
			if (!snap) {
				set({
					busy: false,
					lastTick: (/* @__PURE__ */ new Date()).toISOString()
				});
				return;
			}
			const paper = usePaper.getState();
			const nav = bookNav(snap.btc.price) || 1e3;
			const bots = runBots(snap);
			const call = heliosCall(snap, bots, nav);
			const px = snap.btc.price ?? 0;
			const stopPct = get().stopPct;
			if (px) usePaper.getState().markPeaks(px);
			const lots = openLots(usePaper.getState().fills, px, stopPct);
			const hit = lotsThroughStop(lots, px);
			const liveLocked = get().view === "live" && true;
			const fillPaper = get().running && !liveLocked && useAutoRun.getState().fillsAllowed();
			const actionable = (call.stance === "BUY" || call.stance === "ACCUMULATE") && (call.conviction === "HIGH" || call.conviction === "MEDIUM" && fillPaper);
			let executed = false;
			let reason = `${call.conviction} ${call.stance} — no clip`;
			if (hit.length && px) reason = `STOP watch ${hit.length} lot(s) · hold ${hit.reduce((s, l) => s + l.btc, 0).toFixed(6)} BTC — no sell (mandate)`;
			else if (liveLocked) {
				reason = `${call.conviction} ${call.stance} — live call. Coinbase orders locked on this host.`;
				if (actionable) reason += ` Would BUY ${call.clipUsd.toFixed(0)} USDC (preview).`;
			} else if (!useAutoRun.getState().fillsAllowed()) reason = `${call.conviction} ${call.stance} — practice PAUSED until further notice`;
			else if (!actionable) reason = `${call.conviction} ${call.stance} — wait (need HIGH or MEDIUM BUY/ACCUMULATE). Never sell.`;
			else if (!px) reason = "No Coinbase last — skipped";
			else if (!fillPaper) reason = `${call.conviction} ${call.stance} — scan only`;
			else if (call.stance === "BUY" && lots.some((l) => l.pnlPct < -stopPct / 2)) reason = "HIGH BUY blocked — open lot already losing; hold BTC, do not add, do not sell";
			else {
				const want = call.conviction === "HIGH" ? call.clipUsd : call.clipUsd * .5;
				const usd = Math.min(paper.cashUsd, want);
				if (usd <= 0) reason = "Buy call but no USDC left in paper book";
				else {
					paper.fill({
						at: (/* @__PURE__ */ new Date()).toISOString(),
						side: "BUY",
						usd,
						btc: usd / px,
						price: px,
						note: `PRACTICE ${APP_CALLS} ${call.stance} ${call.conviction}`,
						kind: "clip",
						stopPrice: initialStop(px, stopPct),
						peakPrice: px
					});
					executed = true;
					reason = `Practice ${call.stance} ${usd.toFixed(2)} USDC → BTC`;
				}
			}
			const after = usePaper.getState();
			const tick = {
				at: (/* @__PURE__ */ new Date()).toISOString(),
				stance: call.stance,
				conviction: call.conviction,
				clipUsd: call.clipUsd,
				executed,
				reason,
				price: snap.btc.price,
				cash: after.cashUsd,
				btc: after.btc,
				nav: after.cashUsd + (after.btc + (after.profitBtc ?? 0)) * px,
				bots: bots.map((b) => ({
					id: b.id,
					name: b.name,
					stance: b.stance,
					summary: b.summary
				}))
			};
			set({
				lastTick: tick.at,
				ticks: [tick, ...get().ticks].slice(0, 48),
				busy: false,
				error: null
			});
		} catch (e) {
			set({
				busy: false,
				error: e instanceof Error ? e.message : "Practice tick failed",
				lastTick: (/* @__PURE__ */ new Date()).toISOString()
			});
		}
	}
}), {
	name: "s1rius-practice-off-20260904",
	partialize: (s) => ({
		running: s.running,
		view: s.view,
		bookUsd: s.bookUsd,
		lastTick: s.lastTick,
		ticks: s.ticks,
		liveFills: s.liveFills,
		testPhase: s.testPhase,
		stopPct: s.stopPct
	})
}));
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/gm-store-DdyEgRzm.js
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
function applyFill(book, fill) {
	const id = `gm-${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 6)}`;
	const profitBtc = book.profitBtc ?? 0;
	if (fill.side === "BUY") {
		if (book.cashUsd < fill.usd) return book;
		return {
			cashUsd: book.cashUsd - fill.usd,
			btc: book.btc + fill.btc,
			profitBtc,
			fills: [{
				...fill,
				id,
				kind: fill.kind ?? "clip",
				openBtc: fill.btc
			}, ...book.fills].slice(0, 40)
		};
	}
	if (book.btc < fill.btc) return book;
	if (fill.kind === "trim") return {
		cashUsd: book.cashUsd,
		btc: book.btc - fill.btc,
		profitBtc: profitBtc + fill.btc,
		fills: [{
			...fill,
			id,
			kind: "trim",
			openBtc: 0
		}, ...book.fills].slice(0, 40)
	};
	return {
		cashUsd: book.cashUsd + fill.usd,
		btc: book.btc - fill.btc,
		profitBtc,
		fills: [{
			...fill,
			id,
			kind: fill.kind ?? "stop",
			openBtc: 0
		}, ...book.fills].slice(0, 40)
	};
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
	start: () => set({
		running: true,
		error: null
	}),
	tick: async ({ admin }) => {
		if (get().busy) return;
		try {
			let snap = peekDeskTape();
			if (!snap) {
				set({ lastTick: (/* @__PURE__ */ new Date()).toISOString() });
				return;
			}
			const liveOn = get().liveUnlocked && admin && get().view === "live";
			const bookKey = liveOn ? "live" : "practice";
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
			let executed = false;
			if (get().running && (liveOn || useAutoRun.getState().fillsAllowed()) && px && px > 0 && call.clipUsd > 0) {
				if (call.stance === "BUY" || call.stance === "ACCUMULATE") {
					const usd = Math.min(call.clipUsd, next.cashUsd);
					if (usd >= 10) {
						next = applyFill(next, {
							at: snap.fetchedAt,
							side: "BUY",
							usd,
							btc: usd / px,
							price: px,
							note: `GM ${call.conviction} ${call.stance}`,
							kind: "clip",
							triggers: call.triggers.map((t) => ({
								label: t.label,
								why: t.why
							}))
						});
						executed = true;
					}
				} else if ((call.stance === "TRIM" || call.stance === "SHORT") && next.btc > 0) {
					const want = Math.min(call.clipUsd / px, next.btc);
					if (want > 0) {
						next = applyFill(next, {
							at: snap.fetchedAt,
							side: "SELL",
							usd: want * px,
							btc: want,
							price: px,
							note: call.stance === "TRIM" ? `GM profit → ${GM_PROFIT_BTC}` : "GM sleeve SHORT close",
							kind: call.stance === "TRIM" ? "trim" : "stop",
							triggers: call.triggers.map((t) => ({
								label: t.label,
								why: t.why
							}))
						});
						executed = true;
					}
				}
			}
			const tick = {
				at: (/* @__PURE__ */ new Date()).toISOString(),
				call,
				executed,
				price: px,
				cash: next.cashUsd,
				btc: next.btc,
				nav: navOf(next, px),
				book: bookKey
			};
			if (bookKey === "live") set({
				live: next,
				ticks: [tick, ...get().ticks].slice(0, 40),
				lastTick: tick.at,
				busy: false,
				error: null,
				vars: get().pilot === "AUTO" ? call.vars : get().vars
			});
			else set({
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
//#region node_modules/.nitro/vite/services/ssr/assets/matrix-saver-rcqjizx9.js
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
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/renew-GU0Nl6Oh.js
var $$splitComponentImporter$10 = () => import("./renew-jssMr5FV.mjs");
var Route$14 = createFileRoute("/renew")({
	validateSearch: (s) => ({ t: typeof s.t === "string" ? s.t : "" }),
	head: () => ({ meta: [{ title: `${APP_NAME} renew` }, {
		name: "robots",
		content: "noindex,nofollow"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BSBtAPVC.js
var isMarketingHost = createServerFn({ method: "GET" }).handler(createSsrRpc("b78068c75690078e5a681d6804197292c06c5c9a8df7947d062d4d2a7ebd9393"));
var $$splitComponentImporter$9 = () => import("./routes-M1hXqtML.mjs");
var Route$13 = createFileRoute("/")({
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
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-Dig2UssB.js
var router_Dig2UssB_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
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
var styles_default = "/assets/styles-CVX5ah42.css";
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
var Route$12 = createRootRoute({
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
var $$splitComponentImporter$8 = () => import("./admin-Ixljj2ZS.mjs");
var Route$11 = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./faq-BHbIavRi.mjs");
var TITLE = `FAQ · ${TAB_DESK} · ${TAB_GM} · ${TAB_LAB} · OP3N S0URC3`;
var DESC = "FAQ for S1R1U$ 7-B0t Hedge Fund (S1R1US 7-bot hedge fund), G0DZ1LLa M0D3 (Godzilla mode), S1R1U$ L@B Strategies (S1R1US Lab Strategies), OP3N S0URC3 (open source). AI Bitcoin trading bot, AI stock trading bot, AI Hedge Fund. Not financial advice.";
var Route$10 = createFileRoute("/faq")({
	component: lazyRouteComponent($$splitComponentImporter$7, "component"),
	head: () => ({
		meta: [
			{ title: TITLE },
			{
				name: "description",
				content: DESC
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
var $$splitComponentImporter$6 = () => import("./gm-Y9WeA0Bc.mjs");
var Route$9 = createFileRoute("/gm")({
	component: lazyRouteComponent($$splitComponentImporter$6, "component"),
	head: () => ({ meta: [{ title: TAB_GM }] })
});
var Route$8 = createFileRoute("/guide")({ beforeLoad: () => {
	throw redirect({ to: "/admin" });
} });
var $$splitComponentImporter$5 = () => import("./helios-C7tcmtaC.mjs");
var Route$7 = createFileRoute("/helios")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./launch-eW8iBfkc.mjs");
var Route$6 = createFileRoute("/launch")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./login-CvJu3ejN.mjs");
var Route$5 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./s1r1us-Dne32lry.mjs");
var Route$4 = createFileRoute("/s1r1us")({
	component: lazyRouteComponent($$splitComponentImporter$2, "component"),
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
var Route$3 = createFileRoute("/security")({ beforeLoad: () => {
	throw redirect({
		to: "/admin",
		hash: "access"
	});
} });
var $$splitComponentImporter$1 = () => import("./sitemap-BvTC96FJ.mjs");
var Route$2 = createFileRoute("/sitemap")({
	component: lazyRouteComponent($$splitComponentImporter$1, "component"),
	head: () => ({
		meta: [
			{ title: `Sitemap · ${LABS_NAME}` },
			{
				name: "description",
				content: "Sitemap for S1R1US Labs: S1R1U$ 7-B0t Hedge Fund, G0DZ1LLa M0D3 (Godzilla mode), S1R1U$ L@B Strategies, FAQ, OP3N S0URC3 open source."
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
var $$splitComponentImporter = () => import("./source-B_th8c6I.mjs");
var Route$1 = createFileRoute("/source")({
	beforeLoad: () => {
		throw redirect({ to: "/admin" });
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var Route = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
var rootRouteChildren = {
	IndexRoute: Route$13.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$12
	}),
	AdminRoute: Route$11.update({
		id: "/admin",
		path: "/admin",
		getParentRoute: () => Route$12
	}),
	FaqRoute: Route$10.update({
		id: "/faq",
		path: "/faq",
		getParentRoute: () => Route$12
	}),
	GmRoute: Route$9.update({
		id: "/gm",
		path: "/gm",
		getParentRoute: () => Route$12
	}),
	GuideRoute: Route$8.update({
		id: "/guide",
		path: "/guide",
		getParentRoute: () => Route$12
	}),
	HeliosRoute: Route$7.update({
		id: "/helios",
		path: "/helios",
		getParentRoute: () => Route$12
	}),
	LaunchRoute: Route$6.update({
		id: "/launch",
		path: "/launch",
		getParentRoute: () => Route$12
	}),
	LoginRoute: Route$5.update({
		id: "/login",
		path: "/login",
		getParentRoute: () => Route$12
	}),
	RenewRoute: Route$14.update({
		id: "/renew",
		path: "/renew",
		getParentRoute: () => Route$12
	}),
	S1r1usRoute: Route$4.update({
		id: "/s1r1us",
		path: "/s1r1us",
		getParentRoute: () => Route$12
	}),
	SecurityRoute: Route$3.update({
		id: "/security",
		path: "/security",
		getParentRoute: () => Route$12
	}),
	SitemapRoute: Route$2.update({
		id: "/sitemap",
		path: "/sitemap",
		getParentRoute: () => Route$12
	}),
	SourceRoute: Route$1.update({
		id: "/source",
		path: "/source",
		getParentRoute: () => Route$12
	}),
	ApiAuthSplatRoute: Route.update({
		id: "/api/auth/$",
		path: "/api/auth/$",
		getParentRoute: () => Route$12
	})
};
var routeTree = Route$12._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { useGm as a, getRouter, rainGmBurst as i, Route$13 as n, PRACTICE_MS as o, Route$14 as r, usePractice as s, router_Dig2UssB_exports as t };
