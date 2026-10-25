export const fresh = () => ({
  version: 1,
  wheel: false,
  air: 0,
  steps: [],
  crane: 22,
  carry: null,
  bales: [],
  clean: [],
  done: { otter: false, sheep: false, fox: false, penguin: false },
});
export function act(state, a) {
  const s = structuredClone(state);
  switch (a.type) {
    case "wheel":
      s.wheel = true;
      break;
    case "pump":
      if (s.wheel) s.air = Math.min(4, s.air + 1);
      break;
    case "plank":
      if (
        Number.isInteger(a.color) &&
        a.color >= 0 &&
        a.color < 3 &&
        a.color === a.slot &&
        !s.steps.includes(a.color)
      )
        s.steps.push(a.color);
      break;
    case "crane":
      if (Number.isFinite(a.x)) s.crane = Math.max(10, Math.min(90, a.x));
      break;
    case "claw":
      if (s.carry === null) {
        const i = [22, 42].findIndex(
          (x, i) => !s.bales.includes(i) && Math.abs(s.crane - x) < 10,
        );
        if (i >= 0) s.carry = i;
      } else if (Math.abs(s.crane - 80) < 12) {
        s.bales.push(s.carry);
        s.carry = null;
      }
      break;
    case "scrub":
      if (
        Number.isInteger(a.cell) &&
        a.cell >= 0 &&
        a.cell < 24 &&
        !s.clean.includes(a.cell)
      )
        s.clean.push(a.cell);
      break;
    case "reset": {
      const f = fresh();
      const keys = {
        otter: ["wheel", "air"],
        sheep: ["steps"],
        fox: ["crane", "carry", "bales"],
        penguin: ["clean"],
      }[a.mission];
      if (keys) {
        for (const k of keys) s[k] = f[k];
        s.done[a.mission] = false;
      }
      break;
    }
  }
  s.done = {
    otter: s.air === 4,
    sheep: s.steps.length === 3,
    fox: s.bales.length === 2,
    penguin: s.clean.length === 24,
  };
  return s;
}
export function validate(raw) {
  try {
    const s = JSON.parse(raw),
      f = fresh();
    if (
      !s ||
      Object.keys(s).sort().join() !== Object.keys(f).sort().join() ||
      s.version !== 1 ||
      typeof s.wheel !== "boolean" ||
      !Number.isInteger(s.air) ||
      s.air < 0 ||
      s.air > 4 ||
      (!s.wheel && s.air > 0) ||
      !Number.isFinite(s.crane) ||
      s.crane < 10 ||
      s.crane > 90 ||
      ![null, 0, 1].includes(s.carry)
    )
      return f;
    for (const [key, max] of [
      ["steps", 3],
      ["bales", 2],
      ["clean", 24],
    ])
      if (
        !Array.isArray(s[key]) ||
        new Set(s[key]).size !== s[key].length ||
        s[key].some((n) => !Number.isInteger(n) || n < 0 || n >= max)
      )
        return f;
    if (s.bales.includes(s.carry)) return f;
    if (
      JSON.stringify(s.done) !== JSON.stringify(act(s, { type: "noop" }).done)
    )
      return f;
    return s;
  } catch {
    return fresh();
  }
}
