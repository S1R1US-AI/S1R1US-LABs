/**
 * App-layer firewall inventory. Not an OS / Cloudflare WAF.
 * Electrovolt-style: name the control, prove it is armed, do not invent headers we do not send.
 */
import { LAUNCH_LIVE_TRADES } from "@/lib/launch/build";
import { WAF_RULES } from "./waf";
import { HEADER_SPEC } from "./sec-headers";

export type LayerStatus = "ARMED" | "OPEN" | "OPERATOR";
export type LayerZone = "ingress" | "egress" | "auth" | "secrets" | "execution" | "intel";

export type FirewallLayer = {
  id: string;
  name: string;
  zone: LayerZone;
  status: LayerStatus;
  detail: string;
};

export function firewallLayers(): FirewallLayer[] {
  const headerArmed = HEADER_SPEC.filter((h) => h.status === "ARMED").length;
  return [
    {
      id: "crs-waf",
      name: "OWASP CRS-PL1 WAF",
      zone: "ingress",
      status: "ARMED",
      detail: `${WAF_RULES.length} rules, anomaly threshold 5 (CRS 4.28 PL1). SQLi, XSS, RCE, LFI, RFI, Log4j, scanners, CMS probes, Vite @fs leak. Blocks TRACE/TRACK.`,
    },
    {
      id: "crowdsec",
      name: "Local IP reputation",
      zone: "ingress",
      status: "ARMED",
      detail: "CrowdSec/Fail2ban windows: 8 strikes / 10 min → 30 min ban; 16 → 12 h. Loopback never banned. No paid blocklist.",
    },
    {
      id: "agent-waf",
      name: "Agent WAF",
      zone: "ingress",
      status: "ARMED",
      detail: "GET /api/agent/* per IP+UA. Free /call 1 / 25s (poll 300s). Scrapers 1 / 60s → 429. Tightens further while under attack.",
    },
    {
      id: "agentic-asi",
      name: "OWASP Agentic ASI 2026",
      zone: "ingress",
      status: "ARMED",
      detail: "ASI01–10 + LLM01–10: injection inspect, allowlisted MCP tools, no sampling/MCP Apps/webhooks, 32KB body / 8-call batch, least agency (this host never trades).",
    },
    {
      id: "agent-gate",
      name: "External AI gate",
      zone: "ingress",
      status: "OPERATOR",
      detail: "Admin Security tab can set MAINTENANCE: Bot 7 / MCP feed / A2A return 503. Ping + waitlist stay open so bots learn the desk is down and can be invited back (pull JSON — no webhooks). Default OPEN.",
    },
    {
      id: "source-deny",
      name: "Source / admin deny",
      zone: "ingress",
      status: "ARMED",
      detail: "Agent UAs get 403 JSON + IP bar on /src, /admin, /guide, /security, zips, .git, VPN/SSH/RPC (except /api/agent/mcp). Humans use the public GitHub pack. Proprietary host internals are never an agent surface.",
    },
    {
      id: "waitlist",
      name: "No user URLs",
      zone: "ingress",
      status: "ARMED",
      detail: "Waitlist rejects http(s) names and webhook URLs. This host never fetches a visitor-supplied address.",
    },
    {
      id: "headers",
      name: "Security headers",
      zone: "ingress",
      status: "ARMED",
      detail: `${headerArmed} armed (nosniff, referrer, permissions, HSTS-on-HTTPS). X-Frame-Options SKIP (preview iframe). CSP OPERATOR (grok.com injector).`,
    },
    {
      id: "egress",
      name: "Egress allowlist",
      zone: "egress",
      status: "ARMED",
      detail: "guardedFetch: HTTPS only, host suffix allowlist, no IP literals, no credentials in URL, no dns.google. CISA/OSV allowed for intel.",
    },
    {
      id: "doh",
      name: "Cloudflare DoH",
      zone: "egress",
      status: "ARMED",
      detail: "Explicit DNS uses cloudflare-dns.com. Not an OS pin — set 1.1.1.1 on the CLI machine.",
    },
    {
      id: "and-auth",
      name: "Admin AND lock",
      zone: "auth",
      status: "ARMED",
      detail: "Operator X (id or handle) AND name+password. X alone or password alone cannot mint admin. Dual Yubi on outgoing BTC/USDC. Optional physical-key lock on Admin (default OFF).",
    },
    {
      id: "yubi-panel",
      name: "Admin YubiKey lock",
      zone: "auth",
      status: "OPERATOR",
      detail: "Optional. Default OFF. Admin can require a physical YubiKey (Yubico OTP or FIDO2, UV required) after X + password to open Admin. Cannot enable without a key. Dual OTP still required for outgoing BTC/USDC. Official: yubico.com.",
    },
    {
      id: "throttle",
      name: "Sign-in throttle",
      zone: "auth",
      status: "ARMED",
      detail: "8 tries / 10 min in memory. Throttle and wrong password land in the intrusion ring and score the IP.",
    },
    {
      id: "idle",
      name: "Idle lock",
      zone: "auth",
      status: "ARMED",
      detail: "5-minute idle clears the HMAC first, bumps epoch, signs out X, overlay cannot dismiss in-place.",
    },
    {
      id: "session",
      name: "Session store",
      zone: "auth",
      status: "OPERATOR",
      detail: "HMAC lives in sessionStorage (OWASP: XSS-readable). Epoch + X AND + idle wipe until an HttpOnly cookie ships.",
    },
    {
      id: "secrets",
      name: "Secret paste filter",
      zone: "secrets",
      status: "ARMED",
      detail: "CDP JSON, xprv, WIF, 64-hex, 12–24 word seeds rejected at the door. Vault holds addresses/UUIDs only.",
    },
    {
      id: "keys",
      name: "No spend keys here",
      zone: "secrets",
      status: "ARMED",
      detail: "This image never holds a Coinbase secret or wallet seed. Live create stays off this host.",
    },
    {
      id: "kev",
      name: "CISA KEV + OSV.dev",
      zone: "intel",
      status: "ARMED",
      detail: "Free JSON, no key. Stack-filtered. Vite @fs virtual-patched. Operator still patches Node.",
    },
    {
      id: "live",
      name: "Live Coinbase create",
      zone: "execution",
      status: LAUNCH_LIVE_TRADES ? "OPEN" : "ARMED",
      detail: LAUNCH_LIVE_TRADES
        ? "LAUNCH_LIVE_TRADES is on — hunter must fail this layer."
        : "LAUNCH_LIVE_TRADES=false. Public tree emits dry-run / preview only. Auto-defend re-confirms on every KEV refresh.",
    },
  ];
}

export function firewallSummary(layers: FirewallLayer[] = firewallLayers()) {
  return {
    armed: layers.filter((l) => l.status === "ARMED").length,
    open: layers.filter((l) => l.status === "OPEN").length,
    operator: layers.filter((l) => l.status === "OPERATOR").length,
    total: layers.length,
  };
}
