import { m as pullDeskTape } from "./store-CmU31tUT.mjs";
import { i as usePractice, r as useAutoRun } from "./practice-B8JB3r4K.mjs";
import { p as useGm } from "./router-DjJwDK72.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/roll-bots-CY-U9Qjm.js
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
