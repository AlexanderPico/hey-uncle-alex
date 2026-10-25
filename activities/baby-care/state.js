export const tools = {
  kitchen: ["peach", "berries", "porridge", "water", "cloth"],
  bath: ["soap", "sponge", "rinse", "towel"],
  dress: ["rose", "mint", "sunshine", "lavender", "bow", "hat", "clear"],
  bed: ["blanket", "yak", "light", "wake"],
};
export const initial = () => ({
  version: 2,
  room: "kitchen",
  mess: 0,
  bubbles: 0,
  wet: false,
  outfit: "rose",
  accessory: "clear",
  blanket: false,
  plush: false,
  asleep: false,
  dark: false,
  muted: true,
  reaction: "hello",
});
export function act(s, a) {
  if (!a || typeof a !== "object") return s;
  if (a.type === "reset") return initial();
  if (a.type === "mute") return { ...s, muted: !s.muted };
  if (a.type === "room" && Object.hasOwn(tools, a.room))
    return { ...s, room: a.room, asleep: false, reaction: "hello" };
  if (a.type !== "use" || !tools[s.room].includes(a.tool)) return s;
  const n = { ...s };
  const t = a.tool;
  n.reaction = "happy";
  if (s.room === "kitchen") {
    if (t === "cloth") {
      n.mess = 0;
      n.reaction = "clean";
    } else if (t === "water") n.reaction = "sip";
    else {
      n.mess = Math.min(3, s.mess + 1);
      n.reaction = "yum";
    }
  }
  if (s.room === "bath") {
    if (t === "soap" || t === "sponge") {
      n.bubbles = Math.min(12, s.bubbles + 1);
      n.reaction = "bubbles";
    }
    if (t === "rinse") {
      n.bubbles = 0;
      n.wet = true;
      n.reaction = "splash";
    }
    if (t === "towel") {
      n.bubbles = 0;
      n.wet = false;
      n.reaction = "cozy";
    }
  }
  if (s.room === "dress") {
    if (["rose", "mint", "sunshine", "lavender"].includes(t)) n.outfit = t;
    else n.accessory = t;
    n.reaction = "ta-da";
  }
  if (s.room === "bed") {
    if (t === "blanket") n.blanket = !s.blanket;
    if (t === "yak") n.plush = !s.plush;
    if (t === "light") {
      n.dark = !s.dark;
      n.asleep = n.dark;
      n.reaction = n.asleep ? "sleep" : "hello";
    }
    if (t === "wake") {
      n.asleep = false;
      n.dark = false;
      n.reaction = "hello";
    }
  }
  return n;
}
const key = "little-day-v2";
export function save(s, storage) {
  const text = JSON.stringify(s);
  if (!storage) return text;
  try {
    storage.setItem(key, text);
    return true;
  } catch {
    return false;
  }
}
export function restore(text, storage) {
  try {
    if (storage) text = storage.getItem(key);
    const x = JSON.parse(text);
    if (!x || ![1, 2].includes(x.version)) return initial();
    const d = initial();
    for (const k of Object.keys(d)) {
      if (x[k] === undefined || k === "version") continue;
      if (typeof x[k] !== typeof d[k]) return initial();
      if (
        ["mess", "bubbles"].includes(k) &&
        (!Number.isInteger(x[k]) || x[k] < 0 || x[k] > (k === "mess" ? 3 : 12))
      )
        return initial();
      d[k] = x[k];
    }
    if (
      !Object.hasOwn(tools, d.room) ||
      !["rose", "mint", "sunshine", "lavender"].includes(d.outfit) ||
      !["clear", "bow", "hat"].includes(d.accessory)
    )
      return initial();
    return d;
  } catch {
    return initial();
  }
}
