// Static /dripped-out-matrix/ gallery: indexable, SEO limits, JSON-LD parses, assets exist, engagement copy, house rules, front door serves it.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { isUrl, jsonLd, textUrls, titleText, visibleText } from "./lib/html-tokens.mjs";

const root = new URL("../front-door-static/", import.meta.url);
const html = readFileSync(new URL("dripped-out-matrix/index.html", root), "utf8");
const start = readFileSync(new URL("../scripts/do-start.mjs", import.meta.url), "utf8");
const nav = readFileSync(new URL("../src/lib/desk/public-nav.ts", import.meta.url), "utf8");
const brand = readFileSync(new URL("../src/lib/brand.ts", import.meta.url), "utf8");
const sitemap = readFileSync(new URL("sitemap/index.html", root), "utf8");
const llms = ["../public/llms.txt", "../public/.well-known/llms.txt", "../.output/public/llms.txt", "../.output/public/.well-known/llms.txt"].map((p) =>
  readFileSync(new URL(p, import.meta.url), "utf8"),
);
const ld = jsonLd(html).flatMap((b) => b["@graph"]);
const visible = visibleText(html);

test("dripped-out-matrix: indexable, one H1, canonical, title and description limits, keywords", () => {
  assert.match(html, /<meta name="robots" content="index, follow, max-image-preview:large" \/>/);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(html, /<h1 [^>]*>[\s\S]*Dr1pped 0ut MATR1X[\s\S]*<\/h1>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/s1r1us\.ai\/dripped-out-matrix\/" \/>/);
  const title = titleText(html);
  const desc = html.match(/<meta name="description" content="([^"]*)"/)[1];
  assert.ok(title.length <= 60 && title.startsWith("Dr1pped 0ut MATR1X"), `title ${title.length}`);
  assert.ok(desc.length >= 120 && desc.length <= 160, `description ${desc.length}`);
  const kw = html.match(/<meta name="keywords" content="([^"]*)"/)[1];
  for (const k of ["dripped out matrix", "matrix dance party", "neon disco", "TV head dancer", "robot dance", "skeleton DJ", "matrix rain", "cyberpunk disco", "S1R1US.ai", "Br0k3n S0ft"]) assert.ok(kw.includes(k), `keyword ${k}`);
  assert.doesNotMatch(html, /LOCAL DRAFT|not for publication/);
});

test("dripped-out-matrix: share card 1200x630 exists, twitter card and site", () => {
  assert.match(html, /<meta name="twitter:card" content="summary_large_image" \/>/);
  assert.match(html, /<meta name="twitter:site" content="@S1R1US_AI" \/>/);
  assert.match(html, /<meta property="og:image:width" content="1200" \/>/);
  assert.match(html, /<meta property="og:image:height" content="630" \/>/);
  for (const m of html.matchAll(/<meta (?:property="og:image"|name="twitter:image") content="https:\/\/s1r1us\.ai\/([^"]+)"/g)) {
    assert.ok(existsSync(new URL(m[1], root)), `share image missing: ${m[1]}`);
  }
});

test("dripped-out-matrix: JSON-LD WebPage, ImageGallery, BreadcrumbList and an ImageObject per picture with the company as creator and holder", () => {
  for (const t of ["WebPage", "ImageGallery", "BreadcrumbList"]) assert.ok(ld.find((n) => n["@type"] === t), t);
  const pics = ld.filter((n) => n["@type"] === "ImageObject" && n.width === 1500);
  assert.equal(pics.length, 4);
  for (const o of ld.filter((n) => n["@type"] === "ImageObject")) {
    assert.equal(o.creator.name, "SAI Citizens United LTD");
    assert.equal(o.copyrightHolder.name, "SAI Citizens United LTD");
    assert.ok(existsSync(new URL(o.contentUrl.replace("https://s1r1us.ai/", ""), root)), o.contentUrl);
  }
});

