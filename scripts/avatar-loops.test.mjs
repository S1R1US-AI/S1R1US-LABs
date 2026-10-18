// Avatar loops: autoplay, refused autoplay, user pause and reduced motion.
// Runs front-door-static/js/avatar-loops.js in a small fake DOM (node:vm), no browser needed.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const code = readFileSync(new URL("../front-door-static/js/avatar-loops.js", import.meta.url), "utf8");
const tick = () => new Promise((r) => setTimeout(r, 0));

class El {
  constructor(tag, doc) { this.tagName = tag.toUpperCase(); this.doc = doc; this.attrs = new Map(); this.children = []; this.parentNode = null; this.listeners = {}; this.style = {}; this.hidden = false; this.offsetWidth = 32; this.classList = { set: new Set(), add: (c) => this.classList.set.add(c), toggle: (c, on) => (on ? this.classList.set.add(c) : this.classList.set.delete(c)), contains: (c) => this.classList.set.has(c) }; }
  getAttribute(n) { return this.attrs.has(n) ? this.attrs.get(n) : null; }
  setAttribute(n, v) { this.attrs.set(n, String(v)); if (n === "class") String(v).split(/\s+/).forEach((c) => this.classList.add(c)); }
  removeAttribute(n) { this.attrs.delete(n); }
  hasAttribute(n) { return this.attrs.has(n); }
  set className(v) { this.setAttribute("class", v); }
  get firstChild() { return this.children[0] || null; }
  get nextSibling() { const p = this.parentNode; return p ? p.children[p.children.indexOf(this) + 1] || null : null; }
  appendChild(c) { return this.insertBefore(c, null); }
  insertBefore(c, ref) { c.parentNode = this; const i = ref ? this.children.indexOf(ref) : -1; if (i < 0) this.children.push(c); else this.children.splice(i, 0, c); return c; }
  matches(sel) { return sel === "a" ? this.tagName === "A" : sel.startsWith(".") ? this.classList.contains(sel.slice(1)) : false; }
  closest(sel) { return this.matches(sel) ? this : this.parentNode && this.parentNode.closest ? this.parentNode.closest(sel) : null; }
  addEventListener(t, f) { (this.listeners[t] ||= []).push(f); }
  removeEventListener(t, f) { this.listeners[t] = (this.listeners[t] || []).filter((x) => x !== f); }
  dispatch(t, ev = {}) { const e = { type: t, target: this, preventDefault() {}, stopPropagation() {}, ...ev }; (this.listeners[t] || []).slice().forEach((f) => f(e)); return e; }
  getBoundingClientRect() { return { left: 0, top: 0, right: 96, bottom: 96, width: 96, height: 96 }; }
}
class Video extends El {
  constructor(doc) { super("video", doc); this.paused = true; this.muted = false; this.currentTime = 0; this.playCalls = 0; this.loads = 0; }
  load() { this.loads++; }
  play() {
    this.playCalls++;
    if (this.doc.policy() === "deny") return Promise.reject(Object.assign(new Error("denied"), { name: "NotAllowedError" }));
    const was = this.paused; this.paused = false;
    if (was) queueMicrotask(() => { this.dispatch("play"); this.dispatch("playing"); });
    return Promise.resolve();
  }
  pause() { if (this.paused) return; this.paused = true; queueMicrotask(() => this.dispatch("pause")); }
}

function setup({ deny = false, reduced = false, n = 2, badSrc = false } = {}) {
  let allow = !deny; const observers = [];
  const body = new El("body");
  const doc = {
    hidden: false, listeners: {}, policy: () => (allow ? "allow" : "deny"),
    createElement: (t) => new El(t, doc),
    querySelectorAll: () => vids,
    addEventListener(t, f) { (this.listeners[t] ||= []).push(f); },
    removeEventListener(t, f) { this.listeners[t] = (this.listeners[t] || []).filter((x) => x !== f); },
    fire(t, target = body) { (this.listeners[t] || []).slice().forEach((f) => f({ type: t, target })); },
  };
  body.doc = doc;
  const vids = [];
  for (let i = 0; i < n; i++) {
    const li = new El("li", doc); body.appendChild(li);
    const a = new El("a", doc); li.appendChild(a);
    const v = new Video(doc); a.appendChild(v); v.appendChild(new El("picture", doc));
    v.setAttribute("class", "s1-loop"); v.setAttribute("muted", ""); v.setAttribute("loop", ""); v.setAttribute("playsinline", "");
    v.setAttribute("data-loop-webm", badSrc ? "https://evil.example/x.webm" : `/blast-off/images/loop-${i}.webm`);
    v.setAttribute("data-loop-mp4", badSrc ? "/blast-off/images/../x.mp4" : `/blast-off/images/loop-${i}.mp4`);
    vids.push(v);
  }
  class IO { constructor(cb, opts) { this.cb = cb; this.opts = opts || {}; this.els = []; observers.push(this); } observe(el) { this.els.push(el); } }
  const win = { location: { origin: "https://s1r1us.ai" }, matchMedia: () => ({ matches: reduced, addEventListener() {} }), IntersectionObserver: IO, listeners: {}, addEventListener(t, f) { (this.listeners[t] ||= []).push(f); } };
  vm.runInNewContext(code, { window: win, document: doc, URL, WeakMap, IntersectionObserver: IO, queueMicrotask, setTimeout });
  const view = (v, on) => observers.forEach((o) => o.els.includes(v) && o.cb([{ target: v, isIntersecting: on }]));
  const btn = (v) => v.parentNode.nextSibling;
  return { vids, doc, view, btn, unlock: () => { allow = true; }, observers };
}

