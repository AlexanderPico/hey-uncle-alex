import { initial, act, restore, save, tools } from "./state.js";
import { icons, roomIcons } from "./art.js";

let storage;
try {
  storage = localStorage;
} catch {}
let state = restore(undefined, storage);
let selected = null;
let drag = null;
let audio = null;
let suppressUntil = 0;
let happy = false;
let effectTimer;
let rainTimer;
let toolsRoom;
const names = {
  kitchen: "Kitchen",
  bath: "Bath",
  dress: "Dress up",
  bed: "Bedtime",
};
const label = (text) => text[0].toUpperCase() + text.slice(1);
const reactions = {
  hello: "Hello, little sunshine!",
  yum: "Mmm… delicious!",
  sip: "A little sip!",
  clean: "All fresh!",
  bubbles: "Pop, pop, bubbles!",
  splash: "Splish, splash!",
  cozy: "Warm and cozy.",
  happy: "A lovely little day.",
  "ta-da": "Oh, looking lovely!",
  sleep: "Sweet little dreams…",
};
document.querySelector("#app").innerHTML =
  `<header><div class="brand"><span class="brand-sun">✦</span><div>little day<small>BABY CARE</small></div></div><button id="sound" class="round" aria-label="Sound off"></button></header><nav aria-label="Rooms">${Object.keys(
    names,
  )
    .map(
      (r) =>
        `<button data-room="${r}" aria-label="${names[r]}">${roomIcons[r]}<span>${names[r]}</span></button>`,
    )
    .join(
      "",
    )}</nav><section id="scene" aria-label="Baby's room"><div class="room-glow"></div><div id="caption" aria-live="polite"></div><div id="seat"></div><button id="baby" aria-label="Play with baby"><img id="sprite" src="./assets/baby-rose-neutral.webp" alt="" draggable="false"><div id="accessory"></div><div id="mess"></div><div id="foam"></div><div id="blanket"></div><div id="plush"><img src="./assets/yak.png" alt="" draggable="false"></div><div id="sleep">z<span>z</span><small>z</small></div></button><div id="rain"></div><div id="sparkles"></div><div id="night"></div></section><section id="tray" aria-label="Play things"><p id="hint">Pick something. Tap baby.</p><div id="tools"></div></section><footer><span>A little care. A lot of love.</span><button id="reset">Start a fresh day</button></footer><div id="drag-ghost" hidden></div>`;

const $ = (selector) => document.querySelector(selector);
const baby = $("#baby");
const actionProp = document.createElement("div");
actionProp.id = "action-prop";
actionProp.hidden = true;
baby.append(actionProp);

function renderSelection() {
  for (const button of document.querySelectorAll("#tools [data-tool]")) {
    const active = selected === button.dataset.tool;
    button.classList.toggle("selected", active);
    button.setAttribute("aria-pressed", String(active));
  }
  $("#hint").textContent = selected
    ? `${label(selected)} → baby`
    : "Pick something. Tap baby.";
}

function renderSprite() {
  const expression = state.asleep ? "sleep" : happy ? "happy" : "neutral";
  $("#sprite").setAttribute(
    "src",
    `./assets/baby-${state.outfit}-${expression}.webp`,
  );
}

function render() {
  document.body.dataset.room = state.room;
  $("#scene").classList.toggle("dark", state.room === "bed" && state.dark);
  for (const button of document.querySelectorAll("nav [data-room]")) {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.room === state.room),
    );
  }
  baby.dataset.outfit = state.outfit;
  baby.dataset.asleep = state.asleep;
  baby.dataset.reaction = state.reaction;
  $("#caption").textContent = reactions[state.reaction] || reactions.happy;
  $("#sound").textContent = state.muted ? "♪̸" : "♪";
  $("#sound").setAttribute(
    "aria-label",
    state.muted ? "Sound off" : "Sound on",
  );
  $("#sound").setAttribute("aria-pressed", String(!state.muted));
  renderSprite();
  $("#accessory").dataset.kind = state.accessory;
  $("#accessory").innerHTML =
    state.accessory === "clear" ? "" : icons[state.accessory];
  $("#mess").hidden = state.mess === 0;
  $("#foam").innerHTML =
    state.room === "bath"
      ? Array.from(
          { length: state.bubbles * 5 },
          (_, i) =>
            `<i class="bubble" style="left:${14 + ((i * 23) % 73)}%;top:${43 + ((i * 17) % 44)}%;width:${14 + (i % 4) * 7}px;height:${14 + (i % 4) * 7}px;animation-delay:-${i * 0.23}s"></i>`,
        ).join("")
      : "";
  $("#blanket").hidden = !(state.room === "bed" && state.blanket);
  $("#plush").hidden = !(state.room === "bed" && state.plush);
  $("#sleep").hidden = !state.asleep;
  // Keep nodes stable for pointer capture, keyboard focus and touch streams.
  if (toolsRoom !== state.room) {
    $("#tools").innerHTML = tools[state.room]
      .map(
        (tool) =>
          `<button class="tool" data-tool="${tool}" aria-label="${label(tool)}" aria-pressed="false">${icons[tool]}<span>${label(tool)}</span></button>`,
      )
      .join("");
    toolsRoom = state.room;
  }
  renderSelection();
  save(state, storage);
}

