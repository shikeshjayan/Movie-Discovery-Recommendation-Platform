import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { trendingAll } from "../services/tmdbApi";

import UniversalCarousel from "../ui/UniversalCarousel";
import BlurImage from "../ui/BlurImage";
import MediaSkeleton from "../ui/MediaSkeleton";

const PLACEHOLDER_POSTER = "/placeholder.png";

const Trending = () => {
  const [trending, setTrending] = useState([]);
  const [timeWindow, setTimeWindow] = useState("day");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchTrending = async () => {
      setLoading(true);
      try {
        const data = await trendingAll(timeWindow);
        const filtered = data.filter(
          (item) => item.media_type === "movie" || item.media_type === "tv"
        );
        if (isMounted) setTrending(filtered);
      } catch (error) {
        console.error("Failed to fetch trending items:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTrending();

    return () => {
      isMounted = false;
    };
  }, [timeWindow]);

  return (
    <div className="p-6">
      {/* Section Title */}
      <h2 className="text-2xl font-bold mb-6">Trending All</h2>

      {/* Time Window Switch */}
      <div className="mb-4 flex gap-2">
        {["day", "week"].map((tw) => (
          <button
            key={tw}
            onClick={() => setTimeWindow(tw)}
            className={`px-4 py-2 rounded ${
              timeWindow === tw
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100"
                : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
            } transition-colors`}
          >
            {tw === "day" ? "Today" : "This Week"}
          </button>
        ))}
      </div>

      {/* Horizontal Carousel */}
      <UniversalCarousel
        items={trending}
        loading={loading}
        renderItem={(item) => {
          const to =
            item.media_type === "movie"
              ? `/movie/${item.id}`
              : `/tvshow/${item.id}`;

          return (
            <motion.div
              key={item.id}
              className="shrink-0 w-40 group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              whileHover={{ scale: 1.05 }}
            >
              <Link to={to} className="block" aria-label={`Go to ${item.title || item.name} details`}>
                <BlurImage
                  src={
                    item.poster_path
                      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                      : PLACEHOLDER_POSTER
                  }
                  alt={item.title || item.name || "Unknown"}
                  className="rounded-lg shadow-md w-full h-64 object-cover"
                />
                <h5 className="mt-2 text-sm font-semibold truncate">
                  {item.title || item.name || "Unknown"}
                </h5>
              </Link>
            </motion.div>
          );
        }}
        SkeletonComponent={MediaSkeleton}
        skeletonCount={5}
      />

      {/* No Trending Message */}
      {!loading && trending.length === 0 && (
        <p className="text-gray-400 mt-2">No trending items available.</p>
      )}
    </div>
  );
};

export default Trending;
