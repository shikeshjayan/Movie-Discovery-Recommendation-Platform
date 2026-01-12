import { useEffect, useState } from "react";
import { allMovies, fetchMoviesByGenre } from "../services/tmdbApi";
import { useNavigate } from "react-router-dom";
import Banner from "../movies/Banner";
import GenreBar from "../movies/GenreBar";
import ImageWithLoader from "../ui/ImageWithLoader";
import { useHistory } from "../context/HistoryContext";
import { useAuth } from "../context/AuthContext";
import { useWatchLater } from "../context/WatchLaterContext";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

const Movies = () => {
  const { watchLater, addToWatchLater, removeFromWatchLater } = useWatchLater();
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const { addToHistory } = useHistory();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Navigate to movie details and add to history
  const handleMovieClick = (movie) => {
    if (!user) {
      navigate("/signin", {
        state: { from: `/movie/${movie.id}` },
        replace: true,
      });
      return;
    }

    addToHistory({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      type: "movie",
    });

    navigate(`/movie/${movie.id}`);
  };

  // Load all movies
  useEffect(() => {
    allMovies(page).then(setMovies);
  }, [page]);

  // Load trending movies
  const loadTrending = async () => {
    const data = await allMovies();
    setMovies(data);
  };

  // Load movies by genre
  const handleGenreChange = async (id) => {
    if (id === "trending") {
      await loadTrending();
    } else {
      const data = await fetchMoviesByGenre(id);
      setMovies(data);
    }
  };

  return (
    <section className="py-5 flex flex-col gap-6">
      {/* -------------------- Banner -------------------- */}
      <Banner />

      {/* -------------------- Genre Selection -------------------- */}
      <GenreBar setGenre={handleGenreChange} />

      {/* -------------------- Movies Grid -------------------- */}
      <h4 className="text-3xl px-4">Movies</h4>

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 justify-items-center px-4"
        role="list"
        aria-label="Movies list"
      >
        {movies.slice(0, 12).map((movie) => {
          if (!movie.poster_path) return null;

          const isInWatchLater = watchLater.some((m) => m.id === movie.id);

          return (
            <motion.div
              key={movie.id}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 260 }}
              className="shrink-0"
              role="listitem"
              aria-label={`Movie: ${movie.title || movie.name}`}
            >
              <div
                onClick={() => handleMovieClick(movie)}
                className="relative group cursor-pointer"
              >
                {/* Movie Poster */}
                <ImageWithLoader
                  src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                  alt={movie.original_title || movie.name}
                  className="w-50 h-75 rounded shadow-md object-cover"
                  onError={(e) => {
                    e.target.src = "/Loader.svg";
                  }}
                />

                {/* Watch Later Button */}
                {user && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent navigation
                      isInWatchLater
                        ? removeFromWatchLater(movie.id)
                        : addToWatchLater(movie);
                    }}
                    aria-label={
                      isInWatchLater
                        ? `Remove ${movie.title} from watch later`
                        : `Add ${movie.title} to watch later`
                    }
                    className="absolute top-2 left-2 bg-black text-white px-2 py-1 rounded text-sm
                  opacity-100 lg:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 ease-in-out cursor-pointer"
                  >
                    {isInWatchLater ? (
                      <FontAwesomeIcon icon={faDeleteLeft} />
                    ) : (
                      <FontAwesomeIcon icon={faClock} />
                    )}
                  </button>
                )}

                {/* Rating Badge */}
                <span
                  className="absolute top-2 right-2 bg-yellow-500 text-black font-bold text-sm px-3 py-1 rounded
                    opacity-100 lg:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"
                >
                  ★ {movie.vote_average?.toFixed(1) ?? "N/A"}
                </span>

                {/* Movie Title */}
                <h5 className="w-50 px-2 text-center mt-2 truncate">
                  {movie.name || movie.title}
                </h5>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* -------------------- Pagination -------------------- */}
      <div className="w-full flex justify-center py-4">
        <div className="flex gap-2">
          {/* Previous Button */}
          <motion.button
            whileHover={{ scale: page === 1 ? 1 : 1.05 }}
            whileTap={{ scale: page === 1 ? 1 : 0.95 }}
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            aria-label="Previous page"
            className={`px-4 py-2 rounded border transition-colors ${
              page === 1
                ? "opacity-50 cursor-not-allowed bg-gray-800 border-gray-700 text-gray-500"
                : "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Prev
          </motion.button>

          {/* Current Page */}
          <span className="flex items-center px-3 font-mono text-gray-400">
            Page {page}
          </span>

          {/* Next Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPage((prev) => prev + 1)}
            aria-label="Next page"
            className="px-4 py-2 rounded border bg-blue-600 border-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Next
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default Movies;
