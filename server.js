const express = require("express")
const axios = require("axios")
const cheerio = require("cheerio")
const cors = require("cors")

const app = express()
app.use(cors())

const PORT = process.env.PORT || 3000


// ROOT
app.get("/", (req,res)=>{
  res.json({status:"Cricket server running"})
})


// SCRAPE MATCHES
app.get("/matches", async (req,res)=>{

 try{

  const url = "https://www.cricbuzz.com/cricket-match/live-scores"

  const response = await axios.get(url,{
   headers:{
    "User-Agent":"Mozilla/5.0"
   }
  })

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

  console.log(err)

  res.status(500).json({
   error:"Failed to scrape matches"
  })

 }

})


app.listen(PORT, ()=>{
 console.log("Server started on port "+PORT)
})