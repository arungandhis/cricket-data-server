const axios = require("axios")
const cheerio = require("cheerio")

// ---------------- FETCH MATCHES ----------------

async function fetchMatches(){

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

  $(".cb-mtch-lst").each((i,el)=>{

   const match = $(el).find(".cb-lv-scr-mtch-hdr").text().trim()

   const link = $(el).find("a").attr("href")

   if(match && link){

    const parts = link.split("/")

    const matchId = parts[3]

    matches.push({
     match:match,
     matchId:matchId
    })

   }

  })

  console.log("Matches found:",matches.length)

  return matches

 }
 catch(err){

  console.log("Match fetch error:",err)

  return []

 }

}


// ---------------- FETCH COMMENTARY ----------------

async function fetchCommentary(matchId){

 try{

  const url = "https://www.cricbuzz.com/api/html/cricket-match-commentary/" + matchId

  const response = await axios.get(url,{
   headers:{
    "User-Agent":"Mozilla/5.0"
   }
  })

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

  console.log("Commentary fetch error:",err)

  return []

 }

}


// ---------------- FETCH SCORE ----------------

async function fetchScore(matchId){

 try{

  const url = "https://www.cricbuzz.com/live-cricket-scores/" + matchId

  const response = await axios.get(url,{
   headers:{
    "User-Agent":"Mozilla/5.0"
   }
  })

  const html = response.data

  const $ = cheerio.load(html)

  const team1 = $(".cb-min-tm").first().text().trim()

  const team2 = $(".cb-min-tm").eq(1).text().trim()

  const score = $(".cb-font-20.text-bold").first().text().trim()

  const overs = $(".cb-font-12").first().text().trim()

  return{

   team1: team1 + " " + score,
   team2: team2,
   overs: overs

  }

 }
 catch(err){

  console.log("Score fetch error:",err)

  return null

 }

}


module.exports = {
 fetchMatches,
 fetchCommentary,
 fetchScore
}