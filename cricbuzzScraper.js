const { getBrowser } = require("./browser")

/*
FETCH MATCHES
*/
async function fetchMatches() {

  try {

    const browser = await getBrowser()
    const page = await browser.newPage()

    await page.goto(
      "https://www.cricbuzz.com/cricket-match/live-scores",
      { waitUntil: "networkidle2" }
    )

    const matches = await page.evaluate(() => {

      const links = document.querySelectorAll("a[href*='live-cricket-scores']")

      const results = []

      links.forEach(link => {

        const href = link.getAttribute("href")

        if (!href) return

        const parts = href.split("/")

        const matchId = parts[2]

        const name = parts[3]?.replace(/-/g, " ")

        if (matchId && name) {

          results.push({
            match: name,
            matchId,
            status: "LIVE"
          })

        }

      })

      return results.slice(0, 10)

    })

    await page.close()

    console.log("Matches found:", matches.length)

    return matches

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

    const browser = await getBrowser()
    const page = await browser.newPage()

    const url =
      `https://www.cricbuzz.com/live-cricket-scores/${matchId}/commentary`

    console.log("Opening commentary:", url)

    await page.goto(url, { waitUntil: "networkidle2" })

    const commentary = await page.evaluate(() => {

      const el = document.querySelector(".cb-com-ln")

      return el ? el.innerText.trim() : ""

    })

    await page.close()

    if (!commentary) {

      console.log("No commentary found")

      return null

    }

    return {
      commentary,
      score: "",
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