const axios = require("axios")

// ---------------- FETCH MATCHES ----------------

async function fetchMatches(){

 try{

  const url = "https://www.cricbuzz.com/api/cricket-match/live-scores"

  const response = await axios.get(url,{
   headers:{
    "User-Agent":"Mozilla/5.0",
    "Accept":"application/json"
   }
  })

  const data = response.data

  const matches = []

  if(data && data.typeMatches){

   data.typeMatches.forEach(type => {

    type.seriesMatches.forEach(series => {

     if(series.seriesAdWrapper && series.seriesAdWrapper.matches){

      series.seriesAdWrapper.matches.forEach(match => {

       if(match.matchInfo){

        const info = match.matchInfo

        const team1 = info.team1?.teamSName || ""
        const team2 = info.team2?.teamSName || ""

        matches.push({
         match: team1 + " vs " + team2,
         matchId: info.matchId
        })

       }

      })

     }

    })

   })

  }

  console.log("Live matches found:", matches.length)

  return matches

 }
 catch(err){

  console.log("Live match fetch error:", err.message)

  return []

 }

}


// ---------------- FETCH COMMENTARY ----------------

async function fetchCommentary(matchId){

 try{

  const url =
   "https://www.cricbuzz.com/api/cricket-match/commentary/" + matchId

  const response = await axios.get(url,{
   headers:{
    "User-Agent":"Mozilla/5.0"
   }
  })

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

  console.log("Commentary fetch error:", err.message)

  return []

 }

}


// ---------------- FETCH SCORE ----------------

async function fetchScore(matchId){

 try{

  const url =
   "https://www.cricbuzz.com/api/cricket-match/" + matchId

  const response = await axios.get(url,{
   headers:{
    "User-Agent":"Mozilla/5.0"
   }
  })

  const data = response.data

  const team1 = data?.team1?.teamSName || "Team A"
  const team2 = data?.team2?.teamSName || "Team B"

  const score = data?.score?.team1Score?.inngs1?.runs || 0
  const wickets = data?.score?.team1Score?.inngs1?.wickets || 0
  const overs = data?.score?.team1Score?.inngs1?.overs || "0"

  return {
   team1: team1 + " " + score + "/" + wickets,
   team2: team2,
   overs: overs
  }

 }
 catch(err){

  console.log("Score fetch error:", err.message)

  return null

 }

}


module.exports = {
 fetchMatches,
 fetchCommentary,
 fetchScore
}