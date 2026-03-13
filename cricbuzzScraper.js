const axios = require("axios");
const cheerio = require("cheerio");

/*
HEADERS
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
CRICBUZZ API COMMENTARY
---------------------------------------
*/
async function fetchCricbuzzCommentary(matchId) {

  try {

    const url =
      `https://www.cricbuzz.com/api/cricket-match/commentary/${matchId}`;

    console.log("Trying Cricbuzz API:", url);

    const response = await axios.get(url, { headers });

    const data = response.data;

    if (!data || !data.commentaryList || data.commentaryList.length === 0) {
      console.log("No Cricbuzz API commentary");
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

    console.log("Cricbuzz API failed:", err.message);

    return null;

  }

}

/*
---------------------------------------
CRICBUZZ HTML FALLBACK
---------------------------------------
*/
async function fetchCricbuzzHtml(matchId) {

  try {

    const url =
      `https://www.cricbuzz.com/live-cricket-scores/${matchId}/commentary`;

    console.log("Trying Cricbuzz HTML:", url);

    const response = await axios.get(url, { headers });

    const $ = cheerio.load(response.data);

    const text = $(".cb-com-ln").first().text().trim();

    if (!text) {
      console.log("No Cricbuzz HTML commentary");
      return null;
    }

    return {
      commentary: text,
      score: "",
      batsmen: [],
      bowler: ""
    };

  } catch (err) {

    console.log("Cricbuzz HTML fallback failed:", err.message);

    return null;

  }

}

/*
---------------------------------------
ESPN HTML FALLBACK
---------------------------------------
*/
async function fetchEspnHtml() {

  try {

    const url =
      "https://www.espncricinfo.com/live-cricket-score";

    console.log("Trying ESPN HTML fallback");

    const response = await axios.get(url, {
      headers: {
        "User-Agent": headers["User-Agent"]
      }
    });

    const $ = cheerio.load(response.data);

    const text = $(".ds-text-tight-m").first().text().trim();

    if (!text) {
      console.log("No ESPN HTML commentary");
      return null;
    }

    return {
      commentary: text,
      score: "",
      batsmen: [],
      bowler: ""
    };

  } catch (err) {

    console.log("ESPN HTML fallback failed:", err.message);

    return null;

  }

}

/*
---------------------------------------
MAIN COMMENTARY FUNCTION
---------------------------------------
*/
async function fetchCommentary(matchId) {

  // 1️⃣ Cricbuzz API
  let result = await fetchCricbuzzCommentary(matchId);
  if (result && result.commentary) return result;

  // 2️⃣ Cricbuzz HTML
  result = await fetchCricbuzzHtml(matchId);
  if (result && result.commentary) return result;

  // 3️⃣ ESPN HTML fallback
  result = await fetchEspnHtml();
  if (result && result.commentary) return result;

  console.log("All commentary sources failed");

  return null;

}

module.exports = {
  fetchMatches,
  fetchCommentary
};