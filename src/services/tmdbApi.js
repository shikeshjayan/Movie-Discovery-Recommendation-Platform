import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// #--------------------------------------------------------------------------------------------------------#
// BANNER - Upcoming Section
// #--------------------------------------------------------------------------------------------------------#
// Fetch Upcoming Movies - Banner
export const UpcomingMovies = async (page = 1) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching upcoming movies:", error);
    return [];
  }
};
// #--------------------------------------------------------------------------------------------------------#
// #--------------------------------------------------------------------------------------------------------#
// Fetch Upcoming Movies - Banner
export const nowPlayingMovies = async (page = 2) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${page}`
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching nowplaying movies:", error);
    return [];
  }
};
// #--------------------------------------------------------------------------------------------------------#
// #--------------------------------------------------------------------------------------------------------#
// Fetch Airing Shows - Banner
export const airingShows = async (page = 1) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/tv/on_the_air?api_key=${API_KEY}&language=en-US&page=${page}`
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching airing tvshows:", error);
    return [];
  }
};
// #--------------------------------------------------------------------------------------------------------#
// HOME - Popular Section
// #--------------------------------------------------------------------------------------------------------#
// Fetch for Popular Movies
export const popularMovies = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=2`
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return [];
  }
};
// #--------------------------------------------------------------------------------------------------------#
// #--------------------------------------------------------------------------------------------------------#

// Fetch Popular TV Shows
export const popularTVShows = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=en-US&page=2`
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching Popular tvshows movies:", error);
    return [];
  }
};

// #--------------------------------------------------------------------------------------------------------#
// Discover Section
// #--------------------------------------------------------------------------------------------------------#
// Fetch All Movies
export const allMovies = async (page = 1) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&page=${page}`
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching all movies:", error);
    return [];
  }
};
// #--------------------------------------------------------------------------------------------------------#
// #--------------------------------------------------------------------------------------------------------#
// Fetch All TV Shows
export const allTvshows = async (page = 1) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=en-US&page=${page}`
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching all tvshows:", error);
    return [];
  }
};
// Fetch Upcoming TV - Banner
export const UpcomingShows = async (page = 2) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=en-US&page=${page}`
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching upcoming shows:", error);
    return [];
  }
};
// #--------------------------------------------------------------------------------------------------------#
// Details Section
// #--------------------------------------------------------------------------------------------------------#
// Fetch Movie Details
export const movieDetails = async (id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return [];
  }
};
// #--------------------------------------------------------------------------------------------------------#
// #--------------------------------------------------------------------------------------------------------#
// Fetch Shows Details

export const showsDetails = async (id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=en-US`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching tvshows details:", error);
    return [];
  }
};
// #--------------------------------------------------------------------------------------------------------#
// Trailers/Teaser Section
// #--------------------------------------------------------------------------------------------------------#

// Fetch Movie Videos (Trailers)

export const movieVideos = async (id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=en-US`
    );
    const results = response.data.results;
    const trailer = results.find(
      (vid) =>
        (vid.site === "YouTube" && vid.type === "Trailer") ||
        vid.type === "Teaser"
    );

    return trailer ? trailer.key : null;
  } catch (error) {
    console.error("Error fetching movie Videos:", error);
    return [];
  }
};
// #--------------------------------------------------------------------------------------------------------#
// #--------------------------------------------------------------------------------------------------------#
// Fetch TV Videos (Trailers)

export const showVideos = async (id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/tv/${id}/videos?api_key=${API_KEY}&language=en-US`
    );
    const results = response.data.results;
    const trailer = results.find(
      (vid) =>
        (vid.site === "YouTube" && vid.type === "Trailer") ||
        vid.type === "Teaser"
    );

    return trailer ? trailer.key : null;
  } catch (error) {
    console.error("Error fetching tvshows videos:", error);
    return [];
  }
};
// #--------------------------------------------------------------------------------------------------------#
// Similar Section
// #--------------------------------------------------------------------------------------------------------#
// Fetch for Similar Movies
export const similarMovies = async (id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}&language=en-US&page=1`
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching similar movies:", error);
    return [];
  }
};
// #--------------------------------------------------------------------------------------------------------#
// #--------------------------------------------------------------------------------------------------------#
// Fetch for Similar TV Shows
export const similarShows = async (id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/tv/${id}/similar?api_key=${API_KEY}&language=en-US&page=1`
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching similar tvshows:", error);
    return [];
  }
};
// #--------------------------------------------------------------------------------------------------------#
// Search Section
// #--------------------------------------------------------------------------------------------------------#
// Fetch for Search Media
export const fetchSearch = async (query) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${query}`
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching search media:", error);
    return [];
  }
};
// #--------------------------------------------------------------------------------------------------------#
// Genre Section
// #--------------------------------------------------------------------------------------------------------#
// Fetch Movie Genre
export const fetchMoviesByGenre = async (genre_id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genre_id}`
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching movie genre:", error);
    return [];
  }
};
// #--------------------------------------------------------------------------------------------------------#
// #--------------------------------------------------------------------------------------------------------#
// Fetch TV Shows Genre
export const fetchTvShowsByGenre = async (genre_id, page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/discover/tv`, {
      params: {
        api_key: API_KEY,
        with_genres: genre_id,
        page,
      },
    });

    return response.data.results;
  } catch (error) {
    console.error("Error fetching tvshows genre:", error);
    return [];
  }
};
// #--------------------------------------------------------------------------------------------------------#
// Credits/Cast Section
// #--------------------------------------------------------------------------------------------------------#
// Fetch for Movies Cast
export const movieCast = async (id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}&language=en-US&page=1`
    );
    return response.data.cast;
  } catch (error) {
    console.error("Error fetching movie cast:", error);
    return [];
  }
};
// #--------------------------------------------------------------------------------------------------------#
// #--------------------------------------------------------------------------------------------------------#
// Fetch for TV Cast
export const tvCast = async (id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/tv/${id}/credits?api_key=${API_KEY}&language=en-US&page=1`
    );
    return response.data.cast;
  } catch (error) {
    console.error("Error fetching tvshows cast:", error);
    return [];
  }
};
// #--------------------------------------------------------------------------------------------------------#
// Reviews Section
// #--------------------------------------------------------------------------------------------------------#
// Fetch for Movies Review
export const movieReviews = async (id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/movie/${id}/reviews?api_key=${API_KEY}&language=en-US&page=1`
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching movie reviews:", error);
    return [];
  }
};
// #--------------------------------------------------------------------------------------------------------#
// #--------------------------------------------------------------------------------------------------------#
// Fetch for TV Review
export const tvReviews = async (id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/tv/${id}/reviews?api_key=${API_KEY}&language=en-US&page=1`
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching tvshows reviews:", error);
    return [];
  }
};
// #--------------------------------------------------------------------------------------------------------#
// #--------------------------------------------------------------------------------------------------------#
// Fetch for recommendation
export const recommendations = async (id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/movie/${id}/recommendations?api_key=${API_KEY}&language=en-US&page=1`
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
};
// #--------------------------------------------------------------------------------------------------------#
// #--------------------------------------------------------------------------------------------------------#
// Fetch for Trending
export const trendingAll = async (timeWindow = "day") => {
  try {
    const response = await axios.get(
      `${BASE_URL}/trending/all/${timeWindow}?api_key=${API_KEY}&language=en-US&page=1`
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching trending all:", error);
    return [];
  }
};
