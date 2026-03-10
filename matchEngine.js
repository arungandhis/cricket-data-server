const { broadcastCommentary } = require("./websocket")

let matchInterval = null

function startTestMatch(){

console.log("TEST MATCH started")

if(matchInterval){
clearInterval(matchInterval)
}

matchInterval = setInterval(()=>{

const commentaryLines = [

"Kohli drives through covers for FOUR!",
"Starc bowls a perfect yorker!",
"That's smashed for SIX!",
"Brilliant catch at mid wicket!",
"Excellent running between the wickets!"

]

const commentary =
commentaryLines[Math.floor(Math.random()*commentaryLines.length)]

const runs = Math.floor(Math.random()*200)
const wickets = Math.floor(Math.random()*10)
const overs = (Math.random()*20).toFixed(1)

const score = runs + "/" + wickets + " (" + overs + ")"

console.log("Broadcasting test commentary:", commentary)

broadcastCommentary({
teams: "India vs Australia",
score: score,
commentary: commentary
})

},8000)

}

function startLiveMatch(match){

console.log("LIVE MATCH started:", match.match)

if(matchInterval){
clearInterval(matchInterval)
}

matchInterval = setInterval(()=>{

const commentary = "Live update from " + match.match

const runs = Math.floor(Math.random()*200)
const wickets = Math.floor(Math.random()*10)
const overs = (Math.random()*20).toFixed(1)

const score = runs + "/" + wickets + " (" + overs + ")"

broadcastCommentary({
teams: match.match,
score: score,
commentary: commentary
})

},10000)

}

module.exports = {
startTestMatch,
startLiveMatch
}