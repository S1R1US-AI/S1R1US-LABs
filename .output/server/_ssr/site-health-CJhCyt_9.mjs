import { r as createServerFn } from "./ssr.mjs";
import { verifyAccessToken } from "./access.server-B-78AuBV.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { n as guardedFetch, t as cloudflareDns } from "./net-guard-3Kz6JH57.mjs";
import { i as COIN_DOMAIN } from "./model-DnitDZdY.mjs";
import { t as DO_INGRESS_A } from "./godaddy-dns-DCMIOqdf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-health-CJhCyt_9.js
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
function pointsAtDo(addrs) {
	return DO_INGRESS_A.some((ip) => addrs.includes(ip));
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
		wwwA: [],
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
		wwwA: [],
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
	const [apexA, wwwA, wwwCname, ns] = await Promise.all([
		dnsJson(apex, "A"),
		dnsJson(`www.${apex}`, "A"),
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
	const onDo = pointsAtDo(apexA);
	const onVercel = apexA.includes("76.76.21.21");
	const handshakeFail = /handshake|sslv3|certificate|tls/i.test(tls + http.body);
	const verdict = tls.startsWith("HTTPS 2") ? "HTTPS is up. Open https://s1r1us.ai/" : onDo && handshakeFail ? "GoDaddy A records hit DigitalOcean, but TLS is not issued yet. Add s1r1us.ai under the app Domains and wait for a green deploy." : onDo ? "Apex is on DigitalOcean. If the page is down, the container is not green — check App Platform deploy logs." : onVercel ? "Apex is still on Vercel. Replace A records with DigitalOcean 162.159.140.98 and 172.66.0.96." : "Apex A is not DigitalOcean ingress. Keep nameservers on GoDaddy; set @ and www A to both ingress IPs.";
	return {
		at: (/* @__PURE__ */ new Date()).toISOString(),
		apexA,
		wwwA,
		wwwCname,
		ns,
		http,
		tls,
		verdict
	};
});
//#endregion
export { probeSiteHealth_createServerFn_handler };
