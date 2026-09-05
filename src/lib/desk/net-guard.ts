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

export const DNS_RESOLVER = {
  name: "Cloudflare 1.1.1.1",
  doh: "https://cloudflare-dns.com/dns-query",
  ipv4: ["1.1.1.1", "1.0.0.1"],
  ipv6: ["2606:4700:4700::1111", "2606:4700:4700::1001"],
} as const;

/** Respected public recursive resolvers — inventory only. This desk uses Cloudflare. */
export const PUBLIC_DNS_MASTERS = [
  { id: "cloudflare", name: "Cloudflare", addr: "1.1.1.1", use: true, note: "Privacy DoH/DoT. Desk DoH endpoint." },
  { id: "quad9", name: "Quad9", addr: "9.9.9.9", use: false, note: "Malware block. Not used — CF-only policy." },
  { id: "opendns", name: "Cisco OpenDNS", addr: "208.67.222.222", use: false, note: "Not used." },
  { id: "adguard", name: "AdGuard DNS", addr: "94.140.14.14", use: false, note: "Not used." },
  { id: "mullvad", name: "Mullvad DNS", addr: "194.242.2.2", use: false, note: "Not used." },
  { id: "controld", name: "Control D", addr: "76.76.2.0", use: false, note: "Not used." },
  { id: "google", name: "Google Public DNS", addr: "8.8.8.8", use: false, note: "Excluded. No Google DNS." },
] as const;

const HOST_SUFFIXES = [
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
] as const;

const BLOCKED_DNS = new Set(["dns.google", "dns.google.com", "8.8.8.8", "8.8.4.4", "google.com"]);

export function hostAllowed(host: string): boolean {
  const h = host.trim().toLowerCase().replace(/\.$/, "");
  if (!h || BLOCKED_DNS.has(h)) return false;
  if (h === "localhost" || h.endsWith(".local") || h.endsWith(".internal")) return false;
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(h)) return false;
  if (h.includes(":")) return false;
  return HOST_SUFFIXES.some((s) => h === s || h.endsWith(`.${s}`));
}

export function assertOutbound(raw: string): URL {
  let u: URL;
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

export async function guardedFetch(raw: string, init?: RequestInit): Promise<Response> {
  const first = assertOutbound(raw);
  const res = await fetch(first.toString(), { ...init, redirect: "manual" });
  if (res.status < 300 || res.status >= 400) return res;
  const loc = res.headers.get("location");
  if (!loc) return res;
  const next = assertOutbound(new URL(loc, first).toString());
  return fetch(next.toString(), { ...init, redirect: "error" });
}

export type DohAnswer = { Status?: number; Answer?: { data?: string; type?: number }[] };

export async function cloudflareDns(name: string, type: "A" | "NS" | "CNAME" | "AAAA" = "A"): Promise<DohAnswer> {
  const q = name.trim().toLowerCase().replace(/\.$/, "");
  if (!/^[a-z0-9][a-z0-9.-]{0,251}[a-z0-9]$/.test(q) || q.includes("..")) {
    throw new Error("blocked qname");
  }
  if (!q.endsWith(".ai") && !q.endsWith(".com") && !q.endsWith(".io")) {
    throw new Error("blocked qname tld");
  }
  const url = `${DNS_RESOLVER.doh}?name=${encodeURIComponent(q)}&type=${type}`;
  const res = await guardedFetch(url, { headers: { Accept: "application/dns-json" } });
  if (!res.ok) throw new Error(`DoH ${res.status}`);
  return (await res.json()) as DohAnswer;
}
