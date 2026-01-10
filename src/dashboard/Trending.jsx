import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { trendingAll } from "../services/tmdbApi";

const Trending = () => {
  const [trending, setTrending] = useState([]);
  const [timeWindow, setTimeWindow] = useState("day");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      const data = await trendingAll(timeWindow);
      const filtered = data.filter(
        (item) => item.media_type === "movie" || item.media_type === "tv"
      );
      setTrending(filtered);
      setLoading(false);
    };

    fetchTrending();
  }, [timeWindow]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Trending All</h1>

      {/* Switch between day / week */}
      <div className="mb-4">
        <button
          onClick={() => setTimeWindow("day")}
          className={`px-4 py-2 mr-2 ${
            timeWindow === "day"
              ? "text-blue-600 cursor-pointer"
              : "text-gray-500 cursor-pointer"
          }`}
        >
          Today
        </button>
        <button
          onClick={() => setTimeWindow("week")}
          className={`px-4 py-2 ${
            timeWindow === "week"
              ? "text-blue-600 cursor-pointer"
              : "text-gray-500 cursor-pointer"
          }`}
        >
          This Week
        </button>
      </div>

      {/* Horizontal scroll container */}
      {loading ? (
        <p>Loading trending items...</p>
      ) : (
        <div className="flex overflow-x-auto gap-4 pb-4 max-h-100 overflow-y-auto
  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-100
  dark:[&::-webkit-scrollbar-thumb]:bg-blue-900">
          {trending.map((item) => {
            const to =
              item.media_type === "movie"
                ? `/movie/${item.id}`
                : item.media_type === "tv"
                ? `/tvshow/${item.id}`
                : "/";

            return (
              <Link
                to={to}
                key={item.id}
                className="min-w-40 hover:scale-105 transition-transform"
              >
                <img
                  src={
                    item.poster_path
                      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                      : "/Loader.svg"
                  }
                  alt={item.title || item.name || "Unknown"}
                  className="rounded-lg shadow-md w-full h-64 object-cover"
                />
                <p className="mt-2 text-sm font-semibold truncate">
                  {item.title || item.name || "Unknown"}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Trending;
