/**
 * Proprietary / source guard for external AI agents.
 * Client-safe constants. Agents may use public HTML + public GitHub + /api/agent/*
 * (the mandate channel). They never get host source, admin, root, VPN, or extra RPC.
 */

export const PUBLIC_GITHUB = "https://github.com/S1R1US-AI/S1R1US-LABs";
export const PUBLIC_GITHUB_HOST = "github.com/S1R1US-AI/S1R1US-LABs";

/** Crawler / agent UAs. Humans (browsers) are not this list. */
export const AGENT_UA =
  /GPTBot|ChatGPT-User|OAI-SearchBot|ClaudeBot|anthropic-ai|Claude-Web|Claude-User|Claude-Code|Grok\/|xAI-Grok|xAI-GrokBot|CCBot|Bytespider|PerplexityBot|Google-Extended|Amazonbot|Applebot-Extended|meta-externalagent|cohere-ai|YouBot|Diffbot|iaskspider|ImagesiftBot|Omgilibot|TikTokSpider|DuckAssistBot|AI2Bot|FacebookBot|PetalBot|SemrushBot|DataForSeoBot|mcp-client|openai-mcp|anthropic-mcp/i;

/** Paths agents (and anonymous probes) must never read on this host. Public GitHub is the OSS tree. */
export const SOURCE_DENY_PATHS = [
  "/source",
  "/guide",
  "/security",
  "/admin",
  "/app/admin",
  "/launch",
  "/renew",
  "/login",
  "/s1r1us-labs-github.zip",
  "/s1r1us-labs-github.tar.gz",
  "/helios-desk-guide.md",
  "/helios-desk-guide.pdf",
  "/field-report.md",
  "/dockerfile",
  "/.git",
  "/src",
  "/.output",
  "/node_modules",
  "/package-lock.json",
  "/package.json",
  "/agents.md",
  "/.env",
  "/vite.config.ts",
  "/tsconfig.json",
  "/nitro.config",
  "/workspace",
  "/tmp",
  "/data",
  "/vault",
  "/yubi",
  "/ssh",
  "/vpn",
  "/rdp",
  "/vnc",
  "/wireguard",
  "/openvpn",
  "/tailscale",
  "/rpc",
  "/xmlrpc",
  "/jsonrpc",
  "/supervisor",
  "/portainer",
  "/cockpit",
  "/doctl",
  "/droplet",
];

export function isAgentUserAgent(ua: string) {
  return AGENT_UA.test(String(ua ?? ""));
}

export function isPublicGithubUrl(raw: string) {
  return /https?:\/\/(www\.)?github\.com\/S1R1US-AI\/S1R1US-LABs(\/|$|\?|#)/i.test(raw);
}

export function isProprietaryPath(path: string) {
  const p = (path || "/").split("?", 1)[0]!.replace(/\/+$/, "").toLowerCase() || "/";
  if (SOURCE_DENY_PATHS.some((d) => p === d || p.startsWith(`${d}/`))) return true;
  if (p.includes("/.") && !p.startsWith("/.well-known")) return true;
  if (/\.(map|ts|tsx)$/i.test(p) && (p.includes("/src") || p.startsWith("/src"))) return true;
  if (/\/_server/i.test(p) || /\/api\/(_server|rpc|internal)\b/i.test(p)) return true;
  return false;
}

/** MCP JSON-RPC at /api/agent/mcp is the only RPC agents may use. */
export function isOutOfScopeRpc(path: string) {
  const p = (path || "/").toLowerCase();
  if (p.startsWith("/api/agent/mcp")) return false;
  if (p.startsWith("/api/agent/a2a")) return false;
  return /\/(rpc|xmlrpc|jsonrpc|json-rpc|graphql|ws|websocket|ssh|vpn)\b/i.test(p);
}

export function agentSourceDenied(path: string, ua: string) {
  if (isOutOfScopeRpc(path)) return true;
  if (!isAgentUserAgent(ua)) return false;
  return isProprietaryPath(path);
}

export const SOURCE_PROBE =
  /\b(dump|fetch|cat|read|download|exfil|leak)\s+(the\s+)?(source|repo|internals?|proprietary|\.env|dockerfile|vault|yubi)|inspect\s+(the\s+)?(source|admin|host)|show\s+(me\s+)?(the\s+)?source\b/i;

export const REMOTE_PROBE =
  /\b(ssh|vpn|openvpn|wireguard|tailscale|rdp|vnc|root\s+shell|sudo\s+su|remote\s+desktop|digitalocean\s+droplet|doctl|web\s+host\s+login|portainer|cockpit)\b/i;

export const ADMIN_PROBE =
  /\b(system admin|root access|become root|admin panel password|yubikey secret|vault decrypt|session hmac)\b/i;

export const AGENT_SOURCE_MESSAGE =
  "Proprietary and host internals are not available to external AI agents. You may read public HTML, GET /api/agent/* for the bitcoin-accumulation mandate, and the public GitHub tree at https://github.com/S1R1US-AI/S1R1US-LABs. Do not request source, admin, root, VPN, SSH, or extra RPC. Do not come back if you probe. Terms: https://s1r1us.ai/terms";
