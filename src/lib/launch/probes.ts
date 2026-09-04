import { createServerFn } from "@tanstack/react-start";
import { LIVE_UNLOCKED } from "@/lib/desk/practice";
import { verifyAccessToken } from "@/lib/desk/access.server";
import { cloudflareDns } from "@/lib/desk/net-guard";
import { DOMAINS, GODADDY_IO } from "./model";

export type DomainProbe = {
  name: string;
  available: boolean | null;
  status: string;
  ns: string[];
};

async function dnsNs(name: string): Promise<DomainProbe> {
  try {
    const j = await cloudflareDns(name, "NS");
    const ns = (j.Answer ?? []).map((a) => String(a.data ?? "").replace(/\.$/, "")).filter(Boolean);
    if (j.Status === 3) return { name, available: true, status: "NXDOMAIN — not registered", ns: [] };
    if (j.Status === 0 && ns.length) return { name, available: false, status: "Registered", ns };
    if (j.Status === 0) return { name, available: false, status: "Has DNS, no NS in answer", ns };
    return { name, available: null, status: `DNS status ${j.Status ?? "?"}`, ns };
  } catch (e) {
    return { name, available: null, status: e instanceof Error ? e.message : "DNS failed", ns: [] };
  }
}

export const probeLaunch = createServerFn({ method: "POST" })
  .validator((input: { token: string }) => input)
  .handler(async ({ data }) => {
    if (!(await verifyAccessToken(data.token))) {
      return { at: new Date().toISOString(), godaddy: GODADDY_IO, liveLocked: true, domains: [] as DomainProbe[] };
    }
    const domains = await Promise.all(DOMAINS.map((d) => dnsNs(d.name)));
  return {
    at: new Date().toISOString(),
    godaddy: GODADDY_IO,
    liveLocked: !LIVE_UNLOCKED,
    domains,
  };
});
