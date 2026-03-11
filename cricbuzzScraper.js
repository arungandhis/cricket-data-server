const axios = require("axios");
const cheerio = require("cheerio");

const BASE = "https://www.cricbuzz.com";

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

/**
 * UNIVERSAL MATCH SCRAPER
 */
async function fetchMatches() {
  try {
    const url = `${BASE}/cricket-match/live-scores`;
    const res = await axios.get(url, { headers: HEADERS });
    const $ = cheerio.load(res.data);

    const matches = [];

    // Universal selector for all Cricbuzz layouts
    $("a[href*='/live-cricket-scores/']").each((_, el) => {
      const matchLink = $(el).attr("href");
      if (!matchLink) return;

      const fullUrl = BASE + matchLink;

      const idMatch = matchLink.match(/\/live-cricket-scores\/(\d+)\//);
      const matchId = idMatch ? idMatch[1] : null;
      if (!matchId) return;

      const title =
        $(el).find(".cb-lv-scr-mtch-hdr").text().trim() ||
        $(el).text().trim() ||
        "Cricket Match";

      const status =
        $(el)
          .closest(".cb-mtch-lst-li, .cb-col-100, .cb-bg-white")
          .find(".cb-lv-scrs-col")
          .last()
          .text()
          .trim() || "";

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
    console.log("Match fetch error:", err.message);
    return [];
  }
}

/**
 * COMMENTARY SCRAPER
 */
async function fetchCommentary(matchUrl) {
  try {
    const res = await axios.get(matchUrl, { headers: HEADERS });
    const $ = cheerio.load(res.data);

    // Try live layout first
    const live = parseLiveLayout($);
    if (live && live.commentary.length > 0) {
      return live;
    }

    // Fallback to completed layout
    const completed = parseCompletedLayout($);
    return completed;
  } catch (err) {
    console.log("Commentary fetch error:", err.message);
    return { commentary: [] };
  }
}

/**
 * NEW LIVE COMMENTARY PARSER
 */
function parseLiveLayout($) {
  const lines = [];

  // NEW Cricbuzz live commentary selector
  $(".cb-comm-ltst .cb-com-ln").each((_, el) => {
    const text = $(el).text().trim();
    if (text) lines.push(text);
  });

  if (!lines.length) return null;

  return {
    type: "live",
    commentary: lines,
    score: extractScore($),
    batsmen: extractBatsmen($),
    bowler: extractBowler($),
  };
}

/**
 * NEW COMPLETED MATCH COMMENTARY PARSER
 */
function parseCompletedLayout($) {
  const lines = [];

  // NEW Cricbuzz completed commentary selector
  $(".cb-col.cb-col-100.cb-col-rt .cb-com-ln").each((_, el) => {
    const text = $(el).text().trim();
    if (text) lines.push(text);
  });

  // Fallback selector
  if (!lines.length) {
    $("p.cb-com-ln").each((_, el) => {
      const text = $(el).text().trim();
      if (text) lines.push(text);
    });
  }

  return {
    type: "completed",
    commentary: lines,
    score: extractScore($),
    batsmen: extractBatsmen($),
    bowler: extractBowler($),
  };
}

/**
 * SCORE EXTRACTOR
 */
function extractScore($) {
  return (
    $(".cb-font-18").first().text().trim() ||
    $(".cb-min-bat-rw").first().text().trim() ||
    ""
  );
}

/**
 * BATSMEN EXTRACTOR
 */
function extractBatsmen($) {
  const batsmen = [];

  $(".cb-min-bat-rw").each((_, el) => {
    const name = $(el).find(".cb-col.cb-col-27").text().trim();
    const runs = $(el).find(".cb-col.cb-col-10.text-right").first().text().trim();
    const balls = $(el).find(".cb-col.cb-col-10.text-right").eq(1).text().trim();

    if (name) batsmen.push(`${name} ${runs} (${balls})`);
  });

  return batsmen;
}

/**
 * BOWLER EXTRACTOR
 */
function extractBowler($) {
  const row = $(".cb-min-bwl-rw").first();
  if (!row.length) return "";

  const name = row.find(".cb-col.cb-col-40").text().trim();
  const overs = row.find(".cb-col.cb-col-10.text-right").first().text().trim();
  const maidens = row.find(".cb-col.cb-col-10.text-right").eq(1).text().trim();
  const runs = row.find(".cb-col.cb-col-10.text-right").eq(2).text().trim();
  const wkts = row.find(".cb-col.cb-col-10.text-right").eq(3).text().trim();

  return `${name} ${overs}-${maidens}-${runs}-${wkts}`;
}

module.exports = {
  fetchMatches,
  fetchCommentary,
};
