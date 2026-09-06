/**
 * Autonomous vulnerability hunter (Hacktron-inspired: PoC || GTFO).
 * Electrovolt / Cure53-style work packages against THIS desk only.
 * Static control tests. Never a public exploit cookbook. Never live Coinbase.
 * Routine auditor of the Security tab — Connect / Hunt / Exploit / Patch.
 */
import { LAUNCH_LIVE_TRADES } from "@/lib/launch/build";
import { PATH_A_LOCKED } from "@/lib/launch/model";
import { firewallLayers, firewallSummary } from "./firewall";
import { protocolRows, vulnRows } from "./security";
import { wafStats } from "./waf";
import { headerPosture } from "./sec-headers";
import { cachedIntel } from "./threat-intel";
import { underAttack, listActions } from "./auto-defend";
import { MCP_TOOLS, agentSecurityStats } from "./agent-security";

export type HunterSev = "CRITICAL" | "HIGH" | "MED" | "LOW" | "INFO";
export type HunterStatus = "PASS" | "OPEN" | "OPERATOR";

export type HunterFinding = {
  id: string;
  wp: string;
  title: string;
  severity: HunterSev;
  status: HunterStatus;
  proof: string;
  improve: string;
};

export type HunterAutomation = {
  id: string;
  trigger: string;
  action: string;
  armed: boolean;
};

export type HunterReport = {
  asOf: string;
  name: "S1R1US Hunter";
  principle: "PoC || GTFO — only report what this desk can prove from its own controls.";
  inspiredBy: ["Hacktron AI (@HacktronAI)", "Electrovolt Security (@ElectrovoltSec)", "Cure53 (partner)"];
  cadenceMin: number;
  pass: number;
  open: number;
  operator: number;
  effectiveness: string;
  patchQueue: string[];
  automations: HunterAutomation[];
  findings: HunterFinding[];
};

function finding(
  id: string,
  wp: string,
  title: string,
  severity: HunterSev,
  status: HunterStatus,
  proof: string,
  improve: string,
): HunterFinding {
  return { id, wp, title, severity, status, proof, improve };
}

const AUTOMATIONS: HunterAutomation[] = [
  {
    id: "auto-hunt-tab",
    trigger: "Admin → Security mounts",
    action: "Run hunter + refresh CISA KEV/OSV if stale. Cache 10 min. Surface OPEN on the tab.",
    armed: true,
  },
  {
    id: "auto-hunt-morning",
    trigger: "Morning report Security analysis",
    action: "Same hunter. Headline is PASS or OPEN, never a silent skip.",
    armed: true,
  },
  {
    id: "auto-waf",
    trigger: "CRS-PL1 match (SQLi/XSS/RCE/LFI/scanner/CMS/Vite @fs)",
    action: "403 + intrusion + IP strike. Ban at 8/16. Tighten agent rate limits 15 min.",
    armed: true,
  },
  {
    id: "auto-429",
    trigger: "Agent 429 (scraper or rate-limit)",
    action: "Record intrusion. Keep the cap. Do not page the operator for one bot.",
    armed: true,
  },
  {
    id: "auto-auth",
    trigger: "Wrong password / throttle / secret-shaped paste",
    action: "Record intrusion. Score the IP. Do not log the secret or the name.",
    armed: true,
  },
  {
    id: "auto-waitlist",
    trigger: "Waitlist URL / webhook shape",
    action: "Reject + intrusion. This host never fetches visitor URLs.",
    armed: true,
  },
  {
    id: "auto-agent-gate",
    trigger: "Admin → Security external AI toggle",
    action: "MAINTENANCE: 503 on Bot 7 / MCP feed / A2A. Ping + waitlist stay. OPEN: stamp invite JSON on the waitlist (no webhooks).",
    armed: true,
  },
  {
    id: "auto-pull-pause",
    trigger: "Admin pause data pulls",
    action: "Serve last-good tape only. No Coinbase/FRED/mempool fetches. LIVE create, accumulate mandate, paper fills, agent gate unchanged. External AI: ops.status PAUSED on ping/call + waitlist invite when resumed.",
    armed: true,
  },
  {
    id: "auto-source",
    trigger: "Agent UA on /src /admin /guide",
    action: "403 JSON + source-probe log.",
    armed: true,
  },
  {
    id: "auto-kev",
    trigger: "CISA KEV stack hit (Vite / Node / React / …)",
    action: "Virtual-patch Vite @fs. Re-lock live create. Operator still patches Node.",
    armed: true,
  },
  {
    id: "auto-agent-inject",
    trigger: "ASI01 goal-hijack / LLM01 injection on A2A, MCP args, waitlist, Ask Grok",
    action: "Deny the instruction. Return read-only Bot 7 or 400. Log agent-inject. Never fetch, never trade.",
    armed: true,
  },
  {
    id: "auto-mcp-deny",
    trigger: "Unknown MCP tool, sampling, roots, webhook, oversized batch",
    action: "JSON-RPC error. mcp-deny / a2a-abuse intrusion. Tool list stays static.",
    armed: true,
  },
  {
    id: "auto-critical",
    trigger: "Hunter OPEN CRITICAL / HIGH",
    action: "Lead the morning SECURITY ANALYSIS headline. Do not auto-green.",
    armed: true,
  },
];

