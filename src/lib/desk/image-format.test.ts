import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { imageEncodingFormat } from "./image-format.ts";

describe("imageEncodingFormat", () => {
  it("keeps gif, png and jpeg behaviour", () => {
    assert.equal(imageEncodingFormat("/images/hero.gif"), "image/gif");
    assert.equal(imageEncodingFormat("/images/hero.png"), "image/png");
    assert.equal(imageEncodingFormat("/images/hero.jpg"), "image/jpeg");
    assert.equal(imageEncodingFormat("/images/hero.jpeg"), "image/jpeg");
    assert.equal(imageEncodingFormat("/images/no-extension"), "image/jpeg");
  });
  it("maps webp, avif and svg to their own types", () => {
    assert.equal(imageEncodingFormat("/dmt/images/plant-medicine-dmt-1600.webp"), "image/webp");
    assert.equal(imageEncodingFormat("/images/a.avif"), "image/avif");
    assert.equal(imageEncodingFormat("/images/logo.svg"), "image/svg+xml");
  });
  it("is case-insensitive and ignores query strings, hashes and dots in folder names", () => {
    assert.equal(imageEncodingFormat("/images/A.WEBP"), "image/webp");
    assert.equal(imageEncodingFormat("https://s1r1us.ai/x/y.webp?v=2#top"), "image/webp");
    assert.equal(imageEncodingFormat("/v1.2/photo"), "image/jpeg");
  });
  it("every SITE_IMAGES entry gets the type of its file extension in the search graph", () => {
    const brand = readFileSync(new URL("../brand.ts", import.meta.url), "utf8");
    const graph = readFileSync(new URL("./search-graph.ts", import.meta.url), "utf8");
    assert.match(graph, /encodingFormat: imageEncodingFormat\(img\.src\)/);
    const srcs = [...brand.matchAll(/^\s+src: "(\/[^"]+)"/gm)].map((m) => m[1]);
    const webp = srcs.filter((s) => s.endsWith(".webp"));
    assert.ok(webp.length >= 10, `expected the new WebP images, got ${webp.length}`);
    for (const s of webp) assert.equal(imageEncodingFormat(s), "image/webp", s);
  });
});
