import { r as createServerFn } from "./ssr.mjs";
import { verifyAccessToken } from "./access.server-CkRZvMBK.mjs";
import { t as createServerRpc } from "./createServerRpc-BgpH4YR6.mjs";
import { t as cloudflareDns } from "./net-guard-C4Si76ZP.mjs";
import { h as GODADDY_IO, u as DOMAINS } from "./model-DhC-vhtl.mjs";
//#region ../../workspace/node_modules/.nitro/vite/services/ssr/assets/probes-BWHmZARG.js
async function dnsNs(name) {
	try {
		const j = await cloudflareDns(name, "NS");
		const ns = (j.Answer ?? []).map((a) => String(a.data ?? "").replace(/\.$/, "")).filter(Boolean);
		if (j.Status === 3) return {
			name,
			available: true,
			status: "NXDOMAIN — not registered",
			ns: []
		};
		if (j.Status === 0 && ns.length) return {
			name,
			available: false,
			status: "Registered",
			ns
		};
		if (j.Status === 0) return {
			name,
			available: false,
			status: "Has DNS, no NS in answer",
			ns
		};
		return {
			name,
			available: null,
			status: `DNS status ${j.Status ?? "?"}`,
			ns
		};
	} catch (e) {
		return {
			name,
			available: null,
			status: e instanceof Error ? e.message : "DNS failed",
			ns: []
		};
	}
}
var probeLaunch_createServerFn_handler = createServerRpc({
	id: "5e1297c3c46a34d5383344d4744427836346a714cac56b3c8b95fc2b8e31450d",
	name: "probeLaunch",
	filename: "src/lib/launch/probes.ts"
}, (opts) => probeLaunch.__executeServer(opts));
var probeLaunch = createServerFn({ method: "POST" }).validator((input) => input).handler(probeLaunch_createServerFn_handler, async ({ data }) => {
	if (!await verifyAccessToken(data.token)) return {
		at: (/* @__PURE__ */ new Date()).toISOString(),
		godaddy: GODADDY_IO,
		liveLocked: true,
		domains: []
	};
	const domains = await Promise.all(DOMAINS.map((d) => dnsNs(d.name)));
	return {
		at: (/* @__PURE__ */ new Date()).toISOString(),
		godaddy: GODADDY_IO,
		liveLocked: true,
		domains
	};
});
//#endregion
export { probeLaunch_createServerFn_handler };
