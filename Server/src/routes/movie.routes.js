import express from "express";
import { fetchPopularMovies, getMovieById, getMoviesByGenre, getSimilarMovies, searchMovies, syncMovies } from "../controllers/movie.controller.js";

export const movieRouter = express.Router();

movieRouter.get("/sync", syncMovies);
movieRouter.get("/popular", fetchPopularMovies);
movieRouter.get("/:id", getMovieById);
movieRouter.get("/genre/:genreId", getMoviesByGenre);
movieRouter.get("/search", searchMovies);
movieRouter.get("/:id/recommendations", getSimilarMovies);