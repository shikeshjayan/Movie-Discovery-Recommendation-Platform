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
import MySpace from "./my_profile/MySpace";
// import Wishlist from "./pages/Wishlist";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardOverview from "./dashboard/DashboardOverview";
import Homepage from "./dashboard/Homepage";
import History from "./dashboard/History";
import Wishlist from "./dashboard/Wishlist";
import Myreviews from "./dashboard/Myreviews";
import WatchLater from "./dashboard/WatchLater";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Overview />,
  },
  {
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { path: "home", element: <Home /> },
      { path: "movies", element: <Movies /> },
      { path: "tvshows", element: <Tvshows /> },
      { path: "signin", element: <Signin /> },
      { path: "signup", element: <Signup /> },

      {
        element: <ProtectedRoute />,
        children: [
          { path: "movie/:id", element: <MovieCard /> },
          { path: "tvshow/:id", element: <TvShowCard /> },
          // ✅ Protected Dashboard layout
          {
            path: "dashboard",
            element: <DashboardLayout />,
            errorElement: <NotFound />,
            children: [
              { index: true, element: <DashboardOverview /> },
              { path: "home", element: <Homepage /> },
              { path: "history", element: <History /> },
              { path: "watchlater", element: <WatchLater /> },
              { path: "wishlist", element: <Wishlist /> },
              { path: "myreviews", element: <Myreviews /> },
            ],
          },
        ],
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
