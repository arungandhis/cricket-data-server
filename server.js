const express = require("express")
const cors = require("cors")
const axios = require("axios")
const cheerio = require("cheerio")

const app = express()

app.use(cors())

const PORT = process.env.PORT || 3000

// ROOT ROUTE
app.get("/", (req, res) => {
  res.json({
    message: "Cricket Data Server Running"
  })
})

// MATCHES ROUTE
app.get("/matches", async (req, res) => {

  try {

    const url = "https://www.cricbuzz.com/cricket-match/live-scores"

    const response = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    })

    const $ = cheerio.load(response.data)

    const matches = []

    $(".cb-mtch-lst").each((i, el) => {

      const title = $(el).find("h3").text().trim()

      const score = $(el).find(".cb-scr-wll-chvrn").text().trim()

      const link = $(el).find("a").attr("href")

      if (title) {
        matches.push({
          match: title,
          score: score,
          link: link
        })
      }

    })

    res.json(matches)

  } catch (err) {

    console.log(err)

    res.status(500).json({
      error: "Failed to fetch matches"
    })

  }

})

app.listen(PORT, () => {
  console.log("Server running on port", PORT)
})