const isLocalHost =
  typeof window !== "undefined" &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname);

export const API_BASE = isLocalHost
  ? "http://localhost:3000"
  : "https://movie-api-bqfe.onrender.com";
