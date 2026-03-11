const axios = require("axios")
const cheerio = require("cheerio")

async function fetchCommentary(url){

try{

const response = await axios.get(url,{
headers:{
"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
"Accept-Language":"en-US,en;q=0.9"
}
})

const html = response.data
const $ = cheerio.load(html)

/* COMMENTARY */

let commentary = ""

$(".cb-com-ln").first().each((i,el)=>{
commentary = $(el).text().trim()
})

/* SCORE */

let score = $(".cb-font-20").first().text().trim()

/* BATSMEN */

let batsmen = []

$(".cb-scrd-itms").slice(0,2).each((i,el)=>{
batsmen.push($(el).text().replace(/\n/g," ").trim())
})

/* BOWLER */

let bowler = ""

$(".cb-scrd-itms").slice(2,3).each((i,el)=>{
bowler = $(el).text().replace(/\n/g," ").trim()
})

if(!commentary){
console.log("Empty commentary from scraper")
}

return {
commentary,
score,
batsmen,
bowler
}

}catch(err){

console.log("Commentary fetch error:",err.message)

return null

}

}

module.exports = fetchCommentary