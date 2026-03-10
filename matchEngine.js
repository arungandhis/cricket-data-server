const scraper = require("./cricbuzzScraper")
const commentaryEngine = require("./commentaryEngine")
const websocket = require("./websocket")
const voice = require("./voiceEngine")

let running = false
let currentMatchId = null
let lastCommentary = ""

let testIndex = 0


// start commentary engine
async function start(matchId){

 if(running){
  console.log("Match engine already running")
  return
 }

 running = true
 currentMatchId = matchId

 console.log("Starting match engine for:",matchId)

 runLoop()

}


// main engine loop
async function runLoop(){

 while(running){

  try{

   let latestEvent
   let scoreData


   // ---------------- TEST MATCH MODE ----------------
   if(currentMatchId === "test-match"){

    latestEvent = getTestCommentary()

    scoreData = {
     team1: "India 145/3",
     team2: "Australia",
     overs: "16.2"
    }

   }
   else{

    // get commentary
    const data = await scraper.fetchCommentary(currentMatchId)

    latestEvent = extractLatestEvent(data)

    // get scoreboard
    scoreData = await scraper.fetchScore(currentMatchId)

   }


   if(!latestEvent){
    await sleep(5000)
    continue
   }

   if(latestEvent === lastCommentary){
    await sleep(4000)
    continue
   }


   lastCommentary = latestEvent


   // generate AI commentary
   const aiLine = commentaryEngine.generate(latestEvent)

   console.log("AI Commentary:",aiLine)


   // prepare overlay data
   const scoreboard = {

    commentary: aiLine,
    team1: scoreData?.team1 || "Team A",
    team2: scoreData?.team2 || "Team B",
    overs: scoreData?.overs || "0.0"

   }


   // send to overlay
   websocket.send(scoreboard)


   // generate voice commentary
   voice.speak(aiLine)


  }
  catch(err){

   console.log("Match engine error:",err)

  }

  await sleep(6000)

 }

}


// extract newest commentary from scraper
function extractLatestEvent(data){

 if(Array.isArray(data) && data.length > 0){
  return data[0]
 }

 return null

}


// generate test commentary
function getTestCommentary(){

 const lines = [

  "Kohli drives beautifully through cover for four",
  "Bumrah steaming in from the pavilion end",
  "Huge six over long on!",
  "What a catch at long off!",
  "Single taken to deep square leg",
  "Starc bowls a perfect yorker",
  "Brilliant cover drive for four runs"

 ]

 const line = lines[testIndex]

 testIndex++

 if(testIndex >= lines.length){
  testIndex = 0
 }

 return line

}


// stop engine
function stop(){

 running = false
 currentMatchId = null

 console.log("Match engine stopped")

}


// delay helper
function sleep(ms){
 return new Promise(resolve => setTimeout(resolve,ms))
}


module.exports = {
 start,
 stop
}