// Static /newsletter/ page: exactly one signup link to the Substack subscribe page, opened safely, with a visible Substack disclosure and no embed or form.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../front-door-static/newsletter/index.html", import.meta.url), "utf8");
const SUBSCRIBE = "https://br0k3ns0ft.substack.com/subscribe";
const SUBSCRIBE_URL = new URL(SUBSCRIBE);
const hrefOf = (a) => /\bhref="([^"]*)"/.exec(a)?.[1];
const isSubscribe = (h) => {
  try {
    const u = new URL(h);
    return u.protocol === "https:" && u.hostname === SUBSCRIBE_URL.hostname && u.pathname.replace(/\/$/, "") === SUBSCRIBE_URL.pathname;
  } catch {
    return false;
  }
};

test("newsletter has exactly one subscribe link, new tab, rel noopener noreferrer", () => {
  const links = [...html.matchAll(/<a\b[^>]*>/g)].map((m) => m[0]).filter((a) => isSubscribe(hrefOf(a)));
  assert.equal(links.length, 1, `expected one subscribe link, found ${links.length}`);
  assert.equal(hrefOf(links[0]), SUBSCRIBE);
  assert.match(links[0], /\btarget="_blank"/);
  assert.match(links[0], /\brel="noopener noreferrer"/);
  for (const a of html.matchAll(/<a [^>]*target="_blank"[^>]*>/g)) assert.match(a[0], /rel="noopener noreferrer"/);
});

test("newsletter signup discloses Substack and does not embed or collect email", () => {
  assert.ok(html.includes("Free. Delivered by Substack. Unsubscribe any time."));
  assert.ok(html.includes(">Sign up ↗</a>"));
  assert.doesNotMatch(html, /<iframe|<form|type="email"|mailto:/i);
  assert.doesNotMatch(html, /not open yet|signup opens after launch|nl-cta-disabled/i);
});

test("no public copy still says newsletter signup is not open, coming soon or after launch", async () => {
  const { readdirSync, statSync } = await import("node:fs");
  const { join } = await import("node:path");
  const repo = new URL("..", import.meta.url).pathname;
  const files = [];
  const walk = (d) => {
    for (const n of readdirSync(d)) {
      const p = join(d, n);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.(html|txt|json|xml)$/.test(n)) files.push(p);
    }
  };
  walk(join(repo, "front-door-static"));
  for (const p of ["public/llms.txt", "public/.well-known/llms.txt", ".output/public/llms.txt", ".output/public/.well-known/llms.txt", "src/lib/desk/public-nav.ts", "src/components/shell.tsx"]) files.push(join(repo, p));
  const stale = /signup is not open|not open yet|opens after launch|signup after launch|before signup opens|newsletter[^\n]{0,90}?(\(|· )coming soon/i;
  for (const f of files) {
    const text = readFileSync(f, "utf8");
    for (const line of text.split("\n")) {
      if (/newsletter|signup|sign up/i.test(line)) assert.doesNotMatch(line, stale, `stale newsletter wording in ${f.slice(repo.length)}`);
    }
  }
});
