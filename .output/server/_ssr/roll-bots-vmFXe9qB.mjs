import { m as pullDeskTape } from "./store-CmU31tUT.mjs";
import { h as usePractice, p as useGm } from "./router-DDNOyHBU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/roll-bots-vmFXe9qB.js
/** Force a live Coinbase cycle, then re-vote Bot 7 and bots 1–6 (scan only unless fills are armed). */
async function rollBots(opts) {
	await pullDeskTape({ force: opts?.force });
	await Promise.all([useGm.getState().tick({ admin: Boolean(opts?.admin) }), usePractice.getState().tick()]);
}
//#endregion
export { rollBots as t };
