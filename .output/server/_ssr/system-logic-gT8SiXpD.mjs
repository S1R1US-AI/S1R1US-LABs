import { A as ROADMAP_TOTAL, O as ROADMAP } from "./model-B5OoJxq1.mjs";
import { a as RISK_RULES, n as CYCLE_ARCH, o as SYSTEM_REVIEWED, t as BOT_ROSTER } from "./prediction-markets-BYTXxZPL.mjs";
import { n as runBots, t as heliosCall } from "./signal-Dm42e8m4.mjs";
import { t as CHECKPOINT_NAME } from "./checkpoint-9dYzsxCN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/build-CbKzmSD6.js
/** Current release (live sim launch). Live tape on. Call board on. Paper fills off. Live Coinbase off. */
var LAUNCH_BUILD = CHECKPOINT_NAME;
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/system-logic-gT8SiXpD.js
var MANDATE = [
	"1. Maximize bitcoin accumulation.",
	"2. Never sell bitcoin. Never short. Stops block add-on buys — they do not dump BTC.",
	"3. Minimize bitcoin loss. Never chase crowded longs.",
	"4. Continuous ops: honest error analysis, architecture and security review. Never green a failure without a verified fallback. Daily 07:30 America/New_York report in Admin Console for system and copy-admin. As-live sim auto-pauses 07:00 ET."
];
/** One object for the fund tape, Coin tab, and s1r1us.ai — rebuilt on every live tape pull. */
function systemView(snap, navUsd = 1e3) {
	const briefs = snap ? runBots(snap) : [];
	const call = snap ? heliosCall(snap, briefs, navUsd) : null;
	return {
		reviewed: SYSTEM_REVIEWED,
		launch: LAUNCH_BUILD,
		fetchedAt: snap?.fetchedAt ?? null,
		briefs,
		call,
		roster: BOT_ROSTER,
		stops: RISK_RULES,
		cycle: CYCLE_ARCH,
		roadmap: ROADMAP.map((m) => ({
			n: m.n,
			name: m.name,
			minUsd: m.minUsd,
			maxUsd: m.maxUsd
		})),
		roadmapTotal: ROADMAP_TOTAL
	};
}
//#endregion
export { systemView as n, MANDATE as t };
