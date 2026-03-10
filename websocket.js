const WebSocket = require("ws")

let clients = []

function startWebSocket(server) {

  const wss = new WebSocket.Server({ server })

  wss.on("connection", (ws) => {

    console.log("Overlay connected")

    clients.push(ws)

    ws.on("close", () => {

      clients = clients.filter(c => c !== ws)

    })

  })

}

function broadcastCommentary(data) {

  clients.forEach(client => {

    if (client.readyState === WebSocket.OPEN) {

      client.send(JSON.stringify({
        type: "commentary",
        commentary: data.commentary,
        score: data.score,
        teams: data.teams
      }))

    }

  })

}

module.exports = { startWebSocket, broadcastCommentary }