import { createContext, useContext, useEffect, useState } from "react";

/**
 * HistoryContext
 * --------------------------------------------------
 * Manages recently viewed items (watch/view history)
 * using localStorage for persistence.
 */
const HistoryContext = createContext(null);

/**
 * HistoryProvider
 * --------------------------------------------------
 * Wraps the app and provides history state & actions
 * to child components.
 */
export const HistoryProvider = ({ children }) => {
  /**
   * Initialize history from localStorage (lazy init)
   */
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem("viewHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  /**
   * Add item to history
   * - Prevents duplicates
   * - Moves existing item to top
   * - Limits history to last 10 items
   */
  const addToHistory = (item) => {
    setHistory((prev) => {
      const filtered = prev.filter((i) => i.id !== item.id);
      return [item, ...filtered].slice(0, 10);
    });
  };

  /**
   * Remove a single item from history by ID
   */
  const removeFromHistory = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  /**
   * Clear entire history
   */
  const clearHistory = () => {
    setHistory([]);
  };

  /**
   * Persist history to localStorage on change
   */
  useEffect(() => {
    localStorage.setItem("viewHistory", JSON.stringify(history));
  }, [history]);

  /**
   * Provide history data and actions to consumers
   */
  return (
    <HistoryContext.Provider
      value={{
        history,
        addToHistory,
        removeFromHistory,
        clearHistory,
        historyCount: history.length,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

/**
 * useHistory
 * --------------------------------------------------
 * Custom hook for accessing history context
 */
export const useHistory = () => useContext(HistoryContext);
