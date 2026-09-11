import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-BgpH4YR6.mjs";
//#region ../../workspace/node_modules/.nitro/vite/services/ssr/assets/host-0-vMIvdE.js
function marketingFromHost(host) {
	const h = host.split(":")[0]?.toLowerCase() ?? "";
	return h === "s1r1us.ai" || h === "www.s1r1us.ai";
}
var isMarketingHost_createServerFn_handler = createServerRpc({
	id: "b78068c75690078e5a681d6804197292c06c5c9a8df7947d062d4d2a7ebd9393",
	name: "isMarketingHost",
	filename: "src/lib/launch/host.ts"
}, (opts) => isMarketingHost.__executeServer(opts));
var isMarketingHost = createServerFn({ method: "GET" }).handler(isMarketingHost_createServerFn_handler, async () => {
	try {
		const { getRequestHost, getRequestHeader } = await import("./esm-B8oRgReG.mjs");
		const host = (((getRequestHeader("x-forwarded-host") ?? "").split(",")[0]?.trim() ?? "") || getRequestHost({ xForwardedHost: true })).split(":")[0] ?? "";
		return {
			host,
			marketing: marketingFromHost(host)
		};
	} catch {
		return {
			host: "",
			marketing: false
		};
	}
});
//#endregion
export { isMarketingHost_createServerFn_handler };
