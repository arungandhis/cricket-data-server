const axios = require("axios")
const cheerio = require("cheerio")

async function fetchMatches(){

 const url = "https://www.cricbuzz.com/cricket-match/live-scores"

 const response = await axios.get(url,{
  headers:{
   "User-Agent":"Mozilla/5.0"
  }
 })

 const html = response.data

 const $ = cheerio.load(html)

 const matches=[]

 $("a[href*='/live-cricket-scores/']").each((i,el)=>{

  const title=$(el).text().trim()

  const link=$(el).attr("href")

  if(title && title.includes("vs")){

   const parts=link.split("/")

   matches.push({

    match:title,

    matchId:parts[3],

    link:"https://www.cricbuzz.com"+link

   })

  }

 })

 return matches

}


async function fetchCommentary(matchId){

 const url = `https://www.cricbuzz.com/live-cricket-scores/${matchId}`

 const response = await axios.get(url,{
  headers:{ "User-Agent":"Mozilla/5.0" }
 })

 const $ = cheerio.load(response.data)

 const commentary=[]

 $(".cb-col.cb-col-100.cb-comm-text").each((i,el)=>{

  commentary.push($(el).text().trim())

 })

 return commentary

}


module.exports = {
 fetchMatches,
 fetchCommentary
}