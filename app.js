(function () {
  "use strict";

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  var hubId = document.body.getAttribute("data-hub");
  var base = hubId ? "../" : ""; // hub pages live one folder down
  var isWeb = function (u) { return /^https?:\/\//.test(u); };

  function card(p) {
    var live = p.status === "live" && p.url;
    var c = el(live ? "a" : "article", "card" + (live ? " live" : " soon"));
    if (live) { c.href = isWeb(p.url) ? p.url : base + p.url; c.rel = "noopener"; }
    if (p.icon) {
      var icon = el("img", "project-icon");
      icon.src = base + p.icon;
      icon.alt = "";
      icon.width = 72; icon.height = 72;
      c.appendChild(icon);
    } else {
      c.appendChild(el("div", "emoji", p.emoji || "✨"));
    }
    c.appendChild(el("h2", null, p.title));
    c.appendChild(el("p", "blurb", p.blurb));
    var meta = el("div", "meta");
    (p.tags || []).forEach(function (t) { meta.appendChild(el("span", "pill", t)); });
    c.appendChild(meta);
    var cta = el("span", "cta", live ? (p.action || "Play") + " →" : "Coming soon");
    c.appendChild(cta);
    if (p.note) c.insertBefore(el("p", "wifi-note", p.note), meta);
    if (live && p.newTab) { c.target = "_blank"; c.rel = "noopener noreferrer"; cta.textContent = (p.action || "Open") + " in a new tab →"; }
    return c;
  }

  var list = hubId ? ((globalThis.HUA_HUBS || {})[hubId] || { items: [] }).items : (globalThis.HUA_PROJECTS || []);
  var root = document.getElementById("projects");
  // Live projects first, then coming-soon, keeping list order within each group.
  list = list.filter(function (p) { return p.status !== "hidden"; });
  list.filter(function (p) { return p.status === "live"; })
      .concat(list.filter(function (p) { return p.status !== "live"; }))
      .forEach(function (p) {
        root.appendChild(card(p));
      });
})();
