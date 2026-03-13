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
ESPN FALLBACK
---------------------------------------
*/

async function fetchEspnCommentary() {

  try {

    const url =
      "https://site.web.api.espn.com/apis/v2/sports/cricket/scoreboard";

    console.log("Trying ESPN fallback");

    const response = await axios.get(url, { headers });

    const events = response.data.events;

    if (!events || events.length === 0) {
      console.log("No ESPN events");
      return null;
    }

    const event = events[0];

    const status = event.status?.type?.detail || "";

    const teams =
      event.competitions?.[0]?.competitors
        ?.map(t => t.team.displayName)
        .join(" vs ");

    return {
      commentary: status,
      score: teams,
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

  result = await fetchEspnCommentary();

  if (result) {
    return result;
  }

  console.log("No commentary available");

  return null;

}

module.exports = {
  fetchMatches,
  fetchCommentary
};