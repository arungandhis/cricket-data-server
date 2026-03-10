const axios = require("axios")
const cheerio = require("cheerio")

async function fetchScore(matchId){

 try{

  const url = "https://www.cricbuzz.com/live-cricket-scores/" + matchId

  const response = await axios.get(url,{
   headers:{
    "User-Agent":"Mozilla/5.0"
   }
  })

  const html=response.data

  const $=cheerio.load(html)

  const team1=$(".cb-col.cb-col-100.cb-min-tm.cb-text-gray").first().text().trim()

  const team2=$(".cb-col.cb-col-100.cb-min-tm.cb-text-gray").eq(1).text().trim()

  const score=$(".cb-font-20.text-bold").first().text().trim()

  const overs=$(".cb-font-12").first().text().trim()

  return{

   team1:team1+" "+score,
   team2:team2,
   overs:overs

  }

 }
 catch(err){

  console.log("Score fetch error:",err)

  return null

 }

}

module.exports={
 fetchScore
}