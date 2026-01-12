import { useEffect, useRef, useReducer } from "react";
import { fetchSearch } from "../../services/tmdbApi";
import SearchResult from "./SearchResult";
import { motion } from "framer-motion";
/* -------------------- Reducer -------------------- */

/**
 * Initial state for the search box
 * @property {string} inputValue - Current value in the input field
 * @property {Array} movies - List of search results
 * @property {number} activeIndex - Index of the currently highlighted result
 * @property {boolean} showResults - Whether the results dropdown is visible
 */
const initialState = {
  inputValue: "",
  movies: [],
  activeIndex: -1,
  showResults: false,
};

/**
 * Reducer function to manage search box state
 * @param {Object} state - Current state
 * @param {Object} action - Action object with type and payload
 * @returns {Object} New state
 */
function reducer(state, action) {
  switch (action.type) {
    case "SET_INPUT":
      return {
        ...state,
        inputValue: action.payload,
      };

    case "SET_RESULTS":
      return {
        ...state,
        movies: action.payload,
        showResults: true,
        activeIndex: -1,
      };

    case "SET_ACTIVE_INDEX":
      return {
        ...state,
        activeIndex: action.payload,
      };

    case "CLEAR":
      return initialState;

    case "HIDE_RESULTS":
      return {
        ...state,
        movies: [],
        showResults: false,
        activeIndex: -1,
      };

    default:
      return state;
  }
}

/* -------------------- Component -------------------- */

/**
 * SearchBox Component
 * Renders a search input with autocomplete dropdown.
 * Supports keyboard navigation (arrow keys, Enter, Escape) and click-to-navigate.
 */
const SearchBox = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { inputValue, movies, activeIndex, showResults } = state;

  // Ref to track the latest request ID (prevents race conditions)
  const requestIdRef = useRef(0);

  /**
   * Handles input change and triggers search
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleInputChange = async (e) => {
    const val = e.target.value;
    dispatch({ type: "SET_INPUT", payload: val });

    if (val.trim().length > 1) {
      const currentRequestId = ++requestIdRef.current;

      try {
        const data = await fetchSearch(val);

        // Only update results if this is the latest request
        if (currentRequestId === requestIdRef.current) {
          dispatch({
            type: "SET_RESULTS",
            payload: data.results || data,
          });
        }
      } catch (error) {
        console.error("Search failed", error);
      }
    } else {
      dispatch({ type: "HIDE_RESULTS" });
    }
  };

  /**
   * Clears the search input and hides results
   */
  const clearSearch = () => {
    dispatch({ type: "CLEAR" });
  };

  /**
   * Handles keyboard navigation and selection
   * @param {React.KeyboardEvent} e - Keyboard event
   */
  const handleKeyDown = (e) => {
    if (!showResults || movies.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        dispatch({
          type: "SET_ACTIVE_INDEX",
          payload: activeIndex < movies.length - 1 ? activeIndex + 1 : 0,
        });
        break;

      case "ArrowUp":
        e.preventDefault();
        dispatch({
          type: "SET_ACTIVE_INDEX",
          payload: activeIndex > 0 ? activeIndex - 1 : movies.length - 1,
        });
        break;

      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0) {
          const item = movies[activeIndex];
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

  // Reset activeIndex whenever movies list changes
  useEffect(() => {
    dispatch({ type: "SET_ACTIVE_INDEX", payload: -1 });
  }, [movies]);

  return (
    <motion.div
      initial={{ scale: 0.2, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileFocus={{
        scale: 1.02,
        boxShadow: "0 10px 30px rgba(0,116,224,0.3)",
        border: "2px solid #0073ff",
      }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-200 relative flex flex-col items-center max-w-md z-50"
    >
      <form className="md:w-full relative" onSubmit={(e) => e.preventDefault()}>
        <motion.input
          whileHover={{
            borderColor: "#0073ff",
            boxShadow: "0 5px 20px rgba(0,116,224,0.15)",
          }}
          whileFocus={{
            scale: 1.03,
            letterSpacing: "-0.5px",
          }}
          whileTap={{ scale: 0.98 }}
          style={{ paddingInline: "2.5rem" }}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          type="text"
          placeholder="Search for movies, shows..."
          className="w-full h-10 border border-blue-900 rounded bg-transparent text-[#0073ff] focus:outline-none focus:ring-1 focus:ring-[#0073ff] placeholder-gray-400 text-sm caret-blue-500"
        />

        {/* Search Icon */}
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
      </form>

      {showResults && (
        <SearchResult
          movies={movies}
          activeIndex={activeIndex}
          setActiveIndex={(i) =>
            dispatch({ type: "SET_ACTIVE_INDEX", payload: i })
          }
          onClose={clearSearch}
        />
      )}
    </motion.div>
  );
};

export default SearchBox;
