// src/scripts/importMedia.js
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Use the same dotenv approach as server.js
dotenv.config();

console.log(
  "TMDB_API_KEY:",
  process.env.TMDB_API_KEY ? "✅ Loaded" : "❌ Missing",
);
console.log("MONGO_URL:", process.env.MONGO_URL ? "✅ Loaded" : "❌ Missing");

import mongoose from "mongoose";
import axios from "axios";
import Media from "../models/media.model.js"; // ✅ src/models/

// Configuration - change MAX_PAGES to fetch more/less data
const MAX_PAGES = process.argv.includes("--all") ? 500 : 10; // Default 10 pages, use --all for all 500

await mongoose.connect(process.env.MONGO_URL);
console.log("✅ MongoDB connected");

const importMedia = async () => {
  console.log(`🚀 Starting media import... (Max pages: ${MAX_PAGES})`);
  let total = 0;
  let errors = 0;

  // ✅ Fetch genre map using direct axios
  console.log("Fetching genre map...");
  const [movieGenresRes, tvGenresRes] = await Promise.all([
    axios.get(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.TMDB_API_KEY}`,
    ),
    axios.get(
      `https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.TMDB_API_KEY}`,
    ),
  ]);

  const genreMap = {};
  [...movieGenresRes.data.genres, ...tvGenresRes.data.genres].forEach((g) => {
    genreMap[g.id] = g.name;
  });
  console.log("✅ Genre map fetched:", Object.keys(genreMap).length, "genres");

  const clearExisting = process.argv.includes("--clear");
  if (clearExisting) {
    await Media.deleteMany({});
    console.log("🗑️ Old media cleared");
  }

  for (let page = 1; page <= MAX_PAGES; page++) {
    console.log(`📄 Fetching page ${page}/${MAX_PAGES}...`);

    try {
      // ✅ Fetch movies and TV using direct axios
      const [moviesRes, tvRes] = await Promise.all([
        axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&page=${page}`,
        ),
        axios.get(
          `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.TMDB_API_KEY}&page=${page}`,
        ),
      ]);

      const combined = [
        ...moviesRes.data.results.map((m) => ({ ...m, mediaType: "movie" })),
        ...tvRes.data.results.map((t) => ({ ...t, mediaType: "tv" })),
      ];

      for (const item of combined) {
        try {
          await Media.findOneAndUpdate(
            { tmdbId: item.id, mediaType: item.mediaType },
            {
              tmdbId: item.id,
              mediaType: item.mediaType,
              title: item.title || item.name,
              overview: item.overview,
              posterPath: item.poster_path,
              backdropPath: item.backdrop_path,
              releaseDate: item.release_date || item.first_air_date || null,
              popularity: item.popularity,
              voteAverage: item.vote_average,
              voteCount: item.vote_count,
              language: item.original_language,
              genres: (item.genre_ids || []).map(
                (id) => genreMap[id] || "Unknown",
              ),
            },
            { upsert: true, returnDocument: "after" },
          );
          total++;
        } catch (err) {
          errors++;
          if (errors <= 5)
            console.error(`❌ Failed to save ${item.id}:`, err.message);
        }
      }

      console.log(`✅ Page ${page} done — total: ${total}`);
      await new Promise((resolve) => setTimeout(resolve, 250));
    } catch (err) {
      console.error(`❌ Page ${page} failed:`, err.message);
    }
  }

  console.log(`\n✅ Done — Total imported: ${total}, Errors: ${errors}`);
  await mongoose.disconnect();
  process.exit();
};

importMedia();
