/*!
 * Soft-launch front-door screensavers — DRAFT (no auth / no login / no saver-lock).
 * Classic Matrix idle + Godzilla Mode intro/idle. Uses S1R1USRain (rain-engine.js).
 * Ghost background rain (matrix-rain.js) stays separate.
 */
(function () {
  'use strict';

  var IDLE_MS = 5 * 60 * 1000;
  var GM_INTRO_MS = 2500;
  var INTRO_KEY = 's1r1us-gm-saver-intro';
  var DEMO_PARAM = 'saverDemo';

  // Optional short timeouts for manual QA: ?saverDemo=1 → 3s idle / 1.2s intro
  try {
    var qs = new URLSearchParams(window.location.search);
    if (qs.get(DEMO_PARAM) === '1') {
      IDLE_MS = 3000;
      GM_INTRO_MS = 1200;
    }
  } catch (e) { /* ignore */ }

  var overlay = null;
  var canvas = null;
  var rain = null;
  var activeTheme = null; // 'classic' | 'gm' | 'gm-intro'
  var classicTimer = null;
  var gmIdleTimer = null;
  var inGmContext = false;
  var ghostPaused = false;

  function ensureDom() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.id = 'screensaver-overlay';
    overlay.className = 'screensaver-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.hidden = true;
    canvas = document.createElement('canvas');
    canvas.id = 'screensaver-canvas';
    canvas.setAttribute('aria-label', 'Matrix screensaver overlay');
    overlay.appendChild(canvas);
    document.body.appendChild(overlay);
  }

  function setGhostPaused(paused) {
    ghostPaused = !!paused;
    var ghost = document.getElementById('matrix-rain');
    if (ghost) ghost.style.visibility = paused ? 'hidden' : '';
  }

  function stopRain() {
    if (rain && typeof rain.stop === 'function') rain.stop();
    rain = null;
  }

  function hideOverlay() {
    stopRain();
    activeTheme = null;
    if (overlay) {
      overlay.hidden = true;
      overlay.classList.remove('is-active');
      overlay.setAttribute('aria-hidden', 'true');
    }
    setGhostPaused(false);
    resetIdleTimers();
  }

  function showOverlay(theme, opts) {
    opts = opts || {};
    if (typeof S1R1USRain === 'undefined' || !S1R1USRain.startRain) {
      console.warn('[screensavers] rain-engine.js not loaded');
      return;
    }
    ensureDom();
    // Prefer GM: do not start classic while any GM saver is up
    if (theme === 'classic' && (activeTheme === 'gm' || activeTheme === 'gm-intro')) return;
    // Replace any existing saver
    stopRain();
    activeTheme = theme;
    setGhostPaused(true);
    overlay.hidden = false;
    overlay.classList.add('is-active');
    overlay.setAttribute('aria-hidden', 'false');
    clearIdleTimersOnly();

    var isGm = theme === 'gm' || theme === 'gm-intro';
    rain = S1R1USRain.startRain(canvas, {
      theme: isGm ? 'gm' : 'classic',
      burst: !!opts.burst || theme === 'gm-intro',
      label: isGm
        ? 'G0DZ1LLa M0D3 · Godzilla Mode'
        : '[ S1R1U$ <<L@B$>> ] · Matrix Classic',
    });
  }

  function clearIdleTimersOnly() {
    if (classicTimer) {
      clearTimeout(classicTimer);
      classicTimer = null;
    }
    if (gmIdleTimer) {
      clearTimeout(gmIdleTimer);
      gmIdleTimer = null;
    }
  }

  function resetIdleTimers() {
    clearIdleTimersOnly();
    if (activeTheme) return; // saver already showing
    if (inGmContext) {
      gmIdleTimer = setTimeout(function () {
        if (!inGmContext || activeTheme) return;
        showOverlay('gm', { burst: false });
      }, IDLE_MS);
    } else {
      classicTimer = setTimeout(function () {
        if (inGmContext || activeTheme) return;
        showOverlay('classic', { burst: false });
      }, IDLE_MS);
    }
  }

  function dismissFromUser(ev) {
    if (!activeTheme) return;
    var isGm = activeTheme === 'gm' || activeTheme === 'gm-intro';
    // Classic: mouse move or click dismisses. GM idle/intro: click (or ESC) dismisses.
    if (isGm && ev && ev.type === 'mousemove') return;
    if (ev && ev.type === 'click') {
      try { ev.preventDefault(); ev.stopPropagation(); } catch (e) { /* ignore */ }
    }
    hideOverlay();
  }

  function updateGmContext() {
    var hashGm = (location.hash || '') === '#gm';
    var tier = document.querySelector('.tier-gm');
    var visible = false;
    if (tier) {
      var r = tier.getBoundingClientRect();
      var vh = window.innerHeight || 0;
      visible = r.top < vh * 0.85 && r.bottom > vh * 0.15;
    }
    var next = hashGm || visible;
    if (next !== inGmContext) {
      inGmContext = next;
      if (!activeTheme) resetIdleTimers();
    }
  }

  function playGmIntroOnce(ev) {
    if (ev) {
      // Keep #gm hash navigation; prevent leaving page if href were external
      // (card is href="#gm" so default is fine; still mark context)
    }
    inGmContext = true;
    try {
      if (sessionStorage.getItem(INTRO_KEY) === '1') {
        resetIdleTimers();
        return;
      }
      sessionStorage.setItem(INTRO_KEY, '1');
    } catch (e) {
      // sessionStorage blocked — still play once this page load via in-memory
      if (playGmIntroOnce._done) {
        resetIdleTimers();
        return;
      }
      playGmIntroOnce._done = true;
    }

    showOverlay('gm-intro', { burst: true });
    setTimeout(function () {
      if (activeTheme === 'gm-intro') hideOverlay();
    }, GM_INTRO_MS);
  }
  playGmIntroOnce._done = false;

  function onDocumentClick(ev) {
    if (activeTheme) {
      dismissFromUser(ev);
      return;
    }
    // Idle is click-based for both savers
    resetIdleTimers();
  }

  function onMouseMove(ev) {
    if (activeTheme === 'classic') dismissFromUser(ev);
  }

  function onKeyDown(ev) {
    if (!activeTheme) return;
    if (ev.key === 'Escape' || ev.keyCode === 27) {
      ev.preventDefault();
      hideOverlay();
    }
  }

  function wireGmCard() {
    var card = document.getElementById('gm') || document.querySelector('.gm-card');
    if (!card) return;
    card.addEventListener('click', function (ev) {
      playGmIntroOnce(ev);
    });
  }

  function init() {
    ensureDom();
    wireGmCard();
    updateGmContext();
    resetIdleTimers();

    document.addEventListener('click', onDocumentClick, true);
    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('hashchange', updateGmContext);
    window.addEventListener('scroll', updateGmContext, { passive: true });
    window.addEventListener('resize', updateGmContext);

    // Expose for QA / screenshots
    window.S1R1USScreensavers = {
      showClassic: function () { showOverlay('classic'); },
      showGm: function () { showOverlay('gm'); },
      showGmIntro: function () { showOverlay('gm-intro', { burst: true }); },
      hide: hideOverlay,
      resetIdle: resetIdleTimers,
      playGmIntroOnce: playGmIntroOnce,
      getState: function () {
        return {
          activeTheme: activeTheme,
          inGmContext: inGmContext,
          idleMs: IDLE_MS,
          introMs: GM_INTRO_MS,
          introPlayed: (function () {
            try { return sessionStorage.getItem(INTRO_KEY) === '1'; } catch (e) { return !!playGmIntroOnce._done; }
          })(),
        };
      },
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
