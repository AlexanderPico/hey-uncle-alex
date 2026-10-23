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
    (p.tags || []).forEach(function (t) { meta.appendChild(el("span", "pill", t)); });
    c.appendChild(meta);
    c.appendChild(el("span", "cta", live ? (p.action || "Play") + " →" : "Coming soon"));
    return c;
  }

  var list = (globalThis.HUA_PROJECTS || []).slice();

  // Private Photos card. The photo page's address is never in this public code: opening the photo page
  // once hands it back here (as #photos=...), and it is remembered in this browser only.
  var OK = /^https:\/\/[a-z0-9.-]+\/[A-Za-z0-9_-]{20,}\/?$/;
  try {
    var m = /^#photos=(.+)$/.exec(location.hash);
    if (m) {
      var u = decodeURIComponent(m[1]);
      if (OK.test(u)) localStorage.setItem("hua:photos", u);
      history.replaceState(null, "", location.pathname + location.search);
    }
    var stored = localStorage.getItem("hua:photos");
    if (stored && OK.test(stored)) {
      list.push({ id: "photos", title: "Photos of Us", emoji: "📸", blurb: "Pictures of Uncle Alex and the niblings.",
        tags: ["family"], status: "live", action: "Look", url: stored });
    }
  } catch (e) { /* storage blocked: the card just stays hidden */ }
  var root = document.getElementById("projects");
  // Live projects first, then coming-soon, keeping list order within each group.
  list.filter(function (p) { return p.status === "live"; })
      .concat(list.filter(function (p) { return p.status !== "live"; }))
      .forEach(function (p) { root.appendChild(card(p)); });
})();
