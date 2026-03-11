const puppeteer = require("puppeteer")

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

/* SCRAPE COMMENTARY */

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

module.exports = fetchCommentary