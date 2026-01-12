import { useEffect, useState } from "react";
import { nowPlayingMovies } from "../services/tmdbApi";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

/**
 * NowPlayingBanner
 * --------------------------------------------------
 * Displays a full-screen banner carousel for now-playing movies.
 * - Auto-sliding with interval
 * - Manual navigation with arrows
 * - Fade-in/out transitions with Framer Motion
 * - Responsive text overlay
 */
const NowPlayingBanner = () => {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ---------------- Fetch now-playing movies ----------------
  useEffect(() => {
    nowPlayingMovies().then(setMovies);
  }, []);

  // ---------------- Auto slide every 6 seconds ----------------
  useEffect(() => {
    if (!movies.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
    }, 6000);

    return () => clearInterval(interval);
  }, [movies]);

  if (!movies.length) return null;

  const movie = movies[currentIndex];
  if (!movie?.backdrop_path) return null;

  // ---------------- Manual navigation ----------------
  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
  const handleNext = () =>
    setCurrentIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1));

  return (
    <section className="relative w-full h-[80vh] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={movie.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Movie backdrop */}
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-full object-cover sm:aspect-square"
          />

          {/* Gradient overlay */}
          <div className="absolute bottom-0 left-0 w-full h-[50%] bg-linear-to-t from-black/80 to-transparent" />

          {/* Text content */}
          <div className="absolute bottom-10 left-6 max-w-3xl text-white">
            {/* Title */}
            <motion.h2
              key={movie.id + "-title"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold"
            >
              {movie.original_title || movie.title}
            </motion.h2>

            {/* Rating & Language */}
            <motion.div
              key={movie.id + "-details"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-2 text-sm sm:text-base md:text-lg flex gap-4 items-center"
            >
              <span className="text-yellow-400 font-bold">
                {movie.vote_average.toFixed(1)} / 10
              </span>
              <span className="italic">{movie.original_language}</span>
            </motion.div>

            {/* Overview */}
            <motion.p
              key={movie.id + "-overview"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-4 text-sm sm:text-base md:text-lg font-light max-w-xl"
            >
              {movie.overview}
            </motion.p>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={handlePrev}
            aria-label="Previous movie"
            className="absolute top-1/2 left-4 -translate-y-1/2 text-white bg-black/50 p-2 rounded-full hover:bg-black/70 transition"
          >
            <FaChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next movie"
            className="absolute top-1/2 right-4 -translate-y-1/2 text-white bg-black/50 p-2 rounded-full hover:bg-black/70 transition"
          >
            <FaChevronRight size={24} />
          </button>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default NowPlayingBanner;
