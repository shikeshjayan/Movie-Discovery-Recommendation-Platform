import { useEffect, useState, useMemo } from "react";
import { recommendations } from "../services/tmdbApi";
import { useHistory } from "../context/HistoryContext";
import { Link } from "react-router-dom";

const PLACEHOLDER_POSTER = "/placeholder.png";

const Recommendations = () => {
  const { history } = useHistory();
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  // Take last 3 watched movies instead of just 1
  const recentMovieIds = useMemo(
    () => history.slice(0, 3).map((m) => m.id),
    [history]
  );

  useEffect(() => {
    let isMounted = true;

    const fetchRecs = async () => {
      if (!recentMovieIds.length) return;

      setLoading(true);

      try {
        const results = await Promise.all(
          recentMovieIds.map((id) => recommendations(id))
        );

        // Flatten + dedupe movies by ID
        const uniqueMovies = Array.from(
          new Map(
            results
              .flat()
              .filter(Boolean)
              .map((movie) => [movie.id, movie])
          ).values()
        );

        if (isMounted) setRecommendedMovies(uniqueMovies);
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRecs();

    return () => {
      isMounted = false;
    };
  }, [recentMovieIds]);

  return (
    <div className="p-6">
      <section>
        <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>

        {loading && (
          <div className="flex gap-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="min-w-40 h-60 bg-gray-800 rounded animate-pulse"
              />
            ))}
          </div>
        )}

        {!loading && recommendedMovies.length === 0 && (
          <p className="text-sm text-gray-400">
            Watch a movie to get recommendations 🎬
          </p>
        )}

        {!loading && recommendedMovies.length > 0 && (
          <div
            className="flex overflow-x-auto gap-4 pb-4
  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-100
  dark:[&::-webkit-scrollbar-thumb]:bg-[#007BFF]"
          >
            {recommendedMovies.map((movie) => (
              <Link
                to={`/movie/${movie.id}`}
                key={movie.id}
                className="min-w-40 hover:scale-105 transition-transform"
              >
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : PLACEHOLDER_POSTER
                  }
                  alt={movie.title}
                  className="rounded-lg shadow-md w-full"
                  loading="lazy"
                />
                <h5 className="mt-2 text-sm font-semibold">{movie.title}</h5>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Recommendations;
