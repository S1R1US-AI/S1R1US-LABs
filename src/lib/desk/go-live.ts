/** Go-live path — begins 2026-09-05. Practice AUTO and agent read first. Live Coinbase create stays locked. */

export const GO_LIVE_START = "2026-09-05";

export type GoLivePhase = {
  id: string;
  n: number;
  name: string;
  when: string;
  status: "STARTED" | "NEXT" | "QUEUED" | "LOCKED";
  goal: string;
  hold: string;
};

export const GO_LIVE: GoLivePhase[] = [
  {
    id: "gl0",
    n: 0,
    name: "PoC rails",
    when: "TODAY 2026-09-05",
    status: "STARTED",
    goal: "N3W Web App Installation Build (new theme) DEPLOY #68 is the desk. Rate-limit /api/agent/*, hard-cache Bot 7 JSON, BYO xAI compute, Bot 7 HTTP SaaS key spec. AI agents (Grok, Claude, GPT) start at /agent and /llms.txt. W1S3 0WL$ Forum is LIVE. R0B0T$ ACT1VAT3 (/r0b0ts) invites software developers and W1S3 0WL$ to improve public GitHub OSS, iOS, and Google Play (DM @S1R1US_AI). Go-live notices: POST /api/agent/waitlist {name, kind, mandate:true} then poll /api/agent/notices (no webhooks). Admin Security can pause pulls or close the AI gate (ops.status PAUSED/MAINTENANCE on ping). Morning report: 14-day admin library, 3 shown, PDF in browser. FAQ documents visitor / admin / AI agent. Sitemap index + XML + video. One DigitalOcean production app. No GPU.",
    hold: "This host never places Coinbase orders. Public tree stays --dry-run. Admin / Yubi / vault stay off the OSS how-to.",
  },
  {
    id: "gl1",
    n: 1,
    name: "Auto GM / Bot 7 call board",
    when: "TODAY 2026-09-05",
    status: "STARTED",
    goal: "G0DZ1LLa M0D3 AUTO and Bot 7 AUTO show would-accumulate calls on the live tape (bots 1–6 + 7-B0T + GM). Paper fills are off. Coinbase create stays off.",
    hold: "LIVE_UNLOCKED remains false. No Coinbase create from this app. No paper book fills.",
  },
  {
    id: "gl2",
    n: 2,
    name: "Auto AI agent access",
    when: "After the live call board is honest",
    status: "QUEUED",
    goal: "Signed agents poll Bot 7 (300s or SaaS key). They run Coinbase for Agents on their account. Optional BYO Grok grades the same snapshot.",
    hold: "Read-only on this host. Keys never here. Copycats get a dashboard and a formula, not the BTC book.",
  },
  {
    id: "gl3",
    n: 3,
    name: "Auto trade mode",
    when: "Operator unlock only",
    status: "LOCKED",
    goal: "Operator arms live. Create stays on the operator’s Coinbase CLI/MCP. Agents still cannot create on this host.",
    hold: "Human-in-the-loop + dual Yubi for outgoing. This website does not grow a GPU farm.",
  },
];

export const GO_LIVE_HEADLINE = `GO-LIVE PATH STARTED ${GO_LIVE_START} — PoC rails + Auto GM/Bot 7 would-accumulate call board STARTED. DEPLOY #68. Live tape on. Paper fills off. Coinbase create LOCKED.`;

export function goLiveBrief() {
  const now = [...GO_LIVE].reverse().find((p) => p.status === "STARTED") ?? GO_LIVE[0]!;
  const next = GO_LIVE.find((p) => p.status === "NEXT" || p.status === "QUEUED") ?? null;
  return {
    asOf: new Date().toISOString(),
    start: GO_LIVE_START,
    headline: GO_LIVE_HEADLINE,
    now: { id: now.id, name: now.name, status: now.status, goal: now.goal },
    next: next ? { id: next.id, name: next.name, status: next.status, goal: next.goal } : null,
    liveTrades: false as const,
    thisHostCreates: false as const,
    phases: GO_LIVE,
  };
}
