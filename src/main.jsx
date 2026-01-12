import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style/global_style.css";
import App from "./App.jsx";
import ThemeProvider from "./context/ThemeProvider.jsx";
import { HistoryProvider } from "./context/HistoryContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { WatchLaterProvider } from "./context/WatchLaterContext.jsx";

/**
 * React 18 Root Entry Point - Movie Database App
 * ================================================
 * Production-ready context provider hierarchy with StrictMode
 *
 * Provider Stack (Innermost → Outermost):
 * App ← WatchLaterProvider ← WishlistProvider ← HistoryProvider
 *     ← AuthProvider ← ThemeProvider ← StrictMode
 *
 * Context Responsibilities:
 * ├── ThemeProvider     → Dark/Light mode toggle + CSS variables
 * ├── AuthProvider      → Firebase authentication state
 * ├── HistoryProvider   → User watch history tracking
 * ├── WishlistProvider  → User saved movies/TV wishlist
 * └── WatchLaterProvider→ User "watch later" queue
 */

/**
 * Initialize React Application
 * - Mounts to #root DOM element
 * - Applies StrictMode for development warnings
 * - Sequential context provider wrapping
 */
createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/*
     * THEME PROVIDER (Outermost)
     * Controls global dark/light theme switching
     * Applies CSS custom properties to :root
     */}
    <ThemeProvider>
      {/*
       * AUTH PROVIDER (User Session)
       * Manages Firebase authentication state
       * Provides user object + login/logout methods
       * Required for ProtectedRoute components
       */}
      <AuthProvider>
        {/*
         * HISTORY PROVIDER (Watch History)
         * Tracks user viewing history across sessions
         * Persists to localStorage/Firestore
         */}
        <HistoryProvider>
          {/*
           * WISHLIST PROVIDER (Saved Items)
           * Manages user wishlist (movies + TV shows)
           * Syncs with Firestore + localStorage backup
           */}
          <WishlistProvider>
            {/*
             * WATCHLATER PROVIDER (Queue)
             * User "watch later" queue functionality
             * Quick-add from movie/TV detail pages
             */}
            <WatchLaterProvider>
              {/*
               * MAIN APPLICATION ROUTER
               * Contains complete React Router v6 configuration
               * Handles all routing + nested layouts
               */}
              <App />
            </WatchLaterProvider>
          </WishlistProvider>
        </HistoryProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
