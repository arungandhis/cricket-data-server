const express = require("express")
const http = require("http")
const WebSocket = require("ws")
const bodyParser = require("body-parser")
const path = require("path")

const scraper = require("./cricbuzzScraper")
const matchEngine = require("./matchEngine")
const websocket = require("./websocket")

const app = express()

app.use(bodyParser.json())

app.use(express.static(path.join(__dirname,"public")))

const server = http.createServer(app)

const wss = new WebSocket.Server({server})

websocket.init(wss)


// GET LIVE MATCHES
app.get("/matches", async (req,res)=>{

 const matches = await scraper.fetchMatches()

 matches.unshift({
  match:"TEST MATCH - India vs Australia",
  matchId:"test-match"
 })

 res.json(matches)

})


// START MATCH
app.post("/startMatch",(req,res)=>{

 const matchId = req.body.matchId

 console.log("Starting match:",matchId)

 matchEngine.start(matchId)

 res.json({status:"started"})

})


// STOP MATCH
app.post("/stopMatch",(req,res)=>{

 matchEngine.stop()

 res.json({status:"stopped"})

})


// TEST COMMENTARY ENDPOINT
app.get("/testCommentary",(req,res)=>{

 websocket.send({

  commentary:"Kohli smashes that for four!",
  team1:"India 145/3",
  team2:"Australia",
  overs:"16.2",
  batsman1:"Kohli 67 (42)",
  batsman2:"Rahul 21 (14)",
  bowler:"Starc"

 })

 res.send("sent")

})


const PORT = process.env.PORT || 3000

server.listen(PORT,()=>{

 console.log("Server running on port",PORT)

})