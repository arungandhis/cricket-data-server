const { broadcastCommentary } = require("./websocket")
const fetchCommentary = require("./commentaryScraper")
const generateAudio = require("./ttsEngine")

let matchInterval = null

/* TEST MATCH */

function startTestMatch(){

console.log("TEST MATCH started")

if(matchInterval){
clearInterval(matchInterval)
}

matchInterval = setInterval(async ()=>{

const commentary = "Kohli drives beautifully through covers for FOUR"

const audio = await generateAudio(commentary)

broadcastCommentary({
teams:"India vs Australia",
score:"145/3 (15.4)",
commentary:commentary,
audio:audio
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

const audio = await generateAudio(data.commentary)

broadcastCommentary({
teams: match.match,
score: data.score,
commentary: data.commentary,
audio: audio
})

console.log("Voice commentary:",data.commentary)

}catch(err){

console.log("Match engine error:",err.message)

}

},12000)

}

module.exports = {
startTestMatch,
startLiveMatch
}