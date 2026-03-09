function generate(event){

 const templates=[

  `Bowler runs in... ${event}`,
  `What a moment in the match! ${event}`,
  `Crowd reacting loudly as ${event}`,
  `That could change the game! ${event}`

 ]

 const index=Math.floor(Math.random()*templates.length)

 return templates[index]

}

module.exports={generate}