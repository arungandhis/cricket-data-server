const scraper = require("./cricbuzzScraper")

async function getMatches(){

 try{

  const matches = await scraper.fetchMatches()

  if(matches && matches.length > 0){
   return matches
  }

  // fallback test match
  return [
   {
    match:"TEST MATCH - India vs Australia",
    matchId:"test-match"
   }
  ]

 }
 catch(err){

  console.log("Match fetch error:",err)

  return [
   {
    match:"TEST MATCH - India vs Australia",
    matchId:"test-match"
   }
  ]

 }

}

module.exports = { getMatches }