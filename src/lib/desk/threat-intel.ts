/**
 * Free threat intel: CISA Known Exploited Vulnerabilities + OSV.dev npm.
 * No API key. Cached 6h. Stack-filtered — we do not dump 1,600 CVEs on the tab.
 */
import { guardedFetch } from "./net-guard";
import { applyIntelPatches } from "./auto-defend";

const KEV_URL = "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json";
const KEV_MIRROR = "https://raw.githubusercontent.com/cisagov/kev-data/develop/known_exploited_vulnerabilities.json";
const OSV_URL = "https://api.osv.dev/v1/querybatch";
const TTL_MS = 6 * 60 * 60_000;
const STACK =
  /\b(node\.?js|nodejs|react|vite|nginx|openssl|linux|postgres|postgresql|cloudflare|vercel|npm|tanstack|better-auth|pglite|starlette|chromium|apache)\b/i;

const PACKAGES = [
  { name: "react", ecosystem: "npm" },
  { name: "vite", ecosystem: "npm" },
  { name: "@tanstack/react-start", ecosystem: "npm" },
  { name: "better-auth", ecosystem: "npm" },
  { name: "nitro", ecosystem: "npm" },
] as const;

export type KevRow = {
  cveID: string;
  vendorProject: string;
  product: string;
  vulnerabilityName: string;
  dateAdded: string;
  shortDescription: string;
  requiredAction: string;
  knownRansomwareCampaignUse: string;
  stack: boolean;
};

export type OsvRow = {
  pkg: string;
  id: string;
  summary: string;
  severity: string;
};

export type IntelSnapshot = {
  asOf: string;
  source: string;
  catalogVersion: string;
  dateReleased: string;
  count: number;
  stackHits: KevRow[];
  recent: KevRow[];
  ransomware: number;
  osv: OsvRow[];
  error: string | null;
  patched: string[];
};

let cache: IntelSnapshot | null = null;
let inflight: Promise<IntelSnapshot> | null = null;

function empty(error: string | null): IntelSnapshot {
  return {
    asOf: new Date().toISOString(),
    source: "none",
    catalogVersion: "—",
    dateReleased: "—",
    count: 0,
    stackHits: [],
    recent: [],
    ransomware: 0,
    osv: [],
    error,
    patched: [],
  };
}

function mapKev(v: Record<string, unknown>): KevRow {
  const vendor = String(v.vendorProject ?? "");
  const product = String(v.product ?? "");
  const name = String(v.vulnerabilityName ?? "");
  const blob = `${vendor} ${product} ${name} ${String(v.shortDescription ?? "")}`;
  return {
    cveID: String(v.cveID ?? "").slice(0, 24),
    vendorProject: vendor.slice(0, 48),
    product: product.slice(0, 64),
    vulnerabilityName: name.slice(0, 120),
    dateAdded: String(v.dateAdded ?? "").slice(0, 12),
    shortDescription: String(v.shortDescription ?? "").slice(0, 280),
    requiredAction: String(v.requiredAction ?? "").slice(0, 220),
    knownRansomwareCampaignUse: String(v.knownRansomwareCampaignUse ?? "Unknown").slice(0, 16),
    stack: STACK.test(blob),
  };
}

async function pullKev(): Promise<{ source: string; json: Record<string, unknown> }> {
  for (const url of [KEV_URL, KEV_MIRROR]) {
    try {
      const res = await guardedFetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": "S1R1US-Desk/68 (security-tab; +https://s1r1us.ai)",
        },
      });
      if (!res.ok) continue;
      const json = (await res.json()) as Record<string, unknown>;
      if (!Array.isArray(json.vulnerabilities)) continue;
      return { source: url.includes("cisa.gov") ? "cisa.gov KEV" : "cisagov/kev-data mirror", json };
    } catch {
      /* try next */
    }
  }
  throw new Error("KEV feed unreachable");
}

