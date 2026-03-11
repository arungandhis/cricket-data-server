const fetchMatches = require("./cricbuzzScraper")
const { startLiveMatch } = require("./matchEngine")

let currentMatchId = null

async function autoDetectMatches(){

setInterval(async ()=>{

try{

const matches = await fetchMatches()

if(!matches || matches.length === 0){
console.log("No live matches")
return
}

const liveMatch = matches[0]

if(currentMatchId !== liveMatch.matchId){

console.log("New match detected:", liveMatch.match)

currentMatchId = liveMatch.matchId

startLiveMatch(liveMatch)

}

}catch(err){

console.log("Auto detect error:",err.message)

}

},60000)

}

module.exports = autoDetectMatches