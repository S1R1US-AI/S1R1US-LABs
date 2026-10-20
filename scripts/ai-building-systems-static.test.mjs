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
  assert.ok((html.match(/<figure class="abs-figure /g) || []).length >= 7, "5 medium + chart + photo");
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

test("40 TRILLION links the hero debt clock (#debt-clock) and the Treasury chart carries source + date", () => {
  assert.match(html, /<a href="#debt-clock">40 TRILLION<\/a>/);
  assert.match(html, /<a href="https:\/\/www\.usdebtclock\.org\/" target="_blank" rel="noopener nofollow">usdebtclock\.org ↗<\/a>/);
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

test("debt clock lives once, in the hero (#debt-clock), and 40 TRILLION points to it; econ widgets in #wages-jobs-data-slot in order", () => {
  assert.equal((html.match(/data-s1w="debt-clock"/g) || []).length, 1, "one debt clock on the page");
  assert.doesNotMatch(html, /id="debt-clock-slot"/);
  const h1 = html.indexOf('<h1 id="abs-h1">');
  const clock = html.indexOf('<div class="abs-hero-clock" id="debt-clock">');
  const firstSection = html.indexOf('<section class="pg-section');
  assert.ok(h1 > 0 && clock > h1 && firstSection > clock, "clock is in the hero, under the H1");
  assert.ok(html.slice(clock, clock + 400).includes('data-s1w="debt-clock"'));
  const p40 = html.indexOf(">40 TRILLION</a>");
  const chart = html.indexOf('id="us-national-debt-treasury"');
  assert.ok(p40 > firstSection && chart > p40);
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

// The 50/50 hero (live debt clock + Br0k3n S0ft loop) on both pages.
const BASE = "/images/ai-building-systems/br0k3n-s0ft-ai-building-systems-hero-loop-";
const heroCss = readFileSync(new URL("ai-building-systems/hero-split.css", root), "utf8");
const pageCss = readFileSync(new URL("ai-building-systems/ai-building-systems.css", root), "utf8");
const widgetsCss = readFileSync(new URL("ai-building-systems/econ/econ-widgets.css", root), "utf8");
function heroLoop(src) {
  const lines = src.split("\n").filter((l) => l.includes('class="abs-hero-loop"'));
  assert.equal(lines.length, 1, "the loop markup is a single line (one-line swap A -> B)");
  return lines[0];
}

test("hero loop: autoplay muted loop playsinline video, WebM + MP4 + poster, alt/aria, fetchpriority poster; loop A by default, B is a one-line swap", () => {
  for (const src of [html, faq]) {
    const line = heroLoop(src);
    const v = line.match(/<video\b[^>]*>/)[0];
    for (const a of ["autoplay", "muted", "loop", "playsinline"]) assert.match(v, new RegExp(`\\b${a}\\b`), a);
    assert.match(v, /preload="metadata"/);
    assert.match(v, /width="720" height="720"/);
    assert.ok(v.includes(`poster="${BASE}lightning-embers-poster.jpg"`));
    assert.match(v, /aria-label="Br0k3n S0ft, a hooded figure with a cracked faceted stone face[^"]+"/);
    assert.ok(line.includes(`<source src="${BASE}lightning-embers.webm" type="video/webm" />`));
    assert.ok(line.includes(`<source src="${BASE}lightning-embers.mp4" type="video/mp4" />`));
    assert.ok(line.indexOf(".webm") < line.indexOf(".mp4"), "WebM first");
    const still = line.match(/<img class="abs-hero-loop-still"[^>]*>/)[0];
    assert.ok(still.includes(`src="${BASE}lightning-embers-poster.jpg"`));
    assert.match(still, /fetchpriority="high"/);
    assert.match(still, /alt="Br0k3n S0ft[^"]+"/);
    assert.doesNotMatch(still, /loading="lazy"/);
    // Swapping to loop B only changes this line: every file it names exists for both loops.
    for (const variant of ["lightning-embers", "eye-glow"]) {
      const swapped = line.replaceAll("lightning-embers", variant);
      for (const m of swapped.matchAll(/(?:src|poster)="(\/images\/[^"]+)"/g)) assert.ok(existsSync(new URL(m[1].slice(1), root)), m[1]);
    }
    assert.equal(src.split("\n").filter((l) => l.includes("lightning-embers")).length, 2, "loop name only on the swap note + loop line");
    assert.match(src, /<script src="\/ai-building-systems\/hero-loop\.js" defer><\/script>/);
    assert.match(src, /<script src="\/ai-building-systems\/econ\/debt-clock\.js" defer><\/script>/);
    assert.match(src, /<link rel="stylesheet" href="\/ai-building-systems\/hero-split\.css" \/>/);
    assert.match(src, /<link rel="stylesheet" href="\/ai-building-systems\/econ\/econ-widgets\.css" \/>/);
  }
  // CLS: fixed square box; reduced motion: poster only.
  assert.match(heroCss, /\.abs-hero-loop \{[^}]*aspect-ratio: 1 \/ 1;/);
  assert.match(heroCss, /@media \(prefers-reduced-motion: reduce\) \{\s*\.abs-hero-loop-video \{ display: none; \}\s*\.abs-hero-loop-still \{ display: block; \}/);
  assert.match(heroCss, /grid-template-columns: minmax\(0, 1fr\) minmax\(0, 1fr\)/, "50/50 on desktop");
  const js = readFileSync(new URL("ai-building-systems/hero-loop.js", root), "utf8");
  assert.ok(js.includes("prefers-reduced-motion"));
  assert.ok(!/\beval\(|new Function|innerHTML|\.style\.[a-z]+\s*=|setAttribute\(\s*["']style/.test(js), "CSP-friendly");
});

test("page hero: H1, then the 50/50 split with the clock first (left / first when stacked) and the loop second", () => {
  const h1 = html.indexOf('<h1 id="abs-h1">');
  const split = html.indexOf('<div class="abs-hero-split" id="abs-hero-split">');
  const clock = html.indexOf('class="abs-hero-clock"', split);
  const loop = html.indexOf('class="abs-hero-loop"', split);
  assert.ok(h1 > 0 && split > h1 && clock > split && loop > clock);
  for (const src of [html, faq]) {
    const body = src.slice(src.indexOf("<body"));
    assert.doesNotMatch(body, /cracked-faceted-face-hero/, "static hero placeholder dropped from the page body");
  }
  assert.match(html, /<meta property="og:image" content="https:\/\/s1r1us\.ai\/images\/ai-building-systems\/ai-building-systems-br0k3n-s0ft-og\.jpg" \/>/, "OG file name kept");
});

test("theme v2: page shell uses the shared front-door theme only; econ widgets keep their own palette", () => {
  for (const href of ["/css/theme.css", "/terms/terms.css", "/ai-building-systems/ai-building-systems.css"]) assert.ok(html.includes(`<link rel="stylesheet" href="${href}" />`), href);
  assert.ok(html.indexOf('href="/css/theme.css"') < html.indexOf('href="/ai-building-systems/ai-building-systems.css"'));
  for (const css of [pageCss, heroCss]) {
    assert.doesNotMatch(css, /#3dff1a|61,\s*255,\s*26|--abs-green|--abs-gold|--abs-teal/i, "no page-specific matrix green / private tokens");
    assert.doesNotMatch(css, /linear-gradient\(135deg, #c9a227 0%, #121619 45%/, "no v1 gradient frame");
  }
  for (const t of ["var(--gold)", "var(--teal)", "var(--text)", "var(--line)"]) assert.ok(pageCss.includes(t) || heroCss.includes(t), t);
  assert.ok(html.includes('class="site-header"') && html.includes('class="site-footer"') && html.includes('class="nav"'));
  assert.doesNotMatch(html.slice(html.indexOf("<body")), /\sstyle="/, "no inline styles on the page");
  assert.match(html, /<a class="btn btn-primary" href="https:\/\/br0k3ns0ft\.substack\.com\/subscribe"/);
  // Widgets untouched: approved palette tokens still in econ-widgets.css.
  for (const t of ["--s1w-green: #3dff1a;", "--s1w-panel: #181c20;", "--s1w-warn: #ffcf3d;"]) assert.ok(widgetsCss.includes(t), t);
});

test("Opinion labels are separated from their heading text", () => {
  assert.doesNotMatch(html, /Opinion<\/span>\S/);
  assert.ok(text.includes("Opinion A financial war and an information war"));
  assert.ok(text.includes("Opinion AI, jobs and the bunkers"));
});

test("faq lead: the 50/50 AI Building Systems hero is the first content element in <main>, links the page + FAQ entry, no marketing copy", () => {
  const main = faq.slice(faq.indexOf("<main>") + "<main>".length);
  const first = main.match(/^\s*<([a-z0-9]+)[^>]*>/i);
  assert.ok(first, "main has content");
  assert.equal(first[1], "section", "first element in <main> is the lead hero");
  assert.match(first[0], /class="faq-lead-hero abs-hero-split" id="faq-lead-ai-building-systems"/);
  const end = main.indexOf('<section class="faq-item"');
  const hero = main.slice(0, end);
  for (const tag of ["<h1", "<h2", "faq-header-logo", "faq-top5", "what-is-dmt-plant-medicine"]) {
    assert.ok(main.indexOf(tag) >= end, `${tag} comes after the lead hero`);
  }
  assert.ok(hero.indexOf('data-s1w="debt-clock"') > 0 && hero.indexOf('data-s1w="debt-clock"') < hero.indexOf('class="abs-hero-loop"'), "clock first, then loop");
  assert.equal((faq.match(/data-s1w="debt-clock"/g) || []).length, 1);
  assert.doesNotMatch(faq, /econ-widgets\.js/, "FAQ loads only debt-clock.js");
  const cap = hero.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/)[1];
  assert.ok(cap.includes('href="/ai-building-systems/"') && cap.includes('href="#building-with-grok"'));
  const capText = cap.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  assert.equal(capText, "AI Building Systems · What is it like building with Grok? · AI artwork © SAI Citizens United LTD");
  assert.equal((main.match(/fetchpriority="high"/g) || []).length, 1, "only the lead hero poster is high priority in the FAQ");
  assert.doesNotMatch(hero, /\sstyle="/);
});
