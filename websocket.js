let clients = []

function init(wss){

 wss.on("connection",(ws)=>{

  console.log("Overlay connected")

  clients.push(ws)

  ws.on("close",()=>{

   clients = clients.filter(c => c !== ws)

  })

 })

}


function send(data){

 const msg = JSON.stringify(data)

 clients.forEach(ws=>{

  ws.send(msg)

 })

}


module.exports = {
 init,
 send
}