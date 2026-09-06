/**
 * CrowdSec / Fail2ban-style local reputation. No paid IP feed.
 * Loopback is never banned — that is the operator preview.
 */
export type BanRow = {
  ip: string;
  until: number;
  reason: string;
  strikes: number;
  at: string;
};

const LOOPBACK = new Set(["local", "127.0.0.1", "::1", "0.0.0.0", "::ffff:127.0.0.1"]);
const STRIKES = new Map<string, { n: number; at: number }>();
let BANS: BanRow[] = [];
const LOG_PATH = "/tmp/desk-bans.json";

export function clientIpFromHeaders(headers: unknown): string {
  const rec = (headers && typeof headers === "object" ? headers : {}) as {
    get?: (n: string) => string | null;
    [k: string]: unknown;
  };
  const read = (name: string) => {
    if (typeof rec.get === "function") return rec.get(name) ?? "";
    const v = rec[name] ?? rec[name.toLowerCase()];
    if (Array.isArray(v)) return String(v[0] ?? "");
    return typeof v === "string" ? v : "";
  };
  const cf = read("cf-connecting-ip")?.trim();
  if (cf) return cf.slice(0, 64);
  const real = read("x-real-ip")?.trim();
  if (real) return real.slice(0, 64);
  const fwd = read("x-forwarded-for")?.split(",")[0]?.trim();
  if (fwd) return fwd.slice(0, 64);
  return "local";
}

export function isLoopback(ip: string) {
  const t = ip.trim().toLowerCase();
  if (LOOPBACK.has(t)) return true;
  if (t.startsWith("127.") || t.startsWith("::ffff:127.")) return true;
  return false;
}

export function isBanned(ip: string) {
  prune();
  if (isLoopback(ip)) return false;
  const row = BANS.find((b) => b.ip === ip);
  return Boolean(row && row.until > Date.now());
}

export function banUntil(ip: string) {
  prune();
  return BANS.find((b) => b.ip === ip && b.until > Date.now()) ?? null;
}

/**
 * Weight: WAF CRITICAL=5, auth-fail=2, scraper=2, secret-paste=4.
 * 8 points / 10 min → 30 min ban. 16 points → 12 h.
 */
export function noteStrike(ip: string, weight: number, reason: string): BanRow | null {
  if (isLoopback(ip) || weight <= 0) return null;
  prune();
  const now = Date.now();
  const cur = STRIKES.get(ip);
  if (!cur || now - cur.at > 10 * 60_000) STRIKES.set(ip, { n: weight, at: now });
  else {
    cur.n += weight;
    cur.at = now;
  }
  const n = STRIKES.get(ip)!.n;
  let ms = 0;
  if (n >= 16) ms = 12 * 60 * 60_000;
  else if (n >= 8) ms = 30 * 60_000;
  else return null;
  const existing = BANS.find((b) => b.ip === ip);
  const until = now + ms;
  const row: BanRow = {
    ip: ip.slice(0, 64),
    until,
    reason: reason.slice(0, 160),
    strikes: n,
    at: new Date().toISOString(),
  };
  if (existing) {
    existing.until = Math.max(existing.until, until);
    existing.reason = row.reason;
    existing.strikes = n;
    existing.at = row.at;
    persist();
    return existing;
  }
  BANS.unshift(row);
  if (BANS.length > 200) BANS.length = 200;
  persist();
  return row;
}

export function listBans() {
  prune();
  return {
    active: BANS.filter((b) => b.until > Date.now()),
    total: BANS.length,
    loopbackExempt: true,
    engine: "CrowdSec-style local scoring · Fail2ban windows (8/10m → 30m, 16 → 12h) · permanent forum bars",
  };
}

/** Permanent IP bar (W1S3 0WL$ harm / false-mandate). Loopback never banned. */
export function barPermanent(ip: string, reason: string): BanRow | null {
  if (isLoopback(ip) || !ip) return null;
  prune();
  const now = Date.now();
  const until = now + 10 * 365 * 24 * 60 * 60_000;
  const existing = BANS.find((b) => b.ip === ip);
  const row: BanRow = {
    ip: ip.slice(0, 64),
    until,
    reason: reason.slice(0, 160),
    strikes: 99,
    at: new Date().toISOString(),
  };
  if (existing) {
    existing.until = Math.max(existing.until, until);
    existing.reason = row.reason;
    existing.strikes = 99;
    existing.at = row.at;
    persist();
    return existing;
  }
  BANS.unshift(row);
  if (BANS.length > 200) BANS.length = 200;
  persist();
  return row;
}

export function prune() {
  const now = Date.now();
  BANS = BANS.filter((b) => b.until > now - 24 * 60 * 60_000);
  for (const [ip, s] of STRIKES) {
    if (now - s.at > 60 * 60_000) STRIKES.delete(ip);
  }
}

function persist() {
  if (typeof window !== "undefined") return;
  void import("node:fs")
    .then((fs) => {
      try {
        fs.writeFileSync(LOG_PATH, JSON.stringify({ at: new Date().toISOString(), bans: BANS }, null, 2));
      } catch {
        /* preview */
      }
    })
    .catch(() => undefined);
}

export function ingestBans(raw: unknown) {
  if (!raw || typeof raw !== "object") return;
  const bans = (raw as { bans?: unknown }).bans;
  if (!Array.isArray(bans)) return;
  const seen = new Set(BANS.map((b) => b.ip));
  for (const item of bans) {
    if (!item || typeof item !== "object") continue;
    const b = item as Partial<BanRow>;
    if (!b.ip || !b.until) continue;
    if (seen.has(b.ip)) continue;
    seen.add(b.ip);
    BANS.push({
      ip: String(b.ip).slice(0, 64),
      until: Number(b.until) || 0,
      reason: String(b.reason ?? "").slice(0, 160),
      strikes: Number(b.strikes) || 0,
      at: String(b.at ?? new Date().toISOString()).slice(0, 40),
    });
  }
}

