const scraper = require("./cricbuzzScraper")
const commentaryEngine = require("./commentaryEngine")

let running=false

async function start(matchId){

 running=true

 while(running){

  const data = await scraper.fetchCommentary(matchId)

  const line = commentaryEngine.generate(data)

  console.log("COMMENTARY:",line)

  await new Promise(r=>setTimeout(r,5000))

 }

}

function stop(){
 running=false
}

module.exports = { start, stop }