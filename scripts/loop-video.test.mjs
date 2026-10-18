// Shared page video loop (/js/loop-video.js) and the /dripped-out-matrix/ dance video markup.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import vm from "node:vm";
import { jsonLd } from "./lib/html-tokens.mjs";

const src = readFileSync(new URL("../front-door-static/js/loop-video.js", import.meta.url), "utf8");
const root = new URL("../front-door-static/", import.meta.url);
const html = readFileSync(new URL("dripped-out-matrix/index.html", root), "utf8");

function setup({ blocked, io = true }) {
  class Node {
    constructor() { this.l = {}; }
    addEventListener(t, f) { (this.l[t] ||= []).push(f); }
    removeEventListener(t, f) { this.l[t] = (this.l[t] || []).filter((x) => x !== f); }
    fire(t, e = {}) { for (const f of [...(this.l[t] || [])]) f({ target: this, preventDefault() {}, ...e }); }
  }
  const env = { blocked, plays: 0 };
  const btn = new Node();
  Object.assign(btn, { hidden: true, textContent: "Pause video", attrs: {}, setAttribute(k, v) { this.attrs[k] = v; }, contains: (t) => t === btn });
  const v = new Node();
  Object.assign(v, {
    paused: true, controls: true, preload: "none", attrs: { controls: "" }, setAttribute(k, val) { this.attrs[k] = val; },
    removeAttribute(k) { delete this.attrs[k]; },
    parentNode: { querySelector: () => btn },
    play() {
      env.plays++;
      if (env.blocked) return Promise.reject(new Error("NotAllowedError"));
      this.paused = false; this.fire("play"); return Promise.resolve();
    },
    pause() { this.paused = true; this.fire("pause"); },
  });
  const doc = new Node();
  Object.assign(doc, { hidden: false, querySelectorAll: () => [v] });
  let cb = null;
  class IntersectionObserver { constructor(f) { cb = f; } observe() {} }
  const view = (on) => cb([{ isIntersecting: on, target: v }]);
  const ctx = { document: doc, Node };
  if (io) ctx.IntersectionObserver = IntersectionObserver;
  vm.runInNewContext(src, ctx);
  const click = () => { env.blocked = false; doc.fire("pointerdown", { target: btn }); btn.fire("click"); };
  return { env, btn, v, doc, view, click };
}
const tick = () => new Promise((r) => setImmediate(r));

test("loop video: loads nothing until in view, then autoplays muted and loops; Pause stays visible", async () => {
  const { env, btn, v, view } = setup({ blocked: false });
  await tick();
  assert.equal(env.plays, 0, "no playback before the video is near the viewport");
  assert.equal(v.preload, "none");
  assert.equal(btn.hidden, false);
  assert.equal(v.controls, false, "native controls removed once Pause is wired");
  view(true); await tick();
  assert.equal(v.paused, false);
  assert.equal(v.loop, true);
  assert.equal(v.muted, true);
  assert.equal(v.playsInline, true);
  assert.equal(btn.textContent, "Pause video");
  assert.equal(btn.attrs["aria-label"], "Pause video");
  assert.equal(btn.attrs["aria-pressed"], undefined, "label-only pattern: no aria-pressed");
});

test("loop video: Pause is honoured; scrolling out and back in does not undo it", async () => {
  const { btn, v, view } = setup({ blocked: false });
  view(true); await tick();
  btn.fire("click"); await tick();
  assert.equal(v.paused, true);
  assert.equal(btn.textContent, "Play video");
  assert.equal(btn.attrs["aria-label"], "Play video");
  assert.equal(btn.attrs["aria-pressed"], undefined);
  view(false); view(true); await tick();
  assert.equal(v.paused, true, "user pause sticks");
  btn.fire("click"); await tick();
  assert.equal(v.paused, false);
});

test("loop video: off screen pauses quietly and resumes in view", async () => {
  const { v, view } = setup({ blocked: false });
  view(true); await tick();
  view(false); await tick();
  assert.equal(v.paused, true);
  view(true); await tick();
  assert.equal(v.paused, false);
});

test("loop video: blocked autoplay shows Play; one tap on the button starts it once", async () => {
  const { btn, v, view, click } = setup({ blocked: true });
  view(true); await tick();
  assert.equal(v.paused, true);
  assert.equal(btn.textContent, "Play video");
  click(); await tick();
  assert.equal(v.paused, false);
  assert.equal(btn.textContent, "Pause video");
});

test("loop video: keeps looping under reduced motion (no matchMedia check)", () => {
  assert.doesNotMatch(src, /prefers-reduced-motion\)|matchMedia/);
});

test("dripped-out-matrix: dance video markup, caption, JSON-LD and assets", () => {
  const tag = html.match(/<video [^>]*data-loop-video[^>]*>/)[0];
  for (const a of ["muted", "loop", "playsinline", "controls", 'preload="none"', 'width="1280"', 'height="720"']) assert.ok(tag.includes(a), a);
  assert.match(tag, /poster="\/dripped-out-matrix\/video\/[a-z0-9-]+-poster\.webp"/);
  assert.match(html, /<button type="button" class="dom-loop-toggle" data-loop-toggle aria-label="Pause video" hidden>Pause video<\/button>/);
  assert.doesNotMatch(src, /aria-pressed/, "label-only toggle");
  const sec = html.slice(html.indexOf('id="dance-video"'), html.indexOf("</main>"));
  assert.doesNotMatch(sec, /aria-pressed|\.webm|video\/webm/, "mp4 + poster only");
  assert.deepEqual([...sec.matchAll(/<source [^>]*type="([^"]+)"/g)].map((x) => x[1]), ["video/mp4"]);
  assert.match(html, /<figcaption>[^<]*© S1R1US\.ai · AI-generated<\/figcaption>/);
  assert.match(html, /<script src="\/js\/loop-video\.js" defer><\/script>/);
  const a = html.indexOf('id="dance-video"'); const m = html.indexOf("</main>");
  assert.ok(a > html.indexOf('id="more"') && a < m, "video is the last section of the page");
  for (const r of [...html.matchAll(/(?:src|poster)="(\/dripped-out-matrix\/video\/[^"]+)"/g)].map((x) => x[1])) {
    assert.ok(existsSync(new URL(r.slice(1), root)), r);
    if (/\.mp4$/.test(r)) assert.ok(statSync(new URL(r.slice(1), root)).size < 12_000_000, `heavy ${r}`);
  }
  const vo = jsonLd(html).flatMap((b) => b["@graph"] || [b]).find((n) => n["@type"] === "VideoObject");
  assert.ok(vo);
  assert.equal(vo.duration, "PT1M30S");
  assert.equal(vo.copyrightNotice, "© S1R1US.ai");
  for (const k of ["contentUrl", "thumbnailUrl"]) assert.ok(existsSync(new URL(vo[k].replace("https://s1r1us.ai/", ""), root)), k);
});
