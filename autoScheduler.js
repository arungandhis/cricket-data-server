const liveMatchFetcher = require("./liveMatchFetcher")
const matchEngine = require("./matchEngine")

let currentMatch = null

async function checkMatches(){

 try{

  const matches = await liveMatchFetcher.getMatches()

  if(!matches || matches.length === 0){

   console.log("No live matches")

   return

  }

  const firstMatch = matches[0]

  if(!currentMatch){

   console.log("Starting auto broadcast:",firstMatch.match)

   currentMatch = firstMatch.matchId

   matchEngine.start(firstMatch.matchId)

   return

  }

  if(firstMatch.matchId !== currentMatch){

   console.log("Switching match")

   matchEngine.stop()

   currentMatch = firstMatch.matchId

   matchEngine.start(firstMatch.matchId)

  }

 }
 catch(err){

  console.log("Auto scheduler error:",err)

 }

}


// check every 2 minutes
setInterval(checkMatches,120000)

module.exports = { checkMatches }