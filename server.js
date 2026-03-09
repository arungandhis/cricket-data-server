const express = require("express")
const cors = require("cors")
const axios = require("axios")

const app = express()

app.use(cors())

const PORT = process.env.PORT || 3000


// ROOT
app.get("/", (req, res) => {
  res.json({ message: "Cricket Data Server Running" })
})


// MATCHES
app.get("/matches", async (req, res) => {

  try {

    const url = "https://www.cricbuzz.com/api/cricket-match/live-scores"

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    })

    const data = response.data

    const matches = []

    if (!data.typeMatches) {
      return res.json([])
    }

    data.typeMatches.forEach(type => {

      if (!type.seriesMatches) return

      type.seriesMatches.forEach(series => {

        if (!series.seriesAdWrapper) return

        const m = series.seriesAdWrapper.matches

        if (!m) return

        m.forEach(match => {

          const info = match.matchInfo

          matches.push({
            matchId: info.matchId,
            team1: info.team1.teamName,
            team2: info.team2.teamName,
            status: info.status,
            state: info.state
          })

        })

      })

    })

    res.json(matches)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      error: "Failed to fetch matches"
    })

  }

})


app.listen(PORT, () => {
  console.log("Server started on port", PORT)
})