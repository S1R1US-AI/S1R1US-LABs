/** GoDaddy DNS for s1r1us.ai → DigitalOcean App Platform ingress. Leave nameservers on GoDaddy. */

export const GODADDY_DNS_ROWS = [
  {
    type: "A",
    name: "@",
    value: "DigitalOcean ingress A #1 (App Platform → Domains)",
    ttl: "½ hour",
    why: "s1r1us.ai apex — DigitalOcean shared ingress (first of two).",
  },
  {
    type: "A",
    name: "@",
    value: "DigitalOcean ingress A #2 (App Platform → Domains)",
    ttl: "½ hour",
    why: "s1r1us.ai apex — DigitalOcean shared ingress (second of two).",
  },
  {
    type: "A",
    name: "www",
    value: "DigitalOcean ingress A #1 (App Platform → Domains)",
    ttl: "½ hour",
    why: "www.s1r1us.ai — same ingress. Do not CNAME www to Vercel.",
  },
  {
    type: "A",
    name: "www",
    value: "DigitalOcean ingress A #2 (App Platform → Domains)",
    ttl: "½ hour",
    why: "www.s1r1us.ai — second address.",
  },
] as const;

export const GODADDY_DNS_SKIP = [
  "Do not change nameservers. Keep GoDaddy ns*.domaincontrol.com.",
  "Do not keep any Vercel A (76.76.21.21) or cname.vercel-dns.com.",
  "Add s1r1us.ai under DigitalOcean App Settings → Domains so TLS can issue.",
  "Do not create MX until you have a mailbox you control.",
  "Do not point A/CNAME at a GoDaddy Airo / parked AI site.",
] as const;
