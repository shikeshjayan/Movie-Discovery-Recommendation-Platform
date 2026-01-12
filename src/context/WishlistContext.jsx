import { createContext, useContext, useEffect, useState } from "react";

/**
 * WishlistContext
 * --------------------------------------------------
 * Manages wishlist items with localStorage persistence.
 * Supports multiple content types (movie / tv etc).
 */
const WishlistContext = createContext(null);

/**
 * WishlistProvider
 * --------------------------------------------------
 * Provides wishlist state and helper actions
 * to the application.
 */
export const WishlistProvider = ({ children }) => {
  /**
   * Initialize wishlist from localStorage
   * Wrapped in try/catch to avoid JSON parsing crashes
   */
  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem("wishlist");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  /**
   * Persist wishlist to localStorage on every change
   */
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  /**
   * Add item to wishlist
   * - Prevents duplicates based on id + type
   */
  const addToWishlist = (item) => {
    setWishlist((prev) => {
      const exists = prev.some((i) => i.id === item.id && i.type === item.type);
      return exists ? prev : [...prev, item];
    });
  };

  /**
   * Remove item from wishlist using id + type
   */
  const removeFromWishlist = (id, type) => {
    setWishlist((prev) =>
      prev.filter((item) => !(item.id === id && item.type === type))
    );
  };

  /**
   * Check if item already exists in wishlist
   */
  const isInWishlist = (id, type) => {
    return wishlist.some((item) => item.id === id && item.type === type);
  };

  /**
   * Provide wishlist data and actions
   */
  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

/**
 * useWishlist
 * --------------------------------------------------
 * Custom hook to safely consume WishlistContext
 */
export const useWishlist = () => {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }

  return context;
};
