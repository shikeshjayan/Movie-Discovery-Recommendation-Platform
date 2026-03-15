import dotenv from "dotenv";
import { getPopularMovies, getGenreMap } from "./src/services/tmdbService.js";

dotenv.config();

async function testTMDB() {
  try {
    console.log("Testing TMDB service...");
    console.log(
      "TMDB_API_KEY:",
      process.env.TMDB_API_KEY
        ? "Set (" + process.env.TMDB_API_KEY.substring(0, 8) + "...)"
        : "Not set",
    );
    console.log("TMDB_BASE_URL:", process.env.TMDB_BASE_URL);

    const genreMap = await getGenreMap();
    console.log("Genre map:", Object.keys(genreMap).length, "genres");

    const movies = await getPopularMovies(1);
    console.log("Movies fetched:", movies.length);
    if (movies.length > 0) {
      console.log("First movie:", movies[0].title);
    }
  } catch (error) {
    console.error("Error:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
  }
}

testTMDB();
