const scraper = require("./cricbuzzScraper")

async function getMatches(){

 const matches = await scraper.fetchMatches()

 return matches

}

module.exports = { getMatches }