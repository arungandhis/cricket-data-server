function generateEvent(){

 const events = [

 "Bowler begins run up",

 "Full delivery outside off",

 "Batsman drives through covers",

 "Ball races to boundary",

 "Huge six over mid wicket",

 "Crowd roaring",

 "Brilliant yorker",

 "Clean bowled!"

 ];

 return events[Math.floor(Math.random()*events.length)];

}

module.exports = {generateEvent};