import { r as createServerFn } from "./ssr.mjs";
import { t as __exportAll } from "./agent-ping-BXZGzZ_N.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/grok-sMB2NRH5.js
var grok_exports = /* @__PURE__ */ __exportAll({
	adminStatus: () => adminStatus,
	askHelios: () => askHelios,
	askHeliosByo: () => askHeliosByo
});
var askHelios = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("70e9587696840a33b344a5ecd8706e3aa8526f9c1a9462bcac2625207915aa78"));
/** Signed-in visitor Ask Grok using THEIR xAI key. Key is never stored. Operator SuperGrok is not spent. */
var askHeliosByo = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("05aadc47905f591d09036fa351783a26a9a5db0045213487847835be1d2f1b12"));
var adminStatus = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("7426936e6524e949f61ef1414e1b7b92054624acddd912f28187bda0b5b11380"));
//#endregion
export { askHelios as n, grok_exports as r, adminStatus as t };
