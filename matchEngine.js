const fetchLiveScore = require("./liveScoreEngine")
const { broadcastCommentary } = require("./websocket")

let engineRunning = false

function startLiveMatch(match) {

  if (engineRunning) return

  engineRunning = true

  console.log("Live match engine started:", match.match)

  setInterval(async () => {

    const data = await fetchLiveScore(match.link)

    if (!data) return

    broadcastCommentary({
      commentary: "Live Update",
      score: data.score,
      teams: data.teams
    })

  }, 15000)

}

/* TEST MATCH */

function startTestMatch() {

  console.log("Test match started")

  let runs = 120
  let wickets = 3
  let overs = 14.2

  setInterval(() => {

    runs += Math.floor(Math.random() * 6)

    const score = `${runs}/${wickets} (${overs})`

    broadcastCommentary({
      commentary: "Kohli drives through covers for FOUR!",
      score: score,
      teams: "India vs Australia"
    })

    overs += 0.1

  }, 5000)

}

module.exports = { startLiveMatch, startTestMatch }