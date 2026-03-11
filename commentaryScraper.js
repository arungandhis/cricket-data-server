const axios = require("axios")
const cheerio = require("cheerio")

async function fetchCommentary(link){

try{

const response = await axios.get(link,{
headers:{
"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
}
})

const $ = cheerio.load(response.data)

/* COMMENTARY */

let commentary = ""

$(".cb-col.cb-col-90.cb-com-ln").first().each((i,el)=>{
commentary = $(el).text().trim()
})

/* SCORE */

let score = $(".cb-font-20.text-bold").first().text().trim()

/* BATSMEN */

let batsmen = []

$(".cb-col.cb-col-50").slice(0,2).each((i,el)=>{
batsmen.push($(el).text().replace(/\n/g," ").trim())
})

/* BOWLER */

let bowler = $(".cb-col.cb-col-33").first().text().replace(/\n/g," ").trim()

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