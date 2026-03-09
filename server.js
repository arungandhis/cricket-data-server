const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

let selectedMatch = null;
let commentaryFeed = [];

let score = {
 team1:"India",
 team2:"Australia",
 runs:0,
 wickets:0,
 overs:0,
 balls:0
};

let engineRunning = false;
let interval = null;

function generateBallEvent(){

 const events = [
  {type:"dot",text:"Good length delivery, defended"},
  {type:"1",text:"Worked to mid wicket for a single"},
  {type:"2",text:"Driven into the gap for two runs"},
  {type:"4",text:"Beautiful cover drive, FOUR!"},
  {type:"6",text:"Massive hit over long on, SIX!"},
  {type:"w",text:"OUT! Clean bowled!"}
 ];

 const event = events[Math.floor(Math.random()*events.length)];

 score.balls++;

 if(score.balls===6){
  score.overs++;
  score.balls=0;
 }

 if(event.type==="1") score.runs+=1;
 if(event.type==="2") score.runs+=2;
 if(event.type==="4") score.runs+=4;
 if(event.type==="6") score.runs+=6;
 if(event.type==="w") score.wickets++;

 return {
  over: score.overs+"."+score.balls,
  text:event.text,
  score: score.runs+"/"+score.wickets
 };

}

function startEngine(){

 if(engineRunning) return;

 engineRunning = true;

 interval = setInterval(()=>{

  const event = generateBallEvent();

  commentaryFeed.push(event);

  if(commentaryFeed.length>50)
   commentaryFeed.shift();

 },6000);

}

function stopEngine(){

 clearInterval(interval);
 engineRunning=false;

}

app.get("/",(req,res)=>{
 res.json({status:"Auto Commentary Engine Running"});
});

app.get("/matches",(req,res)=>{
 res.json([
  {id:"4001",team1:"India",team2:"Australia"},
  {id:"4002",team1:"England",team2:"Pakistan"}
 ]);
});

app.post("/admin/select-match",(req,res)=>{

 selectedMatch = req.body.matchId;

 commentaryFeed=[];
 score.runs=0;
 score.wickets=0;
 score.overs=0;
 score.balls=0;

 res.json({
  message:"Match selected",
  match:selectedMatch
 });

});

app.post("/admin/start",(req,res)=>{

 startEngine();

 res.json({message:"Commentary engine started"});

});

app.post("/admin/stop",(req,res)=>{

 stopEngine();

 res.json({message:"Engine stopped"});

});

app.get("/commentary/live",(req,res)=>{

 res.json({
  match:selectedMatch,
  score:score,
  feed:commentaryFeed
 });

});

app.listen(PORT,()=>{

 console.log("Auto commentary engine started");

});