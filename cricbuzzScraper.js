const axios = require("axios")

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
}

/*
---------------------------------------
FETCH MATCHES
---------------------------------------
*/
async function fetchMatches() {

  try {

    const url = "https://www.cricbuzz.com/cricket-match/live-scores"

    console.log("Fetching matches page")

    const response = await axios.get(url, { headers })

    const html = response.data

    const matches = []

    const regex = /live-cricket-scores\/(\d+)\/([^"]+)/g

    let match

    while ((match = regex.exec(html)) !== null) {

      const matchId = match[1]

      let name = match[2]
        .replace(/-/g, " ")
        .replace(/live-cricket-score.*/i, "")
        .trim()

      matches.push({
        match: name,
        matchId: matchId,
        status: "LIVE"
      })

    }

    // remove duplicates
    const uniqueMatches = [
      ...new Map(matches.map(m => [m.matchId, m])).values()
    ]

    console.log("Matches found:", uniqueMatches.length)

    return uniqueMatches.slice(0,10)

  } catch (err) {

    console.log("Match fetch error:", err.message)

    return []

  }

}

/*
---------------------------------------
FETCH COMMENTARY
---------------------------------------
*/
async function fetchCommentary(matchId) {

  try {

    const url =
      `https://www.cricbuzz.com/api/cricket-match/commentary/${matchId}`

    console.log("Fetching commentary:", matchId)

    const response = await axios.get(url, { headers })

    const data = response.data

    if (!data || !data.commentaryList || data.commentaryList.length === 0) {
      return null
    }

    const latest = data.commentaryList[0]

    return {
      commentary: latest.commText || "",
      score: data.matchHeader?.state || "",
      batsmen: [],
      bowler: ""
    }

  } catch (err) {

    console.log("Commentary fetch error:", err.message)

    return null

  }

}

module.exports = {
  fetchMatches,
  fetchCommentary
}