const axios = require("axios")

async function fetchLiveScore(matchLink) {

  try {

    const response = await axios.get(matchLink, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://www.google.com/"
      }
    })

    const html = response.data

    const scoreMatch = html.match(/(\d+\/\d+)\s*\((\d+\.\d+)/)

    const score = scoreMatch
      ? scoreMatch[0]
      : "Score unavailable"

    const teamMatch = html.match(/([A-Za-z ]+) vs ([A-Za-z ]+)/)

    const teams = teamMatch
      ? teamMatch[0]
      : "Live Match"

    return {
      score,
      teams
    }

  } catch (err) {

    console.log("Score fetch error:", err.message)

    return null

  }

}

module.exports = fetchLiveScore