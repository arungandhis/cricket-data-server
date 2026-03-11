const express = require("express");
const http = require("http");
const path = require("path");

const { startWebSocket } = require("./websocket");
const { fetchMatches, fetchCommentary } = require("./cricbuzzScraper");
const { fetchHistoricalCommentary } = require("./commentaryScraper");
const { startLiveMatch } = require("./matchEngine");

const app = express();
const server = http.createServer(app);

// Start WebSocket server
startWebSocket(server);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/**
 * GET /matches
 * Returns list of scraped matches
 */
app.get("/matches", async (req, res) => {
  try {
    const matches = await fetchMatches();
    res.json(matches);
  } catch (err) {
    console.log("Error fetching matches:", err.message);
    res.json([]);
  }
});

/**
 * GET /commentary?url=<matchUrl>
 * Returns latest commentary (used by admin.html)
 */
app.get("/commentary", async (req, res) => {
  try {
    const url = req.query.url;

    if (!url) {
      return res.json({ commentary: [] });
    }

    const result = await fetchCommentary(url);

    res.json(result || { commentary: [] });

  } catch (err) {
    console.log("Error fetching commentary:", err.message);
    res.json({ commentary: [] });
  }
});

/**
 * GET /historical-commentary/:matchId
 * Returns full match commentary for completed matches
 */
app.get("/historical-commentary/:matchId", async (req, res) => {
  try {

    const matchId = req.params.matchId;

    console.log("Fetching historical commentary for match:", matchId);

    const commentary = await fetchHistoricalCommentary(matchId);

    res.json({
      matchId,
      balls: commentary
    });

  } catch (err) {

    console.log("Historical commentary error:", err.message);

    res.status(500).json({
      error: "Failed to fetch historical commentary"
    });

  }
});

/**
 * POST /start-match
 * Starts the match engine for selected match
 */
app.post("/start-match", async (req, res) => {
  try {

    const match = req.body;

    console.log("Starting match:", match.match || match.matchId);

    startLiveMatch(match);

    res.json({ status: "ok" });

  } catch (err) {

    console.log("Error starting match:", err.message);

    res.json({ status: "error" });

  }
});

/**
 * Health check endpoint
 */
app.get("/health", (req, res) => {
  res.json({
    status: "running",
    service: "cricket-data-server"
  });
});

// Start server
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});