test("loops autoplay in view with no click: muted, inline, looping, MP4 first", async () => {
  const { vids, view, btn } = setup();
  view(vids[0], true); await tick();
  const v = vids[0];
  assert.equal(v.paused, false);
  assert.equal(v.muted, true); assert.equal(v.defaultMuted, true); assert.equal(v.playsInline, true); assert.equal(v.loop, true);
  assert.ok(v.hasAttribute("muted") && v.hasAttribute("playsinline") && v.hasAttribute("webkit-playsinline"));
  assert.deepEqual(v.children.filter((c) => c.tagName === "SOURCE").map((s) => s.type), ["video/mp4", "video/webm"]);
  assert.equal(btn(v).getAttribute("aria-label"), "Pause animation");
  assert.equal(vids[1].playCalls, 0, "off-screen loop not started");
});

test("refused autoplay: button offers Play; one tap on the button plays", async () => {
  const { vids, view, btn, unlock } = setup({ deny: true });
  view(vids[0], true); await tick(); await tick();
  const v = vids[0], b = btn(v);
  assert.equal(v.paused, true);
  assert.equal(v.getAttribute("data-loop-blocked"), "1");
  assert.equal(v.getAttribute("data-loop-user-paused"), null, "a refusal is not a user pause");
  assert.equal(b.getAttribute("aria-label"), "Play animation");
  assert.equal(b.getAttribute("aria-pressed"), "false");
  unlock(); b.dispatch("click"); await tick(); await tick();
  assert.equal(v.paused, false, "plays in one tap");
  assert.equal(v.getAttribute("data-loop-blocked"), null);
  assert.equal(b.getAttribute("aria-label"), "Pause animation");
});

test("refused autoplay: one tap anywhere retries every loop the user has not paused", async () => {
  const { vids, view, btn, doc, unlock } = setup({ deny: true, n: 3 });
  vids.forEach((v) => view(v, true)); await tick(); await tick();
  assert.ok(vids.every((v) => v.paused && v.getAttribute("data-loop-blocked") === "1"));
  // user pauses loop 2 while blocked: first tap plays it, second tap pauses it
  unlock(); btn(vids[2]).dispatch("click"); await tick(); btn(vids[2]).dispatch("click"); await tick();
  assert.equal(vids[2].getAttribute("data-loop-user-paused"), "1");
  doc.fire("pointerdown"); await tick(); await tick();
  assert.equal(vids[0].paused, false); assert.equal(vids[1].paused, false);
  assert.equal(vids[2].paused, true, "user pause respected");
  assert.equal((doc.listeners.pointerdown || []).length, 0, "gesture listeners removed once nothing is blocked");
});

test("user pause sticks across scrolling and tab switches; Play resumes in one tap", async () => {
  const { vids, view, btn, doc } = setup({ n: 1 });
  const v = vids[0], b = btn(v);
  view(v, true); await tick();
  b.dispatch("click"); await tick();
  assert.equal(v.paused, true); assert.equal(b.getAttribute("aria-label"), "Play animation"); assert.equal(b.getAttribute("aria-pressed"), "true");
  view(v, false); view(v, true); doc.hidden = true; doc.fire("visibilitychange"); doc.hidden = false; doc.fire("visibilitychange"); doc.fire("pointerdown"); await tick();
  assert.equal(v.paused, true, "still paused");
  b.dispatch("click"); await tick();
  assert.equal(v.paused, false); assert.equal(b.getAttribute("aria-label"), "Pause animation");
});

test("browser pause while on screen shows Play; 'ended' restarts the loop", async () => {
  const { vids, view, btn } = setup({ n: 1 });
  const v = vids[0];
  view(v, true); await tick();
  v.pause(); await tick();
  assert.equal(btn(v).getAttribute("aria-label"), "Play animation");
  v.currentTime = 4.2; v.paused = true; v.dispatch("ended"); await tick();
  assert.equal(v.paused, false); assert.equal(v.currentTime, 0);
  assert.equal(btn(v).getAttribute("aria-label"), "Pause animation");
});

test("reduced motion: poster only, no sources, no button, no play", async () => {
  const { vids, view, btn, doc } = setup({ reduced: true });
  vids.forEach((v) => view(v, true)); doc.fire("pointerdown"); await tick();
  for (const v of vids) {
    assert.equal(v.playCalls, 0); assert.equal(v.children.filter((c) => c.tagName === "SOURCE").length, 0);
    assert.equal(btn(v).hidden, true);
  }
});

test("unsafe source paths are never used (allowlist unchanged)", async () => {
  const { vids, view, btn } = setup({ badSrc: true, n: 1 });
  view(vids[0], true); await tick();
  assert.equal(vids[0].getAttribute("data-loop-armed"), "none");
  assert.equal(vids[0].children.filter((c) => c.tagName === "SOURCE").length, 0);
  assert.equal(btn(vids[0]).hidden, true);
});
