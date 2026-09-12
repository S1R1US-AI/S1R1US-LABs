import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/miner-rpc-D-JqWa81.js
/**
* BTC M1N3Rz RPCs. Admin session required (system /admin or /app/admin copy).
* Each admin scope reads + writes ONLY its own stratum config. Read-only free
* public CKPool data — never Coinbase, never keys.
*/
async function minerScope(token) {
	const { verifyAccessToken } = await import("./access.server-CaZHHbCU.mjs");
	if (await verifyAccessToken(token)) return "system";
	const { verifyAppAdminToken } = await import("./app-admin-DF3iX8xC.mjs");
	if (verifyAppAdminToken(token)) return "app";
	return null;
}
var fetchBtcMiners_createServerFn_handler = createServerRpc({
	id: "b362f7977f60bf3a07a7b092135628c037bdd92c14111c6c9f73719c4fb90045",
	name: "fetchBtcMiners",
	filename: "src/lib/desk/miner-rpc.ts"
}, (opts) => fetchBtcMiners.__executeServer(opts));
var fetchBtcMiners = createServerFn({ method: "POST" }).validator((input) => input).handler(fetchBtcMiners_createServerFn_handler, async ({ data }) => {
	const scope = await minerScope(data.token);
	if (!scope) return {
		ok: false,
		error: "Admin session required",
		scope: null,
		config: null,
		view: null
	};
	const { loadMinerConfig, minerStatsView } = await import("./btc-miners.server-DkmzOUil.mjs");
	const config = loadMinerConfig(scope);
	return {
		ok: true,
		error: null,
		scope,
		config,
		view: await minerStatsView(config.address)
	};
});
var saveBtcMiners_createServerFn_handler = createServerRpc({
	id: "dd627f16b08fd625ddcdb5e70b03e75ced60f170f83a09f88a23a79a71f378f5",
	name: "saveBtcMiners",
	filename: "src/lib/desk/miner-rpc.ts"
}, (opts) => saveBtcMiners.__executeServer(opts));
var saveBtcMiners = createServerFn({ method: "POST" }).validator((input) => input).handler(saveBtcMiners_createServerFn_handler, async ({ data }) => {
	const scope = await minerScope(data.token);
	if (!scope) return {
		ok: false,
		error: "Admin session required",
		scope: null,
		config: null,
		view: null
	};
	const { minerAddressError, stratumError } = await import("./btc-miners-C_ITq4f_.mjs").then((n) => n.u).then((n) => n.u);
	const bad = stratumError(String(data.config?.stratum ?? "")) ?? stratumError(String(data.config?.backup ?? "")) ?? minerAddressError(String(data.config?.address ?? ""));
	if (bad) return {
		ok: false,
		error: bad,
		scope,
		config: null,
		view: null
	};
	const { saveMinerConfig, minerStatsView } = await import("./btc-miners.server-DkmzOUil.mjs");
	const config = saveMinerConfig(scope, data.config ?? {});
	return {
		ok: true,
		error: null,
		scope,
		config,
		view: await minerStatsView(config.address)
	};
});
//#endregion
export { fetchBtcMiners_createServerFn_handler, saveBtcMiners_createServerFn_handler };
