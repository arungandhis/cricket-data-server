const axios = require("axios")
const cheerio = require("cheerio")

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
}

/*
FETCH MATCH LIST
*/
async function fetchMatches() {

  try {

    const url =
      "https://www.cricbuzz.com/api/html/cricket-match/live-scores"

    const response = await axios.get(url, { headers })

    const html = response.data

    const $ = cheerio.load(html)

    const matches = []

    $("a[href*='live-cricket-scores']").each((i, el) => {

      const href = $(el).attr("href")

      if (!href) return

      const parts = href.split("/")

      const matchId = parts[2]

      const name = parts[3]
        ?.replace(/-/g, " ")
        .replace("live-cricket-score", "")

      if (matchId && name) {

        matches.push({
          match: name.trim(),
          matchId,
          status: "LIVE"
        })

      }

    })

    console.log("Matches found:", matches.length)

    return matches.slice(0,10)

  } catch (err) {

    console.log("Match fetch error:", err.message)

    return []

  }

}

/*
FETCH COMMENTARY
*/
async function fetchCommentary(matchId) {

  try {

    const url =
      `https://www.cricbuzz.com/api/cricket-match/commentary/${matchId}`

    const response = await axios.get(url, { headers })

    const data = response.data

    if (!data || !data.commentaryList || data.commentaryList.length === 0) {

      console.log("No commentary available")

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