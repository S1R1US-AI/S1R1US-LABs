// Static /newsletter/ page: exactly one signup link to the Substack subscribe page, opened safely, with a visible Substack disclosure and no embed or form.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../front-door-static/newsletter/index.html", import.meta.url), "utf8");
const SUBSCRIBE = "https://br0k3ns0ft.substack.com/subscribe";

test("newsletter has exactly one subscribe link, new tab, rel noopener noreferrer", () => {
  const links = [...html.matchAll(/<a\b[^>]*>/g)].map((m) => m[0]).filter((a) => a.includes(SUBSCRIBE));
  assert.equal(links.length, 1, `expected one subscribe link, found ${links.length}`);
  assert.match(links[0], new RegExp(`href="${SUBSCRIBE.replace(/[./]/g, "\\$&")}"`));
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
