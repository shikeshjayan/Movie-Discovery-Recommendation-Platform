import { useEffect, useState } from "react";
import { allMovies, fetchMoviesByGenre } from "../services/tmdbApi";
import { useNavigate } from "react-router-dom";
import Banner from "../movies/Banner";
import GenreBar from "../movies/GenreBar";
import ImageWithLoader from "../ui/ImageWithLoader";
import { useHistory } from "../context/HistoryContext";
import { useAuth } from "../context/AuthContext";
import { useWatchLater } from "../context/WatchLaterContext";

const Movies = () => {
  const { watchLater, addToWatchLater, removeFromWatchLater } = useWatchLater();
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const { addToHistory } = useHistory();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Navigate to movie details and add to history
  const handleMovieClick = (movie) => {
    if (!user) {
      navigate("/signin", {
        state: { from: `/movie/${movie.id}` },
        replace: true,
      });
      return;
    }

    addToHistory({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      type: "movie",
    });

    navigate(`/movie/${movie.id}`);
  };

  // Load all movies
  useEffect(() => {
    allMovies(page).then(setMovies);
  }, [page]);

  const loadTrending = async () => {
    const data = await allMovies();
    setMovies(data);
  };

  // Load movies by genre
  const handleGenreChange = async (id) => {
    if (id === "trending") {
      await loadTrending();
    } else {
      const data = await fetchMoviesByGenre(id);
      setMovies(data);
    }
  };

  return (
    <section className="home-page py-4 flex flex-col gap-4">
      <Banner />
      <GenreBar setGenre={handleGenreChange} />

      <h4 className="popular-movies text-3xl">Movies</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 justify-items-center px-4">
        {movies.slice(0, 16).map((movie) => {
          if (!movie.poster_path) return null;

          const isInWatchLater = watchLater.some((m) => m.id === movie.id);

          return (
            <div
              key={movie.id}
              onClick={() => handleMovieClick(movie)}
              className="cursor-pointer"
            >
              <div className="movie-case relative group">
                <ImageWithLoader
                  src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                  alt={movie.original_title || movie.name}
                  className="w-50 h-75 rounded shadow-md object-cover"
                  onError={(e) => {
                    e.target.src = "/Loader.svg";
                  }}
                />

                {/* Watch Later Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent navigation
                    isInWatchLater
                      ? removeFromWatchLater(movie.id)
                      : addToWatchLater(movie);
                  }}
                  className="absolute top-2 left-2 bg-black text-white px-2 py-1 rounded text-sm
                 opacity-100 lg:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 ease-in-out cursor-pointer"
                >
                  {isInWatchLater ? "Remove" : "Watch Later"}
                </button>

                {/* Rating on hover */}
                <span
                  className="absolute top-2 right-2 bg-yellow-500 text-black font-bold text-sm px-3 py-1 rounded
                    opacity-100 lg:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"
                >
                  ★ {movie.vote_average?.toFixed(1) ?? "N/A"}
                </span>

                <h5 className="w-50 px-2 text-center mt-2 truncate">
                  {movie.name || movie.title}
                </h5>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="w-full flex justify-center">
        <div className="flex gap-1">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className={`${
              page === 1 ? "opacity-20" : "btn"
            } w-24 border p-2 cursor-pointer`}
          >
            Prev
          </button>

          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="w-24 border p-2 cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default Movies;
