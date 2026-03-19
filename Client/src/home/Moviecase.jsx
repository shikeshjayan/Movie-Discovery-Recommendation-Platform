import { useEffect, useState } from "react";
import { popularMovies } from "../services/tmdbApi";
import { Link, useNavigate } from "react-router-dom";
import { useWatchHistory } from "../context/WatchHistoryContext";
import { useWatchLater } from "../context/WatchLaterContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faClock, faDeleteLeft } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

import BlurImage from "../ui/BlurImage";
import UniversalCarousel from "../ui/UniversalCarousel";

const Moviecase = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToHistory } = useWatchHistory();
  const { addToWatchLater, removeFromWatchLater, isInWatchLater } =
    useWatchLater();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    popularMovies()
      .then(setMovies)
      .finally(() => setLoading(false));
  }, []);

  return (
    <UniversalCarousel
      title="Popular Movies"
      items={movies}
      loading={loading}
      renderItem={(movie) => {
        // use helper that normalizes stored items
        const isInWatchLaterFlag = isInWatchLater(movie.id);

        const isWishlisted = isInWishlist(movie.id, "movie");

        return (
          <motion.div
            key={movie.id}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 260 }}
            className="shrink-0">
            <Link
              to={`/movie/${movie.id}`}
              onClick={() =>
                addToHistory({
                  id: movie.id,
                  title: movie.title,
                  poster_path: movie.poster_path,
                  vote_average: movie.vote_average,
                  type: "movie",
                })
              }
              className="group block">
              <div className="relative w-48">
                <BlurImage
                  src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-67.5 rounded shadow-md"
                />

                {/* Watch later */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation(); // Stops the <Link> from triggering

                    if (!user) return navigate("/login");

                    const movieId = Number(movie.id);

                    if (isInWatchLaterFlag) {
                      removeFromWatchLater(movieId, "movie");
                    } else {
                      // Ensure you pass the object correctly
                      addToWatchLater(
                        {
                          movieId: movieId,
                          title: movie.title,
                          poster_path: movie.poster_path,
                          vote_average: movie.vote_average,
                        },
                        "movie",
                      );
                    }
                  }}
                  className="absolute z-10 top-2 left-2 bg-black/80 text-white p-2 rounded opacity-100 md:opacity-0 md:group-hover:opacity-100 transition">
                  <FontAwesomeIcon
                    icon={isInWatchLaterFlag ? faDeleteLeft : faClock}
                    className="cursor-pointer shadow"
                  />
                </button>

                {/* Wishlist */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!user) return navigate("/login");

                    isWishlisted
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
                    style={{ color: isWishlisted ? "#FF0000" : "#FFFFFF" }}
                    className="cursor-pointer"
                  />
                </button>

                <span
                  className="absolute bottom-2 left-2 bg-yellow-500 text-black
                font-bold text-sm px-3 py-1 rounded opacity-100 md:opacity-0 md:group-hover:opacity-100 transition">
                  ★ {movie.vote_average?.toFixed(1) ?? "N/A"}
                </span>
              </div>

              <h5 className="mt-2 text-center text-sm truncate w-48 wrap-break-word">
                {movie.title}
              </h5>
            </Link>
          </motion.div>
        );
      }}
    />
  );
};

export default Moviecase;
