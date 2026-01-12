import { useEffect, useState } from "react";
import { popularTVShows } from "../services/tmdbApi";
import { Link, useNavigate } from "react-router-dom";
import { useHistory } from "../context/HistoryContext";
import { useWatchLater } from "../context/WatchLaterContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faClock, faDeleteLeft } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

import BlurImage from "../ui/BlurImage";
import UniversalCarousel from "../ui/UniversalCarousel"

const TvShowcase = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToHistory } = useHistory();
  const { watchLater, addToWatchLater, removeFromWatchLater } = useWatchLater();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    popularTVShows()
      .then(setShows)
      .finally(() => setLoading(false));
  }, []);

  return (
    <UniversalCarousel
      title="Popular TV Shows"
      items={shows}
      loading={loading}
      renderItem={(show) => {
        const isInWatchLater = watchLater.some((s) => s.id === show.id);
        const isWishlisted = isInWishlist(show.id, "tv");

        return (
          <motion.div
            key={show.id}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 260 }}
            className="shrink-0"
          >
            <Link
              to={`/tvshow/${show.id}`}
              onClick={() =>
                addToHistory({
                  id: show.id,
                  title: show.name || show.title,
                  poster_path: show.poster_path,
                  vote_average: show.vote_average,
                  type: "tv",
                })
              }
              className="group block"
            >
              <div className="relative w-48">
                <BlurImage
                  src={`https://image.tmdb.org/t/p/w342${show.poster_path}`}
                  alt={show.name || show.title}
                  className="w-full h-67.5 rounded shadow-md"
                />

                {/* Watch Later */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!user) return navigate("/signin");

                    isInWatchLater
                      ? removeFromWatchLater(show.id)
                      : addToWatchLater(show);
                  }}
                  className="absolute top-2 left-2 bg-black/80 text-white p-2 rounded
                  opacity-100 lg:opacity-0 group-hover:opacity-100 transition"
                >
                  <FontAwesomeIcon
                    icon={isInWatchLater ? faDeleteLeft : faClock}
                  />
                </button>

                {/* Wishlist */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!user) return navigate("/signin");

                    isWishlisted
                      ? removeFromWishlist(show.id, "tv")
                      : addToWishlist({
                          id: show.id,
                          title: show.name || show.title,
                          poster_path: show.poster_path,
                          vote_average: show.vote_average,
                          type: "tv",
                        });
                  }}
                  className="absolute top-2 right-2 opacity-100 lg:opacity-0
                  group-hover:opacity-100 transition"
                >
                  <FontAwesomeIcon
                    icon={faHeart}
                    style={{ color: isWishlisted ? "#FF0000" : "#FFFFFF" }}
                  />
                </button>

                {/* Rating */}
                <span className="absolute bottom-2 left-2 bg-yellow-500 text-black
                font-bold text-sm px-3 py-1 rounded opacity-0
                group-hover:opacity-100 transition">
                  ★ {show.vote_average?.toFixed(1) ?? "N/A"}
                </span>
              </div>

              <h5 className="mt-2 text-center text-sm truncate">
                {show.name || show.title}
              </h5>
            </Link>
          </motion.div>
        );
      }}
    />
  );
};

export default TvShowcase;
