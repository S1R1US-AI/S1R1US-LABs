//#region node_modules/.nitro/vite/services/ssr/assets/checkpoint-9dYzsxCN.js
/** Public label for the current release. Internal build numbers stay out of visitor copy. */
var CHECKPOINT_NAME = "S1R1US live sim launch";
var CHECKPOINT_SHORT = "S1R1US current release";
function checkpointLabel(n = 111) {
	if (n === 111) return CHECKPOINT_SHORT;
	return "S1R1US earlier release";
}
function checkpointId(n = 111) {
	return String(n);
}
//#endregion
export { checkpointId as n, checkpointLabel as r, CHECKPOINT_NAME as t };
