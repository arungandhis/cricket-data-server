const axios = require("axios")
const cheerio = require("cheerio")

// Browser-like headers to avoid 403
const headers = {
 "User-Agent":
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
 "Accept":
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
 "Accept-Language": "en-US,en;q=0.9",
 "Connection": "keep-alive",
 "Referer": "https://www.cricbuzz.com/"
}



// ---------------- FETCH LIVE MATCHES ----------------

async function fetchMatches(){

 try{

  const url =
   "https://www.cricbuzz.com/cricket-match/live-scores"

  const response = await axios.get(url,{ headers })

  const html = response.data

  const $ = cheerio.load(html)

  const matches = []

  $("a[href*='/live-cricket-scores/']").each((i,el)=>{

   const link = $(el).attr("href")

   const text = $(el).text().trim()

   if(link && text){

    const parts = link.split("/")

    const matchId = parts[2]

    matches.push({
     match:text,
     matchId:matchId
    })

   }

  })

  console.log("Matches scraped:",matches.length)

  return matches

 }
 catch(err){

  console.log("Match fetch error:",err.message)

  return []

 }

}



// ---------------- FETCH COMMENTARY ----------------

async function fetchCommentary(matchId){

 try{

  const url =
   `https://www.cricbuzz.com/live-cricket-scores/${matchId}`

  const response = await axios.get(url,{ headers })

  const html = response.data

  const $ = cheerio.load(html)

  const commentary = []

  $(".commtext").each((i,el)=>{

   const text = $(el).text().trim()

   if(text){
    commentary.push(text)
   }

  })

  return commentary

 }
 catch(err){

  console.log("Commentary fetch error:",err.message)

  return []

 }

}



// ---------------- FETCH SCORE ----------------

async function fetchScore(matchId){

 try{

  const url =
   `https://www.cricbuzz.com/live-cricket-scores/${matchId}`

  const response = await axios.get(url,{ headers })

  const html = response.data

  const $ = cheerio.load(html)

  const team1 = $(".cb-min-tm").first().text().trim()

  const team2 = $(".cb-min-tm").eq(1).text().trim()

  const score = $(".cb-font-20.text-bold").first().text().trim()

  const overs = $(".cb-font-12").first().text().trim()

  return {

   team1: team1 + " " + score,
   team2: team2,
   overs: overs

  }

 }
 catch(err){

  console.log("Score fetch error:",err.message)

  return null

 }

}


module.exports = {
 fetchMatches,
 fetchCommentary,
 fetchScore
}