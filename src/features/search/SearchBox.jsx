import { useContext, useEffect, useState } from "react";
import { fetchSearch } from "../../services/tmdbApi";
import SearchResult from "./SearchResult";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ThemeContext } from "../../context/ThemeProvider";

const SearchBox = () => {
  const { theme } = useContext(ThemeContext);
  const [searchMovies, setSearchMovies] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Using 'onChange' for instant search feel (or keep your onSubmit if preferred)
  const handleInputChange = async (e) => {
    const val = e.target.value;
    setInputValue(val);

    if (val.trim().length > 1) {
      try {
        const data = await fetchSearch(val);
        setSearchMovies(data.results || data); // Adjust based on your API response structure
        setShowResults(true);
      } catch (error) {
        console.error("Search failed", error);
      }
    } else {
      setSearchMovies([]);
      setShowResults(false);
    }
  };

  const clearSearch = () => {
    setInputValue("");
    setShowResults(false);
  };

  const handleKeyDown = (e) => {
    if (!showResults || searchMovies.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < searchMovies.length - 1 ? prev + 1 : 0
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : searchMovies.length - 1
        );
        break;

      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0) {
          const item = searchMovies[activeIndex];
          const route =
            item.media_type === "tv"
              ? `/tvshow/${item.id}`
              : `/movie/${item.id}`;
          window.location.href = route;
          clearSearch();
        }
        break;
      case "Escape":
        clearSearch();
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    setActiveIndex(-1);
  }, [searchMovies]);

  return (
    <div className="search-box relative flex flex-col items-center w-full max-w-md z-50">
      <form className="w-full relative">
        <input
          style={{ paddingInline: "2.5rem" }}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          type="text"
          placeholder="Search for movies, shows..."
          className="w-full h-10 px-4 pl-10 border border-blue-100 rounded bg-transparent text-[#0073ff] focus:outline-none focus:ring-1 focus:ring-[#0073ff] placeholder-gray-400 text-sm caret-blue-500"
        />
        {/* Search Icon Positioned Absolute */}
        <span className="absolute left-3 top-2.5 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>
        <span className="absolute right-3 top-2.5 text-gray-400 cursor-pointer">
          {theme === "light" ? (
            <FontAwesomeIcon icon={faMicrophone} style={{ color: "#000000" }} />
          ) : (
            <FontAwesomeIcon icon={faMicrophone} style={{ color: "#ffffff" }} />
          )}
        </span>
      </form>

      {/* Pass props to the Result component */}
      {showResults && (
        <SearchResult
          movies={searchMovies}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          onClose={clearSearch}
        />
      )}
    </div>
  );
};

export default SearchBox;
