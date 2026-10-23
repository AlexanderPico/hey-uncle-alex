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
    ages: "8+",
    tags: ["words", "puzzle", "daily"],
    status: "live",
    url: "https://alexanderpico.github.io/homonym-game/",
  },
  {
    id: "scale-tool",
    title: "How Big Is That?",
    emoji: "🔭",
    blurb: "How big is a billion? Slide through enormous numbers and compare atoms, distances, time, mass, and more.",
    ages: "10+",
    tags: ["numbers", "science", "explore"],
    status: "live",
    action: "Explore",
    url: "activities/scale/",
  },
  {
    id: "riff-quest",
    title: "Riff Quest",
    emoji: "🎸",
    blurb: "Pick a famous guitar riff and watch the notes scroll by while it plays. Slow it down to learn it.",
    ages: "8+",
    tags: ["music", "guitar", "play"],
    status: "live",
    url: "activities/riff-quest/",
  },
  {
    id: "videos",
    title: "Videos Uncle Alex Picked",
    emoji: "🎬",
    blurb: "Videos Uncle Alex thinks are worth watching, all in one place.",
    tags: ["watch"],
    status: "live",
    action: "Watch",
    url: "videos/",
  },
];
