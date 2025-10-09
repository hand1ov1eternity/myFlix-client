// Dynamically pick API base depending on environment
export const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://movie-api-bqfe.onrender.com";

/**
 * Perform a semantic movie search.
 *
 * @param {Object} options
 * @param {string} options.q - The search query text.
 * @param {number} [options.limit=20] - Max number of results to return.
 * @param {number} [options.threshold=0.2] - Cosine similarity threshold.
 * @param {boolean} [options.includeScores=false] - Whether to include similarity scores.
 * @param {AbortSignal} [options.signal] - Optional AbortController signal for cancelling.
 * @returns {Promise<{ results: any[], total: number, usedFallback: boolean, tookMs: number }>}
 */
export async function searchMovies(
  { q, limit = 20, threshold = 0.2, includeScores = false, signal } = {}
) {
  const params = new URLSearchParams({
    q,
    limit: String(limit),
    threshold: String(threshold),
    includeScores: String(includeScores),
  });

  const url = `${API_BASE}/search?${params.toString()}`;

  try {
    const res = await fetch(url, { signal });

    // 400 means "too short query" — not fatal
    if (res.status === 400) {
      return { results: [], total: 0, usedFallback: false, tookMs: 0 };
    }

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || "Search failed");
    }

    return await res.json();
  } catch (err) {
    // Handle cancellations cleanly
    if (err.name === "AbortError") {
      console.warn("Search request aborted");
      return { results: [], total: 0, usedFallback: false, tookMs: 0 };
    }
    throw err;
  }
}
