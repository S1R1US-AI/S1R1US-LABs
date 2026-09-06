import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { inspectRequest, skipWafPath } from "./waf.ts";

describe("CRS-PL1 WAF", () => {
  it("blocks SQLi union select in query", () => {
    const v = inspectRequest({ method: "GET", path: "/api/agent/call", search: "q=1%20UNION%20SELECT%20password%20FROM%20users" });
    assert.equal(v.block, true);
    assert.ok(v.matches.some((m) => m.rule.family === "sqli"));
  });

  it("blocks XSS script tag", () => {
    const v = inspectRequest({ method: "GET", path: "/", search: "x=<script>alert(1)</script>" });
    assert.equal(v.block, true);
    assert.ok(v.matches.some((m) => m.rule.family === "xss"));
  });

  it("blocks wp-login probes", () => {
    const v = inspectRequest({ method: "GET", path: "/wp-login.php" });
    assert.equal(v.block, true);
    assert.ok(v.matches.some((m) => m.rule.family === "cms-probe"));
  });

  it("blocks /@fs/etc/passwd", () => {
    const v = inspectRequest({ method: "GET", path: "/@fs/etc/passwd" });
    assert.equal(v.block, true);
    assert.ok(v.matches.some((m) => m.rule.family === "vite-fs" || m.rule.family === "lfi"));
  });

  it("blocks sqlmap UA", () => {
    const v = inspectRequest({ method: "GET", path: "/", ua: "sqlmap/1.8" });
    assert.equal(v.block, true);
  });

  it("blocks TRACE", () => {
    const v = inspectRequest({ method: "TRACE", path: "/" });
    assert.equal(v.block, true);
  });

  it("allows agent poll", () => {
    const v = inspectRequest({ method: "GET", path: "/api/agent/call", search: "nav=100" });
    assert.equal(v.block, false);
  });

  it("skips Vite HMR client", () => {
    assert.equal(skipWafPath("/@vite/client"), true);
    const v = inspectRequest({ method: "GET", path: "/@vite/client" });
    assert.equal(v.block, false);
  });

  it("does not treat import-only Vite modules as CVE-2025-31125", () => {
    const v = inspectRequest({ method: "GET", path: "/src/components/shell.tsx", search: "t=123" });
    assert.equal(v.block, false);
  });
});