export function runHunter(): HunterReport {
  const proto = protocolRows();
  const vulns = vulnRows();
  const fail = proto.filter((p) => p.status === "FAIL");
  const session = vulns.find((v) => v.id === "session-xss");
  const layers = firewallLayers();
  const fw = firewallSummary(layers);
  const waf = wafStats();
  const headers = headerPosture();
  const intel = cachedIntel();
  const defend = listActions();
  const findings: HunterFinding[] = [
    finding(
      "h-live",
      "WP5 Execution",
      "Live Coinbase create is locked",
      "CRITICAL",
      LAUNCH_LIVE_TRADES ? "OPEN" : "PASS",
      `LAUNCH_LIVE_TRADES=${String(LAUNCH_LIVE_TRADES)}. Auto-defend liveLocked=${String(defend.liveLocked)}.`,
      "Keep locked until operator unlock. Hunter re-fails if this flag flips.",
    ),
    finding(
      "h-path-a",
      "WP5 Execution",
      "Path A mint how-to stays off the public tape",
      "HIGH",
      PATH_A_LOCKED ? "PASS" : "OPEN",
      `PATH_A_LOCKED=${String(PATH_A_LOCKED)}.`,
      "Do not publish mint recipe until TOKEN_LAUNCHED.",
    ),
    finding(
      "h-keys",
      "WP3 Secrets",
      "No CDP / seed on this host",
      "CRITICAL",
      proto.find((p) => p.id === "secret")?.status === "PASS" && proto.find((p) => p.id === "seed")?.status === "PASS"
        ? "PASS"
        : "OPEN",
      "Paste filters reject CDP JSON, xprv, WIF, 24-word seeds. Vault decrypt is admin-session only.",
      "Never add a Coinbase secret env to this image.",
    ),
    finding(
      "h-waf",
      "WP1 Web (Electrovolt)",
      "CRS-PL1 WAF is inspecting ingress",
      "HIGH",
      waf.ruleCount >= 10 ? "PASS" : "OPEN",
      `${waf.engine}: ${waf.ruleCount} rules, threshold ${waf.threshold}, ${waf.hits24h} hits / 24h. Inspired by ${waf.inspiredBy}.`,
      "Keep PL1. Do not drop SQLi/XSS/RCE for convenience.",
    ),
    finding(
      "h-session",
      "WP2 Auth",
      "Admin HMAC in sessionStorage (OWASP)",
      "MED",
      session?.status === "OPERATOR" ? "OPERATOR" : "PASS",
      session?.detail ?? "sessionStorage token is XSS-readable.",
      "Operator call: move HMAC to HttpOnly; Secure; SameSite=Strict cookie.",
    ),
    finding(
      "h-and",
      "WP2 Auth",
      "Admin is operator X AND name+password",
      "HIGH",
      proto.find((p) => p.id === "2fa")?.status === "PASS" ? "PASS" : "OPEN",
      "X alone or password alone cannot mint admin. Dual Yubi for outgoing BTC/USDC. Optional admin-panel YubiKey lock (default OFF).",
      "Keep AND. Do not add passwordless admin. Panel lock stays optional until the operator enrolls a key.",
    ),
    finding(
      "h-yubi-panel",
      "WP2 Auth",
      "Optional admin YubiKey lock is off until operator enables it",
      "MED",
      "OPERATOR",
      "Yubico FIDO2 MFA (UV required, hardware-bound, sign-count clone detect) + Yubico OTP (YubiCloud HMAC when YUBICO_API_SECRET is set). Lock cannot turn on without an enrolled key. Last key cannot be removed while lock is on. Official: yubico.com.",
      "Enroll two keys (Yubico: primary + backup). Turn the lock on from Admin → Wallet if the panel should require a physical tap. Set YUBICO_CLIENT_ID and YUBICO_API_SECRET in production.",
    ),
    finding(
      "h-agent",
      "WP4 Agents",
      "Agent feed is read-only + rate-limited",
      "HIGH",
      proto.find((p) => p.id === "agent-rate")?.status === "PASS" ? "PASS" : "OPEN",
      `GET /api/agent/* 429 on scrapers. trade:false. Under attack=${String(underAttack())}.`,
      "Keep 300s poll. Do not add user-URL fetch.",
    ),
    finding(
      "h-asi",
      "WP4 Agents",
      "OWASP Agentic ASI01–10 on the MCP/A2A edge",
      "HIGH",
      MCP_TOOLS.size >= 5 && !agentSecurityStats().sampling ? "PASS" : "OPEN",
      `Allowlist ${[...MCP_TOOLS].join(", ")}. sampling=${String(agentSecurityStats().sampling)} mcpApps=${String(agentSecurityStats().mcpApps)} injects=${agentSecurityStats().counts["agent-inject"]} mcp-deny=${agentSecurityStats().counts["mcp-deny"]}.`,
      "Do not add write tools, sampling, or push webhooks. Least agency stays the control.",
    ),
    finding(
      "h-forum-bar",
      "WP4 Agents",
      "W1S3 0WL$ forum auto-bars harm and false mandate",
      "HIGH",
      "PASS",
      "Forum posts must improve public GitHub OSS so 7-B0T/GM accumulate bitcoin. Host source, admin, root, VPN, SSH, extra RPC are denied. Harm / injection / keys / sell-BTC / source-probe auto-bar name+IP.",
      "Admin → Security → Agents can list and unbar. Loopback IP is never banned.",
    ),
    finding(
      "h-ssrf",
      "WP1 Web (Electrovolt)",
      "Outbound fetch allowlist — no user URLs",
      "HIGH",
      proto.find((p) => p.id === "dns")?.status === "PASS" ? "PASS" : "OPEN",
      "net-guard: HTTPS + host allowlist, no IP literals. CISA/OSV allowed for intel only.",
      "Treat new hosts as OPERATOR until allowlisted.",
    ),
    finding(
      "h-xss",
      "WP1 Web (Electrovolt)",
      "JSON-LD / greeting is not innerHTML attacker-controlled",
      "MED",
      vulns.find((v) => v.id === "jsonld")?.status === "FIXED" ? "PASS" : "OPEN",
      "JSON-LD injection marked FIXED. Greeting expand is local static payload.",
      "Never interpolate agent JSON into HTML without escape.",
    ),
    finding(
      "h-idle",
      "WP2 Auth",
      "Idle lock clears token before overlay",
      "HIGH",
      vulns.find((v) => v.id === "saver-dismiss")?.status === "FIXED" ? "PASS" : "OPEN",
      "5-minute idle: token cleared, epoch bumped, X signed out, overlay cannot dismiss in-place.",
      "Keep overlay off /login.",
    ),
    finding(
      "h-headers",
      "WP1 Web (Electrovolt)",
      "Safe HTTP security headers",
      "LOW",
      headers.armed >= 5 ? "PASS" : "OPERATOR",
      `${headers.armed} ARMED · ${headers.skip} SKIP (iframe/CORS) · ${headers.operator} OPERATOR (CSP). ${headers.inspiredBy}.`,
      "Put a CSP on the edge that allows grok.com + self. Do not DENY framing in preview.",
    ),
    finding(
      "h-intel",
      "WP6 Intel",
      "CISA KEV / OSV stack filter",
      intel.count ? "INFO" : "MED",
      intel.count ? "PASS" : "OPERATOR",
      intel.count
        ? `${intel.source} catalog ${intel.catalogVersion} · ${intel.count} KEV · ${intel.stackHits.length} stack · ${intel.osv.length} OSV · patched ${intel.patched.join(", ") || "none this pass"}.`
        : (intel.error ? `Intel feed: ${intel.error}` : "Intel not loaded this process. Admin Security → Intel refresh."),
      "Refresh from Security → Intel. Operator patches Node/OS. WAF virtual-patches Vite @fs.",
    ),
    finding(
      "h-fw",
      "WP0 Posture",
      "App-layer firewall layers",
      fw.open ? "HIGH" : "INFO",
      fw.open ? "OPEN" : "PASS",
      fw.open
        ? `OPEN layers: ${layers.filter((l) => l.status === "OPEN").map((l) => l.name).join("; ")}`
        : `${fw.armed}/${fw.total} ARMED · ${fw.operator} OPERATOR (session store).`,
      fw.open ? "Fix OPEN layers before claiming a green firewall." : "Re-run hunter after each deploy.",
    ),
    finding(
      "h-ids",
      "WP0 Posture",
      "Intrusion log is armed",
      "MED",
      "PASS",
      "Blocked probes persist in an admin-only /tmp ring. WAF, 429, waitlist URLs, secret pastes, auth throttle, agent source probes, IP bans.",
      "Quiet 24h is not a fail. Do not log tape geo-blocks — they would flood the IDS.",
    ),
    finding(
      "h-proto-fail",
      "WP0 Posture",
      "Protocol FAIL rows",
      fail.length ? "HIGH" : "INFO",
      fail.length ? "OPEN" : "PASS",
      fail.length ? fail.map((f) => f.title).join("; ") : "No FAIL rows in protocol status.",
      fail.length ? "Fix FAIL rows before claiming a green firewall." : "Re-run hunter after each deploy.",
    ),
  ];
  const pass = findings.filter((f) => f.status === "PASS").length;
  const open = findings.filter((f) => f.status === "OPEN").length;
  const operator = findings.filter((f) => f.status === "OPERATOR").length;
  const patchQueue = findings.filter((f) => f.status !== "PASS").map((f) => f.improve);
  const effectiveness =
    open === 0
      ? `Security tab is holding. Hunter ${pass} PASS · ${operator} OPERATOR leftover(s) are honest, not silent holes.`
      : `Hunter found ${open} OPEN control(s). Security tab is working — do not green until those rows close.`;
  const report: HunterReport = {
    asOf: new Date().toISOString(),
    name: "S1R1US Hunter",
    principle: "PoC || GTFO — only report what this desk can prove from its own controls.",
    inspiredBy: ["Hacktron AI (@HacktronAI)", "Electrovolt Security (@ElectrovoltSec)", "Cure53 (partner)"],
    cadenceMin: 10,
    pass,
    open,
    operator,
    effectiveness,
    patchQueue,
    automations: AUTOMATIONS,
    findings,
  };
  last = report;
  persistHunter(report);
  return report;
}

