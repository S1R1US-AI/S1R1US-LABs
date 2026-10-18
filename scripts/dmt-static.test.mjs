// Static /dmt/ page: indexable, JSON-LD parses, assets exist, safety copy present, held topics absent, front door serves it.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const root = new URL("../front-door-static/", import.meta.url);
const html = readFileSync(new URL("dmt/index.html", root), "utf8");
const faq = readFileSync(new URL("faq/index.html", root), "utf8");
const start = readFileSync(new URL("../scripts/do-start.mjs", import.meta.url), "utf8");
const nav = readFileSync(new URL("../src/lib/desk/public-nav.ts", import.meta.url), "utf8");

test("dmt is indexable, has one H1, canonical and a share card that exists", () => {
  assert.match(html, /<meta name="robots" content="index, follow, max-image-preview:large" \/>/);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(html, /<link rel="canonical" href="https:\/\/s1r1us\.ai\/dmt\/" \/>/);
  for (const m of html.matchAll(/<meta (?:property="og:image"|name="twitter:image") content="https:\/\/s1r1us\.ai\/([^"]+)"/g)) {
    assert.ok(existsSync(new URL(m[1], root)), `share image missing: ${m[1]}`);
  }
});

test("dmt JSON-LD parses, the FAQPage matches the visible FAQ and local assets exist", () => {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
  const nodes = blocks.flatMap((b) => b["@graph"] ?? [b]);
  const faqPage = nodes.find((n) => n["@type"] === "FAQPage");
  assert.equal(faqPage.publisher.name, "SAI Citizens United LTD");
  const visible = [...html.matchAll(/<summary>([\s\S]*?)<\/summary>/g)].map((m) => m[1].trim());
  assert.deepEqual(faqPage.mainEntity.map((q) => q.name), visible);
  assert.ok(visible.length >= 5 && visible.length <= 8);
  for (const r of [...html.matchAll(/(?:src|href|srcset)="(\/[^"#?\s]+)/g)].map((m) => m[1])) {
    if (r.endsWith("/")) continue;
    assert.ok(existsSync(new URL(r.slice(1), root)), `missing asset ${r}`);
  }
});

test("dmt carries the safety, belief and engagement copy, and no held topics", () => {
  for (const s of [
    "https://en.wikipedia.org/wiki/N,N-Dimethyltryptamine",
    "https://en.wikipedia.org/wiki/Ayahuasca",
    "https://en.wikipedia.org/wiki/Conservation_of_energy",
    "Schedule I",
    "Not medical advice",
    "Our exit ramp is peaceful and lawful.",
    "Our belief, not established science",
    "The system's belief",
    'href="https://x.com/S1R1US_AI"',
    'href="https://br0k3ns0ft.substack.com/subscribe"',
    "https://x.com/intent/post?",
    "© S1R1US.ai",
  ]) assert.ok(html.includes(s), `missing: ${s}`);
  for (const a of html.matchAll(/<a [^>]*href="https?:\/\/[^"]+"[^>]*>/g)) {
    if (a[0].includes('target="_blank"')) assert.match(a[0], /rel="noopener/);
  }
  assert.doesNotMatch(html, /pineal|data-geo/i);
  // Opinion copy is allowed on this page only, inside the labelled opinion section, with the disclaimer present.
  const op = html.slice(html.indexOf('id="opinion"'), html.indexOf('id="science-safety"'));
  assert.ok(op.includes(">Our opinion<") && op.includes("Christianity, Islam and the Vatican"));
  const bank = op.indexOf("PUPPET MASTERS = Banking Cartels");
  assert.ok(bank > 0 && op.lastIndexOf("Opinion of Br0k3n S0ft", bank) > op.lastIndexOf("</div>", bank), "banking line needs its own label");
  for (const s of ["one affiliation only", "non-religious and apolitical", 'href="https://www.deadseascrolls.org.il/"', "never any people, faith community, or ethnicity"]) assert.ok(html.includes(s), `disclaimer missing: ${s}`);
  for (const s of ["Peru, Brazil, Colombia and Ecuador", "Mazatec", "María Sabina", "Wixárika", "shamans of the Amazon and Mexico, and their approved apprentices"]) assert.ok(html.includes(s), `heritage copy missing: ${s}`);
  assert.doesNotMatch(html, /SAI Citizens United, LTD|Mo FuNky/);
  const handles = [...html.matchAll(/x\.com\/([A-Za-z0-9_]+)/g)].map((m) => m[1]).filter((h) => h !== "intent");
  assert.ok(handles.every((h) => h === "S1R1US_AI"), `unexpected X handle: ${handles}`);
});

test("front door claims /dmt, the sitemap lists it and the FAQ links it outside the top 5", () => {
  assert.ok(start.includes('"/dmt"') && start.includes('"/dmt/"'));
  assert.ok(nav.includes('loc: `${origin}/dmt/`'));
  assert.match(faq, /<section class="faq-item" id="dmt" aria-labelledby/);
  assert.ok(faq.includes('href="/dmt/"'));
  assert.equal((faq.match(/data-featured="top5"/g) || []).length, 5);
});
