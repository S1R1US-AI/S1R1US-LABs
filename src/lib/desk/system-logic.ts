import { LAUNCH_BUILD } from "@/lib/launch/build";
import { ROADMAP, ROADMAP_TOTAL } from "@/lib/launch/model";
import { BOT_ROSTER, CYCLE_ARCH, RISK_RULES, SYSTEM_REVIEWED } from "./policy";
import { heliosCall, runBots } from "./signal";
import type { BotBrief, DeskSnapshot, HeliosCall } from "./types";

export const MANDATE = [
  "1. Maximize bitcoin accumulation.",
  "2. Never sell bitcoin. Never short. Stops block add-on buys — they do not dump BTC.",
  "3. Minimize bitcoin loss. Never chase crowded longs.",
  "4. Continuous ops: honest error analysis, architecture and security review. Never green a failure without a verified fallback. Daily 07:30 America/New_York report in Admin Console for system and copy-admin. As-live sim auto-pauses 07:00 ET.",
] as const;

/** One object for the fund tape, Coin tab, and s1r1us.ai — rebuilt on every live tape pull. */
export function systemView(snap: DeskSnapshot | null, navUsd = 1000): {
  reviewed: string;
  launch: string;
  fetchedAt: string | null;
  briefs: BotBrief[];
  call: HeliosCall | null;
  roster: typeof BOT_ROSTER;
  stops: typeof RISK_RULES;
  cycle: typeof CYCLE_ARCH;
  roadmap: { n: number; name: string; minUsd: number; maxUsd: number }[];
  roadmapTotal: [number, number];
} {
  const briefs = snap ? runBots(snap) : [];
  const call = snap ? heliosCall(snap, briefs, navUsd) : null;
  return {
    reviewed: SYSTEM_REVIEWED,
    launch: LAUNCH_BUILD,
    fetchedAt: snap?.fetchedAt ?? null,
    briefs,
    call,
    roster: BOT_ROSTER,
    stops: RISK_RULES,
    cycle: CYCLE_ARCH,
    roadmap: ROADMAP.map((m) => ({ n: m.n, name: m.name, minUsd: m.minUsd, maxUsd: m.maxUsd })),
    roadmapTotal: ROADMAP_TOTAL,
  };
}
