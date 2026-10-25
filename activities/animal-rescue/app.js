import { fresh, act, validate } from "./model.js";
// All HTML templates use fixed local strings and validated numeric state, never user input.
const root = document.querySelector("#game"),
  ids = ["otter", "sheep", "fox", "penguin"],
  names = [
    "Otter · Delivery day",
    "Sheep · Treehouse trail",
    "Fox · Hay crossing",
    "Penguin · Skating pond",
  ],
  titles = [
    "Ready to roll!",
    "Together again!",
    "The way is clear!",
    "Time to skate!",
  ],
  hints = [
    "Fit the wheel. Pump it up!",
    "Build a ladder to the friends below.",
    "Carry the hay into the wagon.",
    "Brush the snowy pond to make an ice rink.",
  ];
let state;
try {
  state = validate(localStorage.getItem("little-helpers:v1"));
} catch {
  state = fresh();
}
let mission = null,
  selected = null,
  gesture = null,
  sound = false,
  audio,
  suppressClick = false;
const animal = (id, cls = "") =>
  `<img class="animal ${id} ${cls}" src="assets/animal-${id}.webp" alt="${id}">`;
const svg = (body, view = "0 0 300 180") =>
  `<svg viewBox="${view}" aria-hidden="true"><defs><linearGradient id="body" x2="0" y2="1"><stop stop-color="#ffca63"/><stop offset="1" stop-color="#e9973c"/></linearGradient></defs>${body}</svg>`;
const wheel = () =>
  svg(
    '<circle cx="50" cy="50" r="43" fill="#40586a" stroke="#243c4d" stroke-width="5"/><circle cx="50" cy="50" r="26" fill="#f9e4bd"/><circle cx="50" cy="50" r="10" fill="#78afbb"/>',
    "0 0 100 100",
  );
const van = () =>
  svg(
    '<path d="M18 138V36Q18 20 38 20H171L201 58H256Q276 58 278 83L284 138Z" fill="url(#body)" stroke="#925e38" stroke-width="5"/><path d="M181 44L201 70H247V95H181Z" fill="#bfe7e8" stroke="#925e38" stroke-width="4"/><rect x="41" y="41" width="95" height="59" rx="14" fill="#fff3d2"/><path d="M66 72h45m-23-22v44" stroke="#e09d54" stroke-width="9" stroke-linecap="round"/><circle cx="68" cy="140" r="27" fill="#354f60"/><circle cx="68" cy="140" r="14" fill="#c8dadd"/><circle cx="231" cy="140" r="12" fill="#875e41"/><rect x="269" y="106" width="18" height="14" rx="5" fill="#fff8c7"/>',
  );
const bale = () =>
  svg(
    '<rect x="7" y="10" width="86" height="63" rx="15" fill="#eec468" stroke="#ab7b38" stroke-width="4"/><path d="M28 13v57m43-57v57M13 32h70M14 53h73" stroke="#d49b46" stroke-width="4"/>',
    "0 0 100 85",
  );
