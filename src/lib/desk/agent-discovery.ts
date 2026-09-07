/** Agentic Resource Discovery + MCP server card. Client-safe.
 * Official 2026 surfaces:
 * - Google Search: schema.org JSON-LD only. llms.txt does not change ranking
 *   (Search Central, June 2026). Keep people-first HTML.
 * - ARD (Google + industry, 17 Jun 2026): /.well-known/ai-catalog.json
 * - MCP SEP-2127: /.well-known/mcp.json (name/version/remotes)
 * - MCP SEP-1649: /.well-known/mcp/server-card.json (serverInfo/transport)
 * Dual-compat: one card document carries both shapes.
 */
import { APP_NAME, LABS_NAME, SEO_CANONICAL } from "../brand.ts";
import { MCP_TOOLS } from "./agent-security.ts";
import { CHECKPOINT_BUILD_N, checkpointLabel } from "../launch/checkpoint.ts";

const origin = SEO_CANONICAL.replace(/\/$/, "");

export const ARD_CATALOG_PATH = "/.well-known/ai-catalog.json";
export const ARD_CATALOG_ALIAS = "/ai-catalog.json";
export const MCP_CARD_PATH = "/.well-known/mcp.json";
export const MCP_CARD_ALT_PATH = "/.well-known/mcp-server.json";
export const MCP_SERVER_CARD_PATH = "/.well-known/mcp/server-card.json";
export const LLMS_PATH = "/llms.txt";
export const LLMS_WELLKNOWN_PATH = "/.well-known/llms.txt";
export const A2A_CARD_PATH = "/.well-known/agent-card.json";
export const GPT_PLUGIN_PATH = "/.well-known/ai-plugin.json";
export const OPENAPI_PATH = "/api/agent/openapi";

const TOOLS = [...MCP_TOOLS];

const NEVER = ["orders_create", "lock_set", "hive_withdraw", "hive_pause", "keys_store", "vpn_connect"] as const;

export const INSTRUCTIONS_MODULE = {
  name: `${APP_NAME} instructions module`,
  path: LLMS_PATH,
  wellKnown: LLMS_WELLKNOWN_PATH,
  url: `${origin}${LLMS_PATH}`,
  wellKnownUrl: `${origin}${LLMS_WELLKNOWN_PATH}`,
  notGuide: true as const,
  googleSearchUsesLlmsTxt: false as const,
  googleSearchUsesSchemaOrg: true as const,
  note: "Public instruction file for AI agents. Same text at /llms.txt and /.well-known/llms.txt. /guide is operator-only (robots Disallow). Google Search (May/June 2026) does not use llms.txt for ranking — HTML + schema.org JSON-LD is what Search uses. Agent search uses ARD + MCP cards.",
};

export function mcpServerCard() {
  return {
    $schema: "https://static.modelcontextprotocol.io/schemas/2025-10-17/server.schema.json",
    name: `${APP_NAME} 7-B0T`,
    title: `${LABS_NAME} read-only Bitcoin accumulation MCP`,
    description:
      "Read-only 7-B0T, L3AD3R B0ARD, H1V3 SW@RM, LoCK3D STATUS, OSS Roadmap, and go-live notices. This host never places Coinbase orders. Never lock_set, hive_withdraw, or orders_create.",
    version: String(CHECKPOINT_BUILD_N),
    protocolVersion: "2025-06-18",
    remotes: [{ type: "streamable-http", url: `${origin}/api/agent/mcp` }],
    serverInfo: {
      name: `${APP_NAME} 7-B0T`,
      version: String(CHECKPOINT_BUILD_N),
      title: `${LABS_NAME} read-only Bitcoin accumulation MCP`,
      description:
        "Read-only 7-B0T, L3AD3R B0ARD, H1V3 SW@RM, LoCK3D STATUS, OSS Roadmap, and go-live notices.",
      homepage: origin,
    },
    transport: {
      type: "streamable-http",
      endpoint: `${origin}/api/agent/mcp`,
    },
    capabilities: {
      tools: { listChanged: false },
      resources: false,
      prompts: false,
      sampling: false,
    },
    tools: TOOLS.map((name) => ({ name })),
    never: [...NEVER],
    documentationUrl: `${origin}${LLMS_PATH}`,
    instructionsUrl: `${origin}${LLMS_PATH}`,
    websiteUrl: origin,
    checkpoint: checkpointLabel(),
    trade: false,
    ordersCreate: false,
    keysOnThisHost: false,
  };
}

