const axios = require("axios")

let currentMatch = null

async function fetchMatches(){

 try{

  const res = await axios.get(
   "https://cricket-data-server.onrender.com/matches"
  )

  return res.data

 }catch(err){

  console.log("Match fetch error:",err.message)

  return []
 }

}



async function fetchCommentary(matchId){

 try{

  const res = await axios.get(
   `https://cricket-data-server.onrender.com/commentary/${matchId}`
  )

  return res.data

 }catch(err){

  console.log("Commentary fetch error:",err.message)

  return null
 }

}



async function startEngine(io){

 setInterval(async ()=>{

  try{

   if(!currentMatch){

    const matches = await fetchMatches()

    if(matches.length === 0){

     // TEST MODE
     io.emit("commentary",{

      team1:"India 145/3",
      team2:"Australia",

      overs:"16.2",

      batsman1:"Kohli 67 (42)",
      batsman2:"Rahul 21 (14)",

      bowler:"Starc",

      commentary:"Test match commentary running"

     })

     return
    }

    currentMatch = matches[0].matchId
   }



   const data = await fetchCommentary(currentMatch)

   if(!data) return



   const payload = {

    team1: data.team1 || "Team A",
    team2: data.team2 || "Team B",

    overs: data.overs || "",

    batsman1: data.batsman1 || "",
    batsman2: data.batsman2 || "",

    bowler: data.bowler || "",

    commentary: data.commentary || ""

   }



   io.emit("commentary",payload)

  }

  catch(err){

   console.log("Engine error:",err.message)

  }

 },5000)

}



module.exports = { startEngine }