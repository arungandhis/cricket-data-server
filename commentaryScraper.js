const axios = require("axios")

async function fetchCommentary(url){

try{

/* EXTRACT MATCH ID */

const parts = url.split("/")
let matchId = parts.find(p => /^\d+$/.test(p))

if(!matchId){
console.log("Invalid match id")
return null
}

/* CORRECT CRICBUZZ API */

const api =
"https://www.cricbuzz.com/mcenter/v1/" +
matchId +
"/commentary"

const response = await axios.get(api,{
headers:{
"User-Agent":"Mozilla/5.0",
"Accept":"application/json"
}
})

const data = response.data

if(!data || !data.commentaryList || data.commentaryList.length === 0){

console.log("No commentary in API")

return null
}

/* LATEST BALL */

const latest = data.commentaryList[0]

const commentary = latest.commText || ""

/* SCORE */

let score = ""

if(data.miniscore){

score =
data.miniscore.totalRuns +
"/" +
data.miniscore.wickets +
" (" +
data.miniscore.overs +
")"

}

/* BATSMEN */

let batsmen = []

if(data.miniscore?.batsmanStriker){
batsmen.push(
data.miniscore.batsmanStriker.name +
" " +
data.miniscore.batsmanStriker.runs +
"(" +
data.miniscore.batsmanStriker.balls +
")"
)
}

if(data.miniscore?.batsmanNonStriker){
batsmen.push(
data.miniscore.batsmanNonStriker.name +
" " +
data.miniscore.batsmanNonStriker.runs +
"(" +
data.miniscore.batsmanNonStriker.balls +
")"
)
}

/* BOWLER */

let bowler = ""

if(data.miniscore?.bowlerStriker){
bowler =
data.miniscore.bowlerStriker.name +
" " +
data.miniscore.bowlerStriker.wickets +
"/" +
data.miniscore.bowlerStriker.runs
}

return {
commentary,
score,
batsmen,
bowler
}

}catch(err){

console.log("Commentary API error:",err.message)

return null

}

}

module.exports = fetchCommentary