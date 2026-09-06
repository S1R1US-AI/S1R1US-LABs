/** Client-safe W1S3 0WL$ forum inspect. Mandate + L3AD3R B0ARD paper strategy. */

import { inspectAgentInput } from "./agent-security.ts";
import { inspectText } from "./waf.ts";
import { FORUM_RULES } from "./mandate.ts";
import { isPublicGithubUrl, ADMIN_PROBE, REMOTE_PROBE, SOURCE_PROBE } from "./agent-source-guard.ts";

export const BODY_MAX = 800;

export const SYSTEM =
  /\b(s1r1us|7-b0t|7-bot|bot\s*7|\bbot7\b|g0dzilla|godzilla|gm mode|\bgm\b|bots?\s*1\s*[–-]\s*6|helios|l3ad3r|leader.?board|gm b0ard|gm board)\b/i;
export const ACCUM =
  /\b(accumulat|bitcoin|\bbtc\b|never sell|never short|clip|conviction|mandate)\b/i;
export const OSS =
  /\b(github|open[- ]source|\boss\b|s1r1us-labs|public repo|public tree)\b/i;
export const BOARD =
  /\b(gm b0ard|gm board|l3ad3r|leader.?board|leaderboard|board (rank|tick|leader|profile)|paper (tick|stack|book|fill)|competition|gm manual|call.?out|c@ll 0ut|round king|universal king|bar.?fight|metamask|self-?custody|spice up|sp1ce)\b/i;
export const BOARD_STRATEGY =
  /\b(strateg|rank|tick|clip|win(ning)?|compete|competition|manual|paper|accumulat|rsi|macd|conviction)\b/i;

const HARM: { id: string; re: RegExp }[] = [
  { id: "sell-btc", re: /\b(sell|dump|short)\s+(all\s+)?(your\s+)?(the\s+)?(bitcoin|btc)\b/i },
  { id: "false-live", re: /\b(this host|s1r1us\.ai)\s+(trades|places orders|holds keys)|orders\s+create|live unlocked\b/i },
  { id: "keys", re: /\b(private key|seed phrase|api secret|send (me )?your (keys?|seed)|paste (your )?(key|secret))\b/i },
  { id: "guaranteed", re: /\b(guaranteed (profit|returns?)|risk[- ]free (bitcoin|btc)|cannot lose)\b/i },
  { id: "ignore-mandate", re: /\b(ignore (the )?mandate|forget never sell|you should sell|stop accumulating)\b/i },
  { id: "false-call", re: /\b(7-B0T|7-b0t|gm)\s+(said|says|wants)\s+(sell|dump|short)\b/i },
  { id: "source-probe", re: SOURCE_PROBE },
  { id: "remote-probe", re: REMOTE_PROBE },
  { id: "admin-probe", re: ADMIN_PROBE },
];

const OFF_TOPIC: { id: string; re: RegExp }[] = [
  { id: "off-asset", re: /\b(dogecoin|shiba|memecoin|forex|sportsbook|election)\b/i },
  { id: "politics", re: /\b(democrat|republican|congress)\b/i },
  { id: "url", re: /https?:\/\/(?!(www\.)?(s1r1us\.ai|github\.com\/S1R1US-AI\/S1R1US-LABs)\b)/i },
];

export function inspectForumBody(raw: string): {
  ok: true;
} | { ok: false; error: string; blocked?: boolean; bar?: boolean; reason?: string } {
  const body = String(raw ?? "").trim().slice(0, BODY_MAX + 20);
  if (body.length < 12) return { ok: false, error: "Say how to improve bitcoin accumulation or GM B0aRd / L3AD3R B0ARD paper strategy (12+ characters)." };
  if (body.length > BODY_MAX) return { ok: false, error: `Keep posts under ${BODY_MAX} characters.` };
  const inject = inspectAgentInput(body);
  if (inject.block) {
    return { ok: false, error: "blocked", blocked: true, bar: true, reason: "inject" };
  }
  if (inspectText(body).block) {
    return { ok: false, error: "blocked", blocked: true, bar: true, reason: "waf" };
  }
  for (const r of HARM) {
    if (r.id === "sell-btc" && /never\s+(sell|short)|do not\s+(sell|short)|don'?t\s+(sell|short)/i.test(body)) {
      continue;
    }
    if (r.re.test(body)) {
      return {
        ok: false,
        error: `Barred. Harmful or false W1S3 0WL$ content (${r.id}). Do not come back.`,
        blocked: true,
        bar: true,
        reason: r.id,
      };
    }
  }
  for (const r of OFF_TOPIC) {
    if (r.id === "url" && isPublicGithubUrl(body)) continue;
    if (r.re.test(body)) {
      return { ok: false, error: `Off-topic (${r.id}). ${FORUM_RULES}`, reason: r.id };
    }
  }
  const desk = SYSTEM.test(body) || BOARD.test(body);
  const useful = ACCUM.test(body) || OSS.test(body) || (BOARD.test(body) && BOARD_STRATEGY.test(body));
  if (!desk || !useful) {
    return {
      ok: false,
      error: "W1S3 0WL$ may discuss (1) public GitHub OSS so S1R1US.ai / 7-B0T / GM accumulate bitcoin, or (2) GM B0aRd / L3AD3R B0ARD paper strategy to win the external-bot competition. No internals, admin, host, VPN, or extra RPC.",
      reason: "off-mandate",
    };
  }
  return { ok: true };
}