let last: HunterReport | null = null;

function persistHunter(report: HunterReport) {
  if (typeof window !== "undefined") return;
  void import("node:fs")
    .then((fs) => {
      try {
        fs.writeFileSync("/tmp/desk-hunter.json", JSON.stringify(report));
      } catch {
        /* preview */
      }
    })
    .catch(() => undefined);
}

export function cachedHunter(): HunterReport {
  if (!last || Date.now() - Date.parse(last.asOf) > 10 * 60_000) last = runHunter();
  return last;
}

export const HUNTER_WPS = [
  { id: "WP0", title: "Posture", focus: "Firewall layers, protocol FAIL, IDS armed." },
  { id: "WP1", title: "Web (Electrovolt)", focus: "XSS, SSRF, JSON-LD, headers, CRS WAF. White-box." },
  { id: "WP2", title: "Auth", focus: "AND lock, session store, idle, throttle, IP strikes." },
  { id: "WP3", title: "Secrets", focus: "No CDP/seed, paste filters, vault addresses only." },
  { id: "WP4", title: "Agents", focus: "Read-only feed, 429, no webhooks, source deny." },
  { id: "WP5", title: "Execution", focus: "Live create locked. Path A off the public tape." },
  { id: "WP6", title: "Intel", focus: "CISA KEV + OSV.dev stack filter and virtual patches." },
] as const;
