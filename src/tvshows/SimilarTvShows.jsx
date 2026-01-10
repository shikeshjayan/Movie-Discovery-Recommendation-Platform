import { Link, useParams } from "react-router-dom";
import { similarShows } from "../services/tmdbApi";
import { useEffect, useState } from "react";
import { useHistory } from "../context/HistoryContext";
import { useWatchLater } from "../context/WatchLaterContext";

const SimilarTvShows = () => {
  const { id } = useParams();
  const [similar, setSimilar] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(true);
  const { addToHistory } = useHistory();
  const { watchLater, addToWatchLater, removeFromWatchLater } = useWatchLater();

  // Fetch similar shows
  useEffect(() => {
    let isMounted = true;

    const fetchSimilarTvShows = async () => {
      try {
        setSimilarLoading(true);
        const data = await similarShows(id);
        if (isMounted) setSimilar(data || []);
      } catch (error) {
        console.error("Failed to fetch similar TV shows", error);
      } finally {
        if (isMounted) setSimilarLoading(false);
      }
    };

    fetchSimilarTvShows();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <article className="flex flex-col gap-4">
      <h4 className="popular-shows text-3xl">Similar TV Shows</h4>

      {similarLoading && (
        <p className="text-gray-400 mt-6">Loading similar TV Shows...</p>
      )}

      {!similarLoading && similar.length === 0 && (
        <p className="text-gray-500 mt-6">No similar TV Shows found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 justify-items-center">
        {similar.slice(0, 12).map((show) => {
          if (!show.poster_path) return null;

          const isInWatchLater = watchLater.some((m) => m.id === show.id);

          return (
            <div key={show.id} className="relative group w-50">
              <Link
                onClick={() =>
                  addToHistory({
                    id: show.id,
                    title: show.name || show.title,
                    poster_path: show.poster_path,
                    vote_average: show.vote_average,
                    type: "shows",
                  })
                }
                to={`/tvshow/${show.id}`}
                className="no-underline block cursor-pointer"
              >
                <div className="movie-case">
                  <img
                    src={`https://image.tmdb.org/t/p/w342${show.poster_path}`}
                    alt={show.name || show.title}
                    className="w-50 h-75 rounded shadow-md object-cover"
                  />
                  <h5 className="w-50 px-2 text-center mt-2">
                    {show.name || show.title}
                  </h5>
                </div>
              </Link>

              {/* Watch Later Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent navigation
                  isInWatchLater
                    ? removeFromWatchLater(show.id)
                    : addToWatchLater(show);
                }}
                className="absolute top-2 left-2 bg-black text-white px-2 py-1 rounded text-sm
                 opacity-100 lg:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 ease-in-out cursor-pointer"
              >
                {isInWatchLater ? "Remove" : "Watch Later"}
              </button>

              {/* Rating badge */}
              <span className="absolute top-2 right-2 bg-yellow-500 text-black font-bold text-sm px-3 py-1 rounded opacity-0 group-hover:opacity-100 z-10">
                ★ {show.vote_average?.toFixed(1) ?? "N/A"}
              </span>
            </div>
          );
        })}
      </div>
    </article>
  );
};

export default SimilarTvShows;
