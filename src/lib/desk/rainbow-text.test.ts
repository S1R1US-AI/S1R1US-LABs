import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { splitRainbowText } from "./rainbow-text.ts";

describe("splitRainbowText", () => {
  it("styles 'G0Dz1LLa M0D3 AUTO' as one rainbow name", () => {
    assert.deepEqual(splitRainbowText("G0Dz1LLa M0D3 AUTO paper"), [
      { text: "G0Dz1LLa M0D3 AUTO", style: "rainbow" },
      { text: " paper", style: "plain" },
    ]);
  });

  it("styles 'G0Dz1LLa M0D3 M@NU@L' and the bare name", () => {
    assert.deepEqual(
      splitRainbowText("G0Dz1LLa M0D3 M@NU@L live and G0Dz1LLa M0D3").map((p) => [p.text, p.style]),
      [
        ["G0Dz1LLa M0D3 M@NU@L", "rainbow"],
        [" live and ", "plain"],
        ["G0Dz1LLa M0D3", "rainbow"],
      ],
    );
  });

  it("still styles the older spellings", () => {
    const styled = splitRainbowText("G M0D3 AUTO, G M0D3 M@NU@L, G0DZ1LLa M0D3")
      .filter((p) => p.style === "rainbow")
      .map((p) => p.text);
    assert.deepEqual(styled, ["G M0D3 AUTO", "G M0D3 M@NU@L", "G0DZ1LLa M0D3"]);
  });

  it("keeps prediction names gold and plain text plain", () => {
    assert.deepEqual(splitRainbowText("S1R1US Pr3d1ctions"), [{ text: "S1R1US Pr3d1ctions", style: "gold" }]);
    assert.deepEqual(splitRainbowText("nothing here"), [{ text: "nothing here", style: "plain" }]);
  });
});
