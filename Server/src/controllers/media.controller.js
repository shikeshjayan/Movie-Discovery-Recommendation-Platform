// controllers/media.controller.js
import Media from "../models/media.model.js";
import {
  getPopularMovies,
  getPopularTV,
  searchMedia,
  getMovieDetails,
  getTVDetails,
} from "../services/tmdbService.js";

// ✅ Fetch from MongoDB (after import script runs)
export const fetchAllMedia = async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (type) query.mediaType = type; // filter by 'movie' or 'tv'

    const [media, total] = await Promise.all([
      Media.find(query)
        .sort({ popularity: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Media.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: media,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchPopularMovies = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const movies = await getPopularMovies(page);
    res.status(200).json({ success: true, data: movies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchPopularTV = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const tv = await getPopularTV(page);
    res.status(200).json({ success: true, data: tv });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchSearchResults = async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    if (!query) {
      return res.status(400).json({ success: false, message: "Query is required" });
    }
    const results = await searchMedia(query, page);
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchMovieDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await getMovieDetails(id); // ✅ now imported
    res.status(200).json({ success: true, data: movie });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchTVDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const tv = await getTVDetails(id); // ✅ now imported
    res.status(200).json({ success: true, data: tv });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};