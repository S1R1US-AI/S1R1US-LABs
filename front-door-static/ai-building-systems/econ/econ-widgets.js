/*! S1R1US.ai econ widgets (foreign holders, jobs & wages points, H-1B/H-2B callout, squeeze panel).
 * Vanilla JS + SVG, no dependencies, no external requests (reads same-origin build-time JSON).
 * Each widget: <section class="s1w" data-s1w="NAME" data-base="/ai-building-systems/econ/data/"></section>
 * NAME = foreign-holders | jobs-manufacturing | jobs-trades | h1b-callout | jobs-unions | jobs-squeeze
 * All captions are computed from the JSON at render time, so a data refresh keeps the numbers true.
 */
(function () {
  "use strict";
  var SVGNS = "http://www.w3.org/2000/svg";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var LABEL = "Correlation, not proof of cause.";
  var cache = {};
  function getJSON(base, name) { var u = base + name; if (!cache[u]) cache[u] = fetch(u, { credentials: "same-origin" }).then(function (r) { if (!r.ok) throw new Error(u + " " + r.status); return r.json(); }); return cache[u]; }

  /* ---------------- formatting ---------------- */
  var nf0 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
  var nf1 = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  var usd0 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  var usd2 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function ymLabel(ym) { var p = ym.split("-"); return MONTHS[+p[1] - 1] + " " + p[0]; }
  function qLabel(ym) { var p = ym.split("-"); return "Q" + (Math.floor((+p[1] - 1) / 3) + 1) + " " + p[0]; }
  function pct(a, b) { return ((b - a) / a) * 100; }
  function sPct(x) { return (x >= 0 ? "+" : "") + nf1.format(x) + "%"; }
  function t(ym) { var p = String(ym).split("-"); return Date.UTC(+p[0], (+(p[1] || 1)) - 1, 1); }
  function first(s) { return s[0]; }
  function last(s) { return s[s.length - 1]; }
  function at(s, ym) { for (var i = 0; i < s.length; i++) if (s[i][0] === ym) return s[i][1]; return null; }
  function minOf(s) { return s.reduce(function (m, r) { return r[1] < m[1] ? r : m; }, s[0]); }
  function annualAvg(s, y) { var v = s.filter(function (r) { return r[0].slice(0, 4) === String(y); }); return v.length ? v.reduce(function (a, r) { return a + r[1]; }, 0) / v.length : null; }

  /* ---------------- DOM ---------------- */
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function a(href, text) { var x = el("a", null, text); x.href = href; x.rel = "noopener"; x.target = "_blank"; return x; }
  function sv(tag, attrs, text) { var e = document.createElementNS(SVGNS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; }
  function caption(parent, html) { // html: array of strings / {b: "bold"} parts
    var p = el("p", "s1w-caption");
    html.forEach(function (part) { if (typeof part === "string") p.appendChild(document.createTextNode(part)); else p.appendChild(el("strong", null, part.b)); });
    parent.appendChild(p); return p;
  }
  function tag(parent, text, warn) { parent.appendChild(el("span", "s1w-tag" + (warn ? " s1w-tag--warn" : ""), text)); }
  function sources(parent, list, extra) {
    var wrap = el("div", "s1w-src");
    wrap.appendChild(el("strong", null, "Sources: "));
    var ul = el("ul"); ul.className = "s1w-srclist";
    (list || []).concat(extra || []).forEach(function (s) { var li = el("li"); li.appendChild(el("span", "s1w-muted", s.k === "news" ? "[news] " : "[official] ")); li.appendChild(a(s.url, s.label)); ul.appendChild(li); });
    wrap.appendChild(ul); parent.appendChild(wrap);
  }
  function table(parent, summary, head, rows) {
    var d = el("details"); d.appendChild(el("summary", null, summary));
    var w = el("div", "s1w-tablewrap"); w.tabIndex = 0; w.setAttribute("role", "region"); w.setAttribute("aria-label", summary);
    var tb = el("table"), th = el("thead"), tr = el("tr");
    head.forEach(function (h) { var c = el("th", null, h); c.scope = "col"; tr.appendChild(c); });
    th.appendChild(tr); tb.appendChild(th);
    var body = el("tbody");
    rows.forEach(function (r) { var row = el("tr"); r.forEach(function (c, i) { row.appendChild(el(i === 0 ? "th" : "td", null, c)); if (i === 0) row.firstChild.scope = "row"; }); body.appendChild(row); });
    tb.appendChild(body); w.appendChild(tb); d.appendChild(w); parent.appendChild(d);
  }
  function legend(parent, items) {
    var l = el("div", "s1w-legend");
    items.forEach(function (it) { var s = el("span"); var i = el("i"); i.className = "s1w-sw-" + it[0]; s.appendChild(i); s.appendChild(document.createTextNode(it[1])); l.appendChild(s); });
    parent.appendChild(l);
  }

  /* ---------------- charts ---------------- */
  function niceTicks(min, max, n) {
    var span = max - min || 1, step = Math.pow(10, Math.floor(Math.log10(span / n))), err = (n * step) / span;
    if (err <= 0.15) step *= 10; else if (err <= 0.35) step *= 5; else if (err <= 0.75) step *= 2;
    var out = [], v = Math.ceil(min / step) * step; for (; v <= max + 1e-9; v += step) out.push(+v.toFixed(10)); return out;
  }
  // opts: {series:[{data:[[ym,v]], cls}], yFmt, markers:[{ym,label}], bands:[{from,to,label}], title, desc, yMin, yMax, xFrom, xTo, h}
  function fitW(parent) { var cw = parent && parent.clientWidth ? parent.clientWidth - 26 : 640; return Math.round(Math.min(640, Math.max(320, cw))); }
  function lineChart(parent, o) {
    var W = fitW(parent), H = o.h || 260, L = 58, R = 14, T = 16, B = 28;
    var xs = [], ys = [];
    o.series.forEach(function (s) { s.data.forEach(function (r) { xs.push(t(r[0])); ys.push(r[1]); }); });
    var x0 = o.xFrom ? t(o.xFrom) : Math.min.apply(null, xs), x1 = o.xTo ? t(o.xTo) : Math.max.apply(null, xs);
    var y0 = o.yMin != null ? o.yMin : Math.min.apply(null, ys), y1 = o.yMax != null ? o.yMax : Math.max.apply(null, ys);
    var pad = (y1 - y0) * 0.06; if (o.yMin == null) y0 -= pad; y1 += pad;
    var X = function (v) { return L + ((v - x0) / (x1 - x0)) * (W - L - R); }, Y = function (v) { return T + (1 - (v - y0) / (y1 - y0)) * (H - T - B); };
    var svg = sv("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": o.title + ". " + (o.desc || ""), preserveAspectRatio: "xMidYMid meet" });
    var g = sv("g", { "class": "s1w-grid" });
    niceTicks(y0, y1, 5).forEach(function (v) { g.appendChild(sv("line", { x1: L, x2: W - R, y1: Y(v), y2: Y(v) })); svg.appendChild(sv("text", { x: L - 6, y: Y(v) + 4, "text-anchor": "end" }, o.yFmt ? o.yFmt(v) : nf0.format(v))); });
    svg.insertBefore(g, svg.firstChild);
    var ya = new Date(x0).getUTCFullYear(), yb = new Date(x1).getUTCFullYear(), stepY = Math.max(1, Math.ceil((yb - ya) / (W < 480 ? 5 : 8)));
    for (var y = Math.ceil(ya / stepY) * stepY; y <= yb; y += stepY) { var xx = X(Date.UTC(y, 0, 1)); if (xx >= L - 1) svg.appendChild(sv("text", { x: xx, y: H - 8, "text-anchor": "middle" }, String(y))); }
    (o.bands || []).forEach(function (b) { svg.appendChild(sv("rect", { "class": "s1w-band", x: X(t(b.from)), y: T, width: Math.max(2, X(t(b.to)) - X(t(b.from))), height: H - T - B })); if (b.label) { var mg = sv("g", { "class": "s1w-marker" }); mg.appendChild(sv("text", { x: X(t(b.from)) + 3, y: T + 22 }, b.label)); svg.appendChild(mg); } });
    (o.markers || []).forEach(function (m, i) { var mg = sv("g", { "class": "s1w-marker" }); var mx = X(t(m.ym)); mg.appendChild(sv("line", { x1: mx, x2: mx, y1: T, y2: H - B })); mg.appendChild(sv("text", { x: mx + 3, y: T + 10 + i * 12 }, m.label)); svg.appendChild(mg); });
    o.series.forEach(function (s) { var d = s.data.map(function (r, i) { return (i ? "L" : "M") + X(t(r[0])).toFixed(1) + " " + Y(r[1]).toFixed(1); }).join(""); svg.appendChild(sv("path", { "class": s.cls || "s1w-l1", d: d })); });
    var box = el("div", "s1w-chart"); box.appendChild(svg); parent.appendChild(box); return svg;
  }
  // vertical bars: rows [[label, value, cls]]
  function barChart(parent, o) {
    var W = fitW(parent), H = o.h || 240, L = 58, R = 10, T = 14, B = 28, n = o.rows.length;
    var vals = o.rows.map(function (r) { return r[1]; }), lo = Math.min(0, Math.min.apply(null, vals)), hi = Math.max(0, Math.max.apply(null, vals));
    var Y = function (v) { return T + (1 - (v - lo) / (hi - lo || 1)) * (H - T - B); }, bw = (W - L - R) / n;
    var svg = sv("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": o.title + ". " + (o.desc || "") });
    var g = sv("g", { "class": "s1w-grid" }); niceTicks(lo, hi, 5).forEach(function (v) { g.appendChild(sv("line", { x1: L, x2: W - R, y1: Y(v), y2: Y(v) })); svg.appendChild(sv("text", { x: L - 6, y: Y(v) + 4, "text-anchor": "end" }, o.yFmt ? o.yFmt(v) : nf0.format(v))); }); svg.insertBefore(g, svg.firstChild);
    o.rows.forEach(function (r, i) {
      var x = L + i * bw + bw * 0.12, y = Y(Math.max(0, r[1])), h = Math.abs(Y(r[1]) - Y(0));
      if (r[3]) { // stacked second value
        var h2 = Math.abs(Y(r[3]) - Y(0)); svg.appendChild(sv("rect", { "class": "s1w-bar--alt", x: x, y: Y(r[1] + r[3]), width: bw * 0.76, height: h2 }));
        y = Y(r[1]);
      }
      svg.appendChild(sv("rect", { "class": r[2] || "s1w-bar", x: x, y: y, width: bw * 0.76, height: Math.max(1, h) }));
      if (n <= 30 && (i % Math.ceil(n / 13) === 0 || i === n - 1)) svg.appendChild(sv("text", { x: x + bw * 0.38, y: H - 8, "text-anchor": "middle" }, r[0]));
    });
    var box = el("div", "s1w-chart"); box.appendChild(svg); parent.appendChild(box); return svg;
  }

  /* ---------------- widgets ---------------- */
  var W = {};

  W["foreign-holders"] = function (root, base) {
    return Promise.all([getJSON(base, "foreign-holders.json"), getJSON(base, "sources.json")]).then(function (r) {
      var d = r[0], S = r[1];
      root.appendChild(el("h3", null, d.title));
      var latest = last(d.months);
      var status = el("p", "s1w-muted"); root.appendChild(status);
      var controls = el("div", "s1w-controls");
      var lab = el("label", null, "Month "); var range = el("input"); range.type = "range"; range.min = 0; range.max = d.months.length - 1; range.step = 1; range.value = d.months.length - 1; range.id = "s1w-fh-range-" + Math.random().toString(36).slice(2, 7);
      lab.htmlFor = range.id; var out = el("output"); out.setAttribute("for", range.id);
      var play = el("button", null, "▶ Play 2000 → now"); play.type = "button";
      controls.appendChild(lab); controls.appendChild(range); controls.appendChild(out); if (!reduce) controls.appendChild(play);
      root.appendChild(controls);
      var chartBox = el("div", "s1w-chart"); root.appendChild(chartBox);
      var live = el("p", "s1w-sr"); live.setAttribute("aria-live", "polite"); root.appendChild(live);
      function draw(i, announce) {
        var m = d.months[i], rows = m.top, max = d.months.reduce(function (mx, x) { return Math.max(mx, x.top[0][1]); }, 0);
        var Wd = fitW(root), rowH = 26, Lb = Wd < 480 ? 128 : 150, H = rows.length * rowH + 10;
        var svg = sv("svg", { viewBox: "0 0 " + Wd + " " + H, role: "img", "aria-label": "Top 10 foreign holders of U.S. Treasury securities, " + ymLabel(m.m) + ": " + rows.map(function (r) { return r[0] + " $" + nf1.format(r[1]) + "B"; }).join("; ") });
        rows.forEach(function (r, k) {
          var y = 5 + k * rowH, w = (r[1] / max) * (Wd - Lb - 90);
          svg.appendChild(sv("text", { x: Lb - 8, y: y + 16, "text-anchor": "end" }, (k + 1) + ". " + r[0]));
          svg.appendChild(sv("rect", { "class": k === 0 ? "s1w-bar" : "s1w-bar s1w-bar--muted", x: Lb, y: y + 3, width: Math.max(1, w), height: rowH - 8, rx: 2 }));
          svg.appendChild(sv("text", { x: Lb + w + 6, y: y + 16 }, "$" + nf1.format(r[1]) + "B"));
        });
        chartBox.textContent = ""; chartBox.appendChild(svg);
        out.textContent = ymLabel(m.m);
        status.textContent = "As of " + ymLabel(m.m) + " · $ billions, end of month · total foreign holdings $" + nf1.format(m.total) + "B";
        if (announce) live.textContent = ymLabel(m.m) + ": #1 " + rows[0][0] + " $" + nf1.format(rows[0][1]) + " billion.";
      }
      draw(d.months.length - 1);
      range.addEventListener("input", function () { draw(+range.value, true); });
      var timer = null;
      play.addEventListener("click", function () {
        if (timer) { clearInterval(timer); timer = null; play.textContent = "▶ Play 2000 → now"; return; }
        var i = +range.value >= d.months.length - 1 ? 0 : +range.value; play.textContent = "❚❚ Pause";
        timer = setInterval(function () { range.value = i; draw(i, false); i += 3; if (i > d.months.length - 1) { range.value = d.months.length - 1; draw(d.months.length - 1, true); clearInterval(timer); timer = null; play.textContent = "▶ Play 2000 → now"; } }, 120);
      });
      root.appendChild(el("p", "s1w-muted", "Country-level data begins 2000; earlier years show total foreign holdings only."));
      root.appendChild(el("h4", null, "Total foreign holdings of U.S. federal debt, 1971 → now"));
      var tf = d.total_foreign.data, t0 = first(tf), t1 = last(tf);
      lineChart(root, { title: "Total foreign holdings of U.S. federal debt", desc: "From $" + nf1.format(t0[1]) + "B in " + qLabel(t0[0]) + " to $" + nf0.format(t1[1]) + "B in " + qLabel(t1[0]), series: [{ data: tf, cls: "s1w-l1" }], yFmt: function (v) { return "$" + nf0.format(v / 1000) + "T"; }, yMin: 0, markers: [{ ym: "1971-08", label: "Aug 15 1971: Nixon closes gold window" }] });
      caption(root, ["What the data shows: foreign and international investors held ", { b: "$" + nf1.format(t0[1]) + " billion" }, " of U.S. federal debt in " + qLabel(t0[0]) + " and ", { b: "$" + nf0.format(t1[1]) + " billion" }, " in " + qLabel(t1[0]) + " (FRED FDHBFIN, quarterly; series starts " + d.total_foreign.series_start + "). In " + ymLabel(latest.m) + " the largest holder was " + latest.top[0][0] + " ($" + nf1.format(latest.top[0][1]) + "B), followed by " + latest.top[1][0] + " ($" + nf1.format(latest.top[1][1]) + "B) and " + latest.top[2][0] + " ($" + nf1.format(latest.top[2][1]) + "B). TIC notes that custodial holdings (e.g. Belgium, Luxembourg, Cayman Islands) may not reflect the actual owner's country."]);
      table(root, "Data table: top 10 holders, " + ymLabel(latest.m), ["Rank", "Country", "$ billions"], latest.top.map(function (r, i) { return [String(i + 1), r[0], nf1.format(r[1])]; }));
      table(root, "Data table: total foreign holdings (FDHBFIN), every 4th quarter", ["Quarter", "$ billions"], tf.filter(function (r) { return r[0].slice(5, 7) === "10"; }).map(function (r) { return [qLabel(r[0]), nf1.format(r[1])]; }));
      d.notes.forEach(function (n) { root.appendChild(el("p", "s1w-muted", n)); });
      sources(root, S.holders);
    });
  };

  W["jobs-manufacturing"] = function (root, base) {
    return Promise.all([getJSON(base, "wages.json"), getJSON(base, "h1b-abuse.json"), getJSON(base, "sources.json")]).then(function (r) {
      var w = r[0].series, ct = r[0].china_trade, cs = r[1].china_shock, S = r[2];
      root.appendChild(el("h3", null, "1 · Manufacturing offshored")); tag(root, LABEL, true);
      var m = w.MANEMP.data, m0 = first(m), m1 = last(m), mlo = minOf(m);
      root.appendChild(el("h4", null, "Manufacturing jobs (thousands)"));
      lineChart(root, { title: "U.S. manufacturing employment", desc: nf0.format(m0[1]) + " thousand in " + ymLabel(m0[0]) + ", " + nf0.format(m1[1]) + " thousand in " + ymLabel(m1[0]), series: [{ data: m }], markers: [{ ym: "2001-12", label: "Dec 2001: China joins WTO" }] });
      caption(root, ["What the data shows: manufacturing employment was ", { b: nf0.format(m0[1] * 1000) }, " in " + ymLabel(m0[0]) + " and ", { b: nf0.format(m1[1] * 1000) }, " in " + ymLabel(m1[0]) + " (" + sPct(pct(m0[1], m1[1])) + ", " + nf0.format((m1[1] - m0[1]) * 1000) + " jobs). The low point was " + nf0.format(mlo[1] * 1000) + " in " + ymLabel(mlo[0]) + ". Automation and productivity also reduced factory jobs; the chart cannot separate causes."]);
      sources(root, S.manufacturing);

      var au = w.CES3133600101.data, a0 = first(au), a1 = last(au), alo = minOf(au);
      root.appendChild(el("h4", null, "Motor vehicles & parts jobs (thousands)"));
      lineChart(root, { title: "U.S. motor vehicles and parts employment", desc: nf0.format(a0[1]) + " thousand in " + ymLabel(a0[0]) + ", " + nf0.format(a1[1]) + " thousand in " + ymLabel(a1[0]), series: [{ data: au }], markers: [{ ym: "2001-12", label: "WTO" }], bands: [{ from: "2008-12", to: "2009-07", label: "Auto bailout" }] });
      caption(root, ["What the data shows: motor vehicle and parts employment was ", { b: nf0.format(a0[1] * 1000) }, " in " + ymLabel(a0[0]) + " and ", { b: nf0.format(a1[1] * 1000) }, " in " + ymLabel(a1[0]) + " (" + sPct(pct(a0[1], a1[1])) + "). Low: " + nf0.format(alo[1] * 1000) + " in " + ymLabel(alo[0]) + ", during the 2008-09 auto bailout (federal loans announced Dec 19 2008; GM and Chrysler bankruptcies Apr-Jul 2009). NAFTA had been in force since Jan 1 1994 (replaced by USMCA on Jul 1 2020), so it predates this chart."]);
      sources(root, S.autos);

      var yrs = Object.keys(ct.years).filter(function (y) { return +y >= 2000; }).sort();
      var rows = yrs.map(function (y) { return [y.slice(2) === y.slice(2) ? "’" + y.slice(2) : y, ct.years[y].balance / 1000, +y === +ct.latest_year && ct.latest_year_months < 12 ? "s1w-bar--muted" : "s1w-bar--alt"]; });
      var full = yrs.filter(function (y) { return !(+y === +ct.latest_year && ct.latest_year_months < 12); }), peak = full.reduce(function (p, y) { return ct.years[y].balance < ct.years[p].balance ? y : p; }, full[0]), lf = full[full.length - 1];
      root.appendChild(el("h4", null, "U.S. goods trade balance with China ($ billions)"));
      barChart(root, { title: "U.S. goods trade balance with China, 2000 to " + ct.latest_year, rows: rows, yFmt: function (v) { return "$" + nf0.format(v) + "B"; } });
      caption(root, ["What the data shows: the U.S. goods deficit with China was ", { b: "$" + nf1.format(-ct.years["2000"].balance / 1000) + "B" }, " in 2000, peaked at ", { b: "$" + nf1.format(-ct.years[peak].balance / 1000) + "B" }, " in " + peak + ", and was $" + nf1.format(-ct.years[lf].balance / 1000) + "B in " + lf + ". " + ct.latest_year + " so far (Jan-" + MONTHS[ct.latest_year_months - 1] + ", " + ct.latest_year_months + " months, shown faded): $" + nf1.format(-ct.years[ct.latest_year].balance / 1000) + "B. Nominal dollars, not seasonally adjusted."]);
      table(root, "Data table: goods trade with China ($ millions)", ["Year", "Exports", "Imports", "Balance"], yrs.map(function (y) { var v = ct.years[y]; return [y + (+y === +ct.latest_year && ct.latest_year_months < 12 ? " (Jan-" + MONTHS[ct.latest_year_months - 1] + ")" : ""), nf1.format(v.exports), nf1.format(v.imports), nf1.format(v.balance)]; }));
      sources(root, S.china_trade);
      root.appendChild(el("h4", null, "The China Shock (research estimate)"));
      caption(root, [cs.text]);
      sources(root, S.china_shock);
    });
  };

  W["jobs-trades"] = function (root, base) {
    return Promise.all([getJSON(base, "wages.json"), getJSON(base, "autos-unions.json"), getJSON(base, "sources.json")]).then(function (r) {
      var w = r[0].series, au = r[1], S = r[2], cpi = w.CPIAUCSL.data, cpiL = last(cpi);
      root.appendChild(el("h3", null, "2 · Construction and skilled trades: labor supply")); tag(root, LABEL, true);
      var fb = au.foreign_born.data, f0 = fb[0], fFull = fb.filter(function (x) { return x[3] === 12; }), fL = last(fb), fLF = last(fFull);
      root.appendChild(el("h4", null, "Foreign-born share of employed workers (%)"));
      lineChart(root, { title: "Foreign-born share of workers in construction & extraction and in production occupations", series: [{ data: fb.map(function (x) { return [String(x[0]) + "-07", x[1]]; }), cls: "s1w-l1" }, { data: fb.map(function (x) { return [String(x[0]) + "-07", x[2]]; }), cls: "s1w-l2" }], yFmt: function (v) { return nf0.format(v) + "%"; }, yMin: 0, xFrom: "2007-01", xTo: String(fL[0]) + "-12" });
      legend(root, [["l1", "Construction & extraction occupations"], ["l2", "Production (manufacturing) occupations"]]);
      caption(root, ["What the data shows: foreign-born workers were ", { b: nf1.format(f0[1]) + "%" }, " of employed workers in construction and extraction occupations in " + f0[0] + " and ", { b: nf1.format(fLF[1]) + "%" }, " in " + fLF[0] + (fL[0] !== fLF[0] ? " (" + nf1.format(fL[1]) + "% in " + fL[0] + ", an 11-month average because October " + fL[0] + " was not collected)" : "") + ". In production occupations: " + nf1.format(f0[2]) + "% in " + f0[0] + " and " + nf1.format(fLF[2]) + "% in " + fLF[0] + ". 'Foreign-born' includes naturalized citizens, legal permanent residents, temporary workers, refugees and the undocumented. The BLS series used here begin in 2007, so 2000 is not available on the same basis."]);
      table(root, "Data table: foreign-born share (%)", ["Year", "Construction & extraction", "Production"], fb.map(function (x) { return [String(x[0]) + (x[3] < 12 ? " (" + x[3] + " mo)" : ""), nf1.format(x[1]), nf1.format(x[2])]; }));
      sources(root, S.foreign_born);

      var ce = w.CES2000000003.data, real = ce.map(function (x) { var c = at(cpi, x[0]); return c ? [x[0], (x[1] * cpiL[1]) / c] : null; }).filter(Boolean), r0 = first(real), r1 = last(real), c0 = first(ce), c1 = last(ce);
      root.appendChild(el("h4", null, "Construction: real average hourly earnings (" + ymLabel(cpiL[0]) + " dollars)"));
      lineChart(root, { title: "Real average hourly earnings in construction", series: [{ data: real }], yFmt: function (v) { return "$" + nf0.format(v); } });
      caption(root, ["What the data shows: average hourly earnings for all construction employees were $" + usd2.format(c0[1]).slice(1) + " in " + ymLabel(c0[0]) + " and $" + usd2.format(c1[1]).slice(1) + " in " + ymLabel(c1[0]) + " (nominal). Adjusted for CPI-U to " + ymLabel(cpiL[0]) + " dollars: ", { b: usd2.format(r0[1]) }, " then vs ", { b: usd2.format(r1[1]) }, " now (" + sPct(pct(r0[1], r1[1])) + "). The series starts in March 2006, so 2000-2005 is not available."]);
      sources(root, S.construction_wages);

      var e = au.electricians, eb = e.baseline, el_ = e.latest, cB = at(cpi, "2000-11"), cLy = at(cpi, el_.year + "-05"), realBase = eb.median_annual * cLy / cB;
      root.appendChild(el("h4", null, "One example: electricians (SOC 47-2111)"));
      var kv = el("div", "s1w-kv");
      [["Jobs, " + eb.period, nf0.format(eb.employment)], ["Jobs, " + el_.period, nf0.format(el_.employment)], ["Median pay, " + eb.period, usd0.format(eb.median_annual)], ["Median pay, " + el_.period, usd0.format(el_.median_annual)]].forEach(function (p) { var dv = el("div"); dv.appendChild(el("b", null, p[1])); dv.appendChild(document.createTextNode(p[0])); kv.appendChild(dv); });
      root.appendChild(kv);
      caption(root, ["What the data shows: electrician employment ", { b: (el_.employment >= eb.employment ? "grew" : "fell") + " " + sPct(pct(eb.employment, el_.employment)) }, " (" + nf0.format(eb.employment) + " to " + nf0.format(el_.employment) + "). Median annual pay rose from " + usd0.format(eb.median_annual) + " to " + usd0.format(el_.median_annual) + " (" + sPct(pct(eb.median_annual, el_.median_annual)) + " nominal). In May " + el_.year + " dollars the 2000 median equals about " + usd0.format(realBase) + ", so real median pay changed ", { b: sPct(pct(realBase, el_.median_annual)) }, ". OES (2000) and OEWS (" + el_.year + ") methods differ somewhat; treat as approximate."]);
      sources(root, S.electricians);
      root.appendChild(el("h4", null, "Immigration and wages: what research says"));
      caption(root, ["The National Academies of Sciences (2017), 'The Economic and Fiscal Consequences of Immigration', found the effect of immigration on the wages of native-born workers overall to be very small over 10 years or more, with larger negative effects for some groups: prior immigrants and native-born workers without a high school diploma, the closest substitutes for new low-skilled immigrants. Economists disagree on the size: for example, David Card's study of the 1980 Mariel boatlift (ILR Review, 1990) found little effect on Miami wages, while George Borjas's reappraisal (ILR Review, 2017) found large negative effects for low-skilled native men."]);
      sources(root, S.immigration_wages);
    });
  };

  W["h1b-callout"] = function (root, base) {
    root.classList.add("s1w-callout");
    return Promise.all([getJSON(base, "h1b-abuse.json"), getJSON(base, "sources.json")]).then(function (r) {
      var d = r[0], S = r[1], h = d.h1b_approvals.data;
      root.appendChild(el("h3", null, "3 · " + d.title)); tag(root, d.label, true);
      root.appendChild(el("h4", null, "H-1B petitions approved per fiscal year (initial + continuing)"));
      var rows = h.map(function (x) { return x.total ? ["’" + String(x.fy).slice(2), x.total, "s1w-bar--muted"] : ["’" + String(x.fy).slice(2), x.initial, "s1w-bar", x.continuing]; });
      barChart(root, { title: "H-1B petitions approved by fiscal year", rows: rows, yFmt: function (v) { return nf0.format(v / 1000) + "k"; } });
      legend(root, [["bar", "Initial employment"], ["alt", "Continuing employment"], ["muted", "Total only (FY2025)"]]);
      var h0 = h[0], hL = h.filter(function (x) { return x.initial; }).slice(-1)[0], h25 = h.filter(function (x) { return x.total; })[0];
      caption(root, ["What the data shows: USCIS approved ", { b: nf0.format(h0.initial + h0.continuing) }, " H-1B petitions in FY" + h0.fy + " (" + nf0.format(h0.initial) + " initial) and ", { b: nf0.format(hL.initial + hL.continuing) }, " in FY" + hL.fy + " (" + nf0.format(hL.initial) + " initial)." + (h25 ? " FY" + h25.fy + " total: " + nf0.format(h25.total) + "." : "") + " " + d.h1b_approvals.note]);
      caption(root, [d.cap.text]);
      table(root, "Data table: H-1B approvals", ["FY", "Initial", "Continuing", "Total"], h.map(function (x) { return x.total ? [String(x.fy), "–", "–", nf0.format(x.total)] : [String(x.fy), nf0.format(x.initial), nf0.format(x.continuing), nf0.format(x.initial + x.continuing)]; }));
      var te = d.top_employers; root.appendChild(el("h4", null, te.title));
      var ol = el("ol"); te.data.forEach(function (x) { var li = el("li", null, x[0] + ": " + nf0.format(x[1]) + (x[2] ? "  (IT services / outsourcing)" : "")); ol.appendChild(li); }); root.appendChild(ol);
      root.appendChild(el("p", "s1w-muted", te.note));
      root.appendChild(el("h4", null, "Documented cases and program weaknesses"));
      var ul = el("ul", "s1w-cases");
      d.cases.forEach(function (c) { var li = el("li"); var tm = el("time", null, c.date); tm.dateTime = c.date; li.appendChild(tm); li.appendChild(el("span", "s1w-tag", c.kind)); var hh = el("div", "s1w-case-h"); hh.appendChild(a(c.url, c.title)); li.appendChild(hh); li.appendChild(el("p", null, c.text)); (c.extra || []).forEach(function (x) { li.appendChild(a(x.url, x.label)); li.appendChild(document.createTextNode(" ")); }); ul.appendChild(li); });
      root.appendChild(ul);
      if (d.h2b) {
        root.appendChild(el("h4", null, d.h2b.title));
        caption(root, [d.h2b.text]);
        var ul2 = el("ul", "s1w-cases"); d.h2b.cases.forEach(function (c) { var li = el("li"); var tm = el("time", null, c.date); tm.dateTime = c.date; li.appendChild(tm); li.appendChild(el("span", "s1w-tag", c.kind)); var hh = el("div", "s1w-case-h"); hh.appendChild(a(c.url, c.title)); li.appendChild(hh); li.appendChild(el("p", null, c.text)); ul2.appendChild(li); }); root.appendChild(ul2);
        sources(root, S.h2b);
      }
      root.appendChild(el("h4", null, "Do H-1B visas lower U.S. wages? Economists disagree"));
      d.debate.sides.forEach(function (s) { var p = el("p", "s1w-caption"); p.appendChild(el("strong", null, s.label + ": ")); p.appendChild(document.createTextNode(s.text + " ")); p.appendChild(a(s.url, "Read")); root.appendChild(p); });
      root.appendChild(el("p", "s1w-muted", "These are documented cases and program weaknesses, not a measure of how often abuse happens. No total is implied."));
      sources(root, S.h1b, d.h1b_approvals.sources.map(function (x) { return { k: "gov", label: x.label, url: x.url }; }));
    });
  };

  W["jobs-unions"] = function (root, base) {
    return Promise.all([getJSON(base, "autos-unions.json"), getJSON(base, "sources.json")]).then(function (r) {
      var u = r[0].union, S = r[1], byId = {}; u.forEach(function (s) { byId[s.id] = s; });
      root.appendChild(el("h3", null, "4 · Union decline")); tag(root, LABEL, true);
      var order = [["LUU0204899600", "l1"], ["LUU0204906600", "l2"], ["LUU0204910500", "l3"], ["LUU0204909800", "l4"], ["LUU0204910600", "l5"]];
      lineChart(root, { title: "Union membership rate, % of employed wage and salary workers", series: order.map(function (o) { return { data: byId[o[0]].data.map(function (x) { return [x[0] + "-07", x[1]]; }), cls: "s1w-" + o[1] }; }), yFmt: function (v) { return nf0.format(v) + "%"; }, yMin: 0 });
      legend(root, order.map(function (o) { return [o[1], byId[o[0]].label]; }));
      var parts = ["What the data shows (union MEMBERSHIP rate, not jobs): "];
      order.forEach(function (o, i) { var s = byId[o[0]].data, a0 = first(s), a1 = last(s); parts.push(byId[o[0]].label + " "); parts.push({ b: nf1.format(a0[1]) + "% (" + a0[0] + ") → " + nf1.format(a1[1]) + "% (" + a1[0] + ")" }); parts.push(i < order.length - 1 ? "; " : ". "); });
      parts.push("A falling membership rate means a smaller share of workers belong to unions; it does not by itself mean those jobs disappeared. " + last(byId.LUU0204899600.data)[0] + " annual figures are 11-month averages (October not collected).");
      caption(root, parts);
      table(root, "Data table: union membership rate (%)", ["Year"].concat(order.map(function (o) { return byId[o[0]].label; })), byId.LUU0204899600.data.map(function (x, i) { return [String(x[0])].concat(order.map(function (o) { var v = byId[o[0]].data[i]; return v ? nf1.format(v[1]) : "–"; })); }));
      sources(root, S.unions);
    });
  };

  W["jobs-squeeze"] = function (root, base) {
    return Promise.all([getJSON(base, "wages.json"), getJSON(base, "sources.json")]).then(function (r) {
      var w = r[0].series, S = r[1], cpi = w.CPIAUCSL.data, c0 = first(cpi), cL = last(cpi);
      root.appendChild(el("h3", null, "Tie it together: the squeeze on American workers")); tag(root, LABEL, true);
      // nominal wage index: AHETPI Jan 2000 -> Feb 2006, then chained to CES0500000003 from Mar 2006
      var ah = w.AHETPI.data, ce = w.CES0500000003.data, sw = first(ce)[0], ahSw = at(ah, sw), ah0 = first(ah)[1];
      var wageIdx = ah.filter(function (x) { return x[0] < sw; }).map(function (x) { return [x[0], (x[1] / ah0) * 100]; }).concat(ce.map(function (x) { return [x[0], ((ahSw / ah0) * 100 * x[1]) / first(ce)[1]]; }));
      var cpiIdx = cpi.map(function (x) { return [x[0], (x[1] / c0[1]) * 100]; }), wL = last(wageIdx);
      root.appendChild(el("h4", null, "Prices vs paychecks (Jan 2000 = 100)"));
      lineChart(root, { title: "CPI-U vs nominal average hourly earnings, indexed Jan 2000 = 100", series: [{ data: cpiIdx, cls: "s1w-l2" }, { data: wageIdx, cls: "s1w-l1" }], markers: [{ ym: sw, label: "wage series switch" }] });
      legend(root, [["l2", "CPI-U (prices)"], ["l1", "Avg hourly earnings (nominal)"]]);
      caption(root, ["What the data shows: from " + ymLabel(c0[0]) + " to " + ymLabel(cL[0]) + ", consumer prices (CPI-U) rose ", { b: sPct(cpiIdx[cpiIdx.length - 1][1] - 100) }, " and nominal average hourly earnings rose ", { b: sPct(wL[1] - 100) }, " (to " + ymLabel(wL[0]) + "). Wage line: production & nonsupervisory workers (AHETPI) through " + ymLabel(ah.filter(function (x) { return x[0] < sw; }).slice(-1)[0][0]) + ", then all private employees (CES0500000003, which starts " + ymLabel(sw) + "), chained at the switch. Production & nonsupervisory pay alone: " + usd2.format(ah0) + " → $" + usd2.format(last(ah)[1]).slice(1) + " (" + sPct(pct(ah0, last(ah)[1])) + "). Averages say nothing about who gained or lost within the workforce."]);

      var re = w.LES1252881600Q.data, re0 = first(re), reL = last(re), reLo = minOf(re);
      root.appendChild(el("h4", null, "Real median weekly earnings (1982-84 dollars)"));
      lineChart(root, { title: "Real median usual weekly earnings, full-time workers", series: [{ data: re }], yFmt: function (v) { return "$" + nf0.format(v); } });
      caption(root, ["What the data shows: real (inflation-adjusted) median weekly earnings of full-time workers were ", { b: "$" + re0[1] }, " in " + qLabel(re0[0]) + " and ", { b: "$" + reL[1] }, " in " + qLabel(reL[0]) + " (" + sPct(pct(re0[1], reL[1])) + ", 1982-84 dollars). " + (reL[1] > re0[1] ? "By this measure the typical full-time worker's real weekly pay is HIGHER now than in 2000. " : "By this measure real weekly pay is lower now than in 2000. ") + "The low was $" + reLo[1] + " in " + qLabel(reLo[0]) + "."]);

      var gd = w.GFDEBTN.data, ls = w.PRS85006173.data, gp = w.GFDEGDQ188S.data, pop = w.POPTHM.data;
      var perCap = gd.map(function (x) { var p = at(pop, x[0]); return p ? [x[0], (x[1] * 1e6) / (p * 1e3)] : null; }).filter(Boolean), pc0 = first(perCap), pcL = last(perCap);
      root.appendChild(el("h4", null, "Federal debt per person vs labor's share of income"));
      var grid = el("div", "s1w-grid2"); root.appendChild(grid);
      var g1 = el("div"), g2 = el("div"); grid.appendChild(g1); grid.appendChild(g2);
      lineChart(g1, { title: "Federal debt per person", series: [{ data: perCap }], yFmt: function (v) { return "$" + nf0.format(v / 1000) + "k"; }, yMin: 0, h: 220 });
      lineChart(g2, { title: "Labor share, nonfarm business (index 2017=100)", series: [{ data: ls, cls: "s1w-l2" }], h: 220 });
      caption(root, ["What the data shows: total public debt was ", { b: "$" + nf1.format(first(gd)[1] / 1e6) + " trillion" }, " in " + qLabel(first(gd)[0]) + " (" + nf1.format(first(gp)[1]) + "% of GDP) and ", { b: "$" + nf1.format(last(gd)[1] / 1e6) + " trillion" }, " in " + qLabel(last(gd)[0]) + " (" + nf1.format(last(gp)[1]) + "% of GDP in " + qLabel(last(gp)[0]) + "). Per person: " + usd0.format(pc0[1]) + " → ", { b: usd0.format(pcL[1]) }, " (debt ÷ BEA population). Labor's share of nonfarm business income (index, 2017 = 100): " + nf1.format(first(ls)[1]) + " in " + qLabel(first(ls)[0]) + " → " + nf1.format(last(ls)[1]) + " in " + qLabel(last(ls)[0]) + " (" + sPct(pct(first(ls)[1], last(ls)[1])) + ")."]);

      var hp = w.MSPUS.data, inc = w.MEHOINUSA646N.data, cs = w.CSUSHPINSA.data;
      var incYears = inc.map(function (x) { return x[0].slice(0, 4); });
      var ratio = incYears.map(function (y) { var p = annualAvg(hp, y), i = at(inc, y + "-01"); return p && i ? [y + "-07", p / i] : null; }).filter(Boolean), ra0 = first(ratio), raL = last(ratio);
      root.appendChild(el("h4", null, "Housing: median home price ÷ median household income"));
      lineChart(root, { title: "Median new-home sales price divided by median household income", series: [{ data: ratio }], yFmt: function (v) { return nf1.format(v) + "×"; }, h: 220 });
      caption(root, ["What the data shows: the median sales price of houses sold was ", { b: nf1.format(ra0[1]) + "×" }, " median household income in 2000 (" + usd0.format(annualAvg(hp, 2000)) + " vs " + usd0.format(at(inc, "2000-01")) + ") and ", { b: nf1.format(raL[1]) + "×" }, " in " + raL[0].slice(0, 4) + " (" + usd0.format(annualAvg(hp, raL[0].slice(0, 4))) + " vs " + usd0.format(at(inc, raL[0].slice(0, 4) + "-01")) + "). Case-Shiller U.S. national home price index: 100 in Jan 2000 → " + nf1.format(last(cs)[1]) + " in " + ymLabel(last(cs)[0]) + " (" + sPct(last(cs)[1] - 100) + ") vs CPI " + sPct(cpiIdx[cpiIdx.length - 1][1] - 100) + ". MSPUS is new homes sold (Census/HUD); income is nominal Census CPS-ASEC."]);

      root.appendChild(el("h4", null, "What $100 in a past year costs today (CPI-U)"));
      var form = el("div", "s1w-controls"), lab1 = el("label", null, "$ "), amt = el("input"), lab2 = el("label", null, " in "), sel = el("select"), out = el("output");
      amt.type = "number"; amt.min = 0; amt.step = "1"; amt.value = 100; amt.id = "s1w-calc-amt"; amt.setAttribute("aria-label", "Dollar amount"); sel.setAttribute("aria-label", "Starting year"); out.setAttribute("aria-live", "polite");
      for (var y = 2000; y < +cL[0].slice(0, 4); y++) { var op = el("option", null, String(y)); op.value = y; sel.appendChild(op); }
      form.appendChild(lab1); form.appendChild(amt); form.appendChild(lab2); form.appendChild(sel); form.appendChild(el("span", null, " = ")); form.appendChild(out); root.appendChild(form);
      function calc() { var v = +amt.value || 0, base = annualAvg(cpi, sel.value); out.textContent = usd2.format((v * cL[1]) / base) + " in " + ymLabel(cL[0]) + " dollars"; }
      amt.addEventListener("input", calc); sel.addEventListener("change", calc); calc();
      root.appendChild(el("p", "s1w-muted", "Uses the annual-average CPI-U of the chosen year and the latest monthly CPI-U (" + ymLabel(cL[0]) + ", " + cL[1] + ")."));
      caption(root, ["Together: since 2000 prices roughly doubled, nominal pay rose faster than prices on average, the typical full-time worker's real weekly pay is modestly higher, but home prices rose much faster than incomes, labor's share of business income fell, and federal debt per person grew about " + nf1.format(pcL[1] / pc0[1]) + "-fold. These series move together in time; that alone does not prove what caused what."]);
      sources(root, S.squeeze);
    });
  };

  function boot(root) {
    var name = root.getAttribute("data-s1w"), base = root.getAttribute("data-base") || "./data/";
    if (!W[name]) return;
    root.classList.add("s1w"); root.textContent = ""; root.setAttribute("aria-busy", "true");
    W[name](root, base).catch(function (e) { root.appendChild(el("p", "s1w-err", "Chart data could not be loaded (" + (e && e.message) + ").")); }).finally(function () { root.removeAttribute("aria-busy"); });
  }
  function init() { var n = document.querySelectorAll("[data-s1w]"); for (var i = 0; i < n.length; i++) if (n[i].getAttribute("data-s1w") !== "debt-clock") boot(n[i]); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
