const express = require("express")
const WebSocket = require("ws")
const path = require("path")

const startEngine = require("./matchEngine")
const scrapeMatches = require("./cricbuzzScraper")

const app = express()

app.use(express.json())

// serve admin + overlay files
app.use(express.static("public"))


// GET MATCHES FOR ADMIN UI
app.get("/matches", async (req, res) => {

  try {

    const matches = await scrapeMatches()

    res.json(matches)

  } catch (err) {

    console.log("Match fetch error:", err.message)

    res.json([])

  }

})


// start http server
const server = app.listen(process.env.PORT || 3000, () => {
  console.log("Server running")
})


// WEBSOCKET
const wss = new WebSocket.Server({ server })


wss.on("connection", (ws) => {

  console.log("Overlay connected")

})


// broadcast helper
function broadcast(data) {

  wss.clients.forEach(client => {

    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data))
    }

  })

}


// start commentary engine
startEngine(broadcast)