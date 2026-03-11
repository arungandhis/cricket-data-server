const { broadcastCommentary } = require("./websocket");
const { fetchCommentary } = require("./cricbuzzScraper");
const generateAudio = require("./ttsEngine");

let matchInterval = null;
let lastCommentary = null;

/**
 * Detect special events for overlay animations
 */
function detectEvent(text) {
  const t = text.toLowerCase();

  if (t.includes("four") || t.includes("4 runs")) return "FOUR";
  if (t.includes("six") || t.includes("6 runs")) return "SIX";
  if (t.includes("out") || t.includes("wicket")) return "WICKET";

  return null;
}

/**
 * Start live match engine using scraped match URL
 */
function startLiveMatch(match) {
  console.log("Launching LIVE MATCH engine (HTML scraping)");

  if (matchInterval) {
    clearInterval(matchInterval);
  }

  const matchUrl = match.url;
  console.log("MATCH URL:", matchUrl);

  lastCommentary = null;

  matchInterval = setInterval(async () => {
    try {
      // 1️⃣ Fetch commentary + score + batsmen + bowler
      const result = await fetchCommentary(matchUrl);

      if (!result || !result.commentary || result.commentary.length === 0) {
        console.log("No commentary data");
        return;
      }

      const latestLine = result.commentary[0];

      if (!latestLine || latestLine.trim() === "") {
        console.log("Skipping empty commentary");
        return;
      }

      // Prevent duplicates
      if (latestLine === lastCommentary) {
        console.log("Duplicate commentary ignored");
        return;
      }

      lastCommentary = latestLine;

      // 2️⃣ Detect special events (FOUR, SIX, WICKET)
      const event = detectEvent(latestLine);

      // 3️⃣ Generate audio
      let audio = null;
      try {
        audio = await generateAudio(latestLine);
      } catch (e) {
        console.log("Audio generation failed:", e.message);
      }

      // 4️⃣ Broadcast to overlay
      broadcastCommentary({
        teams: match.match || "Cricket Match",
        score: result.score || "",
        commentary: latestLine,
        batsmen: result.batsmen || [],
        bowler: result.bowler || "",
        audio,
        event, // NEW: overlay can animate based on this
      });

      console.log("Broadcast:", latestLine);

    } catch (err) {
      console.log("Match engine error:", err.message);
    }
  }, 10000);

  return matchInterval;
}

module.exports = { startLiveMatch };
