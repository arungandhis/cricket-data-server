const scraper = require("./cricbuzzScraper")

async function getMatches(){

 try{

  console.log("Fetching matches...")

  const matches = await scraper.fetchMatches()

  console.log("Matches found:",matches.length)

  return matches

 }
 catch(err){

  console.log("Fetcher error:",err.message)

  return []

 }

}

module.exports = { getMatches }