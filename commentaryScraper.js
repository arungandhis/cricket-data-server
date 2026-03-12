const puppeteer = require("puppeteer");

async function fetchCommentary(url) {

let browser;

try {

browser = await puppeteer.launch({
args: ["--no-sandbox", "--disable-setuid-sandbox"],
headless: true
});

const page = await browser.newPage();

console.log("Opening Cricbuzz page:", url);

await page.goto(url, {
waitUntil: "networkidle2",
timeout: 0
});

/* WAIT FOR COMMENTARY CONTAINER */

await page.waitForSelector("body");

/* SCRAPE COMMENTARY LINES */

const result = await page.evaluate(() => {

const commentaryLines = [];

/* Cricbuzz commentary containers */

const elements = document.querySelectorAll(
".cb-com-ln, .cb-col.cb-col-90, .cb-col.cb-col-100"
);

elements.forEach(el => {
const text = el.innerText.trim();
if (text.length > 10) {
commentaryLines.push(text);
}
});

/* GET SCORE */

let score = "";

const scoreEl = document.querySelector(".cb-text-live");

if (scoreEl) {
score = scoreEl.innerText.trim();
}

return {
lines: commentaryLines,
score
};

});

await browser.close();

/* CHECK DATA */

if (!result.lines || result.lines.length === 0) {

console.log("SCRAPER FAILED — NO COMMENTARY FOUND");

return null;

}

/* LATEST BALL */

const latest = result.lines[0];

return {
commentary: latest,
score: result.score,
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