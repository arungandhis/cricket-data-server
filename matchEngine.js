const { broadcastCommentary } = require("./websocket")
const fetchCommentary = require("./commentaryScraper")
const generateAudio = require("./ttsEngine")

let matchInterval = null
let lastCommentary = null

/* TEST MATCH */

function startTestMatch(){

console.log("TEST MATCH started")

if(matchInterval){
clearInterval(matchInterval)
}

matchInterval = setInterval(async ()=>{

const commentary = "Kohli drives through covers for FOUR!"

if(commentary === lastCommentary){
return
}

lastCommentary = commentary

try{

const audio = await generateAudio(commentary)

broadcastCommentary({
teams:"India vs Australia",
score:"145/3 (15.4)",
commentary:commentary,
audio:audio
})

}catch(err){

console.log("Audio error:",err.message)

broadcastCommentary({
teams:"India vs Australia",
score:"145/3 (15.4)",
commentary:commentary
})

}

},8000)

}

/* LIVE MATCH */

function startLiveMatch(match){

console.log("LIVE MATCH started:",match.match)

if(matchInterval){
clearInterval(matchInterval)
}

lastCommentary = null

matchInterval = setInterval(async ()=>{

try{

const data = await fetchCommentary(match.link)

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

/* PREVENT DUPLICATE COMMENTARY */

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

/* BROADCAST */

broadcastCommentary({
teams:match.match,
score:score || "",
commentary:commentary,
audio:audio
})

console.log("New ball commentary:",commentary)

}catch(err){

console.log("Match engine error:",err.message)

}

},10000)

}

module.exports = {
startTestMatch,
startLiveMatch
}