import { createServerFn } from "@tanstack/react-start";
import { verifyAccessToken } from "@/lib/desk/access.server";
import { cloudflareDns, guardedFetch } from "@/lib/desk/net-guard";
import { DO_INGRESS_A } from "./godaddy-dns";
import { COIN_DOMAIN } from "./model";

const hits: number[] = [];
function throttle() {
  const now = Date.now();
  while (hits.length && now - hits[0]! > 60_000) hits.shift();
  if (hits.length >= 20) return true;
  hits.push(now);
  return false;
}

export type SiteHealth = {
  at: string;
  apexA: string[];
  wwwA: string[];
  wwwCname: string[];
  ns: string[];
  http: { status: string; body: string };
  tls: string;
  verdict: string;
};

async function dnsJson(name: string, type: "A" | "NS" | "CNAME") {
  const j = await cloudflareDns(name, type);
  return (j.Answer ?? []).map((a) => String(a.data ?? "").replace(/\.$/, ""));
}

function pointsAtDo(addrs: string[]) {
  return DO_INGRESS_A.some((ip) => addrs.includes(ip));
}

export const probeSiteHealth = createServerFn({ method: "POST" })
  .validator((input: { token: string }) => input)
  .handler(async ({ data }): Promise<SiteHealth> => {
  if (!(await verifyAccessToken(data.token))) {
    return {
      at: new Date().toISOString(),
      apexA: [],
      wwwA: [],
      wwwCname: [],
      ns: [],
      http: { status: "401", body: "admin" },
      tls: "skipped",
      verdict: "Admin session required.",
    };
  }
  if (throttle()) {
    return {
      at: new Date().toISOString(),
      apexA: [],
      wwwA: [],
      wwwCname: [],
      ns: [],
      http: { status: "429", body: "health probe capped" },
      tls: "skipped",
      verdict: "Slow down — health probe is rate-limited.",
    };
  }
  const apex = COIN_DOMAIN;
  const [apexA, wwwA, wwwCname, ns] = await Promise.all([
    dnsJson(apex, "A"),
    dnsJson(`www.${apex}`, "A"),
    dnsJson(`www.${apex}`, "CNAME"),
    dnsJson(apex, "NS"),
  ]);

  let http = { status: "ERR", body: "" };
  let tls = "unknown";
  try {
    const r = await guardedFetch(`https://${apex}/`, { redirect: "manual" } as RequestInit);
    const body = (await r.text()).replace(/\s+/g, " ").slice(0, 180);
    http = { status: String(r.status), body };
    tls = `HTTPS ${r.status}`;
  } catch (e) {
    http = { status: "ERR", body: e instanceof Error ? e.message : "fetch failed" };
    tls = e instanceof Error ? e.message : "TLS failed";
  }

  const onDo = pointsAtDo(apexA);
  const onVercel = apexA.includes("76.76.21.21");
  const handshakeFail = /handshake|sslv3|certificate|tls/i.test(tls + http.body);
  const verdict = tls.startsWith("HTTPS 2")
    ? "HTTPS is up. Open https://s1r1us.ai/"
    : onDo && handshakeFail
      ? "GoDaddy A records hit DigitalOcean, but TLS is not issued yet. Add s1r1us.ai under the app Domains and wait for a green deploy."
    : onDo
      ? "Apex is on DigitalOcean. If the page is down, the container is not green — check App Platform deploy logs."
    : onVercel
      ? "Apex is still on Vercel. Replace A records with DigitalOcean 162.159.140.98 and 172.66.0.96."
      : "Apex A is not DigitalOcean ingress. Keep nameservers on GoDaddy; set @ and www A to both ingress IPs.";

  return {
    at: new Date().toISOString(),
    apexA,
    wwwA,
    wwwCname,
    ns,
    http,
    tls,
    verdict,
  };
});
