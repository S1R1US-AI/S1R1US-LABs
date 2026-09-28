/*!
 * S1R1US Matrix rain engine — standalone demo (no auth / no login / no saver-lock).
 * Faithful paint port of S1R1US-AI/S1R1US-LABs src/components/matrix-saver.tsx
 * Blob SHA 5a7e85c83c54ad78f93e57614c08d8982cb5c294
 */
(function (global) {
  'use strict';

  var GM_SEQ = 'G0DZ1LLa M0D3';
  var CLASSIC =
    'AI搭載のビットコイン蓄積器へようこそ、R0B0T0氏。私たちはAIビットコインヘッジトレーディングデスクです。バイ、コンピュート。420420420420420420420420420';
  var RAINBOW = ['#ff1f1f', '#ff8a1f', '#f4e14b', '#3dff1a', '#5eb3e4', '#9b6bdb', '#e879b0'];
  var APP_NAME = '[ S1R1U$ <<L@B$>> ]';

  function rainbowAt(tMs, col, row) {
    var cycle = 3600;
    var shift = ((tMs + col * 90 + row * 220) % cycle) / cycle;
    var i = shift * RAINBOW.length;
    return RAINBOW[Math.floor(i) % RAINBOW.length] || '#3dff1a';
  }

  /**
   * @param {HTMLCanvasElement} canvas
   * @param {{ theme: 'classic'|'gm', burst?: boolean, label?: string }} opts
   */
  function startRain(canvas, opts) {
    opts = opts || {};
    var theme = opts.theme === 'gm' ? 'gm' : 'classic';
    var burstFall = !!opts.burst;
    var label = opts.label || APP_NAME;
    var g = canvas.getContext('2d');
    if (!g) return { stop: function () {} };

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var columns = [];
    var size = 16;
    var pitch = 16;
    var rowGap = 28;
    var raf = 0;
    var running = true;
    var t0 = performance.now();
    var frame = 0;

    function glyph() {
      return CLASSIC[Math.floor(Math.random() * CLASSIC.length)] || '0';
    }

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = window.innerWidth;
      var h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.imageSmoothingEnabled = false;
      size = w < 480 ? 20 : 24;
      pitch = size / 1.875;
      rowGap = Math.round(size * 1.78);
      var count = Math.ceil(w / pitch);
      var rows = Math.max(1, h / rowGap);
      var fall = burstFall
        ? rows / 180
        : (reduced ? 0.28 + Math.random() * 0.2 : 0.5 + Math.random() * 0.8) * 0.5419;
      var gmTheme = theme === 'gm';
      columns = Array.from({ length: count }, function (_, i) {
        return {
          y: burstFall ? -Math.random() * rows * 0.35 : Math.random() * rows,
          speed: burstFall ? fall * (0.92 + Math.random() * 0.16) : fall,
          gm: gmTheme ? true : Math.random() < 0.05,
          seq: Math.floor(Math.random() * GM_SEQ.length),
          hold: 18 + Math.floor(Math.random() * 12),
          glyphs: Array.from({ length: 11 }, function () {
            return CLASSIC[Math.floor(Math.random() * CLASSIC.length)] || '0';
          }),
        };
      });
      // For classic theme, force classic columns (except rare GM sparkle kept as original)
      if (!gmTheme) {
        columns.forEach(function (c) {
          c.gm = Math.random() < 0.05;
        });
      } else {
        // Godzilla Mode: all columns use rainbow GM_SEQ trails
        columns.forEach(function (c) {
          c.gm = true;
        });
      }
      g.fillStyle = '#000';
      g.fillRect(0, 0, w, h);
    }

    function tick(now) {
      if (!running) return;
      if (document.hidden) {
        raf = window.requestAnimationFrame(tick);
        return;
      }
      frame += 1;
      var w = window.innerWidth;
      var h = window.innerHeight;
      var tMs = now - t0;
      g.fillStyle = reduced ? 'rgba(0,0,0,0.28)' : 'rgba(0,0,0,0.2)';
      g.fillRect(0, 0, w, h);
      g.font = '700 ' + size + 'px "IBM Plex Mono", Consolas, monospace';
      g.textBaseline = 'top';
      g.textAlign = 'left';
      var classicPx = Math.round(size * 1.08);
      var gmPx = Math.round(size * 0.92);
      for (var i = 0; i < columns.length; i++) {
        var col = columns[i];
        var x = Math.round(i * pitch);
        var flip = frame % col.hold === 0;
        if (col.gm) {
          g.font = '600 ' + gmPx + 'px "IBM Plex Mono", Consolas, monospace';
          if (flip) col.seq = (col.seq + 1) % GM_SEQ.length;
          var trail = GM_SEQ.length;
          for (var k = 0; k < trail; k++) {
            var yy = Math.round((col.y - k) * rowGap);
            if (yy < -rowGap || yy > h) continue;
            var ch = GM_SEQ[(col.seq + k) % GM_SEQ.length] || 'G';
            g.fillStyle = rainbowAt(tMs, i, Math.floor(col.y) - k);
            g.fillText(ch === ' ' ? '·' : ch, x, yy);
          }
        } else {
          g.font = '800 ' + classicPx + 'px "IBM Plex Mono", Consolas, monospace';
          if (flip) {
            col.glyphs.pop();
            col.glyphs.unshift(glyph());
          }
          var y = Math.round(col.y * rowGap);
          var greens = [
            '#d8ff9a', '#b6ff7a', '#4dff3a', '#3dff1a', '#32c428',
            '#2f9e2c', '#268528', '#1d7a22', '#17661a', '#125214', '#0d3f10',
          ];
          for (var j = 0; j < col.glyphs.length; j++) {
            var y2 = y - j * rowGap;
            if (y2 < -rowGap || y2 > h) continue;
            var ch2 = col.glyphs[j] || '0';
            g.strokeStyle = '#031208';
            g.lineWidth = 1.35;
            g.strokeText(ch2, x, y2);
            g.fillStyle = greens[j] || '#17661a';
            g.fillText(ch2, x, y2);
          }
        }
        col.y += col.speed;
        if (!burstFall && col.y * rowGap > h && Math.random() > (reduced ? 0.992 : 0.975)) col.y = 0;
      }
      g.fillStyle = theme === 'gm' ? '#e879b0' : '#2f7d34';
      g.font = '700 ' + Math.round(size * 0.7) + 'px "IBM Plex Mono", Consolas, monospace';
      g.fillText(label, 16, h - size * 2);
      raf = window.requestAnimationFrame(tick);
    }

    function onResize() { resize(); }
    resize();
    window.addEventListener('resize', onResize);
    raf = window.requestAnimationFrame(tick);

    return {
      stop: function () {
        running = false;
        window.cancelAnimationFrame(raf);
        window.removeEventListener('resize', onResize);
      },
    };
  }

  global.S1R1USRain = { startRain: startRain, GM_SEQ: GM_SEQ, CLASSIC: CLASSIC, RAINBOW: RAINBOW };
})(typeof window !== 'undefined' ? window : this);
