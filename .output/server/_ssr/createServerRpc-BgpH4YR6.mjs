import { i as TSS_SERVER_FUNCTION } from "./ssr.mjs";
//#region ../../workspace/node_modules/.nitro/vite/services/ssr/assets/createServerRpc-BgpH4YR6.js
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
