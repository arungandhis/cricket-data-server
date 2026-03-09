const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

let selectedMatch = null;
let commentaryFeed = [];

app.get("/", (req,res)=>{
 res.json({status:"Cricket Broadcast Server Running"});
});

/* MATCH LIST */
app.get("/matches",(req,res)=>{
 res.json([
  {id:"2001",team1:"India",team2:"Australia"},
  {id:"2002",team1:"England",team2:"Pakistan"},
  {id:"2003",team1:"New Zealand",team2:"South Africa"}
 ]);
});

/* ADMIN SELECT MATCH */
app.post("/admin/select-match",(req,res)=>{
 selectedMatch = req.body.matchId;

 commentaryFeed = [];

 res.json({
  message:"Match selected",
  matchId:selectedMatch
 });
});

/* GENERATE COMMENTARY (TEST MODE) */
app.post("/commentary/generate",(req,res)=>{

 const events = [
  "Bowler starts run up",
  "Good length delivery",
  "Batsman drives through covers",
  "Ball racing to the boundary",
  "Huge six over long on",
  "Crowd going wild",
  "Brilliant yorker",
  "Wicket! Clean bowled"
 ];

 const event = events[Math.floor(Math.random()*events.length)];

 commentaryFeed.push(event);

 res.json({
  event:event
 });

});

/* LIVE COMMENTARY FEED */
app.get("/commentary/live",(req,res)=>{
 res.json({
  match:selectedMatch,
  feed:commentaryFeed
 });
});

/* SERVER STATUS */
app.get("/status",(req,res)=>{
 res.json({
  selectedMatch:selectedMatch,
  commentaryCount:commentaryFeed.length
 });
});

app.listen(PORT,()=>{
 console.log("Broadcast server running on "+PORT);
});