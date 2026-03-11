const axios = require("axios")
const cheerio = require("cheerio")

async function fetchCommentary(url){

try{

const response = await axios.get(url,{
headers:{
"User-Agent":"Mozilla/5.0",
"Accept-Language":"en-US,en;q=0.9"
}
})

const $ = cheerio.load(response.data)

/* COMMENTARY */

let commentary = ""

$(".cb-com-ln").first().each((i,el)=>{
commentary = $(el).text().trim()
})

/* SCORE */

let score = $(".cb-nav-tab.active").text().trim()

/* FALLBACK SCORE */

if(!score){
score = $(".cb-font-20").first().text().trim()
}

if(!commentary){
console.log("Empty commentary from scraper")
}

/* RETURN */

return {
commentary,
score
}

}catch(err){

console.log("Commentary fetch error:",err.message)

return null

}

}

module.exports = fetchCommentary