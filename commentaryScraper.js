const axios = require("axios")
const cheerio = require("cheerio")

async function fetchCommentary(link){

try{

const response = await axios.get(link,{
headers:{
"User-Agent":"Mozilla/5.0"
}
})

const $ = cheerio.load(response.data)

let commentary = ""

$(".cb-col.cb-col-90.cb-com-ln").first().each((i,el)=>{
commentary = $(el).text().trim()
})

let score = $(".cb-font-20.text-bold").first().text().trim()

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