function tone(event) {
  // Never create or unlock audio from timers, restore or scripted events.
  if (!event?.isTrusted || state.muted || document.hidden) return;
  try {
    audio ??= new (window.AudioContext || window.webkitAudioContext)();
    audio.resume()?.catch(() => {});
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(
      state.asleep ? 330 : 523,
      audio.currentTime,
    );
    oscillator.frequency.exponentialRampToValueAtTime(
      state.asleep ? 220 : 784,
      audio.currentTime + 0.16,
    );
    gain.gain.setValueAtTime(0.055, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.35);
    oscillator.connect(gain).connect(audio.destination);
    oscillator.start();
    oscillator.stop(audio.currentTime + 0.36);
  } catch {}
}

function clearEffects() {
  clearTimeout(effectTimer);
  clearTimeout(rainTimer);
  happy = false;
  actionProp.hidden = true;
  actionProp.innerHTML = "";
  actionProp.classList.remove("playing");
  delete actionProp.dataset.tool;
  baby.classList.remove("react", "wiggle");
  $("#rain").classList.remove("raining");
  $("#sparkles").innerHTML = "";
}

function use(event) {
  clearEffects();
  if (selected) state = act(state, { type: "use", tool: selected });
  else if (!state.asleep) state = { ...state, reaction: "happy" };
  happy = !state.asleep;
  render();
  tone(event);
  if (selected) {
    actionProp.innerHTML = icons[selected];
    actionProp.dataset.tool = selected;
    actionProp.hidden = false;
    void actionProp.offsetWidth;
    actionProp.classList.add("playing");
  }
  void baby.offsetWidth;
  baby.classList.add("react");
  if (!state.asleep)
    $("#sparkles").innerHTML = Array.from(
      { length: 7 },
      (_, i) => `<i style="--i:${i}">✦</i>`,
    ).join("");
  if (selected === "rinse") {
    $("#rain").classList.add("raining");
    rainTimer = setTimeout(() => $("#rain").classList.remove("raining"), 850);
  }
  effectTimer = setTimeout(() => {
    clearEffects();
    renderSprite();
  }, 1300);
}

function cancelDrag(clearSelection = true) {
  if (drag) {
    suppressUntil = performance.now() + 350;
    try {
      drag.target.releasePointerCapture(drag.id);
    } catch {}
  }
  drag = null;
  $("#drag-ghost").hidden = true;
  $("#drag-ghost").innerHTML = "";
  if (clearSelection) {
    selected = null;
    renderSelection();
  }
}

function leaveInteraction() {
  cancelDrag();
  clearEffects();
  renderSprite();
}

document.addEventListener("click", (event) => {
  const room = event.target.closest("nav [data-room]");
  if (room) {
    leaveInteraction();
    state = act(state, { type: "room", room: room.dataset.room });
    render();
    return;
  }
  const tool = event.target.closest("#tools [data-tool]");
  if (tool && performance.now() >= suppressUntil && !drag) {
    selected = tool.dataset.tool;
    renderSelection();
  }
});
baby.addEventListener("click", (event) => {
  if ((!selected || event.detail === 0 || performance.now() >= suppressUntil) && !drag) use(event);
});
$("#sound").onclick = (event) => {
  state = act(state, { type: "mute" });
  if (state.muted) audio?.suspend()?.catch(() => {});
  render();
  tone(event);
};
$("#reset").onclick = () => {
  leaveInteraction();
  state = initial();
  render();
};

document.addEventListener("pointerdown", (event) => {
  const target = event.target.closest("#tools [data-tool]");
  if (
    !target ||
    drag ||
    event.isPrimary === false ||
    (event.pointerType === "mouse" && event.button !== 0)
  )
    return;
  selected = target.dataset.tool;
  renderSelection();
  drag = {
    id: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    target,
    moved: false,
  };
  try {
    target.setPointerCapture(event.pointerId);
  } catch {}
  const ghost = $("#drag-ghost");
  ghost.innerHTML = icons[selected];
  ghost.style.left = event.clientX + "px";
  ghost.style.top = event.clientY + "px";
});
document.addEventListener("pointermove", (event) => {
  if (!drag || drag.id !== event.pointerId) return;
  const ghost = $("#drag-ghost");
  if (Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > 9)
    drag.moved = true;
  ghost.hidden = !drag.moved;
  ghost.style.left = event.clientX + "px";
  ghost.style.top = event.clientY + "px";
});
document.addEventListener("pointerup", (event) => {
  if (!drag || drag.id !== event.pointerId) return;
  const rect = baby.getBoundingClientRect();
  const moved = drag.moved;
  const hit =
    event.clientX >= rect.left - 22 &&
    event.clientX <= rect.right + 22 &&
    event.clientY >= rect.top - 22 &&
    event.clientY <= rect.bottom + 22;
  // A tap selects; an unsuccessful drag clears the tool rather than arming a later tap.
  cancelDrag(moved && !hit);
  if (!moved && !hit) suppressUntil = 0;
  if (hit) use(event);
});
document.addEventListener("pointercancel", (event) => {
  if (drag?.id === event.pointerId) cancelDrag();
});
document.addEventListener("lostpointercapture", (event) => {
  if (drag?.id === event.pointerId) cancelDrag();
});
window.addEventListener("blur", leaveInteraction);
window.addEventListener("pagehide", leaveInteraction);
document.addEventListener("visibilitychange", () => {
  leaveInteraction();
  if (document.hidden) audio?.suspend()?.catch(() => {});
});
render();
