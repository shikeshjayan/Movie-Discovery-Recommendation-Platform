import { useEffect, useState } from "react";
import { popularTVShows } from "../services/tmdbApi";
import { Link, useNavigate } from "react-router-dom";
import { useHistory } from "../context/HistoryContext";
import { useWatchLater } from "../context/WatchLaterContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faClock, faDeleteLeft } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext"; // ✅ import wishlist

const Tvshowcase = () => {
  const [popularShowsList, setPopularShowsList] = useState([]);
  const { addToHistory } = useHistory();
  const { watchLater, addToWatchLater, removeFromWatchLater } = useWatchLater();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist(); // ✅ use wishlist
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    popularTVShows().then(setPopularShowsList);
  }, []);

  return (
    <section className="flex flex-col gap-4">
      <h4 className="my-2 pl-4 md:text-3xl">Popular TV Shows</h4>

      <div
        className="flex gap-4 overflow-x-auto pb-4
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-[#FAFAFA]
        [&::-webkit-scrollbar-thumb]:bg-[#FAFAFA]
        dark:[&::-webkit-scrollbar-track]:bg-[#FAFAFA]
        dark:[&::-webkit-scrollbar-thumb]:bg-[#0064E0] hover:dark:[&::-webkit-scrollbar-thumb]:bg-[#0073ff]"
      >
        {popularShowsList.map((shows) => {
          const isInWatchLater = watchLater.some((s) => s.id === shows.id);
          const isWishlisted = isInWishlist(shows.id, "tv"); // ✅ check wishlist

          return (
            <Link
              key={shows.id}
              to={`/tvshow/${shows.id}`}
              onClick={() =>
                addToHistory({
                  id: shows.id,
                  title: shows.name || shows.title,
                  poster_path: shows.poster_path,
                  vote_average: shows.vote_average,
                  type: "tv",
                })
              }
              className="group relative no-underline shrink-0"
            >
              <div className="relative w-50">
                <img
                  src={`https://image.tmdb.org/t/p/w342${shows.poster_path}`}
                  alt={shows.name || shows.title}
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
                      ? removeFromWatchLater(shows.id)
                      : addToWatchLater(shows);
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
                  ★ {shows.vote_average?.toFixed(1) ?? "N/A"}
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
                      ? removeFromWishlist(shows.id, "tv")
                      : addToWishlist({
                          id: shows.id,
                          title: shows.name || shows.title,
                          poster_path: shows.poster_path,
                          vote_average: shows.vote_average,
                          type: "tv",
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

              <h5 className="mt-2 text-center text-sm">{shows.name || shows.title}</h5>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Tvshowcase;
