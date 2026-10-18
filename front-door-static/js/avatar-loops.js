/*!
 * Avatar loops (Br0k3n S0ft + DJ i-B Mo FuNky), 2026-10-18 (autoplay fix 2026-10-18b).
 * <video class="s1-loop" muted loop playsinline preload="none" poster="…" data-loop-webm="…" data-loop-mp4="…">
 * - No JS or prefers-reduced-motion: the poster (loop frame 0) stays; nothing is fetched.
 * - Otherwise the MP4 + WebM sources are added just before the video comes into view; it plays
 *   (muted, inline, looping) while on screen and pauses when it leaves view or the tab is hidden.
 * - If play() is refused (iOS Low Power Mode, data saver, autoplay policy) the poster stays, the
 *   button offers Play (one tap plays), and the next tap, click or key press anywhere retries
 *   every loop the user has not paused. Tab return and scrolling back into view retry too.
 * - Source paths are checked first: same origin, /images/ or /blast-off/images/, .mp4/.webm only.
 * - Each loop gets a Pause / Play button (WCAG 2.2.2), placed next to the avatar link, not inside it.
 *   A pause by the user sticks: scrolling, tab switches and motion-setting changes never restart it.
 */
(function () {
  'use strict';

  var vids = Array.prototype.slice.call(document.querySelectorAll('video.s1-loop[data-loop-mp4]'));
  if (!vids.length) return;

  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

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

  // Per-loop state. userPaused is set ONLY by the Pause button; blocked means the
  // browser refused play() (iOS Low Power Mode, data saver, autoplay policy).
  // They are kept apart so a refused autoplay never looks like a user pause.
  function userPaused(v) { return v.getAttribute('data-loop-user-paused') === '1'; }
  function blocked(v) { return v.getAttribute('data-loop-blocked') === '1'; }
  function setBlocked(v, on) {
    if (on === blocked(v)) return;
    if (on) v.setAttribute('data-loop-blocked', '1'); else v.removeAttribute('data-loop-blocked');
    syncToggle(v);
    if (on) armGestureRetry(); else if (!vids.some(blocked)) disarmGestureRetry();
  }

  var inView = typeof WeakMap === 'function' ? new WeakMap() : null;
  var pauseReason = typeof WeakMap === 'function' ? new WeakMap() : null;
  function isVisible(v) { return inView ? !!inView.get(v) : true; }

  function arm(v) {
    var state = v.getAttribute('data-loop-armed');
    if (state) return state === '1';
    var webm = safeSrc(v.getAttribute('data-loop-webm'), 'webm');
    var mp4 = safeSrc(v.getAttribute('data-loop-mp4'), 'mp4');
    if (!webm && !mp4) { v.setAttribute('data-loop-armed', 'none'); hideToggle(v); return false; } // nothing valid: poster stays
    v.setAttribute('data-loop-armed', '1');
    // Inline muted autoplay needs muted + playsinline as real attributes and properties (iOS Safari).
    v.muted = true; v.defaultMuted = true; v.setAttribute('muted', '');
    v.playsInline = true; v.setAttribute('playsinline', ''); v.setAttribute('webkit-playsinline', '');
    v.loop = true;
    v.preload = 'auto';
    // MP4 (H.264) first: hardware-decoded on every phone and the format Safari prefers.
    // WebM (VP9) stays as the fallback for browsers without H.264.
    var first = v.firstChild;
    [[mp4, 'video/mp4'], [webm, 'video/webm']].forEach(function (pair) {
      if (!pair[0]) return;
      var s = document.createElement('source'); s.src = pair[0]; s.type = pair[1];
      v.insertBefore(s, first);
    });
    v.load();
    return true;
  }

  function canAnimate(v) { return !reduced() && !document.hidden && !userPaused(v); }

  function play(v) {
    if (!canAnimate(v) || !arm(v)) return;
    if (pauseReason) pauseReason.delete(v);
    if (!v.paused) { setBlocked(v, false); return; }
    v.muted = true;
    var p;
    try { p = v.play(); } catch (err) { onRefused(v, err); return; }
    if (p && typeof p.then === 'function') p.then(function () { setBlocked(v, false); }, function (err) { onRefused(v, err); });
  }

  function onRefused(v, err) {
    // AbortError = our own pause() or a reload interrupted play(): not a refusal.
    if (err && err.name === 'AbortError') return;
    if (!canAnimate(v)) return;
    setBlocked(v, true); // poster stays; the button offers Play; the next tap anywhere retries
  }

  function pause(v, reason) {
    if (pauseReason) pauseReason.set(v, reason);
    if (!v.paused) v.pause();
  }

  // Autoplay refused: the first tap / click / key press anywhere on the page retries
  // every loop the user has not paused. Taps on a loop's own button are handled there.
  var GESTURES = ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown'];
  var gestureArmed = false;
  function onGesture(ev) {
    var t = ev && ev.target;
    if (t && t.closest && t.closest('.s1-loop-toggle')) return;
    retryAll(true);
  }
  function armGestureRetry() {
    if (gestureArmed) return;
    gestureArmed = true;
    GESTURES.forEach(function (n) { document.addEventListener(n, onGesture, { capture: true, passive: true }); });
  }
  function disarmGestureRetry() {
    if (!gestureArmed) return;
    gestureArmed = false;
    GESTURES.forEach(function (n) { document.removeEventListener(n, onGesture, { capture: true, passive: true }); });
  }

  function retryAll(fromGesture) {
    vids.forEach(function (v) {
      if (!canAnimate(v)) return;
      if (isVisible(v)) { play(v); return; }
      if (!fromGesture || (!blocked(v) && v.getAttribute('data-loop-armed'))) return;
      // Off-screen loop during a user gesture: start it once so the browser lets it
      // autoplay later, then pause it until it scrolls into view.
      play(v);
      if (!v.paused) pause(v, 'offscreen');
    });
  }

  // Pause / Play toggle. It sits next to the link (a button can't live inside <a>)
  // and is pinned to the top-right corner of the video's box.
  var toggles = typeof WeakMap === 'function' ? new WeakMap() : null;
  function toggleFor(v) { return toggles ? toggles.get(v) : null; }
  function hideToggle(v) { var b = toggleFor(v); if (b) b.hidden = true; }

  // The label always offers the action that will happen on tap:
  // playing -> "Pause animation"; paused by the user or refused by the browser -> "Play animation".
  function syncToggle(v) {
    var b = toggleFor(v);
    if (!b) return;
    var off = userPaused(v);
    var stopped = off || blocked(v);
    b.setAttribute('aria-pressed', off ? 'true' : 'false');
    b.setAttribute('aria-label', stopped ? 'Play animation' : 'Pause animation');
    b.title = stopped ? 'Play animation' : 'Pause animation';
    b.setAttribute('data-state', stopped ? 'paused' : 'playing');
    if (blocked(v) && !off) b.setAttribute('data-reason', 'blocked'); else b.removeAttribute('data-reason');
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
        play(v);
      } else if (blocked(v)) {
        play(v); // refused autoplay: one tap plays (this click is the user gesture)
        retryAll(true);
      } else {
        v.setAttribute('data-loop-user-paused', '1');
        syncToggle(v);
        pause(v, 'user');
      }
    });
    syncToggle(v);
  }

  function placeAll() { vids.forEach(placeToggle); }

  vids.forEach(addToggle);
  placeAll();
  window.addEventListener('resize', placeAll);
  window.addEventListener('load', placeAll);

  // Media events keep the button honest and the loop running.
  vids.forEach(function (v) {
    v.addEventListener('playing', function () { setBlocked(v, false); syncToggle(v); });
    v.addEventListener('pause', function () {
      var why = pauseReason ? pauseReason.get(v) : null;
      if (why || userPaused(v) || !canAnimate(v) || !isVisible(v)) return;
      // Paused by the browser while on screen (power saving, interruption): show Play and retry on the next tap.
      setBlocked(v, true);
    });
    // 'loop' restarts it; this is the safety net if a browser still fires 'ended'.
    v.addEventListener('ended', function () {
      if (!canAnimate(v)) return;
      try { v.currentTime = 0; } catch { /* ignore */ }
      play(v);
    });
  });

  function setInView(v, on) {
    if (inView) inView.set(v, on);
    if (on) { placeToggle(v); play(v); } else if (!v.paused) pause(v, 'offscreen');
  }

  if ('IntersectionObserver' in window && typeof window.IntersectionObserver === 'function') {
    // Near view (200px ahead): add the sources so the first frames are ready.
    var near = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting && canAnimate(e.target)) arm(e.target); });
    }, { rootMargin: '200px 0px' });
    // In view: play; out of view: pause. Same edge Safari uses for its own pause.
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { setInView(e.target, e.isIntersecting); });
    });
    vids.forEach(function (v) { near.observe(v); io.observe(v); });
  } else {
    // No IntersectionObserver: treat every loop as visible so the tab-return
    // and motion-setting resume paths below also work.
    vids.forEach(function (v) { setInView(v, true); });
  }

  document.addEventListener('visibilitychange', function () {
    vids.forEach(function (v) {
      if (document.hidden) pause(v, 'hidden'); else if (isVisible(v)) play(v);
    });
  });
  window.addEventListener('pageshow', function (ev) { if (ev.persisted) retryAll(false); });

  if (mq) {
    var onChange = function () {
      vids.forEach(function (v) {
        if (reduced()) { pause(v, 'reduced'); setBlocked(v, false); try { v.currentTime = 0; } catch { /* ignore */ } }
        syncToggle(v);
        if (!reduced() && isVisible(v)) { placeToggle(v); play(v); }
      });
    };
    if (typeof mq.addEventListener === 'function') mq.addEventListener('change', onChange);
    else if (typeof mq.addListener === 'function') mq.addListener(onChange);
  }
})();
