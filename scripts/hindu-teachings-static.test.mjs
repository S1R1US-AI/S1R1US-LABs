// Static /hindu-teachings/ page: indexable, JSON-LD parses, assets exist, approved loops autoplay with no visible controls,
// reduced-motion still, page note, front door serves it, FAQ #6 links it.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, statSync } from "node:fs";

const root = new URL("../front-door-static/", import.meta.url);
const html = readFileSync(new URL("hindu-teachings/index.html", root), "utf8");
const js = readFileSync(new URL("hindu-teachings/ht-loops.js", root), "utf8");
const css = readFileSync(new URL("hindu-teachings/hindu-teachings.css", root), "utf8");
const faq = readFileSync(new URL("faq/index.html", root), "utf8");
const start = readFileSync(new URL("../scripts/do-start.mjs", import.meta.url), "utf8");
const nav = readFileSync(new URL("../src/lib/desk/public-nav.ts", import.meta.url), "utf8");

test("hindu-teachings is indexable with one H1, canonical, and JSON-LD that parses", () => {
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(html, /<link rel="canonical" href="https:\/\/s1r1us\.ai\/hindu-teachings\/" \/>/);
  assert.match(html, /<meta name="robots" content="index, follow" \/>/);
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(m[1]);
  assert.doesNotMatch(html, /<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>/, "no inline scripts");
});

test("every local asset the page references exists", () => {
  const refs = new Set([...html.matchAll(/(?:src|srcset|poster)="(\/(?:images|hindu-teachings)\/[^"\s]+)"/g)].map((m) => m[1]));
  assert.ok(refs.size >= 15);
  for (const r of refs) {
    if (r === "/images/icon-512.png") continue;
    assert.ok(existsSync(new URL(r.slice(1), root)), r);
  }
});

test("approved loops: autoplay muted loop inline, webm then mp4, no controls, keyboard focusable, img fallback inside", () => {
  const vids = [...html.matchAll(/<video\b([^>]*)>([\s\S]*?)<\/video>/g)];
  assert.equal(vids.length, 2);
  for (const [, attrs, inner] of vids) {
    for (const a of ["autoplay", "muted", "loop", "playsinline", 'preload="metadata"', "disablepictureinpicture", 'tabindex="0"', "data-ht-loop"]) assert.ok(attrs.includes(a), a);
    assert.doesNotMatch(attrs, /\bcontrols\b/);
    assert.match(attrs, /aria-label="[^"]+"/);
    assert.match(attrs, /poster="\/images\/[^"]+-poster\.jpg"/);
    assert.ok(inner.indexOf('type="video/webm"') < inner.indexOf('type="video/mp4"'));
    assert.match(inner, /<img [^>]*alt="[^"]+"/);
  }
  assert.ok(html.includes("shiva-brahmastra-magic-hands-loop-v2-1280x720.mp4"));
  assert.ok(html.includes("brahma-lotus-logo-loop-480x480.mp4"));
  assert.doesNotMatch(html, /data-loop-toggle|<button/);
  for (const f of ["shiva-brahmastra-magic-hands-loop-v2-1280x720.mp4", "brahma-lotus-logo-loop-480x480.mp4"]) assert.ok(statSync(new URL(`images/${f}`, root)).size < 4_000_000, f);
  assert.match(html, /<script src="\/hindu-teachings\/ht-loops\.js" defer><\/script>/);
});

test("pause without visible UI (WCAG 2.2.2) and reduced motion shows the still", () => {
  assert.match(js, /addEventListener\('click'/);
  assert.match(js, /e\.key === 'Enter' \|\| e\.key === ' '/);
  assert.match(js, /prefers-reduced-motion: reduce/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.ht-loop \{ display: none !important; \}\s*\.ht-loop-still \{ display: block; \}/);
  assert.equal((html.match(/class="[^"]*ht-loop-still/g) || []).length, 2);
});

test("page note above the footer links Terms and Donations", () => {
  const note = html.match(/<div class="ht-page-note" id="page-note" role="note">([\s\S]*?)<\/div>/)[1];
  assert.ok(note.includes("This page is apolitical and non-religious by affiliation. It is for AI research and education purposes only."));
  assert.ok(note.includes('<a href="/terms">Terms Agreement</a>'));
  assert.ok(note.includes('<a href="/f33d/#donate">Donations</a>'));
  assert.ok(html.indexOf('id="page-note"') < html.indexOf('<footer class="site-footer">'));
});

test("front door claims /hindu-teachings, nav lists it, FAQ #6 links it", () => {
  assert.ok(start.includes('"/hindu-teachings"') && start.includes('"/hindu-teachings/"'));
  assert.ok(nav.includes("loc: `${origin}/hindu-teachings/`"));
  assert.match(faq, /<section class="faq-item" id="steve-jobs-hindu-akashic" /);
  assert.ok(faq.includes('href="/hindu-teachings/"'));
});
