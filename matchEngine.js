const { broadcastCommentary } = require("./websocket")
const generateAudio = require("./ttsEngine")

async function startTestMatch(){

console.log("Starting TEST match")

setInterval(async ()=>{

const commentary = generateRandomCommentary()

const score = generateScore()

try{

const audio = await generateAudio(commentary)

broadcastCommentary({
teams:"India vs Australia",
score:score,
commentary:commentary,
audio:audio
})

}catch(err){

console.log("Audio error:",err.message)

}

},8000)

}

function startLiveMatch(match){

console.log("Starting live match:",match.match)

setInterval(async ()=>{

const commentary = "Live update from "+match.match

const score = generateScore()

try{

const audio = await generateAudio(commentary)

broadcastCommentary({
teams:match.match,
score:score,
commentary:commentary,
audio:audio
})

}catch(err){

console.log("Audio error:",err.message)

}

},10000)

}

function generateScore(){

const runs = Math.floor(Math.random()*200)
const wickets = Math.floor(Math.random()*10)
const overs = (Math.random()*20).toFixed(1)

return runs+"/"+wickets+" ("+overs+")"

}

function generateRandomCommentary(){

const lines = [

"Kohli drives through covers for FOUR!",
"Beautiful yorker from Starc!",
"That's pulled away for SIX!",
"Edge and taken by the keeper!",
"Brilliant running between the wickets!"

]

return lines[Math.floor(Math.random()*lines.length)]

}

module.exports = {
startLiveMatch,
startTestMatch
}