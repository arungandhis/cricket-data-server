const express = require("express")
const cors = require("cors")
const http = require("http")
const WebSocket = require("ws")

const liveMatchFetcher = require("./liveMatchFetcher")
const matchEngine = require("./matchEngine")
const autoScheduler = require("./autoScheduler")

const path = require("path")

const app = express()

app.use(cors())
app.use(express.json())

// serve admin + overlay UI
app.use(express.static("public"))

const PORT = process.env.PORT || 3000


// ---------------- SERVER STATUS ----------------

app.get("/",(req,res)=>{

 res.json({
  status:"AI Cricket Broadcast Engine Running"
 })

})


// ---------------- FETCH MATCHES ----------------

app.get("/matches", async (req,res)=>{

 try{

  const matches = await liveMatchFetcher.getMatches()

  res.json(matches)

 }
 catch(err){

  console.log("Match fetch error:",err)

  res.json([])

 }

})


// ---------------- START MATCH ----------------

app.post("/start",(req,res)=>{

 const {matchId} = req.body

 if(!matchId){

  return res.status(400).json({error:"matchId required"})

 }

 matchEngine.start(matchId)

 res.json({
  status:"Match commentary started",
  matchId
 })

})


// ---------------- STOP MATCH ----------------

app.post("/stop",(req,res)=>{

 matchEngine.stop()

 res.json({
  status:"Match stopped"
 })

})


// ---------------- AUDIO ENDPOINT ----------------

app.get("/broadcast/audio",(req,res)=>{

 const audioFile = path.join(__dirname,"public","commentary.mp3")

 res.sendFile(audioFile)

})


// ---------------- HTTP SERVER ----------------

const server = http.createServer(app)


// ---------------- WEBSOCKET ----------------

const wss = new WebSocket.Server({server})

let clients = []

wss.on("connection",(ws)=>{

 console.log("Overlay connected")

 clients.push(ws)

 ws.on("close",()=>{

  clients = clients.filter(c=>c!==ws)

 })

})


// broadcast helper
function broadcast(message){

 clients.forEach(client=>{

  if(client.readyState === WebSocket.OPEN){

   client.send(message)

  }

 })

}

// make broadcast usable in other files
require("./websocket").setBroadcast(broadcast)


// ---------------- START SERVER ----------------

server.listen(PORT,()=>{

 console.log("Server running on port",PORT)

 // start auto match scheduler
 autoScheduler.checkMatches()

})