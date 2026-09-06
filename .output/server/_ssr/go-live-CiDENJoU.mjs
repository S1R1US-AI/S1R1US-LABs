//#region node_modules/.nitro/vite/services/ssr/assets/go-live-CiDENJoU.js
/** Go-live path — begins 2026-09-05. Practice AUTO and agent read first. Live Coinbase create stays locked. */
var GO_LIVE_START = "2026-09-05";
var GO_LIVE = [
	{
		id: "gl0",
		n: 0,
		name: "PoC rails",
		when: "TODAY 2026-09-05",
		status: "STARTED",
		goal: "N3W Web App Installation Build (new theme) DEPLOY #68 is the desk. Rate-limit /api/agent/*, hard-cache Bot 7 JSON, BYO xAI compute, Bot 7 HTTP SaaS key spec. AI agents (Grok, Claude, GPT) start at /agent and /llms.txt. Go-live waitlist: POST /api/agent/waitlist then poll live/goLive (no webhooks). One DigitalOcean production app. No GPU.",
		hold: "This host never places Coinbase orders. Public tree stays --dry-run. Admin / Yubi / vault stay off the OSS how-to."
	},
	{
		id: "gl1",
		n: 1,
		name: "Auto GM / Bot 7 call board",
		when: "TODAY 2026-09-05",
		status: "STARTED",
		goal: "G0DZ1LLa M0D3 AUTO and Bot 7 AUTO show would-accumulate calls on the live tape (bots 1–6 + 7-B0T + GM). Paper fills are off. Coinbase create stays off.",
		hold: "LIVE_UNLOCKED remains false. No Coinbase create from this app. No paper book fills."
	},
	{
		id: "gl2",
		n: 2,
		name: "Auto AI agent access",
		when: "After the live call board is honest",
		status: "QUEUED",
		goal: "Signed agents poll Bot 7 (300s or SaaS key). They run Coinbase for Agents on their account. Optional BYO Grok grades the same snapshot.",
		hold: "Read-only on this host. Keys never here. Copycats get a dashboard and a formula, not the BTC book."
	},
	{
		id: "gl3",
		n: 3,
		name: "Auto trade mode",
		when: "Operator unlock only",
		status: "LOCKED",
		goal: "Operator arms live. Create stays on the operator’s Coinbase CLI/MCP. Agents still cannot create on this host.",
		hold: "Human-in-the-loop + dual Yubi for outgoing. This website does not grow a GPU farm."
	}
];
var GO_LIVE_HEADLINE = `GO-LIVE PATH STARTED ${GO_LIVE_START} — PoC rails + Auto GM/Bot 7 would-accumulate call board STARTED. DEPLOY #68. Live tape on. Paper fills off. Coinbase create LOCKED.`;
function goLiveBrief() {
	const now = [...GO_LIVE].reverse().find((p) => p.status === "STARTED") ?? GO_LIVE[0];
	const next = GO_LIVE.find((p) => p.status === "NEXT" || p.status === "QUEUED") ?? null;
	return {
		asOf: (/* @__PURE__ */ new Date()).toISOString(),
		start: GO_LIVE_START,
		headline: GO_LIVE_HEADLINE,
		now: {
			id: now.id,
			name: now.name,
			status: now.status,
			goal: now.goal
		},
		next: next ? {
			id: next.id,
			name: next.name,
			status: next.status,
			goal: next.goal
		} : null,
		liveTrades: false,
		thisHostCreates: false,
		phases: GO_LIVE
	};
}
//#endregion
export { goLiveBrief as i, GO_LIVE_HEADLINE as n, GO_LIVE_START as r, GO_LIVE as t };
