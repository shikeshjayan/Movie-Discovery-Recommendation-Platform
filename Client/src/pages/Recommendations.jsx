// src/pages/Recommendations.jsx
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { useWatchHistory } from "../context/WatchHistoryContext";
import { useWatchLater } from "../context/WatchLaterContext";
import useRecommendations from "../hooks/useRecommendations";
import ImageWithLoader from "../ui/ImageWithLoader";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faDeleteLeft, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useWishlist } from "../context/WishlistContext";

const PAGE_SIZE = 12; // movies per page

const Recommendations = () => {
  const { user } = useContext(AuthContext);
  const { addToHistory } = useWatchHistory();
  const { addToWatchLater, removeFromWatchLater, isInWatchLater } =
    useWatchLater();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const navigate = useNavigate();

  const [page, setPage] = useState(1);

  const userId = user?._id || user?.id;
  const { movies, source, loading, error } = useRecommendations();

  // Deduplicate movies by id
  const uniqueMovies = Array.from(
    new Map(movies.map((m) => [m.id, m])).values(),
  );

  // Paginate the movies array locally
  const totalPages = Math.ceil(uniqueMovies.length / PAGE_SIZE);
  const paginatedMovies = uniqueMovies.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const handleMovieClick = (movie) => {
    if (!user) {
      navigate("/login", {
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

  // ── Skeleton ─────────────────────────────────────────────────
  if (loading) {
    return (
      <section className="py-5 flex flex-col gap-6">
        <div className="flex items-center gap-3 px-4">
          <h4 className="text-3xl">For You</h4>
          <span className="text-xs px-2 py-1 rounded-full font-medium bg-yellow-100 text-yellow-700 animate-pulse">
            Loading...
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 justify-items-center px-4">
          {Array(12)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="w-50 flex flex-col gap-2">
                <div className="w-50 h-75 rounded shadow-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse mx-2" />
              </div>
            ))}
        </div>
      </section>
    );
  }

  // ── Error ─────────────────────────────────────────────────────
  if (error) {
    return (
      <section className="py-5 px-4 flex flex-col gap-4">
        <h4 className="text-3xl">For You</h4>
        <p className="text-red-400 text-sm">{error}</p>
      </section>
    );
  }

  // ── Empty ─────────────────────────────────────────────────────
  if (!movies.length) {
    return (
      <section className="py-5 px-4 flex flex-col gap-4">
        <h4 className="text-3xl">For You</h4>
        <p className="text-gray-400 text-sm mt-2">
          Watch a movie to get recommendations 🎬
        </p>
      </section>
    );
  }

  // ── Main ──────────────────────────────────────────────────────
  return (
    <section className="py-5 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3 px-4">
        <h4 className="text-3xl">For You</h4>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${
            source?.startsWith("ml")
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}>
          {source?.startsWith("ml") ? "✦ AI Picks" : "Recommended"}
        </span>
      </div>

      {/* Grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 justify-items-center px-4"
        role="list"
        aria-label="Recommended movies">
        {paginatedMovies.map((movie) => {
          if (!movie.poster_path) return null;
          const inWatchLater = isInWatchLater(movie.id);

          return (
            <motion.div
              key={movie.id}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 260 }}
              className="shrink-0"
              role="listitem"
              aria-label={`Movie: ${movie.title}`}>
              <div
                onClick={() => handleMovieClick(movie)}
                className="relative group cursor-pointer">
                {/* Poster */}
                <ImageWithLoader
                  src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                  alt={movie.title}
                  className="w-50 h-75 rounded shadow-md object-cover"
                  onError={(e) => {
                    e.target.src = "/Loader.svg";
                  }}
                />

                {/* Watch Later */}
                {user && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      inWatchLater
                        ? removeFromWatchLater(movie.id, "movie")
                        : addToWatchLater(
                            {
                              ...movie,
                              movieId: movie.id,
                            },
                            "movie",
                          );
                    }}
                    aria-label={
                      inWatchLater
                        ? `Remove ${movie.title} from watch later`
                        : `Add ${movie.title} to watch later`
                    }
                    className="absolute top-2 left-2 bg-black text-white px-2 py-1 rounded text-sm
                      opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 ease-in-out cursor-pointer">
                    {inWatchLater ? (
                      <FontAwesomeIcon icon={faDeleteLeft} />
                    ) : (
                      <FontAwesomeIcon icon={faClock} />
                    )}
                  </button>
                )}

                {/* Wishlist */}
                {user && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      isInWishlist(movie.id, "movie")
                        ? removeFromWishlist(movie.id, "movie")
                        : addToWishlist({
                            id: movie.id,
                            title: movie.title,
                            poster_path: movie.poster_path,
                            vote_average: movie.vote_average,
                            type: "movie",
                          });
                    }}
                    className="absolute top-2 right-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition">
                    <FontAwesomeIcon
                      icon={faHeart}
                      style={{
                        color: isInWishlist(movie.id, "movie")
                          ? "#FF0000"
                          : "#FFFFFF",
                      }}
                      className="cursor-pointer shadow"
                    />
                  </button>
                )}

                {/* Rating */}
                <span
                  className="absolute bottom-10 left-2 bg-yellow-500 text-black font-bold text-sm px-3 py-1 rounded
                    opacity-100 md:opacity-100 md:group-hover:opacity-100 transition-opacity duration-300">
                  ★ {movie.vote_average?.toFixed(1) ?? "N/A"}
                </span>

                {/* Title */}
                <h5 className="w-50 px-2 text-center mt-2 truncate">
                  {movie.title}
                </h5>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Pagination — identical to Movies.jsx */}
      {totalPages > 1 && (
        <div className="w-full flex justify-center py-4">
          <div className="flex gap-2">
            {/* Prev */}
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
              }`}>
              Prev
            </motion.button>

            {/* Page indicator */}
            <span className="flex items-center px-3 font-mono text-gray-400">
              Page {page} of {totalPages}
            </span>

            {/* Next */}
            <motion.button
              whileHover={{ scale: page === totalPages ? 1 : 1.05 }}
              whileTap={{ scale: page === totalPages ? 1 : 0.95 }}
              disabled={page === totalPages}
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              aria-label="Next page"
              className={`px-4 py-2 rounded border transition-colors ${
                page === totalPages
                  ? "opacity-50 cursor-not-allowed bg-gray-800 border-gray-700 text-gray-500"
                  : "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
              }`}>
              Next
            </motion.button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Recommendations;
