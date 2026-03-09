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

    const response = await axios.get(
      "https://www.cricbuzz.com/match-api/v1/liveMatches",
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept": "application/json"
        }
      }
    )

    res.json(response.data)

  } catch (error) {

    console.log("Error:", error.message)

    res.status(500).json({
      error: "Failed to fetch matches",
      message: error.message
    })

  }

})


app.listen(PORT, () => {
  console.log("Server running on port " + PORT)
})