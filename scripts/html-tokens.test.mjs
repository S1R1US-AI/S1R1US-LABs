// Unit tests for the DOM-free HTML tokenizer used by the static page tests.
import { test } from "node:test";
import { decodeEntities, visibleText, jsonLd, titleText, metaContent, isUrl, textUrls } from "./lib/html-tokens.mjs";
import assert from "node:assert/strict";

test("html-tokens: single-pass entity decoding, case-insensitive raw text, comments, quoted attributes, exact URL checks", () => {
  assert.equal(decodeEntities("&amp;lt; &lt; &#x27; &#39; &quot; &bogus;"), "&lt; < ' ' \" &bogus;");
  const h = `<html><head><title>A &amp; B</title><meta name="d" content="x &gt; y"></head><body>Hi<!-- <b>no</b> --><SCRIPT>var a="</div>"</SCRIPT ><sCrIpT type="application/ld+json">{"a":1}</sCrIpT><p title="a>b">Yo <strong>DMT</strong>!</p><style>p{}</style></body></html>`;
  assert.equal(visibleText(h).replace(/\s+/g," ").trim(), "Hi Yo DMT !");
  assert.equal(visibleText(h, { tagSpace: false }), "HiYo DMT!");
  assert.deepEqual(jsonLd(h), [{ a: 1 }]);
  assert.equal(titleText(h), "A & B"); assert.equal(metaContent(h, "name", "d"), "x > y");
  assert.ok(isUrl("https://s1r1us.ai/dripped-out-matrix/", "s1r1us.ai", "/dripped-out-matrix/"));
  assert.ok(!isUrl("https://evil.com/s1r1us.ai/dripped-out-matrix/", "s1r1us.ai", "/dripped-out-matrix/"));
  assert.ok(!isUrl("https://s1r1us.ai.evil.com/dripped-out-matrix/", "s1r1us.ai", "/dripped-out-matrix/"));
  assert.equal(textUrls("see https://s1r1us.ai/dmt/. and (https://x.com/S1R1US_AI)").map(String).join(" "), "https://s1r1us.ai/dmt/ https://x.com/S1R1US_AI");
});
