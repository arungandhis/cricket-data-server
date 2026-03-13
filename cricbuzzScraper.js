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
FETCH MATCH LIST
---------------------------------------
*/
async function fetchMatches() {

  try {

    const url = "https://www.cricbuzz.com/cricket-match/live-scores";

    console.log("Fetching matches from Cricbuzz...");

    const response = await axios.get(url, { headers });

    const html = response.data;

    const matches = [];

    const regex = /live-cricket-scores\/(\d+)\/([^"]+)/g;

    let match;

    while ((match = regex.exec(html)) !== null) {

      const matchId = match[1];

      let name = match[2]
        .replace(/-/g, " ")
        .replace(/live-cricket-score.*/i, "")
        .trim();

      matches.push({
        match: name,
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

/*
---------------------------------------
CRICBUZZ COMMENTARY
---------------------------------------
*/
async function fetchCricbuzzCommentary(matchId) {

  try {

    const url =
      `https://www.cricbuzz.com/api/cricket-match/commentary/${matchId}`;

    console.log("Trying Cricbuzz commentary:", url);

    const response = await axios.get(url, { headers });

    const data = response.data;

    if (!data || !data.commentaryList || data.commentaryList.length === 0) {
      console.log("No Cricbuzz commentary");
      return null;
    }

    const latestBall = data.commentaryList[0];

    return {
      commentary: latestBall.commText || "",
      score: data.matchHeader?.state || "",
      batsmen: [],
      bowler: ""
    };

  } catch (err) {

    console.log("Cricbuzz commentary failed:", err.message);

    return null;

  }

}

/*
---------------------------------------
ESPN FALLBACK COMMENTARY
---------------------------------------
*/
async function fetchEspnCommentary(matchId) {

  try {

    const url =
      `https://hs-consumer-api.espncricinfo.com/v1/pages/match/comments?matchId=${matchId}`;

    console.log("Trying ESPN fallback:", url);

    
    
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://www.espncricinfo.com/",
        "Origin": "https://www.espncricinfo.com"
      },
      timeout: 10000
    });

 
    

    const comments = response.data.comments;

    if (!comments || comments.length === 0) {
      console.log("No ESPN commentary");
      return null;
    }

    const latest = comments[0];

    return {
      commentary: latest.text || "",
      score: latest.score || "",
      batsmen: [],
      bowler: ""
    };

  } catch (err) {

    console.log("ESPN fallback failed:", err.message);

    return null;

  }

}

/*
---------------------------------------
MAIN COMMENTARY FUNCTION
---------------------------------------
*/
async function fetchCommentary(matchId) {

  let result = await fetchCricbuzzCommentary(matchId);

  if (result && result.commentary) {
    return result;
  }

  console.log("Falling back to ESPN Cricinfo");

  result = await fetchEspnCommentary(matchId);

  if (result) {
    return result;
  }

  console.log("No commentary available");

  return null;

}

/*
EXPORT FUNCTIONS
*/
module.exports = {
  fetchMatches,
  fetchCommentary
};