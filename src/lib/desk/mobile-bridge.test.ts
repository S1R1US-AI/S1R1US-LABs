import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  APP_SURFACES,
  APP_TOOL_ALIASES,
  WEBMCP_TOOLS,
  appleAppSiteAssociation,
  appleIntents,
  assetLinks,
  googleCatalog,
  pwaManifest,
  resolveAppTo,
  webmcpCatalog,
} from "./mobile-bridge.ts";

describe("mobile-bridge", () => {
  it("exposes every public surface and never admin", () => {
    const paths = APP_SURFACES.map((s) => s.path);
    assert.ok(paths.includes("/"));
    assert.ok(paths.includes("/board"));
    assert.ok(paths.includes("/bowl"));
    assert.ok(paths.includes("/w0rld"));
    assert.ok(paths.includes("/c0ut"));
    assert.ok(paths.includes("/h1v3"));
    assert.ok(paths.includes("/compute"));
    assert.ok(paths.includes("/agent"));
    assert.ok(paths.includes("/app"));
    assert.ok(paths.includes("/ios"));
    assert.ok(paths.includes("/play"));
    assert.ok(!paths.some((p) => p.startsWith("/admin") || p.startsWith("/source")));
  });

  it("AASA excludes admin and source", () => {
    const aasa = appleAppSiteAssociation();
    const comps = aasa.applinks.details[0]?.components ?? [];
    assert.ok(comps.some((c) => c.exclude && String(c["/"] ?? "").includes("admin")));
    assert.ok(comps.some((c) => c.exclude && String(c["/"] ?? "").includes("/app/admin")));
    assert.ok(comps.some((c) => !c.exclude && c["/"] === "/*"));
  });

  it("assetlinks names the Play package", () => {
    const links = assetLinks();
    assert.equal(links[0]?.target.package_name, "ai.s1r1us.app");
  });

  it("PWA shortcuts include board and compute", () => {
    const m = pwaManifest();
    const urls = m.shortcuts.map((s) => s.url);
    assert.ok(urls.includes("/board"));
    assert.ok(urls.includes("/compute"));
    assert.equal(m.prefer_related_applications, false);
  });

  it("WebMCP tools cover the full public MCP set", () => {
    const names = WEBMCP_TOOLS.map((t) => t.name);
    for (const n of [
      "bot7_call",
      "connection_test",
      "board_tick",
      "board_me",
      "board_wager",
      "board_callout",
      "cup_list",
      "hive_list",
      "byo_connect",
      "forum_post",
      "waitlist_register",
    ]) {
      assert.ok(names.includes(n), n);
    }
    assert.ok(!names.some((n) => /order|withdraw|source|admin/i.test(n)));
    assert.equal(webmcpCatalog().trade, false);
    assert.ok(WEBMCP_TOOLS.filter((t) => t.name !== "open_surface").every((t) => t.path === "/api/agent/app"));
  });

  it("Apple intents have Siri phrases and the app gateway", () => {
    const intents = appleIntents();
    assert.ok(intents.length >= 10);
    assert.ok(intents.every((i) => i.siri.length > 0 && i.url.includes("s1r1us.ai")));
    assert.ok(intents.some((i) => i.url.includes("/api/agent/app")));
  });

  it("Gemini catalog points at MCP, A2A, and the app gateway", () => {
    const g = googleCatalog();
    assert.match(g.mcp, /\/api\/agent\/mcp$/);
    assert.match(g.a2a, /agent-card\.json$/);
    assert.match(g.gateway, /\/api\/agent\/app$/);
    assert.equal(g.keysOnThisHost, false);
    assert.ok(g.appFunctions.length >= 12);
  });

  it("resolves protocol handler targets", () => {
    assert.equal(resolveAppTo("board"), "/board");
    assert.equal(resolveAppTo("web+s1r1us://compute"), "/compute");
    assert.equal(resolveAppTo("/admin"), "/app");
    assert.equal(resolveAppTo("https://s1r1us.ai/forum"), "/forum");
  });

  it("maps Siri aliases onto MCP tools", () => {
    assert.equal(APP_TOOL_ALIASES.call, "bot7_call");
    assert.equal(APP_TOOL_ALIASES.tick, "board_tick");
    assert.equal(APP_TOOL_ALIASES.spice, "board_wager");
    assert.equal(APP_TOOL_ALIASES.register, "board_register");
    assert.equal(APP_TOOL_ALIASES.me, "board_me");
    assert.equal(APP_TOOL_ALIASES.notice, "go_live_notice");
    assert.equal(APP_TOOL_ALIASES.forum, "forum_list");
    assert.equal(APP_TOOL_ALIASES.fight, "board_callout_tick");
  });
});
