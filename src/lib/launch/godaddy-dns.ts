/** GoDaddy DNS for s1r1us.ai → published Vercel host. Do not CNAME the Grok preview. */
export const GODADDY_DNS_ROWS = [
  {
    type: "A",
    name: "@",
    value: "76.76.21.21",
    ttl: "600",
    why: "s1r1us.ai (the root). Only after the domain is attached on the published host.",
  },
  {
    type: "CNAME",
    name: "www",
    value: "cname.vercel-dns.com",
    ttl: "600",
    why: "www.s1r1us.ai. If Vercel shows a unique *.vercel-dns-017.com, paste that instead of this value.",
  },
] as const;

export const GODADDY_DNS_SKIP = [
  "Publish this app in Grok first (grok.me). Then add s1r1us.ai as the custom domain there. SSL is issued only after that attach.",
  "If Grok shows different A/CNAME values than this table, use Grok’s values — not both.",
  "Do not create MX until you have a mailbox you control.",
  "Do not point A/CNAME at a GoDaddy Airo / parked AI site.",
  "Do not point at the in-chat preview — it is not a stable host.",
  "Delete old A/AAAA/CNAME on @ and www before saving these.",
];
