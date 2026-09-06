import { n as pullDeskTape } from "./tape-client-9JG3e7SY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/roll-bots-aMBWojuD.js
/** Live Coinbase tape cycle only. No paper fills. No extra 7-B0T / GM practice ticks. */
async function rollBots(opts) {
	opts?.admin;
	await pullDeskTape({ force: opts?.force });
}
//#endregion
export { rollBots as t };
