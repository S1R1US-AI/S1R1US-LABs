import { i as TSS_SERVER_FUNCTION } from "./ssr.mjs";
//#region ../fresh-2026-10-19/node_modules/.nitro/vite/services/ssr/assets/createServerRpc-zxCKeLi6.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
//#endregion
export { createServerRpc as t };
