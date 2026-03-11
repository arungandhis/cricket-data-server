const WebSocket = require("ws")

let wss

function startWebSocket(server){

wss = new WebSocket.Server({ server })

wss.on("connection", (ws) => {

console.log("Overlay connected")

})

}

function broadcastCommentary(data){

if(!wss){
console.log("WebSocket not initialized")
return
}

console.log("Broadcasting to overlays:", data)

const message = JSON.stringify(data)

wss.clients.forEach(client => {

if(client.readyState === WebSocket.OPEN){
client.send(message)
}

})

}

module.exports = {
startWebSocket,
broadcastCommentary
}