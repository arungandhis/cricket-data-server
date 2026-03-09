const express = require("express")
const cors = require("cors")

const liveMatchFetcher = require("./liveMatchFetcher")
const matchEngine = require("./matchEngine")
const commentaryEngine = require("./commentaryEngine")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static("public"))

const PORT = process.env.PORT || 3000


// Server check
app.get("/", (req,res)=>{
 res.json({status:"AI Cricket Broadcast Engine Running"})
})


// Get matches
app.get("/matches", async (req,res)=>{

 const matches = await liveMatchFetcher.getMatches()

 res.json(matches)

})


// Start match commentary
app.post("/start", async (req,res)=>{

 const {matchId} = req.body

 matchEngine.start(matchId)

 res.json({status:"Match started"})

})


// Stop match
app.post("/stop",(req,res)=>{

 matchEngine.stop()

 res.json({status:"Match stopped"})

})


app.listen(PORT,()=>{
 console.log("Server running on port "+PORT)
})