/** Admin-only ring of blocked probes. Not a public IDS dump. */

export type IntrusionKind =
  | "rate-limit"
  | "scraper"
  | "blocked-host"
  | "blocked-url"
  | "auth-fail"
  | "auth-throttle"
  | "waitlist-reject"
  | "source-probe"
  | "secret-paste"
  | "waf-block"
  | "ip-ban"
  | "scanner"
  | "agent-inject"
  | "mcp-deny"
  | "agency-probe"
  | "forum-bar"
  | "forum-offtopic"
  | "bad-bot";

export type IntrusionRow = {
  id: string;
  at: string;
  kind: IntrusionKind;
  ip: string;
  ua: string;
  detail: string;
  blocked: true;
};

export const INTRUSION_KIND_LABEL: Record<IntrusionKind, string> = {
  "rate-limit": "Rate limit",
  scraper: "Scraper",
  "blocked-host": "Blocked host",
  "blocked-url": "Blocked URL",
  "auth-fail": "Auth fail",
  "auth-throttle": "Auth throttle",
  "waitlist-reject": "Waitlist reject",
  "source-probe": "Source probe",
  "secret-paste": "Secret paste",
  "waf-block": "WAF block",
  "ip-ban": "IP ban",
  scanner: "Scanner",
  "agent-inject": "Agent injection",
  "mcp-deny": "MCP deny",
  "agency-probe": "Agency probe",
  "forum-bar": "W1S3 0WL$ bar",
  "forum-offtopic": "Forum off-topic",
  "bad-bot": "Bad bot",
};

/** External agents that probe, inject, scrape, or violate mandate. Always blocked. */
export const BAD_BOT_KINDS: readonly IntrusionKind[] = [
  "bad-bot",
  "source-probe",
  "agent-inject",
  "mcp-deny",
  "agency-probe",
  "forum-bar",
  "scraper",
  "scanner",
  "waitlist-reject",
  "secret-paste",
];

export function isBadBotKind(kind: string): kind is IntrusionKind {
  return (BAD_BOT_KINDS as readonly string[]).includes(kind);
}

const MAX = 200;
let RING: IntrusionRow[] = [];
const LOG_PATH = "/tmp/desk-intrusions.json";

function persist() {
  if (typeof window !== "undefined") return;
  void import("node:fs")
    .then((fs) => {
      try {
        try {
          ingestPersisted(JSON.parse(fs.readFileSync(LOG_PATH, "utf8")));
        } catch {
          /* missing */
        }
        fs.writeFileSync(LOG_PATH, JSON.stringify({ at: new Date().toISOString(), rows: RING }, null, 2));
      } catch {
        /* preview */
      }
    })
    .catch(() => undefined);
}

export function ingestPersisted(raw: unknown) {
  if (!raw || typeof raw !== "object") return;
  const rows = (raw as { rows?: unknown }).rows;
  if (!Array.isArray(rows) || !rows.length) return;
  const seen = new Set(RING.map((r) => r.id));
  const extra: IntrusionRow[] = [];
  for (const item of rows) {
    if (!item || typeof item !== "object") continue;
    const r = item as Partial<IntrusionRow>;
    if (!r.id || !r.at || !r.kind || !r.blocked) continue;
    if (seen.has(r.id)) continue;
    seen.add(r.id);
    extra.push({
      id: String(r.id).slice(0, 40),
      at: String(r.at).slice(0, 40),
      kind: r.kind,
      ip: String(r.ip ?? "local").slice(0, 64),
      ua: String(r.ua ?? "-").slice(0, 80),
      detail: String(r.detail ?? "").slice(0, 180),
      blocked: true,
    });
  }
  if (!extra.length) return;
  RING = [...RING, ...extra].sort((a, b) => Date.parse(b.at) - Date.parse(a.at)).slice(0, MAX);
}

/** Permanent IP bar on first malicious / probing agent hit. Not scrapers (those 429). */
const AUTO_BAR_KINDS: readonly IntrusionKind[] = [
  "bad-bot",
  "source-probe",
  "agent-inject",
  "mcp-deny",
  "agency-probe",
  "forum-bar",
];

export function recordIntrusion(row: {
  kind: IntrusionKind;
  ip?: string;
  ua?: string;
  detail: string;
}) {
  const at = new Date().toISOString();
  const ip = (row.ip ?? "local").slice(0, 64);
  const ua = (row.ua ?? "-").slice(0, 80);
  const detail = row.detail.slice(0, 180);
  const last = RING[0];
  if (last && last.kind === row.kind && last.ip === ip && last.detail === detail && Date.now() - Date.parse(last.at) < 20_000) {
    last.at = at;
    persist();
    return last;
  }
  const rec: IntrusionRow = {
    id: `${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 6)}`,
    at,
    kind: row.kind,
    ip,
    ua,
    detail,
    blocked: true,
  };
  RING.unshift(rec);
  if (RING.length > MAX) RING.length = MAX;
  persist();
  if (typeof window === "undefined" && (AUTO_BAR_KINDS as readonly string[]).includes(row.kind)) {
    void import("./ban-list")
      .then(({ barPermanent, isLoopback }) => {
        if (!isLoopback(ip)) barPermanent(ip, `${row.kind} ${detail}`.slice(0, 160));
      })
      .catch(() => undefined);
  }
  return rec;
}

export function listIntrusions(): IntrusionRow[] {
  return RING.slice(0, MAX);
}

export function intrusionSummary() {
  const last24 = Date.now() - 24 * 60 * 60_000;
  const today = RING.filter((r) => Date.parse(r.at) >= last24);
  const byKind: Record<string, number> = {};
  for (const r of today) byKind[r.kind] = (byKind[r.kind] ?? 0) + 1;
  return {
    total: RING.length,
    last24h: today.length,
    byKind,
    lastAt: RING[0]?.at ?? null,
  };
}

export function badBotIntrusions(hours = 24) {
  const since = Date.now() - hours * 60 * 60_000;
  return RING.filter((r) => isBadBotKind(r.kind) && Date.parse(r.at) >= since);
}

export function badBotSummary() {
  const last24 = badBotIntrusions(24);
  const byKind: Record<string, number> = {};
  for (const r of last24) byKind[r.kind] = (byKind[r.kind] ?? 0) + 1;
  return {
    last24h: last24.length,
    byKind,
    lastAt: last24[0]?.at ?? null,
    rows: last24.slice(0, 40),
  };
}
