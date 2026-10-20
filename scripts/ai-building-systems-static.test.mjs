// Static /ai-building-systems/ page: indexable, JSON-LD parses, assets exist, verbatim copy guard,
// Treasury debt figure + Iran–Contra context box, page note, front door serves it, FAQ links it,
// and no private shorthand in public text.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";

const PRIVATE_HASHES = new Set([
  "54cacb56a6573537b03ee8d7aefd9b1502a057811867797e5b052d4bd1a2c1cb",
  "6b8d6f0050536aed2119d44709945813b0e93b8373b236fbffa17dce2b3670d8",
  "c4423e6a6b93f4e9c021e12e60e17d7edad18e31e0a88d777a5b2f2b963cd042",
  "dbd02553f15536863292492e1ff6fd36169a5d9b7cb3061f1b4ad56eb1b11c6a",
  "faf0d2fe358b7e16cbe5b30983385c26de4f3a673f64217e0e4e0be7981bb18c",
]);

const root = new URL("../front-door-static/", import.meta.url);
const html = readFileSync(new URL("ai-building-systems/index.html", root), "utf8");
const faq = readFileSync(new URL("faq/index.html", root), "utf8");
const start = readFileSync(new URL("../scripts/do-start.mjs", import.meta.url), "utf8");
const nav = readFileSync(new URL("../src/lib/desk/public-nav.ts", import.meta.url), "utf8");
const llms = readFileSync(new URL("../public/llms.txt", import.meta.url), "utf8");
const llmsWk = readFileSync(new URL("../public/.well-known/llms.txt", import.meta.url), "utf8");
const text = html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ");

test("ai-building-systems is indexable with one H1, canonical, and JSON-LD that parses", () => {
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(html, /<link rel="canonical" href="https:\/\/s1r1us\.ai\/ai-building-systems\/" \/>/);
  assert.match(html, /<meta name="robots" content="index, follow[^"]*" \/>/);
  assert.match(html, /<meta property="og:url" content="https:\/\/s1r1us\.ai\/ai-building-systems\/" \/>/);
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.ok(blocks.length >= 1);
  for (const m of blocks) JSON.parse(m[1]);
  assert.doesNotMatch(html, /<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>/, "no inline scripts");
});

