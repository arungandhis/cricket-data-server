const axios = require("axios")

async function scrapeMatches() {

  try {

    const response = await axios.get(
      "https://www.cricbuzz.com/cricket-match/live-scores",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
          "Accept":
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "Connection": "keep-alive",
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
          "Referer": "https://www.google.com/",
        },
        timeout: 10000
      }
    )

    const html = response.data

    const matches = []

    const regex =
      /href="\/live-cricket-scores\/(\d+)\/([^"]+)".*?>(.*?)<\/a>/g

    let match

    while ((match = regex.exec(html)) !== null) {

      const matchName = match[3]
        .replace(/<[^>]*>?/gm, "")
        .replace(/\s+/g, " ")
        .trim()

      matches.push({
        match: matchName,
        matchId: match[2],
        link: `https://www.cricbuzz.com/live-cricket-scores/${match[1]}/${match[2]}`
      })

    }

    console.log("Matches found:", matches.length)

    return matches

  } catch (error) {

    console.log("Scraper error:", error.message)

    return []

  }

}

module.exports = scrapeMatches