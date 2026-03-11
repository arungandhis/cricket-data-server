const WebSocket = require("ws");

let wss = null;

function startWebSocket(server) {
  wss = new WebSocket.Server({ server });

  console.log("WebSocket server started");

  wss.on("connection", (ws) => {
    console.log("Overlay connected");

    ws.on("close", () => {
      console.log("Overlay disconnected");
    });
  });
}

function broadcastCommentary(data) {
  if (!wss) return;

  const msg = JSON.stringify(data);

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}

module.exports = {
  startWebSocket,
  broadcastCommentary
};
