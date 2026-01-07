import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const SearchResult = ({ movies, activeIndex, setActiveIndex, onClose }) => {
  const navigate = useNavigate();
  const itemRefs = useRef([]);

  useEffect(() => {
    if (activeIndex >= 0) {
      itemRefs.current[activeIndex]?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [activeIndex]);

  const handleItemClick = (id, type) => {
    const route = type === "tv" ? `/tvshow/${id}` : `/movie/${id}`;
    navigate(route);
    if (onClose) onClose();
  };

  return (
    <div className="absolute top-full mt-2 left-0 w-full bg-black/70 backdrop-blur-lg border border-gray-700 rounded-md shadow-2xl max-h-80 overflow-y-auto">
      {movies && movies.length > 0 ? (
        movies.map((item, index) => (
          <div
            key={item.id}
            ref={(el) => (itemRefs.current[index] = el)}
            onmouseenter={() => setActiveIndex(index)}
            onClick={() => handleItemClick(item.id, item.media_type)}
            className={`
      flex items-center gap-3 p-3 cursor-pointer transition-colors border-b border-gray-800 last:border-0
      ${index === activeIndex ? "bg-blue-500/20" : "hover:bg-gray-800"}
    `}
          >
            <img
              src={
                item.poster_path
                  ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                  : "https://via.placeholder.com/45x68?text=No+Img"
              }
              alt={item.title || item.name}
              className="w-11 h-16 object-cover rounded shadow-sm"
            />

            {/* Text Info */}
            <div className="flex-1 text-left">
              <h4 className="text-sm font-semibold text-gray-100 line-clamp-1">
                {item.title || item.name}
              </h4>
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                <span>
                  {item.release_date
                    ? item.release_date.substring(0, 4)
                    : "N/A"}
                </span>
                <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                <span className="uppercase border border-gray-600 px-1 rounded text-[10px]">
                  {item.media_type === "tv" ? "TV" : "Movie"}
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="p-4 text-center text-gray-500 text-sm">
          No results found
        </div>
      )}
    </div>
  );
};

export default SearchResult;
