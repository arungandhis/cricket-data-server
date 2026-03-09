const scraper = require("./cricbuzzScraper")
const commentaryEngine = require("./commentaryEngine")
const websocket = require("./websocket")

let running = false
let currentMatchId = null
let lastCommentary = ""


// Start match engine
async function start(matchId){

 if(running){
  console.log("Match engine already running")
  return
 }

 console.log("Starting match engine for:", matchId)

 running = true
 currentMatchId = matchId

 runLoop()

}


// Main commentary loop
async function runLoop(){

 while(running){

  try{

   const data = await scraper.fetchCommentary(currentMatchId)

   if(!data){
    await sleep(5000)
    continue
   }

   const latestEvent = extractLatestEvent(data)

   if(!latestEvent){
    await sleep(5000)
    continue
   }

   // Prevent repeating same commentary
   if(latestEvent === lastCommentary){
    await sleep(4000)
    continue
   }

   lastCommentary = latestEvent

   const aiLine = commentaryEngine.generate(latestEvent)

   console.log("AI COMMENTARY:", aiLine)

   websocket.broadcast(aiLine)

  }
  catch(err){

   console.log("Match engine error:", err.message)

  }

  await sleep(5000)

 }

}


// Extract newest commentary line
function extractLatestEvent(data){

 if(Array.isArray(data) && data.length > 0){

  return data[0]

 }

 if(data.commentary){

  return data.commentary[0]

 }

 return null

}


// Stop match engine
function stop(){

 console.log("Stopping match engine")

 running = false
 currentMatchId = null

}


// Utility delay
function sleep(ms){

 return new Promise(resolve => setTimeout(resolve, ms))

}


module.exports = {
 start,
 stop
}