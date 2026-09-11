//#region ../../workspace/node_modules/.nitro/vite/services/ssr/assets/checkpoint-Dyt8QP7f.js
/** Operator name for this fold. Live sim launch on main. */
var CHECKPOINT_NAME = "S1R1US App build #111 (live sim launch)";
var CHECKPOINT_SHORT = "S1R1US App build #111";
function checkpointLabel(n = 111) {
	if (n === 111) return CHECKPOINT_SHORT;
	return `DEPLOY #${n}`;
}
function checkpointId(n = 111) {
	return String(n);
}
//#endregion
export { checkpointId as n, checkpointLabel as r, CHECKPOINT_NAME as t };
