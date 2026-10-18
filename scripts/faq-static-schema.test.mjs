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
  // Reorder 2026-10-18: Future, Copyright, Book a DJ, L00K wh0 is W0K3 N0w, Meet the HUmAns, Cosmic C0D3, Sensei, Legal, L3AD3R B0ARD, SUP3R B0WL, W0rLd CUP, Escape the MATRIX.
  assert.deepEqual(faq.mainEntity.slice(1, 13).map((q) => q.url.split("#")[1]), ["future", "copyright-policy", "book-dj-mo-funky", "look-who-is-woke-now", "meet-the-humans", "cosmic-c0d3", "sense1-engineering", "legal-requirements", "gm-board", "super-bowl", "world-cup", "escape-the-matrix"]);
  // #16, right after the slot-15 featured row (DMT + Dr1pped tiles) and before the games entries.
  assert.deepEqual(faq.mainEntity.slice(13, 15).map((q) => q.url.split("#")[1]), ["global-uprisings-money-surveillance", "call-out-welcome"]);
  assert.deepEqual(faq.mainEntity.slice(-3).map((q) => q.url.split("#")[1]), ["disclaimer", "terms", "privacy"]);
});

test("static FAQ has one H1, canonical with trailing slash and a large share card", () => {
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(html, /<link rel="canonical" href="https:\/\/s1r1us\.ai\/faq\/" \/>/);
  assert.match(html, /<meta name="twitter:card" content="summary_large_image" \/>/);
  assert.doesNotMatch(html, /™|®/);
});

test("Global Uprisings money and surveillance FAQ: hero image, AFP blockquote, 5 story links, page link", () => {
  const sec = html.match(/<section class="faq-item" id="global-uprisings-money-surveillance"[\s\S]*?<\/section>/)[0];
  assert.match(sec, /<h2[^>]*>What are the Global Uprisings over financial inequality and surveillance\?<\/h2>/);
  assert.ok(sec.includes('src="/images/captains-save-the-constitution.jpg"'));
  assert.match(sec, /<blockquote class="faq-quote"[\s\S]*India detains &#x27;cockroach&#x27; movement leaders in bid to thwart election protest[\s\S]*Arunabh SAIKIA[\s\S]*<\/blockquote>/);
  assert.equal([...sec.match(/<ul class="faq-news-links">[\s\S]*?<\/ul>/)[0].matchAll(/<li>/g)].length, 5);
  assert.ok(sec.includes('href="/global-uprisings/#money-and-surveillance"'));
  assert.doesNotMatch(sec, /Broken Soft|Mo FuNky|\b(first|second|third|fourth|fifth|sixth)\b/i);
});
