
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Cricket Data API Running");
});

app.get("/matches", async (req, res) => {
  try {
    const url = "https://www.cricbuzz.com/cricket-match/live-scores";

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      }
    });

    const $ = cheerio.load(data);

    let matches = [];

    $(".cb-mtch-lst").each((i, el) => {
      const title = $(el).find(".cb-lv-scr-mtch-hdr").text().trim();
      const score = $(el).find(".cb-lv-scrs-col").text().trim();

      matches.push({
        match: title,
        score: score
      });
    });

    res.json(matches);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch matches" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
