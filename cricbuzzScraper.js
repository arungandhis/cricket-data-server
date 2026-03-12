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

async function fetchMatches() {

  try {

    const url =
      "https://www.cricbuzz.com/api/cricket-match/live-matches";

    console.log("Fetching live matches...");

    const response = await axios.get(url, { headers });

    const data = response.data;

    if (!data || !data.typeMatches) {
      console.log("No matches found");
      return [];
    }

    const matches = [];

    data.typeMatches.forEach(type => {

      type.seriesMatches.forEach(series => {

        if (!series.seriesAdWrapper) return;

        const matchList = series.seriesAdWrapper.matches || [];

        matchList.forEach(m => {

          const info = m.matchInfo;

          if (!info) return;

          matches.push({
            match: info.team1.teamName + " vs " + info.team2.teamName,
            matchId: info.matchId.toString()
          });

        });

      });

    });

    return matches;

  } catch (err) {

    console.log("Match fetch error:", err.message);

    return [];

  }

}

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