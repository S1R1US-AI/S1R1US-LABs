/* Soft Matrix rain ghost — front door.
   Classic Matrix greens on charcoal fade. Custom S1R1US JP/Latin charset.
   Low opacity overlay; pointer-events none; pauses when tab hidden.
   Drives #matrix-rain and optional #matrix-rain-ghost2. */
(function () {
  'use strict';

  /* Classic greens: bright head → deep trail. High head/trail contrast. */
  var GREENS = [
    '#f4ffe6', '#d0ff78', '#72ff44', '#3dff1a', '#34cc2a',
    '#2aa424', '#208020', '#186218', '#124a14', '#0d3610', '#0a280c',
  ];

  /* Custom alphabet from the front-door greeting (unique glyphs, first-seen order):
     「AI搭載のビットコイン蓄積器へようこそ、R0B0T0氏。私たちはAIビットコインヘッジトレーディングデスクです。バイ、コンピュート。9-B0T す。S1R1US」 */
  var CHARS =
    '「AI搭載のビットコイン蓄積器へようこそ、R0BT氏。私たちはヘジレーディグスクですバピュ9-S1U」';

  var FONT_FAMILY = '"Noto Sans JP", "IBM Plex Mono", "Hiragino Sans", "Yu Gothic", sans-serif';

  function startLayer(canvas, opts) {
    if (!canvas || !canvas.getContext) return null;
    opts = opts || {};
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var cols = [];
    var fontSize = opts.fontSize || 19;
    var trail = opts.trail || 28;
    var interval = opts.interval || 64;
    /* Studio charcoal #121619 fade — kills green wash; length comes from explicit trail. */
    var fade = opts.fade || 'rgba(18, 22, 25, 0.14)';
    var density = opts.density != null ? opts.density : 1;
    var xJitter = opts.xJitter || 0;
    var running = true;
    var last = 0;

    function resize() {
      var w = window.innerWidth;
      var h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.ceil(w / fontSize);
      cols = [];
      for (var i = 0; i < n; i++) {
        if (density < 1 && Math.random() > density) {
          cols.push(null);
          continue;
        }
        cols.push({
          /* Stagger across viewport so long trails are visible immediately. */
          y: Math.random() * (h / fontSize + trail) - trail,
          glyphs: Array.from({ length: trail }, function () {
            return CHARS.charAt((Math.random() * CHARS.length) | 0);
          }),
          hold: 6 + ((Math.random() * 9) | 0),
          tick: (Math.random() * 20) | 0,
        });
      }
    }

    function frame(ts) {
      if (!running) {
        requestAnimationFrame(frame);
        return;
      }
      if (ts - last < interval) {
        requestAnimationFrame(frame);
        return;
      }
      last = ts;

      var w = window.innerWidth;
      var h = window.innerHeight;
      ctx.fillStyle = fade;
      ctx.fillRect(0, 0, w, h);
      ctx.font = '700 ' + fontSize + 'px ' + FONT_FAMILY;
      ctx.textBaseline = 'top';

      for (var i = 0; i < cols.length; i++) {
        var col = cols[i];
        if (!col) continue;
        col.tick++;
        if (col.tick % col.hold === 0) {
          col.glyphs.pop();
          col.glyphs.unshift(CHARS.charAt((Math.random() * CHARS.length) | 0));
        }
        var x = i * fontSize + xJitter;
        var y = col.y * fontSize;
        for (var j = 0; j < col.glyphs.length; j++) {
          var yy = y - j * fontSize;
          if (yy < -fontSize || yy > h) continue;
          var gIdx = Math.min(j, GREENS.length - 1);
          ctx.fillStyle = GREENS[gIdx];
          /* Bright head, clear step-down trail — readable custom glyphs at ghost opacity. */
          if (j === 0) {
            ctx.globalAlpha = 1;
          } else if (j === 1) {
            ctx.globalAlpha = 0.78;
          } else if (j < 5) {
            ctx.globalAlpha = 0.62 - (j - 2) * 0.07;
          } else {
            ctx.globalAlpha = Math.max(0.20, 0.42 - (j - 5) * 0.022);
          }
          ctx.fillText(col.glyphs[j], x, yy);
        }
        ctx.globalAlpha = 1;
        /* Slow recycle after full trail clears → longer on-screen vertical streams. */
        if (y - trail * fontSize > h && Math.random() > 0.991) {
          col.y = -(trail + ((Math.random() * 28) | 0));
        } else {
          col.y++;
        }
      }
      requestAnimationFrame(frame);
    }

    function onVis() {
      running = !document.hidden;
    }
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(frame);
    return { resize: resize };
  }

  function boot() {
    startLayer(document.getElementById('matrix-rain'), {
      fontSize: 19,
      trail: 28,
      interval: 64,
      fade: 'rgba(18, 22, 25, 0.14)',
      density: 1,
    });

    startLayer(document.getElementById('matrix-rain-ghost2'), {
      fontSize: 21,
      trail: 22,
      interval: 84,
      fade: 'rgba(18, 22, 25, 0.16)',
      density: 0.40,
      xJitter: 9,
    });
  }

  /* Wait for Noto Sans JP so CJK glyphs are not tofu on first paint. */
  if (document.fonts && document.fonts.load) {
    document.fonts.load('700 19px "Noto Sans JP"').then(boot, boot);
  } else {
    boot();
  }
})();
