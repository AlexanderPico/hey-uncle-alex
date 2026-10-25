const wrap = (s) =>
  `<svg viewBox="0 0 100 100" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><g stroke="#785247" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">${s}</g></svg>`;
const shirt = (c) =>
  `<path fill="${c}" d="M33 20 10 35l12 20 13-8-4 38h39l-4-38 13 8 12-20-24-15q-17 18-34 0Z"/><path fill="none" stroke="#fff8dc" d="m43 54 7-9 7 9-7 9Z"/>`;
export const icons = {
  peach: wrap(
    '<path fill="#ffac7f" d="M50 29C12 3 4 70 42 88c28 12 59-37 36-58-9-8-19-8-28-1Z"/><path fill="none" d="M50 29q-10 25-3 46"/><path fill="#8fc691" d="M50 24Q52 1 78 9 71 30 50 24"/>',
  ),
  berries: wrap(
    '<path fill="#8cb58a" d="m21 27 17-17 10 19 17-19 13 20"/><circle fill="#a28acb" cx="35" cy="47" r="22"/><circle fill="#bd87bd" cx="66" cy="49" r="22"/><circle fill="#8c95ce" cx="51" cy="72" r="22"/>',
  ),
  porridge: wrap(
    '<path fill="#fff0b4" d="M14 50q38-24 73 0"/><path fill="#8fd3cf" d="M12 46h76q-4 42-38 42T12 46Z"/><path fill="#edc79a" d="m67 41 18-30q6-7 9-1L80 44"/>',
  ),
  water: wrap(
    '<path fill="#b9e9ef" d="m25 16 5 73h43l5-73Z"/><path fill="#7acbd9" d="m29 47 3 39h38l3-39q-15 10-44 0"/><path fill="none" d="m48 49 7-43h20"/>',
  ),
  cloth: wrap(
    '<path fill="#fff2d1" d="m16 22 63-6 8 66-66 7Z"/><path fill="none" stroke="#e8ada6" d="m27 27 5 49 43-4M19 41l63-4"/>',
  ),
  soap: wrap(
    '<rect fill="#f8b8ce" x="17" y="34" width="66" height="48" rx="18"/><path fill="none" stroke="#fff1ed" d="M35 54q15-13 31 0"/><circle fill="#d7f6f3" cx="28" cy="19" r="12"/><circle fill="#d7f6f3" cx="65" cy="15" r="8"/>',
  ),
  sponge: wrap(
    '<path fill="#ffe28c" d="M15 26Q47 12 85 30l-5 51Q47 94 15 76Z"/><g fill="#e4ba63" stroke="none"><circle cx="31" cy="42" r="5"/><circle cx="65" cy="40" r="7"/><circle cx="45" cy="66" r="8"/><circle cx="70" cy="71" r="4"/></g>',
  ),
  rinse: wrap(
    '<path fill="#97cfdd" d="m14 40 40-22 21 37-40 23Z"/><path fill="none" d="M62 22q24-7 26 13T74 52"/><path fill="#93dce9" d="m20 60-8 15q-3 13 8 13t8-13Z"/>',
  ),
  towel: wrap(
    '<rect fill="#acded9" x="16" y="15" width="68" height="73" rx="8"/><path fill="none" stroke="#fff8d8" stroke-width="7" d="M24 28h51M25 71h50"/>',
  ),
  rose: wrap(shirt("#efa5b5")),
  mint: wrap(shirt("#8cd4c0")),
  sunshine: wrap(shirt("#f5d079")),
  lavender: wrap(shirt("#b7a0d8")),
  bow: wrap(
    '<path fill="#f4a4bc" d="M45 43Q8 3 10 51t35 7M55 43Q92 3 90 51T55 58"/><circle fill="#ffe3ab" cx="50" cy="49" r="13"/>',
  ),
  hat: wrap(
    '<path fill="#edcf8c" d="M24 64 32 23q19-13 37 0l8 41"/><ellipse fill="#f4dfa7" cx="50" cy="68" rx="43" ry="15"/><path fill="none" stroke="#e599a0" stroke-width="9" d="M28 49h45"/>',
  ),
  clear: wrap(
    '<path fill="none" stroke="#8eb4a9" stroke-width="9" d="m24 49 18 20 36-42"/>',
  ),
  blanket: wrap(
    '<path fill="#b3b6e0" d="m16 17 65 5 6 65-70-4Z"/><path fill="#fff2c8" d="m48 34 5 10 12 2-9 8 2 13-11-6-10 6 2-13-9-8 13-2Z"/>',
  ),
  yak: wrap(
    '<path fill="#e0b37b" d="M22 35Q5 12 12 9l25 22M78 35Q95 12 88 9L63 31"/><path fill="#bb875f" d="M20 47q-1-34 30-28t30 28l4 35-34 9-34-9Z"/><ellipse fill="#fff0d1" cx="50" cy="66" rx="24" ry="18"/><path fill="none" d="m26 48 9 4 8-4m14 0 8 4 9-4m-28 18 4 3 4-3"/>',
  ),
  light: wrap(
    '<path fill="#ffdc83" d="m30 14 40 0 17 44H13Z"/><path fill="none" stroke-width="8" d="M50 58v27M30 87h40"/>',
  ),
  wake: wrap(
    '<circle fill="#ffe599" cx="50" cy="50" r="24"/><path fill="none" d="M50 7v10m0 66v10M7 50h10m66 0h10M19 19l8 8m46 46 8 8m0-62-8 8M27 73l-8 8"/>',
  ),
};
export const roomIcons = {
  kitchen: icons.porridge,
  bath: icons.soap,
  dress: icons.mint,
  bed: icons.blanket,
};
