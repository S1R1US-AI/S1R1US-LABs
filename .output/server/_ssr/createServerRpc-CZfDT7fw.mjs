import { i as TSS_SERVER_FUNCTION } from "./ssr.mjs";
//#region ../faq-dmt-dripped-wt/node_modules/.nitro/vite/services/ssr/assets/createServerRpc-CZfDT7fw.js
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
