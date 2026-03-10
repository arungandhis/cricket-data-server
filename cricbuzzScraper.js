const axios = require("axios")

// ---------------- FETCH LIVE MATCHES ----------------

async function fetchMatches(){

 try{

  const response = await axios.get(
   "https://www.cricbuzz.com/match-api/v1/liveMatches",
   {
    headers:{
     "User-Agent":"Mozilla/5.0",
     "Referer":"https://www.cricbuzz.com/",
     "Accept":"application/json"
    }
   }
  )

  const data = response.data

  const matches = []

  if(data && data.matches){

   data.matches.forEach(m => {

    const team1 = m.team1?.name || ""
    const team2 = m.team2?.name || ""

    matches.push({
     match: team1 + " vs " + team2,
     matchId: m.matchId
    })

   })

  }

  console.log("Live matches found:",matches.length)

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

  const response = await axios.get(
   `https://www.cricbuzz.com/match-api/v1/commentary/${matchId}`,
   {
    headers:{
     "User-Agent":"Mozilla/5.0",
     "Referer":"https://www.cricbuzz.com/"
    }
   }
  )

  const data = response.data

  const commentary = []

  if(data && data.commentaryList){

   data.commentaryList.forEach(c => {

    if(c.commText){
     commentary.push(c.commText)
    }

   })

  }

  return commentary

 }
 catch(err){

  console.log("Commentary fetch error:",err.message)

  return []

 }

}



// ---------------- FETCH SCOREBOARD ----------------

async function fetchScore(matchId){

 try{

  const response = await axios.get(
   `https://www.cricbuzz.com/match-api/v1/${matchId}`,
   {
    headers:{
     "User-Agent":"Mozilla/5.0",
     "Referer":"https://www.cricbuzz.com/"
    }
   }
  )

  const data = response.data

  const team1 = data?.team1?.name || "Team A"
  const team2 = data?.team2?.name || "Team B"

  const runs = data?.score?.team1Score?.inngs1?.runs || 0
  const wickets = data?.score?.team1Score?.inngs1?.wickets || 0
  const overs = data?.score?.team1Score?.inngs1?.overs || "0"

  return {

   team1: team1 + " " + runs + "/" + wickets,
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