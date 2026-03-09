const WebSocket = require("ws")

function initWebsocket(server){

 const wss = new WebSocket.Server({server})

 wss.on("connection",(ws)=>{

  console.log("Viewer connected")

 })

 return wss
}

module.exports = {initWebsocket}