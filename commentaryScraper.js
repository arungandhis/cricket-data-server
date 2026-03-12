const puppeteer = require("puppeteer");

async function fetchCommentary(url) {

let browser;

try {

browser = await puppeteer.launch({
args: ["--no-sandbox", "--disable-setuid-sandbox"],
headless: true
});

const page = await browser.newPage();

console.log("Opening match:", url);

/* CAPTURE API RESPONSES */

let commentaryData = null;

page.on("response", async (response) => {

try {

const reqUrl = response.url();

/* Cricbuzz commentary API */

if (reqUrl.includes("commentary")) {

const json = await response.json().catch(()=>null);

if (json) {
commentaryData = json;
}

}

} catch (err) {}

});

/* OPEN PAGE */

await page.goto(url, {
waitUntil: "networkidle2",
timeout: 0
});

/* WAIT FOR API TO LOAD */

await new Promise(resolve => setTimeout(resolve, 5000));

await browser.close();

/* VALIDATE */

if (!commentaryData) {

console.log("SCRAPER FAILED — NO COMMENTARY API DATA");

return null;

}

/* EXTRACT COMMENTARY */

let latestCommentary = "";
let score = "";

try {

const comm = commentaryData.commentaryList || [];

if (comm.length > 0) {
latestCommentary = comm[0].commText || "";
}

score =
(commentaryData.matchHeader &&
commentaryData.matchHeader.state) || "";

} catch (err) {}

/* CHECK */

if (!latestCommentary) {

console.log("SCRAPER FAILED — NO COMMENTARY FOUND");

return null;

}

return {
commentary: latestCommentary,
score: score,
batsmen: [],
bowler: ""
};

} catch (err) {

console.log("Commentary scraper error:", err.message);

if (browser) await browser.close();

return null;

}

}

module.exports = { fetchCommentary };