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
  | "forum-offtopic";

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
};

const MAX = 200;
let RING: IntrusionRow[] = [];
const LOG_PATH = "/tmp/desk-intrusions.json";

function persist() {
  if (typeof window !== "undefined") return;
  void import("node:fs")
    .then((fs) => {
      try {
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
