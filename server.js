const express = require("express");
const cors = require("cors");

const {getMatches} = require("./matchFetcher");
const {generateEvent} = require("./commentaryEngine");

const app = express();

app.use(cors());
app.use(express.json());

let selectedMatch = null;
let commentary = [];

app.get("/",(req,res)=>{
 res.json({status:"Broadcast Engine Running"});
});

app.get("/matches",async(req,res)=>{
 const matches = await getMatches();
 res.json(matches);
});

app.post("/admin/select-match",(req,res)=>{
 selectedMatch = req.body.matchId;
 commentary = [];

 res.json({
  message:"Match selected",
  match:selectedMatch
 });
});

app.post("/commentary/generate",(req,res)=>{

 const event = generateEvent();

 commentary.push(event);

 res.json({event:event});

});

app.get("/commentary/live",(req,res)=>{
 res.json({
  match:selectedMatch,
  feed:commentary
 });
});

app.listen(process.env.PORT || 3000,()=>{
 console.log("Broadcast engine started");
});