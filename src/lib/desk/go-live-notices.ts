/** Pull-based go-live notices for registered AI agents. Server-only. No webhooks. */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

export type GoLiveNoticeKind =
  | "MAINTENANCE"
  | "OPEN"
  | "PAUSED"
  | "RESUMED"
  | "LIVE_ON"
  | "LIVE_OFF"
  | "GO_LIVE_STATUS"
  | "GO_LIVE_DATE"
  | "FORUM_OPEN"
  | "BOARD_LIVE"
  | "BOARD_PAUSED"
  | "SIM_LIVE"
  | "SIM_PAUSED"
  | "HIVE_LIVE"
  | "HIVE_PAUSED";

export type GoLiveNotice = {
  id: string;
  at: string;
  kind: GoLiveNoticeKind;
  headline: string;
  message: string;
};

type Store = { notices: GoLiveNotice[] };

const PATHS = ["/tmp/go-live-notices.json", "/workspace/data/go-live-notices.json"];
const MAX = 40;

function load(): Store {
  if (typeof window !== "undefined") return { notices: [] };
  for (const p of PATHS) {
    try {
      const raw = JSON.parse(readFileSync(p, "utf8")) as Store;
      if (Array.isArray(raw?.notices)) return { notices: raw.notices.slice(0, MAX) };
    } catch {
      /* missing */
    }
  }
  return { notices: [] };
}

function save(s: Store) {
  if (typeof window !== "undefined") return;
  const body = JSON.stringify(s);
  for (const p of PATHS) {
    try {
      if (p.startsWith("/workspace/data")) mkdirSync("/workspace/data", { recursive: true });
      writeFileSync(p, body);
    } catch {
      /* preview */
    }
  }
}

export function listGoLiveNotices(limit = 12): GoLiveNotice[] {
  const s = load();
  if (!s.notices.length) {
    return [
      stampGoLiveNotice(
        "GO_LIVE_STATUS",
        "Go-live path STARTED 2026-09-05",
        "PoC rails + Auto GM/7-B0T would-accumulate STARTED. Auto trade LOCKED. Register POST /api/agent/waitlist {name, kind, mandate:true} and poll this feed. Pause, maintenance, and live on/off stamp a new notice. No webhooks.",
      ),
    ];
  }
  return s.notices.slice(0, Math.max(1, Math.min(limit, MAX)));
}

export function stampGoLiveNotice(kind: GoLiveNoticeKind, headline: string, message: string): GoLiveNotice {
  const row: GoLiveNotice = {
    id: `gln-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    at: new Date().toISOString(),
    kind,
    headline: headline.slice(0, 160),
    message: message.slice(0, 480),
  };
  const s = load();
  const last = s.notices[0];
  if (last && last.kind === kind && last.headline === row.headline) {
    return last;
  }
  s.notices = [row, ...s.notices].slice(0, MAX);
  save(s);
  return row;
}
