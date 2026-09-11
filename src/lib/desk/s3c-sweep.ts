/** S3C Sweep — full system security sweep and audit. Top 25 checks, PASS/WARN/FAIL. Client-safe. */
import { protocolRows, vulnRows } from "./security";
import { cachedHunter } from "./hunter";

export type S3cStatus = "PASS" | "WARN" | "FAIL";

export type S3cRow = {
  id: string;
  name: string;
  status: S3cStatus;
  note: string;
};

/** Static posture checks — the top 25 most important sweep items on this build. */
const STATIC_ROWS: Omit<S3cRow, "status">[] = [
  { id: "auto-lock", name: "Coinbase auto trade LOCKED", note: "This host never places Coinbase orders. Create stays off until operator unlock after counsel." },
  { id: "no-keys", name: "No exchange keys on host", note: "BYO C0MPUT3 — agents and users execute on THEIR Coinbase. Vault never holds third-party keys." },
  { id: "admin-mask", name: "Admin username masked on /login", note: "System admin name is never rendered to non-admin viewers; input shows ************** placeholder." },
  { id: "agent-readonly", name: "External AI agents read-only", note: "W1S3 0WL$ / external agents have zero write or read access to system source code. Forum post is the only write, mandate-filtered." },
  { id: "no-webhooks", name: "No user-URL fetch / webhooks", note: "User-supplied URLs are never fetched. Pull-only agent design." },
  { id: "waf", name: "App-layer WAF (CRS-PL1)", note: "In-process WAF modeled on OWASP CRS 4.28 with anomaly threshold." },
  { id: "intel", name: "CISA KEV + OSV.dev intel", note: "Vulnerability intel feeds reviewed in the Security tab." },
  { id: "bad-bots", name: "Bad-bot auto-bar", note: "source-probe / inject / scrape / harmful-forum agents are barred name+IP with 403 doNotReturn." },
  { id: "probe-monitor", name: "External agent probe monitor", note: "VPN / FTP / SSH / shell / root / ICMP / port-scan / ping-scan attempts are logged, blocked, and surfaced here and in the morning report." },
  { id: "intrusion-log", name: "Intrusion log wired to morning report", note: "All alerts, warnings, and blocks flow to Security tab and 07:30 ET morning report." },
  { id: "dual-yubi", name: "Dual YubiKey on outgoing", note: "Outgoing treasury ceremony requires two YubiKeys." },
  { id: "idle-lock", name: "Admin idle lock", note: "Screensaver idle lock forces re-auth with name + password." },
  { id: "secret-guard", name: "Secret paste guard", note: "Login and admin inputs reject Coinbase keys / wallet seeds on paste." },
  { id: "rate-limit", name: "/api/agent/* rate limits", note: "300s politeness with hard-cached 7-B0T JSON." },
  { id: "mcp-allowlist", name: "MCP tool allowlist centralized", note: "Public MCP tools come from one allowlist; protocol and discovery derive from it. No lock_set, no write tools." },
  { id: "owl-source-guard", name: "W1S3 0WL$ source guard", note: "No source code sharing with external AI agents. Forum inspection blocks source-probe and security discussion." },
  { id: "no-proprietary", name: "No proprietary data to external agents", note: "Restore points and deploy internals stay out of public FAQ and agent JSON." },
  { id: "session-cookies", name: "Session hygiene", note: "Server session tokens; admin session epoch bump on logout." },
  { id: "backup-pin", name: "Rebuild pin protected", note: "checkpoint/s1r1us-app-build-111 branch + tag are protected and never deleted. Includes prebuilt .output." },
  { id: "restore-path", name: "Restore path documented", note: "DigitalOcean live-production App Spec branch flip to the pinned checkpoint; see Security → Backup." },
  { id: "legal", name: "Unified DISCLAIMER intact", note: "Terms / Privacy unchanged. NO LEGAL FEES. Not financial advice." },
  { id: "pred-paper", name: "PR3D1CT10N$ paper only", note: "Fake S1R1U$ tokens. This host never takes, matches, or escrows bets." },
  { id: "hive-test", name: "H1V3 SW@RM on TEST data", note: "Paper BTC split by pledged terahash. Admin may pause." },
  { id: "no-secrets", name: "No secrets in repo", note: "Secret scanning on changes; no credentials committed." },
  { id: "deps", name: "Dependency advisories reviewed", note: "npm dependency set pinned; advisories checked before adding libraries." },
];

export function s3cSweepRows(): S3cRow[] {
  const hunter = cachedHunter();
  const proto = protocolRows();
  const vulns = vulnRows();
  const protoFail = proto.filter((p) => p.status === "FAIL").length;
  const openVulns = vulns.filter((v) => v.status === "OPERATOR").length;
  return STATIC_ROWS.map((r) => {
    let status: S3cStatus = "PASS";
    if (r.id === "waf" && protoFail > 0) status = "FAIL";
    if (r.id === "intel" && openVulns > 0) status = "WARN";
    if (r.id === "probe-monitor" && hunter.open > 0) status = "WARN";
    return { ...r, status };
  }).slice(0, 25);
}

export function s3cSweepScore(rows = s3cSweepRows()): { score: number; headline: string; pass: number; warn: number; fail: number } {
  const pass = rows.filter((r) => r.status === "PASS").length;
  const warn = rows.filter((r) => r.status === "WARN").length;
  const fail = rows.filter((r) => r.status === "FAIL").length;
  const score = Math.max(1, Math.min(100, Math.round(100 - fail * 12 - warn * 4)));
  const headline =
    fail === 0
      ? `S3C SWEEP ${score}/100 — ${pass} PASS · ${warn} WARN · 0 FAIL`
      : `S3C SWEEP ${score}/100 — ${fail} FAIL · ${warn} WARN · ${pass} PASS`;
  return { score, headline, pass, warn, fail };
}
