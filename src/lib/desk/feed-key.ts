import { createHash } from "node:crypto";
import { FEED_KEY_HEADER, FEED_KEY_PREFIX } from "./feed-plans";

export { FEED_KEY_HEADER, FEED_KEY_PREFIX, FEED_PLANS, feedPlansPublic } from "./feed-plans";
export type { FeedPlanId } from "./feed-plans";

function sha256hex(s: string) {
  return createHash("sha256").update(s).digest("hex");
}

/** Operator sets BOT7_FEED_KEY_HASHES to comma-separated sha256 hex of full keys. Never commit raw keys. */
export function configuredFeedHashes(): Set<string> {
  const raw = process.env.BOT7_FEED_KEY_HASHES ?? "";
  return new Set(
    raw
      .split(/[\s,]+/)
      .map((h) => h.trim().toLowerCase())
      .filter((h) => /^[a-f0-9]{64}$/.test(h)),
  );
}

export function extractFeedKey(request: Request): string | null {
  const named = request.headers.get(FEED_KEY_HEADER)?.trim();
  if (named) return named;
  const auth = request.headers.get("authorization")?.trim() ?? "";
  const m = /^Bearer\s+(\S+)/i.exec(auth);
  if (m?.[1]?.startsWith(FEED_KEY_PREFIX)) return m[1];
  return null;
}

export function feedKeyAccepted(request: Request): boolean {
  const key = extractFeedKey(request);
  if (!key || !key.startsWith(FEED_KEY_PREFIX) || key.length < 20) return false;
  const hashes = configuredFeedHashes();
  if (hashes.size === 0) return false;
  return hashes.has(sha256hex(key));
}
