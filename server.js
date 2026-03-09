const express = require("express")
const cors = require("cors")
const axios = require("axios")

const app = express()

app.use(cors())

const PORT = process.env.PORT || 3000


// ROOT
app.get("/", (req, res) => {
  res.json({ status: "Cricket Data Server Running" })
})


// LIVE MATCHES
app.get("/matches", async (req, res) => {

  try {

    const url = "https://www.cricbuzz.com/api/cricket-match/live-scores"

    const response = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    })

    const matches = []

    const data = response.data

    if (data && data.typeMatches) {

      data.typeMatches.forEach(type => {

        type.seriesMatches.forEach(series => {

          if (series.seriesAdWrapper) {

            series.seriesAdWrapper.matches.forEach(match => {

              const info = match.matchInfo
              const score = match.matchScore

              matches.push({
                matchId: info.matchId,
                team1: info.team1.teamName,
                team2: info.team2.teamName,
                status: info.status,
                score: score
              })

            })

          }

        })

      })

    }

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