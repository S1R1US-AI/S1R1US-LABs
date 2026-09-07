import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { MCP_TOOLS } from "./agent-security.ts";

const legalSrc = readFileSync(new URL("../../lib/legal.ts", import.meta.url), "utf8");
const hunterSrc = readFileSync(new URL("./hunter.ts", import.meta.url), "utf8");
const thesisSrc = readFileSync(new URL("./thesis.ts", import.meta.url), "utf8");
const paperSrc = readFileSync(new URL("../../lib/paper.ts", import.meta.url), "utf8");
const llms = readFileSync(new URL("../../../public/llms.txt", import.meta.url), "utf8");
const faqSrc = readFileSync(new URL("./public-nav.ts", import.meta.url), "utf8");

const termIds = new Set([...legalSrc.matchAll(/\bid: "([^"]+)"/g)].map((m) => m[1]));

describe("Terms and Privacy cover every public function", { concurrency: false }, () => {
  it("names championship, hive, lock, tape, agents, saas, FinCEN, WAF, morning, mandate, sim, lab", () => {
    for (const id of [
      "desk",
      "wager",
      "callout",
      "hive",
      "byo",
      "lock3d",
      "roadmap",
      "wallet",
      "bowl",
      "cup",
      "forum",
      "tape",
      "pred",
      "pred-book",
      "pred-live",
      "agents-api",
      "saas",
      "fincen",
      "waf",
      "morning",
      "edu",
      "mandate",
      "sim",
      "lab",
      "gifts",
      "store",
      "twofa",
      "cookies",
      "ugc",
      "children",
      "retention",
    ]) {
      assert.equal(termIds.has(id), true, `missing legal section ${id}`);
    }
  });

  it("FAQ #terms and #privacy exist", () => {
    assert.match(faqSrc, /id: "terms"/);
    assert.match(faqSrc, /id: "privacy"/);
  });

  it("never offers a security, never hive withdraw, never lock_set, never Coinbase create on this host", () => {
    assert.match(legalSrc, /offer to sell/);
    assert.match(legalSrc, /No offer of securities/);
    assert.match(legalSrc, /step s8/);
    assert.match(legalSrc, /LOCKED/);
    assert.match(legalSrc, /there is no lock_set/);
    assert.match(legalSrc, /Practice never arms Coinbase/);
    assert.match(legalSrc, /never sell bitcoin/i);
    assert.equal(MCP_TOOLS.has("hive_withdraw"), false);
    assert.equal(MCP_TOOLS.has("lock_set"), false);
    assert.equal(MCP_TOOLS.has("orders_create"), false);
  });

  it("spells Quant correctly in legal, thesis, paper, and llms", () => {
    for (const [name, src] of [
      ["legal.ts", legalSrc],
      ["thesis.ts", thesisSrc],
      ["paper.ts", paperSrc],
      ["llms.txt", llms],
    ] as const) {
      assert.equal(/Qunat|quan t|Quantsy/i.test(src), false, name);
      assert.match(src, /Quant/);
    }
  });

  it("hunter, thesis, paper, and llms fold the legal update", () => {
    assert.match(hunterSrc, /h-legal/);
    assert.match(thesisSrc, /Terms, Privacy, and operator-facing functions/);
    assert.match(paperSrc, /Terms and Agreements \(\/terms\)/);
    assert.match(llms, /faq#terms/);
    assert.match(llms, /faq#privacy/);
  });
});
