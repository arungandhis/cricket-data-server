const axios = require("axios")
const cheerio = require("cheerio")

async function getMatches(){

 const url="https://www.cricbuzz.com/cricket-match/live-scores"

 const {data}=await axios.get(url,{
  headers:{ "User-Agent":"Mozilla/5.0" }
 })

 const $=cheerio.load(data)

 const matches=[]

 $(".cb-lv-main").each((i,el)=>{

  const title=$(el).find(".cb-lv-scr-mtch-hdr a").text().trim()
  const score=$(el).find(".cb-lv-scrs").text().trim()
  const link=$(el).find(".cb-lv-scr-mtch-hdr a").attr("href")

  if(title){

   const matchId=link.split("/")[2]

   matches.push({
    match:title,
    score:score,
    matchId:matchId
   })

  }

 })

 return matches
}

module.exports={getMatches}