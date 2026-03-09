let broadcastFunction = null


// called by server.js to register broadcast function
function setBroadcast(fn){

 broadcastFunction = fn

}


// send data to all connected overlay clients
function send(data){

 if(!broadcastFunction){
  console.log("Broadcast not initialized")
  return
 }

 try{

  broadcastFunction(JSON.stringify(data))

 }
 catch(err){

  console.log("WebSocket send error:",err)

 }

}


module.exports = {
 setBroadcast,
 send
}