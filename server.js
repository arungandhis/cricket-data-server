const express = require("express");
const http = require("http");
const path = require("path");

const { startWebSocket } = require("./websocket");
const { fetchMatches, fetchCommentary } = require("./cricbuzzScraper");
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
 * Returns full commentary history for admin.html
 */
app.get("/commentary", async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) return res.json({ commentary: [] });

    const result = await fetchCommentary(url);
    res.json(result);
  } catch (err) {
    console.log("Error fetching commentary:", err.message);
    res.json({ commentary: [] });
  }
});

/**
 * POST /start-match
 * Starts the match engine for selected match
 */
app.post("/start-match", async (req, res) => {
  try {
    const match = req.body;
    console.log("Starting match:", match.match);

    startLiveMatch(match);

    res.json({ status: "ok" });
  } catch (err) {
    console.log("Error starting match:", err.message);
    res.json({ status: "error" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
