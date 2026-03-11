const { broadcastCommentary } = require("./websocket")
const fetchCommentary = require("./commentaryScraper")
const generateAudio = require("./ttsEngine")

let matchInterval = null
let lastCommentary = null

function startLiveMatch(match){

console.log("Launching LIVE MATCH engine")

if(matchInterval){
clearInterval(matchInterval)
}

/* BUILD CRICBUZZ URL */


const matchUrl =
"https://www.cricbuzz.com/live-cricket-scores/" +
match.matchId +
"/commentary"


console.log("LIVE MATCH started:", matchUrl)

lastCommentary = null

matchInterval = setInterval(async ()=>{

try{

const data = await fetchCommentary(matchUrl)

if(!data){
console.log("No commentary data")
return
}

let commentary = data.commentary
let score = data.score

if(!commentary || commentary.trim()===""){
console.log("Skipping empty commentary")
return
}

/* PREVENT DUPLICATES */

if(commentary === lastCommentary){
console.log("Duplicate commentary ignored")
return
}

lastCommentary = commentary

let audio = null

try{
audio = await generateAudio(commentary)
}catch(e){
console.log("Audio generation failed:",e.message)
}

broadcastCommentary({
teams: match.match || "Live Match",
score: score || "",
commentary: commentary,
batsmen: data.batsmen || [],
bowler: data.bowler || "",
audio: audio
})

console.log("Broadcasting:", commentary)

}catch(err){

console.log("Match engine error:", err.message)

}

},10000)

}

module.exports = {
startLiveMatch
}