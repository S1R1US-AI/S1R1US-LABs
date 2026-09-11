//#region ../../workspace/node_modules/.nitro/vite/services/ssr/assets/godaddy-dns-DCMIOqdf.js
/** GoDaddy DNS for s1r1us.ai → DigitalOcean App Platform ingress. Leave nameservers on GoDaddy. */
var DO_INGRESS_A = ["162.159.140.98", "172.66.0.96"];
var GODADDY_DNS_ROWS = [
	{
		type: "A",
		name: "@",
		value: "162.159.140.98",
		ttl: "½ hour",
		why: "s1r1us.ai apex — DigitalOcean shared ingress (first of two)."
	},
	{
		type: "A",
		name: "@",
		value: "172.66.0.96",
		ttl: "½ hour",
		why: "s1r1us.ai apex — DigitalOcean shared ingress (second of two)."
	},
	{
		type: "A",
		name: "www",
		value: "162.159.140.98",
		ttl: "½ hour",
		why: "www.s1r1us.ai — same ingress. Do not CNAME www to Vercel."
	},
	{
		type: "A",
		name: "www",
		value: "172.66.0.96",
		ttl: "½ hour",
		why: "www.s1r1us.ai — second address."
	}
];
var GODADDY_DNS_SKIP = [
	"Do not change nameservers. Keep GoDaddy ns*.domaincontrol.com.",
	"Do not keep any Vercel A (76.76.21.21) or cname.vercel-dns.com.",
	"Add s1r1us.ai under DigitalOcean App Settings → Domains so TLS can issue.",
	"Do not create MX until you have a mailbox you control.",
	"Do not point A/CNAME at a GoDaddy Airo / parked AI site."
];
//#endregion
export { GODADDY_DNS_ROWS as n, GODADDY_DNS_SKIP as r, DO_INGRESS_A as t };
