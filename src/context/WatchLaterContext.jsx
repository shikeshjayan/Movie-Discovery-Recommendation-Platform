import { createContext, useContext, useEffect, useState } from "react";

/**
 * WatchLaterContext
 * --------------------------------------------------
 * Manages "Watch Later" movie list with persistence.
 */
const WatchLaterContext = createContext(null);

/**
 * WatchLaterProvider
 * --------------------------------------------------
 * Provides watch-later state and actions to the app.
 */
export const WatchLaterProvider = ({ children }) => {
  /**
   * Initialize watch-later list from localStorage
   */
  const [watchLater, setWatchLater] = useState(() => {
    const saved = localStorage.getItem("watchLater");
    return saved ? JSON.parse(saved) : [];
  });

  /**
   * Persist watch-later list on every change
   */
  useEffect(() => {
    localStorage.setItem("watchLater", JSON.stringify(watchLater));
  }, [watchLater]);

  /**
   * Add a movie to Watch Later
   * - Prevents duplicates
   */
  const addToWatchLater = (movie) => {
    setWatchLater((prev) => {
      if (prev.some((m) => m.id === movie.id)) return prev;
      return [...prev, movie];
    });
  };

  /**
   * Remove a single movie by ID
   */
  const removeFromWatchLater = (id) => {
    setWatchLater((prev) => prev.filter((m) => m.id !== id));
  };

  /**
   * Clear entire Watch Later list
   */
  const clearWatchLater = () => {
    setWatchLater([]);
  };

  /**
   * Provide watch-later data and actions
   */
  return (
    <WatchLaterContext.Provider
      value={{
        watchLater,
        addToWatchLater,
        removeFromWatchLater,
        clearWatchLater,
        watchLaterCount: watchLater.length,
      }}
    >
      {children}
    </WatchLaterContext.Provider>
  );
};

/**
 * useWatchLater
 * --------------------------------------------------
 * Custom hook to access Watch Later context
 */
export const useWatchLater = () => useContext(WatchLaterContext);
