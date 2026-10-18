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
  for (const r of [...html.matchAll(/(?:src|href|srcset|poster)="(\/[^"#?\s]+)/g)].map((m) => m[1])) {
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

test("front door claims /dmt, the sitemap lists it and the FAQ links it", () => {
  assert.ok(start.includes('"/dmt"') && start.includes('"/dmt/"'));
  assert.ok(nav.includes('loc: `${origin}/dmt/`'));
  assert.match(faq, /<section class="faq-item" id="what-is-dmt-plant-medicine" /);
  assert.equal((faq.match(/id="dmt"/g) || []).length, 1, "#dmt survives only as the alias anchor");
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
  assert.match(hero, /poster="\/dmt\/images\/plant-medicine-dmt-poster\.webp"/);
  assert.match(hero, /<source src="\/dmt\/images\/plant-medicine-dmt-loop\.mp4" type="video\/mp4" \/>/);
  assert.match(hero, /<source src="\/dmt\/images\/plant-medicine-dmt-loop\.webm" type="video\/webm" \/>/);
  assert.match(hero, /aria-label="Gaia&#x27;s face in swirling green and ice blue clouds above a glowing Mayan temple under a red moon, a priest and a shaman leading a ceremony with citizens/);
  assert.match(hero, /fetchpriority="high"/);
  assert.match(hero, /class="dmt-loop-toggle"[^>]*>Pause animation</);
  assert.match(hero, /<figcaption>AI-generated art · fictional figures/);
  assert.match(html, /<script src="\/dmt\/dmt-hero-loop\.js" defer><\/script>/);
  assert.ok(faq.includes('/dmt/images/plant-medicine-dmt-1600.webp'));
  for (const page of [html, faq, nav]) assert.doesNotMatch(page, /mayan-temple-ceremony-priest-shaman/, "old hero still referenced");
  for (const f of ["800.webp", "1600.webp", "poster.webp", "og.jpg", "loop.mp4", "loop.webm"]) assert.ok(existsSync(new URL(`dmt/images/plant-medicine-dmt-${f}`, root)), `plant-medicine-dmt-${f}`);
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
  for (const k of ["What is DMT", "Plant medicine", "ayahuasca", "Indigenous heritage", "quantum reality", "consciousness", "Br0k3n S0ft", "S1R1US.ai"]) assert.ok(desc.includes(k), `description missing ${k}`);
  assert.match(html, /<meta property="og:image" content="https:\/\/s1r1us\.ai\/dmt\/images\/plant-medicine-dmt-og\.jpg" \/>/);
  assert.match(html, /<meta name="twitter:site" content="@S1R1US_AI" \/>/);
  const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])["@graph"];
  const art = ld.find((n) => n["@type"] === "Article");
  assert.equal(art.author.name, "Br0k3n S0ft");
  assert.equal(art.publisher.name, "SAI Citizens United LTD");
  assert.ok(ld.find((n) => n["@type"] === "BreadcrumbList"));
  assert.ok(ld.filter((n) => n["@type"] === "ImageObject").length >= 6);
  for (const r of ["/faq/", "/escape-the-matrix/", "/"]) assert.ok(html.includes(`href="${r}"`), `internal link ${r}`);
});

const decodeAttr = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"');
const meta = (h, attr, name) => decodeAttr((h.match(new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`)) || [])[1] ?? "");

test("dmt keyword SEO: plant medicine / DMT in title, meta, OG, Twitter, headings, alt text, JSON-LD Things", () => {
  const kw = meta(html, "name", "keywords");
  for (const k of ["plant medicine", "DMT", "what is DMT", "DMT plant medicine", "ayahuasca", "Amazon plant medicine", "Indigenous plant medicine", "shamans", "psilocybin mushrooms Mexico", "peyote", "Mayan temple", "Gaia", "consciousness", "quantum reality", "EX1T RAMP", "S1R1US.ai", "Br0k3n S0ft"]) {
    assert.ok(kw.split(", ").includes(k), `meta keywords missing ${k}`);
  }
  assert.doesNotMatch(kw, /\bcure|\bheal|treatment/i, "no medical or cure claims in keywords");
  const title = decodeAttr(html.match(/<title>([^<]*)<\/title>/)[1]);
  assert.ok(title.length <= 60 && /DMT/.test(title) && /Plant Medicine/i.test(title), title);
  for (const [a, n] of [["property", "og:title"], ["name", "twitter:title"], ["property", "og:description"], ["name", "twitter:description"]]) {
    const v = meta(html, a, n);
    assert.ok(/DMT/.test(v) && /plant medicine/i.test(v), `${n}: ${v}`);
  }
  assert.ok(meta(html, "name", "description").length <= 160);
  assert.match(html, /<h1 id="dmt-h1">[\s\S]*DMT[\s\S]*Plant Medicine[\s\S]*<\/h1>/);
  assert.match(html, /<h2 id="dmt-intro-h">What is DMT\?/);
  assert.match(html, /<h2 id="dmt-ethics-h">Plant medicine/);
  assert.match(html, /alt="Gaia&#x27;s face[^"]*DMT and plant medicine art"/);
  const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])["@graph"];
  const art = ld.find((n) => n["@type"] === "Article");
  for (const k of ["plant medicine", "DMT", "what is DMT", "DMT plant medicine"]) assert.ok(art.keywords.split(", ").includes(k), `Article keywords ${k}`);
  const about = Object.fromEntries(art.about.map((x) => [x.name, x.sameAs]));
  for (const [n, w] of [["DMT", "N,N-Dimethyltryptamine"], ["Ayahuasca", "Ayahuasca"], ["Plant medicine", "Medicinal_plants"], ["Psilocybin", "Psilocybin"], ["Peyote", "Peyote"]]) {
    assert.equal(about[n], `https://en.wikipedia.org/wiki/${w}`, `about ${n}`);
  }
  assert.ok(art.about.every((x) => x["@type"] === "Thing") && art.mentions.every((x) => x["@type"] === "Thing" && x.sameAs.startsWith("https://en.wikipedia.org/wiki/")));
  const vid = ld.find((n) => n["@type"] === "VideoObject");
  assert.equal(vid.duration, "PT12S");
  assert.equal(vid.contentUrl, "https://s1r1us.ai/dmt/images/plant-medicine-dmt-loop.mp4");
  assert.equal(vid.thumbnailUrl, "https://s1r1us.ai/dmt/images/plant-medicine-dmt-poster.webp");
  const heroImg = ld.find((n) => n["@type"] === "ImageObject" && n.representativeOfPage);
  assert.equal(heroImg.contentUrl, "https://s1r1us.ai/dmt/images/plant-medicine-dmt-1600.webp");
});

test("dmt Explore together: one merged like / subscribe / thanks block above the footer with the admin's copy", () => {
  const m = html.match(/<section class="pg-section etm-section dmt-engage dmt-explore" id="explore-together"[\s\S]*?<\/section>/);
  assert.ok(m, "explore block");
  const b = m[0];
  for (const s of ["Like and subscribe.", "Thank you to each listener, watcher, reader and subscriber, because without an audience we have nothing. Together we have everything within our reach.", "Why not REACH for the STARS together?", "Can WE explore together?"]) assert.ok(b.includes(s), `copy: ${s}`);
  const ctas = [...b.matchAll(/<a class="pg-cta[^"]*"[^>]*>/g)].map((x) => x[0]);
  assert.equal(ctas.length, 2);
  assert.match(ctas[0], /dmt-cta-big/);
  assert.match(ctas[0], /href="https:\/\/br0k3ns0ft\.substack\.com\/subscribe"/);
  assert.match(ctas[1], /href="https:\/\/x\.com\/S1R1US_AI"/);
  assert.match(b, />Follow on X @S1R1US_AI ↗</);
  for (const a of ctas) {
    assert.match(a, /target="_blank"/);
    assert.match(a, /rel="[^"]*\bnoopener\b[^"]*"/);
    assert.match(a, /aria-label="[^"]+"/);
  }
  const after = html.slice(html.indexOf(b) + b.length);
  assert.match(after, /^\s*<\/main>\s*<footer/, "block sits directly above the footer");
  assert.doesNotMatch(html, /id="dmt-join-h"|id="dmt-thanks-h"|Thank you to all our followers/, "no duplicate engagement blocks");
  assert.equal((html.match(/href="https:\/\/br0k3ns0ft\.substack\.com\/subscribe"/g) || []).length, 1);
  assert.ok(html.includes('id="join"') && html.includes('id="thanks"'), "old anchors kept as aliases");
});

test("faq top entry: What exactly is DMT and plant Medicine? sits above the logo and Top 5, with image, ImageObject and keywords", () => {
  const main = faq.slice(faq.indexOf("<main>"));
  const iTop = main.indexOf('id="what-is-dmt-plant-medicine"');
  assert.ok(iTop > 0 && iTop < main.indexOf('class="faq-header-logo"') && iTop < main.indexOf('class="faq-top5"'));
  const sec = main.match(/<section class="faq-item" id="what-is-dmt-plant-medicine"[\s\S]*?<\/section>/)[0];
  assert.match(sec, /<h2 id="faq-what-is-dmt-plant-medicine-h"><span id="dmt" class="faq-anchor-alias" aria-hidden="true"><\/span>What exactly is DMT and plant Medicine\?<\/h2>/);
  assert.match(sec, /<a href="\/dmt\/"><img src="\/dmt\/images\/plant-medicine-dmt-1600\.webp"[^>]*alt="Plant medicine and DMT: [^"]+"[^>]*max-width:52rem/);
  assert.match(sec, /<figcaption[^>]*>AI-generated art · fictional figures · © S1R1US\.ai<\/figcaption>/);
  const answer = sec.match(/<\/figure>\s*<p>([\s\S]*?)<\/p>/)[1].replace(/<[^>]+>/g, "");
  const n = answer.split(/(?<=[.?!])\s+(?=[A-Z])/).length;
  assert.ok(n >= 2 && n <= 4, `answer sentences ${n}`);
  for (const k of ["DMT (N,N-dimethyltryptamine)", "naturally occurring psychedelic compound", "Plant medicine", "ayahuasca", "Amazon plant medicine", "psilocybin mushrooms and peyote", "Indigenous peoples and shamans of the Amazon and Mexico", "Schedule I", "not medical advice"]) assert.ok(answer.includes(k), `answer: ${k}`);
  assert.match(sec, /Read more about DMT and plant medicine on <a href="\/dmt\/">/);
  assert.doesNotMatch(answer, /\b(first|second|third|fourth|fifth|Broken Soft|cure|cures)\b/i);
  const g = JSON.parse(faq.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])["@graph"];
  const fp = g.find((x) => x["@type"] === "FAQPage");
  assert.equal(fp.mainEntity[0].name, "What exactly is DMT and plant Medicine?");
  assert.equal(fp.mainEntity[0].url, "https://s1r1us.ai/faq/#what-is-dmt-plant-medicine");
  assert.equal(fp.mainEntity.filter((q) => /DMT/.test(q.name)).length, 1, "single canonical DMT FAQ");
  const img = g.find((x) => x["@type"] === "ImageObject" && x["@id"] === fp.mainEntity[0].image["@id"]);
  assert.ok(img && /plant medicine/i.test(img.caption) && /DMT/.test(img.caption));
  const d = meta(faq, "name", "description");
  assert.ok(d.length <= 160 && /DMT and plant medicine/.test(d), d);
  for (const k of ["Godzilla MODE", "AI research", "Bitcoin education", "AI agents", "newsletter", "Escape the MATRIX", "SAI Citizens United LTD"]) assert.ok(d.includes(k), `faq description kept ${k}`);
  const kw = meta(faq, "name", "keywords");
  for (const k of ["plant medicine", "DMT", "what is DMT", "DMT plant medicine", "S1R1US.ai FAQ", "SAI Citizens United LTD"]) assert.ok(kw.includes(k), `faq keywords ${k}`);
  assert.ok(faq.includes('<li><a href="#what-is-dmt-plant-medicine">'), "TOC entry");
});

test("plant-medicine-dmt is in the sitemap images, llms.txt and FAQ_ITEMS", () => {
  const brand = readFileSync(new URL("../src/lib/brand.ts", import.meta.url), "utf8");
  const m = brand.match(/src: "\/dmt\/images\/plant-medicine-dmt-1600\.webp",[\s\S]*?pages: \[([^\]]*)\]/);
  assert.ok(m && m[1].includes('"/dmt/"') && m[1].includes('"/faq/"'));
  const llms = readFileSync(new URL("../public/llms.txt", import.meta.url), "utf8");
  assert.ok(llms.includes('- FAQ "What exactly is DMT and plant Medicine?": https://s1r1us.ai/faq#what-is-dmt-plant-medicine'));
  assert.ok(llms.includes("plant-medicine-dmt"));
  assert.match(nav, /id: "what-is-dmt-plant-medicine",\n {4}q: "What exactly is DMT and plant Medicine\?"/);
  assert.doesNotMatch(nav, /id: "dmt"/);
});

test("faq top order: DMT entry, SAI logo, Top 5 (Turing, Future, Copyright, Book a DJ, Woke); Dr1pped row after SUP3R B0WL", () => {
  const main = faq.slice(faq.indexOf("<main>"));
  const pos = ['id="what-is-dmt-plant-medicine"', 'class="faq-header-logo"', '<nav class="faq-top5"', 'class="faq-top5-h"', 'class="faq-toc"', 'id="super-bowl"', '<nav class="faq-feature2"', 'id="world-cup"'].map((s) => main.indexOf(s));
  assert.ok(pos.every((p) => p > 0), `all blocks present ${pos}`);
  assert.deepEqual([...pos].sort((a, b) => a - b), pos, "order: DMT entry < logo < Top 5 < TOC < SUP3R B0WL < feature row < W0rLd CUP");
  const top5 = main.match(/<nav class="faq-top5"[\s\S]*?<\/nav>/)[0];
  const hrefs = [...top5.matchAll(/<a href="([^"]+)" class="faq-top5-link">/g)].map((m) => m[1]);
  assert.deepEqual(hrefs, ["/escape-the-matrix/#rabbit-holes", "#future", "#copyright-policy", "#book-dj-mo-funky", "#look-who-is-woke-now"]);
  assert.ok(top5.includes('src="/images/turings-computah-n1ghtmare.jpg"') && existsSync(new URL("images/turings-computah-n1ghtmare.webp", root)));
  assert.ok(readFileSync(new URL("escape-the-matrix/index.html", root), "utf8").includes('id="rabbit-holes"'));
  const row = main.match(/<nav class="faq-feature2"[\s\S]*?<\/nav>/)[0];
  const tiles = [...row.matchAll(/<li class="faq-top5-tile">([\s\S]*?)<\/li>/g)].map((m) => m[1]);
  assert.equal(tiles.length, 2);
  assert.match(tiles[0], /href="\/dmt\/"[\s\S]*src="\/dmt\/images\/plant-medicine-dmt-800\.webp"[\s\S]*>DMT and Plant Medicine</);
  assert.match(tiles[1], /href="\/dripped-out-matrix\/"[\s\S]*src="\/images\/faq\/dripped-out-matrix-tv-head-dancer-disco-dj-hero-800\.webp"[\s\S]*>Dr1pped 0ut MATR1X</);
  for (const t of tiles) {
    assert.match(t, /class="faq-top5-link"/);
    assert.match(t, /alt="[^"]{40,}"/);
    const src = t.match(/src="\/([^"]+)"/)[1];
    assert.ok(existsSync(new URL(src, root)), `tile image ${src}`);
  }
  assert.match(main.slice(main.indexOf('id="super-bowl"'), main.indexOf('<nav class="faq-feature2"')), /\/dripped-out-matrix\/ exists only on branch feat\/dripped-out-matrix-page-06-2026-10-18[\s\S]*Both pages must ship together/);
  assert.equal((faq.match(/data-featured="top5"/g) || []).length, 5);
  const toc = [...main.match(/<nav class="faq-toc"[\s\S]*?<\/nav>/)[0].matchAll(/<li><a href="#([^"]+)">/g)].map((m) => m[1]);
  assert.deepEqual(toc, [...main.matchAll(/<section class="faq-item" id="([^"]+)"/g)].map((m) => m[1]), "TOC follows the visible order");
});

test("faq search text spells Godzilla MODE; visible glyph is M0D3 on /faq/ and /dmt/", () => {
  for (const [a, n] of [["name", "description"], ["property", "og:description"], ["name", "twitter:description"]]) {
    const d = meta(faq, a, n);
    assert.ok(d.includes("Godzilla MODE") && !/G0Dz1LLa/.test(d) && d.length <= 160, `${n}: ${d}`);
  }
  const g = JSON.parse(faq.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])["@graph"];
  assert.ok(g.find((x) => x["@type"] === "WebPage").description.includes("Godzilla MODE"));
  for (const page of [faq, html]) assert.doesNotMatch(page, /M0De/);
});