function beep() {
  if (!sound) return;
  try {
    audio ??= new (window.AudioContext || window.webkitAudioContext)();
    audio.resume();
    const o = audio.createOscillator(),
      g = audio.createGain();
    o.connect(g);
    g.connect(audio.destination);
    o.frequency.setValueAtTime(600, audio.currentTime);
    o.frequency.exponentialRampToValueAtTime(900, audio.currentTime + 0.12);
    g.gain.setValueAtTime(0.045, audio.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.18);
    o.start();
    o.stop(audio.currentTime + 0.2);
  } catch {}
}
function update(a, render = true) {
  state = act(state, a);
  try {
    localStorage.setItem("little-helpers:v1", JSON.stringify(state));
  } catch {}
  if (render) draw();
  beep();
}
function scene() {
  if (mission === "otter")
    return `<div class="road"></div><div class="van ${state.done.otter ? "depart" : ""}">${van()}${animal("otter")}<button aria-label="Mount wheel" class="axle ${state.wheel ? "mounted" : ""}" style="--air:${0.62 + state.air * 0.095}" data-action="mount">${state.wheel ? wheel() : "<span>＋</span>"}</button></div>${!state.wheel ? `<button class="loose-wheel ${selected === "wheel" ? "selected" : ""}" aria-label="Wheel" data-drag="wheel" data-action="select-wheel">${wheel()}</button>` : ""}<div class="pump"><div class="hose"></div><button aria-label="Pump tire" data-drag="pump" data-action="pump" class="pump-handle" ${!state.wheel ? "disabled" : ""}><span></span></button><div class="pump-shaft"></div><div class="pump-body"></div><div class="pump-foot"></div></div><div class="air-meter" aria-label="Tire air ${state.air} of 4">${[0, 1, 2, 3].map((i) => `<i class="${i < state.air ? "filled" : ""}"></i>`).join("")}</div>`;
  if (mission === "sheep")
    return `<div class="treehouse">${svg('<path d="M39 139V62L145 15L258 62V139Z" fill="url(#body)" stroke="#8d6142" stroke-width="5"/><path d="M20 64L145 7L278 64" fill="none" stroke="#789a82" stroke-width="19" stroke-linecap="round"/><path d="M121 141V79Q145 50 169 79V141Z" fill="#705c49"/><rect x="64" y="77" width="34" height="36" rx="10" fill="#c2e5df" stroke="#9c754a" stroke-width="4"/><rect x="196" y="77" width="34" height="36" rx="10" fill="#c2e5df" stroke="#9c754a" stroke-width="4"/><path d="M22 148H278" stroke="#926547" stroke-width="16" stroke-linecap="round"/>')}</div><div class="tree-platform"></div><div class="ladder"><div class="ladder-side left"></div><div class="ladder-side right"></div>${["Coral", "Gold", "Mint"].map((c, i) => `<button class="step color${i} ${state.steps.includes(i) ? "placed" : ""}" style="--i:${i}" aria-label="${c} ladder space" data-slot="${i}">${state.steps.includes(i) ? "" : "＋"}</button>`).join("")}</div>${animal("sheep", state.done.sheep ? "rescued" : "")}<div class="friends">${animal("otter")}${animal("fox")}</div><div class="planks">${["Coral", "Gold", "Mint"].map((c, i) => (!state.steps.includes(i) ? `<button aria-label="${c} plank" class="plank color${i} ${selected === i ? "selected" : ""}" data-drag="plank" data-color="${i}" data-action="select-plank">${["●", "◆", "▲"][i]}</button>` : "")).join("")}</div>`;
  if (mission === "fox")
    return `<div class="road"></div><div class="rail-art"></div><div class="crane" style="left:${state.crane}%"><button class="trolley" data-drag="trolley" aria-label="Drag crane trolley"></button><div class="cable"></div><div class="claw-shape">⋃</div>${state.carry !== null ? `<div class="carried">${bale()}</div>` : ""}</div>${[22, 42].map((x, i) => (!state.bales.includes(i) && state.carry !== i ? `<div class="hay" style="left:${x}%">${bale()}</div>` : "")).join("")}<div class="wagon">${state.bales.map((_, i) => `<div class="loaded" style="left:${i * 40}%">${bale()}</div>`).join("")}<span></span></div><div class="tractor ${state.done.fox ? "depart" : ""}">${svg('<path d="M20 122V70h88V25h74v91h65v27H20Z" fill="#76ad8d" stroke="#416b57" stroke-width="5"/><path d="M125 41h42v49h-42Z" fill="#d1eff0"/><circle cx="78" cy="135" r="37" fill="#3b5060"/><circle cx="78" cy="135" r="19" fill="#e7c486"/><circle cx="224" cy="140" r="25" fill="#3b5060"/>')}${animal("fox")}</div>`;
  return `<div class="pond"><div class="ice-lines"></div><div class="snow-grid">${Array.from({ length: 24 }, (_, i) => `<button aria-label="Brush snow ${i + 1}" data-cell="${i}" class="snow ${state.clean.includes(i) ? "cleared" : ""}"><span>✦</span></button>`).join("")}</div>${animal("penguin", state.done.penguin ? "skating" : "")}</div><div class="brush-mark">${svg('<path d="M45 20h25v75H45Z" fill="#d89f62"/><rect x="12" y="85" width="92" height="28" rx="10" fill="#73a8b3"/><path d="M20 111v25m14-25v25m14-25v25m14-25v25m14-25v25m14-25v25" stroke="#f7e5b9" stroke-width="9"/>', "0 0 120 150")}</div>`;
}
function draw() {
  gesture = null;
  if (!mission) {
    root.innerHTML = `<header class="map-heading"><span class="eyebrow">LITTLE HELPERS</span><h1>Animal Rescue</h1><p>A little help. A big adventure.</p></header><section class="adventure-map" aria-label="Choose an adventure"><div class="map-path"></div>${ids.map((id, i) => `<button class="map-stop stop-${i}" data-mission="${id}" aria-label="${names[i]}"><span class="portrait">${animal(id)}</span><strong>${names[i].split(" · ")[1]}</strong><span class="map-note">${state.done[id] ? "✓ Help again" : "Let’s help →"}</span></button>`).join("")}</section><footer>Four friends. Your own way. <button data-action="sound" aria-label="${sound ? "Turn sound off" : "Turn sound on"}">${sound ? "♪ On" : "♪ Off"}</button></footer>`;
    return;
  }
  const i = ids.indexOf(mission),
    done = state.done[mission];
  root.innerHTML = `<div class="mission-shell"><header class="game-nav"><button data-action="map" aria-label="Adventure map">← <span>Map</span></button><div><span class="eyebrow">LITTLE HELPERS</span><h1>${names[i].split(" · ")[1]}</h1></div><button data-action="reset" aria-label="Replay mission">↻</button><button data-action="sound" aria-label="${sound ? "Turn sound off" : "Turn sound on"}">${sound ? "♪" : "♩"}</button></header><p class="hint" aria-live="polite">${done ? "You helped a friend!" : hints[i]}</p><section class="stage ${mission}-stage ${done ? "complete" : ""}" aria-label="${names[i]} scene">${scene()}</section><div class="mission-controls">${mission === "fox" && !done ? '<label for="rail">Move the crane ↔</label><input id="rail" aria-label="Move crane" type="range" min="10" max="90" value="' + state.crane + '"><button data-action="claw" aria-label="Lower claw">↓ ' + (state.carry === null ? "Pick up" : "Into wagon") + "</button>" : ""}${mission === "penguin" && !done ? '<span class="brush-hint">Sweep with your finger · or tap each snowy patch</span>' : ""}${mission === "otter" && !done ? "<span>Wheel → axle · pump ↓ ↑</span>" : ""}${mission === "sheep" && !done ? "<span>Match each shape to its ladder space</span>" : ""}</div>${done ? `<section class="celebration" aria-live="polite"><h2>${titles[i]}</h2><button data-action="next">Next adventure →</button><button data-action="reset">Play again ↻</button></section>` : ""}</div>`;
}
root.addEventListener("click", (e) => {
  const el = e.target.closest("button");
  if (!el) return;
  if (suppressClick && e.detail !== 0) {
    suppressClick = false;
    e.preventDefault();
    return;
  }
  if (el.dataset.mission) {
    mission = el.dataset.mission;
    selected = null;
    draw();
    return;
  }
  if (el.dataset.slot !== undefined) {
    if (Number.isInteger(selected))
      update({ type: "plank", color: selected, slot: +el.dataset.slot });
    return;
  }
  if (el.dataset.cell !== undefined) {
    update({ type: "scrub", cell: +el.dataset.cell });
    return;
  }
  switch (el.dataset.action) {
    case "map":
      mission = null;
      selected = null;
      draw();
      break;
    case "reset":
      selected = null;
      update({ type: "reset", mission });
      break;
    case "next":
      mission = ids[(ids.indexOf(mission) + 1) % 4];
      selected = null;
      draw();
      break;
    case "sound":
      sound = !sound;
      beep();
      draw();
      break;
    case "select-wheel":
      selected = "wheel";
      draw();
      break;
    case "mount":
      if (selected === "wheel") update({ type: "wheel" });
      break;
    case "pump":
      update({ type: "pump" });
      break;
    case "select-plank":
      selected = +el.dataset.color;
      draw();
      break;
    case "claw": {
      if (el.disabled) break;
      el.disabled = true;
      root.querySelector("#rail").disabled = true;
      const crane = root.querySelector(".crane"),
        current = mission;
      crane.classList.add("lowering");
      setTimeout(() => {
        if (mission === current && crane.isConnected) {
          update({ type: "claw" });
          root.querySelector(".crane")?.classList.add("raising");
        }
      }, 420);
      break;
    }
  }
});
root.addEventListener("input", (e) => {
  if (e.target.id === "rail") {
    update({ type: "crane", x: +e.target.value }, false);
    root.querySelector(".crane").style.left = state.crane + "%";
  }
});
root.addEventListener(
  "pointerdown",
  () => {
    suppressClick = false;
  },
  true,
);
root.addEventListener("pointerdown", (e) => {
  if (gesture || e.isPrimary === false) return;
  const el = e.target.closest("[data-drag], [data-cell]");
  if (!el || el.disabled || root.querySelector(".crane.lowering")) return;
  suppressClick = false;
  gesture = {
    id: e.pointerId,
    el,
    type: el.dataset.drag || "scrub",
    color: +el.dataset.color,
    x: e.clientX,
    y: e.clientY,
    lastY: e.clientY,
    moved: false,
    pumped: false,
  };
  try {
    el.setPointerCapture(e.pointerId);
  } catch {}
  if (gesture.type === "scrub") scrub(e.clientX, e.clientY);
});
function scrub(x, y) {
  const cell = document.elementFromPoint(x, y)?.closest("[data-cell]");
  if (!cell) return;
  const n = +cell.dataset.cell;
  if (state.clean.includes(n)) return;
  update({ type: "scrub", cell: n }, false);
  cell.classList.add("cleared");
  if (state.done.penguin) draw();
}
root.addEventListener("pointermove", (e) => {
  const g = gesture;
  if (!g || g.id !== e.pointerId) return;
  if (Math.hypot(e.clientX - g.x, e.clientY - g.y) > 8) g.moved = true;
  if (g.type === "scrub") {
    scrub(e.clientX, e.clientY);
    return;
  }
  if (g.type === "trolley") {
    const stage = root.querySelector(".stage");
    const r = stage.getBoundingClientRect();
    update(
      {
        type: "crane",
        x: (100 * (e.clientX - r.left - stage.clientLeft)) / stage.clientWidth,
      },
      false,
    );
    root.querySelector(".crane").style.left = state.crane + "%";
    root.querySelector("#rail").value = state.crane;
    return;
  }
  if (g.type === "pump") {
    const delta = e.clientY - g.lastY;
    g.el.style.transform = `translateY(${Math.min(25, Math.max(-12, e.clientY - g.y))}px)`;
    if (delta > 22 && !g.pumped) {
      g.pumped = true;
      g.lastY = e.clientY;
      update({ type: "pump" }, false);
      root
        .querySelector(".axle")
        .setAttribute("style", "--air:" + (0.62 + state.air * 0.095));
      root
        .querySelector(".air-meter")
        .setAttribute("aria-label", `Tire air ${state.air} of 4`);
      root
        .querySelectorAll(".air-meter i")
        .forEach((el, i) => el.classList.toggle("filled", i < state.air));
    } else if (delta < -18) {
      g.pumped = false;
      g.lastY = e.clientY;
    }
    return;
  }
  g.el.style.transform = `translate(${e.clientX - g.x}px,${e.clientY - g.y}px)`;
  g.el.style.zIndex = 20;
});
root.addEventListener("pointerup", (e) => {
  const g = gesture;
  if (!g || g.id !== e.pointerId) return;
  gesture = null;
  if (g.moved) {
    suppressClick = true;
    e.preventDefault();
    const target = document
      .elementFromPoint(e.clientX, e.clientY)
      ?.closest("[data-slot],.axle");
    g.el.style.pointerEvents = "none";
    const under = document
      .elementFromPoint(e.clientX, e.clientY)
      ?.closest("[data-slot],.axle");
    g.el.style.pointerEvents = "";
    const dest = under || target;
    if (g.type === "wheel" && dest?.classList.contains("axle"))
      update({ type: "wheel" });
    else if (g.type === "plank" && dest?.dataset.slot !== undefined)
      update({ type: "plank", color: g.color, slot: +dest.dataset.slot });
    else draw();
  } else if (g.type === "pump" && state.done.otter) draw();
});
function cancel(e) {
  if (gesture && (!e || e.pointerId === gesture.id)) {
    gesture = null;
    suppressClick = true;
    draw();
  }
}
root.addEventListener("pointercancel", cancel);
window.addEventListener("blur", () => cancel());
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    cancel();
    audio?.suspend();
  }
});
draw();
