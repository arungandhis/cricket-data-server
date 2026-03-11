const { broadcastCommentary } = require("./websocket")
const fetchCommentary = require("./commentaryScraper")

let matchInterval = null

/* TEST MATCH */

function startTestMatch(){

console.log("TEST MATCH started")

if(matchInterval){
clearInterval(matchInterval)
}

matchInterval = setInterval(()=>{

broadcastCommentary({
teams:"India vs Australia",
score:"145/3 (15.4)",
commentary:"Kohli drives through covers for FOUR!"
})

},8000)

}

/* LIVE MATCH */

function startLiveMatch(match){

console.log("LIVE MATCH started:",match.match)

if(matchInterval){
clearInterval(matchInterval)
}

matchInterval = setInterval(async ()=>{

try{

const data = await fetchCommentary(match.link)

if(!data) return

broadcastCommentary({
teams: match.match,
score: data.score,
commentary: data.commentary
})

console.log("Broadcasting:",data.commentary)

}catch(err){

console.log("Match engine error:",err.message)

}

},12000)

}

module.exports = {
startTestMatch,
startLiveMatch
}