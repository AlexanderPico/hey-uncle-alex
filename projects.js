// The one list of projects shown on the landing page.
// To add a project: copy a block, fill it in, and set status.
//   status: "live"  -> shows a Play button (url required)
//           "soon"  -> shows "Coming soon" (no link)
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
    status: "live",
    action: "Watch",
    url: "videos/",
  },
];
