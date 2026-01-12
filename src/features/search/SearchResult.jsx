import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeProvider";
import { motion } from "framer-motion";
/**
 * SearchResult Component
 * Renders a dropdown list of search results with keyboard navigation support.
 * Each item is clickable and navigates to the movie/TV show detail page.
 *
 * @param {Array} movies - List of movie/TV show objects from TMDB
 * @param {number} activeIndex - Index of the currently highlighted item
 * @param {Function} setActiveIndex - Function to update the active index
 * @param {Function} onClose - Function to close the search dropdown
 */
const SearchResult = ({ movies, activeIndex, setActiveIndex, onClose }) => {
  const navigate = useNavigate();
  const itemRefs = useRef([]);
  const { theme } = useContext(ThemeContext);

  // Scroll the active item into view when activeIndex changes
  useEffect(() => {
    if (activeIndex >= 0 && itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex].scrollIntoView({
        block: "nearest",
      });
    }
  }, [activeIndex]);

  /**
   * Handles click on a search result item
   * @param {number} id - Movie/TV show ID
   * @param {string} type - Media type ("movie" or "tv")
   */
  const handleItemClick = (id, type) => {
    const route = type === "tv" ? `/tvshow/${id}` : `/movie/${id}`;
    navigate(route);
    if (onClose) onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className={`absolute top-full mt-5 left-1/2 transform -translate-x-1/2 sm:w-[60vw] max-w-md sm:max-w-lg backdrop-blur-lg rounded-b shadow-2xl max-h-80 overflow-y-auto
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-[#FAFAFA]
        [&::-webkit-scrollbar-thumb]:bg-[#FAFAFA]
        dark:[&::-webkit-scrollbar-track]:bg-[#FAFAFA]
        dark:[&::-webkit-scrollbar-thumb]:bg-[#0064E0] hover:dark:[&::-webkit-scrollbar-thumb]:bg-[#0073ff]
        ${theme === "dark" ? "bg-black/70" : "bg-white/70"}
      `}
    >
      {movies && movies.length > 0 ? (
        movies.map((item, index) => (
          <div
            key={item.id}
            ref={(el) => (itemRefs.current[index] = el)}
            onMouseEnter={() => setActiveIndex(index)}
            onClick={() => handleItemClick(item.id, item.media_type)}
            className={`
              flex items-center gap-3 p-3 cursor-pointer transition-colors border-b border-gray-800 last:border-0
              ${index === activeIndex ? "bg-blue-100/20" : "hover:bg-blue-500"}
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
              <h4
                className={`text-sm font-semibold line-clamp-1
                  ${theme === "dark" ? "text-[#FAFAFA]" : "text-[#312F2C]"}
                `}
              >
                {item.title || item.name}
              </h4>
              <div
                className={`flex items-center gap-2 text-xs text-gray-400 mt-1
                  ${theme === "dark" ? "text-[#FAFAFA]" : "text-[#312F2C]"}
                `}
              >
                <span
                  className={`${
                    theme === "dark" ? "text-[#FAFAFA]" : "text-[#312F2C]"
                  }`}
                >
                  {item.release_date
                    ? item.release_date.substring(0, 4)
                    : "N/A"}
                </span>
                <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                <span className="uppercase px-1 rounded text-[10px]">
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
    </motion.div>
  );
};

export default SearchResult;
