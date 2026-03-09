const scraper = require("./cricbuzzScraper")
const commentaryEngine = require("./commentaryEngine")
const websocket = require("./websocket")
const voice = require("./voiceEngine")

let running = false
let currentMatchId = null
let lastCommentary = ""


// start engine
async function start(matchId){

 if(running){
  console.log("Engine already running")
  return
 }

 running = true
 currentMatchId = matchId

 console.log("Starting match engine for:",matchId)

 runLoop()

}


// main loop
async function runLoop(){

 while(running){

  try{

   const data = await scraper.fetchCommentary(currentMatchId)

   const latestEvent = extractLatestEvent(data)

   if(!latestEvent){
    await sleep(5000)
    continue
   }

   if(latestEvent === lastCommentary){
    await sleep(4000)
    continue
   }

   lastCommentary = latestEvent

   const aiLine = commentaryEngine.generate(latestEvent)

   console.log("AI Commentary:",aiLine)

   // send to overlay
   websocket.broadcast(aiLine)

   // generate voice commentary
   voice.speak(aiLine)

  }
  catch(err){

   console.log("Match engine error:",err)

  }

  await sleep(6000)

 }

}


// extract newest commentary
function extractLatestEvent(data){

 if(Array.isArray(data) && data.length>0){
  return data[0]
 }

 return null

}


// stop engine
function stop(){

 running = false
 currentMatchId = null

 console.log("Match engine stopped")

}


// delay helper
function sleep(ms){

 return new Promise(resolve=>setTimeout(resolve,ms))

}


module.exports = {
 start,
 stop
}