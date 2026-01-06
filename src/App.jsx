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
  {
    path: "/",
    element: <Overview />,
  },
  {
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
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