async function pullOsv(): Promise<OsvRow[]> {
  try {
    const res = await guardedFetch(OSV_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Accept: "application/json",
        "User-Agent": "S1R1US-Desk/68 (security-tab; +https://s1r1us.ai)",
      },
      body: JSON.stringify({
        queries: PACKAGES.map((p) => ({ package: { name: p.name, ecosystem: p.ecosystem } })),
      }),
    });
    if (!res.ok) return [];
    const body = (await res.json()) as { results?: { vulns?: { id?: string; summary?: string; severity?: { type?: string; score?: string }[] }[] }[] };
    const rows: OsvRow[] = [];
    (body.results ?? []).forEach((r, i) => {
      const pkg = PACKAGES[i]?.name ?? "pkg";
      for (const v of r.vulns ?? []) {
        rows.push({
          pkg,
          id: String(v.id ?? "").slice(0, 40),
          summary: String(v.summary ?? "").slice(0, 180),
          severity: String(v.severity?.[0]?.score ?? v.severity?.[0]?.type ?? "—").slice(0, 24),
        });
      }
    });
    return rows.slice(0, 24);
  } catch {
    return [];
  }
}

export async function refreshIntel(force = false): Promise<IntelSnapshot> {
  if (!force && cache && Date.now() - Date.parse(cache.asOf) < TTL_MS) return cache;
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      const [kev, osv] = await Promise.all([
        Promise.race([
          pullKev(),
          new Promise<never>((_, rej) => setTimeout(() => rej(new Error("KEV timeout")), 8_000)),
        ]),
        Promise.race([
          pullOsv(),
          new Promise<OsvRow[]>((resolve) => setTimeout(() => resolve([]), 6_000)),
        ]),
      ]);
      const list = (kev.json.vulnerabilities as Record<string, unknown>[]).map(mapKev);
      list.sort((a, b) => (a.dateAdded < b.dateAdded ? 1 : a.dateAdded > b.dateAdded ? -1 : 0));
      const stackHits = list.filter((r) => r.stack).slice(0, 20);
      const snap: IntelSnapshot = {
        asOf: new Date().toISOString(),
        source: kev.source,
        catalogVersion: String(kev.json.catalogVersion ?? "—"),
        dateReleased: String(kev.json.dateReleased ?? "—").slice(0, 24),
        count: Number(kev.json.count) || list.length,
        stackHits,
        recent: list.slice(0, 12),
        ransomware: list.filter((r) => /known/i.test(r.knownRansomwareCampaignUse)).length,
        osv,
        error: null,
        patched: [],
      };
      snap.patched = applyIntelPatches(
        stackHits.map((h) => ({
          cveID: h.cveID,
          product: `${h.vendorProject} ${h.product}`,
          action: h.requiredAction,
        })),
      );
      cache = snap;
      persist(snap);
      return snap;
    } catch (e) {
      const snap = empty(e instanceof Error ? e.message : "intel failed");
      if (cache) return cache;
      cache = snap;
      return snap;
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

export function cachedIntel(): IntelSnapshot {
  return cache ?? empty(null);
}

function persist(snap: IntelSnapshot) {
  if (typeof window !== "undefined") return;
  void import("node:fs")
    .then((fs) => {
      try {
        fs.writeFileSync("/tmp/desk-intel.json", JSON.stringify(snap));
      } catch {
        /* preview */
      }
    })
    .catch(() => undefined);
}

export function ingestIntel(raw: unknown) {
  if (!raw || typeof raw !== "object") return;
  const s = raw as Partial<IntelSnapshot>;
  if (!s.asOf || !Array.isArray(s.stackHits)) return;
  cache = {
    asOf: String(s.asOf),
    source: String(s.source ?? "disk"),
    catalogVersion: String(s.catalogVersion ?? "—"),
    dateReleased: String(s.dateReleased ?? "—"),
    count: Number(s.count) || 0,
    stackHits: s.stackHits.slice(0, 20) as KevRow[],
    recent: Array.isArray(s.recent) ? (s.recent.slice(0, 12) as KevRow[]) : [],
    ransomware: Number(s.ransomware) || 0,
    osv: Array.isArray(s.osv) ? (s.osv.slice(0, 24) as OsvRow[]) : [],
    error: s.error ? String(s.error) : null,
    patched: Array.isArray(s.patched) ? s.patched.map(String) : [],
  };
}
