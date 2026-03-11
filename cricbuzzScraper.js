const axios = require("axios");

let lastKnownId = null;

/**
 * Fetch list of matches from Cricbuzz
 */
async function fetchMatches() {
  const url = "https://www.cricbuzz.com/api/matches";

  const res = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "application/json"
    }
  });

  const data = res.data;
  const matches = [];

  if (data.typeMatches) {
    data.typeMatches.forEach(group => {
      if (group.seriesMatches) {
        group.seriesMatches.forEach(series => {
          if (series.seriesAdWrapper && series.seriesAdWrapper.matches) {
            series.seriesAdWrapper.matches.forEach(m => {
              const info = m.matchInfo;

              matches.push({
                match: `${info.matchDesc} - ${info.team1.teamName} vs ${info.team2.teamName}`,
                matchId: info.matchId,
                link: info.matchId
              });
            });
          }
        });
      }
    });
  }

  return matches;
}

/**
 * Fetch commentary (live first, fallback to old)
 */
async function fetchCommentary(matchId) {
  try {
    const live = await fetchLiveCommentary(matchId);

    if (live && live.commentary.length > 0) {
      return live;
    }

    console.log("No new live commentary. Fetching old commentary...");
    return await fetchOldCommentary(matchId);

  } catch (err) {
    console.log("Live commentary failed, loading old commentary:", err.message);
    return await fetchOldCommentary(matchId);
  }
}

/**
 * Fetch LIVE commentary from Cricbuzz
 */
async function fetchLiveCommentary(matchId) {
  const url = `https://www.cricbuzz.com/api/cricket-match/commentary/${matchId}`;

  const res = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "application/json"
    }
  });

  const data = res.data;
  const lines = data.comm_lines || [];

  if (!lines.length) {
    console.log("No commentary in API");
    return null;
  }

  const latest = lines[0];

  // No new commentary since last poll
  if (latest.id === lastKnownId) {
    console.log("No new commentary data");
    return null;
  }

  lastKnownId = latest.id;

  return {
    type: "live",
    latestId: latest.id,
    commentary: lines.map(l => l.comm)
  };
}

/**
 * Fetch FULL OLD commentary (works for completed matches)
 */
async function fetchOldCommentary(matchId) {
  const url = `https://www.cricbuzz.com/api/cricket-match/commentary/${matchId}`;

  const res = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "application/json"
    }
  });

  const data = res.data;
  const lines = data.comm_lines || [];

  return {
    type: "old",
    commentary: lines.map(l => l.comm)
  };
}

module.exports = {
  fetchMatches,
  fetchCommentary
};
