import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Overview from "./pages/Overview";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import NotFound from "./pages/NotFound";
import Tvshows from "./pages/Tvshows";
import MovieCard from "./movies/MovieCard";
import TvShowCard from "./tvshows/TvShowCard";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardOverview from "./dashboard/DashboardOverview";
import Homepage from "./dashboard/Homepage";
import History from "./dashboard/History";
import Wishlist from "./dashboard/Wishlist";
import Myreviews from "./dashboard/Myreviews";
import WatchLater from "./dashboard/WatchLater";

/**
 * React Router v6 Configuration - Recommended Movie Database App
 * ==================================================
 * Production-ready route structure with nested layouts, authentication,
 * and comprehensive 404 handling.
 *
 * Route Hierarchy:
 * ├── /                    → Overview (landing)
 * ├── RootLayout children:
 * │   ├── /home           → Home page
 * │   ├── /movies         → Movies grid
 * │   ├── /tvshows        → TV shows grid
 * │   ├── /signin         → Public auth
 * │   ├── /signup         → Public auth
 * │   └── Protected:
 * │       ├── /movie/:id  → Movie details (auth required)
 * │       └── /tvshow/:id → TV show details (auth required)
 * ├── Dashboard (separate auth):
 * │   └── /dashboard/*
 * └── *                   → Catch-all 404
 */

/**
 * Main Router Configuration
 * - Top-level routes with nested layouts
 * - ProtectedRoute wrappers for auth enforcement
 * - Comprehensive error boundaries
 * - Catch-all 404 at root level
 */
const router = createBrowserRouter([
  /**
   * ROOT LANDING PAGE
   * Public landing page - no layout wrapper
   */
  {
    path: "/",
    element: <Overview />,
  },

  /**
   * MAIN APP LAYOUT - Public + Protected Content
   * Wraps most public pages + movie/tv details with RootLayout
   */
  {
    element: <RootLayout />,
    errorElement: <NotFound />, // Catches errors within this layout
    children: [
      { path: "home", element: <Home /> }, // Main home feed
      { path: "movies", element: <Movies /> }, // Movies discovery
      { path: "tvshows", element: <Tvshows /> }, // TV shows discovery
      { path: "signin", element: <Signin /> }, // Public login
      { path: "signup", element: <Signup /> }, // Public signup

      /**
       * PROTECTED MOVIE/TV DETAIL PAGES
       * Requires authentication via ProtectedRoute wrapper
       */
      {
        element: <ProtectedRoute />,
        children: [
          { path: "movie/:id", element: <MovieCard /> }, // Dynamic movie details
          { path: "tvshow/:id", element: <TvShowCard /> }, // Dynamic TV details
        ],
      },
    ],
  },

  /**
   * DASHBOARD SECTION - Fully Protected
   * Separate auth wrapper (outside RootLayout)
   * User dashboard with nested navigation
   */
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "dashboard",
        element: <DashboardLayout />, // Dashboard-specific layout
        children: [
          { index: true, element: <DashboardOverview /> }, // /dashboard
          { path: "home", element: <Homepage /> }, // /dashboard/home
          { path: "history", element: <History /> }, // /dashboard/history
          { path: "watchlater", element: <WatchLater /> }, // /dashboard/watchlater
          { path: "wishlist", element: <Wishlist /> }, // /dashboard/wishlist
          { path: "myreviews", element: <Myreviews /> }, // /dashboard/myreviews
        ],
      },
    ],
  },

  /**
   * CATCH-ALL 404 ROUTE
   * Handles all unmatched routes app-wide
   * Positioned LAST - critical for proper matching
   */
  {
    path: "*",
    element: <NotFound />,
  },
]);

/**
 * App Component - Router Entry Point
 * Renders RouterProvider with complete route configuration
 */
const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
