const puppeteer = require("puppeteer")

let browser = null

async function getBrowser() {

  if (browser) return browser

  browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: [
         "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu"
    ]
  })

  return browser
}

module.exports = { getBrowser }