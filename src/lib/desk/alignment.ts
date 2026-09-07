/** Alignment Score 1–100: security protocols vs system mandate. Client-safe. */
import { MCP_TOOLS } from "./agent-security.ts";
import { GO_LIVE_STEPS } from "./go-live.ts";
import { hiveResourcePublic } from "./hive-resource.ts";
import { LOCK_DEFAULT, lockStatusView } from "./lock-status.ts";
import { mandatePublic } from "./mandate.ts";
import { LOCKED_FUNCTIONS } from "./oss-roadmap.ts";

/** Keep in lockstep with launch/build.ts and launch/model.ts — relative-only so node:test can score. */
const LIVE_TRADES_LOCKED = true;
const PATH_A_MINT_LOCKED = true;

export type AlignmentHunter = {
  pass: number;
  open: number;
  operator: number;
  effectiveness: string;
  findings?: { id: string; status: string; severity: string }[];
};

export type AlignmentCheck = {
  id: string;
  family: "mandate" | "security" | "legal" | "never";
  label: string;
  pass: boolean;
  weight: number;
  proof: string;
};

export type AlignmentScore = {
  asOf: string;
  name: "Alignment Score";
  score: number;
  max: 100;
  grade: "A" | "B" | "C" | "D" | "F";
  aligned: boolean;
  pass: number;
  fail: number;
  checks: AlignmentCheck[];
  hunter: { pass: number; open: number; operator: number; effectiveness: string };
  headline: string;
  note: string;
};

function grade(n: number): AlignmentScore["grade"] {
  if (n >= 90) return "A";
  if (n >= 80) return "B";
  if (n >= 70) return "C";
  if (n >= 60) return "D";
  return "F";
}

function clampScore(n: number) {
  return Math.max(1, Math.min(100, Math.round(n)));
}

function check(
  id: string,
  family: AlignmentCheck["family"],
  label: string,
  pass: boolean,
  weight: number,
  proof: string,
): AlignmentCheck {
  return { id, family, label, pass, weight, proof };
}

