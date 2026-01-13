import { useEffect, useRef, useReducer } from "react";
import { motion } from "framer-motion";
import { fetchSearch } from "../../services/tmdbApi";
import SearchResult from "./SearchResult";
import { useVoiceSearch } from "../../hooks/useVoiceSearch";
import {
  faMagnifyingGlass,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/* -------------------- Reducer -------------------- */

// Initial state for the search feature
const initialState = {
  inputValue: "",
  movies: [],
  activeIndex: -1, // Tracks which result is highlighted via keyboard
  showResults: false,
};

// Reducer handles all state transitions for predictable updates
function reducer(state, action) {
  switch (action.type) {
    case "SET_INPUT":
      return { ...state, inputValue: action.payload };

    case "SET_RESULTS":
      return {
        ...state,
        movies: action.payload,
        showResults: true,
        activeIndex: -1, // Reset selection when new results arrive
      };

    case "SET_ACTIVE_INDEX":
      return { ...state, activeIndex: action.payload };

    case "CLEAR":
      return initialState; // Reset everything to default

    case "HIDE_RESULTS":
      return { ...state, movies: [], showResults: false, activeIndex: -1 };

    default:
      return state;
  }
}

/* -------------------- Voice Wave Animation -------------------- */

// Visual feedback component for voice input
// Renders 3 bars that animate height when 'active' prop is true
const VoiceWave = ({ active }) => (
  <div className="flex gap-1 items-end h-4">
    {[1, 2, 3].map((i) => (
      <motion.span
        key={i}
        // Animate between heights to simulate a sound wave
        animate={
          active ? { height: ["20%", "100%", "30%"] } : { height: "20%" }
        }
        transition={{
          repeat: active ? Infinity : 0, // Loop animation while active
          duration: 0.6,
          ease: "easeInOut",
          delay: i * 0.1, // Stagger animation for wave effect
        }}
        className="w-1 bg-red-500 rounded"
      />
    ))}
  </div>
);

/* -------------------- Main Component -------------------- */

const SearchBox = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { inputValue, movies, activeIndex, showResults } = state;

  // Ref to track the latest API request ID
  // Used to prevent "race conditions" (older slow requests overwriting newer ones)
  const requestIdRef = useRef(0);

  /* ---------- Voice Search Hook ---------- */

  const { isListening, isSupported, startListening, stopListening } =
    useVoiceSearch({
      // Updates input as you speak (real-time feedback)
      onResult: (text) => {
        dispatch({ type: "SET_INPUT", payload: text });
      },
      // Triggers search only when you stop speaking
      onFinalResult: async (text) => {
        dispatch({ type: "SET_INPUT", payload: text });
        const data = await fetchSearch(text);
        dispatch({
          type: "SET_RESULTS",
          payload: data.results || data,
        });
      },
      silenceTimeout: 2000, // Stop listening after 2s of silence
    });

  /* ---------- Input Change Handler ---------- */

  const handleInputChange = async (e) => {
    // If user starts typing manually, stop voice recognition to avoid conflict
    if (isListening) stopListening();

    const val = e.target.value;
    dispatch({ type: "SET_INPUT", payload: val });

    // Only search if input has 2 or more characters
    if (val.trim().length > 1) {
      // Increment request ID for this specific search attempt
      const currentRequestId = ++requestIdRef.current;

      const data = await fetchSearch(val);

      // RACE CONDITION CHECK:
      // Only update state if this response matches the LATEST request.
      // If the user typed more while this fetch was happening, requestIdRef.current
      // would have incremented, and this block will be skipped.
      if (currentRequestId === requestIdRef.current) {
        dispatch({
          type: "SET_RESULTS",
          payload: data.results || data,
        });
      }
    } else {
      // Clear results if input is too short
      dispatch({ type: "HIDE_RESULTS" });
    }
  };

  /* ---------- Keyboard Navigation ---------- */

  const handleKeyDown = (e) => {
    // Ignore keys if results aren't visible
    if (!showResults || movies.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault(); // Prevent cursor moving in input
        dispatch({
          type: "SET_ACTIVE_INDEX",
          // Loop back to top if at bottom, otherwise go down
          payload: activeIndex < movies.length - 1 ? activeIndex + 1 : 0,
        });
        break;

      case "ArrowUp":
        e.preventDefault();
        dispatch({
          type: "SET_ACTIVE_INDEX",
          // Loop to bottom if at top, otherwise go up
          payload: activeIndex > 0 ? activeIndex - 1 : movies.length - 1,
        });
        break;

      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0) {
          const item = movies[activeIndex];
          // Navigate based on media type
          const route =
            item.media_type === "tv"
              ? `/tvshow/${item.id}`
              : `/movie/${item.id}`;
          window.location.href = route;
          dispatch({ type: "CLEAR" });
        }
        break;

      case "Escape":
        dispatch({ type: "CLEAR" });
        break;

      default:
        break;
    }
  };

  // Reset keyboard selection whenever the movie list changes
  useEffect(() => {
    dispatch({ type: "SET_ACTIVE_INDEX", payload: -1 });
  }, [movies]);

  /* -------------------- JSX Render -------------------- */

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full sm:w-105 md:w-125 z-50"
    >
      <form onSubmit={(e) => e.preventDefault()} className="relative">
        <input
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          type="text"
          placeholder="Search movies, shows..."
          className="w-full max-w-3xl h-10 pl-10 pr-16 rounded border border-blue-900 bg-transparent text-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        {/* Static Search Icon */}
        <span className="absolute left-3 top-2.5 text-gray-400">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </span>

        {/* Dynamic Voice Wave Animation (only shows when listening) */}
        {isListening && (
          <div className="absolute right-12 top-3">
            <VoiceWave active />
          </div>
        )}

        {/* Microphone Toggle Button */}
        <button
          type="button"
          onClick={isListening ? stopListening : startListening}
          disabled={!isSupported}
          aria-label={isListening ? "Stop voice search" : "Start voice search"}
          aria-pressed={isListening}
          role="switch"
          className={`absolute right-3 top-2.5 ${
            isListening ? "text-red-500" : "text-gray-400"
          }`}
        >
          <FontAwesomeIcon icon={faMicrophone} />
        </button>

        {/* Hidden status for screen readers (Accessibility) */}
        <div aria-live="polite" className="sr-only">
          {isListening ? "Listening for voice input" : "Voice input stopped"}
        </div>
      </form>

      {/* Results Dropdown */}
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
