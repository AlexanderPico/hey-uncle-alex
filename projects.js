// The one list of projects shown on the landing page.
// To add a project: copy a block, fill it in, and set status.
//   status: "live"  -> shows a Play button (url required)
//           "soon"  -> shows "Coming soon" (no link)
//           "hidden" -> not shown at all (kept here so it is easy to bring back)
globalThis.HUA_PROJECTS = [
  {
    id: "homonym-game",
    title: "Homonym Game",
    emoji: "🔤",
    blurb: "Words that sound alike but mean different things. Solve the clue to find the two-word answer.",
    tags: ["words", "puzzle", "daily"],
    status: "live",
    url: "https://alexanderpico.github.io/homonym-game/",
  },
  {
    id: "scale-tool",
    title: "How Big Is That?",
    emoji: "🔭",
    blurb: "How big is a billion? Slide through enormous numbers and compare atoms, distances, time, mass, and more.",
    tags: ["numbers", "science", "explore"],
    status: "live",
    action: "Explore",
    url: "activities/scale/",
  },
  {
    id: "guitar",
    title: "Guitar Hero",
    emoji: "🎸",
    blurb: "For those who want to rock!",
    tags: ["music", "guitar"],
    status: "live",
    action: "Rock on",
    url: "guitar/",
  },
  {
    id: "bedtime",
    title: "Bedtime Stories",
    emoji: "🌙",
    blurb: "A new bedtime story every day. Read it together, and keep your favorites.",
    tags: ["stories", "read together"],
    status: "live",
    action: "Read",
    url: "bedtime/",
  },
  {
    id: "sandbox",
    title: "Laurel's Sandbox",
    emoji: "🧸",
    icon: "assets/laurel-yak.png",
    blurb: "A play space just for Laurel: videos and games.",
    tags: ["videos", "games"],
    status: "live",
    action: "Play",
    url: "sandbox/",
  },
  {
    id: "bird-nerd",
    title: "Bird Nerd",
    emoji: "🐦",
    blurb: "For everyone who loves birds.",
    tags: ["birds", "nature"],
    status: "live",
    action: "Explore",
    url: "bird-nerd/",
  },
  {
    id: "videos",
    title: "Video Picks",
    emoji: "🎬",
    blurb: "Videos Uncle Alex thinks are worth watching, all in one place.",
    tags: ["watch"],
    status: "hidden", // not shown on the landing page; the /videos/ page still exists. Set back to "live" to show it again.
    action: "Watch",
    url: "videos/",
  },
];
