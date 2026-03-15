import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import connectDB from "./config/db.config.js";
import { authRouter } from "./routes/auth.routes.js";
import { userRouter } from "./routes/user.routes.js";
import { mediaRouter } from "./routes/media.routes.js";
import { reviewRouter } from "./routes/review.routes.js";
import { WatchlaterRouter } from "./routes/watchLater.routes.js";
import { recommendationRouter } from "./routes/recommendation.routes.js";
import { wishlistRouter } from "./routes/wishlist.routes.js";
import { historyRouter } from "./routes/history.routes.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/movies", mediaRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/watchlater", WatchlaterRouter);
app.use("/api/history", historyRouter);

app.use("/api/recommendations", recommendationRouter);

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const startServer = async () => {
  try {
    await connectDB();

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start");
    console.error(error.message);
    process.exit(1);
  }
};

startServer();
