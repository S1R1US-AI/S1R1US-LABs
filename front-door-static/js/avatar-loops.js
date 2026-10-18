/*!
 * Avatar loops (Br0k3n S0ft + DJ i-B Mo FuNky), 2026-10-18.
 * <video class="s1-loop" muted loop playsinline preload="none" poster="…" data-loop-webm="…" data-loop-mp4="…">
 * - No JS or prefers-reduced-motion: the poster (loop frame 0) stays; nothing is fetched.
 * - Otherwise an IntersectionObserver adds the WebM + MP4 sources when the video is near view,
 *   plays it, and pauses it when it leaves view or the tab is hidden.
 * - If play() is refused (Lockdown / Low Power / data saver), the poster stays.
 */
(function () {
  'use strict';

  var vids = Array.prototype.slice.call(document.querySelectorAll('video.s1-loop[data-loop-mp4]'));
  if (!vids.length) return;

  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var visible = typeof WeakMap === 'function' ? new WeakMap() : null;

  function reduced() { return !!(mq && mq.matches); }

  function arm(v) {
    if (v.getAttribute('data-loop-armed') === '1') return;
    v.setAttribute('data-loop-armed', '1');
    v.muted = true; // required for inline autoplay on iOS
    var webm = v.getAttribute('data-loop-webm');
    var mp4 = v.getAttribute('data-loop-mp4');
    if (webm) { var s1 = document.createElement('source'); s1.src = webm; s1.type = 'video/webm'; v.insertBefore(s1, v.firstChild); }
    if (mp4) { var s2 = document.createElement('source'); s2.src = mp4; s2.type = 'video/mp4'; v.insertBefore(s2, s1 ? s1.nextSibling : v.firstChild); }
    v.load();
  }

  function play(v) {
    if (reduced() || document.hidden) return;
    arm(v);
    var p = v.play();
    if (p && typeof p.catch === 'function') p.catch(function () { /* refused: poster stays */ });
  }

  function pause(v) { if (!v.paused) v.pause(); }

  function isVisible(v) { return visible ? !!visible.get(v) : true; }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (visible) visible.set(e.target, e.isIntersecting);
        if (e.isIntersecting) play(e.target); else pause(e.target);
      });
    }, { rootMargin: '200px 0px' });
    vids.forEach(function (v) { io.observe(v); });
  } else {
    vids.forEach(play);
  }

  document.addEventListener('visibilitychange', function () {
    vids.forEach(function (v) {
      if (document.hidden) pause(v); else if (isVisible(v)) play(v);
    });
  });

  if (mq) {
    var onChange = function () {
      vids.forEach(function (v) {
        if (reduced()) { pause(v); try { v.currentTime = 0; } catch { /* ignore */ } }
        else if (isVisible(v)) play(v);
      });
    };
    if (typeof mq.addEventListener === 'function') mq.addEventListener('change', onChange);
    else if (typeof mq.addListener === 'function') mq.addListener(onChange);
  }
})();
