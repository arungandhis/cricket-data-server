const axios = require("axios");

/*
HEADERS
Helps avoid bot blocking
*/

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
  Referer: "https://www.cricbuzz.com/"
};

/*
---------------------------------------
FETCH LIVE MATCHES
Used by /matches endpoint
---------------------------------------
*/
const axios = require("axios");

/*
Fetch matches from Cricbuzz homepage
*/
async function fetchMatches() {

  try {

    const url = "https://www.cricbuzz.com/cricket-match/live-scores";

    console.log("Fetching matches from Cricbuzz...");

    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
      }
    });

    const html = response.data;

    const matches = [];

    const regex = /live-cricket-scores\/(\d+)\/([^"]+)/g;

    let match;

    while ((match = regex.exec(html)) !== null) {

      const matchId = match[1];

      let matchName = match[2]
        .replace(/-/g, " ")
        .replace(/live-cricket-score.*/i, "")
        .trim();

      matches.push({
        match: matchName,
        matchId: matchId,
        status: "LIVE"
      });

    }

    console.log("Matches found:", matches.length);

    return matches;

  } catch (err) {

    console.log("Match fetch error:", err.message);

    return [];

  }

}

module.exports = { fetchMatches };


/*
---------------------------------------
FETCH COMMENTARY
Used by matchEngine.js
---------------------------------------
*/

async function fetchCommentary(matchId) {

  try {

    const url =
      `https://www.cricbuzz.com/api/cricket-match/commentary/${matchId}`;

    console.log("Fetching commentary:", url);

    const response = await axios.get(url, { headers });

    const data = response.data;

    if (!data || !data.commentaryList) {

      console.log("No commentary returned");

      return null;

    }

    const comm = data.commentaryList[0];

    if (!comm) return null;

    const commentaryText = comm.commText || "";

    const batsmen = [];
    const bowler = "";

    /*
    Extract batsmen if available
    */

    if (data.matchHeader && data.matchHeader.players) {

      data.matchHeader.players.forEach(p => {

        if (p.battingStyle) {
          batsmen.push(p.name);
        }

      });

    }

    const score =
      data.matchHeader?.state || "";

    return {
      commentary: commentaryText,
      score,
      batsmen,
      bowler
    };

  } catch (err) {

    console.log("Commentary fetch error:", err.message);

    return null;

  }

}

module.exports = {
  fetchMatches,
  fetchCommentary
};