import Movie from "../models/movie.model.js";
import { fetchAndStorePopularMovies } from "../services/tmdbService.js";

export const syncMovies = async (req, res) => {
  try {
    console.log("🔄 Manual sync triggered...");
    const result = await fetchAndStorePopularMovies(5, 5);
    res.json({ message: "Sync complete", ...result });
  } catch (err) {
    console.error("Sync failed:", err);
    res.status(500).json({ error: err.message });
  }
};

export const fetchPopularMovies = async (req, res) => {
  try {
    let movies = await Movie.find().sort({ popularity: -1 }).limit(20);

    movies = movies.map((m) => ({
      ...m.toObject(),
      id: m.tmdbId,
    }));

    const ONE_DAY = 24 * 60 * 60 * 1000;

    const isOld =
      movies.length > 0 &&
      Date.now() - new Date(movies[0].lastUpdated) > ONE_DAY;

    if (movies.length === 0 || isOld) {
      console.log(`📡 Fetching from TMDB... (reason: ${movies.length === 0 ? 'empty DB' : 'data is old'})`);
      try {
        const result = await fetchAndStorePopularMovies();
        console.log(`✅ TMDB fetch complete:`, result);
      } catch (err) {
        console.error("❌ TMDB fetch failed:", err.message);
      }

      movies = await Movie.find().sort({ popularity: -1 }).limit(20);
      movies = movies.map((m) => ({
        ...m.toObject(),
        id: m.tmdbId,
      }));
    }

    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findOne({ tmdbId: Number(req.params.id) });

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json({ ...movie.toObject(), id: movie.tmdbId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMoviesByGenre = async (req, res) => {
  try {
    const genreId = Number(req.params.genreId);

    const movies = await Movie.find({
      genreIds: genreId,
    }).limit(20);

    res.json(movies.map((m) => ({ ...m.toObject(), id: m.tmdbId })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const searchMovies = async (req, res) => {
  try {
    const query = req.query.q;

    const movies = await Movie.find({
      $text: { $search: query },
    }).limit(20);

    res.json(movies.map((m) => ({ ...m.toObject(), id: m.tmdbId })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSimilarMovies = async (req, res) => {
  try {
    const movie = await Movie.findOne({ tmdbId: Number(req.params.id) });

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const recommendations = await Movie.find({
      genreIds: { $in: movie.genreIds },
      tmdbId: { $ne: movie.tmdbId },
    })
      .limit(20)
      .sort({ popularity: -1 });

    res.json(recommendations.map((m) => ({ ...m.toObject(), id: m.tmdbId })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};