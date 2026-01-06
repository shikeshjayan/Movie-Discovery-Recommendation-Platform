import { useContext, useState } from "react";
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

  return (
    <div className="search-box relative flex flex-col items-center w-full max-w-md z-50">
      <form className="w-full relative">
        <input
          style={{ paddingInline: "2.5rem" }}
          value={inputValue}
          onChange={handleInputChange}
          type="text"
          placeholder="Search for movies, shows..."
          className="w-full h-10 px-4 pl-10 border border-blue-100 rounded bg-transparent text-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-sm caret-blue-500"
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
        <SearchResult movies={searchMovies} onClose={clearSearch} />
      )}
    </div>
  );
};

export default SearchBox;
