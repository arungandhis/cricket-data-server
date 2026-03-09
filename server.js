const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({status:"Cricket server running"});
});

app.get("/matches", (req, res) => {
  res.json([
    {
      id: "1001",
      team1: "India",
      team2: "Australia",
      score: "IND 120/3 (15)"
    },
    {
      id: "1002",
      team1: "England",
      team2: "Pakistan",
      score: "ENG 85/2 (10)"
    }
  ]);
});

app.get("/commentary/:id", (req, res) => {
  const commentary = [
    "Bowler runs in",
    "Short ball",
    "Pulled for four",
    "Crowd cheering"
  ];

  res.json({
    matchId: req.params.id,
    commentary: commentary
  });
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});