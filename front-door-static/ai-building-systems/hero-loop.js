/*!
 * AI Building Systems hero loop (/ai-building-systems/ and /faq/ top).
 * <video class="abs-hero-loop-video" autoplay muted loop playsinline preload="metadata" poster="…">
 * - prefers-reduced-motion: the loop is stopped and only the poster shows (CSS also hides the video).
 * - Otherwise it plays muted inline; a Pause / Play button (WCAG 2.2.2) is added next to it.
 * - A pause by the user sticks. If play() is refused (Low Power Mode, data saver), the poster stays
 *   and the button offers Play.
 * CSP-friendly: no eval, no HTML string injection, no inline style writes.
 */
(function () {
  "use strict";
  var vids = Array.prototype.slice.call(document.querySelectorAll("video.abs-hero-loop-video"));
  if (!vids.length) return;
  var mq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  function reduced() { return !!(mq && mq.matches); }

  vids.forEach(function (v) {
    var userPaused = false;
    v.muted = true; v.defaultMuted = true; v.playsInline = true; v.loop = true;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "abs-hero-loop-toggle";
    btn.hidden = true;
    v.parentNode.appendChild(btn);

    function sync() {
      var playing = !v.paused;
      btn.textContent = playing ? "Pause animation" : "Play animation";
      btn.setAttribute("aria-label", btn.textContent);
      btn.setAttribute("aria-pressed", playing ? "false" : "true");
      btn.hidden = reduced();
    }
    function stopToPoster() {
      v.removeAttribute("autoplay");
      v.autoplay = false;
      try { v.pause(); } catch { /* ignore */ }
      try { v.load(); } catch { /* ignore: reload shows the poster again */ }
      sync();
    }
    function tryPlay() {
      if (reduced() || userPaused) { sync(); return; }
      var p;
      try { p = v.play(); } catch { sync(); return; }
      if (p && typeof p.then === "function") p.then(sync, sync); else sync();
    }

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      if (v.paused) { userPaused = false; tryPlay(); }
      else { userPaused = true; v.pause(); sync(); }
    });
    v.addEventListener("play", sync);
    v.addEventListener("pause", sync);
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) { if (!v.paused) v.pause(); } else tryPlay();
    });
    if (mq && mq.addEventListener) mq.addEventListener("change", function () { if (reduced()) stopToPoster(); else tryPlay(); });

    if (reduced()) stopToPoster(); else tryPlay();
  });
})();
