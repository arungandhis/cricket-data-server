const { broadcastCommentary } = require("./websocket");
const { fetchCommentary } = require("./cricbuzzScraper");   // UPDATED
const generateAudio = require("./ttsEngine");

let matchInterval = null;
let lastCommentary = null;

/**
 * LIVE MATCH ENGINE
 * Polls Cricbuzz every 10 seconds.
 * Uses live commentary when available.
 * Falls back to full old commentary when live stops.
 */
function startLiveMatch(match) {
  console.log("Launching LIVE MATCH engine");

  if (matchInterval) {
    clearInterval(matchInterval);
  }

  const matchId = match.matchId;
  console.log("LIVE MATCH started:", matchId);

  lastCommentary = null;

  matchInterval = setInterval(async () => {
    try {
      // Fetch live or old commentary
      const result = await fetchCommentary(matchId);

      if (!result || !result.commentary || result.commentary.length === 0) {
        console.log("No commentary data");
        return;
      }

      // Cricbuzz returns newest first
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

      // Generate audio (safe fallback)
      let audio = null;
      try {
        audio = await generateAudio(latestLine);
      } catch (e) {
        console.log("Audio generation failed:", e.message);
      }

      // Broadcast to overlay in EXACT format overlay.html expects
      broadcastCommentary({
        teams: match.match || "Live Match",
        score: result.score || "",
        commentary: latestLine,
        batsmen: result.batsmen || [],
        bowler: result.bowler || "",
        audio: audio
      });

      console.log("Broadcasting:", latestLine);

    } catch (err) {
      console.log("Match engine error:", err.message);
    }
  }, 10000);
}

module.exports = { startLiveMatch };
