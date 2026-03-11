const puppeteer = require("puppeteer")

/*
LIVE COMMENTARY SCRAPER
Used by matchEngine.js
*/

async function fetchCommentary(url){

let browser

try{

browser = await puppeteer.launch({
args:["--no-sandbox","--disable-setuid-sandbox"],
headless:true
})

const page = await browser.newPage()

await page.goto(url,{
waitUntil:"networkidle2",
timeout:0
})

const data = await page.evaluate(()=>{

const commEl = document.querySelector(".cb-com-ln")

const scoreEl = document.querySelector(".cb-nav-tab.active")

let commentary = ""
let score = ""

if(commEl){
commentary = commEl.innerText.trim()
}

if(scoreEl){
score = scoreEl.innerText.trim()
}

return {
commentary,
score
}

})

await browser.close()

if(!data.commentary){

console.log("Empty commentary from Puppeteer")

return null

}

return {
commentary:data.commentary,
score:data.score,
batsmen:[],
bowler:""
}

}catch(err){

console.log("Puppeteer scraper error:",err.message)

if(browser) await browser.close()

return null

}

}

/*
HISTORICAL COMMENTARY SCRAPER
Fetches full match commentary
*/

async function fetchHistoricalCommentary(matchId){

let browser

try{

browser = await puppeteer.launch({
args:["--no-sandbox","--disable-setuid-sandbox"],
headless:true
})

const page = await browser.newPage()

let allCommentary = []

for(let i=0;i<50;i++){

const url =
`https://www.cricbuzz.com/live-cricket-scores/${matchId}/commentary/${i}`

console.log("Scraping page:",url)

await page.goto(url,{
waitUntil:"networkidle2",
timeout:0
})

const comm = await page.evaluate(()=>{

let lines = []

document.querySelectorAll(".cb-com-ln").forEach(el=>{
lines.push(el.innerText.trim())
})

return lines

})

if(comm.length === 0){
break
}

allCommentary.push(...comm)

}

await browser.close()

return allCommentary

}catch(err){

console.log("Historical scraper error:",err.message)

if(browser) await browser.close()

return []

}

}

module.exports = {
fetchCommentary,
fetchHistoricalCommentary
}