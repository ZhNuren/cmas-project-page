/* CMAS project page: theme toggle, SVG charts (paper Tab. 1 + its one-click split, Tab. 2, Suppl. Tab. S6/S7, Fig. S1), BibTeX copy.
   No dependencies. */
(function () {
  "use strict";
  var KEY = "cmas-theme";
  var root = document.documentElement;

  /* ---------- theme ---------- */
  function effectiveDark() {
    var t = root.getAttribute("data-theme");
    if (t) return t === "dark";
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function setIcon() {
    var b = document.getElementById("theme-btn");
    if (!b) return;
    var dark = effectiveDark();
    b.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    b.innerHTML = dark
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8 6 18M18 6l1.8-1.8"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>';
  }
  document.addEventListener("DOMContentLoaded", function () {
    setIcon();
    var b = document.getElementById("theme-btn");
    if (b) b.addEventListener("click", function () {
      var next = effectiveDark() ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem(KEY, next); } catch (e) { /* storage unavailable */ }
      setIcon(); drawAll();
    });
    if (window.matchMedia) {
      var mq = window.matchMedia("(prefers-color-scheme: dark)");
      var on = function () { setIcon(); drawAll(); };
      if (mq.addEventListener) mq.addEventListener("change", on); else if (mq.addListener) mq.addListener(on);
    }
    drawAll();
    var t; window.addEventListener("resize", function () { clearTimeout(t); t = setTimeout(drawAll, 120); });
    initCopy();
  });

  /* ---------- helpers ---------- */
  var NS = "http://www.w3.org/2000/svg";
  function el(name, attrs, parent, text) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (text !== undefined) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  }
  function css(v) { return getComputedStyle(root).getPropertyValue(v).trim(); }
  var tip;
  function showTip(evt, html) {
    if (!tip) { tip = document.createElement("div"); tip.className = "chart-tip"; tip.setAttribute("role", "status"); document.body.appendChild(tip); }
    tip.innerHTML = html; tip.style.display = "block";
    var x = evt.clientX + 14, y = evt.clientY + 14;
    var w = tip.offsetWidth, h = tip.offsetHeight;
    if (x + w > window.innerWidth - 8) x = evt.clientX - w - 10;
    if (y + h > window.innerHeight - 8) y = evt.clientY - h - 10;
    x = Math.max(8, Math.min(x, window.innerWidth - w - 8)); y = Math.max(8, y);
    tip.style.left = x + "px"; tip.style.top = y + "px";
  }
  function hideTip() { if (tip) tip.style.display = "none"; }
  function f3(v) { return v.toFixed(3); }

  var DS = ["RAOS", "ToothFairy2", "MRISegmenter", "MoCA-Mask", "LVIS-92i", "iSAID-5i"];
  var DOM = ["Medical · CT", "Medical · CBCT", "Medical · MRI", "Camouflage", "Long-tail", "Aerial"];

  /* ---------- Tab. 1: Dice decomposition into failure modes, text prompt vs text + one click ---------- */
  var FM = [
    { k: "dice", n: "Dice", c: "--fm-dice", ink: "#fff" },
    { k: "pfn", n: "Presence false-negative", c: "--fm-pfn", ink: "#fff" },
    { k: "pfp", n: "Presence false-positive", c: "--fm-pfp", ink: "#1c1c1e" },
    { k: "sem", n: "Semantic mismatch", c: "--fm-sem", ink: "#1c1c1e" },
    { k: "fna", n: "Mask false-negative area", c: "--fm-fna", ink: "#1c1c1e" },
    { k: "fpa", n: "Mask false-positive area", c: "--fm-fpa", ink: "#fff" }
  ];
  // t: paper Tab. 1. c: the same split for text + one random GT click (mean of 3 clicks, seeds 0-2), recomputed from the stored
  // cross-modal guidance runs (Dice = Tab. 1 "Cross-modal guidance" row). NA -> 0.
  var T1 = [
    { t: { dice: .553, pfn: .045, pfp: .180, sem: .102, fna: .105, fpa: .013 }, c: { dice: .595, pfn: .017, pfp: .180, sem: .084, fna: .112, fpa: .012 }, sd: .013 },
    { t: { dice: .016, pfn: .419, pfp: .404, sem: .036, fna: .080, fpa: .045 }, c: { dice: .202, pfn: .128, pfp: .396, sem: .062, fna: .186, fpa: .026 }, sd: .012 },
    { t: { dice: .463, pfn: .085, pfp: .248, sem: .109, fna: .064, fpa: .029 }, c: { dice: .562, pfn: .034, pfp: .242, sem: .054, fna: .075, fpa: .033 }, sd: .015 },
    { t: { dice: .351, pfn: .573, pfp: 0, sem: 0, fna: .022, fpa: .053 }, c: { dice: .636, pfn: .221, pfp: 0, sem: 0, fna: .061, fpa: .082 }, sd: .059, na: ["pfp", "sem"] },
    { t: { dice: .545, pfn: .352, pfp: 0, sem: .019, fna: .049, fpa: .036 }, c: { dice: .771, pfn: .082, pfp: 0, sem: .026, fna: .065, fpa: .055 }, sd: .049, na: ["pfp"] },
    { t: { dice: .389, pfn: .447, pfp: 0, sem: .040, fna: .066, fpa: .058 }, c: { dice: .568, pfn: .225, pfp: 0, sem: .050, fna: .087, fpa: .070 }, sd: .079, na: ["pfp"] }
  ];
  function sgn(v) { return (v > 0 ? "+" : v < 0 ? "−" : "±") + Math.abs(v).toFixed(3); }
  function naNote(na) {
    return na ? "<br><span style='opacity:.7'>NA here: " + na.map(function (k) { return FM.filter(function (f) { return f.k === k; })[0].n.toLowerCase(); }).join(", ") + "</span>" : "";
  }
  /* Shared stacked-bar chart: per dataset a group of bars, each split into Dice + the five failure modes (sums to 1).
     groups[i].bars = [{ lab, v: {dice,...}, strong }]; tipHtml(i, b, m) gives the tooltip of segment m of bar b in group i. */
  function drawStacked(host, groups, aria, tipHtml) {
    host.innerHTML = "";
    var nb = groups[0].bars.length;
    var W = Math.max(300, host.clientWidth), narrow = W < 560;
    var L = narrow ? 58 : 196, R = 10, T = 8, barH = narrow ? 17 : 19, gap = 4, head = narrow ? 19 : 0, grpGap = narrow ? 14 : 16, B = 34;
    var grpH = head + nb * barH + (nb - 1) * gap + grpGap;
    var H = T + grpH * groups.length - grpGap + B;
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": aria }, host);
    var x = function (v) { return L + v * (W - L - R); };
    [0, .25, .5, .75, 1].forEach(function (v) {
      el("line", { x1: x(v), x2: x(v), y1: T - 2, y2: H - B + 4, "class": "grid" }, svg);
      el("text", { x: x(v), y: H - B + 18, "text-anchor": "middle", "class": "tick" }, svg, v === 0 ? "0" : v.toFixed(2).replace(/0$/, ""));
    });
    el("text", { x: x(.5), y: H - 4, "text-anchor": "middle", "class": "tick" }, svg, "share of a perfect score (Dice + lost Dice = 1)");
    var dark = effectiveDark(), fg = css("--fg");
    groups.forEach(function (g, i) {
      var g0 = T + i * grpH, y0 = g0 + head;
      if (narrow) el("text", { x: 0, y: g0 + 13, "font-size": 12.5, "font-weight": 600 }, svg, g.d + "  ")
        .appendChild(el("tspan", { "class": "tick", "font-weight": 400 }, null, g.dom));
      else {
        var mid = y0 + (nb * barH + (nb - 1) * gap) / 2;
        el("text", { x: L - 66, y: mid - 2, "text-anchor": "end", "font-size": 13, "font-weight": 600 }, svg, g.d);
        el("text", { x: L - 66, y: mid + 12, "text-anchor": "end", "class": "tick" }, svg, g.dom);
      }
      g.bars.forEach(function (bar, b) {
        var yb = y0 + b * (barH + gap), acc = 0;
        var lab = el("text", { x: L - 7, y: yb + barH / 2 + 4, "text-anchor": "end", "class": "tick" }, svg, bar.lab);
        if (bar.strong) { lab.setAttribute("font-weight", 700); lab.setAttribute("style", "fill:" + fg); }
        FM.forEach(function (m) {
          var v = bar.v[m.k]; if (!v) return;
          var x0 = x(acc), w = Math.max(0, x(acc + v) - x0 - 2);
          var rect = el("rect", { x: x0, y: yb, width: w, height: barH, fill: css(m.c), rx: 2 }, svg);
          var minW = narrow ? 34 : 40;
          if (w >= minW && (m.k === "dice" || m.k === "pfn" || (!narrow && v >= .08)))
            el("text", { x: x0 + w / 2, y: yb + barH / 2 + 4, "text-anchor": "middle", "font-size": narrow ? 10.5 : 11.5,
              "font-weight": m.k === "dice" ? 700 : 600, style: "fill:" + (dark ? "#131416" : m.ink) + ";pointer-events:none" }, svg, f3(v).replace(/^0/, m.k === "dice" ? "0" : ""));
          var html = tipHtml(i, b, m) + naNote(g.na);
          rect.addEventListener("pointermove", function (e) { showTip(e, html); });
          rect.addEventListener("pointerdown", function (e) { showTip(e, html); });
          rect.addEventListener("pointerleave", hideTip);
          acc += v;
        });
      });
    });
  }
  function drawFailure() {
    var host = document.getElementById("chart-failure");
    if (!host) return;
    var groups = DS.map(function (d, i) {
      return { d: d, dom: DOM[i], na: T1[i].na, bars: [{ lab: "text", v: T1[i].t }, { lab: "+1 click", v: T1[i].c, strong: true }] };
    });
    drawStacked(host, groups, "Paired stacked bars for six datasets: the text-prompt result and the text plus one random click result, each split into Dice and the Dice lost to five failure modes (each bar sums to 1). One click mostly removes presence false negatives. Values in the data table below.",
      function (i, b, m) {
        var r = T1[i], tv = r.t[m.k], cv = r.c[m.k], dl = cv - tv;
        return "<b>" + DS[i] + "</b> · " + m.n + (m.k === "dice" ? "" : " (Dice lost)") + "<br>text prompt: " + f3(tv) +
          "<br>text + 1 click: " + f3(cv) + (m.k === "dice" ? " ± " + f3(r.sd).slice(1) : "") +
          "<br><b>" + (m.k === "dice" ? "Dice gain: " + sgn(dl) : Math.abs(dl) < .0005 ? "unchanged" : dl < 0 ? "removed by the click: " + f3(-dl) : "added: " + sgn(dl)) + "</b>";
      });
  }

  /* ---------- Suppl. Tab. S6/S7: the same split for text, CMAS, LoRA and M2C (5 annotated images per class) ---------- */
  var EM = ["Text", "CMAS", "LoRA", "M2C"];
  // rows: dice, pfn, pfp, sem, fna, fpa; columns: Text | CMAS | LoRA | M2C. NA -> 0. Medical text Dice is the per-volume split mean.
  var ES = [
    [[.553, .642, .593, .570], [.045, .031, .014, .018], [.180, .181, .227, .272], [.102, .045, .056, .044], [.105, .085, .089, .080], [.013, .015, .020, .016]],
    [[.016, .132, .287, .236], [.419, .269, .035, .047], [.404, .353, .457, .459], [.036, .157, .178, .187], [.080, .055, .027, .040], [.045, .033, .016, .030]],
    [[.464, .513, .490, .458], [.085, .055, .021, .031], [.248, .259, .366, .340], [.109, .076, .045, .084], [.064, .064, .055, .063], [.029, .032, .023, .023]],
    [[.351, .622, .639, .563], [.573, .089, .100, .274], [0, 0, 0, 0], [0, 0, 0, 0], [.022, .143, .088, .060], [.053, .147, .174, .103]],
    [[.545, .657, .755, .740], [.352, .165, .029, .065], [0, 0, 0, 0], [.019, .044, .045, .037], [.049, .061, .081, .085], [.035, .073, .090, .073]],
    [[.389, .523, .721, .673], [.447, .242, .009, .060], [0, 0, 0, 0], [.040, .071, .068, .062], [.066, .084, .148, .132], [.058, .080, .054, .073]]
  ];
  var ES_NA = [null, null, null, ["pfp", "sem"], ["pfp"], ["pfp"]];
  function esVal(i, b) { var o = {}; FM.forEach(function (m, r) { o[m.k] = ES[i][r][b]; }); return o; }
  function drawErrSplit() {
    var host = document.getElementById("chart-errsplit");
    if (!host) return;
    var groups = DS.map(function (d, i) {
      return { d: d, dom: DOM[i], na: ES_NA[i], bars: EM.map(function (n, b) { return { lab: n, v: esVal(i, b), strong: b === 1 }; }) };
    });
    drawStacked(host, groups, "Stacked bars for six datasets: text prompt, CMAS, LoRA and M2C, each split into Dice and the Dice lost to five failure modes (each bar sums to 1). CMAS mainly removes presence false negatives on the natural-image datasets; LoRA and M2C remove more of them but add presence false positives on the medical datasets. Values in the data table below.",
      function (i, b, m) {
        var tv = esVal(i, 0)[m.k], v = esVal(i, b)[m.k], dl = v - tv;
        var s = "<b>" + DS[i] + " · " + EM[b] + "</b><br>" + m.n + (m.k === "dice" ? "" : " (Dice lost)") + ": <b>" + f3(v) + "</b>";
        if (b > 0) s += "<br>text prompt: " + f3(tv) + "<br><b>" + (m.k === "dice" ? "Dice gain: " + sgn(dl) :
          Math.abs(dl) < .0005 ? "unchanged vs. text" : dl < 0 ? "removed " + f3(-dl) + " vs. text" : "added " + sgn(dl) + " vs. text") + "</b>";
        if (b === 0 && m.k === "dice" && i < 3) s += "<br><span style='opacity:.7'>per-volume split mean" + (i === 2 ? " (main table: 0.463, rounding)" : "") + "</span>";
        return s;
      });
  }
  /* ---------- Tab. 2: text-only vs CMAS (dumbbell) ---------- */
  var T2 = [[.553, .642], [.016, .132], [.463, .513], [.351, .622], [.545, .657], [.389, .523]];
  function drawDumbbell() {
    var host = document.getElementById("chart-dumbbell");
    if (!host) return;
    host.innerHTML = "";
    var W = Math.max(300, host.clientWidth), narrow = W < 560;
    var L = narrow ? 92 : 122, R = 58, T = 6, rowH = 30, B = 32;
    var H = T + rowH * DS.length + B;
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, role: "img",
      "aria-label": "Dice of text-only inference and of CMAS for six datasets; CMAS is higher on all six." }, host);
    var x = function (v) { return L + v * (W - L - R); };
    [0, .2, .4, .6, .8].forEach(function (v) {
      el("line", { x1: x(v), x2: x(v), y1: T, y2: H - B + 4, "class": "grid" }, svg);
      el("text", { x: x(v), y: H - B + 18, "text-anchor": "middle", "class": "tick" }, svg, v === 0 ? "0" : v.toFixed(1));
    });
    el("text", { x: x(.4), y: H - 3, "text-anchor": "middle", "class": "tick" }, svg, "Dice (five annotated images per class)");
    var base = css("--base"), acc = css("--acc");
    DS.forEach(function (d, i) {
      var y = T + i * rowH + rowH / 2, a = T2[i][0], b = T2[i][1];
      el("text", { x: L - 10, y: y + 4, "text-anchor": "end", "font-size": narrow ? 12 : 13, "font-weight": 600 }, svg, d);
      el("line", { x1: x(a), x2: x(b), y1: y, y2: y, stroke: acc, "stroke-width": 3, "stroke-linecap": "round", opacity: .45 }, svg);
      el("circle", { cx: x(a), cy: y, r: 5.5, fill: css("--card"), stroke: base, "stroke-width": 2.2 }, svg);
      var c = el("circle", { cx: x(b), cy: y, r: 6.5, fill: acc }, svg);
      el("text", { x: x(b) + 11, y: y + 4, "font-size": 12.5, "font-weight": 700, style: "fill:" + acc }, svg, "+" + ((b - a) * 100).toFixed(1));
      var g = el("rect", { x: L, y: y - rowH / 2, width: W - L - R + 50, height: rowH, fill: "transparent" }, svg);
      g.addEventListener("mousemove", function (e) { showTip(e, "<b>" + d + "</b><br>text-only " + f3(a) + " → CMAS " + f3(b) + "<br>+" + ((b - a) * 100).toFixed(1) + " Dice points"); });
      g.addEventListener("mouseleave", hideTip);
    });
  }

  /* ---------- Fig. S1: annotation budget (small multiples, RAOS | MoCA-Mask) ---------- */
  var BX = [3, 5, 7, 10, 20];
  var BM = [ // paper figures/src/fig_budget_raos_moca.py
    { k: "lora", n: "LoRA", c: "--m-lora" },
    { k: "prada", n: "PrAda", c: "--m-prada" },
    { k: "cmas", n: "CMAS (ours)", c: "--m-cmas" },
    { k: "loracmas", n: "LoRA + CMAS", c: "--m-lora", dash: true },
    { k: "pradacmas", n: "PrAda + CMAS", c: "--m-prada", dash: true }
  ];
  var BP = [
    { id: "chart-budget-raos", t: "RAOS", xl: "annotated volumes", metric: "official Dice, 67 test volumes", def: .553, lo: .54, hi: .685,
      y: { lora: [.598, .593, .601, .594, .581], prada: [.617, .641, .645, .637, .653], cmas: [.636, .642, .642, .647, .647],
           loracmas: [.602, .634, .622, .584, .602], pradacmas: [.619, .658, .664, .670, .671] } },
    { id: "chart-budget-moca", t: "MoCA-Mask", xl: "annotated frames", metric: "video-avg Dice@0.5, 16 test videos", def: .351, lo: .33, hi: .71,
      y: { lora: [.614, .639, .646, .689, .662], prada: [.538, .634, .634, .640, .650], cmas: [.613, .622, .611, .628, .634],
           loracmas: [.585, .638, .608, .686, .520], pradacmas: [.608, .625, .631, .656, .673] } }
  ];
  var budgetOff = {};
  function sw(m) {
    return "<i style='display:inline-block;width:14px;height:0;border-top:2.5px " + (m.dash ? "dashed" : "solid") + " " + css(m.c) +
      ";vertical-align:middle;margin-right:6px'></i>";
  }
  function budgetTip(p, j) {
    var rows = BM.filter(function (m) { return !budgetOff[m.k]; }).map(function (m) { return { m: m, v: p.y[m.k][j] }; })
      .sort(function (a, b) { return b.v - a.v; });
    return "<b>" + p.t + " · " + BX[j] + " " + p.xl + "</b><br>" + rows.map(function (r) {
      return sw(r.m) + r.m.n + ": <b>" + f3(r.v) + "</b>"; }).join("<br>") +
      "<br><span style='opacity:.75'><i style='display:inline-block;width:14px;border-top:2px dotted " + css("--muted") +
      ";vertical-align:middle;margin-right:6px'></i>Default (text): " + f3(p.def) + "</span>";
  }
  function tipAt(node, html) { var b = node.getBoundingClientRect(); showTip({ clientX: b.left + b.width / 2, clientY: b.top + 20 }, html); }
  function drawBudgetPanel(p) {
    var host = document.getElementById(p.id);
    if (!host) return;
    host.innerHTML = "";
    var W = Math.max(260, host.clientWidth), L = 44, R = 14, T = 26, B = 40, H = 250;
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, role: "img",
      "aria-label": p.t + ": Dice versus " + p.xl + " (3 to 20) for LoRA, PrAda, CMAS and the two hybrids; dotted line = text-only default " + f3(p.def) + ". Values in the data table below." }, host);
    var x = function (j) { return L + 14 + j * (W - L - R - 28) / (BX.length - 1); };
    var y = function (v) { return T + (p.hi - v) / (p.hi - p.lo) * (H - T - B); };
    el("text", { x: L, y: 14, "font-size": 13.5, "font-weight": 700 }, svg, p.t);
    el("text", { x: W - R, y: 14, "text-anchor": "end", "class": "tick" }, svg, p.metric);
    var step = (p.hi - p.lo) > .2 ? .1 : .025;
    for (var v = Math.ceil(p.lo / step - 1e-9) * step; v <= p.hi + 1e-9; v += step) {
      el("line", { x1: L, x2: W - R, y1: y(v), y2: y(v), "class": "grid" }, svg);
      el("text", { x: L - 6, y: y(v) + 4, "text-anchor": "end", "class": "tick" }, svg, v.toFixed(step < .05 ? 3 : 1));
    }
    BX.forEach(function (b, j) { el("text", { x: x(j), y: H - B + 16, "text-anchor": "middle", "class": "tick" }, svg, String(b)); });
    el("text", { x: (L + W - R) / 2, y: H - 6, "text-anchor": "middle", "class": "tick" }, svg, p.xl + " per class");
    el("line", { x1: L, x2: W - R, y1: y(p.def), y2: y(p.def), stroke: css("--muted"), "stroke-width": 1.6, "stroke-dasharray": "2 3" }, svg);
    el("text", { x: W - R, y: y(p.def) - 5, "text-anchor": "end", "class": "tick" }, svg, "Default (text) " + f3(p.def));
    var cross = el("line", { x1: 0, x2: 0, y1: T, y2: H - B, stroke: css("--faint"), "stroke-width": 1, visibility: "hidden" }, svg);
    var card = css("--card");
    var vis = BM.filter(function (m) { return !budgetOff[m.k]; });
    vis.forEach(function (m) {
      var col = css(m.c), ys = p.y[m.k];
      var path = el("path", { d: ys.map(function (v, j) { return (j ? "L" : "M") + x(j) + " " + y(v); }).join(" "), fill: "none", stroke: col,
        "stroke-width": 2, "stroke-linejoin": "round" }, svg);
      if (m.dash) path.setAttribute("stroke-dasharray", "6 4");
      ys.forEach(function (v, j) {
        el("circle", { cx: x(j), cy: y(v), r: 4.2, fill: m.dash ? card : col, stroke: m.dash ? col : card, "stroke-width": m.dash ? 1.8 : 1.5 }, svg);
      });
    });
    var on = function (j) { cross.setAttribute("x1", x(j)); cross.setAttribute("x2", x(j)); cross.setAttribute("visibility", "visible"); };
    var off = function () { cross.setAttribute("visibility", "hidden"); hideTip(); };
    // hit columns (one per budget): crosshair + all-method tooltip; focusable for keyboard, tap for touch
    var w = (W - L - R - 28) / (BX.length - 1);
    BX.forEach(function (b, j) {
      var hit = el("rect", { x: x(j) - w / 2, y: T, width: w, height: H - T - B, fill: "transparent", tabindex: 0, "class": "hit", role: "img",
        "aria-label": p.t + ", " + b + " " + p.xl + ": " + vis.map(function (m) { return m.n + " " + f3(p.y[m.k][j]); }).join(", ") + "; default " + f3(p.def) }, svg);
      hit.addEventListener("pointermove", function (e) { on(j); showTip(e, budgetTip(p, j)); });
      hit.addEventListener("pointerdown", function (e) { on(j); showTip(e, budgetTip(p, j)); });
      hit.addEventListener("pointerleave", off);
      hit.addEventListener("focus", function () { on(j); tipAt(hit, budgetTip(p, j)); });
      hit.addEventListener("blur", off);
    });
    // per-point hover on top of the columns
    vis.forEach(function (m) {
      p.y[m.k].forEach(function (v, j) {
        var c = el("circle", { cx: x(j), cy: y(v), r: 8, fill: "transparent" }, svg);
        c.addEventListener("pointermove", function (e) {
          on(j);
          showTip(e, "<b>" + p.t + " · " + BX[j] + " " + p.xl + "</b><br>" + sw(m) + m.n + ": <b>" + f3(v) + "</b><br><span style='opacity:.75'>" +
            (v - p.def >= 0 ? "+" : "−") + Math.abs((v - p.def) * 100).toFixed(1) + " Dice points vs. text prompt</span>");
        });
        c.addEventListener("pointerleave", off);
      });
    });
  }
  function initBudgetLegend() {
    var lg = document.getElementById("budget-legend");
    if (!lg || lg.childNodes.length) return;
    BM.forEach(function (m) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "lg-btn"; b.setAttribute("aria-pressed", "true");
      b.title = "Show / hide " + m.n;
      b.innerHTML = "<svg width='26' height='12' aria-hidden='true'><line x1='1' x2='25' y1='6' y2='6' stroke='var(" + m.c + ")' stroke-width='2.4'" +
        (m.dash ? " stroke-dasharray='5 3'" : "") + "/><circle cx='13' cy='6' r='3.6' fill='" + (m.dash ? "var(--card)" : "var(" + m.c + ")") +
        "' stroke='var(" + m.c + ")' stroke-width='1.6'/></svg>" + m.n;
      b.addEventListener("click", function () {
        budgetOff[m.k] = !budgetOff[m.k];
        if (BM.every(function (q) { return budgetOff[q.k]; })) budgetOff[m.k] = false;   // keep at least one series
        b.setAttribute("aria-pressed", budgetOff[m.k] ? "false" : "true");
        hideTip(); BP.forEach(drawBudgetPanel);
      });
      lg.appendChild(b);
    });
    var d = document.createElement("span"); d.className = "lg-static";
    d.innerHTML = "<svg width='26' height='12' aria-hidden='true'><line x1='1' x2='25' y1='6' y2='6' stroke='var(--muted)' stroke-width='1.8' stroke-dasharray='2 3'/></svg>Default (text prompt)";
    lg.appendChild(d);
  }

  /* ---------- Fig. S5: per-organ Dice gain over the text prompt on RAOS (broken x axis) ---------- */
  // per-organ mean official DSC over the 67 RAOS test volumes (paper figures/src/fig_perclass.py): [organ, text, CMAS, PrAda, PrAda + CMAS]
  var PO = [
    ["Liver", .9231, .9373, .945, .947], ["Spleen", .9078, .9059, .9178, .9091], ["Left kidney", .9112, .9111, .9178, .9162],
    ["Right kidney", .9137, .9092, .9152, .9112], ["Stomach", .8452, .8637, .8542, .871], ["Gallbladder", .4966, .5719, .5066, .4945],
    ["Esophagus", .5853, .5912, .6579, .6935], ["Pancreas", .7351, .7449, .7316, .7524], ["Duodenum", .5648, .5599, .5597, .583],
    ["Colon", .7126, .7226, .6559, .6706], ["Intestine", .7332, .7528, .7327, .7566], ["Right adrenal gland", .3152, .3157, .3378, .3571],
    ["Left adrenal gland", .4099, .4377, .4595, .4835], ["Rectum", .4081, .456, .4041, .4094], ["Bladder", .7175, .8034, .7913, .8879],
    ["Left femoral head", .0012, .6832, .6813, .7077], ["Right femoral head", .1074, .7165, .7033, .674], ["Prostate", .1692, .1875, .2489, .2779],
    ["Seminal vesicles", .0459, .1281, .1532, .1744]
  ].sort(function (a, b) { return (b[2] - b[1]) - (a[2] - a[1]); });   // largest CMAS gain first (as in the paper)
  var PM = [
    { k: 2, n: "CMAS (ours)", c: "--m-cmas" },
    { k: 3, n: "PrAda", c: "--m-prada" },
    { k: 4, n: "PrAda + CMAS", c: "--m-prada", hollow: true }
  ];
  var poOff = {};
  function poDot(m) {
    return "<svg width='12' height='12' aria-hidden='true' style='vertical-align:-1px;margin-right:6px'><circle cx='6' cy='6' r='4' fill='" +
      (m.hollow ? "var(--card)" : "var(" + m.c + ")") + "' stroke='var(" + m.c + ")' stroke-width='" + (m.hollow ? 2 : 0) + "'/></svg>";
  }
  function poTip(r) {
    return "<b>" + r[0] + "</b><br>Text prompt: <b>" + f3(r[1]) + "</b><br>" + PM.map(function (m) {
      return poDot(m) + m.n + ": <b>" + f3(r[m.k]) + "</b> (" + sgn(r[m.k] - r[1]) + ")"; }).join("<br>");
  }
  function drawPerOrgan() {
    var host = document.getElementById("chart-perorgan");
    if (!host) return;
    host.innerHTML = "";
    var cs = getComputedStyle(host), W = Math.max(280, host.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)), narrow = W < 560;
    var L = narrow ? 112 : 150, R = 8, T = 6, rowH = narrow ? 25 : 27, B = 40, gapX = 14;
    var H = T + rowH * PO.length + B, plotW = W - L - R - gapX;
    // two panels like the paper: [-0.09, 0.21] and, after the break, [0.53, 0.73] (femoral heads)
    var P1 = { lo: -.09, hi: .21, x0: L, w: plotW * .76 }, P2 = { lo: .53, hi: .73, w: plotW * .24 };
    P2.x0 = P1.x0 + P1.w + gapX;
    var x = function (v) { var p = v > .4 ? P2 : P1; return p.x0 + (Math.min(p.hi, Math.max(p.lo, v)) - p.lo) / (p.hi - p.lo) * p.w; };
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, role: "img",
      "aria-label": "Per-organ Dice gain over the text prompt on RAOS for CMAS, PrAda and PrAda + CMAS, 19 organs sorted by the CMAS gain; the x axis is broken between 0.21 and 0.53 for the two femoral heads. Values in the data table below." }, host);
    var yB = H - B;
    [-.05, 0, .05, .1, .15, .2, .6, .7].forEach(function (v) {
      el("line", { x1: x(v), x2: x(v), y1: T, y2: yB, "class": "grid" }, svg);
      var lab = v === 0 ? "0" : (v > 0 ? "+" : "−") + Math.abs(v).toFixed(2).replace(/^0/, "").replace(/0$/, "");
      if (!narrow || (v !== .05 && v !== .15))   // fewer labels on phones; grid lines stay
        el("text", { x: x(v), y: yB + 16, "text-anchor": "middle", "class": "tick" }, svg, lab);
    });
    // axis baselines with break marks
    var ax = css("--faint");
    [P1, P2].forEach(function (p) { el("line", { x1: p.x0, x2: p.x0 + p.w, y1: yB, y2: yB, stroke: ax, "stroke-width": 1 }, svg); });
    [P1.x0 + P1.w, P2.x0].forEach(function (bx) {
      el("line", { x1: bx - 3, x2: bx + 3, y1: yB + 5, y2: yB - 5, stroke: ax, "stroke-width": 1.3 }, svg);
    });
    el("line", { x1: x(0), x2: x(0), y1: T, y2: yB, stroke: css("--muted"), "stroke-width": 1.4 }, svg);
    el("text", { x: (L + W - R) / 2, y: H - 4, "text-anchor": "middle", "class": "tick" }, svg, "Dice gain over the text prompt (axis broken at 0.21–0.53)");
    var card = css("--card"), off3 = narrow ? 6.5 : 7.5;
    PO.forEach(function (r, i) {
      var y0 = T + i * rowH, y = y0 + rowH / 2;
      if (i) el("line", { x1: 0, x2: W - R, y1: y0, y2: y0, "class": "grid", "stroke-dasharray": "1 3" }, svg);
      el("text", { x: L - 8, y: y + 4, "text-anchor": "end", "font-size": narrow ? 11.5 : 12.5 }, svg, r[0]);
      PM.forEach(function (m, k) {
        if (poOff[m.k]) return;
        var col = css(m.c);
        el("circle", { cx: x(r[m.k] - r[1]), cy: y + (k - 1) * off3, r: narrow ? 4.2 : 4.8, fill: m.hollow ? card : col,
          stroke: m.hollow ? col : card, "stroke-width": m.hollow ? 2 : 1 }, svg);
      });
      var hit = el("rect", { x: 0, y: y0, width: W - R, height: rowH, fill: "transparent", tabindex: 0, "class": "hit", role: "img",
        "aria-label": r[0] + ": text prompt " + f3(r[1]) + "; " + PM.map(function (m) { return m.n + " " + f3(r[m.k]) + ", gain " + sgn(r[m.k] - r[1]); }).join("; ") }, svg);
      hit.addEventListener("pointermove", function (e) { showTip(e, poTip(r)); });
      hit.addEventListener("pointerdown", function (e) { showTip(e, poTip(r)); });
      hit.addEventListener("pointerleave", hideTip);
      hit.addEventListener("focus", function () { tipAt(hit, poTip(r)); });
      hit.addEventListener("blur", hideTip);
    });
  }
  function initPerOrganLegend() {
    var lg = document.getElementById("perorgan-legend");
    if (!lg || lg.childNodes.length) return;
    PM.forEach(function (m) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "lg-btn"; b.setAttribute("aria-pressed", "true");
      b.title = "Show / hide " + m.n;
      b.innerHTML = poDot(m) + m.n;
      b.addEventListener("click", function () {
        poOff[m.k] = !poOff[m.k];
        if (PM.every(function (q) { return poOff[q.k]; })) poOff[m.k] = false;   // keep at least one series
        b.setAttribute("aria-pressed", poOff[m.k] ? "false" : "true");
        hideTip(); drawPerOrgan();
      });
      lg.appendChild(b);
    });
  }
  function fillPerOrganTable() {
    var tb = document.getElementById("perorgan-tbody");
    if (!tb || tb.childNodes.length) return;
    tb.innerHTML = PO.map(function (r) {
      return "<tr><td>" + r[0] + "</td><td>" + f3(r[1]) + "</td>" + PM.map(function (m) {
        return "<td>" + f3(r[m.k]) + " <span class='muted'>(" + sgn(r[m.k] - r[1]) + ")</span></td>"; }).join("") + "</tr>";
    }).join("");
  }

  function drawAll() { hideTip(); drawFailure(); drawErrSplit(); drawDumbbell(); initBudgetLegend(); BP.forEach(drawBudgetPanel);
    initPerOrganLegend(); fillPerOrganTable(); drawPerOrgan(); }

  /* ---------- BibTeX copy ---------- */
  function initCopy() {
    var b = document.getElementById("copy-bib");
    if (!b) return;
    b.addEventListener("click", function () {
      var txt = document.getElementById("bibtex").textContent;
      var done = function () { b.textContent = "Copied"; setTimeout(function () { b.textContent = "Copy"; }, 1600); };
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(txt).then(done, fallback);
      else fallback();
      function fallback() {
        var r = document.createRange(); r.selectNodeContents(document.getElementById("bibtex"));
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        try { document.execCommand("copy"); done(); } catch (e) { b.textContent = "Press Ctrl+C"; }
      }
    });
  }
})();
