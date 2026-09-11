import { n as create, t as persist } from "../_libs/zustand.mjs";
import { _ as clampGmRisk, a as AUTO_RUN_UNTIL_MS, b as gmCall, g as clampGmCash, n as AUTO_RUN_ID, o as DEFAULT_GM_VARS, p as GM_PROFIT_BTC, t as AUTO_RUN_CASH, v as clampGmTf } from "./auto-window-DE1-Xqe3.mjs";
import { t as peekDeskTape } from "./tape-client-fN25VziO.mjs";
import "./build-BYnYcncG.mjs";
//#region ../../workspace/node_modules/.nitro/vite/services/ssr/assets/auto-run-CKSR82Mv.js
({ ...DEFAULT_GM_VARS });
var useAutoRun = create()(persist((set, get) => ({
	id: AUTO_RUN_ID,
	armed: false,
	paused: true,
	pausedAt: (/* @__PURE__ */ new Date()).toISOString(),
	until: AUTO_RUN_UNTIL_MS,
	cash: AUTO_RUN_CASH,
	days: [],
	windowOpen: () => true,
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
//#endregion
//#region ../../workspace/node_modules/.nitro/vite/services/ssr/assets/gm-store-Di0MuUcy.js
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
	start: () => {
		set({
			running: true,
			error: null
		});
	},
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
export { useAutoRun as n, useGm as t };
