/*! S1R1US.ai live debt clock. Vanilla JS, no dependencies, CSP-safe (no eval, no inline styles injected).
 * Markup: <section class="s1w s1w-debt" data-s1w="debt-clock" data-snapshot="/ai-building-systems/econ/data/snapshot.json" data-live="1"></section>
 * Shows a LIVE ESTIMATE: official Treasury total + (elapsed seconds since the record date closed) x average rate.
 */
(function () {
  "use strict";
  var API = "https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_to_penny?fields=record_date,tot_pub_debt_out_amt&sort=-record_date&page[size]=100";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fmtUSD0 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  var fmtUSD2 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function link(href, text) { var a = el("a", null, text); a.href = href; a.rel = "noopener"; a.target = "_blank"; return a; }
  function longDate(iso) { var d = new Date(iso + "T12:00:00Z"); return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }); }

  function fetchJSON(url, ms) {
    var ctl = "AbortController" in window ? new AbortController() : null;
    var t = setTimeout(function () { if (ctl) ctl.abort(); }, ms);
    return fetch(url, { signal: ctl ? ctl.signal : undefined, credentials: "omit", cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .finally(function () { clearTimeout(t); });
  }

  // Same method as scripts/refresh-data.mjs computeDebtSnapshot(): OLS slope over the last 90 calendar days.
  function compute(records) {
    var rows = records.map(function (r) { return { d: r.record_date, t: Date.parse(r.record_date + "T00:00:00Z") / 1000, v: Number(r.tot_pub_debt_out_amt) }; })
      .filter(function (r) { return isFinite(r.v); }).sort(function (a, b) { return a.t - b.t; });
    var last = rows[rows.length - 1];
    var win = rows.filter(function (r) { return r.t >= last.t - 90 * 86400; });
    var n = win.length, mt = 0, mv = 0, num = 0, den = 0, i;
    for (i = 0; i < n; i++) { mt += win[i].t; mv += win[i].v; }
    mt /= n; mv /= n;
    for (i = 0; i < n; i++) { num += (win[i].t - mt) * (win[i].v - mv); den += (win[i].t - mt) * (win[i].t - mt); }
    return {
      total: last.v, record_date: last.d, anchor_utc: new Date((last.t + 86400) * 1000).toISOString(),
      rate_per_second: Math.round((num / den) * 100) / 100,
      rate_window: { from: win[0].d, to: last.d, records: n, days: 90 }, live: true
    };
  }

  function render(root, snap, origin) {
    root.textContent = "";
    root.setAttribute("aria-labelledby", (root.id || "s1w-debt") + "-h");
    var h = el("h3", null, "U.S. national debt: live estimate");
    h.id = (root.id || "s1w-debt") + "-h";
    root.appendChild(el("div", "s1w-debt-kicker", "U.S. debt clock"));
    root.appendChild(h);
    var num = el("span", "s1w-debt-num");
    num.setAttribute("aria-hidden", "true"); // ticking digits are decorative; static text below is announced
    root.appendChild(num);
    var sr = el("p", "s1w-sr");
    root.appendChild(sr);
    var lines = el("div", "s1w-debt-lines");
    lines.appendChild(el("div", null, "Official Treasury total: " + fmtUSD2.format(snap.total) + " as of " + longDate(snap.record_date)));
    lines.appendChild(el("div", null, "Growing about " + fmtUSD0.format(snap.rate_per_second) + " per second, based on recent official daily totals (" + longDate(snap.rate_window.from) + " to " + longDate(snap.rate_window.to) + ")"));
    lines.appendChild(el("div", "s1w-muted", origin === "live" ? "Data: official U.S. Treasury figures, loaded live." : "Data: a saved copy of official U.S. Treasury figures" + (snap.generated_utc ? " (" + longDate(snap.generated_utc.slice(0, 10)) + ")" : "") + "."));
    root.appendChild(lines);
    root.appendChild(el("p", "s1w-debt-label", "Live estimate by S1R1US.ai based on official U.S. Treasury data. Not an official count."));
    var src = el("p", "s1w-src");
    src.appendChild(link("https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/", "Source: U.S. Department of the Treasury, Fiscal Data (public domain)"));
    src.appendChild(document.createTextNode(" · See also: "));
    src.appendChild(link("https://www.usdebtclock.org/", "usdebtclock.org"));
    root.appendChild(src);

    var anchor = Date.parse(snap.anchor_utc);
    function valueAt(ms) { return snap.total + Math.max(0, (ms - anchor) / 1000) * snap.rate_per_second; }
    var staticVal = valueAt(Date.now());
    sr.textContent = "Estimated U.S. national debt right now: about " + fmtUSD0.format(staticVal) + ". Official Treasury total " + fmtUSD2.format(snap.total) + " as of " + longDate(snap.record_date) + ".";
    if (reduce) { num.textContent = fmtUSD0.format(staticVal); num.setAttribute("aria-hidden", "false"); sr.remove(); return; }
    var last = "";
    function tick() {
      var s = fmtUSD0.format(valueAt(Date.now()));
      if (s !== last) { num.textContent = s; last = s; }
      if (document.contains(num)) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function boot(root) {
    var snapUrl = root.getAttribute("data-snapshot");
    var live = root.getAttribute("data-live") !== "0";
    var fallback = snapUrl ? fetchJSON(snapUrl, 6000) : Promise.reject(new Error("no snapshot"));
    var attempt = live ? fetchJSON(API, 5000).then(function (j) { return { snap: compute(j.data), origin: "live" }; }) : Promise.reject(new Error("live off"));
    attempt.catch(function () { return fallback.then(function (s) { return { snap: s, origin: "snapshot" }; }); })
      .then(function (r) { render(root, r.snap, r.origin); })
      .catch(function () { root.textContent = ""; root.appendChild(el("p", "s1w-err", "Debt data is temporarily unavailable. See the official figure at fiscaldata.treasury.gov.")); });
  }
  function init() { var n = document.querySelectorAll('[data-s1w="debt-clock"]'); for (var i = 0; i < n.length; i++) boot(n[i]); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
