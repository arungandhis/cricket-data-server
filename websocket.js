const WebSocket = require("ws")

let wss

function startWebSocket(server){

wss = new WebSocket.Server({ server })

wss.on("connection",(ws)=>{

console.log("Overlay connected")

})

}

function broadcastCommentary(data){

if(!wss) return

const payload = JSON.stringify(data)

wss.clients.forEach(client=>{

if(client.readyState === WebSocket.OPEN){

client.send(payload)

}

})

}

module.exports = {
startWebSocket,
broadcastCommentary
}