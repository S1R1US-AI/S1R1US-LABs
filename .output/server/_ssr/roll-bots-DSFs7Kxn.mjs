import { o as pullDeskTape } from "./tape-client-BKgLSeyH.mjs";
import { i as usePractice, r as useAutoRun } from "./practice-CtcF62Ml.mjs";
import { v as useGm } from "./router-Kg8sFdej.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/roll-bots-DSFs7Kxn.js
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
