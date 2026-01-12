import { useEffect, useState } from "react";
import { allTvshows, fetchTvShowsByGenre } from "../services/tmdbApi";
import { useNavigate, useLocation } from "react-router-dom";
import Banner from "../tvshows/Banner";
import GenreBar from "../tvshows/GenreBar";
import ImageWithLoader from "../ui/ImageWithLoader";
import { useHistory } from "../context/HistoryContext";
import { useAuth } from "../context/AuthContext";
import { useWatchLater } from "../context/WatchLaterContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

const TVShows = () => {
  const [tvShows, setTvShows] = useState([]);
  const [page, setPage] = useState(1);
  const [genre, setGenre] = useState("trending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { addToHistory } = useHistory();
  const { watchLater, addToWatchLater, removeFromWatchLater } = useWatchLater();

  // -------------------- Fetch TV Shows --------------------
  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data =
          genre === "trending"
            ? await allTvshows(page)
            : await fetchTvShowsByGenre(genre, page);

        if (active) setTvShows(data || []);
      } catch (err) {
        if (active) setError("Failed to load TV shows");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData();
    return () => {
      active = false;
    };
  }, [genre, page]);

  // -------------------- Handlers --------------------
  const handleGenreChange = (id) => {
    setGenre(id);
    setPage(1);
  };

  const handleShowClick = (show) => {
    if (!user) {
      navigate("/signin", {
        state: {
          from: location.pathname,
          message: "Login required to view TV show details",
        },
      });
      return;
    }

    addToHistory({
      id: show.id,
      title: show.name || show.title,
      poster_path: show.poster_path,
      vote_average: show.vote_average,
      type: "tvshow",
    });

    navigate(`/tvshow/${show.id}`);
  };

  // -------------------- Render --------------------
  return (
    <section className="py-5 flex flex-col gap-6">
      <Banner />
      <GenreBar setGenre={handleGenreChange} />

      <h4 className="text-3xl px-4">TV Shows</h4>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 px-4"
        role="list"
      >
        {tvShows.slice(0, 12).map((show) => {
          if (!show.poster_path) return null;

          const isInWatchLater = watchLater.some((item) => item.id === show.id);

          return (
            <motion.div
              key={`${genre}-${show.id}`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 260 }}
              role="listitem"
            >
              <button
                onClick={() => handleShowClick(show)}
                className="relative group text-left"
              >
                <ImageWithLoader
                  src={`https://image.tmdb.org/t/p/w342${show.poster_path}`}
                  alt={show.name || show.title}
                  className="w-50 h-75 rounded shadow-md object-cover"
                />

                {user && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      isInWatchLater
                        ? removeFromWatchLater(show.id)
                        : addToWatchLater(show);
                    }}
                    className="absolute top-2 left-2 bg-black text-white px-2 py-1 rounded
                    opacity-100 lg:opacity-0 md:group-hover:opacity-100 transition-opacity"
                  >
                    <FontAwesomeIcon
                      icon={isInWatchLater ? faDeleteLeft : faClock}
                    />
                  </button>
                )}

                <span className="absolute top-2 right-2 bg-yellow-500 text-black font-bold text-sm px-3 py-1 rounded">
                  ★ {show.vote_average?.toFixed(1) ?? "N/A"}
                </span>

                <h5 className="mt-2 truncate w-50 px-1">
                  {show.name || show.original_name || show.title}
                </h5>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* -------------------- Pagination -------------------- */}
      <div className="flex justify-center gap-3 py-4">
        <motion.button
          disabled={page === 1}
          whileTap={{ scale: 0.95 }}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Prev
        </motion.button>

        <span className="flex items-center px-3 text-gray-400">
          Page {page}
        </span>

        <motion.button
          disabled={tvShows.length < 20}
          whileTap={{ scale: 0.95 }}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Next
        </motion.button>
      </div>
    </section>
  );
};

export default TVShows;