export function ardCatalog() {
  return {
    specVersion: "1.0",
    host: {
      displayName: LABS_NAME,
      identifier: "https://s1r1us.ai/",
      documentationUrl: `${origin}${LLMS_PATH}`,
      description:
        "Read-only Bitcoin accumulation desk. This host never places Coinbase orders. Start at /llms.txt.",
    },
    entries: [
      {
        identifier: "urn:ai:s1r1us.ai:server:7bot-mcp",
        displayName: `${APP_NAME} 7-B0T MCP`,
        type: "application/mcp-server-card+json",
        url: `${origin}${MCP_CARD_PATH}`,
        description:
          "Read-only MCP. Tools: bot7_call, lock_status, board_list, hive_list, cup_list, go_live_notice. Never lock_set or orders_create. Polymarket/Kalshi odds stay a 7-B0T overlay. No pred_list / pred_arm / pred_bet.",
        representativeQueries: [
          "bitcoin accumulation signal",
          "AI bitcoin trading bot MCP",
          "7-B0T call",
          "S1R1US Labs agent tools",
        ],
        version: String(CHECKPOINT_BUILD_N),
      },
      {
        identifier: "urn:ai:s1r1us.ai:agent:a2a",
        displayName: `${APP_NAME} A2A agent`,
        type: "application/a2a-agent-card+json",
        url: `${origin}${A2A_CARD_PATH}`,
        description: "Agent-to-agent card. Same read-only mandate. This host never places Coinbase orders.",
        representativeQueries: ["S1R1US AI agent card", "bitcoin accumulation agent"],
        version: String(CHECKPOINT_BUILD_N),
      },
      {
        identifier: "urn:ai:s1r1us.ai:instructions",
        displayName: INSTRUCTIONS_MODULE.name,
        type: "text/plain",
        url: `${origin}${LLMS_PATH}`,
        description: INSTRUCTIONS_MODULE.note,
        representativeQueries: [
          "how to use S1R1US.ai as an AI agent",
          "instructions for bots",
          "S1R1US instructions module",
        ],
        version: String(CHECKPOINT_BUILD_N),
      },
      {
        identifier: "urn:ai:s1r1us.ai:openapi",
        displayName: `${APP_NAME} OpenAPI`,
        type: "application/vnd.oai.openapi+json",
        url: `${origin}${OPENAPI_PATH}`,
        description: "OpenAPI for GPT Actions and HTTP clients. Read-only.",
        representativeQueries: ["S1R1US OpenAPI", "7-B0T REST"],
        version: String(CHECKPOINT_BUILD_N),
      },
      {
        identifier: "urn:ai:s1r1us.ai:gpt-plugin",
        displayName: `${APP_NAME} GPT Actions plugin`,
        type: "application/json",
        url: `${origin}${GPT_PLUGIN_PATH}`,
        description: "ChatGPT Actions plugin manifest. Read-only 7-B0T.",
        representativeQueries: ["S1R1US GPT plugin"],
        version: String(CHECKPOINT_BUILD_N),
      },
    ],
    never: ["orders_create", "lock_set", "hive_withdraw"],
    trade: false,
    ordersCreate: false,
    keysOnThisHost: false,
    checkpoint: checkpointLabel(),
  };
}

export const DISCOVERY_WELCOME =
  "Start at /llms.txt (instructions module). Discover MCP at /.well-known/mcp.json, A2A at /.well-known/agent-card.json, and the Agentic Resource Discovery catalog at /.well-known/ai-catalog.json. This host never places Coinbase orders.";
