const axios = require("axios");

/*
Common headers
*/
const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
  Referer: "https://www.cricbuzz.com/"
};

/*
---------------------------------------
FETCH COMMENTARY (PRIMARY: CRICBUZZ)
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
      console.log("Cricbuzz returned no commentary");
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
FALLBACK: ESPN CRICINFO
---------------------------------------
*/

async function fetchEspnCommentary(matchId) {

  try {

    const url =
      `https://site.web.api.espn.com/apis/v2/sports/cricket/scoreboard`;

    console.log("Trying ESPN fallback commentary");

    const response = await axios.get(url, { headers });

    const events = response.data.events;

    if (!events || events.length === 0) {
      console.log("No ESPN events found");
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

  result = await fetchEspnCommentary(matchId);

  if (result) {
    return result;
  }

  console.log("No commentary available from any source");

  return null;

}

module.exports = {
  fetchCommentary
};