const axios = require("axios");

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
  Referer: "https://www.cricbuzz.com/",
  Accept: "application/json"
};


/*
---------------------------------------
FETCH MATCH LIST
---------------------------------------
*/

async function fetchMatches() {

  try {

    const url ="https://www.cricbuzz.com/cricket-match/live-scores"
      

    const res = await axios.get(url, { headers });

    const matches = [];

    const data = res.data.typeMatches || [];

    data.forEach(type => {

      type.seriesMatches.forEach(series => {

        const seriesName =
          series.seriesAdWrapper?.seriesName || "";

        series.seriesAdWrapper?.matches?.forEach(m => {

          const info = m.matchInfo;

          const team1 = info.team1.teamName;
          const team2 = info.team2.teamName;

          matches.push({
            match: `${team1} vs ${team2}`,
            series: seriesName,
            matchId: info.matchId,
            status: info.status
          });

        });

      });

    });

    console.log("Matches found:", matches.length);

    return matches;

  } catch (err) {

    console.log("Match fetch error:", err.message);

    return [];

  }

}


/*
---------------------------------------
FETCH LIVE COMMENTARY
---------------------------------------
*/

async function fetchCommentary(matchId) {

  try {

    const url =
      `https://www.cricbuzz.com/api/cricket-match/commentary/${matchId}`;

    console.log("Fetching commentary:", url);

    const res = await axios.get(url, { headers });

    const list = res.data.commentaryList || [];

    if (list.length === 0) {

      console.log("No commentary returned");

      return null;

    }

    const latest = list[0];

    return {

      commentary: latest.commText || "",

      score:
        res.data.matchHeader?.status || "",

      batsmen: [],

      bowler: ""

    };

  } catch (err) {

    console.log("Commentary fetch error:", err.message);

    return null;

  }

}


/*
---------------------------------------
FETCH HISTORICAL COMMENTARY
---------------------------------------
*/

async function fetchHistoricalCommentary(matchId) {

  try {

    const url =
      `https://www.cricbuzz.com/api/cricket-match/full-commentary/${matchId}`;

    const res = await axios.get(url, { headers });

    const balls = [];

    const data = res.data.commentaryList || [];

    data.forEach(ball => {

      if (ball.commText) {

        balls.push(ball.commText);

      }

    });

    console.log("Historical balls:", balls.length);

    return balls;

  } catch (err) {

    console.log("Historical commentary error:", err.message);

    return [];

  }

}


module.exports = {
  fetchMatches,
  fetchCommentary,
  fetchHistoricalCommentary
};