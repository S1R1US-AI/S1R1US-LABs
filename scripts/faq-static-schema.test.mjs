// Static /faq/ page: FAQPage JSON-LD must parse and list the visible FAQ questions in order.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../front-door-static/faq/index.html", import.meta.url), "utf8");
const decode = (s) => s.replace(/<[^>]+>/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();

test("static FAQ JSON-LD parses and has a FAQPage published by SAI Citizens United LTD", () => {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
  const faq = blocks.flatMap((b) => b["@graph"] ?? [b]).find((n) => n["@type"] === "FAQPage");
  assert.ok(faq, "FAQPage present");
  assert.equal(faq.publisher.name, "SAI Citizens United LTD");
  const visible = [...html.matchAll(/<section class="faq-item" id="([^"]+)"[^>]*>\s*<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((m) => decode(m[2]));
  assert.deepEqual(faq.mainEntity.map((q) => q.name), visible);
  assert.equal(faq.mainEntity[0].name, "What does the Future Look Like at S1R1US.ai?");
  assert.equal(faq.mainEntity[1].name, "What is the S1R1US.ai Copyright @ Policy?");
  assert.equal(faq.mainEntity[2].name, "L00K wh0 is W0K3 N0w");
});

test("static FAQ has one H1, canonical with trailing slash and a large share card", () => {
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(html, /<link rel="canonical" href="https:\/\/s1r1us\.ai\/faq\/" \/>/);
  assert.match(html, /<meta name="twitter:card" content="summary_large_image" \/>/);
  assert.doesNotMatch(html, /™|®/);
});
