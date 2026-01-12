import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useHistory } from "../context/HistoryContext";
import { recommendations } from "../services/tmdbApi";

import UniversalCarousel from "../ui/UniversalCarousel";
import BlurImage from "../ui/BlurImage";
import MediaSkeleton from "../ui/MediaSkeleton";

const PLACEHOLDER_POSTER = "/placeholder.png";

const Recommendations = () => {
  const { history } = useHistory();
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  // Use last 3 watched movies to fetch recommendations
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
    <section className="p-6">
      <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>

      <UniversalCarousel
        title="" // Already handled by the h2 above
        items={recommendedMovies}
        loading={loading}
        renderItem={(movie) => (
          <motion.div
            key={movie.id}
            className="shrink-0 w-40 group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
          >
            <Link
              to={`/movie/${movie.id}`}
              aria-label={`Go to movie details for ${movie.title}`}
              className="block"
            >
              <BlurImage
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
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
        skeletonCount={5} // Show 5 skeletons while loading
        SkeletonComponent={MediaSkeleton}
      />

      {/* Optional message if no recommendations */}
      {!loading && recommendedMovies.length === 0 && (
        <p className="text-sm text-gray-400 mt-2">
          Watch a movie to get recommendations 🎬
        </p>
      )}
    </section>
  );
};

export default Recommendations;
