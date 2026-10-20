/*!
 * /hindu-teachings/ animated loops. External file (no inline script).
 * Markup: <video data-ht-loop autoplay muted loop playsinline preload="metadata" poster tabindex="0"
 *          disablepictureinpicture> (no controls attribute, no visible button: system admin's call).
 * - Autoplays muted + inline, loops seamlessly. Off screen / hidden tab: pauses quietly, resumes on return.
 * - WCAG 2.2.2 (pause looping motion > 5 s) without visible UI: click/tap the video toggles pause/play;
 *   keyboard: focus the video (tabindex=0) and press Enter or Space. A user pause sticks.
 * - prefers-reduced-motion: reduce → CSS hides the video and shows the still poster; JS also pauses it
 *   and rewinds to frame 0 so nothing animates or keeps decoding. Live media-query changes honoured.
 * - If the browser refuses autoplay (Low Power Mode / data saver), the poster stays and the next
 *   tap or key press anywhere retries once.
 */
(function () {
  'use strict';
  var vids = Array.prototype.slice.call(document.querySelectorAll('video[data-ht-loop]'));
  if (!vids.length) return;
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function reduced() { return !!(mq && mq.matches); }
  var state = new WeakMap();
  var retryArmed = false;

  function canPlay(v) { var st = state.get(v); return !reduced() && !document.hidden && st.inView && !st.userPaused; }
  function tryPlay(v) {
    if (!canPlay(v)) return;
    var p; try { p = v.play(); } catch { armRetry(); return; }
    if (p && typeof p.then === 'function') p.catch(function () { armRetry(); });
  }
  // Retry every loop except the one the gesture targets: its own click/key handler toggles it,
  // so starting it here first would make that handler pause it.
  function onGesture(e) {
    disarmRetry();
    var t = e && e.target;
    vids.forEach(function (v) { if (!(t && (t === v || (v.contains && v.contains(t))))) tryPlay(v); });
  }
  function armRetry() {
    if (retryArmed) return; retryArmed = true;
    document.addEventListener('pointerdown', onGesture, true);
    document.addEventListener('keydown', onGesture, true);
  }
  function disarmRetry() {
    if (!retryArmed) return; retryArmed = false;
    document.removeEventListener('pointerdown', onGesture, true);
    document.removeEventListener('keydown', onGesture, true);
  }
  function applyMotion(v) {
    if (reduced()) { v.removeAttribute('autoplay'); v.autoplay = false; v.pause(); try { v.currentTime = 0; } catch { /* ignore */ } }
    else tryPlay(v);
  }
  function toggle(v) {
    var st = state.get(v);
    if (v.paused) { st.userPaused = false; tryPlay(v); } else { st.userPaused = true; v.pause(); }
  }

  vids.forEach(function (v) {
    state.set(v, { userPaused: false, inView: typeof IntersectionObserver !== 'function' });
    v.muted = true; v.defaultMuted = true; v.setAttribute('muted', '');
    v.playsInline = true; v.setAttribute('playsinline', '');
    v.loop = true; v.controls = false; v.removeAttribute('controls');
    v.addEventListener('click', function (e) { e.preventDefault(); toggle(v); });
    v.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); e.stopPropagation(); toggle(v); }
    });
    v.addEventListener('ended', function () { if (!state.get(v).userPaused) { try { v.currentTime = 0; } catch { /* ignore */ } tryPlay(v); } });
    if (typeof IntersectionObserver === 'function') {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var st = state.get(v); st.inView = en.isIntersecting;
          if (st.inView) tryPlay(v); else if (!v.paused) v.pause();
        });
      }, { rootMargin: '200px 0px' }).observe(v);
    }
    applyMotion(v);
  });

  document.addEventListener('visibilitychange', function () {
    vids.forEach(function (v) { if (document.hidden) { if (!v.paused) v.pause(); } else tryPlay(v); });
  });
  if (mq) {
    var onChange = function () { vids.forEach(applyMotion); };
    if (mq.addEventListener) mq.addEventListener('change', onChange); else if (mq.addListener) mq.addListener(onChange);
  }
})();
