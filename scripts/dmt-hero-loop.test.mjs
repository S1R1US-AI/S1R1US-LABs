// /dmt/ hero loop behaviour (LOGO-ANIM-LOCK) with a tiny fake DOM: autoplay, blocked-autoplay retry,
// and the Pause/Play toggle acting exactly once per activation.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const src = readFileSync(new URL("../front-door-static/dmt/dmt-hero-loop.js", import.meta.url), "utf8");

function setup({ blocked }) {
  class Node {
    constructor() { this.l = {}; }
    addEventListener(t, f) { (this.l[t] ||= []).push(f); }
    removeEventListener(t, f) { this.l[t] = (this.l[t] || []).filter((x) => x !== f); }
    fire(t, e = {}) { for (const f of [...(this.l[t] || [])]) f({ target: this, preventDefault() {}, ...e }); }
  }
  const env = { blocked };
  const btn = new Node();
  Object.assign(btn, { hidden: true, textContent: "Pause animation", attrs: {}, setAttribute(k, v) { this.attrs[k] = v; }, contains: (t) => t === btn });
  const v = new Node();
  Object.assign(v, {
    paused: true, attrs: {}, setAttribute(k, val) { this.attrs[k] = val; },
    parentNode: { querySelector: () => btn },
    play() {
      if (env.blocked) return Promise.reject(new Error("NotAllowedError"));
      this.paused = false; this.fire("play"); return Promise.resolve();
    },
    pause() { this.paused = true; this.fire("pause"); },
  });
  const doc = new Node();
  Object.assign(doc, { hidden: false, querySelectorAll: () => [v] });
  const other = new Node();
  // A user gesture is what lets the browser allow playback again.
  const gesture = (target, type = "pointerdown") => { env.blocked = false; doc.fire(type, { target }); };
  const click = () => { gesture(btn); btn.fire("click"); };
  vm.runInNewContext(src, { document: doc, Node });
  return { env, btn, v, doc, other, gesture, click };
}
const tick = () => new Promise((r) => setImmediate(r));

test("hero loop autoplays, loops and shows Pause", async () => {
  const { btn, v } = setup({ blocked: false });
  await tick();
  assert.equal(v.paused, false);
  assert.equal(v.loop, true);
  assert.equal(btn.hidden, false);
  assert.equal(btn.textContent, "Pause animation");
});

test("blocked autoplay: Play on the toggle starts the loop once and is not undone by the page-wide retry", async () => {
  const { btn, v, click } = setup({ blocked: true });
  await tick();
  assert.equal(v.paused, true);
  assert.equal(btn.textContent, "Play animation");
  click();
  await tick();
  assert.equal(v.paused, false, "toggle click must leave the loop playing");
  assert.equal(btn.textContent, "Pause animation");
});

test("blocked autoplay: keyboard activation of the toggle also plays once", async () => {
  const { btn, v, gesture } = setup({ blocked: true });
  await tick();
  gesture(btn, "keydown");
  btn.fire("click");
  await tick();
  assert.equal(v.paused, false);
  assert.equal(btn.textContent, "Pause animation");
});

test("blocked autoplay: a tap anywhere else retries playback", async () => {
  const { btn, v, other, gesture } = setup({ blocked: true });
  await tick();
  gesture(other);
  await tick();
  assert.equal(v.paused, false);
  assert.equal(btn.textContent, "Pause animation");
});

test("only Pause stops the loop; Play resumes it; gestures elsewhere do not override Pause", async () => {
  const { btn, v, other, click, gesture } = setup({ blocked: false });
  await tick();
  click();
  await tick();
  assert.equal(v.paused, true);
  assert.equal(btn.textContent, "Play animation");
  gesture(other);
  v.fire("ended");
  await tick();
  assert.equal(v.paused, true, "stays paused after Pause");
  click();
  await tick();
  assert.equal(v.paused, false);
  assert.equal(btn.textContent, "Pause animation");
});
