const express = require("express")
const axios = require("axios")
const cheerio = require("cheerio")
const cors = require("cors")

const app = express()
app.use(cors())

const PORT = process.env.PORT || 3000


app.get("/", (req,res)=>{
 res.json({status:"Cricket server running"})
})


app.get("/matches", async (req,res)=>{

 try{

  const response = await axios.get(
   "https://www.cricbuzz.com/cricket-match/live-scores",
   {
    headers:{
     "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
     "Accept":
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
     "Accept-Language":"en-US,en;q=0.9",
     "Connection":"keep-alive",
     "Upgrade-Insecure-Requests":"1"
    }
   }
  )

  const html = response.data

  const $ = cheerio.load(html)

  const matches = []

  $("a[href*='/live-cricket-scores/']").each((i,el)=>{

   const title = $(el).text().trim()

   const link = $(el).attr("href")

   if(title.includes("vs")){

    const matchId = link.split("/")[3]

    matches.push({
     match:title,
     matchId:matchId,
     link:"https://www.cricbuzz.com"+link
    })

   }

  })

  res.json(matches)

 }catch(err){

  console.log(err.message)

  res.status(500).json({
   error:"Failed to fetch matches",
   message:err.message
  })

 }

})


app.listen(PORT, ()=>{
 console.log("Server started on port "+PORT)
})