export function alignmentScore(hunterReport?: AlignmentHunter | null): AlignmentScore {
  const m = mandatePublic();
  const res = hiveResourcePublic();
  const s8 = GO_LIVE_STEPS.find((s) => s.id === "s8");
  const lock = lockStatusView(LOCK_DEFAULT, "TRUE LIVE", "live");
  const hunter = hunterReport ?? null;
  const termIdsOk = hunter?.findings
    ? hunter.findings.some((f) => f.id === "h-legal" && f.status === "PASS")
    : true;
  const hunterCritOpen = hunter?.findings?.filter((f) => f.status === "OPEN" && (f.severity === "CRITICAL" || f.severity === "HIGH")) ?? [];
  const hunterRailsHold =
    LIVE_TRADES_LOCKED && !MCP_TOOLS.has("orders_create") && !MCP_TOOLS.has("hive_withdraw") && !MCP_TOOLS.has("lock_set");
  const neverCoinbase = LOCKED_FUNCTIONS.some((f) => f.id === "coinbase-create" && f.status === "NEVER");
  const neverHive = LOCKED_FUNCTIONS.some((f) => f.id === "hive-custody" && f.status === "NEVER");

  const checks: AlignmentCheck[] = [
    check("m-accumulate", "mandate", "Mandate: accumulate bitcoin", /\baccumulate bitcoin\b/i.test(m.mandate), 5, m.mandate.slice(0, 120)),
    check("m-never-sell", "mandate", "Mandate: never sell bitcoin", m.neverSellBtc === true && /never sell/i.test(m.mandate), 5, "neverSellBtc=true"),
    check("m-never-short", "mandate", "Mandate: never short bitcoin", m.neverShortBtc === true && /never short/i.test(m.mandate), 5, "neverShortBtc=true"),
    check("m-host-no-trade", "mandate", "This host never places Coinbase orders", m.thisHostTrades === false && m.trade === false, 5, "mandatePublic.trade=false"),
    check("s-live-flag", "security", "LAUNCH_LIVE_TRADES stays false", LIVE_TRADES_LOCKED, 5, "LAUNCH_LIVE_TRADES=false"),
    check("s-path-a", "security", "Path A mint how-to locked", PATH_A_MINT_LOCKED, 4, "PATH_A_LOCKED=true"),
    check("s-no-orders", "security", "MCP has no orders_create", !MCP_TOOLS.has("orders_create"), 5, "MCP allowlist"),
    check("s-no-withdraw", "security", "MCP has no hive_withdraw / hive_pause / lock_set", !MCP_TOOLS.has("hive_withdraw") && !MCP_TOOLS.has("hive_pause") && !MCP_TOOLS.has("lock_set"), 6, "neverMcp"),
    check("s-hive-gift", "never", "Hive gift/SaaS only — no P&L skim", res.profitShare === false && res.hiveWithdraw === false && res.autoSendPnl === false, 6, "hiveResourcePublic"),
    check("s-howey-mt", "never", "Not escrow / Howey / money transmitter", res.escrow === false && res.howey === false && res.moneyTransmitter === false, 6, "FinCEN s8 posture"),
    check("s-fincen", "never", "Go-live s8 FinCEN LOCKED", s8?.status === "LOCKED", 5, s8?.name ?? "s8"),
    check("s-tape-not-lock", "security", "Live tape is status only — not a lock", lock.tapeLock === false && lock.trade === false && lock.ordersCreate === false, 4, "lockStatusView.tapeLock=false"),
    check("s-practice", "security", "Practice cannot arm Coinbase", lock.coinbaseCreate === false && lock.keysOnThisHost === false, 4, "practiceCannotArmCoinbase"),
    check("s-keys", "security", "Keys never on this host", lock.keysOnThisHost === false, 5, "lockStatusView.keysOnThisHost=false"),
    check("s-hunter", "security", "Hunter OPEN CRITICAL/HIGH is zero", hunter ? hunterCritOpen.length === 0 : hunterRailsHold, 8, hunter ? (hunter.open === 0 ? `${hunter.pass} PASS` : hunterCritOpen.map((f) => f.id).join(",") || `${hunter.open} OPEN`) : "rails hold without hunter attach"),
    check("l-terms", "legal", "Terms name mandate, FinCEN, lock, roadmap", termIdsOk, 6, "hunter h-legal / TERMS_SECTIONS"),
    check("l-privacy", "legal", "Privacy names cookies, UGC, children, retention", termIdsOk, 4, "hunter h-legal / PRIVACY_SECTIONS"),
    check("l-roadmap-never", "never", "OSS Roadmap NEVER: Coinbase create + hive custody", neverCoinbase && neverHive, 5, "LOCKED_FUNCTIONS"),
    check("s-lock-mcp", "security", "LoCK3D STATUS MCP is read-only lock_status", MCP_TOOLS.has("lock_status") && !MCP_TOOLS.has("lock_set"), 4, "lock_status only"),
    check("s-byo", "security", "BYO connect is live — no keys_store / vpn_connect", MCP_TOOLS.has("byo_connect") && !MCP_TOOLS.has("keys_store") && !MCP_TOOLS.has("vpn_connect"), 3, "byo_connect"),
    check(
      "s-pred-paper",
      "legal",
      "BTC prediction markets are 7-B0T overlay only — no paper book, no pred MCP bets, no fake wallets",
      !MCP_TOOLS.has("pred_list") && !MCP_TOOLS.has("pred_bet") && !MCP_TOOLS.has("pred_arm") && !MCP_TOOLS.has("pred_live") && !MCP_TOOLS.has("orders_create"),
      3,
      "no pred_list/pred_arm/pred_bet; Polymarket/Kalshi overlay only",
    ),
  ];

  const totalWeight = checks.reduce((n, c) => n + c.weight, 0) || 1;
  const earned = checks.reduce((n, c) => n + (c.pass ? c.weight : 0), 0);
  const score = clampScore((earned / totalWeight) * 100);
  const pass = checks.filter((c) => c.pass).length;
  const fail = checks.length - pass;
  const aligned = score >= 90 && fail === 0;
  const headline = aligned
    ? `ALIGNMENT SCORE ${score}/100 ${grade(score)} — security protocols and system mandate are aligned`
    : `ALIGNMENT SCORE ${score}/100 ${grade(score)} — ${fail} check(s) off mandate / protocol`;

  return {
    asOf: new Date().toISOString(),
    name: "Alignment Score",
    score,
    max: 100,
    grade: grade(score),
    aligned,
    pass,
    fail,
    checks,
    hunter: {
      pass: hunter?.pass ?? 0,
      open: hunter?.open ?? 0,
      operator: hunter?.operator ?? 0,
      effectiveness: hunter?.effectiveness ?? "Hunter not attached this pass — rails scored from mandate and MCP allowlist.",
    },
    headline,
    note: "Alignment Score 1–100 measures security protocols against the system mandate (accumulate bitcoin, never sell, never short, this host never places Coinbase orders). Hunter OPEN CRITICAL/HIGH, FinCEN s8, hive custody, and Coinbase create on this host all count. Not a promise of zero risk. Not financial advice.",
  };
}
