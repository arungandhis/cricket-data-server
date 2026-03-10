const axios = require("axios")
const cheerio = require("cheerio")

async function fetchMatches(){

try{

const response = await axios.get(
"https://www.cricbuzz.com/cricket-match/live-scores",
{
headers:{
"User-Agent":
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
"Accept-Language":"en-US,en;q=0.9"
}
}
)

const html = response.data

const $ = cheerio.load(html)

let matches = []

$("a").each((i,el)=>{

const href = $(el).attr("href")

if(href && href.includes("live-cricket-scores")){

const match = $(el).text().trim()

if(match.length > 5){

matches.push({
match: match,
matchId: href.split("/")[2],
link: "https://www.cricbuzz.com"+href
})

}

}

})

return matches.slice(0,10)

}catch(err){

console.log("Scraper error:",err.message)

return []

}

}

module.exports = fetchMatches