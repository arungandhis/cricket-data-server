const axios = require("axios");

let lastKnownId = null;

/**
 * Fetch live commentary first.
 * If no new commentary is available, fallback to full old commentary.
 */
async function fetchCommentary(matchId) {
  try {
    const live = await fetchLiveCommentary(matchId);

    if (live && live.commentary.length > 0) {
      return live; // Live commentary available
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

  // Update last known ID
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
  fetchCommentary
};
