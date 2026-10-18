// Static /faq/ page: FAQPage JSON-LD must parse and list the visible FAQ questions in order.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../front-door-static/faq/index.html", import.meta.url), "utf8");
function decode(s) {
  let t = s;
  let prev;
  do {
    prev = t;
    t = t.replace(/<[^>]*>/g, "");
  } while (t !== prev);
  t = t.replace(/[<>]/g, "");
  return t
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

test("static FAQ JSON-LD parses and has a FAQPage published by SAI Citizens United LTD", () => {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
  const faq = blocks.flatMap((b) => b["@graph"] ?? [b]).find((n) => n["@type"] === "FAQPage");
  assert.ok(faq, "FAQPage present");
  assert.equal(faq.publisher.name, "SAI Citizens United LTD");
  const visible = [...html.matchAll(/<section class="faq-item" id="([^"]+)"[^>]*>\s*<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((m) => decode(m[2]));
  assert.deepEqual(faq.mainEntity.map((q) => q.name), visible);
  assert.equal(faq.mainEntity[0].name, "What exactly is DMT and plant Medicine?");
  // Reorder 2026-10-18: Future, Copyright, Book a DJ, L00K wh0 is W0K3 N0w, Meet the HUmAns, Cosmic C0D3, Sensei, Legal, L3AD3R B0ARD, SUP3R B0WL.
  assert.deepEqual(faq.mainEntity.slice(1, 11).map((q) => q.url.split("#")[1]), ["future", "copyright-policy", "book-dj-mo-funky", "look-who-is-woke-now", "meet-the-humans", "cosmic-c0d3", "sense1-engineering", "legal-requirements", "gm-board", "super-bowl"]);
  assert.deepEqual(faq.mainEntity.slice(-3).map((q) => q.url.split("#")[1]), ["disclaimer", "terms", "privacy"]);
});

test("static FAQ has one H1, canonical with trailing slash and a large share card", () => {
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(html, /<link rel="canonical" href="https:\/\/s1r1us\.ai\/faq\/" \/>/);
  assert.match(html, /<meta name="twitter:card" content="summary_large_image" \/>/);
  assert.doesNotMatch(html, /™|®/);
});
