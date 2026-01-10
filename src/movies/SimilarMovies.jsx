import { Link, useParams } from "react-router-dom";
import { similarMovies } from "../services/tmdbApi";
import { useEffect, useState } from "react";
import { useHistory } from "../context/HistoryContext";
import { useWatchLater } from "../context/WatchLaterContext";

const SimilarMovies = () => {
  const { id } = useParams();
  const [similar, setSimilar] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(true);
  const { addToHistory } = useHistory();
  const { watchLater, addToWatchLater, removeFromWatchLater } = useWatchLater();

  // Fetch Similar
  useEffect(() => {
    let isMounted = true;

    const fetchSimilarMovies = async () => {
      try {
        setSimilarLoading(true);
        const data = await similarMovies(id);
        if (isMounted) {
          setSimilar(data || []);
        }
      } catch (error) {
        console.error("Failed to fetch similar movies", error);
      } finally {
        if (isMounted) setSimilarLoading(false);
      }
    };

    fetchSimilarMovies();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <article className="flex flex-col gap-4">
      <h4 className="popular-movies text-3xl">You might also like</h4>

      {similarLoading && (
        <p className="text-gray-400 mt-6">Loading similar movies...</p>
      )}

      {!similarLoading && similar.length === 0 && (
        <p className="text-gray-500 mt-6">No similar movies found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 justify-items-center">
        {similar.slice(0, 12).map((movie) => {
          if (!movie.poster_path) return null;

          const isInWatchLater = watchLater.some((m) => m.id === movie.id);

          return (
            <div key={movie.id} className="relative group w-50">
              <Link
                onClick={() =>
                  addToHistory({
                    id: movie.id,
                    title: movie.title,
                    poster_path: movie.poster_path,
                    vote_average: movie.vote_average,
                    type: "movie",
                  })
                }
                to={`/movie/${movie.id}`}
                className="no-underline block cursor-pointer"
              >
                <div className="movie-case">
                  <img
                    src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                    alt={movie.title}
                    className="w-50 h-75 rounded shadow-md object-cover"
                  />
                  <h5 className="w-50 px-2 text-center mt-2">{movie.title}</h5>
                </div>
              </Link>

              {/* Watch Later Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent navigation
                  isInWatchLater
                    ? removeFromWatchLater(movie.id)
                    : addToWatchLater(movie);
                }}
                className="absolute top-2 left-2 bg-black text-white px-2 py-1 rounded text-sm
                 opacity-100 lg:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 ease-in-out cursor-pointer"
              >
                {isInWatchLater ? "Remove" : "Watch Later"}
              </button>

              {/* Rating badge */}
              <span className="absolute top-2 right-2 bg-yellow-500 text-black font-bold text-sm px-3 py-1 rounded
                    opacity-100 lg:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                ★ {movie.vote_average?.toFixed(1) ?? "N/A"}
              </span>
            </div>
          );
        })}
      </div>
    </article>
  );
};

export default SimilarMovies;
