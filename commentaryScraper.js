const axios = require("axios");

async function fetchCommentary(matchId) {

try {

const url =
`https://www.cricbuzz.com/api/cricket-match/commentary/${matchId}`;

console.log("Fetching commentary API:", url);

const response = await axios.get(url, {
headers: {
"User-Agent":
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
"Referer": "https://www.cricbuzz.com/"
}
});

const data = response.data;

if (!data || !data.commentaryList) {
console.log("No commentary data");
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

console.log("Commentary API error:", err.message);
return null;

}

}

module.exports = { fetchCommentary };