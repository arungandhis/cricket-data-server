const express = require("express");
const http = require("http");
const path = require("path");

const { startWebSocket } = require("./websocket");
const { fetchMatches } = require("./cricbuzzScraper");
const { startLiveMatch } = require("./matchEngine");

const app = express();
const server = http.createServer(app);

startWebSocket(server);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/matches", async (req, res) => {
  const matches = await fetchMatches();
  res.json(matches);
});

app.post("/start-match", async (req, res) => {
  const match = req.body;
  console.log("Starting match:", match.match);

  startLiveMatch(match);

  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
