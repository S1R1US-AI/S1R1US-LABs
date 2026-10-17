import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { FEED_TEXT_MAX, decodeFeedText } from "./html-text.ts";

describe("decodeFeedText", () => {
  it("decodes &amp; to &", () => {
    assert.equal(decodeFeedText("Bonds &amp; Gold"), "Bonds & Gold");
  });

  it("decodes &amp; last so escaped entities are not double-decoded", () => {
    assert.equal(decodeFeedText("a &amp;lt; b"), "a &lt; b");
  });

  it("decodes entity-encoded tags to text without re-stripping", () => {
    assert.equal(decodeFeedText("&lt;b&gt;bold&lt;/b&gt;"), "<b>bold</b>");
  });

  it("strips real tags", () => {
    assert.equal(decodeFeedText("<b>BTC</b> up"), "BTC up");
  });

  it("decodes quotes", () => {
    assert.equal(decodeFeedText("&quot;hi&quot; it&#39;s"), "\"hi\" it's");
  });

  it("leaves no '<' from nested tags", () => {
    const out = decodeFeedText("<scr<script>ipt>alert(1)</script>");
    assert.ok(!out.includes("<"), out);
    assert.ok(!out.includes(">"), out);
  });

  it("decodes &#039; and &nbsp;", () => {
    assert.equal(decodeFeedText("it&#039;s&nbsp;live"), "it's live");
    assert.equal(decodeFeedText("a&amp;nbsp;b"), "a&nbsp;b");
  });

  it("caps long nested-bracket input and finishes fast", () => {
    const evil = "<".repeat(25_000) + ">".repeat(25_000);
    const plain = "x".repeat(50_000);
    const t0 = performance.now();
    const out = decodeFeedText(evil);
    const capped = decodeFeedText(plain);
    const ms = performance.now() - t0;
    assert.ok(ms < 200, `took ${ms}ms`);
    assert.ok(!out.includes("<") && !out.includes(">"), out.slice(0, 40));
    assert.equal(capped.length, FEED_TEXT_MAX);
  });
});
