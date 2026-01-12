import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./layouts/RootLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

import Signin from "./components/Signin";
import Signup from "./components/Signup";
import NotFound from "./pages/NotFound";

/* --------------------------------------------------
   ROUTER CONFIG (React Router v6.4+)
-------------------------------------------------- */

const router = createBrowserRouter([
  /* -------- LANDING PAGE -------- */
  {
    path: "/",
    lazy: async () => {
      const { default: Overview } = await import("./pages/Overview");
      return { Component: Overview };
    },
  },

  /* -------- MAIN APP LAYOUT -------- */
  {
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "home",
        lazy: async () => {
          const { default: Home } = await import("./pages/Home");
          return { Component: Home };
        },
      },
      {
        path: "movies",
        lazy: async () => {
          const { default: Movies } = await import("./pages/Movies");
          return { Component: Movies };
        },
      },
      {
        path: "tvshows",
        lazy: async () => {
          const { default: Tvshows } = await import("./pages/Tvshows");
          return { Component: Tvshows };
        },
      },

      /* -------- AUTH (PUBLIC) -------- */
      { path: "signin", element: <Signin /> },
      { path: "signup", element: <Signup /> },

      /* -------- PROTECTED MOVIE / TV DETAILS -------- */
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "movie/:id",
            lazy: async () => {
              const { default: MovieCard } = await import("./movies/MovieCard");
              return { Component: MovieCard };
            },
          },
          {
            path: "tvshow/:id",
            lazy: async () => {
              const { default: TvShowCard } = await import(
                "./tvshows/TvShowCard"
              );
              return { Component: TvShowCard };
            },
          },
        ],
      },
    ],
  },

  /* -------- DASHBOARD (FULLY PROTECTED) -------- */
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            lazy: async () => {
              const { default: DashboardOverview } = await import(
                "./dashboard/DashboardOverview"
              );
              return { Component: DashboardOverview };
            },
          },
          {
            path: "home",
            lazy: async () => {
              const { default: Homepage } = await import(
                "./dashboard/Homepage"
              );
              return { Component: Homepage };
            },
          },
          {
            path: "history",
            lazy: async () => {
              const { default: History } = await import("./dashboard/History");
              return { Component: History };
            },
          },
          {
            path: "watchlater",
            lazy: async () => {
              const { default: WatchLater } = await import(
                "./dashboard/WatchLater"
              );
              return { Component: WatchLater };
            },
          },
          {
            path: "wishlist",
            lazy: async () => {
              const { default: Wishlist } = await import(
                "./dashboard/Wishlist"
              );
              return { Component: Wishlist };
            },
          },
          {
            path: "myreviews",
            lazy: async () => {
              const { default: Myreviews } = await import(
                "./dashboard/Myreviews"
              );
              return { Component: Myreviews };
            },
          },
        ],
      },
    ],
  },

  /* -------- GLOBAL 404 -------- */
  {
    path: "*",
    element: <NotFound />,
  },
]);

/* -------- APP ENTRY -------- */
const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
