/*!
 * Shared looping page video (LOGO-ANIM-LOCK pattern from /dmt/dmt-hero-loop.js, 2026-10-18).
 * Markup: <video data-loop-video muted loop playsinline controls preload="none" poster="…"> with a
 * sibling <button data-loop-toggle hidden> in the same parent.
 * - Autoplays muted, loops, plays inline. Keeps looping under prefers-reduced-motion (system admin
 *   decision); the Pause button stays visible the whole time.
 * - Lazy: nothing but the poster loads until the video is near the viewport, so it does not cost
 *   page load. Off screen it pauses quietly and resumes when back in view (not a user pause).
 * - Only the user's Pause stops it. If the browser refuses play() (Low Power Mode, data saver),
 *   the poster stays, the button offers Play, and the next tap or key press anywhere retries.
 *   Gestures that start on the button are left to its own click handler, so one activation never
 *   plays and then pauses again.
 * - Accessible pattern: the button's visible label and aria-label change together (Pause video /
 *   Play video); no separate pressed state, so the state is never announced twice.
 * - No JS: the native `controls` in the markup give a way to play and pause (WCAG 2.2.2). They are
 *   removed only once the custom Pause button is wired and visible.
 */
(function () {
  'use strict';
  var vids = Array.prototype.slice.call(document.querySelectorAll('video[data-loop-video]'));
  if (!vids.length) return;

  vids.forEach(function (v) {
    var btn = v.parentNode.querySelector('[data-loop-toggle]');
    var userPaused = false;
    var retryArmed = false;
    var inView = typeof IntersectionObserver !== 'function';

    v.muted = true; v.defaultMuted = true; v.setAttribute('muted', '');
    v.playsInline = true; v.setAttribute('playsinline', '');
    v.loop = true;

    function sync() {
      if (!btn) return;
      var playing = !v.paused && !userPaused;
      btn.textContent = playing ? 'Pause video' : 'Play video';
      btn.setAttribute('aria-label', playing ? 'Pause video' : 'Play video');
    }

    function onGesture(e) {
      if (btn && e && e.target instanceof Node && btn.contains(e.target)) return;
      disarm();
      if (!userPaused && inView) tryPlay();
    }
    function arm() {
      if (retryArmed) return;
      retryArmed = true;
      document.addEventListener('pointerdown', onGesture, true);
      document.addEventListener('keydown', onGesture, true);
    }
    function disarm() {
      if (!retryArmed) return;
      retryArmed = false;
      document.removeEventListener('pointerdown', onGesture, true);
      document.removeEventListener('keydown', onGesture, true);
    }

    function tryPlay() {
      var p;
      if (v.preload === 'none') v.preload = 'auto';
      try { p = v.play(); } catch { arm(); sync(); return; }
      if (p && typeof p.then === 'function') {
        p.then(function () { disarm(); sync(); }, function () { arm(); sync(); });
      } else {
        sync();
      }
    }

    v.addEventListener('ended', function () {
      if (userPaused) return;
      try { v.currentTime = 0; } catch { /* ignore */ }
      if (inView) tryPlay();
    });
    v.addEventListener('play', sync);
    v.addEventListener('pause', sync);

    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && !userPaused && inView && v.paused) tryPlay();
    });

    if (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        if (v.paused || userPaused) { userPaused = false; tryPlay(); }
        else { userPaused = true; v.pause(); disarm(); sync(); }
      });
      btn.hidden = false;
      // The custom toggle is now live: drop the no-JS native controls fallback.
      v.controls = false;
      v.removeAttribute('controls');
      sync();
    }

    if (inView) { tryPlay(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        inView = en.isIntersecting;
        if (inView) { if (!userPaused) tryPlay(); }
        else if (!v.paused) { v.pause(); }
      });
    }, { rootMargin: '200px 0px' });
    io.observe(v);
  });
})();
