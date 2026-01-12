import { useEffect, useState } from "react";
import { airingShows } from "../services/tmdbApi";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const AiringShowsBanner = () => {
  const [airingShowsList, setAiringShowsList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ---------------- Fetch Shows ----------------
  useEffect(() => {
    airingShows().then(setAiringShowsList);
  }, []);

  // ---------------- Auto Slide ----------------
  useEffect(() => {
    if (airingShowsList.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === airingShowsList.length - 1 ? 0 : prev + 1
      );
    }, 6000);

    return () => clearInterval(interval);
  }, [airingShowsList]);

  if (airingShowsList.length === 0) return null;

  const show = airingShowsList[currentIndex];
  if (!show || !show.backdrop_path) return null;

  // ---------------- Navigation ----------------
  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? airingShowsList.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === airingShowsList.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section className="relative w-full h-[80vh] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={show.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Backdrop image */}
          <img
            src={`https://image.tmdb.org/t/p/original${show.backdrop_path}`}
            alt={show.title || show.name}
            className="w-full h-full object-cover sm:aspect-square"
          />

          {/* Gradient overlay */}
          <div className="absolute bottom-0 left-0 w-full h-[50%] bg-linear-to-t from-black/80 to-transparent"></div>

          {/* Text content */}
          <div className="absolute bottom-10 left-6 max-w-3xl text-white">
            <motion.h2
              key={show.id + "-title"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold"
            >
              {show.original_title || show.name}
            </motion.h2>

            <motion.div
              key={show.id + "-details"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-2 text-sm sm:text-base md:text-lg flex gap-4 items-center"
            >
              <span className="text-yellow-400 font-bold">
                {show.vote_average.toFixed(1)} / 10
              </span>
              <span className="italic">{show.original_language}</span>
            </motion.div>

            <motion.p
              key={show.id + "-overview"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-4 text-sm sm:text-base md:text-lg font-light max-w-xl"
            >
              {show.overview}
            </motion.p>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={handlePrev}
            aria-label="Previous show"
            className="absolute top-1/2 left-4 -translate-y-1/2 text-white bg-black/50 p-2 rounded-full hover:bg-black/70 transition"
          >
            <FaChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next show"
            className="absolute top-1/2 right-4 -translate-y-1/2 text-white bg-black/50 p-2 rounded-full hover:bg-black/70 transition"
          >
            <FaChevronRight size={24} />
          </button>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default AiringShowsBanner;
