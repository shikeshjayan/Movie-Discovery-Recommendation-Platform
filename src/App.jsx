import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Overview from "./pages/Overview";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import NotFound from "./pages/NotFound";
import Tvshows from "./pages/Tvshows";
import MovieCard from "./movies/MovieCard";
import TvShowCard from "./tvshows/TvShowCard"

const router = createBrowserRouter([
  // 1. Landing Page (The start page at '/')
  {
    path: "/",
    element: <Overview />,
  },

  // 2. Main App Layout (Pathless Route)
  // Removing the 'path' prop allows this layout to wrap child routes
  // like /movies and /home without adding a prefix to the URL.
  {
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      // Move Home to "/home" so it doesn't conflict with Overview at "/"
      {
        path: "home",
        element: <Home />,
      },
      { path: "movies", element: <Movies /> },
      { path: "movie/:id", element: <MovieCard /> },
      { path: "tvshows", element: <Tvshows /> },
      { path: "tvshow/:id", element: <TvShowCard /> },
    ],
  },
]);

const app = () => {
  return <RouterProvider router={router} />;
};

export default app;
