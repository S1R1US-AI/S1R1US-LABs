/**
 * In-process WAF modeled on OWASP CRS 4.28 (paranoia level 1) + Wordfence /
 * Wafris-style request inspection. High-confidence signatures only.
 * Not a full ModSecurity port. Never scans Vite HMR module URLs as LFI.
 */
export type WafSev = "CRITICAL" | "ERROR" | "WARNING" | "NOTICE";
export type WafFamily =
  | "method"
  | "scanner"
  | "protocol"
  | "lfi"
  | "rfi"
  | "rce"
  | "xss"
  | "sqli"
  | "fixation"
  | "log4j"
  | "ssrf"
  | "cms-probe"
  | "vite-fs";

export type WafRule = {
  id: string;
  crs: string;
  family: WafFamily;
  title: string;
  sev: WafSev;
  score: number;
  owasp: string;
};

export type WafHit = {
  at: string;
  ruleId: string;
  family: WafFamily;
  title: string;
  sev: WafSev;
  score: number;
  path: string;
  ip: string;
  ua: string;
};

export type WafVerdict = {
  block: boolean;
  anomaly: number;
  threshold: number;
  matches: { rule: WafRule; evidence: string }[];
  path: string;
  method: string;
};

const SCORE: Record<WafSev, number> = { CRITICAL: 5, ERROR: 4, WARNING: 3, NOTICE: 2 };
const THRESHOLD = 5;
const MAX_HITS = 300;
const LOG_PATH = "/tmp/desk-waf.json";

let HITS: WafHit[] = [];
const COUNTS = new Map<string, number>();

function rule(id: string, crs: string, family: WafFamily, title: string, sev: WafSev, owasp: string): WafRule {
  return { id, crs, family, title, sev, score: SCORE[sev], owasp };
}

/** CRS 4.28 PL1 families + desk-specific virtual patches. */
export const WAF_RULES: WafRule[] = [
  rule("911100", "REQUEST-911", "method", "Method is not allowed", "CRITICAL", "A05"),
  rule("913100", "REQUEST-913", "scanner", "Security scanner / exploit kit UA", "CRITICAL", "A05"),
  rule("920100", "REQUEST-920", "protocol", "Invalid HTTP request line / encoding", "ERROR", "A05"),
  rule("921110", "REQUEST-921", "protocol", "HTTP request smuggling / CRLF", "CRITICAL", "A05"),
  rule("930100", "REQUEST-930", "lfi", "Local file inclusion / path traversal", "CRITICAL", "A01"),
  rule("931100", "REQUEST-931", "rfi", "Remote file inclusion (php/file/gopher)", "CRITICAL", "A05"),
  rule("932100", "REQUEST-932", "rce", "OS command injection", "CRITICAL", "A05"),
  rule("941100", "REQUEST-941", "xss", "Cross-site scripting", "CRITICAL", "A05"),
  rule("942100", "REQUEST-942", "sqli", "SQL injection", "CRITICAL", "A05"),
  rule("943100", "REQUEST-943", "fixation", "Session fixation token in URL", "WARNING", "A07"),
  rule("944100", "REQUEST-944", "log4j", "Log4Shell / JNDI lookup", "CRITICAL", "A05"),
  rule("934100", "REQUEST-934", "ssrf", "SSRF scheme or cloud metadata", "CRITICAL", "A01"),
  rule("960100", "DESK-CMS", "cms-probe", "WordPress / phpMyAdmin / .env probe", "CRITICAL", "A01"),
  rule("961100", "DESK-VITE", "vite-fs", "Vite @fs / raw+import file leak (CVE-2025-31125 class)", "CRITICAL", "A01"),
];

const BY_ID = new Map(WAF_RULES.map((r) => [r.id, r]));

const SCANNER_UA =
  /sqlmap|nikto|nmap\s+script|masscan|nuclei|zgrab|wpscan|dirbuster|gobuster|wfuzz|acunetix|nessus|openvas|burpsuite|owasp[\s-]?zap|w3af|havij|fuzz\.sh|dirsearch|httpx(?:\.projectdiscovery)?|zaproxy/i;

const SKIP =
  /^\/(?:@vite\/|@react-refresh|@id\/|node_modules\/|__grok\/|\.well-known\/)/i;

const CMS_PROBE =
  /(?:wp-admin|wp-login\.php|xmlrpc\.php|wp-content\/(?:plugins|uploads|themes)|wlwmanifest|phpmyadmin|pma\/|adminer\.php|\.env(?:\.|$)|\/\.git(?:\/|$)|wp-config\.php|vendor\/phpunit|cgi-bin\/|setup\.php)/i;

