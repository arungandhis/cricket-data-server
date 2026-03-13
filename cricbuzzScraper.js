const axios = require("axios")

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
}

/*
---------------------------------------
FETCH LIVE MATCHES
---------------------------------------
*/
async function fetchMatches() {

  try {

    const url =
      "https://www.cricbuzz.com/api/cricket-match/live-scores"

    console.log("Fetching matches from Cricbuzz API")

    const response = await axios.get(url, { headers })

    const data = response.data

    if (!data || !data.typeMatches) {
      return []
    }

    const matches = []

    data.typeMatches.forEach(type => {

      type.seriesMatches.forEach(series => {

        const match = series.seriesAdWrapper?.matches?.[0]

        if (!match) return

        const matchInfo = match.matchInfo

        matches.push({
          match:
            matchInfo.team1.teamName +
            " vs " +
            matchInfo.team2.teamName,
          matchId: matchInfo.matchId,
          status: matchInfo.status
        })

      })

    })

    console.log("Matches found:", matches.length)

    return matches

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