import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_KEY;
const BASE_URL = "https://api.themoviedb.org/3";


// Fetch Upcoming Movies - Banner
export const UpcomingMovies = async (page = 1) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`
        );
        return response.data.results;
    } catch (error) {
        console.error("Error fetching trending movies:", error);
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
        console.error("Error fetching trending movies:", error);
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
        console.error("Error fetching trending movies:", error);
        return [];
    }
};
// #--------------------------------------------------------------------------------------------------------#
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
        console.error("Error fetching Popular Tv Shows movies:", error);
        return [];
    }
};

// #--------------------------------------------------------------------------------------------------------#
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
        console.error("Error fetching trending movies:", error);
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
        console.error("Error fetching trending movies:", error);
        return [];
    }
};
// #--------------------------------------------------------------------------------------------------------#
// #--------------------------------------------------------------------------------------------------------#
// Fetch Movie Details
export const movieDetails = async (id) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching trending movies:", error);
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
        console.error("Error fetching trending movies:", error);
        return [];
    }
};
// #--------------------------------------------------------------------------------------------------------#
// #--------------------------------------------------------------------------------------------------------#

// Fetch Movie Videos (Trailers)

export const movieVideos = async (id) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=en-US`
        );
        const results = response.data.results;
        const trailer = results.find(
            (vid) => vid.site === "YouTube" && vid.type === "Trailer" || vid.type === "Teaser"
        );

        return trailer ? trailer.key : null;

    } catch (error) {
        console.error("Error fetching trending movies:", error);
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
            (vid) => vid.site === "YouTube" && vid.type === "Trailer" || vid.type === "Teaser"
        );

        return trailer ? trailer.key : null;

    } catch (error) {
        console.error("Error fetching trending movies:", error);
        return [];
    }
};
// #--------------------------------------------------------------------------------------------------------#
// #--------------------------------------------------------------------------------------------------------#
// Fetch for Similar Movies
export const similarMovies = async (id) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}&language=en-US&page=1`
        );
        return response.data.results;
    } catch (error) {
        console.error("Error fetching trending movies:", error);
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
        console.error("Error fetching trending movies:", error);
        return [];
    }
};
// #--------------------------------------------------------------------------------------------------------#
// #--------------------------------------------------------------------------------------------------------#
// Fetch for Search Media
export const fetchSearch = async (query) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${query}`
        );
        return response.data.results;
    } catch (error) {
        console.error("Error fetching trending movies:", error);
        return [];
    }
};
// #--------------------------------------------------------------------------------------------------------#
// #--------------------------------------------------------------------------------------------------------#
// Fetch Movie Genre
export const movieGenre = async () => {
    try {
        const response = await axios.get(
            `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US&page=1`
        );
        return response.data.genres;

    } catch (error) {
        console.error("Error fetching trending movies:", error);
        return [];
    }
};
// #--------------------------------------------------------------------------------------------------------#
// #--------------------------------------------------------------------------------------------------------#
// Fetch Movie Genre
export const fetchMoviesByGenre = async (genre_id) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genre_id}`
        );
        return response.data.results;

    } catch (error) {
        console.error("Error fetching trending movies:", error);
        return [];
    }
};
// #--------------------------------------------------------------------------------------------------------#
// #--------------------------------------------------------------------------------------------------------#
// Fetch TV Shows Genre
export const fetchTvShowsByGenre = async (genre_id) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=${genre_id}`
        );
        return response.data.results;

    } catch (error) {
        console.error("Error fetching trending movies:", error);
        return [];
    }
};
// #--------------------------------------------------------------------------------------------------------#
// #--------------------------------------------------------------------------------------------------------#
