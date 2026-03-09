const express = require("express")
const cors = require("cors")
const axios = require("axios")
const cheerio = require("cheerio")

const app = express()

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3000

// Root route
app.get("/", (req, res) => {
 res.json({
  status: "Cricbuzz Scraper Server Running"
 })
})

/* -------------------------------
   GET LIVE MATCHES
--------------------------------*/

app.get("/matches", async (req, res) => {

 try {

  const url = "https://www.cricbuzz.com/cricket-match/live-scores"

  const { data } = await axios.get(url, {
   headers: {
    "User-Agent": "Mozilla/5.0"
   }
  })

  const $ = cheerio.load(data)

  const matches = []

  $(".cb-lv-main").each((i, el) => {

   const title = $(el)
    .find(".cb-lv-scr-mtch-hdr a")
    .text()
    .trim()

   const score = $(el)
    .find(".cb-lv-scrs")
    .text()
    .trim()

   const link = $(el)
    .find(".cb-lv-scr-mtch-hdr a")
    .attr("href")

   if (title && link) {

    const matchId = link.split("/")[2]

    matches.push({
     match: title,
     score: score,
     matchId: matchId
    })

   }

  })

  res.json(matches)

 } catch (error) {

  console.error(error)

  res.status(500).json({
   error: "Failed to fetch matches"
  })

 }

})

/* -------------------------------
   GET MATCH COMMENTARY
--------------------------------*/

app.get("/commentary/:id", async (req, res) => {

 try {

  const matchId = req.params.id

  const url =
   `https://www.cricbuzz.com/api/cricket-match/commentary/${matchId}`

  const { data } = await axios.get(url, {
   headers: {
    "User-Agent": "Mozilla/5.0"
   }
  })

  res.json(data)

 } catch (error) {

  console.error(error)

  res.status(500).json({
   error: "Failed to fetch commentary"
  })

 }

})

/* -------------------------------
   START SERVER
--------------------------------*/

app.listen(PORT, () => {

 console.log("Server running on port " + PORT)

})