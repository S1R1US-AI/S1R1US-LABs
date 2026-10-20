// Static /blast-off/ page: indexable, JSON-LD parses, every local asset exists, and the front door serves it.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const root = new URL("../front-door-static/", import.meta.url);
const html = readFileSync(new URL("blast-off/index.html", root), "utf8");
const faq = readFileSync(new URL("faq/index.html", root), "utf8");
const start = readFileSync(new URL("../scripts/do-start.mjs", import.meta.url), "utf8");

test("blast-off is indexable, has one H1, canonical and a large share card that exists", () => {
  assert.match(html, /<meta name="robots" content="index, follow, max-image-preview:large" \/>/);
  assert.doesNotMatch(html, /LOCAL DRAFT|class="bo-draft"/);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(html, /<link rel="canonical" href="https:\/\/s1r1us\.ai\/blast-off\/" \/>/);
  assert.match(html, /<meta name="twitter:card" content="summary_large_image" \/>/);
  for (const m of html.matchAll(/<meta (?:property="og:image"|name="twitter:image") content="https:\/\/s1r1us\.ai\/([^"]+)"/g)) {
    assert.ok(existsSync(new URL(m[1], root)), `share image missing: ${m[1]}`);
  }
});

test("blast-off and FAQ JSON-LD parse and every local src/href/srcset file exists", () => {
  for (const page of [html, faq]) {
    for (const m of page.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(m[1]);
    const refs = [...page.matchAll(/(?:src|href|srcset)="(\/[^"#?\s]+)/g)].map((m) => m[1]);
    for (const r of refs) {
      if (r.endsWith("/")) continue;
      assert.ok(existsSync(new URL(r.slice(1), root)), `missing asset ${r}`);
    }
  }
});

test("front door claims /blast-off as a static route", () => {
  assert.ok(start.includes('"/blast-off"') && start.includes('"/blast-off/"'));
  assert.match(faq, /class="faq-item" id="meet-the-humans"/);
  assert.ok(faq.includes('href="/blast-off/#meet-the-humans"'));
  assert.match(html, /id="meet-the-humans"/);
});

const book = readFileSync(new URL("book-dj-mo-funky/index.html", root), "utf8");

test("book-dj-mo-funky is indexable, JSON-LD parses, assets exist and the front door serves it", () => {
  assert.match(book, /<meta name="robots" content="index, follow, max-image-preview:large" \/>/);
  assert.equal((book.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(book, /<link rel="canonical" href="https:\/\/s1r1us\.ai\/book-dj-mo-funky\/" \/>/);
  for (const m of book.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    const ld = JSON.parse(m[1]);
    const person = ld["@graph"].find((n) => n["@type"] === "Person");
    assert.equal(person.name, "DJ i-B Mo FuNky");
    assert.ok(Array.isArray(person.sameAs));
    assert.ok(
      person.sameAs.some((u) => {
        try {
          return new URL(u).href === "https://dji-bmofunky.bandcamp.com/";
        } catch {
          return false;
        }
      }),
      "sameAs must list https://dji-bmofunky.bandcamp.com/",
    );
    assert.equal(ld["@graph"].find((n) => n["@type"] === "Organization").name, "SAI Citizens United LTD");
  }
  for (const r of [...book.matchAll(/(?:src|href|srcset)="(\/[^"#?\s]+)/g)].map((m) => m[1])) {
    if (r.endsWith("/")) continue;
    assert.ok(existsSync(new URL(r.slice(1), root)), `missing asset ${r}`);
  }
  assert.ok(start.includes('"/book-dj-mo-funky"') && start.includes('"/book-dj-mo-funky/"'));
  assert.match(faq, /class="faq-item" id="book-dj-mo-funky"/);
  assert.equal((faq.match(/data-featured="top5"/g) || []).length, 5);
  assert.ok(html.includes('href="https://open.spotify.com/track/3b7doVly0rz4na3rqZUasE"'));
});
