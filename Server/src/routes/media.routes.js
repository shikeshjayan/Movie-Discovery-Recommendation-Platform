// routes/movie.routes.js
import express from "express";
import {
  fetchAllMedia,
  fetchPopularMovies,
  fetchPopularTV,
  fetchSearchResults,
  fetchMovieDetails,
  fetchTVDetails,
} from "../controllers/media.controller.js";

export const mediaRouter = express.Router();

mediaRouter.get("/all", fetchAllMedia); // ← single fetch for everything
mediaRouter.get("/popular", fetchPopularMovies);
mediaRouter.get("/popular-tv", fetchPopularTV);
mediaRouter.get("/search", fetchSearchResults);
mediaRouter.get("/movie/:id", fetchMovieDetails);
mediaRouter.get("/tv/:id", fetchTVDetails);
