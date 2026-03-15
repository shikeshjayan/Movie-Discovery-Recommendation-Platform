import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getRecommendations } from "../controllers/recommendation.controller.js";
export const recommendationRouter = express.Router();

recommendationRouter.get("/", protect, getRecommendations);