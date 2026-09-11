//#region node_modules/.nitro/vite/services/ssr/assets/checkpoint-CBcxkQTP.js
/** Operator name for this fold. Live sim launch on main. White label + screensavers folded in at #113. */
var CHECKPOINT_NAME = "S1R1US App build #113 (live sim launch)";
var CHECKPOINT_SHORT = "S1R1US App build #113";
function checkpointLabel(n = 113) {
	if (n === 113) return CHECKPOINT_SHORT;
	return `DEPLOY #${n}`;
}
function checkpointId(n = 113) {
	return String(n);
}
//#endregion
export { checkpointId as n, checkpointLabel as r, CHECKPOINT_NAME as t };
