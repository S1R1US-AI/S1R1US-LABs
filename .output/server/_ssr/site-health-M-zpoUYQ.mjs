import { r as createServerFn } from "./ssr.mjs";
import { verifyAccessToken } from "./access.server-BPV3s8hu.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { n as guardedFetch, t as cloudflareDns } from "./net-guard-C3s3LqYg.mjs";
import { i as COIN_DOMAIN } from "./model-CLHae-Ip.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-health-M-zpoUYQ.js
var hits = [];
function throttle() {
	const now = Date.now();
	while (hits.length && now - hits[0] > 6e4) hits.shift();
	if (hits.length >= 20) return true;
	hits.push(now);
	return false;
}
async function dnsJson(name, type) {
	return ((await cloudflareDns(name, type)).Answer ?? []).map((a) => String(a.data ?? "").replace(/\.$/, ""));
}
var probeSiteHealth_createServerFn_handler = createServerRpc({
	id: "bd29d0b6bb34b0f97cb375088f5253f65373a39cffb50760d3afefd56a5a4669",
	name: "probeSiteHealth",
	filename: "src/lib/launch/site-health.ts"
}, (opts) => probeSiteHealth.__executeServer(opts));
var probeSiteHealth = createServerFn({ method: "POST" }).validator((input) => input).handler(probeSiteHealth_createServerFn_handler, async ({ data }) => {
	if (!await verifyAccessToken(data.token)) return {
		at: (/* @__PURE__ */ new Date()).toISOString(),
		apexA: [],
		wwwCname: [],
		ns: [],
		http: {
			status: "401",
			body: "admin"
		},
		tls: "skipped",
		verdict: "Admin session required."
	};
	if (throttle()) return {
		at: (/* @__PURE__ */ new Date()).toISOString(),
		apexA: [],
		wwwCname: [],
		ns: [],
		http: {
			status: "429",
			body: "health probe capped"
		},
		tls: "skipped",
		verdict: "Slow down — health probe is rate-limited."
	};
	const apex = COIN_DOMAIN;
	const [apexA, wwwCname, ns] = await Promise.all([
		dnsJson(apex, "A"),
		dnsJson(`www.${apex}`, "CNAME"),
		dnsJson(apex, "NS")
	]);
	let http = {
		status: "ERR",
		body: ""
	};
	let tls = "unknown";
	try {
		const r = await guardedFetch(`https://${apex}/`, { redirect: "manual" });
		const body = (await r.text()).replace(/\s+/g, " ").slice(0, 180);
		http = {
			status: String(r.status),
			body
		};
		tls = `HTTPS ${r.status}`;
	} catch (e) {
		http = {
			status: "ERR",
			body: e instanceof Error ? e.message : "fetch failed"
		};
		tls = e instanceof Error ? e.message : "TLS failed";
	}
	const notFound = /DEPLOYMENT_NOT_FOUND/i.test(http.body);
	const onVercel = apexA.includes("76.76.21.21");
	const verdict = notFound ? "DNS reaches Vercel, but no published app owns s1r1us.ai. Publish in Grok, then add this domain — do not change GoDaddy yet." : tls.startsWith("HTTPS 2") ? "HTTPS is up. Open https://s1r1us.ai/s1r1us" : onVercel ? "Apex is on Vercel anycast. SSL will stay invalid until the domain is attached to a published project." : "Apex A is not 76.76.21.21 — copy the records Grok Publish shows, not a guess.";
	return {
		at: (/* @__PURE__ */ new Date()).toISOString(),
		apexA,
		wwwCname,
		ns,
		http,
		tls,
		verdict
	};
});
//#endregion
export { probeSiteHealth_createServerFn_handler };
