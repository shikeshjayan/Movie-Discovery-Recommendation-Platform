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
import { faClock, faDeleteLeft } from "@fortawesome/free-solid-svg-icons";

const TVShows = () => {
  const [tvShows, setTvShows] = useState([]);
  const [page, setPage] = useState(1);
  const [genre, setGenre] = useState("trending");

  const { addToHistory } = useHistory();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { watchLater, addToWatchLater, removeFromWatchLater } = useWatchLater();

  // Navigate to show details and add to history
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

  // Fetch TV shows (handles trending + genres + pagination)
  useEffect(() => {
    const fetchData = async () => {
      if (genre === "trending") {
        const data = await allTvshows(page);
        setTvShows(data);
      } else {
        const data = await fetchTvShowsByGenre(genre, page);
        setTvShows(data);
      }
    };

    fetchData();
  }, [page, genre]);

  // Genre filter (safe, no logic break)
  const handleGenreChange = (id) => {
    setGenre(id);
    setPage(1); // reset page when genre changes
  };

  return (
    <section className="py-5 flex flex-col gap-4">
      <Banner />
      <GenreBar setGenre={handleGenreChange} />

      <h4 className="text-3xl">TV Shows</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 justify-items-center px-4">
        {tvShows.slice(0, 12).map((show) => {
          if (!show.poster_path) return null;

          const isInWatchLater = watchLater.some((s) => s.id === show.id);

          return (
            <div
              key={show.id}
              onClick={() => handleShowClick(show)}
              className="cursor-pointer group relative"
            >
              <div className="relative">
                <ImageWithLoader
                  src={`https://image.tmdb.org/t/p/w342${show.poster_path}`}
                  alt={show.original_name || show.original_title}
                  className="w-50 h-75 rounded shadow-md object-cover"
                />

                {/* Watch Later Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    if (!user) {
                      navigate("/signin", {
                        state: { message: "Login required" },
                      });
                      return;
                    }

                    isInWatchLater
                      ? removeFromWatchLater(show.id)
                      : addToWatchLater(show);
                  }}
                  className="
                    absolute top-2 left-2 bg-black text-white px-2 py-1 rounded text-sm
                    opacity-100 lg:opacity-0 md:group-hover:opacity-100
                    transition-opacity duration-300 cursor-pointer
                  "
                >
                  {isInWatchLater ? <FontAwesomeIcon icon={faDeleteLeft} /> : <FontAwesomeIcon icon={faClock} />}
                </button>

                {/* Rating */}
                <span
                  className="
                    absolute top-2 right-2 bg-yellow-500 text-black font-bold
                    text-sm px-3 py-1 rounded z-10
                    opacity-100 lg:opacity-0 md:group-hover:opacity-100
                    transition-opacity duration-300
                  "
                >
                  ★ {show.vote_average?.toFixed(1) ?? "N/A"}
                </span>

                <h5 className="w-50 px-2 text-center mt-2 truncate">
                  {show.name || show.original_name || show.title}
                </h5>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="w-full flex justify-center">
        <div className="flex gap-1">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className={`${
              page === 1 ? "opacity-20" : ""
            } w-24 border bg-blue-600 text-gray-100 hover:bg-blue-500 p-2 cursor-pointer`}
          >
            Previous
          </button>

          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="w-24 border bg-blue-600 text-gray-100 hover:bg-blue-500 p-2 cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default TVShows;
