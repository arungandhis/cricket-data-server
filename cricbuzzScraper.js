const axios = require("axios");
const cheerio = require("cheerio");

const BASE = "https://www.cricbuzz.com";

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

let lastKnownIds = new Map();

/**
 * Scrape match list from live scores page
 * Returns: [{ match, series, status, matchId, url }]
 */
async function fetchMatches() {
  try {
    const url = `${BASE}/cricket-match/live-scores`;
    const res = await axios.get(url, { headers: HEADERS });
    const $ = cheerio.load(res.data);

    const matches = [];

    // UNIVERSAL selector for all Cricbuzz layouts
    $("a[href*='/live-cricket-scores/']").each((_, el) => {
      const matchLink = $(el).attr("href");
      if (!matchLink) return;

      const fullUrl = BASE + matchLink;

      // Extract matchId
      const idMatch = matchLink.match(/\/live-cricket-scores\/(\d+)\//);
      const matchId = idMatch ? idMatch[1] : null;
      if (!matchId) return;

      // Extract title
      const title =
        $(el).find(".cb-lv-scr-mtch-hdr").text().trim() ||
        $(el).text().trim() ||
        "Cricket Match";

      // Extract status
      const status =
        $(el)
          .closest(".cb-mtch-lst-li, .cb-col-100, .cb-bg-white")
          .find(".cb-lv-scrs-col")
          .last()
          .text()
          .trim() || "";

      // Extract series name
      const series =
        $(el)
          .closest(".cb-mtch-lst, .cb-col-100")
          .find(".cb-lv-scr-mtch-hdr")
          .first()
          .text()
          .trim() || "";

      matches.push({
        match: title,
        series,
        status,
        matchId,
        url: fullUrl,
      });
    });

    return matches;
  } catch (err) {
    console.log("Match fetch error (HTML):", err.message);
    return [];
  }
}
/**
 * High-level: fetch commentary + rich info for a match
 * Accepts matchId or full URL
 */
async function fetchCommentary(matchIdOrUrl) {
  try {
    const url =
      typeof matchIdOrUrl === "string" && matchIdOrUrl.startsWith("http")
        ? matchIdOrUrl
        : `${BASE}/live-cricket-scores/${matchIdOrUrl}`;

    const res = await axios.get(url, { headers: HEADERS });
    const $ = cheerio.load(res.data);

    // Try live layout first
    const liveData = parseLiveLayout($);
    if (liveData && liveData.commentary.length > 0) {
      return liveData;
    }

    // Fallback to completed layout
    const completedData = parseCompletedLayout($);
    return completedData;
  } catch (err) {
    console.log("Commentary fetch error (HTML):", err.message);
    return {
      type: "error",
      commentary: [],
      score: "",
      batsmen: [],
      bowler: "",
    };
  }
}

/**
 * Parse LIVE match layout
 */
function parseLiveLayout($) {
  const commentaryBlocks = $(".cb-col.cb-col-100.cb-ltst-wgt-hdr");
  if (!commentaryBlocks.length) return null;

  const lines = [];
  commentaryBlocks.each((_, el) => {
    const text = $(el).find(".cb-col.cb-col-90.cb-com-ln").text().trim();
    if (text) lines.push(text);
  });

  if (!lines.length) return null;

  const latestId = lines[0];
  const lastId = lastKnownIds.get("live");
  if (latestId === lastId) {
    console.log("No new live commentary (HTML)");
    return { type: "live", commentary: [] };
  }
  lastKnownIds.set("live", latestId);

  // Score
  let score =
    $(".cb-font-18.cb-col-100.cb-ltst-wgt-hdr").first().text().trim() ||
    $(".cb-min-bat-rw").first().text().trim();

  // Batsmen
  const batsmen = [];
  $(".cb-min-bat-rw").each((_, el) => {
    const name = $(el).find(".cb-col.cb-col-27").text().trim();
    const runs = $(el).find(".cb-col.cb-col-10.text-right").first().text().trim();
    const balls = $(el).find(".cb-col.cb-col-10.text-right").eq(1).text().trim();
    if (name) batsmen.push(`${name} ${runs} (${balls})`);
  });

  // Bowler
  let bowler = "";
  const bowlerRow = $(".cb-min-bwl-rw").first();
  if (bowlerRow.length) {
    const name = bowlerRow.find(".cb-col.cb-col-40").text().trim();
    const overs = bowlerRow.find(".cb-col.cb-col-10.text-right").first().text().trim();
    const maidens = bowlerRow.find(".cb-col.cb-col-10.text-right").eq(1).text().trim();
    const runs = bowlerRow.find(".cb-col.cb-col-10.text-right").eq(2).text().trim();
    const wkts = bowlerRow.find(".cb-col.cb-col-10.text-right").eq(3).text().trim();
    if (name) bowler = `${name} ${overs}-${maidens}-${runs}-${wkts}`;
  }

  return {
    type: "live",
    commentary: lines,
    score,
    batsmen,
    bowler,
  };
}

/**
 * Parse COMPLETED match layout
 */
function parseCompletedLayout($) {
  const lines = [];

  $(".cb-col.cb-col-100.cb-col-rt .cb-col.cb-col-100").each((_, el) => {
    const text = $(el).find(".cb-com-ln").text().trim();
    if (text) lines.push(text);
  });

  if (!lines.length) {
    $("p.cb-com-ln").each((_, el) => {
      const text = $(el).text().trim();
      if (text) lines.push(text);
    });
  }

  const latestId = lines[0] || "";
  const lastId = lastKnownIds.get("completed");
  if (latestId && latestId === lastId) {
    console.log("No new completed commentary (HTML)");
  }
  lastKnownIds.set("completed", latestId);

  // Score / result
  let score = $(".cb-font-18.cb-col-100.cb-ltst-wgt-hdr").first().text().trim();
  if (!score) {
    score = $(".cb-scrcrd-status").first().text().trim();
  }

  // Batsmen from scorecard
  const batsmen = [];
  $(".cb-col.cb-col-100.cb-scrd-itms").each((_, el) => {
    const name = $(el).find(".cb-col.cb-col-27").text().trim();
    const runs = $(el).find(".cb-col.cb-col-8.text-right").first().text().trim();
    const balls = $(el).find(".cb-col.cb-col-8.text-right").eq(1).text().trim();
    if (name && runs) batsmen.push(`${name} ${runs} (${balls})`);
  });

  // Bowler from bowling card
  let bowler = "";
  const bwlRow = $(".cb-col.cb-col-100.cb-scrd-itms")
    .filter((_, el) => $(el).find(".cb-col.cb-col-40").text().trim())
    .first();

  if (bwlRow.length) {
    const name = bwlRow.find(".cb-col.cb-col-40").text().trim();
    const overs = bwlRow.find(".cb-col.cb-col-8.text-right").first().text().trim();
    const maidens = bwlRow.find(".cb-col.cb-col-8.text-right").eq(1).text().trim();
    const runs = bwlRow.find(".cb-col.cb-col-8.text-right").eq(2).text().trim();
    const wkts = bwlRow.find(".cb-col.cb-col-8.text-right").eq(3).text().trim();
    if (name) bowler = `${name} ${overs}-${maidens}-${runs}-${wkts}`;
  }

  return {
    type: "completed",
    commentary: lines,
    score,
    batsmen,
    bowler,
  };
}

module.exports = {
  fetchMatches,
  fetchCommentary,
};
