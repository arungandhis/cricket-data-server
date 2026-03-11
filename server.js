const express = require("express");
const http = require("http");
const path = require("path");

const { startWebSocket } = require("./websocket");
const { fetchMatches } = require("./cricbuzzScraper");
const { startLiveMatch } = require("./matchEngine");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);
startWebSocket(server);

// Store active match interval globally
global.currentMatchInterval = null;

/**
 * GET /matches
 * Returns list of matches from Cricbuzz
 */
app.get("/matches", async (req, res) => {
  try {
    const matches = await fetchMatches();
    res.json(matches);
  } catch (err) {
    console.log("Match fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch matches" });
  }
});

/**
 * POST /start-match
 * Starts live match engine
 */
app.post("/start-match", (req, res) => {
  const match = req.body;

  if (!match.matchId) {
    return res.status(400).json({ error: "Invalid matchId" });
  }

  console.log("Starting match:", match.match);

  // Stop previous match engine
  if (global.currentMatchInterval) {
    clearInterval(global.currentMatchInterval);
    global.currentMatchInterval = null;
  }

  // Start new match engine
  global.currentMatchInterval = startLiveMatch(match);

  res.json({ status: "ok", matchId: match.matchId });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
