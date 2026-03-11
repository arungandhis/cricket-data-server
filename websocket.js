const WebSocket = require("ws");

let wss = null;

function startWebSocket(server) {
  wss = new WebSocket.Server({ server });

  console.log("WebSocket server started");

  wss.on("connection", (ws) => {
    console.log("Client connected to WebSocket");

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });
}

/**
 * Broadcast commentary + score updates to all connected clients
 * in EXACT format overlay.html expects.
 */
function broadcastCommentary(data) {
  if (!wss) return;

  const message = JSON.stringify(data);

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

module.exports = {
  startWebSocket,
  broadcastCommentary
};
