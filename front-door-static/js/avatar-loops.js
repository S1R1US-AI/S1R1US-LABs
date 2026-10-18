/*!
 * Avatar loops (Br0k3n S0ft + DJ i-B Mo FuNky), 2026-10-18.
 * <video class="s1-loop" muted loop playsinline preload="none" poster="…" data-loop-webm="…" data-loop-mp4="…">
 * - No JS or prefers-reduced-motion: the poster (loop frame 0) stays; nothing is fetched.
 * - Otherwise an IntersectionObserver adds the WebM + MP4 sources when the video is near view,
 *   plays it, and pauses it when it leaves view or the tab is hidden.
 * - If play() is refused (Lockdown / Low Power / data saver), the poster stays.
 * - Source paths are checked first: same origin, /images/ or /blast-off/images/, .mp4/.webm only.
 * - Each loop gets a Pause / Play button (WCAG 2.2.2), placed next to the avatar link, not inside it.
 *   A pause by the user sticks: scrolling, tab switches and motion-setting changes never restart it.
 */
(function () {
  'use strict';

  var vids = Array.prototype.slice.call(document.querySelectorAll('video.s1-loop[data-loop-mp4]'));
  if (!vids.length) return;

  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var visible = typeof WeakMap === 'function' ? new WeakMap() : null;

  function reduced() { return !!(mq && mq.matches); }

  // Only same-origin loop files under /images/ or /blast-off/images/ are used.
  // Anything else (other origin, protocol, '//', '..', query, hash, other type) is skipped.
  var SAFE_PATH = /^\/(?:images|blast-off\/images)\/[A-Za-z0-9_-][A-Za-z0-9._-]*(?:\/[A-Za-z0-9_-][A-Za-z0-9._-]*)*\.(mp4|webm)$/;
  function safeSrc(value, ext) {
    if (typeof value !== 'string' || value.charAt(0) !== '/' || value.charAt(1) === '/' || value.indexOf('..') !== -1) return null;
    var url;
    try { url = new URL(value, window.location.origin); } catch { return null; }
    if (url.origin !== window.location.origin || url.search || url.hash) return null;
    var m = SAFE_PATH.exec(url.pathname);
    if (!m || m[1] !== ext || url.pathname !== value) return null;
    return url.pathname;
  }

  function arm(v) {
    var state = v.getAttribute('data-loop-armed');
    if (state) return state === '1';
    var webm = safeSrc(v.getAttribute('data-loop-webm'), 'webm');
    var mp4 = safeSrc(v.getAttribute('data-loop-mp4'), 'mp4');
    if (!webm && !mp4) { v.setAttribute('data-loop-armed', 'none'); hideToggle(v); return false; } // nothing valid: poster stays
    v.setAttribute('data-loop-armed', '1');
    v.muted = true; // required for inline autoplay on iOS
    var s1 = null;
    if (webm) { s1 = document.createElement('source'); s1.src = webm; s1.type = 'video/webm'; v.insertBefore(s1, v.firstChild); }
    if (mp4) { var s2 = document.createElement('source'); s2.src = mp4; s2.type = 'video/mp4'; v.insertBefore(s2, s1 ? s1.nextSibling : v.firstChild); }
    v.load();
    return true;
  }

  function userPaused(v) { return v.getAttribute('data-loop-user-paused') === '1'; }

  function play(v) {
    if (reduced() || document.hidden || userPaused(v)) return;
    if (!arm(v)) return;
    var p = v.play();
    if (p && typeof p.catch === 'function') p.catch(function () { /* refused: poster stays */ });
  }

  function pause(v) { if (!v.paused) v.pause(); }

  function isVisible(v) { return visible ? !!visible.get(v) : true; }

  // Pause / Play toggle. It sits next to the link (a button can't live inside <a>)
  // and is pinned to the top-right corner of the video's box.
  var toggles = typeof WeakMap === 'function' ? new WeakMap() : null;
  function toggleFor(v) { return toggles ? toggles.get(v) : null; }
  function hideToggle(v) { var b = toggleFor(v); if (b) b.hidden = true; }

  function syncToggle(v) {
    var b = toggleFor(v);
    if (!b) return;
    var off = userPaused(v);
    b.setAttribute('aria-pressed', off ? 'true' : 'false');
    b.setAttribute('aria-label', off ? 'Play animation' : 'Pause animation');
    b.title = off ? 'Play animation' : 'Pause animation';
    b.setAttribute('data-state', off ? 'paused' : 'playing');
    b.hidden = reduced() || v.getAttribute('data-loop-armed') === 'none';
  }

  function placeToggle(v) {
    var b = toggleFor(v);
    if (!b || b.hidden) return;
    var host = b.parentNode;
    var hr = host.getBoundingClientRect();
    var vr = v.getBoundingClientRect();
    var small = vr.width > 0 && vr.width < 120; // 64px intro avatars: smaller button on the ring's corner
    if (b.classList) b.classList.toggle('s1-loop-toggle--sm', small);
    var size = b.offsetWidth || (small ? 24 : 32);
    var inset = small ? -6 : 6;
    b.style.left = Math.round(vr.right - hr.left - size - inset) + 'px';
    b.style.top = Math.round(vr.top - hr.top + inset) + 'px';
  }

  function addToggle(v) {
    if (!toggles) return;
    var link = v.closest ? v.closest('a') : null;
    var anchor = link || v;
    var host = anchor.parentNode;
    if (!host) return;
    if (host.classList) host.classList.add('s1-loop-host');
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 's1-loop-toggle';
    host.insertBefore(b, anchor.nextSibling);
    toggles.set(v, b);
    b.addEventListener('click', function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      if (userPaused(v)) {
        v.removeAttribute('data-loop-user-paused');
        syncToggle(v);
        if (isVisible(v)) play(v);
      } else {
        v.setAttribute('data-loop-user-paused', '1');
        syncToggle(v);
        pause(v);
      }
    });
    syncToggle(v);
  }

  function placeAll() { vids.forEach(placeToggle); }

  vids.forEach(addToggle);
  placeAll();
  window.addEventListener('resize', placeAll);
  window.addEventListener('load', placeAll);

  if ('IntersectionObserver' in window && typeof window.IntersectionObserver === 'function') {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (visible) visible.set(e.target, e.isIntersecting);
        if (e.isIntersecting) { placeToggle(e.target); play(e.target); } else pause(e.target);
      });
    }, { rootMargin: '200px 0px' });
    vids.forEach(function (v) { io.observe(v); });
  } else {
    // No IntersectionObserver: treat every loop as visible so the tab-return
    // and motion-setting resume paths below also work.
    vids.forEach(function (v) { if (visible) visible.set(v, true); play(v); });
  }

  document.addEventListener('visibilitychange', function () {
    vids.forEach(function (v) {
      if (document.hidden) pause(v); else if (isVisible(v)) play(v);
    });
  });

  if (mq) {
    var onChange = function () {
      vids.forEach(function (v) {
        syncToggle(v);
        if (reduced()) { pause(v); try { v.currentTime = 0; } catch { /* ignore */ } }
        else if (isVisible(v)) { placeToggle(v); play(v); }
      });
    };
    if (typeof mq.addEventListener === 'function') mq.addEventListener('change', onChange);
    else if (typeof mq.addListener === 'function') mq.addListener(onChange);
  }
})();
