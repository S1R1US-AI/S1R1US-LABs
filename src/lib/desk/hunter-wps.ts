/** Client-safe hunter shapes and work-package labels. Findings are served by the admin server functions. */
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

export const HUNTER_WPS = [
  { id: "WP0", title: "Posture", focus: "Firewall layers, protocol FAIL, IDS armed." },
  { id: "WP1", title: "Web (Electrovolt)", focus: "XSS, SSRF, JSON-LD, headers, CRS WAF. White-box." },
  { id: "WP2", title: "Auth", focus: "AND lock, session store, idle, throttle, IP strikes." },
  { id: "WP3", title: "Secrets", focus: "No CDP/seed, paste filters, vault addresses only." },
  { id: "WP4", title: "Agents", focus: "Read-only feed, 429, no webhooks, source deny." },
  { id: "WP5", title: "Execution", focus: "Live create locked. Path A off the public tape." },
  { id: "WP6", title: "Intel", focus: "CISA KEV + OSV.dev stack filter and virtual patches." },
] as const;

/** Empty report shown until the signed-in admin fetch returns. */
export const EMPTY_HUNTER: HunterReport = {
  asOf: new Date(0).toISOString(),
  name: "S1R1US Hunter",
  principle: "PoC || GTFO — only report what this desk can prove from its own controls.",
  inspiredBy: ["Hacktron AI (@HacktronAI)", "Electrovolt Security (@ElectrovoltSec)", "Cure53 (partner)"],
  cadenceMin: 10,
  pass: 0,
  open: 0,
  operator: 0,
  effectiveness: "Sign in to load the report.",
  patchQueue: [],
  automations: [],
  findings: [],
};
