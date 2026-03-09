const express = require("express")
const cors = require("cors")

const {getMatches} = require("./scraper")
const {generateCommentary} = require("./commentaryEngine")
const {startStream} = require("./streamEngine")

const app = express()

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3000


app.get("/",(req,res)=>{
 res.json({status:"AI Cricket Broadcast Engine V6"})
})


app.get("/matches", async(req,res)=>{

 const matches = await getMatches()

 res.json(matches)

})


app.post("/start-stream", async(req,res)=>{

 const {matchId,streamKey} = req.body

 await startStream(matchId,streamKey)

 res.json({status:"Streaming started"})
})


app.listen(PORT,()=>{
 console.log("Broadcast engine running")
})