const SQLI =
  /(?:\bunion\b[\s/+-]*(?:all\s+)?\bselect\b|\bselect\b[\s\S]{0,80}\bfrom\b[\s\S]{0,80}\bwhere\b|\bsleep\s*\(\s*\d|\bbenchmark\s*\(|\binformation_schema\b|\bor\b\s+\d+\s*=\s*\d+|\bxp_cmdshell\b|;\s*(?:drop|insert|update|delete)\b[\s(]|\bload_file\s*\(|\binto\s+(?:out|dump)file\b)/i;

const XSS =
  /<\s*script\b|javascript\s*:|on(?:error|load|click|mouseover|focus|animationend|toggle)\s*=|<\s*iframe\b|<\s*object\b|<\s*embed\b|<\s*svg\b[^>]{0,40}on\w+|expression\s*\(|data\s*:\s*text\/html|<\s*img\b[^>]+onerror/i;

const LFI =
  /(?:(?:^|[/?&=])(?:\.\.[/\\]|%2e%2e|%252e%252e)|\/etc\/(?:passwd|shadow)|\/proc\/self|\/windows\/win\.ini|\/winnt\/|%00|\0(?:etc|bin))/i;

const RCE =
  /(?:;|\||`|\$\()\s*(?:cat|wget|curl|bash|sh|nc|ncat|python|perl|php|chmod|rm|kill)\b|\/bin\/(?:ba)?sh\b|\bwget\s+https?:|process\.env\[|child_process|require\s*\(\s*['"]child_process/i;

const RFI = /(?:php|file|gopher|dict|expect|ldap|jar|netdoc)\s*:\/\//i;

const SSRF = /(?:169\.254\.169\.254|metadata\.google\.internal|fd00:ec2::254|\/\/0\.0\.0\.0|\/\/127\.0\.0\.1)/i;

const LOG4J = /\$\{(?:jndi|lower|upper|env|sys):/i;

const FIXATION = /(?:jsessionid|phpsessid|asp\.net_sessionid)=[^&\s]{8,}/i;

const CRLF = /(?:%0d%0a|%0a%0d|\r\n)(?:content-length|set-cookie|location)\s*:/i;

const VITE_SENSITIVE =
  /(?:\/etc\/|\/proc\/|\/root\/|\.env(?:\.|$)|AGENTS\.md|id_rsa|\.gpg|\/migrations\/|package-lock\.json|\/\.git\/)/i;

function decodeOnce(s: string) {
  try {
    return decodeURIComponent(s.replace(/\+/g, " "));
  } catch {
    return s;
  }
}

function haystack(path: string, search: string) {
  const raw = `${path}?${search}`;
  const once = decodeOnce(raw);
  const twice = decodeOnce(once);
  return `${raw}\n${once}\n${twice}`.slice(0, 8_000);
}

export function skipWafPath(path: string) {
  const p = path || "/";
  if (SKIP.test(p)) return true;
  if (p.startsWith("/@fs/") && p.includes("/node_modules/")) return true;
  return false;
}

export type InspectInput = {
  method: string;
  path: string;
  search?: string;
  ua?: string;
  ip?: string;
};

function pushMatch(
  matches: WafVerdict["matches"],
  id: string,
  evidence: string,
) {
  const r = BY_ID.get(id);
  if (!r) return;
  if (matches.some((m) => m.rule.id === id)) return;
  matches.push({ rule: r, evidence: evidence.slice(0, 120) });
}

export function inspectRequest(input: InspectInput): WafVerdict {
  const method = (input.method || "GET").toUpperCase();
  const path = input.path || "/";
  const search = (input.search || "").replace(/^\?/, "");
  const ua = input.ua || "";
  const matches: WafVerdict["matches"] = [];

  if (!["GET", "HEAD", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"].includes(method)) {
    pushMatch(matches, "911100", method);
  }
  if (["TRACE", "TRACK", "CONNECT", "DEBUG"].includes(method)) {
    pushMatch(matches, "911100", method);
  }

  if (skipWafPath(path)) {
    return { block: false, anomaly: 0, threshold: THRESHOLD, matches: [], path, method };
  }

  if (SCANNER_UA.test(ua)) pushMatch(matches, "913100", ua.slice(0, 80));

  const hay = haystack(path, search);
  const q = search.toLowerCase();

  if (CRLF.test(hay)) pushMatch(matches, "921110", "crlf");
  if (/%(?:[^\da-fA-F]|$).{0,2}/.test(search) && /%[^0-9a-fA-F%]/.test(search)) {
    pushMatch(matches, "920100", "bad-encoding");
  }

  if (!path.startsWith("/src/") && LFI.test(hay)) pushMatch(matches, "930100", "traversal");
  if (RFI.test(hay)) pushMatch(matches, "931100", "wrapper");
  if (RCE.test(hay)) pushMatch(matches, "932100", "cmd");
  if (XSS.test(hay)) pushMatch(matches, "941100", "xss");
  if (SQLI.test(hay)) pushMatch(matches, "942100", "sqli");
  if (FIXATION.test(hay)) pushMatch(matches, "943100", "sessid");
  if (LOG4J.test(hay)) pushMatch(matches, "944100", "jndi");
  if (SSRF.test(hay)) pushMatch(matches, "934100", "metadata");
  if (CMS_PROBE.test(path) || CMS_PROBE.test(hay)) pushMatch(matches, "960100", path.slice(0, 80));

  const rawImport = /\braw\b/.test(q) && /\bimport\b/.test(q);
  const inlineImport = /\binline\b/.test(q) && /\bimport\b/.test(q);
  if (path.startsWith("/@fs/") && VITE_SENSITIVE.test(hay)) {
    pushMatch(matches, "961100", path.slice(0, 80));
  }
  if ((rawImport || inlineImport) && !path.startsWith("/src/") && !path.startsWith("/node_modules/")) {
    pushMatch(matches, "961100", "raw+import");
  }

  const anomaly = matches.reduce((n, m) => n + m.rule.score, 0);
  return {
    block: anomaly >= THRESHOLD,
    anomaly,
    threshold: THRESHOLD,
    matches,
    path,
    method,
  };
}

export function inspectText(text: string, ip = "local"): WafVerdict {
  return inspectRequest({ method: "POST", path: "/ingest", search: `q=${encodeURIComponent(text.slice(0, 400))}`, ip });
}

export function recordWafHit(verdict: WafVerdict, ip: string, ua: string) {
  if (!verdict.matches.length) return;
  const at = new Date().toISOString();
  for (const m of verdict.matches) {
    COUNTS.set(m.rule.id, (COUNTS.get(m.rule.id) ?? 0) + 1);
    const hit: WafHit = {
      at,
      ruleId: m.rule.id,
      family: m.rule.family,
      title: m.rule.title,
      sev: m.rule.sev,
      score: m.rule.score,
      path: verdict.path.slice(0, 120),
      ip: ip.slice(0, 64),
      ua: ua.slice(0, 80),
    };
    HITS.unshift(hit);
  }
  if (HITS.length > MAX_HITS) HITS.length = MAX_HITS;
  persist();
}

function persist() {
  if (typeof window !== "undefined") return;
  void import("node:fs")
    .then((fs) => {
      try {
        fs.writeFileSync(
          LOG_PATH,
          JSON.stringify({
            at: new Date().toISOString(),
            counts: Object.fromEntries(COUNTS),
            hits: HITS.slice(0, 120),
          }),
        );
      } catch {
        /* preview */
      }
    })
    .catch(() => undefined);
}

export function ingestWafLog(raw: unknown) {
  if (!raw || typeof raw !== "object") return;
  const hits = (raw as { hits?: unknown }).hits;
  const counts = (raw as { counts?: unknown }).counts;
  if (counts && typeof counts === "object") {
    for (const [k, v] of Object.entries(counts as Record<string, number>)) {
      if (typeof v === "number") COUNTS.set(k, Math.max(COUNTS.get(k) ?? 0, v));
    }
  }
  if (!Array.isArray(hits)) return;
  const seen = new Set(HITS.map((h) => `${h.at}:${h.ruleId}:${h.ip}`));
  for (const item of hits) {
    if (!item || typeof item !== "object") continue;
    const h = item as Partial<WafHit>;
    if (!h.at || !h.ruleId) continue;
    const key = `${h.at}:${h.ruleId}:${h.ip ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    HITS.push({
      at: String(h.at).slice(0, 40),
      ruleId: String(h.ruleId).slice(0, 16),
      family: (h.family as WafFamily) ?? "protocol",
      title: String(h.title ?? "").slice(0, 80),
      sev: (h.sev as WafSev) ?? "ERROR",
      score: Number(h.score) || 5,
      path: String(h.path ?? "").slice(0, 120),
      ip: String(h.ip ?? "local").slice(0, 64),
      ua: String(h.ua ?? "-").slice(0, 80),
    });
  }
  HITS.sort((a, b) => Date.parse(b.at) - Date.parse(a.at));
  if (HITS.length > MAX_HITS) HITS.length = MAX_HITS;
}

export function wafStats() {
  const last24 = Date.now() - 24 * 60 * 60_000;
  const today = HITS.filter((h) => Date.parse(h.at) >= last24);
  const byFamily: Record<string, number> = {};
  for (const h of today) byFamily[h.family] = (byFamily[h.family] ?? 0) + 1;
  const rules = WAF_RULES.map((r) => ({
    ...r,
    hits: COUNTS.get(r.id) ?? 0,
  }));
  return {
    engine: "S1R1US CRS-PL1",
    inspiredBy: "OWASP CRS 4.28.0 (2 Jul 2026) · ModSecurity · Wafris · Wordfence endpoint WAF",
    threshold: THRESHOLD,
    ruleCount: WAF_RULES.length,
    hits24h: today.length,
    hitsTotal: HITS.length,
    lastAt: HITS[0]?.at ?? null,
    byFamily,
    rules,
    recent: HITS.slice(0, 40),
  };
}

