const fetchMatches = require("./cricbuzzScraper")
const { startLiveMatch } = require("./matchEngine")

let runningMatch = null

async function autoDetectMatches(){

console.log("Auto match detector running")

setInterval(async ()=>{

try{

const matches = await fetchMatches()

const liveMatch = matches.find(m => m.match.includes("LIVE"))

if(!liveMatch){

console.log("No live matches currently")

return

}

if(runningMatch && runningMatch.matchId === liveMatch.matchId){

return
}

runningMatch = liveMatch

console.log("New live match detected:",liveMatch.match)

startLiveMatch(liveMatch)

}catch(err){

console.log("Auto detect error:",err.message)

}

},30000)

}

module.exports = autoDetectMatches