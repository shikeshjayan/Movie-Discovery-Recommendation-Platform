import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// Create a configured instance
const tmdbClient = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: "en-US",
  },
});

// --- HELPER FOR LISTS (Movies/TV Grids) ---
const fetchList = async (endpoint, params = {}) => {
  try {
    const response = await tmdbClient.get(endpoint, { params });
    return response.data.results || [];
  } catch (error) {
    console.error(`Error fetching list from ${endpoint}:`, error);
    return [];
  }
};

// --- HELPER FOR SINGLE OBJECTS (Details) ---
const fetchSingle = async (endpoint, params = {}) => {
  try {
    const response = await tmdbClient.get(endpoint, { params });
    return response.data; // Returns the full object {}
  } catch (error) {
    console.error(`Error fetching details from ${endpoint}:`, error);
    return null; // Return null so components can handle "Not Found"
  }
};

// #--------------------------------------------------------------------------------------------------------#
// EXPORTS (Matches your original names exactly)
// #--------------------------------------------------------------------------------------------------------#

export const upcomingMovies = (page = 1) =>
  fetchList("/movie/popular", { page });
export const nowPlayingMovies = (page = 2) =>
  fetchList("/movie/now_playing", { page });
export const airingShows = (page = 1) => fetchList("/tv/on_the_air", { page });
export const popularMovies = () => fetchList("/movie/popular", { page: 2 });
export const popularTVShows = () => fetchList("/tv/popular", { page: 2 });
export const allMovies = (page = 1) => fetchList("/discover/movie", { page });
export const allTvshows = (page = 1) => fetchList("/discover/tv", { page });

// FIXED: Details now return the object correctly
export const movieDetails = (id) => fetchSingle(`/movie/${id}`);
export const showsDetails = (id) => fetchSingle(`/tv/${id}`);

export const movieVideos = async (id) => {
  const data = await fetchSingle(`/movie/${id}/videos`);
  const trailer = data?.results?.find(
    (vid) =>
      (vid.site === "YouTube" && vid.type === "Trailer") ||
      vid.type === "Teaser"
  );
  return trailer ? trailer.key : null;
};

export const showVideos = async (id) => {
  const data = await fetchSingle(`/tv/${id}/videos`);
  const trailer = data?.results?.find(
    (vid) =>
      (vid.site === "YouTube" && vid.type === "Trailer") ||
      vid.type === "Teaser"
  );
  return trailer ? trailer.key : null;
};

export const similarMovies = (id) => fetchList(`/movie/${id}/similar`);
export const similarShows = (id) => fetchList(`/tv/${id}/similar`);
export const fetchSearch = (query) => fetchList("/search/multi", { query });
export const fetchMoviesByGenre = (genre_id) =>
  fetchList("/discover/movie", { with_genres: genre_id });
export const fetchTvShowsByGenre = (genre_id, page = 1) =>
  fetchList("/discover/tv", { with_genres: genre_id, page });

export const movieCast = async (id) => {
  const data = await fetchSingle(`/movie/${id}/credits`);
  return data?.cast || [];
};

export const tvCast = async (id) => {
  const data = await fetchSingle(`/tv/${id}/credits`);
  return data?.cast || [];
};

export const movieReviews = (id) => fetchList(`/movie/${id}/reviews`);
export const tvReviews = (id) => fetchList(`/tv/${id}/reviews`);
export const recommendations = (id) =>
  fetchList(`/movie/${id}/recommendations`);
export const trendingAll = (timeWindow = "day") =>
  fetchList(`/trending/all/${timeWindow}`);
