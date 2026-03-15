// services/tmdbService.js
import axios from "axios";

const tmdbClient = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: { api_key: process.env.TMDB_API_KEY },
});

// Fetch genre map once
export const getGenreMap = async () => {
  const [movieGenres, tvGenres] = await Promise.all([
    tmdbClient.get("/genre/movie/list"),
    tmdbClient.get("/genre/tv/list"),
  ]);

  const map = {};
  [...movieGenres.data.genres, ...tvGenres.data.genres].forEach((g) => {
    map[g.id] = g.name;
  });
  return map;
};

export const getPopularMovies = async (page = 1) => {
  const res = await tmdbClient.get("/movie/popular", { params: { page } });
  return res.data.results;
};

export const getPopularTV = async (page = 1) => {
  const res = await tmdbClient.get("/tv/popular", { params: { page } });
  return res.data.results;
};

export const searchMedia = async (query, page = 1) => {
  const res = await tmdbClient.get("/search/multi", {
    params: { query, page },
  });
  return res.data;
};

export const getMovieDetails = async (id) => {
  const res = await tmdbClient.get(`/movie/${id}`);
  return res.data;
};

export const getTVDetails = async (id) => {
  const res = await tmdbClient.get(`/tv/${id}`);
  return res.data;
};
