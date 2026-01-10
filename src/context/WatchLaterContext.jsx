import { createContext, useContext, useState, useEffect } from "react";

const WatchLaterContext = createContext();

export const WatchLaterProvider = ({ children }) => {
  // Load from localStorage on initial render
  const [watchLater, setWatchLater] = useState(() => {
    const saved = localStorage.getItem("watchLater");
    return saved ? JSON.parse(saved) : [];
  });

  // Persist to localStorage whenever watchLater changes
  useEffect(() => {
    localStorage.setItem("watchLater", JSON.stringify(watchLater));
  }, [watchLater]);

  // Add movie to Watch Later
  const addToWatchLater = (movie) => {
    setWatchLater((prev) => {
      if (prev.find((m) => m.id === movie.id)) return prev; // avoid duplicates
      return [...prev, movie];
    });
  };

  // Remove single movie
  const removeFromWatchLater = (id) => {
    setWatchLater((prev) => prev.filter((m) => m.id !== id));
  };

  // Remove all movies
  const clearWatchLater = () => setWatchLater([]);

  return (
    <WatchLaterContext.Provider
      value={{
        watchLater,
        addToWatchLater,
        removeFromWatchLater,
        clearWatchLater,
        setWatchLater,
        watchLaterCount: watchLater.length,
      }}
    >
      {children}
    </WatchLaterContext.Provider>
  );
};

export const useWatchLater = () => useContext(WatchLaterContext);
