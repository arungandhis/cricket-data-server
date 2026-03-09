let score = {
 runs:0,
 wickets:0,
 overs:0,
 balls:0
}

function generateBall(){

 const events=[
  {runs:0,text:"Defended back to bowler"},
  {runs:1,text:"Quick single taken"},
  {runs:2,text:"Good running, two runs"},
  {runs:4,text:"Cracking cover drive FOUR"},
  {runs:6,text:"Huge six into the crowd"},
  {runs:"W",text:"OUT! Bowled"}
 ]

 const event = events[Math.floor(Math.random()*events.length)]

 score.balls++

 if(score.balls===6){
  score.overs++
  score.balls=0
 }

 if(event.runs==="W") score.wickets++
 else score.runs+=event.runs

 return {
  over:score.overs+"."+score.balls,
  text:event.text,
  score:score.runs+"/"+score.wickets
 }

}

module.exports={generateBall,score}