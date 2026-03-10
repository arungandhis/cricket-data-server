const express = require("express")
const http = require("http")
const cors = require("cors")
const path = require("path")

const { startWebSocket } = require("./websocket")
const { startLiveMatch, startTestMatch } = require("./matchEngine")
const fetchMatches = require("./cricbuzzScraper")

const app = express()
app.use(cors())
app.use(express.json())

const server = http.createServer(app)

startWebSocket(server)

/* SERVE ADMIN + OVERLAY */

app.use(express.static(path.join(__dirname, "public")))

app.get("/test-commentary",(req,res)=>{

broadcastCommentary({
teams:"India vs Australia",
score:"120/3 (14.2)",
commentary:"Kohli drives through covers for FOUR!"
})

res.send("sent")

})



/* GET MATCHES */

app.get("/matches", async (req, res) => {

  try {

    const matches = await fetchMatches()

    const testMatch = {
      match: "TEST MATCH",
      matchId: "test-match",
      link: "test"
    }

    res.json([testMatch, ...matches])

  } catch (err) {

    console.log("Match fetch error:", err.message)

    res.json([
      {
        match: "TEST MATCH",
        matchId: "test-match",
        link: "test"
      }
    ])

  }

})

/* START MATCH */

app.post("/start-match", (req, res) => {

  const match = req.body

  console.log("Starting match:", match)

  if (match.link === "test") {

    startTestMatch()

  } else {

    startLiveMatch(match)

  }

  res.json({ status: "started" })

})

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
  console.log("Server running on port", PORT)
})