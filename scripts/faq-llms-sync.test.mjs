// Keeps the React FAQ (FAQ_ITEMS -> FAQPage JSON-LD) and every deployed llms.txt copy in sync.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const nav = read("src/lib/desk/public-nav.ts");
const html = read("front-door-static/faq/index.html");

test("FAQ_ITEMS carries the new static FAQ anchors in the same leading order", () => {
  for (const id of ["future", "copyright-policy", "look-who-is-woke-now", "cosmic-c0d3", "newsletter", "escape-the-matrix", "global-uprisings"]) {
    assert.match(nav, new RegExp(`id: "${id}"`), `FAQ_ITEMS missing ${id}`);
    assert.match(html, new RegExp(`class="faq-item" id="${id}"`), `static FAQ missing ${id}`);
  }
  const order = ["future", "copyright-policy", "look-who-is-woke-now"].map((id) => nav.indexOf(`id: "${id}"`));
  assert.deepEqual([...order].sort((a, b) => a - b), order);
});

test("all llms.txt copies are identical to public/llms.txt and carry the PR #205 sections", () => {
  const src = read("public/llms.txt");
  for (const p of ["public/.well-known/llms.txt", ".output/public/llms.txt", ".output/public/.well-known/llms.txt"]) {
    assert.equal(read(p), src, `${p} drifted from public/llms.txt`);
  }
  for (const h of ["## Newsletter", "## Escape the MATRIX", "## Global Uprisings", "## The Future", "## Understanding Numbers as S3CR3T Cosmic C0D3", "/copyright-terms"]) {
    assert.ok(src.includes(h), `llms.txt missing ${h}`);
  }
  assert.doesNotMatch(src, /pineal|third eye|art of war|the wizard|SAI Citizens United, LTD/i);
});
