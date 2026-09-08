import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lock-request-rpc-DkngUYeh.js
var fetchLockTickets_createServerFn_handler = createServerRpc({
	id: "7092675022d7921cd8cc08898a38d6a7910d94df92d5d08d1b5ad31e50ccaeb3",
	name: "fetchLockTickets",
	filename: "src/lib/desk/lock-request-rpc.ts"
}, (opts) => fetchLockTickets.__executeServer(opts));
var fetchLockTickets = createServerFn({ method: "GET" }).handler(fetchLockTickets_createServerFn_handler, async () => {
	const { listLockTickets } = await import("./lock-request.server-BNyOc2Yd.mjs");
	return { tickets: listLockTickets() };
});
var postLockTicket_createServerFn_handler = createServerRpc({
	id: "7352c638bd61f999d2be9e486607a1e67512dcfcc0182155697a6e28fb371501",
	name: "postLockTicket",
	filename: "src/lib/desk/lock-request-rpc.ts"
}, (opts) => postLockTicket.__executeServer(opts));
var postLockTicket = createServerFn({ method: "POST" }).validator((input) => input).handler(postLockTicket_createServerFn_handler, async ({ data }) => {
	const { verifyAppAdminToken } = await import("./app-admin-DF3iX8xC.mjs");
	if (!verifyAppAdminToken(data.token)) return {
		ok: false,
		error: "Phone-app admin session required",
		ticket: null
	};
	const { fileLockTicket } = await import("./lock-request.server-BNyOc2Yd.mjs");
	const row = fileLockTicket(data.ids || [], data.locked, data.note || "");
	if ("error" in row) return {
		ok: false,
		error: row.error,
		ticket: null
	};
	return {
		ok: true,
		error: null,
		ticket: row
	};
});
//#endregion
export { fetchLockTickets_createServerFn_handler, postLockTicket_createServerFn_handler };
