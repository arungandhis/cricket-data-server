const express = require("express")
const cors = require("cors")

const liveMatchFetcher = require("./liveMatchFetcher")
const matchEngine = require("./matchEngine")

const app = express()

app.use(cors())
app.use(express.json())

// serve admin + overlay
app.use(express.static("public"))

const PORT = process.env.PORT || 3000


// Server status
app.get("/", (req,res)=>{
 res.json({status:"AI Cricket Broadcast Engine Running"})
})


// Fetch matches
app.get("/matches", async (req,res)=>{

 try{

  const matches = await liveMatchFetcher.getMatches()

  res.json(matches)

 }
 catch(err){

  console.log("MATCH ERROR:",err)

  res.json([])

 }

})


// Start commentary
app.post("/start",(req,res)=>{

 const {matchId} = req.body

 matchEngine.start(matchId)

 res.json({status:"Match started"})

})


// Stop commentary
app.post("/stop",(req,res)=>{

 matchEngine.stop()

 res.json({status:"Match stopped"})

})


app.listen(PORT,()=>{
 console.log("Server running on port",PORT)
})