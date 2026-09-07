import { r as __exportAll } from "../_runtime.mjs";
import { t as __exportAll$1 } from "./agent-ping-BXZGzZ_N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/net-guard-C4Si76ZP.js
var net_guard_C4Si76ZP_exports = /* @__PURE__ */ __exportAll({
	n: () => guardedFetch,
	r: () => net_guard_exports,
	t: () => cloudflareDns
});
var net_guard_exports = /* @__PURE__ */ __exportAll$1({
	DNS_RESOLVER: () => DNS_RESOLVER,
	assertOutbound: () => assertOutbound,
	cloudflareDns: () => cloudflareDns,
	guardedFetch: () => guardedFetch,
	hostAllowed: () => hostAllowed
});
/**
* App-level outbound guard. This is not an OS firewall.
*
* Invalid (cannot do from this host):
* - Pin Windows/macOS /etc/resolv.conf
* - Stop ISP / visitor-browser DNS tampering
* - Force 1.1.1.1 on Vercel’s resolver for every fetch
*
* Valid:
* - Explicit DNS lookups use Cloudflare DoH (cloudflare-dns.com), never dns.google
* - Server fetch only HTTPS to an allowlisted hostname (no IP literals, no user URLs)
* - Operator CLI machine: set DNS to 1.1.1.1 / 1.0.0.1
*/
var DNS_RESOLVER = {
	name: "Cloudflare 1.1.1.1",
	doh: "https://cloudflare-dns.com/dns-query",
	ipv4: ["1.1.1.1", "1.0.0.1"],
	ipv6: ["2606:4700:4700::1111", "2606:4700:4700::1001"]
};
var HOST_SUFFIXES = [
	"cloudflare-dns.com",
	"cloudflare-eth.com",
	"x.ai",
	"coinbase.com",
	"okx.com",
	"bybit.com",
	"binance.com",
	"hyperliquid.xyz",
	"bitfinex.com",
	"blockchain.info",
	"blockchain.com",
	"alternative.me",
	"blockstream.info",
	"mempool.space",
	"mempool.emzy.de",
	"sosovalue.xyz",
	"bitbo.io",
	"coingecko.com",
	"sec.gov",
	"cisa.gov",
	"osv.dev",
	"githubusercontent.com",
	"github.com",
	"cnbc.com",
	"yahoo.com",
	"cointelegraph.com",
	"coindesk.com",
	"decrypt.co",
	"bitcoin.com",
	"fool.com",
	"bitcoinmagazine.com",
	"frankfurter.app",
	"upbit.com",
	"bithumb.com",
	"hashkey.com",
	"huobi.pro",
	"er-api.com",
	"bitoasis.net",
	"rapira.net",
	"luno.com",
	"mercadobitcoin.net",
	"buda.com",
	"stlouisfed.org",
	"stooq.com",
	"frankfurter.app",
	"frankfurter.dev",
	"llama.fi",
	"kraken.com",
	"yubico.com",
	"base.org",
	"publicnode.com",
	"s1r1us.ai",
	"s1rius.ai",
	"resend.com",
	"auth.grok.me",
	"grok.me",
	"grok.com",
	"x.com",
	"twitter.com",
	"polymarket.com",
	"kalshi.com"
];
var BLOCKED_DNS = /* @__PURE__ */ new Set([
	"dns.google",
	"dns.google.com",
	"8.8.8.8",
	"8.8.4.4",
	"google.com"
]);
function hostAllowed(host) {
	const h = host.trim().toLowerCase().replace(/\.$/, "");
	if (!h || BLOCKED_DNS.has(h)) return false;
	if (h === "localhost" || h.endsWith(".local") || h.endsWith(".internal")) return false;
	if (/^\d{1,3}(\.\d{1,3}){3}$/.test(h)) return false;
	if (h.includes(":")) return false;
	return HOST_SUFFIXES.some((s) => h === s || h.endsWith(`.${s}`));
}
function assertOutbound(raw) {
	let u;
	try {
		u = new URL(raw);
	} catch {
		throw new Error("blocked url");
	}
	if (u.protocol !== "https:") throw new Error("https only");
	if (u.username || u.password) throw new Error("blocked credentials in url");
	if (!hostAllowed(u.hostname)) throw new Error(`blocked host ${u.hostname}`);
	return u;
}
async function guardedFetch(raw, init) {
	const first = assertOutbound(raw);
	const res = await fetch(first.toString(), {
		...init,
		redirect: "manual"
	});
	if (res.status < 300 || res.status >= 400) return res;
	const loc = res.headers.get("location");
	if (!loc) return res;
	const next = assertOutbound(new URL(loc, first).toString());
	return fetch(next.toString(), {
		...init,
		redirect: "error"
	});
}
async function cloudflareDns(name, type = "A") {
	const q = name.trim().toLowerCase().replace(/\.$/, "");
	if (!/^[a-z0-9][a-z0-9.-]{0,251}[a-z0-9]$/.test(q) || q.includes("..")) throw new Error("blocked qname");
	if (!q.endsWith(".ai") && !q.endsWith(".com") && !q.endsWith(".io") && !q.endsWith(".gov") && !q.endsWith(".dev")) throw new Error("blocked qname tld");
	const res = await guardedFetch(`${DNS_RESOLVER.doh}?name=${encodeURIComponent(q)}&type=${type}`, { headers: { Accept: "application/dns-json" } });
	if (!res.ok) throw new Error(`DoH ${res.status}`);
	return await res.json();
}
//#endregion
export { guardedFetch as n, net_guard_C4Si76ZP_exports as r, cloudflareDns as t };
