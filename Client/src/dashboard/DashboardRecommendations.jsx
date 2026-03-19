// src/dashboard/DashboardRecommendations.jsx
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getRecommendationsService } from "../services/axiosApi.js";
import { AuthContext } from "../context/AuthContext.jsx";
import UniversalCarousel from "../ui/UniversalCarousel";
import BlurImage from "../ui/BlurImage";
import MediaSkeleton from "../ui/MediaSkeleton";

const PLACEHOLDER_POSTER = "/over.jpg";

const DashboardRecommendations = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setError("Please log in to see recommendations");
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getRecommendationsService()
      .then((data) => {
        if (!cancelled) {
          const raw = data.data ?? [];
          const unique = Array.from(
            new Map(raw.map((movie) => [movie.tmdbId, movie])).values(),
          );
          setMovies(unique);
        }
      })
      .catch((err) => {
        if (!cancelled)
          setError(err.message || "Failed to load recommendations");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <section className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xl font-semibold">Recommended for You</h2>
      </div>

      {error && <p className="text-sm text-red-400 mb-2">{error}</p>}

      <UniversalCarousel
        title=""
        items={movies}
        loading={loading}
        renderItem={(movie) => (
          <motion.div
            key={movie.tmdbId}
            className="shrink-0 w-40 group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.05 }}>
            <Link
              to={`/movie/${movie.tmdbId}`}
              aria-label={`Go to movie details for ${movie.title}`}
              className="block">
              <BlurImage
                src={
                  movie.posterPath
                    ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
                    : PLACEHOLDER_POSTER
                }
                alt={movie.title}
                className="rounded-lg shadow-md w-full h-60"
              />
              <h5 className="mt-2 text-sm font-semibold truncate">
                {movie.title}
              </h5>
            </Link>
          </motion.div>
        )}
        skeletonCount={5}
        SkeletonComponent={MediaSkeleton}
      />

      {!loading && !error && movies.length === 0 && (
        <p className="text-sm text-gray-400 mt-2">
          Watch a movie to get recommendations 🎬
        </p>
      )}
    </section>
  );
};

export default DashboardRecommendations;
