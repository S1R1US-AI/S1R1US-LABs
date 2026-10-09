import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { decodeFeedText } from "./html-text.ts";

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
});
