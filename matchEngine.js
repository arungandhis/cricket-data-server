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
 * Start live match engine
 */
function startLiveMatch(match) {

  console.log("Launching LIVE MATCH engine");

  if (matchInterval) {
    clearInterval(matchInterval);
  }

  const matchId = match.matchId;

  console.log("MATCH ID:", matchId);

  lastCommentary = null;

  matchInterval = setInterval(async () => {

    try {

      /* 1️⃣ FETCH COMMENTARY */

      const result = await fetchCommentary(matchId);

      if (!result || !result.commentary) {
        console.log("No commentary data");
        return;
      }

      const latestLine = result.commentary.trim();

      if (!latestLine) {
        console.log("Skipping empty commentary");
        return;
      }

      /* 2️⃣ PREVENT DUPLICATES */

      if (latestLine === lastCommentary) {
        console.log("Duplicate commentary ignored");
        return;
      }

      lastCommentary = latestLine;

      /* 3️⃣ DETECT EVENT */

      const event = detectEvent(latestLine);

      /* 4️⃣ GENERATE AUDIO */

      let audio = null;

      try {
        audio = await generateAudio(latestLine);
      } catch (e) {
        console.log("Audio generation failed:", e.message);
      }

      /* 5️⃣ BROADCAST */

      broadcastCommentary({
        teams: match.match || "Cricket Match",
        score: result.score || "",
        commentary: latestLine,
        batsmen: result.batsmen || [],
        bowler: result.bowler || "",
        audio,
        event
      });

      console.log("Broadcast:", latestLine);

    } catch (err) {

      console.log("Match engine error:", err.message);

    }

  }, 8000);

  return matchInterval;
}

module.exports = { startLiveMatch };