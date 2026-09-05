import { m as pullDeskTape } from "./store-CmU31tUT.mjs";
import { i as usePractice, r as useAutoRun } from "./practice-Ba1wrwhg.mjs";
import { p as useGm } from "./router-DHmQ4-E9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/roll-bots-BOOSTD7f.js
/** Live Coinbase cycle. Under LAUNCH_FREEZE: scan/vote only — no practice or GM paper fills. */
async function rollBots(opts) {
	usePractice.setState({ running: false });
	useGm.setState({
		running: false,
		liveUnlocked: false
	});
	useAutoRun.getState().pauseUntilNotice();
	await pullDeskTape({ force: opts?.force });
	await Promise.all([useGm.getState().tick({ admin: Boolean(opts?.admin) }), usePractice.getState().tick()]);
}
//#endregion
export { rollBots as t };
