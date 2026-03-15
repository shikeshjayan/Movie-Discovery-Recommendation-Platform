import { useEffect, useRef, useReducer, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchSearch } from "../../services/tmdbApi";
import SearchResult from "./SearchResult";
import { useVoiceSearch } from "../../hooks/useVoiceSearch";
import {
  faMagnifyingGlass,
  faMicrophone,
  faFilter,
  faClockRotateLeft,
  faXmark,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const RECENT_SEARCHES_KEY = "rmdb_recent_searches";
const MAX_RECENT_SEARCHES = 5;

const initialState = {
  inputValue: "",
  movies: [],
  activeIndex: -1,
  showResults: false,
  filterType: "all", // all, movie, tv, person
  yearFrom: "",
  yearTo: "",
  showFilters: false,
  recentSearches: [],
};

function loadRecentSearches() {
  try {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(query) {
  if (!query.trim()) return;
  const recent = loadRecentSearches();
  const filtered = recent.filter(
    (s) => s.toLowerCase() !== query.toLowerCase(),
  );
  const updated = [query, ...filtered].slice(0, MAX_RECENT_SEARCHES);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_INPUT":
      return { ...state, inputValue: action.payload };
    case "SET_RESULTS":
      return {
        ...state,
        movies: action.payload,
        showResults: true,
        activeIndex: -1,
      };
    case "SET_ACTIVE_INDEX":
      return { ...state, activeIndex: action.payload };
    case "CLEAR":
      return {
        ...initialState,
        recentSearches: state.recentSearches,
        showFilters: state.showFilters,
      };
    case "HIDE_RESULTS":
      return { ...state, movies: [], showResults: false, activeIndex: -1 };
    case "SET_FILTER_TYPE":
      return { ...state, filterType: action.payload };
    case "SET_YEAR_FROM":
      return { ...state, yearFrom: action.payload };
    case "SET_YEAR_TO":
      return { ...state, yearTo: action.payload };
    case "TOGGLE_FILTERS":
      return { ...state, showFilters: !state.showFilters };
    case "SET_RECENT_SEARCHES":
      return { ...state, recentSearches: action.payload };
    case "REMOVE_RECENT":
      const filtered = state.recentSearches.filter(
        (_, i) => i !== action.payload,
      );
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(filtered));
      return { ...state, recentSearches: filtered };
    default:
      return state;
  }
}

const VoiceWave = ({ active }) => (
  <div className="flex gap-1 items-end h-4">
    {[1, 2, 3].map((i) => (
      <motion.span
        key={i}
        animate={
          active ? { height: ["20%", "100%", "30%"] } : { height: "20%" }
        }
        transition={{
          repeat: active ? Infinity : 0,
          duration: 0.6,
          ease: "easeInOut",
          delay: i * 0.1,
        }}
        className="w-1 bg-red-500 rounded"
      />
    ))}
  </div>
);

const FilterDropdown = ({ filterType, setFilterType }) => {
  const [open, setOpen] = useState(false);
  const options = [
    { value: "all", label: "All" },
    { value: "movie", label: "Movies" },
    { value: "tv", label: "TV Shows" },
    { value: "person", label: "People" },
  ];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="absolute left-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-blue-400 transition-colors"
        title="Filter results">
        <FontAwesomeIcon icon={faFilter} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 top-full mt-2 w-32 bg-gray-900/90 backdrop-blur rounded shadow-xl z-50 border border-gray-700">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setFilterType(opt.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-500/30 transition-colors ${
                  filterType === opt.value ? "text-blue-400" : "text-gray-300"
                }`}>
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const YearFilter = ({ yearFrom, yearTo, setYearFrom, setYearTo }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1899 },
    (_, i) => currentYear - i,
  );

  return (
    <div className="flex items-center gap-2">
      <select
        value={yearFrom}
        onChange={(e) => setYearFrom(e.target.value)}
        className="bg-gray-800/80 text-gray-300 text-xs px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-blue-500">
        <option value="">From</option>
        {years.slice(0, 50).map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
      <span className="text-gray-500">-</span>
      <select
        value={yearTo}
        onChange={(e) => setYearTo(e.target.value)}
        className="bg-gray-800/80 text-gray-300 text-xs px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-blue-500">
        <option value="">To</option>
        {years.slice(0, 50).map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
};

const RecentSearches = ({ recentSearches, onSelect, onRemove }) => {
  if (recentSearches.length === 0) return null;

  return (
    <div className="p-2 border-t border-gray-700">
      <div className="flex items-center justify-between px-2 py-1">
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <FontAwesomeIcon icon={faClockRotateLeft} className="w-3 h-3" />
          Recent
        </span>
      </div>
      {recentSearches.map((search, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between px-3 py-2 hover:bg-gray-700/50 rounded cursor-pointer group"
          onClick={() => onSelect(search)}>
          <span className="text-sm text-gray-300">{search}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(idx);
            }}
            className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity">
            <FontAwesomeIcon icon={faXmark} className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
};

const SearchBox = () => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    recentSearches: loadRecentSearches(),
  });
  const {
    inputValue,
    movies,
    activeIndex,
    showResults,
    filterType,
    yearFrom,
    yearTo,
    showFilters,
    recentSearches,
  } = state;

  const requestIdRef = useRef(0);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showRecentDropdown, setShowRecentDropdown] = useState(false);

  const { isListening, isSupported, startListening, stopListening } =
    useVoiceSearch({
      onResult: (text) => {
        dispatch({ type: "SET_INPUT", payload: text });
      },
      onFinalResult: async (text) => {
        dispatch({ type: "SET_INPUT", payload: text });
        await performSearch(text);
      },
      silenceTimeout: 2000,
    });

  const filterResults = (results) => {
    return results
      .filter((item) => {
        if (filterType === "all") return true;
        if (filterType === "person") return item.media_type === "person";
        if (filterType === "movie") return item.media_type === "movie";
        if (filterType === "tv") return item.media_type === "tv";
        return true;
      })
      .filter((item) => {
        if (
          yearFrom &&
          item.release_date &&
          parseInt(item.release_date.slice(0, 4)) < parseInt(yearFrom)
        )
          return false;
        if (
          yearTo &&
          item.release_date &&
          parseInt(item.release_date.slice(0, 4)) > parseInt(yearTo)
        )
          return false;
        return true;
      });
  };

  const performSearch = async (query) => {
    if (!query.trim()) return;

    saveRecentSearch(query);
    dispatch({ type: "SET_RECENT_SEARCHES", payload: loadRecentSearches() });

    const currentRequestId = ++requestIdRef.current;
    const data = await fetchSearch(query);

    if (currentRequestId === requestIdRef.current) {
      const filtered = filterResults(data.results || data);
      dispatch({ type: "SET_RESULTS", payload: filtered });
    }
  };

  const handleInputChange = async (e) => {
    const val = e.target.value;
    dispatch({ type: "SET_INPUT", payload: val });

    if (isListening) stopListening();

    if (val.trim().length > 0) {
      setShowSuggestions(true);
      setShowRecentDropdown(false);

      const currentRequestId = ++requestIdRef.current;
      const data = await fetchSearch(val);

      if (currentRequestId === requestIdRef.current) {
        const suggestionsList = (data.results || data)
          .filter((item) => item.media_type !== "person")
          .slice(0, 5);
        setSuggestions(suggestionsList);
      }
    } else {
      setShowSuggestions(false);
      setShowRecentDropdown(true);
      dispatch({ type: "HIDE_RESULTS" });
    }

    if (val.trim().length > 1) {
      await performSearch(val);
    } else if (val.trim().length === 0) {
      dispatch({ type: "HIDE_RESULTS" });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setShowSuggestions(false);
      setShowRecentDropdown(false);
      dispatch({ type: "CLEAR" });
      return;
    }

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
          dispatch({ type: "CLEAR" });
        } else if (inputValue.trim()) {
          saveRecentSearch(inputValue);
          dispatch({
            type: "SET_RECENT_SEARCHES",
            payload: loadRecentSearches(),
          });
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    dispatch({ type: "SET_ACTIVE_INDEX", payload: -1 });
  }, [movies]);

  const handleSuggestionClick = (suggestion) => {
    dispatch({
      type: "SET_INPUT",
      payload: suggestion.title || suggestion.name,
    });
    const filtered = filterResults([suggestion]);
    dispatch({ type: "SET_RESULTS", payload: filtered });
    setShowSuggestions(false);
  };

  const handleRecentSelect = async (search) => {
    dispatch({ type: "SET_INPUT", payload: search });
    await performSearch(search);
    setShowRecentDropdown(false);
  };

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full sm:w-105 md:w-125 z-50">
      <form onSubmit={(e) => e.preventDefault()} className="relative">
        <div className="relative flex items-center">
          <FilterDropdown
            filterType={filterType}
            setFilterType={(type) =>
              dispatch({ type: "SET_FILTER_TYPE", payload: type })
            }
          />

          <input
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (inputValue.trim() === "") {
                setShowRecentDropdown(true);
              }
            }}
            onBlur={() => setTimeout(() => setShowRecentDropdown(false), 200)}
            type="text"
            placeholder="Search movies, shows..."
            className="w-full max-w-3xl h-10 pl-12 pr-16 rounded border border-blue-900 bg-transparent text-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          <span className="absolute left-10 text-gray-400">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </span>

          {isListening && (
            <div className="absolute right-24 top-3">
              <VoiceWave active />
            </div>
          )}

          <button
            type="button"
            onClick={() => dispatch({ type: "TOGGLE_FILTERS" })}
            className={`absolute right-12 top-2.5 transition-colors ${
              showFilters
                ? "text-blue-500"
                : "text-gray-400 hover:text-blue-400"
            }`}
            title="Toggle year filter">
            <FontAwesomeIcon icon={showFilters ? faChevronUp : faChevronDown} />
          </button>

          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            disabled={!isSupported}
            className={`absolute right-3 top-2.5 ${
              isListening ? "text-red-500" : "text-gray-400"
            }`}>
            <FontAwesomeIcon icon={faMicrophone} />
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden">
              <div className="flex items-center gap-3 p-2 mt-2 bg-gray-900/80 backdrop-blur rounded border border-gray-700">
                <YearFilter
                  yearFrom={yearFrom}
                  yearTo={yearTo}
                  setYearFrom={(y) =>
                    dispatch({ type: "SET_YEAR_FROM", payload: y })
                  }
                  setYearTo={(y) =>
                    dispatch({ type: "SET_YEAR_TO", payload: y })
                  }
                />
                {(yearFrom || yearTo) && (
                  <button
                    type="button"
                    onClick={() => {
                      dispatch({ type: "SET_YEAR_FROM", payload: "" });
                      dispatch({ type: "SET_YEAR_TO", payload: "" });
                    }}
                    className="text-xs text-gray-500 hover:text-red-400">
                    Clear
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-full max-w-[95vw] sm:max-w-150 bg-gray-900/90 backdrop-blur rounded shadow-xl border border-gray-700 z-40">
              <div className="p-2 text-xs text-gray-500 border-b border-gray-700">
                Suggestions
              </div>
              {suggestions.map((s) => (
                <div
                  key={s.id}
                  onClick={() => handleSuggestionClick(s)}
                  className="flex items-center gap-3 p-3 hover:bg-blue-500/30 cursor-pointer">
                  <img
                    src={
                      s.poster_path
                        ? `https://image.tmdb.org/t/p/w92${s.poster_path}`
                        : "https://via.placeholder.com/45x68?text=No+Img"
                    }
                    alt={s.title || s.name}
                    className="w-8 h-12 object-cover rounded"
                  />
                  <div>
                    <div className="text-sm text-gray-200">
                      {s.title || s.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {s.release_date?.slice(0, 4) ||
                        s.first_air_date?.slice(0, 4) ||
                        "N/A"}{" "}
                      • {s.media_type}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showRecentDropdown &&
            recentSearches.length > 0 &&
            inputValue.trim() === "" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-full max-w-[95vw] sm:max-w-150 bg-gray-900/90 backdrop-blur rounded shadow-xl border border-gray-700 z-40">
                <RecentSearches
                  recentSearches={recentSearches}
                  onSelect={handleRecentSelect}
                  onRemove={(idx) =>
                    dispatch({ type: "REMOVE_RECENT", payload: idx })
                  }
                />
              </motion.div>
            )}
        </AnimatePresence>

        <div aria-live="polite" className="sr-only">
          {isListening ? "Listening for voice input" : "Voice input stopped"}
        </div>
      </form>

      {showResults && (
        <SearchResult
          movies={movies}
          activeIndex={activeIndex}
          setActiveIndex={(i) =>
            dispatch({ type: "SET_ACTIVE_INDEX", payload: i })
          }
          onClose={() => dispatch({ type: "CLEAR" })}
        />
      )}
    </motion.div>
  );
};

export default SearchBox;
