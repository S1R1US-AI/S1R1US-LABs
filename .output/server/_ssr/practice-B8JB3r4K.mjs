import "./brand-CZvw9Xkc.mjs";
import { n as runBots, t as heliosCall } from "./signal-DPQz4i0F.mjs";
import { a as DEFAULT_GM_VARS, i as AUTO_RUN_UNTIL_MS, n as AUTO_RUN_ID, t as AUTO_RUN_CASH } from "./auto-window-DeyxtCOF.mjs";
import { t as DESK_POLL_MS } from "./poll-ByA4PSVX.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { a as clampCash, d as lotsThroughStop, f as openLots, o as clampStop, p as peekDeskTape, r as STOP_DEFAULT, v as usePaper } from "./store-CmU31tUT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/practice-B8JB3r4K.js
/** Frozen production save. Live tape pulls on. Live trades off. Practice/test runs paused. Path A locked. */
var LAUNCH_BUILD = "LAUNCH BUILD DEPLOY #57";
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
	start: () => {
		set({
			running: false,
			error: `Practice paused — ${LAUNCH_BUILD}`
		});
	},
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
		set({
			running: false,
			error: `Practice paused — ${LAUNCH_BUILD}`
		});
	},
	tick: async () => {
		if (get().running) set({ running: false });
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
			usePaper.getState();
			const nav = bookNav(snap.btc.price) || 1e3;
			const bots = runBots(snap);
			const call = heliosCall(snap, bots, nav);
			const px = snap.btc.price ?? 0;
			const stopPct = get().stopPct;
			if (px) usePaper.getState().markPeaks(px);
			const lots = openLots(usePaper.getState().fills, px, stopPct);
			const hit = lotsThroughStop(lots, px);
			const liveLocked = get().view === "live" && true;
			const actionable = (call.stance === "BUY" || call.stance === "ACCUMULATE") && (call.conviction === "HIGH" || call.conviction === "MEDIUM" && false);
			let executed = false;
			let reason = `${call.conviction} ${call.stance} — no clip`;
			if (hit.length && px) reason = `STOP watch ${hit.length} lot(s) · hold ${hit.reduce((s, l) => s + l.btc, 0).toFixed(6)} BTC — no sell (mandate)`;
			else if (liveLocked) {
				reason = `${call.conviction} ${call.stance} — live call. Coinbase orders locked on this host.`;
				if (actionable) reason += ` Would BUY ${call.clipUsd.toFixed(0)} USDC (preview).`;
			} else if (!useAutoRun.getState().fillsAllowed()) reason = `${call.conviction} ${call.stance} — practice PAUSED until further notice`;
			else if (!actionable) reason = `${call.conviction} ${call.stance} — wait (need HIGH or MEDIUM BUY/ACCUMULATE). Never sell.`;
			else if (!px) reason = "No Coinbase last — skipped";
			else reason = `${call.conviction} ${call.stance} — scan only`;
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
export { usePractice as i, PRACTICE_MS as n, useAutoRun as r, LAUNCH_BUILD as t };
