const express = require("express")
const path = require("path")
const WebSocket = require("ws")

const startEngine = require("./matchEngine")

const app = express()

// serve overlay
app.use(express.static("public"))

const server = app.listen(process.env.PORT || 3000, () => {
  console.log("Server running")
})

// WebSocket server
const wss = new WebSocket.Server({ server })

wss.on("connection", (ws) => {
  console.log("Overlay connected")
})

// helper to broadcast to all overlays
function broadcast(data) {

  wss.clients.forEach(client => {

    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data))
    }

  })

}

// start match engine
startEngine(broadcast)