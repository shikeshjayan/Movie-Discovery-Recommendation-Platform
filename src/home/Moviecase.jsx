import { useEffect, useState } from "react";
import { popularMovies } from "../services/tmdbApi";
import { Link, useNavigate } from "react-router-dom";
import { useHistory } from "../context/HistoryContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faClock, faDeleteLeft } from "@fortawesome/free-solid-svg-icons";
import { useWatchLater } from "../context/WatchLaterContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext"; // ✅ import wishlist

const Moviecase = () => {
  const [popularMoviesList, setPopularMoviesList] = useState([]);
  const { addToHistory } = useHistory();
  const { watchLater, addToWatchLater, removeFromWatchLater } = useWatchLater();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist(); // ✅ use wishlist
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    popularMovies().then(setPopularMoviesList);
  }, []);

  return (
    <section className="flex flex-col gap-4">
      <h4 className="my-2 pl-4 md:text-3xl">Popular Movies</h4>

      <div
        className="flex gap-4 overflow-x-auto pb-4
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-[#FAFAFA]
        [&::-webkit-scrollbar-thumb]:bg-[#FAFAFA]
        dark:[&::-webkit-scrollbar-track]:bg-[#FAFAFA]
        dark:[&::-webkit-scrollbar-thumb]:bg-[#0064E0] hover:dark:[&::-webkit-scrollbar-thumb]:bg-[#0073ff]"
      >
        {popularMoviesList.map((movie) => {
          const isInWatchLater = watchLater.some((s) => s.id === movie.id);
          const isWishlisted = isInWishlist(movie.id, "movie"); // ✅ check wishlist

          return (
            <Link
              key={movie.id}
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
              className="group relative no-underline shrink-0"
            >
              <div className="relative w-50">
                <img
                  src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full rounded shadow-md"
                />

                {/* Watch Later Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    if (!user) {
                      navigate("/signin", {
                        state: { message: "Login required" },
                      });
                      return;
                    }

                    isInWatchLater
                      ? removeFromWatchLater(movie.id)
                      : addToWatchLater(movie);
                  }}
                  className="absolute top-2 left-2 bg-black text-white px-2 py-1 rounded text-sm
                    opacity-100 lg:opacity-0 md:group-hover:opacity-100
                    transition-opacity duration-300 cursor-pointer"
                >
                  {isInWatchLater ? (
                    <FontAwesomeIcon icon={faDeleteLeft} />
                  ) : (
                    <FontAwesomeIcon icon={faClock} />
                  )}
                </button>

                {/* Rating */}
                <span className="absolute bottom-2 left-2 bg-yellow-500 text-black font-bold text-sm px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  ★ {movie.vote_average?.toFixed(1) ?? "N/A"}
                </span>

                {/* Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    if (!user) {
                      navigate("/signin", {
                        state: { message: "Login required" },
                      });
                      return;
                    }

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
                  className="absolute top-2 right-2 opacity-100 lg:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                >
                  {isWishlisted ? (
                    <FontAwesomeIcon
                      icon={faHeart}
                      style={{ color: "#FF0000" }}
                    /> // filled red heart
                  ) : (
                    <FontAwesomeIcon
                      icon={faHeart}
                      style={{ color: "#FFFFFF" }}
                    /> // empty white heart
                  )}
                </button>
              </div>

              <h5 className="mt-2 text-center text-sm">{movie.title}</h5>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Moviecase;
