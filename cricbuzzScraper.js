const axios = require("axios");

let lastKnownIds = new Map();

/**
 * Fetch list of VALID matches from Cricbuzz
 * Filters out:
 *  - matches without matchId
 *  - matches without teams
 *  - placeholder / series headers
 */
async function fetchMatches() {
  try {
    const url = "https://www.cricbuzz.com/api/matches";

    const res = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json"
      }
    });

    const data = res.data;
    const matches = [];

    if (!data.typeMatches) return matches;

    for (const group of data.typeMatches) {
      if (!group.seriesMatches) continue;

      for (const series of group.seriesMatches) {
        const wrapper = series.seriesAdWrapper;
        if (!wrapper || !wrapper.matches) continue;

        for (const m of wrapper.matches) {
          const info = m.matchInfo;
          if (!info) continue;

          // Skip invalid entries
          if (!info.matchId) continue;
          if (!info.team1 || !info.team2) continue;

          matches.push({
            match: `${info.matchDesc} - ${info.team1.teamName} vs ${info.team2.teamName}`,
            matchId: info.matchId
          });
        }
      }
    }

    return matches;

  } catch (err) {
    console.log("Match fetch error:", err.message);
    return [];
  }
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
 * Uses correct endpoint: /commentary/<matchId>
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
  const lastId = lastKnownIds.get(matchId);

  // No new commentary since last poll
  if (latest.id === lastId) {
    console.log("No new commentary data");
    return null;
  }

  lastKnownIds.set(matchId, latest.id);

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
