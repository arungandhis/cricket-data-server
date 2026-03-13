const puppeteer = require("puppeteer")

let browser = null

async function getBrowser() {

  if (browser) return browser

  browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage"
    ]
  })

  return browser
}

module.exports = { getBrowser }