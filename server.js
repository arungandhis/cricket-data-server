const express = require("express")
const cors = require("cors")

const {getMatches} = require("./cricbuzzScraper")

const app = express()

app.use(cors())

const PORT = process.env.PORT || 3000

app.get("/",(req,res)=>{
 res.json({status:"Cricbuzz Scraper Running"})
})

app.get("/matches", async (req,res)=>{

 const matches = await getMatches()

 res.json(matches)

})

app.listen(PORT,()=>{
 console.log("Server running")
})