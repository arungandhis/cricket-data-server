const scraper=require("./cricbuzzScraper")
const websocket=require("./websocket")
const commentaryEngine=require("./commentaryEngine")
const voice=require("./voiceEngine")

let running=false
let currentMatchId=null
let lastCommentary=""


async function start(matchId){

 running=true
 currentMatchId=matchId

 runLoop()

}


async function runLoop(){

 while(running){

  try{

   let latestEvent
   let scoreData


   if(currentMatchId==="test-match"){

    latestEvent="Kohli drives beautifully through cover for four"

    scoreData={
     team1:"India 145/3",
     team2:"Australia",
     overs:"16.2",
     batsman1:"Kohli 67 (42)",
     batsman2:"Rahul 21 (14)",
     bowler:"Starc"
    }

   }
   else{

    const commentary=await scraper.fetchCommentary(currentMatchId)

    latestEvent=commentary[0]

    scoreData=await scraper.fetchScore(currentMatchId)

   }


   if(!latestEvent){

    await sleep(5000)
    continue

   }


   if(latestEvent===lastCommentary){

    await sleep(4000)
    continue

   }


   lastCommentary=latestEvent


   const aiLine=commentaryEngine.generate(latestEvent)


   const scoreboard={

    commentary:aiLine,
    team1:scoreData?.team1 || "Team A",
    team2:scoreData?.team2 || "Team B",
    overs:scoreData?.overs || "0.0",
    batsman1:scoreData?.batsman1 || "",
    batsman2:scoreData?.batsman2 || "",
    bowler:scoreData?.bowler || ""

   }


   websocket.send(scoreboard)

   voice.speak(aiLine)

  }
  catch(err){

   console.log("Match engine error:",err)

  }

  await sleep(6000)

 }

}


function stop(){

 running=false
 currentMatchId=null

}


function sleep(ms){
 return new Promise(resolve=>setTimeout(resolve,ms))
}


module.exports={
 start,
 stop
}