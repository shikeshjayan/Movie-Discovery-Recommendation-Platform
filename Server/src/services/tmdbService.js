// services/tmdbService.js
import axios from "axios";
import Movie from "../models/movie.model.js";
import { withRetry, tmdbClient, wait, getGenreMap } from "../utils/genreUtils.js";

const fetchGenresFromTMDB = async () => {
  const [movieGenresRes, tvGenresRes] = await Promise.all([
    axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.TMDB_API_KEY}`),
    axios.get(`https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.TMDB_API_KEY}`),
  ]);

  const genreMap = {};
  [...movieGenresRes.data.genres, ...tvGenresRes.data.genres].forEach((g) => {
    genreMap[g.id] = g.name;
  });
  return genreMap;
};

const BATCH_SIZE = 5;
const PAGE_DELAY = 200;

const fetchPageBatch = async (type, pages) => {
  const [moviesRes, tvRes] = await Promise.all([
    Promise.all(pages.map((page) => tmdbClient.get(`/${type}/popular`, { params: { page } }))),
    Promise.all(pages.map((page) => tmdbClient.get(`/tv/popular`, { params: { page } }))),
  ]);

  return {
    movies: moviesRes.flatMap((res) => res.data.results),
    tv: tvRes.flatMap((res) => res.data.results),
  };
};

export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export const getImageUrl = (path, size = "w500") => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getGenreNames = async (genreIds) => {
  const map = await getGenreMap();
  return (genreIds || []).map((id) => map[id]).filter(Boolean);
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

export const discover = async (type, page = 1) => {
  const res = await tmdbClient.get(`/discover/${type}`, {
    params: { page },
  });
  return res.data.results;
};

export const getMoviesByCategory = async (category, page = 1) => {
  const endpoints = {
    popular: "/movie/popular",
    top_rated: "/movie/top_rated",
    now_playing: "/movie/now_playing",
    trending: "/trending/movie/week",
    upcoming: "/movie/upcoming",
    tv_popular: "/tv/popular",
    tv_top_rated: "/tv/top_rated",
    tv_airing_today: "/tv/airing_today",
    tv_on_the_air: "/tv/on_the_air",
  };

  const url = endpoints[category];
  if (!url) return [];

  const res = await tmdbClient.get(url, { params: { page } });
  return res.data.results;
};

export const getMovieTrailer = async (id, type = "movie") => {
  return withRetry(async () => {
    const res = await tmdbClient.get(`/${type}/${id}/videos`);
    const videos = res.data.results;
    const trailer = videos.find(
      (v) => v.type === "Trailer" && v.site === "YouTube",
    );
    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
  });
};

export const getMovieCredits = async (id, type = "movie") => {
  return withRetry(async () => {
    const res = await tmdbClient.get(`/${type}/${id}/credits`);
    const data = res.data;
    return {
      directors: data.crew
        .filter((c) => c.job === "Director")
        .map((c) => c.name),
      cast: data.cast
        .slice(0, 10)
        .map((c) => ({ name: c.name, character: c.character })),
    };
  });
};

export const getExternalIds = async (id, type = "movie") => {
  return withRetry(async () => {
    const res = await tmdbClient.get(`/${type}/${id}/external_ids`);
    return res.data;
  });
};

export const getReviews = async (id, type = "movie") => {
  return withRetry(async () => {
    const res = await tmdbClient.get(`/${type}/${id}/reviews`);
    return res.data.results.slice(0, 10).map((r) => ({
      id: r.id,
      author: r.author,
      content: r.content,
      created_at: r.created_at,
      rating: r.author_details?.rating,
    }));
  });
};
// # --------------------------------------------------------------------------------------------

// Fetch Movies from TMDB
export const fetchAndStorePopularMovies = async (maxPages = 5, batchSize = BATCH_SIZE) => {
  try {
    const genreMap = await fetchGenresFromTMDB();
    let totalImported = 0;
    let errors = 0;

    for (let i = 1; i <= maxPages; i += batchSize) {
      const pageBatch = [];
      for (let j = 0; j < batchSize && i + j <= maxPages; j++) {
        pageBatch.push(i + j);
      }

      console.log(`📦 Processing batch: pages ${pageBatch[0]}-${pageBatch[pageBatch.length - 1]}`);

      const { movies } = await withRetry(async () => {
        const [moviesRes] = await Promise.all([
          Promise.all(pageBatch.map((page) => tmdbClient.get("/movie/popular", { params: { page } }))),
        ]);
        return { movies: moviesRes.flatMap((res) => res.data.results) };
      });

      const operations = movies.map((movie) => ({
        updateOne: {
          filter: { tmdbId: movie.id },
          update: {
            $set: {
              tmdbId: movie.id,
              title: movie.title,
              overview: movie.overview,
              genreIds: movie.genre_ids,
              genres: (movie.genre_ids || []).map((id) => ({ id, name: genreMap[id] || "Unknown" })),
              posterPath: movie.poster_path,
              backdropPath: movie.backdrop_path,
              releaseDate: movie.release_date ? new Date(movie.release_date) : null,
              popularity: movie.popularity,
              voteAverage: movie.vote_average,
              voteCount: movie.vote_count,
              originalLanguage: movie.original_language,
              lastUpdated: new Date(),
            },
          },
          upsert: true,
        },
      }));

      const result = await Movie.bulkWrite(operations, { ordered: false });
      totalImported += result.upsertedCount + result.modifiedCount;
      errors += result.upsertedCount + result.modifiedCount === 0 ? movies.length : 0;

      console.log(`✅ Batch done — imported: ${totalImported}, errors: ${errors}`);
      await wait(PAGE_DELAY);
    }

    console.log(`\n✅ Complete — Total imported: ${totalImported}, Errors: ${errors}`);
    return { totalImported, errors };
  } catch (error) {
    console.error("TMDB Fetch Error:", error.message);
    throw error;
  }
};
