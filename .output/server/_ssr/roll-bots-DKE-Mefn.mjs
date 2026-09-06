import { o as pullDeskTape } from "./tape-client-B1bBbHwr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/roll-bots-DKE-Mefn.js
/** Live Coinbase tape cycle only. No paper fills. No extra Bot 7 / GM practice ticks. */
async function rollBots(opts) {
	opts?.admin;
	await pullDeskTape({ force: opts?.force });
}
//#endregion
export { rollBots as t };