test("every local asset the page references exists, images have alt and size", () => {
  const refs = new Set([...html.matchAll(/(?:src|srcset|poster|href)="(\/(?:images|ai-building-systems)\/[^"\s]+)"/g)].map((m) => m[1]));
  for (const m of html.matchAll(/srcset="([^"]+)"/g)) for (const part of m[1].split(",")) refs.add(part.trim().split(/\s+/)[0]);
  assert.ok(refs.size >= 15);
  for (const r of refs) {
    if (!r.startsWith("/images/ai-building-systems/") && !r.startsWith("/ai-building-systems/")) continue;
    assert.ok(existsSync(new URL(r.slice(1), root)), r);
  }
  for (const m of html.matchAll(/<img\b([^>]*)>/g)) {
    assert.match(m[1], /alt="[^"]+"/);
    assert.match(m[1], /width="\d+"/);
    assert.match(m[1], /height="\d+"/);
  }
  assert.ok((html.match(/<figure class="abs-figure/g) || []).length >= 8, "hero + 5 medium + chart + photo");
});

test("system admin copy appears verbatim (only the listed typo fixes) and in order", () => {
  const lines = [
    "When building with AI - I started with a simple goal on a beta version of Grok.",
    "find its way into systems or source code.",
    "I am trying to build a platform that resonates with all people and respects all religions or philosophies.",
    "Military bases are required to protect every trade route and military is CIA front for moving guns and drugs to destabilize any region Uncle Sam sees fit.",
    "EXIT all paper GOLD (ETF), EXIT all paper Bitcoin (ETF).",
    "We have seen enough.",
    "EX1T TH3 MATR1X.",
  ];
  let at = -1;
  for (const l of lines) {
    const i = text.indexOf(l);
    assert.ok(i > at, l);
    at = i;
  }
  assert.ok(!text.includes("We have seem enough") && !text.includes("find it’s way") && !text.includes(" w all people"));
});

test("40 TRILLION links the debt clock (nofollow) and the Treasury chart carries source + date", () => {
  assert.match(html, /<a href="https:\/\/www\.usdebtclock\.org\/" target="_blank" rel="noopener nofollow">40 TRILLION<\/a>/);
  assert.ok(html.includes('href="https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/"'));
  assert.ok(html.includes("Source: U.S. Department of the Treasury, Fiscal Data (public domain)"));
  assert.match(html, /as of [A-Z][a-z]+ \d{1,2}, 20\d\d/);
  assert.doesNotMatch(html, /(?:src|srcset)="https?:\/\/[^"]*usdebtclock/, "never hotlink usdebtclock.org images");
});

test("Iran–Contra context box sits right after the CIA line, with sources and a local public-domain photo", () => {
  const cia = html.indexOf("military is CIA front for moving guns and drugs");
  const box = html.indexOf('<details class="abs-context" id="iran-contra-affair-history">');
  const next = html.indexOf("This is an extremely expensive and dysfunctional way to run government.");
  assert.ok(cia > 0 && box > cia && next > box);
  const b = html.slice(box, html.indexOf("</details>", box));
  assert.ok(b.includes("History: the Iran–Contra affair (1985–1987)"));
  assert.ok(b.includes('href="https://en.wikipedia.org/wiki/Iran%E2%80%93Contra_affair"'));
  assert.ok(b.includes("commons.wikimedia.org/wiki/File:"));
  assert.ok(b.includes("Public domain"));
  assert.ok(b.includes('src="/images/ai-building-systems/iran-contra-affair-reagan-tower-commission-report-1987.jpg"'));
  for (const n of ["14 people", "11 convictions", "December 24, 1992", "February 26, 1987", "Kerry Committee", "Inspector General"]) assert.ok(b.includes(n), n);
});

test("page note above the footer: opinion/education, not financial advice, Terms and Donations", () => {
  const note = html.match(/<div class="abs-page-note" id="page-note" role="note">([\s\S]*?)<\/div>/)[1];
  assert.ok(note.includes("not financial or investment advice"));
  assert.ok(note.includes('<a href="/terms">Terms Agreement</a>'));
  assert.ok(note.includes('<a href="/f33d/#donate">Donations</a>'));
  assert.ok(html.indexOf('id="page-note"') < html.indexOf('<footer class="site-footer">'));
});

test("links FAQ, Escape the MATRIX and the newsletter; build line; no private shorthand", () => {
  for (const h of ['href="/faq/#building-with-grok"', 'href="/escape-the-matrix/"', 'href="/newsletter/"']) assert.ok(html.includes(h), h);
  assert.ok(text.includes("system admin + Research-B0t-06 + bot team"));
  assert.doesNotMatch(text, /\bGrok Bot\b/i);
  // Private shorthand is checked by hash so the guarded strings never appear in the repo.
  const toks = text.toLowerCase().split(/[^a-z0-9_]+/).filter(Boolean);
  const grams = new Set();
  for (let i = 0; i < toks.length; i++) for (let n = 1; n <= 3 && i + n <= toks.length; n++) grams.add(toks.slice(i, i + n).join(" "));
  const hit = [...grams].filter((g) => PRIVATE_HASHES.has(createHash("sha256").update(g).digest("hex")));
  assert.deepEqual(hit, [], "private shorthand in public text");
});

test("front door claims /ai-building-systems, nav + llms list it, FAQ entry links it", () => {
  assert.ok(start.includes('"/ai-building-systems"') && start.includes('"/ai-building-systems/"'));
  assert.ok(nav.includes("loc: `${origin}/ai-building-systems/`"));
  assert.ok(nav.includes('id: "building-with-grok"'));
  assert.equal((faq.match(/id="building-with-grok"/g) || []).length, 1);
  const sec = faq.slice(faq.indexOf('<section class="faq-item" id="building-with-grok"'));
  assert.ok(sec.slice(0, sec.indexOf("</section>")).includes('href="/ai-building-systems/"'));
  assert.ok(llms.includes("https://s1r1us.ai/ai-building-systems/"));
  assert.equal(llms, llmsWk);
});

test("AI, jobs and the bunkers section: verbatim copy, after the wages/jobs data, sourced neutral aside", () => {
  const data = html.indexOf('id="wages-jobs-data-');
  const sec = html.indexOf('<section class="pg-section abs-section abs-copy" id="ai-jobs-and-the-bunkers"');
  const hatch = html.indexOf('id="your-escape-hatch"');
  assert.ok(data > 0 && sec > data && hatch > sec);
  for (const l of [
    "Now they want to replace all jobs. There will be nothing left for citizens.",
    "The AI will dominate professions and only certain protected professions will be allowed.",
    "The Dooms Day bunkers were built by TECHNOCRATS",
    "We will no longer accept this reality.",
  ]) assert.ok(text.includes(l), l);
  const a = html.slice(html.indexOf('id="ai-jobs-bunkers-context"'), html.indexOf("</aside>"));
  for (const n of ["almost 40 percent", "300 million", "5,000-square-foot", "imf.org", "goldmansachs.com", "wired.com"]) assert.ok(a.includes(n), n);
});

test("debt clock sits in #debt-clock-slot right after 40 TRILLION; econ widgets in #wages-jobs-data-slot in order", () => {
  const p40 = html.indexOf(">40 TRILLION</a>");
  const slot = html.indexOf('id="debt-clock-slot"');
  const chart = html.indexOf('id="us-national-debt-treasury"');
  assert.ok(p40 > 0 && slot > p40 && chart > slot);
  assert.ok(html.slice(slot, chart).includes('data-s1w="debt-clock"'));
  const w = html.slice(html.indexOf('id="wages-jobs-data-slot"'), html.indexOf('id="ai-jobs-and-the-bunkers"'));
  const order = ["foreign-holders", "jobs-manufacturing", "jobs-trades", "h1b-callout", "jobs-unions", "jobs-squeeze"].map((n) => w.indexOf(`data-s1w="${n}"`));
  assert.ok(order.every((v, i) => v > 0 && (i === 0 || v > order[i - 1])), String(order));
  assert.match(w, /<h2 id="wages-jobs-data-h">/);
  assert.doesNotMatch(html, /<h2 style=/);
  assert.match(html, /<script src="\/ai-building-systems\/econ\/debt-clock\.js" defer><\/script>/);
  assert.match(html, /<script src="\/ai-building-systems\/econ\/econ-widgets\.js" defer><\/script>/);
  assert.doesNotMatch(html, /<img[^>]+usdebtclock/i);
  const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
  assert.ok(pkg.scripts["econ:refresh"].includes("refresh-econ-data.mjs"));
  assert.ok(!pkg.scripts["build:do"].includes("econ"), "econ:refresh stays out of build:do");
});

test("faq lead: AI Building Systems hero is the first content element in <main>, links the page, responsive, LCP priority, no marketing copy", () => {
  const main = faq.slice(faq.indexOf("<main>") + "<main>".length);
  const first = main.match(/^\s*<([a-z0-9]+)[^>]*>/i);
  assert.ok(first, "main has content");
  assert.equal(first[1], "figure", "first element in <main> is the lead figure");
  assert.match(first[0], /class="faq-lead-hero"/);
  const fig = main.match(/^\s*<figure class="faq-lead-hero"[\s\S]*?<\/figure>/)[0];
  for (const tag of ["<h1", "<h2", "faq-header-logo", "faq-top5", "what-is-dmt-plant-medicine"]) {
    assert.ok(main.indexOf(tag) > fig.length - 10, `${tag} comes after the lead hero`);
  }
  const base = "/images/ai-building-systems/ai-building-systems-br0k3n-s0ft-cracked-faceted-face-hero";
  assert.match(fig, /^\s*<figure[^>]*>\s*<a href="\/ai-building-systems\/"[^>]*><img /);
  assert.ok(fig.includes(`src="${base}.webp"`));
  assert.ok(fig.includes(`srcset="${base}-960w.webp 960w, ${base}.webp 1600w"`));
  assert.match(fig, /width="1600" height="900"/);
  assert.match(fig, /fetchpriority="high"/);
  assert.doesNotMatch(fig, /loading="lazy"/);
  assert.match(fig, /alt="Br0k3n S0ft avatar, a hooded figure with a cracked faceted stone face[^"]+"/);
  for (const f of [`${base}.webp`, `${base}-960w.webp`]) assert.ok(existsSync(new URL(f.slice(1), root)), `${f} exists`);
  const cap = fig.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/)[1];
  assert.ok(cap.includes('href="/ai-building-systems/"') && cap.includes('href="#building-with-grok"'));
  const capText = cap.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  assert.equal(capText, "AI Building Systems · What is it like building with Grok? · AI artwork © SAI Citizens United LTD");
  assert.equal((main.match(/fetchpriority="high"/g) || []).length, 1, "only the lead hero is high priority in the FAQ");
});
