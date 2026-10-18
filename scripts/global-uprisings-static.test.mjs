// /global-uprisings/: the money and surveillance news section (6 official reports), free-licensed image credits and copy rules.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync, existsSync } from "node:fs";

const root = new URL("../front-door-static/", import.meta.url);
const page = readFileSync(new URL("global-uprisings/index.html", root), "utf8");
const graph = JSON.parse(page.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])["@graph"];
const section = page.match(/<section class="pg-section etm-section gu-news" id="money-and-surveillance"[\s\S]*?<\/section>/)[0];
const ids = ["news-india-afp", "news-kenya", "news-indonesia", "news-philippines", "news-serbia", "news-hungary"];

test("six stories, in order, each with a source link, outlet, date and a credited free-licensed photo", () => {
  assert.deepEqual([...section.matchAll(/<li class="gu-news-item" id="([^"]+)"/g)].map((m) => m[1]), ids);
  for (const item of section.split('<li class="gu-news-item"').slice(1)) {
    assert.match(item, /<p class="gu-news-src">Source: <a href="https:\/\/www\.(news24|aljazeera|theguardian|bbc)\.com\//);
    assert.match(item, /srcset="\/images\/global-uprisings\/[a-z0-9-]+-800\.webp 800w, \/images\/global-uprisings\/[a-z0-9-]+-1600\.webp 1600w"/);
    for (const k of ["Title:", "Photo:", "Source:", "License:", "Changes:"]) assert.ok(item.includes(`${k}</span>`), `credit field ${k}`);
    assert.match(item, /href="https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
    assert.match(item, /href="https:\/\/creativecommons\.org\/(licenses\/by(-sa)?\/4\.0|publicdomain\/zero\/1\.0)\/"/);
  }
});

test("AFP story: exact headline and opening sentence in a credited blockquote; no agency photo or screenshot embedded", () => {
  const q = section.match(/<blockquote class="gu-quote"[\s\S]*?<\/blockquote>/)[0];
  assert.ok(q.includes("India detains &#x27;cockroach&#x27; movement leaders in bid to thwart election protest"));
  assert.ok(q.includes("Indian police detained the head of the satirical &quot;cockroach&quot; online movement on Saturday as hundreds of protesters demanding the election commissioner&#x27;s resignation gathered in New Delhi despite a heavy security crackdown."));
  assert.match(q, /Arunabh SAIKIA[\s\S]*© Agence France-Presse/);
  assert.doesNotMatch(page, /<img[^>]+src="https?:\/\/(?!s1r1us\.ai)/);
  assert.doesNotMatch(page, /marked\//);
});

test("new images exist as 800 and 1600 webp, each under 260 KB", () => {
  for (const src of new Set([...section.matchAll(/\/images\/global-uprisings\/([a-z0-9-]+)-(800|1600)\.webp/g)].map((m) => m[0]))) {
    const u = new URL(src.slice(1), root);
    assert.ok(existsSync(u), src);
    assert.ok(statSync(u).size < 260 * 1024, `${src} ${statSync(u).size}`);
  }
});

test("JSON-LD: ItemList of 6 NewsArticles with ImageObjects carrying license and creditText", () => {
  const list = graph.find((n) => n["@id"] === "https://s1r1us.ai/global-uprisings/#money-and-surveillance");
  assert.equal(list.numberOfItems, 6);
  assert.deepEqual(list.itemListElement.map((e) => e.url.split("#")[1]), ids);
  for (const e of list.itemListElement) {
    assert.equal(e.item["@type"], "NewsArticle");
    assert.ok(e.item.headline && e.item.datePublished && e.item.url);
    assert.ok(e.item.image.license && e.item.image.creditText && e.item.image.acquireLicensePage);
  }
});

test("copy rules: Explore together, @S1R1US_AI only, © S1R1US.ai lower right, visible G0Dz1LLa M0D3, no banned names", () => {
  assert.match(page, /id="explore-together"[\s\S]*Can WE explore together\?/);
  assert.match(page, /<p class="gu-copy">© S1R1US\.ai<\/p>\s*<\/footer>/);
  assert.ok(page.includes(">G0Dz1LLa M0D3</a>"));
  assert.deepEqual([...new Set([...page.matchAll(/x\.com\/([A-Za-z0-9_]+)/g)].map((m) => m[1]))], ["S1R1US_AI"]);
  assert.doesNotMatch(page, /Broken Soft|Mo FuNky|SAI Citizens United, LTD|\bDJ\b|\b(first|second|third|fourth|fifth|sixth|seventh)\b(?! Amendment)/i);
  const d = page.match(/<meta name="description" content="([^"]*)"/)[1];
  assert.ok(d.length >= 120 && d.length <= 160, `description ${d.length}`);
});
