/**
 * Safe HTTP security headers. Preview is iframed — never X-Frame-Options DENY.
 * Never a CSP that blocks https://grok.com (platform injector).
 * Helmet / All-In-One Security / Cloudflare-style defaults we can prove.
 */

export type HeaderRow = {
  id: string;
  name: string;
  value: string | null;
  status: "ARMED" | "SKIP" | "OPERATOR";
  why: string;
};

export const HEADER_SPEC: HeaderRow[] = [
  {
    id: "nosniff",
    name: "X-Content-Type-Options",
    value: "nosniff",
    status: "ARMED",
    why: "Stops MIME sniffing. Wordfence / AIOIS / Helmet default.",
  },
  {
    id: "referrer",
    name: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
    status: "ARMED",
    why: "Strips path on cross-origin. Fine for Coinbase MCP docs links.",
  },
  {
    id: "dns",
    name: "X-DNS-Prefetch-Control",
    value: "off",
    status: "ARMED",
    why: "No extra resolver leakage from this document.",
  },
  {
    id: "permissions",
    name: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
    status: "ARMED",
    why: "This desk is not a payment page. PCI 6.4.3: no extra browser payment APIs.",
  },
  {
    id: "xdomain",
    name: "X-Permitted-Cross-Domain-Policies",
    value: "none",
    status: "ARMED",
    why: "No Flash / PDF cross-domain policy.",
  },
  {
    id: "hsts",
    name: "Strict-Transport-Security",
    value: "max-age=15552000; includeSubDomains",
    status: "ARMED",
    why: "Set only when the request is HTTPS. Skipped on http preview.",
  },
  {
    id: "frame",
    name: "X-Frame-Options",
    value: null,
    status: "SKIP",
    why: "Live preview is iframed. DENY would blank the desk. Edge may set SAMEORIGIN on s1r1us.ai.",
  },
  {
    id: "csp",
    name: "Content-Security-Policy",
    value: null,
    status: "OPERATOR",
    why: "Platform injects https://grok.com. A blocking CSP here would break the injector and Vite. Put a policy on the edge that allows grok.com + self + fonts.bunny.net.",
  },
  {
    id: "corp",
    name: "Cross-Origin-Resource-Policy",
    value: null,
    status: "SKIP",
    why: "Agent feed is CORS * for 7-B0T pollers. CORP same-site would 429-starve paid keys.",
  },
];

export function applySecHeaders(
  headers: { set(name: string, value: string): void },
  opts?: { https?: boolean },
) {
  for (const row of HEADER_SPEC) {
    if (row.status !== "ARMED" || !row.value) continue;
    if (row.id === "hsts" && !opts?.https) continue;
    try {
      headers.set(row.name, row.value);
    } catch {
      /* immutable */
    }
  }
}

export function headerPosture() {
  return {
    inspiredBy: "Helmet 8 · All-In-One Security 5.4 · Cloudflare Managed Headers",
    rows: HEADER_SPEC,
    armed: HEADER_SPEC.filter((r) => r.status === "ARMED").length,
    skip: HEADER_SPEC.filter((r) => r.status === "SKIP").length,
    operator: HEADER_SPEC.filter((r) => r.status === "OPERATOR").length,
  };
}
