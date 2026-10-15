(function () {
  "use strict";

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function card(p) {
    var live = p.status === "live" && p.url;
    var c = el(live ? "a" : "article", "card" + (live ? " live" : " soon"));
    if (live) { c.href = p.url; c.rel = "noopener"; }
    c.appendChild(el("div", "emoji", p.emoji || "✨"));
    c.appendChild(el("h2", null, p.title));
    c.appendChild(el("p", "blurb", p.blurb));
    var meta = el("div", "meta");
    if (p.ages) meta.appendChild(el("span", "pill ages", "Ages " + p.ages));
    (p.tags || []).forEach(function (t) { meta.appendChild(el("span", "pill", t)); });
    c.appendChild(meta);
    c.appendChild(el("span", "cta", live ? (p.action || "Play") + " →" : "Coming soon"));
    return c;
  }

  var list = globalThis.HUA_PROJECTS || [];
  var root = document.getElementById("projects");
  // Live projects first, then coming-soon, keeping list order within each group.
  list.filter(function (p) { return p.status === "live"; })
      .concat(list.filter(function (p) { return p.status !== "live"; }))
      .forEach(function (p) { root.appendChild(card(p)); });
})();
