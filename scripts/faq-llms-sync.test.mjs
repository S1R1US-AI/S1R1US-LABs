// Keeps the React FAQ (FAQ_ITEMS -> FAQPage JSON-LD) and every deployed llms.txt copy in sync.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const nav = read("src/lib/desk/public-nav.ts");
const html = read("front-door-static/faq/index.html");

test("FAQ_ITEMS carries the new static FAQ anchors in the same leading order", () => {
  for (const id of ["meet-the-humans", "book-dj-mo-funky", "future", "copyright-policy", "look-who-is-woke-now", "cosmic-c0d3", "newsletter", "escape-the-matrix", "global-uprisings"]) {
    assert.match(nav, new RegExp(`id: "${id}"`), `FAQ_ITEMS missing ${id}`);
    assert.match(html, new RegExp(`class="faq-item" id="${id}"`), `static FAQ missing ${id}`);
  }
  const order = ["meet-the-humans", "book-dj-mo-funky", "future", "copyright-policy", "look-who-is-woke-now"].map((id) => nav.indexOf(`id: "${id}"`));
  assert.deepEqual([...order].sort((a, b) => a - b), order);
});

test("all llms.txt copies are identical to public/llms.txt and carry the PR #205 sections", () => {
  const src = read("public/llms.txt");
  for (const p of ["public/.well-known/llms.txt", ".output/public/llms.txt", ".output/public/.well-known/llms.txt"]) {
    assert.equal(read(p), src, `${p} drifted from public/llms.txt`);
  }
  for (const h of ["## Blast Off", "/faq#meet-the-humans", "/book-dj-mo-funky/", "/faq#book-dj-mo-funky", "## Newsletter", "## Escape the MATRIX", "## Global Uprisings", "## The Future", "## Copyright", "## Understanding Numbers as S3CR3T Cosmic C0D3", "/copyright-terms"]) {
    assert.ok(src.includes(h), `llms.txt missing ${h}`);
  }
  assert.doesNotMatch(src, /pineal|third eye|art of war|the wizard|SAI Citizens United, LTD/i);
});

test("public/.well-known/llms.txt exists, matches public/llms.txt, and has every section", () => {
  const wk = read("public/.well-known/llms.txt");
  assert.equal(wk, read("public/llms.txt"));
  for (const h of ["## Copyright", "## Newsletter", "## Escape the MATRIX", "## Global Uprisings", "## The Future", "Cosmic C0D3", "/copyright-terms"]) {
    assert.ok(wk.includes(h), `.well-known/llms.txt missing ${h}`);
  }
});

test("SEO follow-up: per-page lastmod, branded titles, trimmed descriptions, no ops wording, home links", () => {
  assert.match(nav, /SITEMAP_PAGE_LASTMOD\[u\.loc\] \?\? lastmod/);
  for (const p of ["copyright-terms", "cosmic-c0d3/", "newsletter/"]) assert.ok(nav.includes(`[\`\${origin}/${p}\`]: "2026-10-16"`), `lastmod missing ${p}`);
  for (const [f, t] of [["terms", "Terms and Agreements"], ["privacy", "Privacy Policy"], ["sitemap", "Sitemap"]]) {
    assert.ok(read(`front-door-static/${f}/index.html`).includes(`<title>${t} · S1R1US.ai</title>`), `${f} title`);
  }
  for (const f of ["index.html", "roadmap/index.html", "copyright-terms/index.html", "terms/index.html", "sitemap/index.html"]) {
    const h = read(`front-door-static/${f}`);
    const d = h.match(/<meta name="description" content="([^"]*)"/)[1];
    assert.ok(d.length >= 120 && d.length <= 160, `${f} description length ${d.length}`);
  }
  for (const f of ["index.html", "copyright-terms/index.html"]) {
    assert.doesNotMatch(read(`front-door-static/${f}`), /Soft locks Present|Soft-Launch PARKED|SIM-locked/, f);
  }
  const home = read("front-door-static/index.html");
  assert.ok(home.includes('href="/cosmic-c0d3/"') && home.includes('href="/copyright-terms"'));
  for (const f of ["copyright-terms", "terms", "privacy", "sitemap"]) {
    const c = read(`front-door-static/${f}/index.html`).match(/rel="canonical" href="https:\/\/s1r1us\.ai([^"]*)"/)[1];
    assert.equal(c, `/${f}`, `${f} canonical`);
  }
});
