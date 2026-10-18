/*!
 * /dmt/ hero loop (LOGO-ANIM-LOCK, 2026-10-18): autoplay, muted, loop, playsinline.
 * - Keeps looping under prefers-reduced-motion (system admin decision); the Pause button stays visible.
 * - Only the user's Pause stops it. If the browser refuses play() (Low Power Mode, data saver),
 *   the poster stays, the button offers Play, and the next tap or key press anywhere retries.
 *   Gestures that start on the Pause/Play button are left to its own click handler, so one
 *   activation never plays and then pauses again.
 * - No JS: the native autoplay/loop attributes still run where allowed; the still poster is the fallback.
 */
(function () {
  'use strict';
  var vids = Array.prototype.slice.call(document.querySelectorAll('video.dmt-hero-loop'));
  if (!vids.length) return;

  vids.forEach(function (v) {
    var btn = v.parentNode.querySelector('.dmt-loop-toggle');
    var userPaused = false;
    var retryArmed = false;

    v.muted = true; v.defaultMuted = true; v.setAttribute('muted', '');
    v.playsInline = true; v.setAttribute('playsinline', '');
    v.loop = true;

    function sync() {
      if (!btn) return;
      var playing = !v.paused && !userPaused;
      btn.textContent = playing ? 'Pause animation' : 'Play animation';
      btn.setAttribute('aria-label', playing ? 'Pause animation' : 'Play animation');
      btn.setAttribute('aria-pressed', playing ? 'false' : 'true');
    }

    function onGesture(e) {
      // The toggle's click handler acts on its own gesture; retrying here too would start
      // playback first and let that click pause it straight away.
      if (btn && e && e.target instanceof Node && btn.contains(e.target)) return;
      disarm();
      if (!userPaused) tryPlay();
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
      try { p = v.play(); } catch { arm(); sync(); return; }
      if (p && typeof p.then === 'function') {
        p.then(function () { disarm(); sync(); }, function () { arm(); sync(); });
      } else {
        sync();
      }
    }

    // Safety net: if the browser ever stops looping on its own, restart (unless the user paused).
    v.addEventListener('ended', function () {
      if (userPaused) return;
      try { v.currentTime = 0; } catch { /* ignore */ }
      tryPlay();
    });
    v.addEventListener('play', sync);
    v.addEventListener('pause', sync);

    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && !userPaused && v.paused) tryPlay();
    });

    if (btn) {
      btn.hidden = false;
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        if (v.paused || userPaused) { userPaused = false; tryPlay(); }
        else { userPaused = true; v.pause(); disarm(); sync(); }
      });
    }

    tryPlay();
  });
})();
