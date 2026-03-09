const scraper = require("./cricbuzzScraper")

async function getMatches(){

 try{

  console.log("Fetching matches from Cricbuzz...")

  const matches = await scraper.fetchMatches()

  // Always include TEST MATCH first
  const result = [

   {
    match: "TEST MATCH - India vs Australia",
    matchId: "test-match"
   }

  ]

  // If live matches exist, add them
  if(matches && matches.length > 0){

   matches.forEach(m => {

    result.push(m)

   })

  }

  console.log("Total matches returned:", result.length)

  return result

 }
 catch(err){

  console.log("Match fetch error:", err)

  // If scraper fails still return test match
  return [

   {
    match: "TEST MATCH - India vs Australia",
    matchId: "test-match"
   }

  ]

 }

}

module.exports = { getMatches }