test("dripped-out-matrix: images are WebP srcset with size, alt and caption; only the hero loads eagerly; every local asset exists", () => {
  const imgs = [...html.matchAll(/<img class="dom-img"[^>]*>/g)].map((m) => m[0]);
  assert.equal(imgs.length, 4);
  imgs.forEach((t, i) => {
    assert.match(t, /srcset="[^"]+-800\.webp 800w, [^"]+-1500\.webp 1500w"/);
    assert.match(t, /width="1500" height="844"/);
    assert.match(t, /alt="[^"]{60,}"/);
    if (i === 0) assert.match(t, /fetchpriority="high"/);
    else assert.match(t, /loading="lazy"/);
  });
  assert.equal((html.match(/<figcaption>[^<]*Art © S1R1US\.ai/g) || []).length, 4);
  for (const r of [...html.matchAll(/(?:src|href|srcset|imagesrcset)="(\/[^"#?\s]+)/g)].map((m) => m[1])) {
    if (r.endsWith("/")) continue;
    assert.ok(existsSync(new URL(r.slice(1), root)), `missing asset ${r}`);
  }
  for (const m of html.matchAll(/\/dripped-out-matrix\/images\/([a-z0-9-]+\.(?:webp|jpg))/g)) {
    assert.match(m[1], /^dripped-out-matrix-[a-z0-9-]+$|^dripped-out-matrix-[a-z0-9-]+\.(webp|jpg)$/);
    assert.ok(statSync(new URL(`dripped-out-matrix/images/${m[1]}`, root)).size < 260_000, `heavy image ${m[1]}`);
  }
});

test("dripped-out-matrix: robot crowd image (v1) sits in the final gallery slot; no hold markers remain", () => {
  const a = html.indexOf('id="gallery-more"');
  const b = html.indexOf("</section>", a);
  assert.ok(a > 0 && b > a);
  assert.ok(html.slice(a, b).includes("dripped-out-matrix-robot-dance-party-skeleton-dj-1500.webp"));
  assert.ok(brand.includes("/dripped-out-matrix/images/dripped-out-matrix-robot-dance-party-skeleton-dj-1500.webp"));
  for (const s of [html, brand]) assert.doesNotMatch(s, /ATTORNEY-HOLD|data-hold/);
});

test("dripped-out-matrix: like and subscribe copy, Substack and X buttons, safe external links, internal links on main", () => {
  for (const s of [
    "Like and subscribe.",
    "Thank you to each listener, watcher, reader and subscriber, because without an audience we have nothing. Together we have everything within our reach.",
    "Why not REACH for the STARS together?",
    "Can WE explore together?",
    'href="https://br0k3ns0ft.substack.com/subscribe"',
    'href="https://x.com/S1R1US_AI"',
    'href="/escape-the-matrix/"',
    'href="/dmt/"',
    "© S1R1US.ai",
  ]) assert.ok(html.includes(s), `missing: ${s}`);
  for (const a of html.matchAll(/<a [^>]*href="https?:\/\/[^"]+"[^>]*>/g)) {
    if (a[0].includes('target="_blank"')) assert.match(a[0], /rel="noopener/);
  }
  assert.match(html, /<p class="dom-copy">© S1R1US\.ai<\/p>\s*<\/footer>/);
});

test("dripped-out-matrix: house rules (no DJ names, no ordinals, company spelling, X handle)", () => {
  assert.doesNotMatch(html, /Mo FuNky|SAI Citizens United, LTD/);
  assert.doesNotMatch(visible, /\b(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|1st|2nd|3rd|4th)\b/i);
  const handles = [...html.matchAll(/x\.com\/([A-Za-z0-9_]+)/g)].map((m) => m[1]);
  assert.ok(handles.every((h) => h === "S1R1US_AI"), `unexpected X handle: ${handles}`);
});

test("dripped-out-matrix: front door, sitemaps, brand images and all four llms.txt copies list the route", () => {
  assert.ok(start.includes('"/dripped-out-matrix"') && start.includes('"/dripped-out-matrix/"'));
  assert.ok(start.includes('pathname.startsWith("/dripped-out-matrix/")'));
  assert.ok(nav.includes("loc: `${origin}/dripped-out-matrix/`"));
  assert.ok(sitemap.includes('href="/dripped-out-matrix/"'));
  assert.equal((brand.match(/src: "\/dripped-out-matrix\/images\//g) || []).length, 4);
  for (const t of llms) assert.ok(textUrls(t).some((u) => isUrl(u, "s1r1us.ai", "/dripped-out-matrix/")), "llms.txt links https://s1r1us.ai/dripped-out-matrix/");
  assert.ok(llms.every((t) => t === llms[0]), "llms.txt copies differ");
});

test("dripped-out-matrix: call out to fr43ks sits after the gallery and before subscribe, with the exact copy", () => {
  const copy = "Get u back up OFf tHe WALL and get w it bc this is a NO PARKING Z0N3.  If u don\u2019t get up I will b F0RC3D to give uba ticket $0 g3t FuNky and get wit me.";
  assert.ok(html.includes(`<h2 id="dom-callout-h">call out to fr43ks</h2>`));
  assert.ok(html.includes(`<p class="dom-callout-text">${copy}</p>`), "callout copy must match character for character");
  const at = html.indexOf('id="call-out"');
  assert.ok(at > html.indexOf('id="gallery-more"') && at > html.indexOf('id="gallery"') && at < html.indexOf('id="subscribe"'));
});
