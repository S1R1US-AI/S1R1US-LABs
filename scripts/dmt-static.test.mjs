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

test("dmt images: AI art has srcset, sizes, captions, lazy loading except the hero; wiki cards carry Commons credits", () => {
  const figs = [...html.matchAll(/<figure class="etm-figure dmt-ai-figure">([\s\S]*?)<\/figure>/g)].map((m) => m[1]);
  assert.equal(figs.length, 5);
  figs.forEach((f) => {
    assert.match(f, /srcset="[^"]+-800\.webp 800w, [^"]+-1600\.webp 1600w"/);
    assert.match(f, /width="1600" height="900"/);
    assert.match(f, /<figcaption>AI-generated art/);
    assert.match(f, /loading="lazy"/);
  });
  const hero = html.match(/<figure class="etm-figure dmt-ai-figure dmt-hero-figure">([\s\S]*?)<\/figure>/)[1];
  for (const a of ["autoplay", "muted", "loop", "playsinline"]) assert.match(hero, new RegExp(`<video [^>]*\\b${a}\\b`), `hero video ${a}`);
  assert.match(hero, /poster="\/dmt\/images\/[a-z0-9-]+-poster\.webp"/);
  assert.match(hero, /type="video\/mp4"/);
  assert.match(hero, /type="video\/webm"/);
  assert.match(hero, /fetchpriority="high"/);
  assert.match(hero, /class="dmt-loop-toggle"[^>]*>Pause animation</);
  assert.match(hero, /<figcaption>AI-generated art · fictional figures/);
  assert.ok(faq.includes('/dmt/images/mayan-temple-ceremony-priest-shaman-citizens-red-moon-amazon-jungle-dmt-800.webp'));
  const cards = [...html.matchAll(/<article class="dmt-wikicard">([\s\S]*?)<\/article>/g)].map((m) => m[1]);
  assert.ok(cards.length >= 3);
  for (const c of cards) {
    assert.match(c, /href="https:\/\/en\.wikipedia\.org\/wiki\//);
    assert.match(c, /<img [^>]*width="\d+" height="\d+"[^>]*loading="lazy"/);
    assert.match(c, /class="dmt-credit">Image: [^<]+ · (?:Public domain|<a href="https:\/\/creativecommons\.org\/licenses\/by(?:-sa)?\/4\.0\/")/);
    assert.match(c, /href="https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
  }
});

test("dmt SEO: title and description lengths, OG card 1200x630, Article author, BreadcrumbList", () => {
  const title = html.match(/<title>([^<]*)<\/title>/)[1].replace(/&amp;/g, "&");
  const desc = html.match(/<meta name="description" content="([^"]*)"/)[1];
  assert.ok(title.length >= 50 && title.length <= 65, `title ${title.length}`);
  assert.ok(desc.length >= 140 && desc.length <= 160, `description ${desc.length}`);
  for (const k of ["DMT", "ayahuasca", "plant medicine", "Indigenous heritage", "quantum mechanics", "consciousness", "Br0k3n S0ft", "S1R1US.ai"]) assert.ok(desc.includes(k), `description missing ${k}`);
  assert.match(html, /<meta property="og:image" content="https:\/\/s1r1us\.ai\/dmt\/images\/mayan-temple-ceremony-priest-shaman-citizens-red-moon-amazon-jungle-dmt-og\.jpg" \/>/);
  assert.match(html, /<meta name="twitter:site" content="@S1R1US_AI" \/>/);
  const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])["@graph"];
  const art = ld.find((n) => n["@type"] === "Article");
  assert.equal(art.author.name, "Br0k3n S0ft");
  assert.equal(art.publisher.name, "SAI Citizens United LTD");
  assert.ok(ld.find((n) => n["@type"] === "BreadcrumbList"));
  assert.ok(ld.filter((n) => n["@type"] === "ImageObject").length >= 6);
  for (const r of ["/faq/", "/escape-the-matrix/", "/"]) assert.ok(html.includes(`href="${r}"`), `internal link ${r}`);
});
