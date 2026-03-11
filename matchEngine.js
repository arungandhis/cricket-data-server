const { broadcastCommentary } = require("./websocket");
const { fetchCommentary } = require("./cricbuzzScraper");
const axios = require("axios");
const generateAudio = require("./ttsEngine");

let matchInterval = null;
let lastCommentary = null;

/**
 * Fetch miniscore from the SAME commentary endpoint
 * (Correct Cricbuzz endpoint — never 404s)
 */
async function fetchMiniScore(matchId) {
  try {
    const url = `https://www.cricbuzz.com/api/cricket-match/commentary/${matchId}`;

    const res = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json"
      }
    });

    const ms = res.data.miniscore;
    if (!ms) return {};

    return {
      score: `${ms.runs}/${ms.wickets} (${ms.overs})`,
      batsmen: [
        `${ms.batsmanStriker?.batName} ${ms.batsmanStriker?.runs} (${ms.batsmanStriker?.balls})`,
        `${ms.batsmanNonStriker?.batName} ${ms.batsmanNonStriker?.runs} (${ms.batsmanNonStriker?.balls})`
      ],
      bowler: `${ms.bowlerStriker?.bowlName} ${ms.bowlerStriker?.overs}-${ms.bowlerStriker?.maidens}-${ms.bowlerStriker?.runs}-${ms.bowlerStriker?.wickets}`
    };

  } catch (err) {
    console.log("MiniScore fetch error:", err.message);
    return {};
  }
}

/**
 * LIVE MATCH ENGINE
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
      // 1️⃣ Fetch commentary (live or old)
      const result = await fetchCommentary(matchId);

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

      // 2️⃣ Fetch score + batsmen + bowler from SAME endpoint
      const mini = await fetchMiniScore(matchId);

      // 3️⃣ Generate audio
      let audio = null;
      try {
        audio = await generateAudio(latestLine);
      } catch (e) {
        console.log("Audio generation failed:", e.message);
      }

      // 4️⃣ Broadcast to overlay
      broadcastCommentary({
        teams: match.match || "Live Match",
        score: mini.score || "",
        commentary: latestLine,
        batsmen: mini.batsmen || [],
        bowler: mini.bowler || "",
        audio: audio
      });

      console.log("Broadcasting:", latestLine);

    } catch (err) {
      console.log("Match engine error:", err.message);
    }
  }, 10000);

  return matchInterval;
}

module.exports = { startLiveMatch };
