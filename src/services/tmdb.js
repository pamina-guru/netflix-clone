import axios from "axios";

const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
    language: "en-US",
  },
});

// ✅ imgUrl as a FUNCTION (so Banner.jsx works)
export function imgUrl(path, size = "original") {
  if (!path) return "";
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export default api;
