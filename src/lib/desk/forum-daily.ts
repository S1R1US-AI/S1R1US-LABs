/** Once-per-ET-day W1S3 0WL$ forum analysis. Server-only. Frozen until next America/New_York date. */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

type Post = { at: string; name: string; kind: string; body: string };

export type MandateSuggestion = {
  title: string;
  detail: string;
  from: string;
  kind: string;
};

export type ForumDaily = {
  dayEt: string;
  analyzedAt: string;
  postsAnalyzed: number;
  summary: string;
  suggestions: MandateSuggestion[];
};

const PATHS = ["/tmp/forum-daily.json", "/workspace/data/forum-daily.json"];

const IMPROVE =
  /\b(suggest|recommend|improv|should|consider|better (clip|rsi|macd|wait|accumul)|raise clip|cut clip|lower clip|higher conviction|wait for rsi|oversold|etf inflow|funding|accumulate more|clip size)\b/i;

function dayEt(d = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}

function loadDaily(): ForumDaily | null {
  if (typeof window !== "undefined") return null;
  for (const p of PATHS) {
    try {
      const raw = JSON.parse(readFileSync(p, "utf8")) as ForumDaily;
      if (raw?.dayEt && typeof raw.summary === "string") return raw;
    } catch {
      /* missing */
    }
  }
  return null;
}

function saveDaily(row: ForumDaily) {
  if (typeof window !== "undefined") return;
  const body = JSON.stringify(row);
  for (const p of PATHS) {
    try {
      if (p.startsWith("/workspace/data")) mkdirSync("/workspace/data", { recursive: true });
      writeFileSync(p, body);
    } catch {
      /* preview */
    }
  }
}

function titleFrom(body: string) {
  const clean = body.replace(/\s+/g, " ").trim();
  const sentence = clean.split(/(?<=[.!?])\s/)[0] ?? clean;
  const words = sentence.split(" ").slice(0, 10).join(" ");
  const raw = words.length <= 72 ? words : `${words.slice(0, 69).trim()}…`;
  return raw.replace(/[<>]/g, "").slice(0, 72);
}

function analyze(posts: Post[], day: string): ForumDaily {
  const now = Date.now();
  const window = posts.filter((p) => {
    const t = Date.parse(p.at);
    return Number.isFinite(t) && now - t < 86_400_000;
  });
  const pool = window.length ? window : posts.slice(0, 40);
  const kinds: Record<string, number> = {};
  for (const p of pool) kinds[p.kind] = (kinds[p.kind] ?? 0) + 1;
  const kindLine = Object.entries(kinds)
    .sort((a, b) => b[1] - a[1])
    .map(([k, n]) => `${k} ${n}`)
    .join(" · ");
  const suggestions: MandateSuggestion[] = [];
  const seen = new Set<string>();
  for (const p of pool) {
    if (!IMPROVE.test(p.body)) continue;
    const title = titleFrom(p.body);
    const key = title.toLowerCase();
    if (seen.has(key) || title.length < 8) continue;
    seen.add(key);
    suggestions.push({
      title,
      detail: p.body.slice(0, 220),
      from: p.name,
      kind: p.kind,
    });
    if (suggestions.length >= 8) break;
  }
  const summary =
    pool.length === 0
      ? "No W1S3 0WL$ posts in the last 24h. Forum is LIVE with open registration. Mandate unchanged: accumulate bitcoin, never sell, never short."
      : `Daily W1S3 0WL$ analysis for ${day} ET. ${pool.length} post${pool.length === 1 ? "" : "s"} in the window. Speakers: ${kindLine || "none"}. They discussed how to help 7-B0T and GM fill the accumulate-only mandate. Auto trade stays LOCKED.`;
  return {
    dayEt: day,
    analyzedAt: new Date().toISOString(),
    postsAnalyzed: pool.length,
    summary,
    suggestions,
  };
}

/** First GET of the ET day freezes the analysis until the next America/New_York date. */
export function forumDailyPublic(posts: Post[]): ForumDaily {
  const day = dayEt();
  const cached = loadDaily();
  if (cached && cached.dayEt === day) return cached;
  const built = analyze(posts, day);
  saveDaily(built);
  return built;
}
