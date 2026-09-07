import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  ARD_CATALOG_PATH,
  INSTRUCTIONS_MODULE,
  MCP_CARD_PATH,
  MCP_SERVER_CARD_PATH,
  ardCatalog,
  mcpServerCard,
} from "./agent-discovery.ts";
import { MCP_TOOLS } from "./agent-security.ts";
import { CHECKPOINT_BUILD_N } from "../launch/checkpoint.ts";

const llms = readFileSync(new URL("../../../public/llms.txt", import.meta.url), "utf8");
const robots = readFileSync(new URL("../../../public/robots.txt", import.meta.url), "utf8");
const faq = readFileSync(new URL("./public-nav.ts", import.meta.url), "utf8");
const sitemap = readFileSync(new URL("../../components/sitemap-page.tsx", import.meta.url), "utf8");
const graph = readFileSync(new URL("./search-graph.ts", import.meta.url), "utf8");
const paper = readFileSync(new URL("../../lib/paper.ts", import.meta.url), "utf8");
const thesis = readFileSync(new URL("./thesis.ts", import.meta.url), "utf8");
const legal = readFileSync(new URL("../../lib/legal.ts", import.meta.url), "utf8");

describe("agent discovery + instructions module", { concurrency: false }, () => {
  it("ARD catalog lists MCP, A2A, and the instructions module", () => {
    const cat = ardCatalog();
    assert.equal(cat.specVersion, "1.0");
    assert.equal(cat.trade, false);
    assert.equal(cat.ordersCreate, false);
    assert.ok(cat.entries.some((e) => e.url.endsWith(MCP_CARD_PATH)));
    assert.ok(cat.entries.some((e) => e.identifier.includes("instructions")));
    assert.ok(cat.entries.some((e) => e.type === "application/a2a-agent-card+json"));
    assert.ok(cat.never.includes("orders_create"));
    assert.ok(cat.never.includes("lock_set"));
    assert.equal(ARD_CATALOG_PATH, "/.well-known/ai-catalog.json");
  });

  it("MCP card is dual SEP-2127 remotes + SEP-1649 serverInfo and never writes", () => {
    const card = mcpServerCard();
    assert.equal(card.version, String(CHECKPOINT_BUILD_N));
    assert.ok(card.remotes.some((r) => r.type === "streamable-http"));
    assert.equal(card.transport.type, "streamable-http");
    assert.equal(card.serverInfo.name.includes("7-B0T"), true);
    assert.equal(card.trade, false);
    assert.equal(card.ordersCreate, false);
    assert.ok(card.never.includes("lock_set"));
    assert.ok(card.never.includes("hive_withdraw"));
    assert.equal(MCP_TOOLS.has("lock_set"), false);
    assert.equal(MCP_TOOLS.has("orders_create"), false);
    assert.equal(MCP_SERVER_CARD_PATH, "/.well-known/mcp/server-card.json");
  });

  it("instructions module is public llms.txt, not /guide", () => {
    assert.equal(INSTRUCTIONS_MODULE.path, "/llms.txt");
    assert.equal(INSTRUCTIONS_MODULE.notGuide, true);
    assert.equal(INSTRUCTIONS_MODULE.googleSearchUsesLlmsTxt, false);
    assert.equal(INSTRUCTIONS_MODULE.googleSearchUsesSchemaOrg, true);
    assert.match(llms, /Instructions module \+ agent discovery/);
    assert.match(llms, /Agentic Resource Discovery/);
    assert.match(llms, /faq#instructions/);
    assert.match(llms, /As-live G M0D3 AUTO/);
    assert.match(robots, /Disallow: \/guide/);
    assert.match(robots, /Allow: \/llms\.txt/);
    assert.match(robots, /Allow: \/ai-catalog\.json/);
    assert.match(robots, /Allow: \/\.well-known\//);
    assert.match(robots, /Allow: \/brand\.txt/);
  });

  it("FAQ, sitemap, schema, paper, thesis, and Terms fold discovery + sim", () => {
    assert.match(faq, /id: "instructions"/);
    assert.match(faq, /id: "live-sim"/);
    assert.match(faq, /id: "how-to-use"/);
    assert.match(faq, /Agentic Resource Discovery/);
    assert.match(sitemap, /ARD catalog/);
    assert.match(sitemap, /instructions module/);
    assert.match(graph, /llms\.txt#instructions/);
    assert.match(graph, /llms\.txt#howto/);
    assert.match(graph, /TechArticle/);
    assert.match(paper, /Agentic Resource Discovery/);
    assert.match(paper, /as-live G M0D3 AUTO/);
    assert.match(thesis, /As-live G M0D3 AUTO/);
    assert.match(thesis, /Alignment Score/);
    assert.match(legal, /instructions module/);
    assert.match(legal, /as-live simulation/);
  });
});
