import { useContext, useEffect, useRef, useReducer } from "react";
import { fetchSearch } from "../../services/tmdbApi";
import SearchResult from "./SearchResult";
// import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ThemeContext } from "../../context/ThemeProvider";

/* -------------------- Reducer -------------------- */

const initialState = {
  inputValue: "",
  movies: [],
  activeIndex: -1,
  showResults: false,
};

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

const SearchBox = () => {
  const { theme } = useContext(ThemeContext);
  const [state, dispatch] = useReducer(reducer, initialState);

  const { inputValue, movies, activeIndex, showResults } = state;

  // 🔒 Prevent async race condition
  const requestIdRef = useRef(0);

  const handleInputChange = async (e) => {
    const val = e.target.value;
    dispatch({ type: "SET_INPUT", payload: val });

    if (val.trim().length > 1) {
      const currentRequestId = ++requestIdRef.current;

      try {
        const data = await fetchSearch(val);

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

  const clearSearch = () => {
    dispatch({ type: "CLEAR" });
  };

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

  useEffect(() => {
    dispatch({ type: "SET_ACTIVE_INDEX", payload: -1 });
  }, [movies]);

  return (
    <div className="search-box relative flex flex-col items-center w-full max-w-md z-50">
      <form className="md:w-full relative" onSubmit={(e) => e.preventDefault()}>
        <input
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

        {/* <span className="absolute right-3 top-2.5 cursor-pointer">
          <FontAwesomeIcon
            icon={faMicrophone}
            style={{ color: theme === "light" ? "#000" : "#fff" }}
          />
        </span> */}
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
    </div>
  );
};

export default SearchBox;
